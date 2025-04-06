import express from "express";
import {
  applyForLoan,
  getLoans,
  getLoanById,
  updateLoanStatus,
} from "../controllers/loanController";
import { protect, authorize } from "../middleware/authMiddleware";

const router = express.Router();

// Apply for a new loan (Any authenticated user)
router.post("/", protect, authorize(["user"]), applyForLoan);

// Get all loans (Admin only)
router.get("/", protect, getLoans);

// Get a single loan by ID (User, Verifier, or Admin)
router.get(
  "/:id",
  protect,
  authorize(["user", "verifier", "admin"]),
  getLoanById
);

// Update loan status
// - Admin: approve/reject
// - Verifier: verify/reject
router.put(
  "/:id/status",
  protect,
  authorize(["admin", "verifier"]),
  updateLoanStatus
);

export default router;
