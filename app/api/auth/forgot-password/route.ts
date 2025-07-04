import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { dbService } from '@/lib/mongodb';
import crypto from 'crypto';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = forgotPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid email address',
        },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Check if user exists
    const user = await dbService.getUserByEmail(email);
    
    // Always return success to prevent email enumeration attacks
    // Don't reveal whether the user exists or not
    const response = {
      success: true,
      message: 'If an account with that email exists, you will receive a password reset link.',
    };

    // Only send email if user actually exists
    if (user) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Save reset token to user
      await dbService.updateUser(user._id.toString(), {
        resetToken,
        resetTokenExpiry,
      });

      // In a real app, you would send an email here
      // For now, we'll just log it (remove in production)
      console.log('Password reset requested for:', email);
      console.log('Reset token:', resetToken);
      console.log('Reset URL would be:', `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`);
      
      // TODO: Implement email sending
      // await sendPasswordResetEmail(email, resetToken);
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Forgot password error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process password reset request',
      },
      { status: 500 }
    );
  }
}