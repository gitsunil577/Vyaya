import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { loginSchema } from "@/lib/validation";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(req) {
  const body = await req.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }
  const { username, password } = parsed.data;

  await connectDB();

  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  await createSession(user._id.toString());
  return NextResponse.json({ username: user.username });
}