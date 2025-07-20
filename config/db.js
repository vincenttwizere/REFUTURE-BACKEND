import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vtwizere:wju5eW3B47oB0B9O@cluster0.pnp0scz.mongodb.net/';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    if (process.env.NODE_ENV === 'development') {
      await ensureIndexes();
    }

    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Function to ensure all indexes are created
const ensureIndexes = async () => {
  try {
    console.log('Creating database indexes for optimal performance...');
    
    const models = mongoose.models;
    
    for (const [modelName, model] of Object.entries(models)) {
      try {
        await model.createIndexes();
        console.log(`✓ Indexes created for ${modelName}`);
      } catch (error) {
        console.log(`⚠ Warning: Could not create indexes for ${modelName}:`, error.message);
      }
    }
    
    console.log('Database indexes setup complete');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
};

export default connectDB; 