'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Bot, Shield, Clock, TrendingUp, Bell, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AuthorizePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState('+91');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const state = searchParams.get('state');

  useEffect(() => {
    if (!state) {
      setError('Invalid authorization request. Please try again from Settings.');
    }
  }, [state]);

  const handleAuthorize = async () => {
    if (!phone || phone === '+91') {
      setError('Please enter your WhatsApp number');
      return;
    }

    if (!/^\+\d{10,15}$/.test(phone)) {
      setError('Please enter a valid phone number (10-15 digits)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/v1/ai-assistant/link/authorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          whatsappNumber: phone,
          state,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(data.redirectUrl);
      } else {
        setError(data.error || 'Failed to link WhatsApp. Please try again.');
      }
    } catch (err) {
      console.error('Authorization error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/settings/ai-assistant');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Bot className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Nexora AI Assistant</h1>
          </div>
          <p className="text-blue-100">WhatsApp Authorization</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Authorization Request */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h2 className="font-semibold text-gray-900 mb-2">
              Nexora AI Assistant wants to connect to your WhatsApp
            </h2>
            <p className="text-sm text-gray-600">
              Enter your WhatsApp number to receive business insights and analytics directly on
              WhatsApp.
            </p>
          </div>

          {/* What You'll Get */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">What you'll receive:</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Real-time Analytics</p>
                  <p className="text-sm text-gray-600">
                    Sales reports, CRM insights, ticket stats on demand
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Automated Reports</p>
                  <p className="text-sm text-gray-600">
                    Daily/weekly summaries at your preferred time
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Event Alerts</p>
                  <p className="text-sm text-gray-600">
                    Instant notifications for deals won, SLA breaches, etc.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Phone Input */}
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              WhatsApp Number
            </label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+919876543210"
              className="text-lg"
              disabled={loading || !state}
            />
            <p className="text-xs text-gray-500">Include country code (e.g., +91 for India)</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* What You're Authorizing */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-semibold">
              <Shield className="w-5 h-5" />
              <span>What you're authorizing:</span>
            </div>
            <ul className="text-sm text-amber-800 space-y-1 ml-7">
              <li>• AI assistant can send messages to this number</li>
              <li>• Access to business data based on your role permissions</li>
              <li>• Link expires after 30 days (can be renewed)</li>
              <li>• You can revoke access anytime from Settings</li>
            </ul>
          </div>

          {/* Security Notice */}
          <div className="flex items-start gap-2 text-xs text-gray-500">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            <p>
              Your data is secure. We only access information you have permission to view in Nexora.
              Messages are end-to-end encrypted by WhatsApp.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={handleAuthorize}
              disabled={loading || !state}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Authorizing...
                </span>
              ) : (
                'Authorize & Link'
              )}
            </Button>
          </div>

          {/* Terms */}
          <p className="text-xs text-center text-gray-500">
            By authorizing, you agree to our{' '}
            <a href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
