"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
// @desc    Get all users
// @route   GET /api/users/count
// @access  Private (Admin)
const getTotalUsers = async (req, res) => {
    try {
        const users = await User_1.default.find();
        res.status(200).json(users); // Return array of users
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};
exports.getTotalUsers = getTotalUsers;
