import mongoose from "mongoose";
import Stripe from "stripe";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { sendEmail, orderConfirmationEmail } from "../utils/sendEmail.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Creates a Stripe PaymentIntent for the cart total.
// Stock is checked here but only decremented after payment succeeds (see confirmOrder).
export const createPaymentIntent = async (req, res, next) => {
  try {
    const { items } = req.body; // [{ productId, quantity }]
    if (!items?.length) return res.status(400).json({ message: "Cart is empty" });

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product ${item.productId} not found` });
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `${product.name} is out of stock` });
      }
      total += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // cents
      currency: "usd",
      metadata: { userId: req.user.id },
    });

    res.json({ clientSecret: paymentIntent.client_secret, total, orderItems });
  } catch (err) {
    next(err);
  }
};

// Called after Stripe confirms payment client-side. Decrements stock atomically
// (only if enough stock is still available) to avoid overselling under concurrency.
export const confirmOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { paymentIntentId, orderItems, total, shippingAddress } = req.body;

    for (const item of orderItems) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true, session }
      );
      if (!updated) {
        throw new Error(`Insufficient stock for ${item.name}`);
      }
    }

    const [order] = await Order.create(
      [
        {
          user: req.user.id,
          items: orderItems,
          total,
          shippingAddress,
          status: "paid",
          stripePaymentIntentId: paymentIntentId,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    // Fire-and-forget: don't make the customer wait on email delivery.
    User.findById(req.user.id)
      .then((user) => {
        if (user) sendEmail({ to: user.email, subject: "Order Confirmed", html: orderConfirmationEmail(order) });
      })
      .catch(() => {});

    res.status(201).json(order);
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const [revenueResult, orderCount, lowStockProducts] = await Promise.all([
      Order.aggregate([
        { $match: { status: { $in: ["paid", "shipped", "delivered"] } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.countDocuments(),
      Product.find({ stock: { $lte: 5 } }).select("name stock").sort({ stock: 1 }).limit(10),
    ]);

    res.json({
      totalRevenue: revenueResult[0]?.total || 0,
      totalOrders: orderCount,
      lowStockProducts,
    });
  } catch (err) {
    next(err);
  }
};
