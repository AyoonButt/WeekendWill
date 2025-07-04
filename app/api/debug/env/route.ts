import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  // Only allow in production for debugging deployment issues
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.json({ error: 'Debug endpoint only available in production' }, { status: 403 });
  }

  try {
    // Check environment variables (without exposing sensitive data)
    const envCheck = {
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoUriPrefix: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'missing',
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      nodeEnv: process.env.NODE_ENV,
      mongoDbName: process.env.MONGODB_DB || 'weekend-will',
      nextAuthUrl: process.env.NEXTAUTH_URL,
      vercelUrl: process.env.VERCEL_URL,
      vercelEnv: process.env.VERCEL_ENV,
    };

    // Test database connection
    let dbStatus = 'unknown';
    let dbError = null;
    
    try {
      const { db } = await connectToDatabase();
      // Simple ping to test connection
      await db.admin().ping();
      dbStatus = 'connected';
    } catch (error) {
      dbStatus = 'failed';
      dbError = error instanceof Error ? error.message : 'Unknown error';
    }

    return NextResponse.json({
      success: true,
      environment: envCheck,
      database: {
        status: dbStatus,
        error: dbError,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}