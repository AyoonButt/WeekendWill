import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToMongoDB, Will } from '@/lib/models';
import { cache } from '@/lib/cache';

export async function GET(_request: NextRequest) {
  try {
    // Parallel execution for better performance
    const [session] = await Promise.all([
      getServerSession(authOptions),
      connectToMongoDB()
    ]);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check cache first
    const cacheKey = `wills:${session.user.id}`;
    const cachedWills = cache.get(cacheKey);
    
    if (cachedWills) {
      return NextResponse.json(cachedWills);
    }

    const wills = await Will.find({
      userId: session.user.id
    })
    .select('_id status stateCompliance progress.percentComplete createdAt updatedAt')
    .sort({ updatedAt: -1 })
    .limit(50) // Limit results for performance
    .lean(); // Use lean for better performance

    const formattedWills = wills.map(will => ({
      id: (will._id as any).toString(),
      status: will.status,
      stateCompliance: will.stateCompliance,
      progress: will.progress,
      createdAt: will.createdAt,
      updatedAt: will.updatedAt
    }));

    // Cache for 2 minutes
    cache.set(cacheKey, formattedWills, 120);

    return NextResponse.json(formattedWills);

  } catch (error) {
    console.error('Error fetching wills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wills' },
      { status: 500 }
    );
  }
}