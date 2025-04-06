import mongoose, { Document, Schema } from "mongoose";

export interface ILoan extends Document {
  user: mongoose.Types.ObjectId;
  amount: number;
  interestRate: number;
  tenure: number;
  status: "NEW" | "APPROVED" | "REJECTED";
  createdAt: Date;
  updatedAt: Date;
}

const LoanSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    interestRate: {
      type: Number,
      required: true,
    },
    tenure: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["NEW", "APPROVED", "REJECTED", "PENDING", "verified"],
      default: "NEW",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ILoan>("Loan", LoanSchema);
