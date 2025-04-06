"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLoanStatus = exports.getLoanById = exports.getLoans = exports.applyForLoan = void 0;
const Loan_1 = __importDefault(require("../models/Loan"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
// Type guard: check if loan.user is populated
function isPopulatedUser(user) {
    return user && typeof user === "object" && "role" in user && "email" in user;
}
// @desc    Apply for a new loan
// @route   POST /api/loans
// @access  Private (User)
exports.applyForLoan = (0, asyncHandler_1.default)(async (req, res) => {
    const { amount, interestRate, tenure } = req.body;
    if (!req.user)
        return res.status(401).json({ message: "Unauthorized" });
    const loan = new Loan_1.default({
        user: req.user._id,
        amount,
        interestRate,
        tenure,
    });
    const createdLoan = await loan.save();
    res.status(201).json(createdLoan);
});
// @desc    Get all loans
// @route   GET /api/loans
// @access  Private (Admin or Verifier)
exports.getLoans = (0, asyncHandler_1.default)(async (_req, res) => {
    const loans = await Loan_1.default.find().populate("user", "name email");
    res.json(loans);
});
// @desc    Get loan by ID
// @route   GET /api/loans/:id
// @access  Private (Admin, Verifier, or Owner)
exports.getLoanById = (0, asyncHandler_1.default)(async (req, res) => {
    const loan = await Loan_1.default.findById(req.params.id).populate("user", "name email");
    if (!loan)
        return res.status(404).json({ message: "Loan not found" });
    if (!req.user)
        return res.status(401).json({ message: "Unauthorized" });
    const requestingUser = req.user;
    const loanUser = loan.user;
    if (requestingUser.role === "admin" ||
        requestingUser.role === "verifier" ||
        (isPopulatedUser(loanUser) &&
            loanUser._id.toString() === requestingUser._id.toString())) {
        res.json(loan);
    }
    else {
        res.status(403).json({ message: "Access denied" });
    }
});
// @desc    Update loan status
// @route   PUT /api/loans/:id/status
// @access  Private (Admin or Verifier)
exports.updateLoanStatus = (0, asyncHandler_1.default)(async (req, res) => {
    const { status } = req.body;
    const loan = await Loan_1.default.findById(req.params.id);
    if (!loan)
        return res.status(404).json({ message: "Loan not found" });
    const user = req.user;
    if (user.role === "admin" || user.role === "verifier") {
        loan.status = status;
        const updatedLoan = await loan.save();
        return res.json(updatedLoan);
    }
    else {
        return res.status(403).json({ message: "Access denied" });
    }
});
