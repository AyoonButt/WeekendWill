"use client";

import React from "react";
import { Card, Button } from "@/components/ui";
import { ReviewStep as ReviewStepWrapper } from "@/components/forms";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

interface ReviewStepProps {
  willData: any;
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  completedSteps: number[];
  onNext: (data?: any) => void;
  onBack: () => void;
  canProceed: (data: any) => boolean;
  isSaving: boolean;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  willData,
  currentStep,
  totalSteps,
  stepLabels,
  completedSteps,
  onNext,
  onBack,
  canProceed,
  isSaving,
}) => {
  // You can expand this summary as needed
  return (
    <ReviewStepWrapper
      currentStep={currentStep}
      totalSteps={totalSteps}
      stepLabels={stepLabels}
      completedSteps={completedSteps}
      onNext={() => onNext()}
      onBack={onBack}
      canProceed={canProceed(willData) && !isSaving}
    >
      <div className="space-y-8">
        <div className="text-center">
          <CheckCircleIcon className="w-16 h-16 text-success-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-charcoal-900 mb-2">
            Review & Finalize
          </h2>
          <p className="text-charcoal-600">
            Please review your information below. You can go back to make changes if needed.
          </p>
        </div>
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Personal Information</h3>
          <div className="text-charcoal-700">
            <div><b>Name:</b> {willData.sections.testator?.firstName} {willData.sections.testator?.lastName}</div>
            <div><b>Email:</b> {willData.sections.testator?.email}</div>
            <div><b>Address:</b> {willData.sections.testator?.address?.street}, {willData.sections.testator?.address?.city}, {willData.sections.testator?.address?.state} {willData.sections.testator?.address?.zipCode}</div>
          </div>
          <h3 className="text-lg font-semibold text-charcoal-900 mt-4 mb-2">Family</h3>
          <div className="text-charcoal-700">
            <div><b>Spouse:</b> {willData.sections.spouse?.firstName} {willData.sections.spouse?.lastName}</div>
            <div><b>Children:</b> {willData.sections.children?.map((child: any) => `${child.firstName} ${child.lastName}`).join(", ")}</div>
          </div>
          <h3 className="text-lg font-semibold text-charcoal-900 mt-4 mb-2">Executors</h3>
          <div className="text-charcoal-700">
            <div>{willData.sections.executors?.map((exec: any) => `${exec.firstName} ${exec.lastName} (${exec.relationship})`).join(", ")}</div>
          </div>
          <h3 className="text-lg font-semibold text-charcoal-900 mt-4 mb-2">Guardians</h3>
          <div className="text-charcoal-700">
            <div>{willData.sections.guardians?.map((g: any) => `${g.firstName} ${g.lastName} (${g.relationship})`).join(", ")}</div>
          </div>
          <h3 className="text-lg font-semibold text-charcoal-900 mt-4 mb-2">Distribution</h3>
          <div className="text-charcoal-700">
            <div>{willData.sections.residualEstate?.beneficiaries?.map((b: any) => `${b.name} (${b.percentage}%)`).join(", ")}</div>
          </div>
        </Card>
        <div className="text-center">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={onNext}
            disabled={!canProceed(willData) || isSaving}
          >
            Complete
          </Button>
        </div>
      </div>
    </ReviewStepWrapper>
  );
};

export default ReviewStep; 