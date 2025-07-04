'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusIcon, TrashIcon, HomeIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { Input, Select, Textarea, Button, Card } from '@/components/ui';
import { AssetsStep as AssetsStepWrapper } from '@/components/forms';
import { ASSET_TYPES, PROPERTY_TYPES, US_STATES } from '@/utils/constants';
import { generateId, formatCurrency } from '@/utils';

const propertySchema = z.object({
  id: z.string(),
  type: z.string().min(1, 'Property type is required'),
  description: z.string().min(1, 'Description is required'),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'ZIP code is required'),
  }),
  estimatedValue: z.number().optional(),
});

const assetSchema = z.object({
  id: z.string(),
  type: z.string().min(1, 'Asset type is required'),
  description: z.string().min(1, 'Description is required'),
  estimatedValue: z.number().optional(),
});

const assetsStepSchema = z.object({
  hasRealProperty: z.boolean(),
  realProperty: z.array(propertySchema),
  hasPersonalProperty: z.boolean(),
  personalProperty: z.array(assetSchema),
});

type AssetsData = z.infer<typeof assetsStepSchema>;

interface AssetsStepProps {
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

const AssetsStep: React.FC<AssetsStepProps> = ({
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
  const [formData, setFormData] = useState<AssetsData>({
    hasRealProperty: false,
    realProperty: [],
    hasPersonalProperty: false,
    personalProperty: [],
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger
  } = useForm<AssetsData>({
    resolver: zodResolver(assetsStepSchema),
    defaultValues: formData
  });

  const { fields: propertyFields, append: addProperty, remove: removeProperty } = useFieldArray({
    control,
    name: 'realProperty'
  });

  const { fields: assetFields, append: addAsset, remove: removeAsset } = useFieldArray({
    control,
    name: 'personalProperty'
  });

  const watchedData = watch();
  const hasRealProperty = watch('hasRealProperty');
  const hasPersonalProperty = watch('hasPersonalProperty');

  useEffect(() => {
    // Load existing data if available
    const realProperty = willData.sections.realProperty || [];
    const personalProperty = willData.sections.personalProperty || [];

    setFormData({
      hasRealProperty: realProperty.length > 0,
      realProperty: realProperty.map((prop: any) => ({
        id: prop.id || generateId(),
        type: prop.type || '',
        description: prop.description || '',
        address: {
          street: prop.address?.street || '',
          city: prop.address?.city || '',
          state: prop.address?.state || '',
          zipCode: prop.address?.zipCode || '',
        },
        estimatedValue: prop.estimatedValue || 0,
      })),
      hasPersonalProperty: personalProperty.length > 0,
      personalProperty: personalProperty.map((asset: any) => ({
        id: asset.id || generateId(),
        type: asset.type || '',
        description: asset.description || '',
        estimatedValue: asset.estimatedValue || 0,
      }))
    });
  }, [willData]);

  const handleAddProperty = () => {
    addProperty({
      id: generateId(),
      type: '',
      description: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
      estimatedValue: 0,
    });
  };

  const handleAddAsset = () => {
    addAsset({
      id: generateId(),
      type: '',
      description: '',
      estimatedValue: 0,
    });
  };

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      const data = {
        realProperty: hasRealProperty ? watchedData.realProperty : [],
        personalProperty: hasPersonalProperty ? watchedData.personalProperty : [],
      };
      onNext(data);
    }
  };

  const getTotalEstimatedValue = () => {
    const propertyValue = watchedData.realProperty?.reduce((sum, prop) => sum + (prop.estimatedValue || 0), 0) || 0;
    const assetValue = watchedData.personalProperty?.reduce((sum, asset) => sum + (asset.estimatedValue || 0), 0) || 0;
    return propertyValue + assetValue;
  };

  return (
    <AssetsStepWrapper
      currentStep={currentStep}
      totalSteps={totalSteps}
      stepLabels={stepLabels}
      completedSteps={completedSteps}
      onNext={handleNext}
      onBack={onBack}
      canProceed={true} // Assets section is optional
    >
      <div className="space-y-8">
        <div className="text-center">
          <BanknotesIcon className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-charcoal-900 mb-2">
            Tell us about your assets
          </h2>
          <p className="text-charcoal-600">
            List your property and valuable assets so we can include them in your will.
          </p>
        </div>

        {/* Estate Value Summary */}
        {getTotalEstimatedValue() > 0 && (
          <Card className="p-6 bg-gradient-to-r from-success-50 to-teal-50">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-charcoal-900 mb-2">
                Total Estimated Estate Value
              </h3>
              <p className="text-3xl font-bold text-success-600">
                {formatCurrency(getTotalEstimatedValue())}
              </p>
              <p className="text-sm text-charcoal-600 mt-2">
                This is an estimate based on the values you've provided.
              </p>
            </div>
          </Card>
        )}

        {/* Real Estate Section */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <HomeIcon className="w-6 h-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-charcoal-900">
              Real Estate
            </h3>
          </div>
          
          <div className="mb-6">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={hasRealProperty}
                onChange={(e) => setValue('hasRealProperty', e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-charcoal-700">
                I own real estate (home, land, rental property, etc.)
              </span>
            </label>
          </div>

          {hasRealProperty && (
            <div className="space-y-6">
              {propertyFields.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-charcoal-600 mb-4">
                    No properties added yet. Click the button below to add your first property.
                  </p>
                  <Button variant="outline" onClick={handleAddProperty}>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Property
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {propertyFields.map((field, index) => (
                    <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-charcoal-900">
                          Property {index + 1}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProperty(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Select
                          label="Property Type"
                          options={PROPERTY_TYPES}
                          value={watchedData.realProperty?.[index]?.type}
                          onChange={(value) => setValue(`realProperty.${index}.type`, value)}
                          required
                          error={errors.realProperty?.[index]?.type?.message}
                        />
                        
                        <Input
                          label="Estimated Value (Optional)"
                          type="number"
                          placeholder="Enter amount"
                          error={errors.realProperty?.[index]?.estimatedValue?.message}
                          {...register(`realProperty.${index}.estimatedValue`, { valueAsNumber: true })}
                        />
                      </div>
                      
                      <Textarea
                        label="Description"
                        placeholder="Brief description of the property"
                        required
                        error={errors.realProperty?.[index]?.description?.message}
                        {...register(`realProperty.${index}.description`)}
                      />
                      
                      <div className="mt-4">
                        <h5 className="font-medium text-charcoal-900 mb-3">Property Address</h5>
                        <div className="space-y-3">
                          <Input
                            label="Street Address"
                            required
                            error={errors.realProperty?.[index]?.address?.street?.message}
                            {...register(`realProperty.${index}.address.street`)}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <Input
                              label="City"
                              required
                              error={errors.realProperty?.[index]?.address?.city?.message}
                              {...register(`realProperty.${index}.address.city`)}
                            />
                            
                            <Select
                              label="State"
                              options={US_STATES}
                              value={watchedData.realProperty?.[index]?.address?.state}
                              onChange={(value) => setValue(`realProperty.${index}.address.state`, value)}
                              required
                              error={errors.realProperty?.[index]?.address?.state?.message}
                            />
                            
                            <Input
                              label="ZIP Code"
                              required
                              error={errors.realProperty?.[index]?.address?.zipCode?.message}
                              {...register(`realProperty.${index}.address.zipCode`)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" onClick={handleAddProperty} className="w-full">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Another Property
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Personal Property Section */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <BanknotesIcon className="w-6 h-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-charcoal-900">
              Personal Assets
            </h3>
          </div>
          
          <div className="mb-6">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={hasPersonalProperty}
                onChange={(e) => setValue('hasPersonalProperty', e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-charcoal-700">
                I have valuable personal assets (bank accounts, investments, vehicles, etc.)
              </span>
            </label>
          </div>

          {hasPersonalProperty && (
            <div className="space-y-6">
              {assetFields.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-charcoal-600 mb-4">
                    No assets added yet. Click the button below to add your first asset.
                  </p>
                  <Button variant="outline" onClick={handleAddAsset}>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Asset
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {assetFields.map((field, index) => (
                    <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-charcoal-900">
                          Asset {index + 1}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAsset(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Select
                          label="Asset Type"
                          options={ASSET_TYPES}
                          value={watchedData.personalProperty?.[index]?.type}
                          onChange={(value) => setValue(`personalProperty.${index}.type`, value)}
                          required
                          error={errors.personalProperty?.[index]?.type?.message}
                        />
                        
                        <Input
                          label="Estimated Value (Optional)"
                          type="number"
                          placeholder="Enter amount"
                          error={errors.personalProperty?.[index]?.estimatedValue?.message}
                          {...register(`personalProperty.${index}.estimatedValue`, { valueAsNumber: true })}
                        />
                      </div>
                      
                      <Textarea
                        label="Description"
                        placeholder="Brief description of the asset (e.g., 'Chase checking account', '2018 Honda Civic')"
                        required
                        error={errors.personalProperty?.[index]?.description?.message}
                        {...register(`personalProperty.${index}.description`)}
                      />
                    </div>
                  ))}
                  
                  <Button variant="outline" onClick={handleAddAsset} className="w-full">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Another Asset
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Information Note */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">
            💡 Helpful Information
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• You don't need to list every single item - focus on valuable or meaningful assets</li>
            <li>• Estimated values help with planning but don't need to be exact</li>
            <li>• You can always update this information later</li>
            <li>• Some assets (like retirement accounts) may pass outside of your will</li>
          </ul>
        </Card>

        {/* Auto-save indicator */}
        {isSaving && (
          <div className="flex items-center text-sm text-charcoal-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
            Saving changes...
          </div>
        )}
      </div>
    </AssetsStepWrapper>
  );
};

export default AssetsStep;