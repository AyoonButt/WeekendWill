import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  // Only allow in production for debugging
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.json({ error: 'Debug endpoint only available in production' }, { status: 403 });
  }

  try {
    console.log('=== REGISTRATION DEBUG START ===');
    
    // Check if we can get the request body
    let body;
    try {
      body = await request.json();
      console.log('Request body received:', { email: body.email, hasPassword: !!body.password });
    } catch (error) {
      console.error('Failed to parse request body:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid request body',
        step: 'body_parsing'
      }, { status: 400 });
    }

    // Check environment variables
    const envCheck = {
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoDbName: process.env.MONGODB_DB || 'weekend-will',
      nodeEnv: process.env.NODE_ENV,
    };
    console.log('Environment check:', envCheck);

    if (!envCheck.hasMongoUri) {
      return NextResponse.json({
        success: false,
        error: 'MongoDB URI not configured',
        step: 'env_check',
        envCheck
      }, { status: 500 });
    }

    // Test database connection
    let dbConnection;
    try {
      console.log('Attempting database connection...');
      dbConnection = await connectToDatabase();
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        step: 'db_connection',
        dbError: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }

    // Test database operations
    try {
      console.log('Testing database operations...');
      const { db } = dbConnection;
      
      // Test if we can query users collection
      const userCount = await db.collection('users').countDocuments();
      console.log('Users collection accessible, count:', userCount);
      
      // Test if user exists
      if (body.email) {
        const existingUser = await db.collection('users').findOne({ 
          email: body.email.toLowerCase() 
        });
        console.log('User exists check:', !!existingUser);
      }

    } catch (error) {
      console.error('Database operation failed:', error);
      return NextResponse.json({
        success: false,
        error: 'Database operation failed',
        step: 'db_operations',
        dbError: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }

    console.log('=== REGISTRATION DEBUG END - ALL CHECKS PASSED ===');

    return NextResponse.json({
      success: true,
      message: 'All registration prerequisites are working',
      checks: {
        bodyParsing: 'ok',
        environment: 'ok',
        dbConnection: 'ok',
        dbOperations: 'ok'
      }
    });

  } catch (error) {
    console.error('Debug registration error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      step: 'general_error'
    }, { status: 500 });
  }
}