import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  tls: true,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export { clientPromise };

// Database connection helper
export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'weekend-will');
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error('Database connection failed');
  }
}

// Database utilities
export class DatabaseService {
  private static instance: DatabaseService;
  private db: Db | null = null;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async getDatabase(): Promise<Db> {
    if (!this.db) {
      const { db } = await connectToDatabase();
      this.db = db;
    }
    return this.db;
  }

  // User operations
  public async createUser(userData: any) {
    const db = await this.getDatabase();
    const result = await db.collection('users').insertOne({
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return result;
  }

  public async getUserByEmail(email: string) {
    const db = await this.getDatabase();
    return await db.collection('users').findOne({ 
      email: email.toLowerCase() 
    });
  }

  public async getUserById(userId: string) {
    const db = await this.getDatabase();
    const { ObjectId } = require('mongodb');
    return await db.collection('users').findOne({ 
      _id: new ObjectId(userId) 
    });
  }

  public async updateUser(userId: string, updateData: any) {
    const db = await this.getDatabase();
    const { ObjectId } = require('mongodb');
    return await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          ...updateData, 
          updatedAt: new Date() 
        } 
      }
    );
  }

  // Will operations
  public async createWill(willData: any) {
    const db = await this.getDatabase();
    return await db.collection('wills').insertOne({
      ...willData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public async getWillsByUserId(userId: string) {
    const db = await this.getDatabase();
    const { ObjectId } = require('mongodb');
    return await db.collection('wills').find({ 
      userId: new ObjectId(userId) 
    }).toArray();
  }

  public async updateWill(willId: string, updateData: any) {
    const db = await this.getDatabase();
    const { ObjectId } = require('mongodb');
    return await db.collection('wills').updateOne(
      { _id: new ObjectId(willId) },
      { 
        $set: { 
          ...updateData, 
          updatedAt: new Date() 
        } 
      }
    );
  }

  // Subscription operations
  public async updateSubscription(userId: string, subscriptionData: any) {
    const db = await this.getDatabase();
    const { ObjectId } = require('mongodb');
    return await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          subscription: subscriptionData,
          updatedAt: new Date() 
        } 
      }
    );
  }
}

export const dbService = DatabaseService.getInstance();