 import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/authMiddleware.js';

import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getAllCarts
} from '../controllers/cartController.js';

const router = express.Router();


router.get('/', protect, getCart);

router.get('/all', protect, adminOnly, getAllCarts);

router.post('/add', protect, addToCart);

router.put('/update', protect, updateCartItem);

router.delete('/remove', protect, removeCartItem);

router.delete('/clear', protect, clearCart);

export default router;
