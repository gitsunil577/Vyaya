import { z } from "zod";
import { CATEGORIES } from "@/models/Expense";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().email(),
  password: z
    .string()
    .min(4, "At least 4 characters")
    .regex(/[A-Z]/, "Needs an uppercase letter")
    .regex(/[a-z]/, "Needs a lowercase letter")
    .regex(/[0-9]/, "Needs a number"),
});

export const loginSchema = z.object({
  username: z.string().trim().min(3, {message:"Username atleast 3 character"} ),
  password: z.string().min(4, {message:"Password atleast 4 character"}),
});

export const expenseSchema = z
  .object({
    productName: z.string().trim().min(1),
    category: z.enum(CATEGORIES),
    customCategory: z.string().trim().optional(),
    price: z.number().positive(),
    remarks: z.string().trim().optional(),
  })
  .refine(
    (data) => data.category !== "Other" || !!data.customCategory?.length,
    { message: "Enter a category name", path: ["customCategory"] }
  );