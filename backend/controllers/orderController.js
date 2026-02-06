import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ======================================================
   CREATE ORDER
====================================================== */
export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Cart is empty" });
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      price: item.price,
    }));

    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount: cart.totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || "Stripe",
      paymentStatus: "pending",
      orderStatus: "processing",
      isPaid: false,
      isDelivered: false,
    });

    await order.save();

    // Clear cart
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ======================================================
   GET USER ORDERS
====================================================== */
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ======================================================
   GET ORDER BY ID (OWNER OR ADMIN)
====================================================== */
export const getOrderById = async (req, res) => {
  try {
    const userId = req.user._id;

    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .populate("user", "fullName email");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (
      order.user._id.toString() !== userId.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ======================================================
   UPDATE PAYMENT STATUS (ADMIN)
====================================================== */
export const updatePaymentStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // 🔒 Guards
    if (order.isPaid) {
      return res.status(400).json({
        success: false,
        message: "Order is already paid",
      });
    }

    if (order.orderStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot pay for a cancelled order",
      });
    }

    order.paymentStatus = "paid";
    order.isPaid = true;
    order.paidAt = new Date();

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment marked as paid",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ======================================================
   UPDATE ORDER STATUS (ADMIN)
====================================================== */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // 🔒 Guards
    if (order.orderStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot update a cancelled order",
      });
    }

    const validTransitions = {
      processing: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: [],
    };

    if (
      orderStatus &&
      !validTransitions[order.orderStatus]?.includes(orderStatus)
    ) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${order.orderStatus} to ${orderStatus}`,
      });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;

      if (orderStatus === "delivered") {
        order.isDelivered = true;
        order.deliveredAt = new Date();
      }
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ======================================================
   CANCEL ORDER (USER)
====================================================== */
export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user._id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    // 🔒 Guards
    if (["shipped", "delivered", "cancelled"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order that is ${order.orderStatus}`,
      });
    }

    // 🔁 Refund if paid
    if (order.isPaid && order.paymentResult?.id) {
      await stripe.refunds.create({
        payment_intent: order.paymentResult.id,
      });

      order.paymentStatus = "refunded";
      order.isPaid = false;
      order.refundedAt = new Date();
    }

    order.orderStatus = "cancelled";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ======================================================
   GET ALL ORDERS (ADMIN)
====================================================== */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "fullName email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
