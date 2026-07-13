import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";


connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

// Rate limit auth + order routes to reduce brute force / abuse risk
const sensitiveLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use("/api/auth", sensitiveLimiter, authRoutes);
app.use("/api/orders", sensitiveLimiter, orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
