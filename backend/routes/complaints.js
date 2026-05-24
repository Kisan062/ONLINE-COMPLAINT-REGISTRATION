const express = require('express');
const { validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const auth = require('../middleware/auth');
const permit = require('../middleware/role');
const { complaintValidation, messageValidation } = require('../utils/validators');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'USER') {
      query.user = req.user._id;
    } else if (req.user.role === 'AGENT') {
      query.agent = req.user._id;
    }
    const complaints = await Complaint.find(query)
      .populate('user', 'name email')
      .populate('agent', 'name email')
      .sort({ updatedAt: -1 });
    res.json(complaints);
  } catch (error) {
    next(error);
  }
});

router.post('/', permit('USER'), complaintValidation, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const complaint = await Complaint.create({
      ...req.body,
      user: req.user._id,
      status: 'OPEN',
    });
    res.status(201).json(complaint);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name email')
      .populate('agent', 'name email')
      .populate('messages.sender', 'name email');
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const isOwner = complaint.user._id.equals(req.user._id);
    const isAgent = complaint.agent?.equals(req.user._id);
    if (req.user.role === 'ADMIN' || isOwner || isAgent) {
      return res.json(complaint);
    }

    return res.status(403).json({ message: 'Access denied' });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    const isOwner = complaint.user.equals(req.user._id);
    const isAgent = complaint.agent?.equals(req.user._id);
    if (req.user.role === 'ADMIN' || isOwner || isAgent) {
      const allowed = ['title', 'description', 'category', 'priority', 'status', 'attachments'];
      allowed.forEach((field) => {
        if (req.body[field] !== undefined) {
          complaint[field] = req.body[field];
        }
      });
      if (req.body.status && req.user.role === 'USER' && req.body.status !== 'CLOSED') {
        return res.status(403).json({ message: 'Users may only close complaints' });
      }
      await complaint.save();
      return res.json(complaint);
    }
    return res.status(403).json({ message: 'Access denied' });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/messages', messageValidation, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    const isOwner = complaint.user.equals(req.user._id);
    const isAgent = complaint.agent?.equals(req.user._id);
    if (req.user.role === 'ADMIN' || isOwner || isAgent) {
      complaint.messages.push({ sender: req.user._id, content: req.body.content });
      await complaint.save();
      return res.status(201).json(complaint.messages);
    }
    return res.status(403).json({ message: 'Access denied' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
