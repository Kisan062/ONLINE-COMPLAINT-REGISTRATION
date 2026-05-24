const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  assignedComplaints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' }],
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Agent', agentSchema);
