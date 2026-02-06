import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updatePaymentStatus,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ================= ADMIN ROUTES =================
router.get("/all/orders", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);
router.put("/:id/payment", protect, adminOnly, updatePaymentStatus);

// ================= USER ROUTES =================
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getUserOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/cancel", protect, cancelOrder);

export default router;
