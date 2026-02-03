'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Mail,
  Send,
  XCircle,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';
import { api } from '@/lib/api';

const MAX_RESEND_ATTEMPTS = 5;

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [status, setStatus] = useState('loading'); // loading, success, error, no-token, pending, blocked
  const [error, setError] = useState('');
  const [resendCount, setResendCount] = useState(0);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verifying, setVerifying] = useState(false);

  const verifyToken = useCallback(async () => {
    if (!token) {
      // No token - show pending state if email is provided
      if (email) {
        setStatus('pending');
      } else {
        setStatus('no-token');
      }
      return;
    }

    // Check if we already verified this token in this session
    const verifiedKey = `email_verified_${token.substring(0, 8)}`;
    if (sessionStorage.getItem(verifiedKey)) {
      setStatus('success');
      return;
    }

    try {
      await api.post('/auth/verify-email', { token });
      // Store success in session to handle page refresh
      sessionStorage.setItem(verifiedKey, 'true');
      setStatus('success');
    } catch (err) {
      console.error('Email verification error:', err);
      const errorMessage = err.response?.data?.message || '';

      // If token was already used, it might mean verification succeeded on first try
      if (errorMessage.includes('expired') || errorMessage.includes('Invalid')) {
        setStatus('already-used');
      } else {
        setStatus('error');
        setError(errorMessage || 'Failed to verify email. Please try again.');
      }
    }
  }, [token, email]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const handleResend = async () => {
    if (!email || resendCount >= MAX_RESEND_ATTEMPTS) {
      return;
    }

    setResending(true);
    setError('');
    setResendSuccess(false);

    try {
      const response = await api.post('/auth/resend-verification', { email });

      if (response.data?.blocked) {
        setStatus('blocked');
        setError('Your account has been blocked due to too many resend attempts.');
      } else if (response.data?.remainingAttempts !== undefined) {
        setResendCount(MAX_RESEND_ATTEMPTS - response.data.remainingAttempts);
        if (response.data.remainingAttempts === 0) {
          setStatus('blocked');
        } else {
          setResendSuccess(true);
          setTimeout(() => setResendSuccess(false), 5000);
        }
      } else {
        setResendSuccess(true);
        setResendCount((prev) => prev + 1);
        setTimeout(() => setResendSuccess(false), 5000);
      }
    } catch (err) {
      console.error('Resend error:', err);
      const message = err.response?.data?.message || 'Failed to resend verification email';
      if (message.toLowerCase().includes('blocked') || message.toLowerCase().includes('limit')) {
        setStatus('blocked');
      }
      setError(message);
    } finally {
      setResending(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      await api.post('/auth/verify-email', { token: verificationCode });
      setStatus('success');
    } catch (err) {
      console.error('Verification error:', err);
      const errorMessage =
        err.response?.data?.message || 'Invalid verification code. Please try again.';
      setError(errorMessage);
    } finally {
      setVerifying(false);
    }
  };

  if (status === 'loading') {
    return (
      <Card className="border-0 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          </div>
          <CardTitle className="text-2xl font-bold">Verifying your email</CardTitle>
          <CardDescription className="text-base">
            Please wait while we verify your email address...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (status === 'success') {
    return (
      <Card className="border-0 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold">Email verified!</CardTitle>
          <CardDescription className="text-base">
            Your email address has been verified successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            You now have full access to all features. Thank you for verifying your email.
          </p>
          <Button onClick={() => router.push('/login')} className="w-full">
            Continue to Login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (status === 'blocked') {
    return (
      <Card className="border-0 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">Account Temporarily Blocked</CardTitle>
          <CardDescription>
            You have exceeded the maximum number of verification email resend attempts.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground mb-2">
              Please contact our support team to unblock your account:
            </p>
            <div className="space-y-1">
              <p className="font-medium">
                <a href="mailto:hello@helixcode.in" className="text-primary hover:underline">
                  hello@helixcode.in
                </a>
              </p>
              <p className="text-sm text-muted-foreground">or reach out to your account manager:</p>
              <p className="font-medium">
                <a href="mailto:arpit.sharma@helixcode.in" className="text-primary hover:underline">
                  arpit.sharma@helixcode.in
                </a>
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/login">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  if (status === 'pending') {
    return (
      <Card className="border-0 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <Mail className="h-8 w-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription>
            {email ? (
              <>
                We sent a 6-digit verification code to{' '}
                <strong className="text-foreground">{email}</strong>.
                <br />
                Enter the code below to verify your account.
              </>
            ) : (
              'Please check your email inbox for the verification code.'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {resendSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-100 text-green-700 text-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>New verification code sent! Please check your inbox.</span>
            </div>
          )}

          {/* Code Input Form */}
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium text-center block">
                Enter 6-digit verification code
              </label>
              <input
                id="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full text-center text-2xl tracking-[0.5em] font-mono py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                autoComplete="one-time-code"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={verifying || verificationCode.length !== 6}
            >
              {verifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Verify Email
                </>
              )}
            </Button>
          </form>

          <div className="p-4 rounded-lg bg-muted/50 border border-dashed">
            <p className="text-sm text-muted-foreground text-center mb-3">
              Didn&apos;t receive the code? Check your spam folder or click below to resend.
            </p>

            <Button
              variant="outline"
              className="w-full"
              disabled={resending || resendSuccess || !email || resendCount >= MAX_RESEND_ATTEMPTS}
              onClick={handleResend}
            >
              {resending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : resendSuccess ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                  Code Sent!
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Resend Verification Code
                </>
              )}
            </Button>

            {resendCount > 0 && (
              <p className="text-xs text-center mt-2 text-muted-foreground">
                {MAX_RESEND_ATTEMPTS - resendCount} resend
                {MAX_RESEND_ATTEMPTS - resendCount !== 1 ? 's' : ''} remaining
              </p>
            )}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Need help?{' '}
              <a href="mailto:hello@helixcode.in" className="text-primary hover:underline">
                Contact support
              </a>
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/login">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  if (status === 'no-token') {
    return (
      <Card className="border-0 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Mail className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Invalid Link</CardTitle>
          <CardDescription className="text-base">
            This verification link is invalid or incomplete
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Please make sure you copied the complete link from your email, or sign in to request a
            new verification email.
          </p>
          <Button onClick={() => router.push('/login')} className="w-full">
            Go to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (status === 'already-used') {
    return (
      <Card className="border-0 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold">Email Already Verified</CardTitle>
          <CardDescription className="text-base">
            Your email has already been verified
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            This verification link has already been used. Your email is verified and you have full
            access to all features.
          </p>
          <Button onClick={() => router.push('/login')} className="w-full">
            Continue to Login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Error state
  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <CardTitle className="text-2xl font-bold">Verification Failed</CardTitle>
        <CardDescription className="text-base">
          {error || 'Unable to verify your email address'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          The verification link may have expired or already been used. Please sign in and request a
          new verification email.
        </p>
        <Button onClick={() => router.push('/login')} className="w-full">
          Go to Login
        </Button>
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <Card className="border-0 shadow-xl">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
