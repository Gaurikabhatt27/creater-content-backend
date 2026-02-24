import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
// import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import "dotenv/config";
import assetRoutes from "./routes/assetRoute.js";
import chatRoutes from "./routes/chatRoutes.js";
import http from "http";
import { initSocket } from "./sockets/socket.js";
import payRoutes from "./routes/paymentRoute.js";

connectDB();

const app = express();
const server = http.createServer(app);
initSocket(server);

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/assets", assetRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/payment", payRoutes);

const PORT = process.env.PORT || 5500;

server.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});