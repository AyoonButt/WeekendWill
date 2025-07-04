'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  FolderIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Button } from '@/components/ui';
import { SecurityBadge } from '@/components/estate-planning';
import { cn, getInitials } from '@/utils';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const navigation = [
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'About', href: '/about' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Contact', href: '/contact' },
    { name: 'Support', href: '/chat' },
  ];

  const userNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: DocumentTextIcon },
    { name: 'My Documents', href: '/documents', icon: FolderIcon },
    { name: 'Account Settings', href: '/account', icon: Cog6ToothIcon },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <nav className="container-wide" aria-label="Global">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <Image 
                src="/image.png" 
                alt="Weekend Will Logo" 
                width={160}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center space-x-4 lg:space-x-8 bg-gray-50 px-4 py-2 rounded-lg max-sm:hidden">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary-600',
                  isActive(item.href)
                    ? 'text-primary-600'
                    : 'text-charcoal-900'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Security indicator for public pages */}
            {!session && (
              <div className="hidden md:block">
                <SecurityBadge features={['encrypted', 'secure-access']} />
              </div>
            )}

            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : session ? (
              <>
                {/* User menu */}
                <Menu as="div" className="relative">
                  <MenuButton className="flex items-center space-x-2 text-sm rounded-lg p-2 hover:bg-gray-100 transition-colors">
                    {session.user.image ? (
                      <img
                        className="w-8 h-8 rounded-full"
                        src={session.user.image}
                        alt={session.user.name || 'User avatar'}
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {getInitials(
                          session.user.name?.split(' ')[0] || 'U',
                          session.user.name?.split(' ')[1] || 'U'
                        )}
                      </div>
                    )}
                    <span className="hidden md:block font-medium text-charcoal-700">
                      {session.user.name?.split(' ')[0] || 'User'}
                    </span>
                    <ChevronDownIcon className="w-4 h-4 text-charcoal-500" />
                  </MenuButton>

                  <MenuItems className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 focus:outline-none">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-charcoal-900">
                        {session.user.name}
                      </p>
                      <p className="text-sm text-charcoal-600">
                        {session.user.email}
                      </p>
                    </div>
                    
                    {userNavigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <MenuItem key={item.name}>
                          <Link
                            href={item.href}
                            className="flex items-center px-4 py-2 text-sm text-charcoal-700 hover:bg-gray-100 transition-colors"
                          >
                            <Icon className="w-4 h-4 mr-3" />
                            {item.name}
                          </Link>
                        </MenuItem>
                      );
                    })}
                    
                    <MenuItem>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-charcoal-700 hover:bg-gray-100 transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                        Sign out
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </>
            ) : (
              <>
                {/* Sign in / Sign up buttons */}
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile menu button - show only on mobile */}
            <button
              type="button"
              className="max-sm:inline-flex hidden -m-2.5 items-center justify-center rounded-md p-2.5 text-charcoal-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open main menu"
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="max-sm:block hidden">
            <div className="fixed inset-0 z-50">
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(false)}
              />
              
              {/* Menu panel */}
              <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                <div className="flex items-center justify-between">
                  <Link 
                    href="/" 
                    className="flex items-center hover:opacity-80 transition-opacity"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Image 
                      src="/image.png" 
                      alt="Weekend Will Logo" 
                      width={128}
                      height={32}
                      className="h-8 w-auto"
                    />
                  </Link>
                  <button
                    type="button"
                    className="-m-2.5 rounded-md p-2.5 text-charcoal-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                
                <div className="mt-6 flow-root">
                  <div className="-my-6 divide-y divide-gray-500/10">
                    {/* Navigation links */}
                    <div className="space-y-2 py-6">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={cn(
                            '-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-gray-50',
                            isActive(item.href)
                              ? 'text-primary-600'
                              : 'text-charcoal-900'
                          )}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    
                    {/* User section */}
                    <div className="py-6">
                      {session ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3 px-3 py-2">
                            {session.user.image ? (
                              <img
                                className="w-10 h-10 rounded-full"
                                src={session.user.image}
                                alt={session.user.name || 'User avatar'}
                              />
                            ) : (
                              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                                {getInitials(
                                  session.user.name?.split(' ')[0] || 'U',
                                  session.user.name?.split(' ')[1] || 'U'
                                )}
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-charcoal-900">
                                {session.user.name}
                              </p>
                              <p className="text-xs text-charcoal-600">
                                {session.user.email}
                              </p>
                            </div>
                          </div>
                          
                          {userNavigation.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center -mx-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-charcoal-900 hover:bg-gray-50"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <Icon className="w-5 h-5 mr-3" />
                                {item.name}
                              </Link>
                            );
                          })}
                          
                          <button
                            onClick={() => {
                              setMobileMenuOpen(false);
                              handleSignOut();
                            }}
                            className="flex items-center w-full -mx-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-charcoal-900 hover:bg-gray-50"
                          >
                            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                            Sign out
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Link 
                            href="/login"
                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-charcoal-900 hover:bg-gray-50"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Sign in
                          </Link>
                          <Link 
                            href="/register"
                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white bg-primary-600 hover:bg-primary-700"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Get Started
                          </Link>
                        </div>
                      )}
                    </div>
                    
                    {/* Security indicator */}
                    <div className="py-6">
                      <SecurityBadge features={['encrypted', 'secure-access']} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;