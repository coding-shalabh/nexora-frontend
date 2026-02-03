'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { User, Building, Mail, ArrowRight, Lock } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('info');
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
  });

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Call API to create account and send OTP
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setStep('otp');
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Call API to verify OTP and complete signup
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    router.push('/onboarding');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          {step === 'info' ? 'Start your 14-day free trial' : `We sent a code to ${formData.email}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'info' ? (
          <form onSubmit={handleInfoSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="company"
                  type="text"
                  placeholder="Acme Inc"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Work Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Account'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="pl-10 text-center tracking-widest"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify & Continue'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setStep('info')}
            >
              Back to signup
            </Button>
          </form>
        )}

        <p className="text-xs text-muted-foreground mt-4 text-center">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
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
  );
}
