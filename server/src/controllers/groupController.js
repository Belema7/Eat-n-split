import { validationResult } from 'express-validator';
import Group from '../models/Group.js';
import User from '../models/User.js';

export const createGroup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, members } = req.body;
  try {
    // Validate member IDs
    const validMembers = await User.find({ _id: { $in: members } });
    if (validMembers.length !== members.length) {
      return res.status(400).json({ message: 'One or more member IDs are invalid' });
    }

    const group = new Group({
      name,
      members: [...new Set([...members, req.user.id])], // Include creator
      createdBy: req.user.id,
    });
    await group.save();

    // Update users' groups array
    await User.updateMany(
      { _id: { $in: group.members } },
      { $addToSet: { groups: group._id } }
    );

    res.status(201).json({ message: 'Group created successfully', group });
  } catch (error) {
    console.error('❌ Create Group Error:', error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid group data', errors: error.errors });
    }
    next(new Error('Failed to create group'));
  }
};

export const getUserGroups = async (req, res, next) => {
  try {
    const groups = await Group.find({ members: req.user.id })
      .populate('members', 'name email')
      .populate('expenses', 'name amount');
    res.json({ groups });
  } catch (error) {
    console.error('❌ Get Groups Error:', error.message);
    next(new Error('Failed to fetch groups'));
  }
};

export const getGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('members', 'name email')
      .populate({
        path: 'expenses',
        populate: [
          { path: 'paidBy', select: 'name email' },
          { path: 'membersInvolved', select: 'name email' },
        ],
      });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    if (!group.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'Unauthorized to access this group' });
    }
    res.json({ group });
  } catch (error) {
    console.error('❌ Get Group Error:', error.message);
    next(new Error('Failed to fetch group details'));
  }
};