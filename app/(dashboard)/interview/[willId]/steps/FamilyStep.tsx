'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusIcon, TrashIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Input, Select, Radio, Button, Card } from '@/components/ui';
import { FamilyStep as FamilyStepWrapper } from '@/components/forms';
import { generateId } from '@/utils';

const personSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().optional(),
  relationship: z.string().min(1, 'Relationship is required'),
  isMinor: z.boolean().optional(),
});

const familySchema = z.object({
  hasSpouse: z.boolean(),
  spouse: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    dateOfBirth: z.string().optional(),
  }).optional(),
  hasChildren: z.boolean(),
  children: z.array(personSchema),
});

type FamilyData = z.infer<typeof familySchema>;

interface FamilyStepProps {
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

const FamilyStep: React.FC<FamilyStepProps> = ({
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
  const [formData, setFormData] = useState<FamilyData>({
    hasSpouse: false,
    spouse: undefined,
    hasChildren: false,
    children: [],
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger
  } = useForm<FamilyData>({
    resolver: zodResolver(familySchema),
    defaultValues: formData
  });

  const { fields: childrenFields, append: addChild, remove: removeChild } = useFieldArray({
    control,
    name: 'children'
  });

  const watchedData = watch();
  const hasSpouse = watch('hasSpouse');
  const hasChildren = watch('hasChildren');

  useEffect(() => {
    // Load existing data if available
    const spouse = willData.sections.spouse;
    const children = willData.sections.children || [];

    setFormData({
      hasSpouse: !!spouse,
      spouse: spouse ? {
        firstName: spouse.firstName || '',
        lastName: spouse.lastName || '',
        dateOfBirth: spouse.dateOfBirth ? new Date(spouse.dateOfBirth).toISOString().split('T')[0] : '',
      } : undefined,
      hasChildren: children.length > 0,
      children: children.map((child: any) => ({
        id: child.id || generateId(),
        firstName: child.firstName || '',
        lastName: child.lastName || '',
        dateOfBirth: child.dateOfBirth ? new Date(child.dateOfBirth).toISOString().split('T')[0] : '',
        relationship: child.relationship || 'child',
        isMinor: child.isMinor || false,
      }))
    });
  }, [willData]);

  const handleAddChild = () => {
    addChild({
      id: generateId(),
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      relationship: 'child',
      isMinor: false,
    });
  };

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      const data = {
        spouse: hasSpouse ? {
          ...watchedData.spouse,
          dateOfBirth: watchedData.spouse?.dateOfBirth ? new Date(watchedData.spouse.dateOfBirth) : undefined
        } : undefined,
        children: hasChildren ? watchedData.children.map(child => ({
          ...child,
          dateOfBirth: child.dateOfBirth ? new Date(child.dateOfBirth) : undefined,
          isMinor: child.dateOfBirth ? calculateAge(child.dateOfBirth) < 18 : false
        })) : []
      };
      onNext(data);
    }
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <FamilyStepWrapper
      currentStep={currentStep}
      totalSteps={totalSteps}
      stepLabels={stepLabels}
      completedSteps={completedSteps}
      onNext={handleNext}
      onBack={onBack}
      canProceed={true} // Family section is optional
    >
      <div className="space-y-8">
        <div className="text-center">
          <UserGroupIcon className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-charcoal-900 mb-2">
            Tell us about your family
          </h2>
          <p className="text-charcoal-600">
            This helps us create a will that properly accounts for your loved ones.
          </p>
        </div>

        {/* Spouse Section */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-charcoal-900 mb-4">
            Spouse or Partner
          </h3>
          
          <Radio
            label="Do you have a spouse or domestic partner?"
            options={[
              { value: 'true', label: 'Yes', description: 'I have a spouse or domestic partner' },
              { value: 'false', label: 'No', description: 'I am single, divorced, or widowed' }
            ]}
            value={hasSpouse ? 'true' : 'false'}
            onChange={(value) => setValue('hasSpouse', value === 'true')}
          />

          {hasSpouse && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  required={hasSpouse}
                  error={errors.spouse?.firstName?.message}
                  {...register('spouse.firstName')}
                />
                
                <Input
                  label="Last Name"
                  required={hasSpouse}
                  error={errors.spouse?.lastName?.message}
                  {...register('spouse.lastName')}
                />
              </div>
              
              <Input
                label="Date of Birth (Optional)"
                type="date"
                error={errors.spouse?.dateOfBirth?.message}
                {...register('spouse.dateOfBirth')}
              />
            </div>
          )}
        </Card>

        {/* Children Section */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-charcoal-900 mb-4">
            Children
          </h3>
          
          <Radio
            label="Do you have any children?"
            options={[
              { value: 'true', label: 'Yes', description: 'I have children (biological, adopted, or stepchildren)' },
              { value: 'false', label: 'No', description: 'I do not have any children' }
            ]}
            value={hasChildren ? 'true' : 'false'}
            onChange={(value) => setValue('hasChildren', value === 'true')}
          />

          {hasChildren && (
            <div className="mt-6">
              {childrenFields.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-charcoal-600 mb-4">
                    No children added yet. Click the button below to add your first child.
                  </p>
                  <Button variant="outline" onClick={handleAddChild}>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Child
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {childrenFields.map((field, index) => (
                    <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-charcoal-900">
                          Child {index + 1}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeChild(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="First Name"
                          required
                          error={errors.children?.[index]?.firstName?.message}
                          {...register(`children.${index}.firstName`)}
                        />
                        
                        <Input
                          label="Last Name"
                          required
                          error={errors.children?.[index]?.lastName?.message}
                          {...register(`children.${index}.lastName`)}
                        />
                      </div>
                      
                      <div className="mt-4">
                        <Input
                          label="Date of Birth"
                          type="date"
                          error={errors.children?.[index]?.dateOfBirth?.message}
                          {...register(`children.${index}.dateOfBirth`)}
                        />
                        
                        {watchedData.children?.[index]?.dateOfBirth && (
                          <p className="text-sm text-charcoal-600 mt-2">
                            Age: {calculateAge(watchedData.children[index].dateOfBirth)} years old
                            {calculateAge(watchedData.children[index].dateOfBirth) < 18 && 
                              <span className="text-gold-600 font-medium"> (Minor - guardian selection required)</span>
                            }
                          </p>
                        )}
                      </div>
                      
                      <Select
                        label="Relationship"
                        options={[
                          { value: 'child', label: 'Biological Child' },
                          { value: 'adopted', label: 'Adopted Child' },
                          { value: 'stepchild', label: 'Stepchild' }
                        ]}
                        value={watchedData.children?.[index]?.relationship}
                        onChange={(value) => setValue(`children.${index}.relationship`, value)}
                        required
                        error={errors.children?.[index]?.relationship?.message}
                      />
                    </div>
                  ))}
                  
                  <Button variant="outline" onClick={handleAddChild} className="w-full">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Another Child
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Auto-save indicator */}
        {isSaving && (
          <div className="flex items-center text-sm text-charcoal-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
            Saving changes...
          </div>
        )}
      </div>
    </FamilyStepWrapper>
  );
};

export default FamilyStep;