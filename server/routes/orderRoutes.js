import express from "express";
import {
  createPaymentIntent,
  confirmOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getAnalytics,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-payment-intent", protect, createPaymentIntent);
router.post("/confirm", protect, confirmOrder);
router.get("/mine", protect, getMyOrders);
router.get("/analytics", protect, adminOnly, getAnalytics);
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
