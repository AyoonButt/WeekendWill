import mongoose from 'mongoose';

// Model imports
export { default as User, type IUser } from './User';
export { default as Will, type IWill } from './Will';

// Initialize Mongoose connection
let isConnected = false;

export async function connectToMongoDB() {
  if (isConnected) {
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    // Set mongoose options
    mongoose.set('strictQuery', false);

    await mongoose.connect(mongoUri, {
      maxPoolSize: 20, // Increased pool size
      minPoolSize: 5, // Maintain minimum connections
      serverSelectionTimeoutMS: 10000, // Reduced timeout
      socketTimeoutMS: 30000, // Reduced timeout
      connectTimeoutMS: 10000, // Reduced timeout
      maxIdleTimeMS: 30000, // Close idle connections
      heartbeatFrequencyMS: 10000, // Faster heartbeat
    });

    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}

// Disconnect from MongoDB
export async function disconnectFromMongoDB() {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('Disconnected from MongoDB');
  }
}

// Get connection status
export function getConnectionStatus() {
  return {
    isConnected,
    readyState: mongoose.connection.readyState,
    name: mongoose.connection.name,
    host: mongoose.connection.host,
    port: mongoose.connection.port,
  };
}