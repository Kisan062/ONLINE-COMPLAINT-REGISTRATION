const express = require('express');
const { validationResult } = require('express-validator');
const Feedback = require('../models/Feedback');
const Complaint = require('../models/Complaint');
const auth = require('../middleware/auth');
const permit = require('../middleware/role');
const { feedbackValidation } = require('../utils/validators');

const router = express.Router();
router.use(auth);

router.post('/submit', feedbackValidation, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { complaintId, rating, comment } = req.body;
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    if (!complaint.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only the complaint owner may submit feedback' });
    }

    const existing = await Feedback.findOne({ complaint: complaintId, user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'Feedback already submitted for this complaint' });
    }

    const feedback = await Feedback.create({ complaint: complaintId, user: req.user._id, rating, comment });
    res.status(201).json(feedback);
  } catch (error) {
    next(error);
  }
});

router.get('/complaint/:id', permit('ADMIN', 'AGENT', 'USER'), async (req, res, next) => {
  try {
    const feedback = await Feedback.find({ complaint: req.params.id }).populate('user', 'name email');
    res.json(feedback);
  } catch (error) {
    next(error);
  }
});

router.get('/', permit('ADMIN'), async (req, res, next) => {
  try {
    const feedback = await Feedback.find().populate('user', 'name email').populate('complaint', 'title status');
    res.json(feedback);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
