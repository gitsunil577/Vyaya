import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models/Expense";
import { isValidCronRequest } from "@/lib/cronAuth";

export async function POST(req) {
  if (!isValidCronRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const result = await Expense.deleteMany({ createdAt: { $lt: threeMonthsAgo } });
  return NextResponse.json({ deletedCount: result.deletedCount });
}
