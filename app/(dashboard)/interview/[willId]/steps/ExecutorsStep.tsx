"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusIcon, TrashIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { Input, Button, Card } from "@/components/ui";
import { ExecutorsStep as ExecutorsStepWrapper } from "@/components/forms";
import { generateId } from "@/utils";

const personSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  relationship: z.string().min(1, "Relationship is required"),
});

const executorsSchema = z.object({
  executors: z.array(personSchema).min(1, "At least one executor is required"),
  guardians: z.array(personSchema),
});

type ExecutorsData = z.infer<typeof executorsSchema>;

interface ExecutorsStepProps {
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

const ExecutorsStep: React.FC<ExecutorsStepProps> = ({
  willData,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  canProceed,
  isSaving,
}) => {
  const [formData, setFormData] = useState<ExecutorsData>({
    executors: [
      { id: generateId(), firstName: "", lastName: "", relationship: "executor" },
    ],
    guardians: [],
  });

  const {
    register,
    control,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<ExecutorsData>({
    resolver: zodResolver(executorsSchema),
    defaultValues: formData,
  });

  const { fields: executorFields, append: addExecutor, remove: removeExecutor } = useFieldArray({
    control,
    name: "executors",
  });
  const { fields: guardianFields, append: addGuardian, remove: removeGuardian } = useFieldArray({
    control,
    name: "guardians",
  });

  const watchedData = watch();

  useEffect(() => {
    // Load existing data if available
    setFormData({
      executors: (willData.sections.executors || []).map((e: any) => ({
        id: e.id || generateId(),
        firstName: e.firstName || "",
        lastName: e.lastName || "",
        relationship: e.relationship || "executor",
      })),
      guardians: (willData.sections.guardians || []).map((g: any) => ({
        id: g.id || generateId(),
        firstName: g.firstName || "",
        lastName: g.lastName || "",
        relationship: g.relationship || "guardian",
      })),
    });
  }, [willData]);

  useEffect(() => {
    setValue("executors", formData.executors);
    setValue("guardians", formData.guardians);
  }, [formData, setValue]);

  const handleAddExecutor = () => {
    addExecutor({ id: generateId(), firstName: "", lastName: "", relationship: "executor" });
  };
  const handleAddGuardian = () => {
    addGuardian({ id: generateId(), firstName: "", lastName: "", relationship: "guardian" });
  };

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      onNext({
        executors: watchedData.executors,
        guardians: watchedData.guardians,
      });
    }
  };

  const isProceedValid = canProceed(watchedData);

  return (
    <ExecutorsStepWrapper
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onBack={onBack}
      canProceed={isProceedValid && !isSaving}
    >
      <div className="space-y-8">
        <div className="text-center">
          <ShieldCheckIcon className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-charcoal-900 mb-2">
            Executors & Guardians
          </h2>
          <p className="text-charcoal-600">
            Choose trusted people to carry out your wishes and care for your children (if any).
          </p>
        </div>

        {/* Executors Section */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-charcoal-900 mb-4">
            Executors
          </h3>
          {executorFields.map((executor, index) => (
            <div key={executor.id} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-charcoal-900">
                  Executor {index + 1}
                </span>
                {executorFields.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExecutor(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="First Name"
                  required
                  error={errors.executors?.[index]?.firstName?.message}
                  {...register(`executors.${index}.firstName`)}
                />
                <Input
                  label="Last Name"
                  required
                  error={errors.executors?.[index]?.lastName?.message}
                  {...register(`executors.${index}.lastName`)}
                />
                <Input
                  label="Relationship"
                  required
                  error={errors.executors?.[index]?.relationship?.message}
                  {...register(`executors.${index}.relationship`)}
                  placeholder="e.g. spouse, friend, attorney"
                />
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={handleAddExecutor} className="w-full mb-2">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Another Executor
          </Button>
        </Card>

        {/* Guardians Section */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-charcoal-900 mb-4">
            Guardians (for minor children)
          </h3>
          {guardianFields.map((guardian, index) => (
            <div key={guardian.id} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-charcoal-900">
                  Guardian {index + 1}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeGuardian(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="First Name"
                  required
                  error={errors.guardians?.[index]?.firstName?.message}
                  {...register(`guardians.${index}.firstName`)}
                />
                <Input
                  label="Last Name"
                  required
                  error={errors.guardians?.[index]?.lastName?.message}
                  {...register(`guardians.${index}.lastName`)}
                />
                <Input
                  label="Relationship"
                  required
                  error={errors.guardians?.[index]?.relationship?.message}
                  {...register(`guardians.${index}.relationship`)}
                  placeholder="e.g. aunt, uncle, friend"
                />
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={handleAddGuardian} className="w-full">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Another Guardian
          </Button>
        </Card>
      </div>
    </ExecutorsStepWrapper>
  );
};

export default ExecutorsStep; 