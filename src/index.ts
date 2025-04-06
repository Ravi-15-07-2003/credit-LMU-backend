import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import loanRoutes from "./routes/loanRoutes";
import connectDB from "./config/db";
import adminRoutes from "./routes/adminRoutes";
import userRoutes from "./routes/userRoutes";


dotenv.config();
connectDB(); 

const app = express();
const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin: "*",
  })
);

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
