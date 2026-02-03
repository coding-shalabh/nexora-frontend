'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Send } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';

// Animation variants for smooth login page transitions
const pageVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1],
    },
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      // Check both possible locations for error message
      const errorMessage = err.response?.data?.message || err.response?.data?.error?.message || '';

      // Check if it's an email verification issue
      if (
        errorMessage.toLowerCase().includes('verify') ||
        errorMessage.toLowerCase().includes('verification')
      ) {
        // Redirect to verify-email page with email parameter
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        return;
      } else if (err.response?.status === 401) {
        // Only show generic message if it's not a verification issue
        setError(errorMessage || 'Invalid email or password');
      } else if (errorMessage) {
        setError(errorMessage);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <motion.div variants={pageVariants} initial="hidden" animate="visible" exit="exit">
        <Card className="border-0 shadow-xl">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" exit="exit">
      <Card className="border-0 shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Enter your credentials to sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex flex-col gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
                {needsVerification && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    disabled={resendingEmail || resendSuccess}
                    onClick={async () => {
                      setResendingEmail(true);
                      try {
                        await api.post('/auth/resend-verification', { email: formData.email });
                        setResendSuccess(true);
                        setTimeout(() => setResendSuccess(false), 5000);
                      } catch (err) {
                        console.error('Resend verification error:', err);
                      } finally {
                        setResendingEmail(false);
                      }
                    }}
                  >
                    {resendingEmail ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : resendSuccess ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                        Verification email sent!
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Resend Verification Email
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button" disabled={isLoading}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
            <Button variant="outline" type="button" disabled={isLoading}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M21.5 12c0-5.25-4.25-9.5-9.5-9.5S2.5 6.75 2.5 12c0 4.74 3.47 8.67 8 9.38v-6.64H8.14V12h2.36V9.8c0-2.33 1.39-3.62 3.51-3.62 1.02 0 2.08.18 2.08.18v2.29h-1.17c-1.15 0-1.51.72-1.51 1.45V12h2.58l-.41 2.74h-2.17v6.64c4.53-.71 8-4.64 8-9.38z"
                  fill="#1877F2"
                />
              </svg>
              Microsoft
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>

          {/* Footer Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground border-t pt-4 w-full">
            <Link href="/privacy" className="hover:text-primary hover:underline">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-primary hover:underline">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/support" className="hover:text-primary hover:underline">
              Support
            </Link>
            <span>•</span>
            <Link href="/data-deletion" className="hover:text-primary hover:underline">
              Data Deletion
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
