import { validationResult } from 'express-validator';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, name, email },
    });
  } catch (error) {
    console.error('❌ Register Error:', error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid user data', errors: error.errors });
    }
    next(new Error('Failed to register user'));
  }
};

export const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email },
    });
  } catch (error) {
    console.error('❌ Login Error:', error.message);
    next(new Error('Failed to log in'));
  }
};

// Get user profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('groups', 'name');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('❌ Profile Error:', error.message);
    next(new Error('Failed to fetch profile'));
  }
};