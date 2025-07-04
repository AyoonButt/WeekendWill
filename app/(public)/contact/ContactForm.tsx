'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Textarea } from '@/components/ui';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/components/ui/Toast';

const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  
  phone: z.string()
    .optional()
    .refine((val) => !val || /^\+?[\d\s\-\(\)]+$/.test(val), {
      message: 'Please enter a valid phone number',
    }),
  
  subject: z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters'),
  
  category: z.enum([
    'general',
    'technical',
    'legal',
    'billing',
    'urgent'
  ], {
    errorMap: () => ({ message: 'Please select a category' }),
  }),
  
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters'),
  
  urgency: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Please select urgency level' }),
  }),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { showSuccess, showError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      category: 'general',
      urgency: 'medium',
    },
  });

  const messageLength = watch('message')?.length || 0;

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await apiClient.post('/contact', data);
      
      if (response.success) {
        setIsSubmitted(true);
        reset();
        showSuccess(
          'Message Sent Successfully',
          'We\'ve received your message and will respond within 24 hours.'
        );
      }
    } catch (error) {
      console.error('Contact form submission failed:', error);
      showError(
        'Failed to Send Message',
        'Please try again or contact us directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-charcoal-900 mb-2">
          Message Sent Successfully!
        </h3>
        <p className="text-charcoal-600 mb-6">
          Thank you for contacting us. We&apos;ll review your message and respond within 24 hours.
        </p>
        <Button
          onClick={() => setIsSubmitted(false)}
          variant="outline"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Full Name *
          </label>
          <Input
            {...register('name')}
            placeholder="Enter your full name"
            error={errors.name?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Email Address *
          </label>
          <Input
            type="email"
            {...register('email')}
            placeholder="Enter your email address"
            error={errors.email?.message}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Phone Number (Optional)
          </label>
          <Input
            type="tel"
            {...register('phone')}
            placeholder="+1 (555) 123-4567"
            error={errors.phone?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Category *
          </label>
          <select
            {...register('category')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="general">General Question</option>
            <option value="technical">Technical Support</option>
            <option value="legal">Legal Inquiry</option>
            <option value="billing">Billing & Payments</option>
            <option value="urgent">Urgent Matter</option>
          </select>
          {errors.category && (
            <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal-700 mb-2">
          Subject *
        </label>
        <Input
          {...register('subject')}
          placeholder="Brief description of your inquiry"
          error={errors.subject?.message}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal-700 mb-2">
          Priority Level *
        </label>
        <div className="grid grid-cols-3 gap-3">
          <label className="relative flex items-center">
            <input
              type="radio"
              {...register('urgency')}
              value="low"
              className="sr-only peer"
            />
            <div className="w-full p-3 border border-gray-300 rounded-lg text-center cursor-pointer peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-700 hover:border-gray-400">
              <span className="text-sm font-medium">Low</span>
              <div className="text-xs text-gray-500 mt-1">1-3 days</div>
            </div>
          </label>
          
          <label className="relative flex items-center">
            <input
              type="radio"
              {...register('urgency')}
              value="medium"
              className="sr-only peer"
            />
            <div className="w-full p-3 border border-gray-300 rounded-lg text-center cursor-pointer peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-700 hover:border-gray-400">
              <span className="text-sm font-medium">Medium</span>
              <div className="text-xs text-gray-500 mt-1">24 hours</div>
            </div>
          </label>
          
          <label className="relative flex items-center">
            <input
              type="radio"
              {...register('urgency')}
              value="high"
              className="sr-only peer"
            />
            <div className="w-full p-3 border border-gray-300 rounded-lg text-center cursor-pointer peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-700 hover:border-gray-400">
              <span className="text-sm font-medium">High</span>
              <div className="text-xs text-gray-500 mt-1">4 hours</div>
            </div>
          </label>
        </div>
        {errors.urgency && (
          <p className="text-red-600 text-sm mt-1">{errors.urgency.message}</p>
        )}
      </div>

      <div>
        <Textarea
          label="Message *"
          value={watch('message') || ''}
          onChange={(value) => setValue('message', value)}
          rows={6}
          placeholder="Please provide detailed information about your inquiry..."
          error={errors.message?.message}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-charcoal-500">
            {errors.message?.message || 'Please be as specific as possible to help us assist you better.'}
          </span>
          <span className={`text-xs ${messageLength > 1800 ? 'text-red-600' : 'text-charcoal-500'}`}>
            {messageLength}/2000
          </span>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Before You Submit</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Check our <a href="/faqs" className="underline hover:text-blue-900">FAQ section</a> for quick answers</li>
          <li>• For urgent legal matters, please call our priority line</li>
          <li>• Include your account email if you&apos;re an existing customer</li>
          <li>• Provide as much detail as possible for faster resolution</li>
        </ul>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
          disabled={isSubmitting}
        >
          Clear Form
        </Button>
        
        <Button
          type="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          Send Message
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;