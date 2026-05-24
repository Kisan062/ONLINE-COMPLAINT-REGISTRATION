const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '') || req.query.token;
  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid authorization token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid authorization token' });
  }
};

module.exports = auth;
