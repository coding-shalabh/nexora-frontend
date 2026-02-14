'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Link2,
  Unlink,
  CheckCircle2,
  XCircle,
  ExternalLink,
  RefreshCw,
  Loader2,
  Calendar,
  Video,
  Mail,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UnifiedLayout } from '@/components/layout/unified';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ConnectedAccountsPage() {
  const { toast } = useToast();
  const [connecting, setConnecting] = useState(null);
  const [accounts, setAccounts] = useState({
    google: null,
    microsoft: null,
    zoom: null,
  });

  const platforms = [
    {
      id: 'google',
      name: 'Google Workspace',
      description: 'Connect Google Calendar and Google Meet',
      icon: (
        <svg className="h-8 w-8" viewBox="0 0 24 24">
          <path
            fill="#4285f4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34a853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#fbbc05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#ea4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      ),
      color: 'from-blue-500 to-indigo-600',
      features: ['Google Calendar', 'Google Meet', 'Gmail'],
      scopes: [
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/gmail.send',
      ],
    },
    {
      id: 'microsoft',
      name: 'Microsoft 365',
      description: 'Connect Outlook Calendar and Microsoft Teams',
      icon: (
        <svg className="h-8 w-8" viewBox="0 0 24 24">
          <path
            fill="#00a4ef"
            d="M0 0h11.377v11.372H0V0zm12.623 0H24v11.372H12.623V0zM0 12.623h11.377V24H0V12.623zm12.623 0H24V24H12.623V12.623z"
          />
        </svg>
      ),
      color: 'from-blue-600 to-cyan-600',
      features: ['Outlook Calendar', 'Microsoft Teams', 'OneDrive'],
      scopes: ['Calendars.ReadWrite', 'OnlineMeetings.ReadWrite'],
    },
    {
      id: 'zoom',
      name: 'Zoom',
      description: 'Connect Zoom for video meetings',
      icon: (
        <svg className="h-8 w-8" viewBox="0 0 24 24">
          <path
            fill="#2d8cff"
            d="M21.5 12c0 5.247-4.253 9.5-9.5 9.5S2.5 17.247 2.5 12 6.753 2.5 12 2.5s9.5 4.253 9.5 9.5z"
          />
          <path
            fill="#fff"
            d="M15.5 8.5h-7c-.55 0-1 .45-1 1v5c0 .55.45 1 1 1h7c.55 0 1-.45 1-1v-5c0-.55-.45-1-1-1z"
          />
        </svg>
      ),
      color: 'from-blue-400 to-blue-600',
      features: ['Zoom Meetings', 'Zoom Webinars'],
      scopes: ['meeting:write', 'meeting:read'],
    },
  ];

  useEffect(() => {
    // Load connected accounts from backend
    loadConnectedAccounts();

    // Check for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && state) {
      handleOAuthCallback(state, code);
    }
  }, []);

  const loadConnectedAccounts = async () => {
    try {
      // TODO: Replace with actual API call
      const response = await api.get('/settings/connected-accounts');
      setAccounts(response.data);
    } catch (error) {
      console.error('Failed to load connected accounts:', error);
    }
  };

  const handleConnect = (platformId) => {
    setConnecting(platformId);

    const platform = platforms.find((p) => p.id === platformId);
    const redirectUri = `${window.location.origin}/settings/connected-accounts`;
    const state = `${platformId}_${Date.now()}`;

    // Store state in sessionStorage for verification
    sessionStorage.setItem('oauth_state', state);

    let authUrl = '';

    if (platformId === 'google') {
      // Google OAuth URL
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
      const scopes = platform.scopes.join(' ');
      authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes)}&state=${state}&access_type=offline&prompt=consent`;
    } else if (platformId === 'microsoft') {
      // Microsoft OAuth URL
      const clientId = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID || 'YOUR_MICROSOFT_CLIENT_ID';
      const scopes = platform.scopes.join(' ');
      authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes)}&state=${state}`;
    } else if (platformId === 'zoom') {
      // Zoom OAuth URL
      const clientId = process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID || 'YOUR_ZOOM_CLIENT_ID';
      authUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
    }

    // Redirect to OAuth provider
    window.location.href = authUrl;
  };

  const handleOAuthCallback = async (state, code) => {
    try {
      // Verify state
      const savedState = sessionStorage.getItem('oauth_state');
      if (state !== savedState) {
        throw new Error('Invalid state parameter');
      }

      // Extract platform from state
      const [platformId] = state.split('_');

      // Exchange code for tokens (backend API call)
      const response = await api.post('/settings/oauth/callback', {
        platform: platformId,
        code,
        redirect_uri: `${window.location.origin}/settings/connected-accounts`,
      });

      setAccounts((prev) => ({
        ...prev,
        [platformId]: response.data,
      }));

      toast({
        title: 'Account Connected',
        description: `Successfully connected your ${platforms.find((p) => p.id === platformId)?.name} account`,
      });

      // Clean up URL
      window.history.replaceState({}, '', '/settings/connected-accounts');
      sessionStorage.removeItem('oauth_state');
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: error.message || 'Failed to connect account',
        variant: 'destructive',
      });
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (platformId) => {
    try {
      await api.delete(`/settings/connected-accounts/${platformId}`);

      setAccounts((prev) => ({
        ...prev,
        [platformId]: null,
      }));

      toast({
        title: 'Account Disconnected',
        description: `Successfully disconnected your ${platforms.find((p) => p.id === platformId)?.name} account`,
      });
    } catch (error) {
      toast({
        title: 'Disconnection Failed',
        description: 'Failed to disconnect account',
        variant: 'destructive',
      });
    }
  };

  return (
    <UnifiedLayout hubId="settings" pageTitle="Connected Accounts" fixedMenu={null}>
      <motion.div
        className="h-full overflow-y-auto p-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <motion.div variants={itemVariants}>
            <h1 className="text-2xl font-bold text-gray-900">Connected Accounts</h1>
            <p className="text-gray-500 mt-1">
              Connect your business accounts to enable calendar sync, meeting creation, and more
            </p>
          </motion.div>

          {/* Info Banner */}
          <motion.div
            variants={itemVariants}
            className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3"
          >
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Secure OAuth 2.0 Authentication</h3>
              <p className="text-sm text-blue-700 mt-1">
                We use industry-standard OAuth 2.0 for secure authentication. We never store your
                passwords, and you can revoke access anytime.
              </p>
            </div>
          </motion.div>

          {/* Platform Cards */}
          <div className="grid gap-4">
            {platforms.map((platform, index) => {
              const account = accounts[platform.id];
              const isConnected = !!account;
              const isConnecting = connecting === platform.id;

              return (
                <motion.div key={platform.id} variants={itemVariants}>
                  <Card className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        {/* Platform Info */}
                        <div className="flex items-start gap-4 flex-1">
                          <div
                            className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${platform.color} flex items-center justify-center shadow-lg`}
                          >
                            {platform.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg text-gray-900">
                                {platform.name}
                              </h3>
                              {isConnected && (
                                <Badge className="bg-green-100 text-green-700 border-0">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Connected
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mb-3">{platform.description}</p>

                            {/* Features */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {platform.features.map((feature) => (
                                <Badge
                                  key={feature}
                                  variant="outline"
                                  className="text-xs font-normal"
                                >
                                  {feature}
                                </Badge>
                              ))}
                            </div>

                            {/* Connected Account Info */}
                            {isConnected && account && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="h-4 w-4 text-gray-400" />
                                  <span className="font-medium text-gray-700">
                                    {account.email || 'account@example.com'}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  Connected on {new Date(account.connectedAt).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="ml-4">
                          {isConnected ? (
                            <div className="flex flex-col gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDisconnect(platform.id)}
                                className="rounded-lg"
                              >
                                <Unlink className="h-4 w-4 mr-2" />
                                Disconnect
                              </Button>
                              <Button variant="ghost" size="sm" className="rounded-lg text-xs">
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Refresh
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => handleConnect(platform.id)}
                              disabled={isConnecting}
                              className={`rounded-lg bg-gradient-to-r ${platform.color} text-white hover:opacity-90`}
                            >
                              {isConnecting ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Connecting...
                                </>
                              ) : (
                                <>
                                  <Link2 className="h-4 w-4 mr-2" />
                                  Connect
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Help Section */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong>Why connect accounts?</strong> Connecting your accounts allows Nexora to:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Automatically create meeting links when scheduling</li>
                  <li>Sync calendar events in real-time</li>
                  <li>Send meeting invites to attendees</li>
                  <li>Check availability before booking</li>
                </ul>
                <p className="mt-4">
                  <strong>Security:</strong> All connections use OAuth 2.0 and can be revoked at any
                  time. Learn more in our{' '}
                  <a href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </UnifiedLayout>
  );
}
