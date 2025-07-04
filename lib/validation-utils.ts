import { z } from 'zod';
import { ValidationError } from './error-handler';

// Enhanced validation schemas with better error messages
export const createPersonSchema = (fieldPrefix = '') => z.object({
  firstName: z.string()
    .min(1, `${fieldPrefix}First name is required`)
    .min(2, `${fieldPrefix}First name must be at least 2 characters`)
    .max(50, `${fieldPrefix}First name must be less than 50 characters`)
    .regex(/^[a-zA-Z\s'-]+$/, `${fieldPrefix}First name can only contain letters, spaces, hyphens, and apostrophes`),
  
  lastName: z.string()
    .min(1, `${fieldPrefix}Last name is required`)
    .min(2, `${fieldPrefix}Last name must be at least 2 characters`)
    .max(50, `${fieldPrefix}Last name must be less than 50 characters`)
    .regex(/^[a-zA-Z\s'-]+$/, `${fieldPrefix}Last name can only contain letters, spaces, hyphens, and apostrophes`),
  
  email: z.string()
    .min(1, `${fieldPrefix}Email is required`)
    .email(`${fieldPrefix}Please enter a valid email address`)
    .max(255, `${fieldPrefix}Email must be less than 255 characters`),
  
  phone: z.string()
    .optional()
    .refine((val) => !val || /^\+?[\d\s\-\(\)]+$/.test(val), {
      message: `${fieldPrefix}Please enter a valid phone number`,
    }),
});

export const createAddressSchema = (fieldPrefix = '') => z.object({
  street: z.string()
    .min(1, `${fieldPrefix}Street address is required`)
    .max(100, `${fieldPrefix}Street address must be less than 100 characters`),
  
  city: z.string()
    .min(1, `${fieldPrefix}City is required`)
    .max(50, `${fieldPrefix}City must be less than 50 characters`)
    .regex(/^[a-zA-Z\s'-]+$/, `${fieldPrefix}City can only contain letters, spaces, hyphens, and apostrophes`),
  
  state: z.string()
    .min(1, `${fieldPrefix}State is required`)
    .length(2, `${fieldPrefix}State must be a 2-letter code`)
    .regex(/^[A-Z]{2}$/, `${fieldPrefix}State must be a valid 2-letter state code`),
  
  zipCode: z.string()
    .min(1, `${fieldPrefix}ZIP code is required`)
    .regex(/^\d{5}(-\d{4})?$/, `${fieldPrefix}ZIP code must be in format 12345 or 12345-6789`),
  
  country: z.string()
    .min(1, `${fieldPrefix}Country is required`)
    .default('US'),
});

// Password validation with strength requirements
export const createPasswordSchema = (fieldName = 'Password') => z.string()
  .min(8, `${fieldName} must be at least 8 characters`)
  .max(128, `${fieldName} must be less than 128 characters`)
  .regex(/[a-z]/, `${fieldName} must contain at least one lowercase letter`)
  .regex(/[A-Z]/, `${fieldName} must contain at least one uppercase letter`)
  .regex(/\d/, `${fieldName} must contain at least one number`)
  .regex(/[!@#$%^&*(),.?":{}|<>]/, `${fieldName} must contain at least one special character`);

// Will-specific validation schemas
export const assetSchema = z.object({
  type: z.enum(['real-estate', 'bank-account', 'investment', 'vehicle', 'jewelry', 'artwork', 'other'], {
    errorMap: () => ({ message: 'Please select a valid asset type' }),
  }),
  
  description: z.string()
    .min(1, 'Asset description is required')
    .max(200, 'Asset description must be less than 200 characters'),
  
  value: z.number()
    .min(0, 'Asset value must be positive')
    .max(999999999, 'Asset value is too large'),
  
  notes: z.string()
    .max(500, 'Notes must be less than 500 characters')
    .optional(),
});

export const beneficiarySchema = z.object({
  name: z.string()
    .min(1, 'Beneficiary name is required')
    .max(100, 'Beneficiary name must be less than 100 characters'),
  
  relationship: z.string()
    .min(1, 'Relationship is required'),
  
  percentage: z.number()
    .min(0, 'Percentage must be at least 0%')
    .max(100, 'Percentage cannot exceed 100%'),
  
  address: createAddressSchema('Beneficiary ').optional(),
});

// File validation
export const fileValidationSchema = z.object({
  size: z.number()
    .max(10 * 1024 * 1024, 'File size must be less than 10MB'),
  
  type: z.string()
    .refine((type) => {
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      return allowedTypes.includes(type);
    }, 'File type not supported. Please upload JPEG, PNG, GIF, PDF, or Word documents'),
});

// Validation utilities
export class ValidationUtils {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  static validateSSN(ssn: string): boolean {
    const ssnRegex = /^\d{3}-?\d{2}-?\d{4}$/;
    return ssnRegex.test(ssn);
  }

  static validateZipCode(zipCode: string): boolean {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zipCode);
  }

  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  static validatePercentages(percentages: number[]): boolean {
    const total = percentages.reduce((sum, p) => sum + p, 0);
    return Math.abs(total - 100) < 0.01; // Allow for floating point precision
  }

  static validateDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  static validateAge(birthDate: Date, minAge: number = 18): boolean {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= minAge;
    }
    
    return age >= minAge;
  }
}

// Async validation functions
export class AsyncValidation {
  static async validateEmailUnique(_email: string, _excludeUserId?: string): Promise<boolean> {
    try {
      // This would typically make an API call to check email uniqueness
      // For now, we'll return true (valid)
      return true;
    } catch {
      throw new ValidationError('Unable to validate email uniqueness');
    }
  }

  static async validateFileIntegrity(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        // Basic file integrity check
        const arrayBuffer = reader.result as ArrayBuffer;
        resolve(arrayBuffer.byteLength === file.size);
      };
      
      reader.onerror = () => resolve(false);
      reader.readAsArrayBuffer(file);
    });
  }
}

// Form validation helpers
export const createFormValidator = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
) => {
  return {
    validate: (data: unknown): { success: true; data: z.infer<typeof schema> } | { success: false; errors: Record<string, string[]> } => {
      const result = schema.safeParse(data);
      
      if (result.success) {
        return { success: true, data: result.data };
      }
      
      const errors = result.error.flatten().fieldErrors;
      return { success: false, errors };
    },
    
    validateField: (fieldName: keyof T, value: unknown): string | null => {
      try {
        const fieldSchema = schema.shape[fieldName];
        fieldSchema.parse(value);
        return null;
      } catch (error) {
        if (error instanceof z.ZodError) {
          return error.errors[0]?.message || 'Invalid value';
        }
        return 'Validation error';
      }
    },
  };
};

// State-specific validation rules
export const stateValidationRules = {
  US: {
    minimumWitnessAge: 18,
    requiredWitnesses: 2,
    notaryRequired: false,
    selfProvingAffidavitAllowed: true,
  },
  // Add more states as needed
};

export const validateStateCompliance = (
  state: string,
  witnesses: Array<{ age: number }>,
  isNotarized: boolean
): { isValid: boolean; errors: string[] } => {
  const rules = stateValidationRules.US; // Default to US rules
  const errors: string[] = [];

  if (witnesses.length < rules.requiredWitnesses) {
    errors.push(`At least ${rules.requiredWitnesses} witnesses are required`);
  }

  witnesses.forEach((witness, index) => {
    if (witness.age < rules.minimumWitnessAge) {
      errors.push(`Witness ${index + 1} must be at least ${rules.minimumWitnessAge} years old`);
    }
  });

  if (rules.notaryRequired && !isNotarized) {
    errors.push('Notarization is required in this state');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Business rule validation
export const businessRuleValidators = {
  validateBeneficiaryPercentages: (beneficiaries: Array<{ percentage: number }>): string[] => {
    const errors: string[] = [];
    const total = beneficiaries.reduce((sum, b) => sum + b.percentage, 0);
    
    if (Math.abs(total - 100) > 0.01) {
      errors.push('Beneficiary percentages must total 100%');
    }
    
    return errors;
  },
  
  validateExecutorEligibility: (executor: { age: number; relationship: string }): string[] => {
    const errors: string[] = [];
    
    if (executor.age < 18) {
      errors.push('Executor must be at least 18 years old');
    }
    
    // Add more business rules as needed
    return errors;
  },
  
  validateAssetOwnership: (assets: Array<{ type: string; value: number }>): string[] => {
    const errors: string[] = [];
    
    // Example business rule: minimum estate value
    const totalValue = assets.reduce((sum, a) => sum + a.value, 0);
    if (totalValue < 1000) {
      errors.push('Total estate value should be at least $1,000 to justify creating a will');
    }
    
    return errors;
  },
};