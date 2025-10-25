import express from 'express';
import { check } from 'express-validator';
import { addExpense, getGroupExpenses, getBalances } from '../controllers/expenseController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post(
  '/',
  [
    check('name', 'Expense name is required').notEmpty().isLength({ min: 2 }),
    check('amount', 'Amount must be a positive number').isFloat({ min: 0 }),
    check('group', 'Group ID is required').isMongoId(),
    check('membersInvolved', 'Members involved must be an array').isArray({ min: 1 }),
    check('category', 'Invalid category').isIn(['Food', 'Transport', 'Accommodation', 'Other']).optional(),
    check('splitType', 'Invalid split type').isIn(['equal', 'custom']).optional(),
    check('customSplits', 'Custom splits must be an array').isArray().optional(),
  ],
  protect,
  addExpense
);

router.get(
  '/:groupId',
  [check('groupId', 'Invalid group ID').isMongoId()],
  protect,
  getGroupExpenses
);

router.get(
  '/:groupId/balances',
  [check('groupId', 'Invalid group ID').isMongoId()],
  protect,
  getBalances
);

export default router;