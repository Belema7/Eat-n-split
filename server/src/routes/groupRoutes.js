import express from 'express';
import { check } from 'express-validator';
import { createGroup, getUserGroups, getGroup } from '../controllers/groupController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post(
  '/',
  [
    check('name', 'Group name is required').notEmpty().isLength({ min: 2 }),
    check('members', 'Members must be an array').isArray().optional(),
  ],
  protect,
  createGroup
);

router.get('/', protect, getUserGroups);

router.get(
  '/:id',
  [check('id', 'Invalid group ID').isMongoId()],
  protect,
  getGroup
);

export default router;