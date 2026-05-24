const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error('MONGO_URI environment variable is required');
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
