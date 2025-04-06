"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLoanStatus = exports.getLoanById = exports.getLoans = exports.applyForLoan = void 0;
const Loan_1 = __importDefault(require("../models/Loan"));
// @desc    Apply for a new loan
// @route   POST /api/loans
// @access  Private (User)
const applyForLoan = async (req, res) => {
    const { amount, interestRate, tenure } = req.body;
    try {
        const loan = new Loan_1.default({
            user: req.user._id,
            amount,
            interestRate,
            tenure,
        });
        const createdLoan = await loan.save();
        res.status(201).json(createdLoan);
    }
    catch (error) {
        res.status(400).json({ message: "Invalid loan data" });
    }
};
exports.applyForLoan = applyForLoan;
// @desc    Get all loans
// @route   GET /api/loans
// @access  Private (Admin or Verifier)
const getLoans = async (req, res) => {
    try {
        const loans = await Loan_1.default.find().populate("user", "name email");
        res.json(loans);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.getLoans = getLoans;
// @desc    Get loan by ID
// @route   GET /api/loans/:id
// @access  Private (Admin, Verifier, or Owner)
const getLoanById = async (req, res) => {
    try {
        const loan = await Loan_1.default.findById(req.params.id).populate("user", "name email");
        if (!loan)
            return res.status(404).json({ message: "Loan not found" });
        // Allow access if admin, verifier, or the loan belongs to the user
        if (req.user.role === "admin" ||
            req.user.role === "verifier" ||
            loan.user._id.equals(req.user._id)) {
            res.json(loan);
        }
        else {
            res.status(403).json({ message: "Access denied" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.getLoanById = getLoanById;
// @desc    Update loan status
// @route   PUT /api/loans/:id/status
// @access  Private (Admin or Verifier)
const updateLoanStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const loan = await Loan_1.default.findById(req.params.id);
        if (!loan)
            return res.status(404).json({ message: "Loan not found" });
        // Only allow admins and verifiers to update status
        if (req.user.role === "admin" || req.user.role === "verifier") {
            loan.status = status;
            console.log("coming...");
            try {
                const updatedLoan = await loan.save();
                return res.json(updatedLoan); // ✅ only respond once here
            }
            catch (error) {
                console.error(`Error updating loan status for ID ${req.params.id}:`, error);
                return res.status(500).json({
                    message: "Internal Server Error",
                    error: error,
                });
            }
        }
        else {
            return res.status(403).json({ message: "Access denied" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};
exports.updateLoanStatus = updateLoanStatus;
