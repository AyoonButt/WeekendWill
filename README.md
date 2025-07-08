# Weekend Will

A modern, secure web application for creating legal wills with an intuitive interview-style interface. Built with Next.js 13+, TypeScript, and MongoDB.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [UI Components](#ui-components)
- [Authentication](#authentication)
- [File Storage & Handling](#file-storage--handling)
- [API Integrations](#api-integrations)
- [Lazy Loading & Performance](#lazy-loading--performance)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## Overview

Weekend Will simplifies the process of creating legal wills through a guided interview process. Users can create comprehensive estate planning documents with photo uploads, beneficiary management, and PDF generation capabilities.

## Technology Stack

- **Frontend**: Next.js 13+ (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS v4 with custom design system
- **Authentication**: NextAuth.js with Google OAuth and credentials
- **Database**: MongoDB with connection pooling
- **File Storage**: UploadThing for secure file uploads
- **Payments**: Stripe for subscription management
- **PDF Generation**: jsPDF for document creation
- **UI Components**: Headless UI, custom component library

## UI Components

### Architecture & Organization

The application uses a well-structured component architecture with clear separation of concerns:

```
components/
├── ui/                    # Core reusable UI components
├── forms/                 # Form-specific components
├── estate-planning/       # Domain-specific components
├── layout/               # Layout and navigation components
├── providers/            # Context providers
└── sections/             # Page section components
```

### Key Components

**Core UI Components (`components/ui/`)**
- **Button**: Multiple variants (primary, secondary, outline, ghost) with loading states
- **Card**: Composite component with Header, Content, Footer subcomponents
- **Input**: Built-in label, error handling, and accessibility features
- **Modal**: Headless UI Dialog with backdrop blur and keyboard navigation
- **Select**: Custom dropdown with search and keyboard navigation
- **Toast**: Success/error notifications with auto-dismiss

**Form Components (`components/forms/`)**
- **MultiSelect**: Advanced multi-selection with search and tagging
- **InterviewStep**: Multi-step form wrapper for guided interviews
- **PhotoUpload**: Drag-and-drop file upload with preview

**Estate Planning Components (`components/estate-planning/`)**
- **ProgressSteps**: Visual progress indicator for multi-step forms
- **PricingCard**: Subscription plans with feature highlights
- **TrustSignals**: Security badges and compliance indicators

### Styling System

**Tailwind CSS v4** with custom design system:
- **Color Palette**: Primary (blue), teal, success (green), gold, charcoal
- **Typography**: Source Sans 3 (sans) and Merriweather (serif)
- **Component Classes**: Consistent `.btn`, `.card`, `.form-*` patterns
- **Accessibility**: Focus rings, minimum touch targets, screen reader support

## Authentication

### System Architecture

**NextAuth.js** implementation with:
- **Providers**: Google OAuth and credentials-based authentication
- **Session Strategy**: JWT with 30-day expiration
- **Database**: MongoDB with MongoDBAdapter
- **Password Security**: bcrypt with 12 salt rounds

### Authentication Flow

**Registration**:
- Zod schema validation with complex password requirements
- Email verification and terms acceptance
- Auto-login after successful registration
- Sponsor/referral code support

**Login**:
- Email/password or Google OAuth
- Automatic redirect to dashboard
- Remember me functionality

**Password Reset**:
- Secure token generation (32-byte random, 15-minute expiration)
- Email enumeration protection
- Single-use tokens with automatic cleanup

### Route Protection

**Middleware-based** protection via NextAuth:
- **Protected Routes**: `/dashboard/*`, `/interview/*`, `/admin/*`
- **Public Routes**: `/`, `/pricing`, `/how-it-works`, `/faqs`
- **Role-based Access**: Admin route protection with user roles

## File Storage & Handling

### UploadThing Integration

**Service Configuration**:
- **photoUploader**: Will documents and personal items (4MB, 10 files)
- **documentUploader**: Legal documents (8MB PDFs, 4MB images)
- **avatarUploader**: Profile pictures (2MB, 1 file)

### File Management

**Upload UI Components**:
- Drag-and-drop interface with progress indicators
- File preview with caption support
- Real-time upload status and error handling
- Multiple endpoint support for different file types

**Security Features**:
- Authentication required for all uploads
- File type validation (JPEG, PNG, GIF, PDF)
- Size limit enforcement
- User-specific access controls

### PDF Generation

**jsPDF Integration**:
- Complete legal will document generation
- Multi-page support with automatic breaks
- Draft watermarks for incomplete documents
- Legal formatting with signature blocks
- Witness sections for compliance

## API Integrations

### External Services

**Stripe Payment Processing**:
- Two pricing tiers (Essential $39, Unlimited $89)
- Checkout session creation with tax calculation
- Billing portal for subscription management
- Webhook event handling for payment status
- Customer creation and invoice utilities

**MongoDB Database**:
- Connection pooling (10 max connections)
- User and will CRUD operations
- Subscription management
- TLS-enabled secure connections

**UploadThing File Storage**:
- Secure file upload with authentication
- Multiple upload endpoints for different file types
- Automatic file processing and metadata extraction

### Internal API Architecture

**Centralized API Client** (`lib/api-client.ts`):
- Retry logic with exponential backoff (3 retries)
- 30-second timeout configuration
- Multiple client instances (default, silent, external)
- Comprehensive error handling and normalization

**Service Layer**:
- **UserService**: User management and authentication
- **WillService**: Will creation and progress tracking
- Static methods with MongoDB connection management

**Error Handling**:
- Structured error classes with proper HTTP status codes
- Comprehensive logging with context information
- Standardized error responses across all endpoints

## Lazy Loading & Performance

### Code Splitting

**React.lazy()** implementation:
- Component-level splitting for large components
- Suspense boundaries with loading fallbacks
- Lazy-loaded TestimonialSection and ProcessSection

### Loading States

**User Experience**:
- Button loading states with spinners
- Full-page loading indicators
- Skeleton states for content placeholders
- Progressive loading for image galleries

### Performance Optimizations

**API Client Optimizations**:
- Request retry with exponential backoff
- Request timeouts and network status detection
- Deferred operations with `requestIdleCallback`

**Caching Strategy**:
- In-memory cache with TTL support (5-minute default)
- LRU eviction for cache management
- Automatic cleanup every 5 minutes

**Image Optimization**:
- Next.js Image component with priority loading
- WebP and AVIF format support
- Responsive images with proper sizing
- Lazy loading for non-critical images



