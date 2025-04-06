import { Request, Response } from "express";
import User from "../models/User";

// @desc    Get all users
// @route   GET /api/users/count
// @access  Private (Admin)
export const getTotalUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users); // Return array of users
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
