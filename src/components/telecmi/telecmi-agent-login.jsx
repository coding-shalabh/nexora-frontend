'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Phone, PhoneCall, LogOut, User, Key, Loader2, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTelecmiStore, useLoginTelecmiAgent, useLogoutTelecmiAgent } from '@/hooks/use-telecmi';
import { useTelecmi } from '@/providers/telecmi-provider';

/**
 * TeleCMI Agent Login Component
 * Allows agents to login/logout from TeleCMI for voice calls
 */
export function TelecmiAgentLogin({ className }) {
  const { isLoggedIn, agentInfo } = useTelecmiStore();
  const { sdkReady, error: sdkError } = useTelecmi();
  const loginMutation = useLoginTelecmiAgent();
  const logoutMutation = useLogoutTelecmiAgent();

  const [extension, setExtension] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!extension || !password) {
      setError('Please enter extension and password');
      return;
    }

    try {
      await loginMutation.mutateAsync({ extension, password });
      setExtension('');
      setPassword('');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (isLoggedIn) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <PhoneCall className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-lg">{agentInfo?.name || 'Agent'}</CardTitle>
                <CardDescription>
                  Extension: {agentInfo?.extension || agentInfo?.id?.split('_')[0]}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {sdkReady ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Check className="h-3 w-3 mr-1" />
                  Ready
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Connecting
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sdkError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{sdkError}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              You are logged in and can make/receive calls
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4 mr-2" />
              )}
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-lg">TeleCMI Voice</CardTitle>
            <CardDescription>Login to make and receive calls</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="extension">Extension</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="extension"
                type="text"
                placeholder="e.g., 101"
                value={extension}
                onChange={(e) => setExtension(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <PhoneCall className="h-4 w-4 mr-2" />
                Login
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default TelecmiAgentLogin;
