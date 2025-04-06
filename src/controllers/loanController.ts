import { Request, Response } from "express";
import Loan from "../models/Loan";
import { IUser } from "../models/User";
import asyncHandler from "../utils/asyncHandler";

// Extend Express Request to include our user type
interface AuthenticatedRequest extends Request {
  user?: IUser;
}

// Type guard: check if loan.user is populated
function isPopulatedUser(user: any): user is IUser {
  return user && typeof user === "object" && "role" in user && "email" in user;
}

// @desc    Apply for a new loan
// @route   POST /api/loans
// @access  Private (User)
export const applyForLoan = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { amount, interestRate, tenure } = req.body;

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const loan = new Loan({
      user: req.user._id,
      amount,
      interestRate,
      tenure,
    });

    const createdLoan = await loan.save();
    res.status(201).json(createdLoan);
  }
);

// @desc    Get all loans
// @route   GET /api/loans
// @access  Private (Admin or Verifier)
export const getLoans = asyncHandler(
  async (_req: AuthenticatedRequest, res: Response) => {
    const loans = await Loan.find().populate("user", "name email");
    res.json(loans);
  }
);

// @desc    Get loan by ID
// @route   GET /api/loans/:id
// @access  Private (Admin, Verifier, or Owner)
export const getLoanById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const loan = await Loan.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!loan) return res.status(404).json({ message: "Loan not found" });
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const requestingUser = req.user;
    const loanUser = loan.user;

    if (
      requestingUser.role === "admin" ||
      requestingUser.role === "verifier" ||
      (isPopulatedUser(loanUser) &&
        loanUser._id.toString() === requestingUser._id.toString())
    ) {
      res.json(loan);
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  }
);

// @desc    Update loan status
// @route   PUT /api/loans/:id/status
// @access  Private (Admin or Verifier)
export const updateLoanStatus = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { status } = req.body;

    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    const user = req.user!;
    if (user.role === "admin" || user.role === "verifier") {
      loan.status = status;

      const updatedLoan = await loan.save();
      return res.json(updatedLoan);
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
  }
);
