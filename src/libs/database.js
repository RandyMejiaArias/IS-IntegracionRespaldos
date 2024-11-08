import mongoose from 'mongoose';
import config from '../config.js';

export const connectDB = async () => {
  try {
    console.log('connecting to DB...');
    mongoose.set('strictQuery', true);
    await mongoose.connect(config.MONGODB_URI);

    console.log('DB is connected');
  } catch (err) {
    console.log('Failed to connect to MongoDB. ', err);
  }
};
