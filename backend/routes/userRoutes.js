import express from 'express';
import { getUserProfile, getAllUser, updateUser } from '../controllers/userController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);

router.put('/profile', protect, updateUser);

router.get('/', protect, adminOnly, getAllUser);

export default router;
