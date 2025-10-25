import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: [true, 'Group is required'],
  },
  name: {
    type: String,
    required: [true, 'Expense name is required'],
    trim: true,
    minlength: [2, 'Expense name must be at least 2 characters'],
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative'],
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Paid by is required'],
  },
  membersInvolved: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Members involved are required'],
    },
  ],
  category: {
    type: String,
    enum: {
      values: ['Food', 'Transport', 'Accommodation', 'Other'],
      message: 'Invalid category',
    },
    default: 'Other',
  },
  splitType: {
    type: String,
    enum: {
      values: ['equal', 'custom'],
      message: 'Invalid split type',
    },
    default: 'equal',
  },
  splits: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      amount: { type: Number, min: [0, 'Split amount cannot be negative'] },
    },
  ],
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;