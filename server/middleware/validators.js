import { body, validationResult } from "express-validator";

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
  }
  next();
};

export const registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
];

export const loginRules = [
  body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

export const productRules = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
  body("images").optional().isArray().withMessage("Images must be an array of URLs"),
];

export const forgotPasswordRules = [
  body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
];

export const resetPasswordRules = [
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
];
