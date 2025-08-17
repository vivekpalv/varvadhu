import { APP } from '../utils/constants';

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = APP.DB_URI;
    
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;