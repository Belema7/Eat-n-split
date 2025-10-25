import Group from "../models/Group.js";

export const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    const group = await Group.create({ name, members, createdBy: req.user.id });
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id }).populate("members", "name email");
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
