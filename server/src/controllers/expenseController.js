import Expense from "../models/Expense.js";
import { calculateSplit } from "../utils/calculateSplit.js";

export const addExpense = async (req, res) => {
  try {
    const { description, amount, paidBy, group, participants } = req.body;
    const expense = await Expense.create({ description, amount, paidBy, group, participants });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGroupExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ group: req.params.groupId }).populate("paidBy participants", "name email");
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
