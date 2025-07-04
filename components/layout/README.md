# Layout Components Architecture

This directory contains the new layout architecture designed to solve Next.js prerendering issues with event handlers.

## Components

### `PublicLayout.tsx`
- **Server-safe** layout component
- No client-side interactivity or event handlers
- Can be used in server components
- Provides basic header, footer, and page structure
- **Use for**: Static pages that need SEO and server-side rendering (terms, privacy, etc.)

### `InteractiveHeader.tsx`
- **Client-side** header with full interactivity
- Includes mobile menu, authentication state, navigation
- Contains event handlers and React hooks
- **Use within**: EnhancedPublicLayout only

### `EnhancedPublicLayout.tsx`
- **Client-side** layout with full interactivity
- Uses InteractiveHeader for navigation
- Includes toast notifications
- **Use for**: Pages that need interactivity (contact forms, FAQs with search, etc.)

### Legacy `PublicPageContainer.tsx`
- **Deprecated** - causes prerendering issues
- Contains mixed server/client concerns
- **Replace with**: PublicLayout or EnhancedPublicLayout

## Usage Guidelines

### For Static Pages (Terms, Privacy, Simple Content)
```tsx
// Server component - good for SEO
import { PublicLayout } from '@/components/layout';

export const metadata = { /* SEO metadata */ };

export default function StaticPage() {
  return (
    <PublicLayout>
      {/* Static content */}
    </PublicLayout>
  );
}
```

### For Interactive Pages (Contact, FAQs, etc.)
```tsx
// Client component - interactive features
'use client';
import { EnhancedPublicLayout } from '@/components/layout';

export default function InteractivePage() {
  return (
    <EnhancedPublicLayout>
      {/* Interactive content */}
    </EnhancedPublicLayout>
  );
}
```

## Benefits

1. **Solves prerendering errors** - No event handlers in server components
2. **Better SEO** - Static pages can be server-rendered with metadata
3. **Maintains interactivity** - Dynamic pages get full client-side features
4. **Clean separation** - Server and client concerns are properly separated
5. **Performance** - Static pages load faster, interactive pages load as needed

## Migration

Replace `PublicPageContainer` usage:
- Static content → `PublicLayout` (server component)
- Interactive content → `EnhancedPublicLayout` (client component)