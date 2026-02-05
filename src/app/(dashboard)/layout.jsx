'use client';

import { GlobalHeader } from '@/components/layout/global-header';
import { FloatingActionButton } from '@/components/layout/floating-action-button';
import { AuthGuard } from '@/components/auth/auth-guard';
import { KeyboardShortcuts } from '@/components/layout/keyboard-shortcuts';
import { EmailVerificationBanner } from '@/components/email-verification-banner';
import { SocketProvider } from '@/context/socket-context';
import { TelecmiProvider } from '@/providers/telecmi-provider';
import { TelecmiCallWidget } from '@/components/telecmi';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

// Page transition variants
const pageVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
      mass: 0.8,
      delayChildren: 0.2,
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  },
};

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { user } = useAuth();

  // Check if email verification banner should show
  const showVerificationBanner = user && !user.emailVerified;

  // Pages with their own sidebar layout handle their own padding
  const hasOwnLayout =
    pathname.startsWith('/inbox') ||
    pathname.startsWith('/crm') ||
    pathname.startsWith('/pipeline') ||
    pathname.startsWith('/sales') ||
    pathname.startsWith('/marketing') ||
    pathname.startsWith('/service') ||
    pathname.startsWith('/commerce') ||
    pathname.startsWith('/tickets') ||
    pathname.startsWith('/projects') ||
    pathname.startsWith('/hr') ||
    pathname.startsWith('/analytics') ||
    pathname.startsWith('/automation') ||
    pathname.startsWith('/settings');

  return (
    <AuthGuard>
      <SocketProvider>
        <TelecmiProvider>
          {/* Email Verification Banner - Fixed at top */}
          <EmailVerificationBanner />

          <div
            className={`flex h-screen flex-col overflow-hidden bg-background ${showVerificationBanner ? 'pt-[52px]' : ''}`}
          >
            {/* Global Header - Always visible */}
            <GlobalHeader />

            {/* Main Content Area */}
            <div className="relative flex flex-1 overflow-hidden">
              {/* Content Area */}
              <main
                className={`relative flex-1 ${hasOwnLayout ? 'overflow-hidden' : 'overflow-auto'}`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={pathname}
                    variants={pageVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={hasOwnLayout ? 'h-full' : 'p-6 max-w-7xl mx-auto w-full'}
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>
              </main>
            </div>

            {/* Global Keyboard Shortcuts */}
            <KeyboardShortcuts />

            {/* Floating Action Button - Always visible */}
            <FloatingActionButton />

            {/* TeleCMI Call Widget - Shows during active calls */}
            <TelecmiCallWidget />
          </div>
        </TelecmiProvider>
      </SocketProvider>
    </AuthGuard>
  );
}
