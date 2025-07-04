'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Select, Radio } from '@/components/ui';
import { PersonalInfoStep as PersonalInfoStepWrapper } from '@/components/forms';
import { US_STATES } from '@/utils/constants';

const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'ZIP code is required'),
    country: z.string().default('United States')
  }),
  phone: z.string().optional(),
  email: z.string().email('Valid email is required'),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed', 'domestic-partnership']),
});

type PersonalInfoData = z.infer<typeof personalInfoSchema>;

interface PersonalInfoStepProps {
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

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
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
  const [formData, setFormData] = useState<PersonalInfoData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
    phone: '',
    email: '',
    maritalStatus: 'single'
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger
  } = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: formData
  });

  const watchedData = watch();

  useEffect(() => {
    // Load existing data if available
    if (willData.sections.testator) {
      const testator = willData.sections.testator;
      setFormData({
        firstName: testator.firstName || '',
        lastName: testator.lastName || '',
        dateOfBirth: testator.dateOfBirth ? new Date(testator.dateOfBirth).toISOString().split('T')[0] : '',
        address: {
          street: testator.address?.street || '',
          city: testator.address?.city || '',
          state: testator.address?.state || '',
          zipCode: testator.address?.zipCode || '',
          country: testator.address?.country || 'United States'
        },
        phone: testator.phone || '',
        email: testator.email || '',
        maritalStatus: testator.maritalStatus || 'single'
      });
    }
  }, [willData]);

  useEffect(() => {
    // Update form values when formData changes
    Object.keys(formData).forEach(key => {
      if (key === 'address') {
        Object.keys(formData.address).forEach(addressKey => {
          setValue(`address.${addressKey}` as any, formData.address[addressKey as keyof typeof formData.address]);
        });
      } else {
        setValue(key as keyof PersonalInfoData, formData[key as keyof PersonalInfoData]);
      }
    });
  }, [formData, setValue]);

  const maritalStatusOptions = [
    { value: 'single', label: 'Single', description: 'Never married' },
    { value: 'married', label: 'Married', description: 'Currently married' },
    { value: 'divorced', label: 'Divorced', description: 'Divorced and not remarried' },
    { value: 'widowed', label: 'Widowed', description: 'Spouse has passed away' },
    { value: 'domestic-partnership', label: 'Domestic Partnership', description: 'In a registered domestic partnership' }
  ];

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      const data = {
        ...watchedData,
        dateOfBirth: new Date(watchedData.dateOfBirth)
      };
      onNext(data);
    }
  };

  const isProceedValid = canProceed(watchedData);

  return (
    <PersonalInfoStepWrapper
      currentStep={currentStep}
      totalSteps={totalSteps}
      stepLabels={stepLabels}
      completedSteps={completedSteps}
      onNext={handleNext}
      onBack={onBack}
      canProceed={isProceedValid && !isSaving}
    >
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="First Name"
            required
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          
          <Input
            label="Last Name"
            required
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Date of Birth"
            type="date"
            required
            error={errors.dateOfBirth?.message}
            {...register('dateOfBirth')}
          />
          
          <Input
            label="Email Address"
            type="email"
            required
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <Input
          label="Phone Number (Optional)"
          type="tel"
          placeholder="(555) 123-4567"
          error={errors.phone?.message}
          {...register('phone')}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-charcoal-900">
            Address
          </h3>
          
          <Input
            label="Street Address"
            required
            error={errors.address?.street?.message}
            {...register('address.street')}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="City"
              required
              error={errors.address?.city?.message}
              {...register('address.city')}
            />
            
            <Select
              label="State"
              options={US_STATES}
              value={watchedData.address?.state}
              onChange={(value) => setValue('address.state', value)}
              required
              error={errors.address?.state?.message}
            />
            
            <Input
              label="ZIP Code"
              required
              error={errors.address?.zipCode?.message}
              {...register('address.zipCode')}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-charcoal-900">
            Marital Status
          </h3>
          
          <Radio
            label="What is your current marital status?"
            options={maritalStatusOptions}
            value={watchedData.maritalStatus}
            onChange={(value) => setValue('maritalStatus', value as any)}
            required
            error={errors.maritalStatus?.message}
          />
        </div>

        {/* Auto-save indicator */}
        {isSaving && (
          <div className="flex items-center text-sm text-charcoal-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
            Saving changes...
          </div>
        )}
      </form>
    </PersonalInfoStepWrapper>
  );
};

export default PersonalInfoStep;