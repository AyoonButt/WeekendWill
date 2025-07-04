import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { dbService } from '@/lib/mongodb';
import { isValidEmail } from '@/utils';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  sponsorCode: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
  acceptPrivacy: z.boolean().refine((val) => val === true, 'You must accept the privacy policy'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      const details: Record<string, string[]> = {};
      
      // Filter out undefined values
      for (const [key, value] of Object.entries(fieldErrors)) {
        if (value && Array.isArray(value)) {
          details[key] = value;
        }
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details
        },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, password, sponsorCode } = validationResult.data;

    // Additional email validation
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await dbService.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Validate sponsor code if provided
    let sponsorValid = true;
    if (sponsorCode) {
      // Add sponsor code validation logic here
      // For now, we'll just check if it's not empty
      sponsorValid = sponsorCode.trim().length > 0;
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const userData = {
      email: email.toLowerCase(),
      hashedPassword,
      sponsorCode: sponsorCode || null,
      profile: {
        firstName,
        lastName,
      },
      subscription: {
        plan: 'essential',
        status: 'inactive',
      },
      role: 'user',
      emailVerified: null, // Will be set when email is verified
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await dbService.createUser(userData);

    if (!result.acknowledged) {
      throw new Error('Failed to create user');
    }

    // Return success (without sensitive data)
    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      data: {
        id: result.insertedId,
        email: email.toLowerCase(),
        name: `${firstName} ${lastName}`,
      }
    });

  } catch (error) {
    console.error('=== REGISTRATION ERROR ===');
    console.error('Error details:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    console.error('Environment check:', {
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoDbName: process.env.MONGODB_DB || 'weekend-will',
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV
    });
    console.error('=== END REGISTRATION ERROR ===');
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Registration failed. Please try again.',
        debug: process.env.NODE_ENV === 'production' && error instanceof Error ? error.message : undefined,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// GET method for checking registration status or requirements
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { success: false, error: 'Email parameter is required' },
      { status: 400 }
    );
  }

  try {
    const existingUser = await dbService.getUserByEmail(email);
    
    return NextResponse.json({
      success: true,
      data: {
        exists: !!existingUser,
        verified: existingUser?.emailVerified ? true : false,
      }
    });
  } catch (error) {
    console.error('Email check error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check email' },
      { status: 500 }
    );
  }
}