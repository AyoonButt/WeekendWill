import mongoose, { Schema, Document } from 'mongoose';

// Address Schema
const AddressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, default: 'United States' },
});

// User Profile Schema
const ProfileSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String },
  address: AddressSchema,
});

// Subscription Schema
const SubscriptionSchema = new Schema({
  plan: { 
    type: String, 
    enum: ['none', 'essential', 'unlimited'], 
    default: 'none' 
  },
  status: { 
    type: String, 
    enum: ['active', 'cancelled', 'expired', 'inactive', 'past_due'], 
    default: 'inactive' 
  },
  stripeCustomerId: { type: String },
  subscriptionId: { type: String },
  currentPeriodStart: { type: Date },
  currentPeriodEnd: { type: Date },
  cancelAtPeriodEnd: { type: Boolean, default: false },
  canceledAt: { type: Date },
  lastPaymentDate: { type: Date },
  lastFailedPayment: { type: Date },
  trialEnd: { type: Date },
  priceId: { type: String },
}, { _id: false });

// User Interface
export interface IUser extends Document {
  email: string;
  hashedPassword?: string;
  sponsorCode?: string;
  subscription: {
    plan: 'none' | 'essential' | 'unlimited';
    status: 'active' | 'cancelled' | 'expired' | 'inactive' | 'past_due';
    stripeCustomerId?: string;
    subscriptionId?: string;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
    canceledAt?: Date;
    lastPaymentDate?: Date;
    lastFailedPayment?: Date;
    trialEnd?: Date;
    priceId?: string;
  };
  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  emailVerified?: Date;
  image?: string;
  role: 'user' | 'admin';
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// User Schema
const UserSchema = new Schema<IUser>({
  email: { 
    type: String, 
    required: true, 
    lowercase: true
  },
  hashedPassword: { type: String },
  sponsorCode: { type: String },
  subscription: {
    type: SubscriptionSchema,
    default: () => ({
      plan: 'none',
      status: 'inactive'
    })
  },
  profile: {
    type: ProfileSchema,
    required: true
  },
  emailVerified: { type: Date },
  image: { type: String },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  lastLoginAt: { type: Date },
}, {
  timestamps: true,
  collection: 'users'
});

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ 'subscription.stripeCustomerId': 1 });
UserSchema.index({ sponsorCode: 1 });
UserSchema.index({ createdAt: -1 });

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Methods
UserSchema.methods.isSubscriptionActive = function() {
  return this.subscription.status === 'active' && 
         (!this.subscription.currentPeriodEnd || this.subscription.currentPeriodEnd > new Date());
};

UserSchema.methods.hasFeatureAccess = function(feature: string) {
  if (this.role === 'admin') return true;
  
  const activeSubscription = this.isSubscriptionActive();
  
  switch (feature) {
    case 'basic_will':
      return true; // Available to all users
    case 'unlimited_updates':
      return activeSubscription && this.subscription.plan === 'unlimited';
    case 'advanced_features':
      return activeSubscription;
    default:
      return false;
  }
};

// Pre-save middleware
UserSchema.pre('save', function(next) {
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
  }
  next();
});

// Ensure model is only compiled once
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;