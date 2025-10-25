import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true,
    minlength: [2, 'Group name must be at least 2 characters'],
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Members are required'],
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required'],
  },
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }],
}, { timestamps: true });

const Group = mongoose.model('Group', groupSchema);
export default Group;