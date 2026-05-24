const { body } = require('express-validator');

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['USER', 'AGENT', 'ADMIN']).withMessage('Invalid role'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').exists().withMessage('Password is required'),
];

const complaintValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Invalid priority'),
];

const assignmentValidation = [
  body('complaintId').notEmpty().withMessage('Complaint ID is required'),
  body('agentId').notEmpty().withMessage('Agent ID is required'),
];

const feedbackValidation = [
  body('complaintId').notEmpty().withMessage('Complaint ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim(),
];

const messageValidation = [
  body('content').trim().notEmpty().withMessage('Message content is required'),
];

module.exports = {
  registerValidation,
  loginValidation,
  complaintValidation,
  assignmentValidation,
  feedbackValidation,
  messageValidation,
};
