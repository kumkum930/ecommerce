import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import authRoutes from "../routes/authRoutes.js";
import productRoutes from "../routes/productRoutes.js";
import { notFound, errorHandler } from "../middleware/errorHandler.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use(notFound);
app.use(errorHandler);

let adminToken;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const admin = await User.create({
    name: "Admin",
    email: "admin-test@example.com",
    password: "password123",
    role: "admin",
  });
  adminToken = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
});

afterEach(async () => {
  await Product.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe("Product API", () => {
  test("creates a product as admin", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Test Product", description: "desc", price: 9.99, category: "test", stock: 10 });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Test Product");
  });

  test("rejects product creation without auth", async () => {
    const res = await request(app)
      .post("/api/products")
      .send({ name: "No Auth", description: "desc", price: 9.99, category: "test", stock: 10 });
    expect(res.status).toBe(401);
  });

  test("rejects negative price", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Bad Product", description: "desc", price: -5, category: "test", stock: 10 });
    expect(res.status).toBe(400);
  });

  test("lists products", async () => {
    await Product.create({ name: "Listed Product", description: "desc", price: 5, category: "test", stock: 3 });
    const res = await request(app).get("/api/products");
    expect(res.status).toBe(200);
    expect(res.body.products.length).toBeGreaterThan(0);
  });
});
