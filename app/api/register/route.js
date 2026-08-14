import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { registerSchema } from "@/lib/validation";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(req) {
  try {
    // 1. Read and validate the request body INSIDE the function
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    
    // 2. Add a quick check in case validation fails (Zod safeParse returns success boolean)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    const { name, email, password } = parsed.data;
    const username = name.trim().split(/\s+/)[0].toLowerCase();

    // 3. Connect to the database
    await connectDB();

    // 4. Check for existing users
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return NextResponse.json(
        { error: "Username or email already taken" },
        { status: 409 }
      );
    }

    // 5. Create the new user and session
    const passwordHash = await hashPassword(password);
    const user = await User.create({ name, username, email, passwordHash });
    await createSession(user._id.toString());

    // 6. Return success
    return NextResponse.json({ username }, { status: 201 });

  } catch (err) {
    // Safely extract the error message without modifying the read-only error object
    const errorMessage = err?.message || "An unexpected error occurred during registration.";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}