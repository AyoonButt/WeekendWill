import React from 'react';

interface PublicLayoutProps {
  children: React.ReactNode;
}

// Simple server-side layout component  
export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-teal-50">
      {/* Static header placeholder - no interactivity */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold text-primary-600">
                  Weekend Will
                </span>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="/how-it-works" className="text-charcoal-600 hover:text-charcoal-900 px-3 py-2 text-sm font-medium">
                How It Works
              </a>
              <a href="/pricing" className="text-charcoal-600 hover:text-charcoal-900 px-3 py-2 text-sm font-medium">
                Pricing
              </a>
              <a href="/faqs" className="text-charcoal-600 hover:text-charcoal-900 px-3 py-2 text-sm font-medium">
                FAQs
              </a>
              <a href="/contact" className="text-charcoal-600 hover:text-charcoal-900 px-3 py-2 text-sm font-medium">
                Contact
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <a
                href="/login"
                className="text-charcoal-600 hover:text-charcoal-900 px-3 py-2 text-sm font-medium"
              >
                Sign In
              </a>
              <a
                href="/register"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>{children}</main>

      {/* Static footer */}
      <footer className="bg-charcoal-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold text-primary-400">
                  Weekend Will
                </span>
              </div>
              <p className="text-gray-300 mb-4">
                Creating legally valid wills made simple and affordable for everyone.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
                Product
              </h3>
              <ul className="space-y-2">
                <li><a href="/how-it-works" className="text-gray-300 hover:text-white">How It Works</a></li>
                <li><a href="/pricing" className="text-gray-300 hover:text-white">Pricing</a></li>
                <li><a href="/faqs" className="text-gray-300 hover:text-white">FAQs</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
                Legal
              </h3>
              <ul className="space-y-2">
                <li><a href="/legal/terms" className="text-gray-300 hover:text-white">Terms of Service</a></li>
                <li><a href="/legal/privacy" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
                <li><a href="/contact" className="text-gray-300 hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-center text-gray-400 text-sm">
              © 2024 Weekend Will. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}