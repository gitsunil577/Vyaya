import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models/Expense";
import { User } from "@/models/User";
import { getSession } from "@/lib/auth";
import { expenseSchema } from "@/lib/validation";

export async function GET() {
  const session = await getSession();
  if (!session || !session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const userId = session.userId;
  const user = await User.findById(userId);

  // Fetch all expenses for this user (sorted by date descending)
  const expenses = await Expense.find({ userId }).sort({ createdAt: -1 });

  // Compute stats: Category-wise spends
  const categorySpends = {};
  let totalSpend = 0;

  expenses.forEach((exp) => {
    const categoryName = exp.category === "Other" && exp.customCategory ? exp.customCategory : exp.category;
    categorySpends[categoryName] = (categorySpends[categoryName] || 0) + exp.price;
    totalSpend += exp.price;
  });

  // Convert category spends to array format
  const categoryWise = Object.entries(categorySpends).map(([category, amount]) => ({
    category,
    amount,
  }));

  // Compute stats: Current month vs previous month spend
  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  let currentMonthTotal = 0;
  let previousMonthTotal = 0;

  expenses.forEach((exp) => {
    const createdDate = new Date(exp.createdAt);
    if (createdDate >= startOfCurrentMonth) {
      currentMonthTotal += exp.price;
    } else if (createdDate >= startOfPreviousMonth && createdDate <= endOfPreviousMonth) {
      previousMonthTotal += exp.price;
    }
  });

  // Calculate some insights
  const avgTransaction = expenses.length > 0 ? totalSpend / expenses.length : 0;
  const transactionCount = expenses.length;
  
  // Find highest category
  let maxCategory = "None";
  let maxCategoryAmount = 0;
  categoryWise.forEach((item) => {
    if (item.amount > maxCategoryAmount) {
      maxCategoryAmount = item.amount;
      maxCategory = item.category;
    }
  });

  return NextResponse.json({
    username: user ? user.username : "User",
    expenses,
    stats: {
      totalSpend,
      avgTransaction,
      transactionCount,
      categoryWise,
      currentMonthTotal,
      previousMonthTotal,
      maxCategory,
    },
  });
}

export async function POST(req) {
  const session = await getSession();
  if (!session || !session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = expenseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  await connectDB();

  const { productName, category, customCategory, price, remarks } = parsed.data;

  const expense = await Expense.create({
    userId: session.userId,
    productName,
    category,
    customCategory: category === "Other" ? customCategory : undefined,
    price,
    remarks,
  });

  return NextResponse.json(expense, { status: 201 });
}
