import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { productRules, handleValidation } from "../middleware/validators.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", protect, adminOnly, productRules, handleValidation, createProduct);
router.put("/:id", protect, adminOnly, productRules, handleValidation, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
