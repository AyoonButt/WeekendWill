'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/Toast';
import { InterviewPageContainer } from '@/components/layout';

// Import interview steps
import PersonalInfoStep from './steps/PersonalInfoStep';
import FamilyStep from './steps/FamilyStep';
import AssetsStep from './steps/AssetsStep';
import DistributionStep from './steps/DistributionStep';
import ExecutorsStep from './steps/ExecutorsStep';
import ReviewStep from './steps/ReviewStep';

interface WillData {
  id?: string;
  userId?: string;
  status: 'draft' | 'completed' | 'executed';
  stateCompliance: string;
  sections: {
    testator?: any;
    spouse?: any;
    children: any[];
    executors: any[];
    guardians: any[];
    realProperty: any[];
    personalProperty: any[];
    specificGifts: any[];
    residualEstate?: any;
    pets: any[];
    arrangements: any[];
    digitalExecutors: any[];
  };
  progress: {
    completedSections: string[];
    currentSection: string;
    percentComplete: number;
  };
}

const InterviewPage: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { showSuccess, showError } = useToast();

  const willId = params.willId as string;
  const currentStepParam = searchParams.get('step') || 'personal-info';

  const [willData, setWillData] = useState<WillData>({
    status: 'draft',
    stateCompliance: 'CA',
    sections: {
      children: [],
      executors: [],
      guardians: [],
      realProperty: [],
      personalProperty: [],
      specificGifts: [],
      pets: [],
      arrangements: [],
      digitalExecutors: []
    },
    progress: {
      completedSections: [],
      currentSection: 'personal-info',
      percentComplete: 0
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const steps = [
    { id: 'personal-info', title: 'Personal Information', component: PersonalInfoStep },
    { id: 'family', title: 'Family & Relationships', component: FamilyStep },
    { id: 'assets', title: 'Assets & Property', component: AssetsStep },
    { id: 'distribution', title: 'Distribution', component: DistributionStep },
    { id: 'executors', title: 'Executors & Guardians', component: ExecutorsStep },
    { id: 'review', title: 'Review & Complete', component: ReviewStep }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStepParam);
  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    if (session?.user?.id) {
      loadWillData();
    }
  }, [session, willId]);

  const loadWillData = async () => {
    try {
      setIsLoading(true);

      if (willId === 'new') {
        // Create new will
        const newWill = await createNewWill();
        router.replace(`/interview/${newWill.id}?step=personal-info`);
        return;
      }

      // Load existing will data
      const response = await fetch(`/api/will/${willId}`);
      if (response.ok) {
        const data = await response.json();
        setWillData(data);
      } else {
        throw new Error('Failed to load will data');
      }
    } catch (error) {
      console.error('Error loading will data:', error);
      showError('Error loading will', 'Please try again or contact support');
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewWill = async (): Promise<{ id: string }> => {
    const response = await fetch('/api/will/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stateCompliance: 'CA', // Default, can be changed later
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create will');
    }

    return await response.json();
  };

  const saveWillData = async (sectionData: any, sectionId: string) => {
    try {
      setIsSaving(true);

      const response = await fetch(`/api/will/${willId}/section`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section: sectionId,
          data: sectionData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save will data');
      }

      const updatedWill = await response.json();
      setWillData(updatedWill);
      
      showSuccess('Progress saved', 'Your changes have been saved automatically');
    } catch (error) {
      console.error('Error saving will data:', error);
      showError('Save failed', 'Please try again');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async (stepData: any) => {
    // Save current step data
    await saveWillData(stepData, currentStep.id);

    // Navigate to next step
    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < steps.length) {
      const nextStep = steps[nextStepIndex];
      router.push(`/interview/${willId}?step=${nextStep.id}`);
    }
  };

  const handleBack = () => {
    const prevStepIndex = currentStepIndex - 1;
    if (prevStepIndex >= 0) {
      const prevStep = steps[prevStepIndex];
      router.push(`/interview/${willId}?step=${prevStep.id}`);
    }
  };

  const canProceed = (stepData: any): boolean => {
    // Basic validation - each step component will provide its own validation
    switch (currentStep.id) {
      case 'personal-info':
        return !!(stepData?.firstName && stepData?.lastName && stepData?.address?.state);
      case 'family':
        return true; // Family step is optional
      case 'assets':
        return true; // Assets step is optional
      case 'distribution':
        return !!(stepData?.beneficiaries && stepData.beneficiaries.length > 0);
      case 'executors':
        return !!(stepData?.executors && stepData.executors.length > 0);
      case 'review':
        return true;
      default:
        return false;
    }
  };

  if (isLoading) {
    return (
      <InterviewPageContainer>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-charcoal-600">Loading your will...</p>
          </div>
        </div>
      </InterviewPageContainer>
    );
  }

  if (!currentStep) {
    return (
      <InterviewPageContainer>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-charcoal-900 mb-4">
            Step not found
          </h1>
          <p className="text-charcoal-600 mb-8">
            The requested step could not be found.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn btn-primary"
          >
            Return to Dashboard
          </button>
        </div>
      </InterviewPageContainer>
    );
  }

  const StepComponent = currentStep.component;

  return (
    <InterviewPageContainer>
      <StepComponent
        willData={willData}
        currentStep={currentStepIndex + 1}
        totalSteps={steps.length}
        stepLabels={steps.map(s => s.title)}
        completedSteps={willData.progress.completedSections.map(section => 
          steps.findIndex(s => s.id === section) + 1
        ).filter(index => index > 0)}
        onNext={(data?: any) => { void handleNext(data); }}
        onBack={handleBack}
        canProceed={canProceed}
        isSaving={isSaving}
      />
    </InterviewPageContainer>
  );
};

export default InterviewPage;