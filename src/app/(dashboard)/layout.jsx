'use client';

import { GlobalHeader } from '@/components/layout/global-header';
import { FloatingChatbot } from '@/components/layout/floating-chatbot';
import { AuthGuard } from '@/components/auth/auth-guard';
import { KeyboardShortcuts } from '@/components/layout/keyboard-shortcuts';
import { EmailVerificationBanner } from '@/components/email-verification-banner';
import { SocketProvider } from '@/context/socket-context';
import { TelecmiProvider } from '@/providers/telecmi-provider';
import { TelecmiCallWidget } from '@/components/telecmi';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { TerminologyProvider } from '@/contexts/terminology-context';

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
      <TerminologyProvider>
        <SocketProvider>
          <TelecmiProvider>
            {/* Email Verification Banner - Fixed at top */}
            <EmailVerificationBanner />

            <div
              className={`flex h-screen flex-col overflow-hidden bg-background text-foreground ${showVerificationBanner ? 'pt-[52px]' : ''}`}
            >
              {/* Global Header - Always visible */}
              <GlobalHeader />

              {/* Main Content Area */}
              <div className="relative flex flex-1 overflow-hidden">
                {/* Content Area */}
                <main
                  className={`relative flex-1 ${hasOwnLayout ? 'overflow-hidden' : 'overflow-auto'}`}
                >
                  <div className={hasOwnLayout ? 'h-full' : 'p-6 max-w-7xl mx-auto w-full'}>
                    {children}
                  </div>
                </main>
              </div>

              {/* Global Keyboard Shortcuts */}
              <KeyboardShortcuts />

              {/* Floating Chatbot - Always visible */}
              <FloatingChatbot />

              {/* TeleCMI Call Widget - Shows during active calls */}
              <TelecmiCallWidget />
            </div>
          </TelecmiProvider>
        </SocketProvider>
      </TerminologyProvider>
    </AuthGuard>
  );
}
