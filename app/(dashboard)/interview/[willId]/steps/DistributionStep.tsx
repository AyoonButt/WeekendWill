'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HeartIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Input, Select, Button, Card } from '@/components/ui';
import { InterviewStep } from '@/components/forms';
import { RELATIONSHIP_TYPES } from '@/utils/constants';
import { generateId } from '@/utils';

const beneficiarySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  percentage: z.number().min(1, 'Percentage must be at least 1').max(100, 'Percentage cannot exceed 100'),
});

const distributionSchema = z.object({
  beneficiaries: z.array(beneficiarySchema).min(1, 'At least one beneficiary is required'),
});

type DistributionData = z.infer<typeof distributionSchema>;

interface DistributionStepProps {
  willData: any;
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  completedSteps: number[];
  onNext: (data: any) => void;
  onBack: () => void;
  canProceed: (data: any) => boolean;
  isSaving: boolean;
}

const DistributionStep: React.FC<DistributionStepProps> = ({
  willData,
  currentStep,
  totalSteps,
  stepLabels,
  completedSteps,
  onNext,
  onBack,
  canProceed,
  isSaving
}) => {
  const [beneficiaries, setBeneficiaries] = useState([
    { id: generateId(), name: '', relationship: '', percentage: 100 }
  ]);

  useEffect(() => {
    // Load existing data if available
    if (willData.sections.residualEstate?.beneficiaries?.length > 0) {
      setBeneficiaries(willData.sections.residualEstate.beneficiaries.map((b: any) => ({
        id: b.id || generateId(),
        name: b.name || '',
        relationship: b.relationship || '',
        percentage: b.percentage || 0,
      })));
    }
  }, [willData]);

  const addBeneficiary = () => {
    setBeneficiaries([...beneficiaries, { 
      id: generateId(), 
      name: '', 
      relationship: '', 
      percentage: 0 
    }]);
  };

  const removeBeneficiary = (index: number) => {
    if (beneficiaries.length > 1) {
      setBeneficiaries(beneficiaries.filter((_, i) => i !== index));
    }
  };

  const updateBeneficiary = (index: number, field: string, value: any) => {
    const updated = beneficiaries.map((b, i) => 
      i === index ? { ...b, [field]: value } : b
    );
    setBeneficiaries(updated);
  };

  const getTotalPercentage = () => {
    return beneficiaries.reduce((sum, b) => sum + (b.percentage || 0), 0);
  };

  const handleNext = () => {
    const totalPercentage = getTotalPercentage();
    if (totalPercentage === 100 && beneficiaries.every(b => b.name && b.relationship)) {
      onNext({ residualEstate: { beneficiaries } });
    }
  };

  const isValid = getTotalPercentage() === 100 && beneficiaries.every(b => b.name && b.relationship);

  return (
    <InterviewStep
      title="How should your assets be distributed?"
      description="Tell us who should inherit your assets and what percentage each person should receive."
      currentStep={currentStep}
      totalSteps={totalSteps}
      stepLabels={stepLabels}
      completedSteps={completedSteps}
      onNext={handleNext}
      onBack={onBack}
      canProceed={isValid}
    >
      <div className="space-y-6">
        <div className="text-center">
          <HeartIcon className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-charcoal-900 mb-2">
            Distribution of Assets
          </h3>
          <p className="text-charcoal-600">
            This covers all assets not specifically mentioned elsewhere in your will.
          </p>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-charcoal-900">
              Beneficiaries
            </h4>
            <div className={`text-sm px-3 py-1 rounded-full ${
              getTotalPercentage() === 100 
                ? 'bg-success-100 text-success-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              Total: {getTotalPercentage()}%
            </div>
          </div>

          <div className="space-y-4">
            {beneficiaries.map((beneficiary, index) => (
              <div key={beneficiary.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-medium text-charcoal-900">
                    Beneficiary {index + 1}
                  </h5>
                  {beneficiaries.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBeneficiary(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Full Name"
                    value={beneficiary.name}
                    onChange={(value) => updateBeneficiary(index, 'name', value)}
                    placeholder="Enter full name"
                    required
                  />

                  <Select
                    label="Relationship"
                    options={RELATIONSHIP_TYPES}
                    value={beneficiary.relationship}
                    onChange={(value) => updateBeneficiary(index, 'relationship', value)}
                    required
                  />

                  <Input
                    label="Percentage"
                    type="number"
                    value={beneficiary.percentage}
                    onChange={(event) => updateBeneficiary(index, 'percentage', parseInt(event.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    max="100"
                    required
                  />
                </div>
              </div>
            ))}

            <Button variant="outline" onClick={addBeneficiary} className="w-full">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Another Beneficiary
            </Button>
          </div>

          {getTotalPercentage() !== 100 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ The total percentage must equal 100%. 
                {getTotalPercentage() < 100 && ` You need to allocate ${100 - getTotalPercentage()}% more.`}
                {getTotalPercentage() > 100 && ` You've allocated ${getTotalPercentage() - 100}% too much.`}
              </p>
            </div>
          )}
        </Card>

        <Card className="p-6 bg-blue-50 border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">
            💡 Distribution Tips
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Percentages must add up to exactly 100%</li>
            <li>• If a beneficiary predeceases you, their share typically goes to the others</li>
            <li>• You can specify contingent beneficiaries in the next step</li>
            <li>• Specific gifts to individuals will be distributed before these percentages</li>
          </ul>
        </Card>

        {isSaving && (
          <div className="flex items-center text-sm text-charcoal-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
            Saving changes...
          </div>
        )}
      </div>
    </InterviewStep>
  );
};

export default DistributionStep;