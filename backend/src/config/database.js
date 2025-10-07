import mongoose from 'mongoose';
import env from './env.js';

mongoose.set('strictQuery', false);

const connectDatabase = async () => {
  if (!env.mongoUri) {
    throw new Error('MONGODB_URI is not configured');
  }

  if (mongoose.connection.readyState === 1) {
    console.log('MongoDB already connected');
    return mongoose.connection;
  }

  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 5000
  });

  console.log('MongoDB connected');

  return mongoose.connection;
};

export { mongoose };
export default connectDatabase;
