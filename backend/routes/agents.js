const express = require('express');
const Complaint = require('../models/Complaint');
const auth = require('../middleware/auth');
const permit = require('../middleware/role');

const router = express.Router();
router.use(auth);

router.get('/assigned', permit('AGENT'), async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ agent: req.user._id })
      .populate('user', 'name email')
      .sort({ updatedAt: -1 });
    res.json(complaints);
  } catch (error) {
    next(error);
  }
});

router.put('/complaints/:id/progress', permit('AGENT'), async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    if (!complaint.agent?.equals(req.user._id)) {
      return res.status(403).json({ message: 'You are not assigned to this complaint' });
    }
    const { status, description } = req.body;
    if (status) {
      complaint.status = status;
    }
    if (description) {
      complaint.description = description;
    }
    await complaint.save();
    res.json(complaint);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
