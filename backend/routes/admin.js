const express = require('express');
const { validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Agent = require('../models/Agent');
const auth = require('../middleware/auth');
const permit = require('../middleware/role');
const sendMail = require('../config/mail');
const { assignmentValidation } = require('../utils/validators');

const router = express.Router();
router.use(auth, permit('ADMIN'));

router.get('/stats', async (req, res, next) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const open = await Complaint.countDocuments({ status: 'OPEN' });
    const inProgress = await Complaint.countDocuments({ status: 'IN_PROGRESS' });
    const resolved = await Complaint.countDocuments({ status: 'RESOLVED' });
    const closed = await Complaint.countDocuments({ status: 'CLOSED' });
    const users = await User.countDocuments({ role: 'USER' });
    const agents = await User.countDocuments({ role: 'AGENT' });
    res.json({ totalComplaints, open, inProgress, resolved, closed, users, agents });
  } catch (error) {
    next(error);
  }
});

router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/agents', async (req, res, next) => {
  try {
    const agents = await Agent.find().populate('user', 'name email');
    res.json(agents);
  } catch (error) {
    next(error);
  }
});

router.get('/complaints', async (req, res, next) => {
  try {
    const complaints = await Complaint.find()
      .populate('user', 'name email')
      .populate('agent', 'name email')
      .sort({ updatedAt: -1 });
    res.json(complaints);
  } catch (error) {
    next(error);
  }
});

router.put('/assign', assignmentValidation, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { complaintId, agentId } = req.body;
    const complaint = await Complaint.findById(complaintId);
    const agentUser = await User.findById(agentId);
    if (!complaint || !agentUser) {
      return res.status(404).json({ message: 'Complaint or agent not found' });
    }
    if (agentUser.role !== 'AGENT') {
      return res.status(400).json({ message: 'Selected user is not an agent' });
    }
    complaint.agent = agentUser._id;
    complaint.status = 'IN_PROGRESS';
    await complaint.save();

    let agentRecord = await Agent.findOne({ user: agentUser._id });
    if (!agentRecord) {
      agentRecord = await Agent.create({ user: agentUser._id, assignedComplaints: [complaint._id] });
    } else {
      agentRecord.assignedComplaints.push(complaint._id);
      await agentRecord.save();
    }

    await sendMail({
      to: agentUser.email,
      subject: 'Complaint Assigned',
      text: `A new complaint has been assigned to you: ${complaint.title}`,
    });

    res.json({ complaint, agent: agentRecord });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
