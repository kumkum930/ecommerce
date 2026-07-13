import express from "express";
import { register, login, getMe, forgotPassword, resetPassword } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import {
  registerRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
  handleValidation,
} from "../middleware/validators.js";

const router = express.Router();

router.post("/register", registerRules, handleValidation, register);
router.post("/login", loginRules, handleValidation, login);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPasswordRules, handleValidation, forgotPassword);
router.post("/reset-password/:token", resetPasswordRules, handleValidation, resetPassword);

export default router;
