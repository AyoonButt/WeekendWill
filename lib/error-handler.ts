import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { MongoError } from 'mongodb';

export type ErrorLevel = 'info' | 'warning' | 'error' | 'critical';

export interface ErrorContext {
  userId?: string;
  userEmail?: string;
  route?: string;
  method?: string;
  timestamp?: Date;
  userAgent?: string;
  ip?: string;
  sessionId?: string;
}

export interface ErrorDetails {
  message: string;
  code?: string;
  level: ErrorLevel;
  context?: ErrorContext;
  stack?: string;
  originalError?: Error;
}

export class AppError extends Error {
  public code: string;
  public level: ErrorLevel;
  public context?: ErrorContext;
  public statusCode: number;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    level: ErrorLevel = 'error',
    statusCode: number = 500,
    context?: ErrorContext
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.level = level;
    this.statusCode = statusCode;
    this.context = context;
  }
}

export class ValidationError extends AppError {
  public validationErrors: Record<string, string[]>;

  constructor(
    message: string = 'Validation failed',
    validationErrors: Record<string, string[]> = {},
    context?: ErrorContext
  ) {
    const filteredValidationErrors = Object.fromEntries(
      Object.entries(validationErrors).filter(([_, v]) => Array.isArray(v))
    ) as Record<string, string[]>;

    super(message, 'VALIDATION_ERROR', 'warning', 400, context);
    this.validationErrors = filteredValidationErrors;
  }
}

export class AuthenticationError extends AppError {
  constructor(
    message: string = 'Authentication required',
    context?: ErrorContext
  ) {
    super(message, 'AUTHENTICATION_ERROR', 'warning', 401, context);
  }
}

export class AuthorizationError extends AppError {
  constructor(
    message: string = 'Access denied',
    context?: ErrorContext
  ) {
    super(message, 'AUTHORIZATION_ERROR', 'warning', 403, context);
  }
}

export class NotFoundError extends AppError {
  constructor(
    message: string = 'Resource not found',
    context?: ErrorContext
  ) {
    super(message, 'NOT_FOUND_ERROR', 'info', 404, context);
  }
}

export class DatabaseError extends AppError {
  constructor(
    message: string = 'Database operation failed',
    context?: ErrorContext
  ) {
    super(message, 'DATABASE_ERROR', 'error', 500, context);
  }
}

export class PaymentError extends AppError {
  constructor(
    message: string = 'Payment processing failed',
    context?: ErrorContext
  ) {
    super(message, 'PAYMENT_ERROR', 'error', 400, context);
  }
}

export class FileUploadError extends AppError {
  constructor(
    message: string = 'File upload failed',
    context?: ErrorContext
  ) {
    super(message, 'FILE_UPLOAD_ERROR', 'error', 400, context);
  }
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorReportingEnabled: boolean = process.env.NODE_ENV === 'production';
  private logLevel: ErrorLevel = (process.env.LOG_LEVEL as ErrorLevel) || 'error';

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  public log(error: Error | AppError, context?: ErrorContext): void {
    const errorDetails = this.extractErrorDetails(error, context);
    
    // Console logging (always enabled in development)
    if (process.env.NODE_ENV === 'development' || this.shouldLog(errorDetails.level)) {
      console.error('Error:', {
        message: errorDetails.message,
        code: errorDetails.code,
        level: errorDetails.level,
        context: errorDetails.context,
        stack: errorDetails.stack,
        timestamp: new Date().toISOString(),
      });
    }

    // Send to external monitoring service in production
    if (this.errorReportingEnabled && this.shouldReport(errorDetails.level)) {
      this.reportError(errorDetails);
    }
  }

  public handleApiError(error: unknown, context?: ErrorContext): NextResponse {
    const appError = this.normalizeError(error, context);
    
    // Log the error
    this.log(appError, context);

    // Return appropriate response
    const response = {
      success: false,
      error: appError.message,
      code: appError.code,
      ...(appError instanceof ValidationError && {
        validationErrors: appError.validationErrors,
      }),
      ...(process.env.NODE_ENV === 'development' && {
        stack: appError.stack,
      }),
    };

    return NextResponse.json(response, { status: appError.statusCode });
  }

  public normalizeError(error: unknown, context?: ErrorContext): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof ZodError) {
      const validationErrors = error.flatten().fieldErrors;
      return new ValidationError(
        'Input validation failed',
        validationErrors as Record<string, string[]>,
        context
      );
    }

    if (error instanceof MongoError) {
      return new DatabaseError(
        this.getMongoErrorMessage(error),
        context
      );
    }

    if (error instanceof Error) {
      // Check for specific error patterns
      if (error.message.includes('duplicate key')) {
        return new ValidationError(
          'A record with this information already exists',
          {},
          context
        );
      }

      if (error.message.includes('unauthorized') || error.message.includes('auth')) {
        return new AuthenticationError(error.message, context);
      }

      if (error.message.includes('forbidden') || error.message.includes('access')) {
        return new AuthorizationError(error.message, context);
      }

      if (error.message.includes('not found')) {
        return new NotFoundError(error.message, context);
      }

      if (error.message.includes('payment') || error.message.includes('stripe')) {
        return new PaymentError(error.message, context);
      }

      return new AppError(
        error.message,
        'UNKNOWN_ERROR',
        'error',
        500,
        context
      );
    }

    return new AppError(
      'An unexpected error occurred',
      'UNKNOWN_ERROR',
      'error',
      500,
      context
    );
  }

  private extractErrorDetails(error: Error | AppError, context?: ErrorContext): ErrorDetails {
    if (error instanceof AppError) {
      return {
        message: error.message,
        code: error.code,
        level: error.level,
        context: error.context || context,
        stack: error.stack,
        originalError: error,
      };
    }

    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
      level: 'error',
      context,
      stack: error.stack,
      originalError: error,
    };
  }

  private shouldLog(level: ErrorLevel): boolean {
    const levels = { info: 0, warning: 1, error: 2, critical: 3 };
    return levels[level] >= levels[this.logLevel];
  }

  private shouldReport(level: ErrorLevel): boolean {
    // Only report warnings and above in production
    return level === 'warning' || level === 'error' || level === 'critical';
  }

  private getMongoErrorMessage(error: MongoError): string {
    switch (error.code) {
      case 11000:
        return 'Duplicate entry - this information already exists';
      case 11001:
        return 'Duplicate key error';
      case 13:
        return 'Database access denied';
      case 18:
        return 'Authentication failed';
      default:
        return 'Database operation failed';
    }
  }

  private reportError(errorDetails: ErrorDetails): void {
    // In production, integrate with error monitoring service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    
    // For now, we'll just log to console in production
    // In a real app, replace this with your monitoring service
    if (process.env.NODE_ENV === 'production') {
      console.error('Production Error Report:', {
        ...errorDetails,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      });
    }
  }
}

// Singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Utility functions for common error scenarios
export const handleDatabaseError = (error: unknown, context?: ErrorContext) => {
  return errorHandler.handleApiError(error, context);
};

export const handleValidationError = (error: unknown, context?: ErrorContext) => {
  return errorHandler.handleApiError(error, context);
};

export const handleAuthError = (error: unknown, context?: ErrorContext) => {
  return errorHandler.handleApiError(error, context);
};

export const handlePaymentError = (error: unknown, context?: ErrorContext) => {
  return errorHandler.handleApiError(error, context);
};

export const createErrorContext = (
  request: Request,
  userId?: string,
  userEmail?: string
): ErrorContext => {
  return {
    userId,
    userEmail,
    route: new URL(request.url).pathname,
    method: request.method,
    timestamp: new Date(),
    userAgent: request.headers.get('user-agent') || undefined,
    ip: request.headers.get('x-forwarded-for') || 
        request.headers.get('x-real-ip') || 
        'unknown',
  };
};