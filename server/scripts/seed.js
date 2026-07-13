// Seeds the database with a sample admin user and a batch of test products.
// Run with: npm run seed
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

dotenv.config();

const sampleProducts = [
  { name: "Classic Cotton Tee", description: "Soft, breathable everyday t-shirt.", price: 19.99, category: "apparel", stock: 100, images: ["https://placehold.co/400x400?text=Tee"] },
  { name: "Running Sneakers", description: "Lightweight sneakers built for daily runs.", price: 79.99, category: "footwear", stock: 40, images: ["https://placehold.co/400x400?text=Sneakers"] },
  { name: "Insulated Water Bottle", description: "Keeps drinks cold for 24 hours.", price: 24.5, category: "accessories", stock: 75, images: ["https://placehold.co/400x400?text=Bottle"] },
  { name: "Wireless Earbuds", description: "Noise-isolating earbuds with 20hr battery life.", price: 59.99, category: "electronics", stock: 30, images: ["https://placehold.co/400x400?text=Earbuds"] },
  { name: "Canvas Backpack", description: "Durable daily-carry backpack with laptop sleeve.", price: 45.0, category: "accessories", stock: 0, images: ["https://placehold.co/400x400?text=Backpack"] },
  { name: "Ceramic Coffee Mug", description: "12oz mug, dishwasher and microwave safe.", price: 12.99, category: "home", stock: 120, images: ["https://placehold.co/400x400?text=Mug"] },
];

const run = async () => {
  await connectDB();

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "adminpass123";

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: "Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });
    console.log(`Created admin user: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }

  await Product.deleteMany({});
  await Product.insertMany(sampleProducts);
  console.log(`Inserted ${sampleProducts.length} sample products`);

  await mongoose.disconnect();
  console.log("Seeding complete.");
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
