import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Admin routes protection
    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Dashboard routes protection
    if (pathname.startsWith('/dashboard') && !token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Interview routes protection
    if (pathname.startsWith('/interview') && !token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Redirect authenticated users away from auth pages
    if (pathname.startsWith('/login') && token) {
      console.log('Middleware: Redirecting authenticated user from login to dashboard');
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (pathname.startsWith('/register') && token) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow access to public routes
        if (pathname.startsWith('/api/auth') || 
            pathname === '/' || 
            pathname.startsWith('/pricing') ||
            pathname.startsWith('/how-it-works') ||
            pathname.startsWith('/faqs') ||
            pathname.startsWith('/blog') ||
            pathname.startsWith('/legal')) {
          return true;
        }

        // Require authentication for protected routes
        if (pathname.startsWith('/dashboard') || 
            pathname.startsWith('/interview') ||
            pathname.startsWith('/admin')) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};