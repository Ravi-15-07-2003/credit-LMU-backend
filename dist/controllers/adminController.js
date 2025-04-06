"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdmin = exports.demoteToUser = exports.promoteToAdmin = void 0;
const User_1 = __importDefault(require("../models/User"));
// Promote a user to admin
// Promote user step-by-step (user → verifier → admin)
const promoteToAdmin = async (req, res) => {
    const user = await User_1.default.findById(req.params.id);
    if (!user)
        return res.status(404).json({ message: "User not found" });
    if (user.role === "user") {
        user.role = "verifier";
    }
    else if (user.role === "verifier") {
        user.role = "admin";
    }
    else {
        return res.status(400).json({ message: "User is already an admin" });
    }
    await user.save();
    res.json({ message: `User promoted to ${user.role} successfully.` });
};
exports.promoteToAdmin = promoteToAdmin;
// Demote admin step-by-step (admin → verifier → user)
const demoteToUser = async (req, res) => {
    const user = await User_1.default.findById(req.params.id);
    if (!user)
        return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") {
        user.role = "verifier";
    }
    else if (user.role === "verifier") {
        user.role = "user";
    }
    else {
        return res.status(400).json({ message: "User is already at the lowest role" });
    }
    await user.save();
    res.json({ message: `User demoted to ${user.role} successfully.` });
};
exports.demoteToUser = demoteToUser;
const deleteAdmin = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // if (user.role !== "admin") {
        //   return res.status(400).json({ message: "User is not an admin" });
        // }
        await user.deleteOne();
        res.json({ message: "Admin deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting admin:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteAdmin = deleteAdmin;
