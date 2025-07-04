import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { dbService } from '@/lib/mongodb';

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = resetPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      return NextResponse.json(
        { 
          success: false,
          error: 'Validation failed',
          details: fieldErrors,
        },
        { status: 400 }
      );
    }

    const { token, password } = validationResult.data;

    // Find user with this reset token
    const db = await dbService.getDatabase();
    const user = await db.collection('users').findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }, // Token hasn't expired
    });

    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid or expired reset token',
        },
        { status: 400 }
      );
    }

    // Hash the new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user password and clear reset token
    await dbService.updateUser(user._id.toString(), {
      hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully',
    });

  } catch (error) {
    console.error('Reset password error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to reset password',
      },
      { status: 500 }
    );
  }
}