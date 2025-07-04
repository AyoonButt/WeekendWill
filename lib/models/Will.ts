import mongoose, { Schema, Document, Types } from 'mongoose';

// Person Info Schema
const PersonInfoSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'United States' }
  },
  phone: String,
  email: String,
  relationship: String,
}, { _id: false });

// Person Schema (with ID)
const PersonSchema = new Schema({
  id: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'United States' }
  },
  phone: String,
  email: String,
  relationship: String,
  isPrimary: { type: Boolean, default: false },
  isAlternate: { type: Boolean, default: false },
});

// Child Schema
const ChildSchema = new Schema({
  id: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'United States' }
  },
  phone: String,
  email: String,
  relationship: String,
  isMinor: { type: Boolean, required: true },
  guardianId: String,
});

// Beneficiary Schema
const BeneficiarySchema = new Schema({
  personId: { type: String, required: true },
  percentage: { type: Number, required: true, min: 0, max: 100 },
}, { _id: false });

// Property Schema
const PropertySchema = new Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['house', 'condo', 'land', 'other'], 
    required: true 
  },
  description: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'United States' }
  },
  estimatedValue: Number,
  beneficiaries: [BeneficiarySchema],
});

// Asset Schema
const AssetSchema = new Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['bank_account', 'investment', 'vehicle', 'jewelry', 'art', 'other'], 
    required: true 
  },
  description: { type: String, required: true },
  estimatedValue: Number,
  beneficiaries: [BeneficiarySchema],
});

// Gift Schema
const GiftSchema = new Schema({
  id: { type: String, required: true },
  item: { type: String, required: true },
  beneficiary: { type: String, required: true },
  isMonetary: { type: Boolean, required: true },
  amount: Number,
});

// Residual Estate Schema
const ResidualEstateSchema = new Schema({
  beneficiaries: [BeneficiarySchema],
  contingentBeneficiaries: [BeneficiarySchema],
}, { _id: false });

// Pet Schema
const PetSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  caregiverId: { type: String, required: true },
  careInstructions: String,
  careFund: Number,
});

// Arrangement Schema
const ArrangementSchema = new Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['burial', 'cremation', 'donation'], 
    required: true 
  },
  instructions: { type: String, required: true },
  location: String,
  contactInfo: String,
});

// Digital Account Schema
const DigitalAccountSchema = new Schema({
  id: { type: String, required: true },
  platform: { type: String, required: true },
  username: String,
  instructions: { type: String, required: true },
});

// Digital Executor Schema
const DigitalExecutorSchema = new Schema({
  id: { type: String, required: true },
  personId: { type: String, required: true },
  accounts: [DigitalAccountSchema],
});

// Photo Schema
const PhotoSchema = new Schema({
  id: { type: String, required: true },
  url: { type: String, required: true },
  caption: String,
  associatedItems: [String],
  uploadedAt: { type: Date, default: Date.now },
});

// Chat Message Schema
const ChatMessageSchema = new Schema({
  id: { type: String, required: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Progress Schema
const ProgressSchema = new Schema({
  completedSections: [String],
  currentSection: { type: String, default: 'personal-info' },
  percentComplete: { type: Number, default: 0, min: 0, max: 100 },
}, { _id: false });

// Will Sections Schema
const WillSectionsSchema = new Schema({
  testator: PersonInfoSchema,
  spouse: PersonInfoSchema,
  children: [ChildSchema],
  executors: [PersonSchema],
  guardians: [PersonSchema],
  realProperty: [PropertySchema],
  personalProperty: [AssetSchema],
  specificGifts: [GiftSchema],
  residualEstate: ResidualEstateSchema,
  pets: [PetSchema],
  arrangements: [ArrangementSchema],
  digitalExecutors: [DigitalExecutorSchema],
}, { _id: false });

// Documents Schema
const DocumentsSchema = new Schema({
  willPdf: String,
  wishesPdf: String,
  executionCertificate: String,
}, { _id: false });

// Will Interface
export interface IWill extends Document {
  userId: Types.ObjectId;
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
  documents: {
    willPdf?: string;
    wishesPdf?: string;
    executionCertificate?: string;
  };
  photos: any[];
  chatHistory: any[];
  progress: {
    completedSections: string[];
    currentSection: string;
    percentComplete: number;
  };
  version: number;
  executedAt?: Date;
  witnessInfo?: {
    witness1: any;
    witness2: any;
    notary?: any;
    executionDate: Date;
    executionLocation: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Will Schema
const WillSchema = new Schema<IWill>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  status: { 
    type: String, 
    enum: ['draft', 'completed', 'executed'], 
    default: 'draft'
  },
  stateCompliance: { 
    type: String, 
    required: true,
    default: 'CA' // Default to California
  },
  sections: {
    type: WillSectionsSchema,
    default: () => ({
      children: [],
      executors: [],
      guardians: [],
      realProperty: [],
      personalProperty: [],
      specificGifts: [],
      pets: [],
      arrangements: [],
      digitalExecutors: []
    })
  },
  documents: {
    type: DocumentsSchema,
    default: () => ({})
  },
  photos: [PhotoSchema],
  chatHistory: [ChatMessageSchema],
  progress: {
    type: ProgressSchema,
    default: () => ({
      completedSections: [],
      currentSection: 'personal-info',
      percentComplete: 0
    })
  },
  version: { type: Number, default: 1 },
  executedAt: Date,
  witnessInfo: {
    witness1: PersonInfoSchema,
    witness2: PersonInfoSchema,
    notary: PersonInfoSchema,
    executionDate: Date,
    executionLocation: String,
  }
}, {
  timestamps: true,
  collection: 'wills'
});

// Indexes
WillSchema.index({ userId: 1, status: 1 });
WillSchema.index({ userId: 1, createdAt: -1 });
WillSchema.index({ status: 1, updatedAt: -1 });

// Virtual for completion percentage calculation
WillSchema.virtual('completionPercentage').get(function() {
  const requiredSections = [
    'personal-info', 'family', 'executors', 'assets', 'distribution'
  ];
  const completed = this.progress.completedSections.length;
  return Math.round((completed / requiredSections.length) * 100);
});

// Methods
WillSchema.methods.canBeExecuted = function() {
  return this.status === 'completed' && 
         this.progress.percentComplete === 100 &&
         this.sections.testator &&
         this.sections.executors.length > 0;
};

WillSchema.methods.updateProgress = function() {
  const requiredSections = [
    'personal-info', 'family', 'executors', 'assets', 'distribution'
  ];
  
  const completedSections = [];
  
  if (this.sections.testator) completedSections.push('personal-info');
  if (this.sections.children.length > 0 || this.sections.spouse) completedSections.push('family');
  if (this.sections.executors.length > 0) completedSections.push('executors');
  if (this.sections.realProperty.length > 0 || this.sections.personalProperty.length > 0) {
    completedSections.push('assets');
  }
  if (this.sections.residualEstate?.beneficiaries?.length > 0) {
    completedSections.push('distribution');
  }
  
  this.progress.completedSections = completedSections;
  this.progress.percentComplete = Math.round((completedSections.length / requiredSections.length) * 100);
  
  if (this.progress.percentComplete === 100 && this.status === 'draft') {
    this.status = 'completed';
  }
};

// Pre-save middleware
WillSchema.pre('save', function (this: IWill, next) {
  this.updateProgress();
  next();
});

// Ensure model is only compiled once
const Will = mongoose.models.Will || mongoose.model<IWill>('Will', WillSchema);

export default Will;