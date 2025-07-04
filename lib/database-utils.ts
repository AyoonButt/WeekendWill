import { MongoClient, MongoClientOptions, MongoError } from 'mongodb';
import { errorHandler, DatabaseError, ErrorContext } from './error-handler';

export interface DatabaseConfig {
  uri: string;
  dbName: string;
  options?: MongoClientOptions;
  retryAttempts?: number;
  retryDelay?: number;
  connectionTimeout?: number;
}

export interface DatabaseConnection {
  client: MongoClient;
  db: any;
  isConnected: boolean;
}

export class DatabaseManager {
  private static instance: DatabaseManager;
  private client: MongoClient | null = null;
  private db: any = null;
  private isConnected = false;
  private connectionPromise: Promise<void> | null = null;
  private config: DatabaseConfig;

  private constructor(config: DatabaseConfig) {
    this.config = {
      retryAttempts: 3,
      retryDelay: 1000,
      connectionTimeout: 30000,
      ...config,
    };
  }

  public static getInstance(config?: DatabaseConfig): DatabaseManager {
    if (!DatabaseManager.instance) {
      if (!config) {
        throw new Error('Database configuration required for first initialization');
      }
      DatabaseManager.instance = new DatabaseManager(config);
    }
    return DatabaseManager.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = this.establishConnection();
    return this.connectionPromise;
  }

  private async establishConnection(attempt = 1): Promise<void> {
    const context: ErrorContext = {
      timestamp: new Date(),
      route: 'database-connection',
    };

    try {
      console.log(`Attempting database connection (attempt ${attempt}/${this.config.retryAttempts})`);
      
      this.client = new MongoClient(this.config.uri, {
        serverSelectionTimeoutMS: this.config.connectionTimeout,
        socketTimeoutMS: this.config.connectionTimeout,
        ...this.config.options,
      });

      await this.client.connect();
      this.db = this.client.db(this.config.dbName);
      
      // Test the connection
      await this.db.admin().ping();
      
      this.isConnected = true;
      console.log('Database connected successfully');
      
      // Set up connection event listeners
      this.setupConnectionEventListeners();
      
    } catch (error) {
      console.error(`Database connection attempt ${attempt} failed:`, error);
      
      if (attempt < this.config.retryAttempts!) {
        console.log(`Retrying connection in ${this.config.retryDelay}ms...`);
        await this.delay(this.config.retryDelay!);
        return this.establishConnection(attempt + 1);
      }
      
      const dbError = new DatabaseError(
        `Failed to connect to database after ${this.config.retryAttempts} attempts`,
        context
      );
      
      errorHandler.log(dbError);
      throw dbError;
    }
  }

  private setupConnectionEventListeners(): void {
    if (!this.client) return;

    this.client.on('error', (error) => {
      console.error('Database connection error:', error);
      this.isConnected = false;
      errorHandler.log(new DatabaseError('Database connection error', {
        timestamp: new Date(),
        route: 'database-connection',
      }));
    });

    this.client.on('close', () => {
      console.log('Database connection closed');
      this.isConnected = false;
    });

    this.client.on('reconnect', () => {
      console.log('Database reconnected');
      this.isConnected = true;
    });
  }

  public async disconnect(): Promise<void> {
    if (this.client && this.isConnected) {
      await this.client.close();
      this.isConnected = false;
      this.client = null;
      this.db = null;
      this.connectionPromise = null;
      console.log('Database disconnected');
    }
  }

  public async getDatabase(): Promise<any> {
    if (!this.isConnected) {
      await this.connect();
    }
    return this.db;
  }

  public async executeWithRetry<T>(
    operation: () => Promise<T>,
    context?: ErrorContext,
    maxRetries = 3
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Ensure connection is active
        if (!this.isConnected) {
          await this.connect();
        }
        
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        console.error(`Database operation attempt ${attempt} failed:`, error);
        
        // Check if it's a connection error
        if (this.isConnectionError(error)) {
          this.isConnected = false;
          console.log('Connection lost, attempting to reconnect...');
          
          if (attempt < maxRetries) {
            await this.delay(this.config.retryDelay! * attempt);
            continue;
          }
        }
        
        // Check if it's a retriable error
        if (this.isRetriableError(error) && attempt < maxRetries) {
          await this.delay(this.config.retryDelay! * attempt);
          continue;
        }
        
        // If not retriable or max retries reached, throw error
        break;
      }
    }
    
    const dbError = new DatabaseError(
      `Database operation failed after ${maxRetries} attempts: ${lastError?.message}`,
      context
    );
    
    errorHandler.log(dbError);
    throw dbError;
  }

  private isConnectionError(error: any): boolean {
    if (error instanceof MongoError) {
      return [
        'MongoNetworkError',
        'MongoTimeoutError',
        'MongoServerSelectionError',
        'MongoTopologyClosedError',
      ].includes(error.constructor.name);
    }
    
    return false;
  }

  private isRetriableError(error: any): boolean {
    if (error instanceof MongoError) {
      // Retriable MongoDB errors
      const retriableCodes = [
        11600, // InterruptedAtShutdown
        11601, // Interrupted
        11602, // InterruptedDueToReplStateChange
        189,   // PrimarySteppedDown
        91,    // ShutdownInProgress
        7,     // HostNotFound
        6,     // HostUnreachable
        89,    // NetworkTimeout
      ];
      
      return retriableCodes.includes(error.code);
    }
    
    return false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Health check
  public async healthCheck(): Promise<boolean> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      
      await this.db.admin().ping();
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  // Connection status
  public getConnectionStatus(): {
    isConnected: boolean;
    hasClient: boolean;
    hasDatabase: boolean;
  } {
    return {
      isConnected: this.isConnected,
      hasClient: this.client !== null,
      hasDatabase: this.db !== null,
    };
  }
}

// Utility functions for database operations
export const withDatabaseErrorHandling = <T>(
  operation: () => Promise<T>,
  context?: ErrorContext
) => {
  return async (): Promise<T> => {
    try {
      return await operation();
    } catch (error) {
      const dbError = errorHandler.normalizeError(error, context);
      errorHandler.log(dbError);
      throw dbError;
    }
  };
};

export const createDatabaseContext = (
  collection: string,
  operation: string,
  userId?: string
): ErrorContext => {
  return {
    userId,
    route: `database/${collection}`,
    method: operation,
    timestamp: new Date(),
  };
};

// Transaction wrapper with error handling
export const withTransaction = async <T>(
  operation: (session: any) => Promise<T>,
  context?: ErrorContext
): Promise<T> => {
  const dbManager = DatabaseManager.getInstance();
  const db = await dbManager.getDatabase();
  
  return dbManager.executeWithRetry(async () => {
    const session = db.getMongo().startSession();
    
    try {
      session.startTransaction();
      const result = await operation(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }, context);
};

// Common database operations with error handling
export const safeFind = async <T>(
  collection: any,
  query: any,
  options: any = {},
  context?: ErrorContext
): Promise<T[]> => {
  const dbManager = DatabaseManager.getInstance();
  
  return dbManager.executeWithRetry(async () => {
    return await collection.find(query, options).toArray();
  }, context);
};

export const safeFindOne = async <T>(
  collection: any,
  query: any,
  options: any = {},
  context?: ErrorContext
): Promise<T | null> => {
  const dbManager = DatabaseManager.getInstance();
  
  return dbManager.executeWithRetry(async () => {
    return await collection.findOne(query, options);
  }, context);
};

export const safeInsertOne = async <T>(
  collection: any,
  document: any,
  options: any = {},
  context?: ErrorContext
): Promise<T> => {
  const dbManager = DatabaseManager.getInstance();
  
  return dbManager.executeWithRetry(async () => {
    const result = await collection.insertOne(document, options);
    return { ...document, _id: result.insertedId };
  }, context);
};

export const safeUpdateOne = async (
  collection: any,
  filter: any,
  update: any,
  options: any = {},
  context?: ErrorContext
): Promise<any> => {
  const dbManager = DatabaseManager.getInstance();
  
  return dbManager.executeWithRetry(async () => {
    return await collection.updateOne(filter, update, options);
  }, context);
};

export const safeDeleteOne = async (
  collection: any,
  filter: any,
  options: any = {},
  context?: ErrorContext
): Promise<any> => {
  const dbManager = DatabaseManager.getInstance();
  
  return dbManager.executeWithRetry(async () => {
    return await collection.deleteOne(filter, options);
  }, context);
};