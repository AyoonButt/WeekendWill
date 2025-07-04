import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { dbService } from '@/lib/mongodb';

const verifyTokenSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = verifyTokenSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          valid: false,
          error: 'Invalid token format',
        },
        { status: 400 }
      );
    }

    const { token } = validationResult.data;

    // Find user with this reset token
    const db = await dbService.getDatabase();
    const user = await db.collection('users').findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }, // Token hasn't expired
    });

    return NextResponse.json({
      valid: !!user,
    });

  } catch (error) {
    console.error('Verify reset token error:', error);
    
    return NextResponse.json(
      { 
        valid: false,
        error: 'Failed to verify token',
      },
      { status: 500 }
    );
  }
}