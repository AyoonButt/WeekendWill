import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Only create if user doesn't exist
    const { db } = await connectToDatabase();
    const existingUser = await db.collection('users').findOne({
      email: session.user.email.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json({
        userId: existingUser._id.toString(),
        exists: true
      });
    }

    // Create new user
    const newUser = {
      email: session.user.email.toLowerCase(),
      profile: {
        firstName: session.user.name?.split(' ')[0] || '',
        lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
      },
      image: session.user.image,
      role: 'user',
      subscription: {
        plan: 'essential',
        status: 'inactive',
      },
      emailVerified: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('users').insertOne(newUser);

    return NextResponse.json({
      userId: result.insertedId.toString(),
      exists: false
    });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}