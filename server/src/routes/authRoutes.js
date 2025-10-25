import express from 'express';
import { check } from 'express-validator';
import { registerUser, loginUser, getProfile } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post(
  '/register',
  [
    check('name', 'Name is required').notEmpty().isLength({ min: 2 }),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  registerUser
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  loginUser
);

router.get('/profile', protect, getProfile);

export default router;