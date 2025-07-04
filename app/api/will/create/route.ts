import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToMongoDB, Will } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    // Parallel execution of session and connection
    const [session, , requestBody] = await Promise.all([
      getServerSession(authOptions),
      connectToMongoDB(),
      request.json()
    ]);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { stateCompliance } = requestBody;

    if (!stateCompliance) {
      return NextResponse.json(
        { error: 'State compliance is required' },
        { status: 400 }
      );
    }

    // Create new will with minimal structure (defaults handled by schema)
    const savedWill = await Will.create({
      userId: session.user.id,
      status: 'draft',
      stateCompliance
    });

    return NextResponse.json({
      id: savedWill._id.toString(),
      message: 'Will created successfully'
    });

  } catch (error) {
    console.error('Error creating will:', error);
    return NextResponse.json(
      { error: 'Failed to create will' },
      { status: 500 }
    );
  }
}