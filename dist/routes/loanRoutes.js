"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const loanController_1 = require("../controllers/loanController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Apply for a new loan (Any authenticated user)
router.post("/", authMiddleware_1.protect, (0, authMiddleware_1.authorize)(["user"]), loanController_1.applyForLoan);
// Get all loans (Admin only)
router.get("/", authMiddleware_1.protect, loanController_1.getLoans);
// Get a single loan by ID (User, Verifier, or Admin)
router.get("/:id", authMiddleware_1.protect, (0, authMiddleware_1.authorize)(["user", "verifier", "admin"]), loanController_1.getLoanById);
// Update loan status
// - Admin: approve/reject
// - Verifier: verify/reject
router.put("/:id/status", authMiddleware_1.protect, (0, authMiddleware_1.authorize)(["admin", "verifier"]), loanController_1.updateLoanStatus);
exports.default = router;
