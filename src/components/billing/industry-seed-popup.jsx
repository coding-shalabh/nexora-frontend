'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, Zap, Database } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { INDUSTRY_PROFILES } from '@/config/industry-terminology';

const LOADING_MESSAGES = [
  'Creating contacts...',
  'Setting up pipeline stages...',
  'Adding deals...',
  'Configuring products...',
  'Seeding activities...',
  'Finalizing workspace...',
];

export default function IndustrySeedPopup({ open, onClose, industryId: propIndustryId }) {
  const router = useRouter();
  const [isSeeding, setIsSeeding] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [error, setError] = useState(null);

  // Resolve industry ID from prop or localStorage
  const industryId =
    propIndustryId ||
    (() => {
      try {
        const tenant = JSON.parse(localStorage.getItem('tenant') || '{}');
        return tenant?.settings?.industryId || 'other';
      } catch {
        return 'other';
      }
    })();

  const profile = INDUSTRY_PROFILES[industryId] || {
    emoji: '🚀',
    label: 'Business',
  };

  // Cycle through loading messages while seeding
  useEffect(() => {
    if (!isSeeding) return;
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isSeeding]);

  const handleSeed = async () => {
    setIsSeeding(true);
    setError(null);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/admin/seed-industry`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ industryId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to seed data');
      }

      setIsDone(true);
      setIsSeeding(false);

      // Redirect after brief success display
      setTimeout(() => {
        router.push('/home');
      }, 1500);
    } catch (err) {
      setIsSeeding(false);
      setError(err.message || 'An error occurred');
    }
  };

  const handleSkip = () => {
    router.push('/home');
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="text-4xl mb-2 text-center">{profile.emoji}</div>
          <DialogTitle className="text-center text-xl">
            {isDone ? 'Workspace ready!' : `Populate ${profile.label} Demo Data?`}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isDone
              ? 'Your industry-specific data has been seeded. Redirecting to your workspace...'
              : "We'll add sample contacts, deals, pipeline stages, and activities so you can explore Nexora right away."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {/* Error State */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 mb-4 text-center">
              {error}
            </div>
          )}

          {/* Done State */}
          {isDone && (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-sm text-gray-600">Your {profile.label} workspace is ready.</p>
            </div>
          )}

          {/* Loading State */}
          {isSeeding && !isDone && (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              </div>
              <p className="text-sm text-blue-700 font-medium animate-pulse">
                {LOADING_MESSAGES[messageIndex]}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {!isSeeding && !isDone && (
            <div className="flex flex-col gap-3">
              <Button onClick={handleSeed} className="w-full gap-2" size="lg">
                <Database className="h-4 w-4" />
                Yes, populate data
              </Button>
              <Button onClick={handleSkip} variant="ghost" className="w-full">
                Start with empty workspace
              </Button>
            </div>
          )}

          {/* What gets seeded - info */}
          {!isSeeding && !isDone && (
            <div className="mt-4 rounded-lg bg-gray-50 border border-gray-100 p-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-2">
                <Zap className="h-3 w-3" />
                What we&apos;ll add
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-600">
                {['Sample contacts', 'Pipeline stages', 'Demo deals', 'Activities'].map((item) => (
                  <div key={item} className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
