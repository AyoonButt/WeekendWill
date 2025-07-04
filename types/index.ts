import { ObjectId } from 'mongodb';
import React from 'react';

// User Types
export interface User {
  _id: ObjectId;
  email: string;
  hashedPassword: string;
  sponsorCode?: string;
  subscription: {
    plan: 'essential' | 'unlimited';
    status: 'active' | 'cancelled' | 'expired';
    stripeCustomerId?: string;
    subscriptionId?: string;
  };
  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
    address?: Address;
  };
  emailVerified: Date | null;
  image?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Will Types
export interface Will {
  _id: ObjectId;
  userId: ObjectId;
  status: 'draft' | 'completed' | 'executed';
  stateCompliance: string;
  sections: {
    testator: PersonInfo;
    spouse?: PersonInfo;
    children: Child[];
    executors: Person[];
    guardians: Person[];
    realProperty: Property[];
    personalProperty: Asset[];
    specificGifts: Gift[];
    residualEstate: ResidualEstate;
    pets: Pet[];
    arrangements: Arrangement[];
    digitalExecutors: DigitalExecutor[];
  };
  documents: {
    willPdf?: string;
    wishesPdf?: string;
  };
  photos: Photo[];
  chatHistory: ChatMessage[];
  progress: {
    completedSections: string[];
    currentSection: string;
    percentComplete: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonInfo {
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  address?: Address;
  phone?: string;
  email?: string;
  relationship?: string;
}

export interface Person extends PersonInfo {
  id: string;
  isPrimary?: boolean;
  isAlternate?: boolean;
}

export interface Child extends PersonInfo {
  id: string;
  isMinor: boolean;
  guardianId?: string;
}

export interface Property {
  id: string;
  type: 'house' | 'condo' | 'land' | 'other';
  description: string;
  address: Address;
  estimatedValue?: number;
  beneficiaries: Beneficiary[];
}

export interface Asset {
  id: string;
  type: 'bank_account' | 'investment' | 'vehicle' | 'jewelry' | 'art' | 'other';
  description: string;
  estimatedValue?: number;
  beneficiaries: Beneficiary[];
}

export interface Gift {
  id: string;
  item: string;
  beneficiary: string;
  isMonetary: boolean;
  amount?: number;
}

export interface Beneficiary {
  personId: string;
  percentage: number;
}

export interface ResidualEstate {
  beneficiaries: Beneficiary[];
  contingentBeneficiaries?: Beneficiary[];
}

export interface Pet {
  id: string;
  name: string;
  type: string;
  caregiverId: string;
  careInstructions?: string;
  careFund?: number;
}

export interface Arrangement {
  id: string;
  type: 'burial' | 'cremation' | 'donation';
  instructions: string;
  location?: string;
  contactInfo?: string;
}

export interface DigitalExecutor {
  id: string;
  personId: string;
  accounts: DigitalAccount[];
}

export interface DigitalAccount {
  id: string;
  platform: string;
  username?: string;
  instructions: string;
}

export interface Photo {
  id: string;
  url: string;
  caption?: string;
  associatedItems: string[];
  uploadedAt: Date;
  name?: string;
  size?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// UI Component Types

// Estate Planning Component Types
export interface TrustSignal {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export interface TrustSignalsProps {
  signals?: TrustSignal[];
}

export interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  completedSteps: number[];
}

export interface PricingPlan {
  planName: string;
  price: string;
  billing: string;
  features: string[];
  additionalFeatures?: string[];
  highlighted?: boolean;
  legalCompliance: string[];
  cta: string;
  stripePriceId: string;
}

export interface PricingCardProps extends PricingPlan {
  onSelect: () => void;
}

export interface DocumentCardProps {
  documentType: 'will' | 'trust' | 'power-of-attorney';
  status: 'draft' | 'completed' | 'executed';
  lastModified: Date;
  onDownload: () => void;
  onEdit: () => void;
}

export interface SecurityBadgeProps {
  features: Array<'encrypted' | 'backed-up' | 'secure-access'>;
  className?: string;
}

// Form Component Types
export interface InterviewStepProps {
  title: string;
  description?: string;
  currentStep: number;
  totalSteps: number;
  children: React.ReactNode;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
}

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label: string;
  required?: boolean;
}

export interface PhotoUploadProps {
  onUpload: (files: File[]) => void;
  maxFiles: number;
  acceptedTypes: string[];
  currentPhotos: Photo[];
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Stripe Types
export interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
}

export interface StripeSubscription {
  id: string;
  customerId: string;
  status: string;
  currentPeriodEnd: number;
  priceId: string;
}

// UI Component Types
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
}