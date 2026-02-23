import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
// import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import "dotenv/config";
import assetRoutes from "./routes/assetRoute.js";
import chatRoutes from "./routes/chatRoutes.js";

connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/assets", assetRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5500;

app.listen(PORT , () => {
    console.log(`Server Running on port ${PORT}`);
})