import express from "express";
import { getTotalUsers } from "../controllers/userController";
import { protect, authorize } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/count", protect, authorize(["admin"]), getTotalUsers); // GET /api/users/count

export default router;
