import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToMongoDB, Will } from '@/lib/models';
import { Types } from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ willId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { willId } = await params;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!Types.ObjectId.isValid(willId)) {
      return NextResponse.json(
        { error: 'Invalid will ID' },
        { status: 400 }
      );
    }

    await connectToMongoDB();

    const will = await Will.findOne({
      _id: willId,
      userId: session.user.id
    });

    if (!will) {
      return NextResponse.json(
        { error: 'Will not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(will);

  } catch (error) {
    console.error('Error fetching will:', error);
    return NextResponse.json(
      { error: 'Failed to fetch will' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ willId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { willId } = await params;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!Types.ObjectId.isValid(willId)) {
      return NextResponse.json(
        { error: 'Invalid will ID' },
        { status: 400 }
      );
    }

    const updateData = await request.json();

    await connectToMongoDB();

    const will = await Will.findOneAndUpdate(
      {
        _id: willId,
        userId: session.user.id
      },
      {
        ...updateData,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!will) {
      return NextResponse.json(
        { error: 'Will not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(will);

  } catch (error) {
    console.error('Error updating will:', error);
    return NextResponse.json(
      { error: 'Failed to update will' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ willId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { willId } = await params;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!Types.ObjectId.isValid(willId)) {
      return NextResponse.json(
        { error: 'Invalid will ID' },
        { status: 400 }
      );
    }

    await connectToMongoDB();

    const will = await Will.findOneAndDelete({
      _id: willId,
      userId: session.user.id
    });

    if (!will) {
      return NextResponse.json(
        { error: 'Will not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Will deleted successfully' });

  } catch (error) {
    console.error('Error deleting will:', error);
    return NextResponse.json(
      { error: 'Failed to delete will' },
      { status: 500 }
    );
  }
}