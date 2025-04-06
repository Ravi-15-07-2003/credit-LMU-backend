import { Request, Response } from "express";
import User from "../models/User";
import asyncHandler from "../utils/asyncHandler";

// Promote user step-by-step (user → verifier → admin)
export const promoteToAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "user") {
      user.role = "verifier";
    } else if (user.role === "verifier") {
      user.role = "admin";
    } else {
      return res.status(400).json({ message: "User is already an admin" });
    }

    await user.save();
    res.json({ message: `User promoted to ${user.role} successfully.` });
  }
);

// Demote admin step-by-step (admin → verifier → user)
export const demoteToUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin") {
      user.role = "verifier";
    } else if (user.role === "verifier") {
      user.role = "user";
    } else {
      return res
        .status(400)
        .json({ message: "User is already at the lowest role" });
    }

    await user.save();
    res.json({ message: `User demoted to ${user.role} successfully.` });
  }
);

// Delete an admin
export const deleteAdmin = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Uncomment this if you want to restrict delete to only admin users
  // if (user.role !== "admin") {
  //   return res.status(400).json({ message: "User is not an admin" });
  // }

  await user.deleteOne();
  res.json({ message: "Admin deleted successfully" });
});
