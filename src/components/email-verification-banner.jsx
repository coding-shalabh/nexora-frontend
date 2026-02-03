'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';

export function EmailVerificationBanner() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Don't show if email is verified or no user
  if (!user || user.emailVerified) {
    return null;
  }

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      await api.post('/auth/send-verification');
      setIsSent(true);
      toast({
        title: 'Verification email sent',
        description: 'Please check your inbox and click the verification link.',
      });
    } catch (err) {
      console.error('Failed to send verification email:', err);
      toast({
        variant: 'destructive',
        title: 'Failed to send email',
        description: err.response?.data?.message || 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[100] bg-white dark:bg-gray-900 shadow-md border-b border-green-200 dark:border-green-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-sm font-medium text-green-700 dark:text-green-300">
              Verification email sent! Please check your inbox and click the link to verify your
              email address.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-white dark:bg-gray-900 shadow-md border-b border-amber-200 dark:border-amber-800">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Please verify your email address to access all features.
            </p>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={handleResendVerification}
            disabled={isLoading}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Resend Verification Email
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
