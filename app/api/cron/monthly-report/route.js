import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Expense } from "@/models/Expense";
import { sendMail } from "@/lib/mailer";
import { getSpendingInsight } from "@/lib/ai";
import { generateExpensePdf, pdfPasswordFor } from "@/lib/pdf";
import { isValidCronRequest } from "@/lib/cronAuth";

function getMonthBounds(offsetMonths = 0) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offsetMonths, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offsetMonths + 1, 1);
  return { start, end };
}

function formatINR(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

export async function POST(req) {
  if (!isValidCronRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const { start: startOfLastMonth, end: startOfThisMonth } = getMonthBounds(-1);
  const monthLabel = startOfLastMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const users = await User.find({});
  let sent = 0;
  const errors = [];

  for (const user of users) {
    try {
      const expenses = await Expense.find({
        userId: user._id,
        createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth },
      }).sort({ createdAt: 1 });

      if (expenses.length === 0) continue;

      const total = expenses.reduce((sum, e) => sum + e.price, 0);

      const categoryTotals = {};
      for (const e of expenses) {
        const label = e.category === "Other" ? e.customCategory || "Other" : e.category;
        categoryTotals[label] = (categoryTotals[label] || 0) + e.price;
      }
      const categoryBreakdown = Object.entries(categoryTotals).map(
        ([category, amount]) => ({ category, amount })
      );

      // last 3 months of totals, for trend context in the AI insight
      const threeMonthsAgo = new Date(startOfThisMonth);
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      const recent = await Expense.aggregate([
        { $match: { userId: user._id, createdAt: { $gte: threeMonthsAgo } } },
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            total: { $sum: "$price" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);

      const insight = await getSpendingInsight({
        total,
        categoryBreakdown,
        previousMonths: recent.map((r) => r.total),
      });

      const pdfBuffer = await generateExpensePdf({
        username: user.username,
        monthLabel,
        total,
        categoryBreakdown,
        expenses,
      });

      const categoryListHtml = categoryBreakdown
        .sort((a, b) => b.amount - a.amount)
        .map((c) => `<li>${c.category}: ${formatINR(c.amount)}</li>`)
        .join("");

      await sendMail({
        to: user.email,
        subject: `Your ${monthLabel} ledger, closed out`,
        html: `
          <p>Total spend: <strong>${formatINR(total)}</strong></p>
          <ul>${categoryListHtml}</ul>
          ${insight ? `<p>${insight}</p>` : ""}
          <p style="color:#888;font-size:12px;">
            The attached PDF is password protected. Open it with your
            username followed by the number of letters in it
            (for example, "${user.username}" has
            ${user.username.length} letters, so the password is
            "${pdfPasswordFor(user.username)}").
          </p>
        `,
        attachments: [
          {
            filename: `vyaya-${monthLabel.replace(" ", "-").toLowerCase()}.pdf`,
            content: pdfBuffer,
          },
        ],
      });

      sent++;
    } catch (err) {
      errors.push({ userId: user._id.toString(), message: err.message });
    }
  }

  return NextResponse.json({ sent, errors });
}
