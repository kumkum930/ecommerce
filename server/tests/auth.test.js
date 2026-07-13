// Run with: npm test
// Requires MONGO_URI in .env to point at a test database (do NOT run against production data).
import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "../routes/authRoutes.js";
import { notFound, errorHandler } from "../middleware/errorHandler.js";
import User from "../models/User.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(notFound);
app.use(errorHandler);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth API", () => {
  test("registers a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("test@example.com");
  });

  test("rejects registration with a short password", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test2@example.com",
      password: "short",
    });
    expect(res.status).toBe(400);
  });

  test("rejects duplicate email registration", async () => {
    await request(app).post("/api/auth/register").send({
      name: "First",
      email: "dupe@example.com",
      password: "password123",
    });
    const res = await request(app).post("/api/auth/register").send({
      name: "Second",
      email: "dupe@example.com",
      password: "password123",
    });
    expect(res.status).toBe(400);
  });

  test("logs in with correct credentials", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Login Test",
      email: "login@example.com",
      password: "password123",
    });
    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "password123",
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("rejects login with wrong password", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Login Test",
      email: "login2@example.com",
      password: "password123",
    });
    const res = await request(app).post("/api/auth/login").send({
      email: "login2@example.com",
      password: "wrongpassword",
    });
    expect(res.status).toBe(401);
  });
});
