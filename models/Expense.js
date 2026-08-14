import { Schema, model, models } from "mongoose";

export const CATEGORIES = [
  "Housing & Utilities",
  "Transportation",
  "Food & Groceries",
  "Insurance & Healthcare",
  "Savings & Debt",
  "Personal & Entertainment",
  "Other",
];

const ExpenseSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true, 
    index: true
 },

  productName: {
    type: String,
    required: true,
    trim: true
 },

  category: { 
    type: String,
    enum: CATEGORIES,
    required: true
 },

  customCategory: {  // set only when category = "Other"
    type: String,
    trim: true 
}, 

  price: { 
    type: Number,
    required: true, 
    min: 0 
},

  remarks: {
     type: String, 
     trim: true
},

  createdAt: {
    type: Date,
    default: Date.now, 
    index: true 
},
});

// Used by the cleanup cron — not a Mongo TTL index, since "3 months old"
// is relative to run time, not a fixed per-document expiry.
ExpenseSchema.index({ userId: 1, createdAt: -1 });
ExpenseSchema.index({ userId: 1, category: 1 });

export const Expense = models.Expense || model("Expense", ExpenseSchema);