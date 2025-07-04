import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToMongoDB, Will } from '@/lib/models';
import { Types } from 'mongoose';

export async function PUT(
  request: NextRequest,
  { params }: { params: { willId: string } }
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

    const { section, data } = await request.json();

    if (!section || !data) {
      return NextResponse.json(
        { error: 'Section and data are required' },
        { status: 400 }
      );
    }

    await connectToMongoDB();

    // Find the will first
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

    // Update the specific section
    const updateObject: any = { updatedAt: new Date() };
    
    switch (section) {
      case 'personal-info':
        updateObject['sections.testator'] = data;
        break;
      case 'family':
        if (data.spouse) {
          updateObject['sections.spouse'] = data.spouse;
        }
        if (data.children) {
          updateObject['sections.children'] = data.children;
        }
        break;
      case 'assets':
        if (data.realProperty) {
          updateObject['sections.realProperty'] = data.realProperty;
        }
        if (data.personalProperty) {
          updateObject['sections.personalProperty'] = data.personalProperty;
        }
        break;
      case 'distribution':
        if (data.residualEstate) {
          updateObject['sections.residualEstate'] = data.residualEstate;
        }
        break;
      case 'executors':
        if (data.executors) {
          updateObject['sections.executors'] = data.executors;
        }
        if (data.guardians) {
          updateObject['sections.guardians'] = data.guardians;
        }
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid section' },
          { status: 400 }
        );
    }

    // Update completed sections
    const completedSections = new Set(will.progress.completedSections);
    completedSections.add(section);
    updateObject['progress.completedSections'] = Array.from(completedSections);
    updateObject['progress.currentSection'] = section;
    updateObject['progress.percentComplete'] = Math.round((completedSections.size / 6) * 100);

    const updatedWill = await Will.findOneAndUpdate(
      {
        _id: willId,
        userId: session.user.id
      },
      updateObject,
      { new: true }
    );

    return NextResponse.json(updatedWill);

  } catch (error) {
    console.error('Error updating will section:', error);
    return NextResponse.json(
      { error: 'Failed to update will section' },
      { status: 500 }
    );
  }
}