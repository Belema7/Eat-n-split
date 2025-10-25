import { validationResult } from 'express-validator';
import Expense from '../models/Expense.js';
import Group from '../models/Group.js';
import { calculateSplit } from '../utils/calculateSplit.js';

export const addExpense = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, amount, group, membersInvolved, category, splitType, customSplits } = req.body;
  try {
    const groupDoc = await Group.findById(group);
    if (!groupDoc) {
      return res.status(404).json({ message: 'Group not found' });
    }
    if (!groupDoc.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'Unauthorized to add expense to this group' });
    }
    if (!membersInvolved.every((id) => groupDoc.members.includes(id))) {
      return res.status(400).json({ message: 'One or more members are not in the group' });
    }

    if (splitType === 'custom') {
      const totalSplit = customSplits.reduce((sum, split) => sum + split.amount, 0);
      if (totalSplit !== amount) {
        return res.status(400).json({ message: 'Custom split amounts must equal total amount' });
      }
    }

    const splits = calculateSplit(amount, membersInvolved, splitType, customSplits);
    const expense = new Expense({
      name,
      amount,
      paidBy: req.user.id,
      group,
      membersInvolved,
      category,
      splitType,
      splits,
    });
    await expense.save();

    groupDoc.expenses.push(expense._id);
    await groupDoc.save();

    res.status(201).json({ message: 'Expense added successfully', expense });
  } catch (error) {
    console.error('❌ Add Expense Error:', error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid expense data', errors: error.errors });
    }
    next(new Error('Failed to add expense'));
  }
};

export const getGroupExpenses = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    if (!group.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'Unauthorized to view expenses' });
    }

    const expenses = await Expense.find({ group: req.params.groupId })
      .populate('paidBy', 'name email')
      .populate('membersInvolved', 'name email');
    res.json({ expenses });
  } catch (error) {
    console.error('❌ Get Expenses Error:', error.message);
    next(new Error('Failed to fetch expenses'));
  }
};

export const getBalances = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    if (!group.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'Unauthorized to view balances' });
    }

    const expenses = await Expense.find({ group: req.params.groupId });
    const balances = {};
    expenses.forEach((expense) => {
      expense.splits.forEach((split) => {
        const userId = split.user.toString();
        balances[userId] = (balances[userId] || 0) - split.amount;
        balances[expense.paidBy.toString()] =
          (balances[expense.paidBy.toString()] || 0) + expense.amount;
      });
    });

    // Format balances for frontend
    const formattedBalances = await Promise.all(
      Object.entries(balances).map(async ([userId, amount]) => {
        const user = await User.findById(userId).select('name email');
        return { user, amount };
      })
    );

    res.json({ balances: formattedBalances });
  } catch (error) {
    console.error('❌ Get Balances Error:', error.message);
    next(new Error('Failed to fetch balances'));
  }
};