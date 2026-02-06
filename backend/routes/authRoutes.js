import express from "express";
import { body } from "express-validator";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// ✅ Register route with validation
router.post(
  "/register",
  [
    body("fullName")
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("email")
      .isEmail()
      .withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  registerUser
);

// ✅ Login route with validation
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please provide a valid email"),
    body("password")
      .notEmpty()
      .withMessage("Password is required"),
  ],
  loginUser
);

export default router;
