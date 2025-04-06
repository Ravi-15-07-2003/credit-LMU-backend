"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Promote a user to admin (only admins can do this)
router.put("/promote/:id", authMiddleware_1.protect, (0, authMiddleware_1.authorize)(["admin"]), adminController_1.promoteToAdmin);
// Demote an admin to user (only admins can do this)
router.put("/demote/:id", authMiddleware_1.protect, (0, authMiddleware_1.authorize)(["admin"]), adminController_1.demoteToUser);
router.delete("/delete/:id", authMiddleware_1.protect, (0, authMiddleware_1.authorize)(["admin"]), adminController_1.deleteAdmin);
exports.default = router;
