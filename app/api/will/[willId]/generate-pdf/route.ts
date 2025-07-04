import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToMongoDB, Will } from '@/lib/models';
import { Types } from 'mongoose';
import jsPDF from 'jspdf';

export async function POST(
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

    // Generate PDF
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Helper function to add text with automatic line breaks
    const addText = (text: string, fontSize = 12, isBold = false) => {
      pdf.setFontSize(fontSize);
      if (isBold) {
        pdf.setFont(undefined, 'bold');
      } else {
        pdf.setFont(undefined, 'normal');
      }
      
      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
      pdf.text(lines, margin, yPosition);
      yPosition += lines.length * (fontSize * 0.4) + 10;
      
      // Check if we need a new page
      if (yPosition > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        yPosition = margin;
      }
    };

    // Header
    addText('LAST WILL AND TESTAMENT', 18, true);
    addText(`State Compliance: ${will.stateCompliance}`, 10);
    yPosition += 10;

    // Personal Information
    addText('PERSONAL INFORMATION', 14, true);
    if (will.sections.testator) {
      const testator = will.sections.testator;
      addText(`Name: ${testator.firstName} ${testator.lastName}`);
      addText(`Date of Birth: ${testator.dateOfBirth ? new Date(testator.dateOfBirth).toLocaleDateString() : 'Not provided'}`);
      addText(`Email: ${testator.email}`);
      if (testator.address) {
        addText(`Address: ${testator.address.street}, ${testator.address.city}, ${testator.address.state} ${testator.address.zipCode}`);
      }
      addText(`Marital Status: ${testator.maritalStatus || 'Not specified'}`);
    }
    yPosition += 10;

    // Family Information
    if (will.sections.spouse || will.sections.children?.length > 0) {
      addText('FAMILY INFORMATION', 14, true);
      
      if (will.sections.spouse) {
        const spouse = will.sections.spouse;
        addText(`Spouse: ${spouse.firstName} ${spouse.lastName}`);
      }
      
      if (will.sections.children?.length > 0) {
        addText('Children:');
        will.sections.children.forEach((child: any, index: number) => {
          addText(`  ${index + 1}. ${child.firstName} ${child.lastName} (${child.relationship || 'child'})`);
        });
      }
      yPosition += 10;
    }

    // Assets
    if (will.sections.realProperty?.length > 0 || will.sections.personalProperty?.length > 0) {
      addText('ASSETS', 14, true);
      
      if (will.sections.realProperty?.length > 0) {
        addText('Real Estate:', 12, true);
        will.sections.realProperty.forEach((property: any, index: number) => {
          addText(`  ${index + 1}. ${property.type}: ${property.description}`);
          if (property.address) {
            addText(`     Address: ${property.address.street}, ${property.address.city}, ${property.address.state} ${property.address.zipCode}`);
          }
          if (property.estimatedValue) {
            addText(`     Estimated Value: $${property.estimatedValue.toLocaleString()}`);
          }
        });
      }
      
      if (will.sections.personalProperty?.length > 0) {
        addText('Personal Assets:', 12, true);
        will.sections.personalProperty.forEach((asset: any, index: number) => {
          addText(`  ${index + 1}. ${asset.type}: ${asset.description}`);
          if (asset.estimatedValue) {
            addText(`     Estimated Value: $${asset.estimatedValue.toLocaleString()}`);
          }
        });
      }
      yPosition += 10;
    }

    // Distribution
    if (will.sections.residualEstate?.beneficiaries?.length > 0) {
      addText('DISTRIBUTION OF ASSETS', 14, true);
      addText('I give, devise, and bequeath my residual estate to the following beneficiaries:');
      will.sections.residualEstate.beneficiaries.forEach((beneficiary: any, index: number) => {
        addText(`  ${index + 1}. ${beneficiary.name} (${beneficiary.relationship}): ${beneficiary.percentage}%`);
      });
      yPosition += 10;
    }

    // Executors
    if (will.sections.executors?.length > 0) {
      addText('EXECUTORS', 14, true);
      addText('I appoint the following person(s) as executor(s) of this will:');
      will.sections.executors.forEach((executor: any, index: number) => {
        addText(`  ${index + 1}. ${executor.firstName} ${executor.lastName} (${executor.relationship})`);
      });
      yPosition += 10;
    }

    // Guardians
    if (will.sections.guardians?.length > 0) {
      addText('GUARDIANS', 14, true);
      addText('If I have minor children at the time of my death, I appoint the following person(s) as guardian(s):');
      will.sections.guardians.forEach((guardian: any, index: number) => {
        addText(`  ${index + 1}. ${guardian.firstName} ${guardian.lastName} (${guardian.relationship})`);
      });
      yPosition += 10;
    }

    // Legal clauses
    addText('LEGAL PROVISIONS', 14, true);
    addText('1. I revoke all prior wills and codicils made by me.');
    addText('2. If any beneficiary dies before me, their share shall be distributed equally among the surviving beneficiaries.');
    addText('3. I direct that all my just debts, funeral expenses, and costs of administration be paid as soon as practicable after my death.');
    addText('4. This will shall be governed by the laws of the state indicated above.');
    yPosition += 20;

    // Signature section
    addText('EXECUTION', 14, true);
    addText('I declare that this is my Last Will and Testament, and I sign it willingly.');
    yPosition += 30;
    addText('_' + '_'.repeat(50));
    addText(`${will.sections.testator?.firstName || ''} ${will.sections.testator?.lastName || ''}, Testator`);
    addText(`Date: _________________`);
    yPosition += 20;

    // Witnesses section
    addText('WITNESSES', 14, true);
    addText('We, the undersigned witnesses, each do hereby declare in the presence of the aforesaid testator that the testator signed and executed this instrument as the testator\'s Last Will and Testament and that each of us, in the presence and hearing of the testator, hereby signs this will as witness to the testator\'s signing, and that to the best of our knowledge the testator is eighteen years of age or over, of sound mind and under no constraint or undue influence.');
    yPosition += 20;

    addText('Witness 1:');
    addText('_' + '_'.repeat(50));
    addText('Signature                                    Date');
    addText('_' + '_'.repeat(50));
    addText('Print Name');
    yPosition += 10;

    addText('Witness 2:');
    addText('_' + '_'.repeat(50));
    addText('Signature                                    Date');
    addText('_' + '_'.repeat(50));
    addText('Print Name');

    // Add watermark if draft
    if (will.status === 'draft') {
      pdf.setTextColor(200, 200, 200);
      pdf.setFontSize(60);
      pdf.text('DRAFT', pageWidth / 2, pdf.internal.pageSize.getHeight() / 2, {
        align: 'center',
        angle: 45
      });
    }

    // Generate PDF buffer
    const pdfBuffer = pdf.output('arraybuffer');

    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="will-${will._id}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}