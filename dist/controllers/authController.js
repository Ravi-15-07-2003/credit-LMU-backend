"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = (0, asyncHandler_1.default)(async (req, res) => {
    const { name, email, password, role } = req.body;
    const userExists = await User_1.default.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    // Role assignment based on email domain pattern
    let assignedRole = "user"; // default
    if (role === "admin" && email.endsWith("admin@gmail.com")) {
        assignedRole = "admin";
    }
    else if (role === "verifier" && email.endsWith("verifier@gmail.com")) {
        assignedRole = "verifier";
    }
    else if (role && role !== "user") {
        return res.status(403).json({
            message: "Invalid role or email not authorized for role",
        });
    }
    const user = await User_1.default.create({
        name,
        email,
        password: hashedPassword,
        role: assignedRole,
    });
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: (0, generateToken_1.default)(user._id.toString()),
    });
});
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const user = await User_1.default.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: (0, generateToken_1.default)(user._id.toString()),
    });
});
