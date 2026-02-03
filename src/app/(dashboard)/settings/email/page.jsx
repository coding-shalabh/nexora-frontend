'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Mail,
  Plus,
  Loader2,
  XCircle,
  RefreshCw,
  ExternalLink,
  Eye,
  EyeOff,
  Link2,
  Unlink,
  Settings,
  Clock,
  Shield,
  Send,
  Inbox,
  Star,
  MoreHorizontal,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Users,
  UserPlus,
  X,
  Trash2,
  Globe,
  Copy,
  Check,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useEmailAccounts,
  useEmailProviders,
  useDetectEmailProvider,
  useConnectEmailIMAP,
  useDisconnectEmailAccount,
  useUpdateEmailAccount,
  useTestEmailConnection,
  useEmailAccountAccess,
  useGrantUserAccess,
  useGrantTeamAccess,
  useRevokeEmailAccess,
  useUpdateEmailAccess,
} from '@/hooks/use-email-accounts';
import {
  useEmailDomains,
  useAddEmailDomain,
  useVerifyEmailDomain,
  useSetDefaultDomain,
  useDeleteEmailDomain,
  useEmailDomain,
} from '@/hooks/use-email-domains';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth-context';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

// Hook to fetch tenant users
function useTenantUsers() {
  return useQuery({
    queryKey: ['tenant-users'],
    queryFn: async () => {
      const response = await api.get('/settings/users');
      return response.data?.users || response.data || [];
    },
  });
}

// Hook to fetch teams
function useTenantTeams() {
  return useQuery({
    queryKey: ['tenant-teams'],
    queryFn: async () => {
      const response = await api.get('/settings/teams');
      return response.data || [];
    },
  });
}

// Hook to fetch OAuth providers
function useOAuthProviders() {
  return useQuery({
    queryKey: ['oauth-providers'],
    queryFn: async () => {
      const response = await api.get('/oauth/providers');
      return response.data || {};
    },
  });
}

// Provider icons
const GmailIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
      fill="#EA4335"
    />
  </svg>
);

const OutlookIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M24 7.387v10.478c0 .23-.08.424-.238.576-.158.154-.352.233-.584.233h-8.501v-6.9l1.66 1.18c.1.063.209.095.329.095.12 0 .229-.032.329-.095l6.767-4.82.015-.012c.088-.058.132-.147.132-.266 0-.224-.133-.336-.399-.336h-.024l-8.809 6.278-8.809-6.278h-.024c-.266 0-.399.112-.399.336 0 .119.044.208.132.266l.015.012 6.767 4.82c.1.063.209.095.329.095.12 0 .229-.032.329-.095l1.66-1.18v6.9H.822c-.232 0-.426-.079-.584-.233-.158-.152-.238-.346-.238-.576V7.387c0-.23.08-.424.238-.576.158-.154.352-.233.584-.233h21.356c.232 0 .426.079.584.233.158.152.238.346.238.576z"
      fill="#0078D4"
    />
  </svg>
);

const YahooIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M14.5 12l6.5-8h-3.5l-4.5 6-4.5-6H5l6.5 8v8h3v-8z" fill="#6001D2" />
  </svg>
);

const AppleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83z"
      fill="#000"
    />
  </svg>
);

function getProviderIcon(provider) {
  switch (provider?.toUpperCase()) {
    case 'GMAIL':
    case 'GOOGLE':
      return GmailIcon;
    case 'OUTLOOK':
    case 'MICROSOFT':
      return OutlookIcon;
    case 'YAHOO':
      return YahooIcon;
    case 'ICLOUD':
    case 'APPLE':
      return AppleIcon;
    default:
      return Mail;
  }
}

function getProviderColor(provider) {
  switch (provider?.toUpperCase()) {
    case 'GMAIL':
    case 'GOOGLE':
      return { bg: 'bg-red-50', text: 'text-red-600' };
    case 'OUTLOOK':
    case 'MICROSOFT':
      return { bg: 'bg-blue-50', text: 'text-blue-600' };
    case 'YAHOO':
      return { bg: 'bg-purple-50', text: 'text-purple-600' };
    case 'ICLOUD':
    case 'APPLE':
      return { bg: 'bg-gray-100', text: 'text-gray-800' };
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-600' };
  }
}

function StatusBadge({ status }) {
  const config = {
    ACTIVE: { color: 'bg-green-100 text-green-700', label: 'Connected' },
    SYNCING: { color: 'bg-blue-100 text-blue-700', label: 'Syncing' },
    ERROR: { color: 'bg-red-100 text-red-700', label: 'Error' },
    EXPIRED: { color: 'bg-yellow-100 text-yellow-700', label: 'Expired' },
    DISCONNECTED: { color: 'bg-gray-100 text-gray-700', label: 'Disconnected' },
  };
  const { color, label } = config[status] || config.DISCONNECTED;
  return (
    <Badge className={cn('font-medium border-0', color)} variant="secondary">
      {label}
    </Badge>
  );
}

function DomainStatusBadge({ status }) {
  const config = {
    PENDING: { color: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
    VERIFYING: { color: 'bg-blue-100 text-blue-700', label: 'Verifying' },
    VERIFIED: { color: 'bg-green-100 text-green-700', label: 'Verified' },
    FAILED: { color: 'bg-red-100 text-red-700', label: 'Failed' },
    SUSPENDED: { color: 'bg-gray-100 text-gray-700', label: 'Suspended' },
  };
  const { color, label } = config[status] || config.PENDING;
  return (
    <Badge className={cn('font-medium border-0', color)} variant="secondary">
      {label}
    </Badge>
  );
}

function CopyButton({ value, className }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('h-8 w-8 rounded-lg', className)}
      onClick={handleCopy}
    >
      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}

// Permission level descriptions
const PERMISSION_LEVELS = {
  READ_ONLY: {
    label: 'Read Only',
    description: 'Can view emails only',
    color: 'bg-gray-100 text-gray-700',
  },
  READ_REPLY: {
    label: 'Read & Reply',
    description: 'Can view and reply to emails',
    color: 'bg-blue-100 text-blue-700',
  },
  FULL_ACCESS: {
    label: 'Full Access',
    description: 'Can send, delete, and manage emails',
    color: 'bg-green-100 text-green-700',
  },
};

function ConnectEmailModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    imapHost: '',
    imapPort: '',
    smtpHost: '',
    smtpPort: '',
  });

  const { data: providersData } = useEmailProviders();
  const { data: oauthProviders = {} } = useOAuthProviders();
  const detectProvider = useDetectEmailProvider();
  const testConnection = useTestEmailConnection();
  const connectIMAP = useConnectEmailIMAP();

  const providers = providersData || [];

  const handleEmailChange = async (email) => {
    setFormData({ ...formData, email });
    if (email.includes('@') && email.split('@')[1]?.length > 2) {
      try {
        const result = await detectProvider.mutateAsync(email);
        if (result) {
          setSelectedProvider(result);
          if (result.imap) {
            setFormData((prev) => ({
              ...prev,
              imapHost: result.imap.host?.replace('{domain}', email.split('@')[1]) || '',
              imapPort: result.imap.port?.toString() || '993',
              smtpHost: result.smtp?.host?.replace('{domain}', email.split('@')[1]) || '',
              smtpPort: result.smtp?.port?.toString() || '465',
            }));
          }
        }
      } catch (err) {
        console.error('Failed to detect provider:', err);
      }
    }
  };

  const handleTestConnection = async () => {
    if (!formData.email || !formData.password) {
      toast({
        title: 'Error',
        description: 'Please enter email and password',
        variant: 'destructive',
      });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const result = await testConnection.mutateAsync({
        email: formData.email,
        password: formData.password,
        imapHost: formData.imapHost,
        imapPort: parseInt(formData.imapPort) || 993,
      });
      setTestResult(result);
      if (result.success) {
        toast({ title: 'Success', description: 'Connection test successful!' });
      }
    } catch (err) {
      setTestResult({ success: false, error: err.message || 'Connection failed' });
      toast({ title: 'Error', description: 'Connection test failed', variant: 'destructive' });
    } finally {
      setTesting(false);
    }
  };

  const handleConnect = async () => {
    if (!formData.email || !formData.password) {
      toast({
        title: 'Error',
        description: 'Please enter email and password',
        variant: 'destructive',
      });
      return;
    }
    try {
      const result = await connectIMAP.mutateAsync({
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName || undefined,
        imapHost: formData.imapHost || undefined,
        imapPort: formData.imapPort ? parseInt(formData.imapPort) : undefined,
        smtpHost: formData.smtpHost || undefined,
        smtpPort: formData.smtpPort ? parseInt(formData.smtpPort) : undefined,
      });
      toast({
        title: 'Success',
        description: `Email ${result.email || formData.email} connected successfully!`,
      });
      onSuccess?.();
      handleClose();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to connect email',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedProvider(null);
    setFormData({
      email: '',
      password: '',
      displayName: '',
      imapHost: '',
      imapPort: '',
      smtpHost: '',
      smtpPort: '',
    });
    setTestResult(null);
    onClose();
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    const providerId = provider.id?.toLowerCase();
    if (providerId === 'google' && oauthProviders.google?.enabled) {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast({
          title: 'Error',
          description: 'Please log in to connect an email account',
          variant: 'destructive',
        });
        return;
      }
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'https://api.nexoraos.pro/api/v1'}/oauth/google/authorize?returnUrl=/settings/email&token=${token}`;
      return;
    }
    if (providerId === 'microsoft' && oauthProviders.microsoft?.enabled) {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast({
          title: 'Error',
          description: 'Please log in to connect an email account',
          variant: 'destructive',
        });
        return;
      }
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'https://api.nexoraos.pro/api/v1'}/oauth/microsoft/authorize?returnUrl=/settings/email&token=${token}`;
      return;
    }
    setStep(2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            {step === 1 ? 'Connect Email Account' : `Connect ${selectedProvider?.name || 'Email'}`}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? 'Choose your email provider to get started'
              : 'Enter your credentials to connect your email'}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-500">Popular</Label>
              <div className="grid grid-cols-2 gap-3">
                {providers
                  .filter((p) => ['google', 'microsoft'].includes(p.id))
                  .map((provider) => {
                    const Icon = getProviderIcon(provider.id);
                    const colors = getProviderColor(provider.id);
                    const isOAuthEnabled =
                      (provider.id === 'google' && oauthProviders.google?.enabled) ||
                      (provider.id === 'microsoft' && oauthProviders.microsoft?.enabled);
                    return (
                      <motion.button
                        key={provider.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          'relative flex items-center gap-3 p-4 rounded-xl border bg-white hover:shadow-md transition-all text-left',
                          isOAuthEnabled && 'border-green-200 bg-green-50/30'
                        )}
                        onClick={() => handleProviderSelect(provider)}
                      >
                        {isOAuthEnabled && (
                          <Badge className="absolute -top-2 -right-2 text-[10px] px-1.5 py-0 bg-green-100 text-green-700 border-0">
                            OAuth
                          </Badge>
                        )}
                        <div
                          className={cn(
                            'h-10 w-10 rounded-xl flex items-center justify-center',
                            colors.bg
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{provider.name}</p>
                          <p className="text-xs text-gray-500">
                            {isOAuthEnabled ? 'One-click connect' : provider.description}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-500">Other Providers</Label>
              <div className="grid grid-cols-3 gap-2">
                {providers
                  .filter((p) => !['google', 'microsoft'].includes(p.id))
                  .map((provider) => (
                    <Button
                      key={provider.id}
                      variant="outline"
                      size="sm"
                      className="justify-start rounded-xl"
                      onClick={() => handleProviderSelect(provider)}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      {provider.name}
                    </Button>
                  ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500 text-center">
                Your email credentials are encrypted and securely stored.
                <a href="/settings/email/help" className="text-blue-600 hover:underline ml-1">
                  Learn more
                </a>
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedProvider && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <div
                  className={cn(
                    'h-10 w-10 rounded-xl flex items-center justify-center',
                    getProviderColor(selectedProvider.id || selectedProvider.provider).bg
                  )}
                >
                  {(() => {
                    const Icon = getProviderIcon(selectedProvider.id || selectedProvider.provider);
                    return <Icon className="h-5 w-5" />;
                  })()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedProvider.name}</p>
                  <p className="text-sm text-gray-500">
                    {selectedProvider.description || selectedProvider.notes}
                  </p>
                </div>
              </div>
            )}

            {selectedProvider?.requiresAppPassword && (
              <Alert className="rounded-xl border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  {selectedProvider.name} requires an App Password.
                  <a
                    href={selectedProvider.helpUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1 inline-flex items-center gap-1"
                  >
                    Learn how to create one <ExternalLink className="h-3 w-3" />
                  </a>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="hello@72orionx.com"
                value={formData.email}
                onChange={(e) => handleEmailChange(e.target.value)}
                className="h-11 rounded-xl bg-gray-50 border-0"
              />
              {detectProvider.isPending && (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Detecting email provider...
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {selectedProvider?.requiresAppPassword ? 'App Password' : 'Password'}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={
                    selectedProvider?.requiresAppPassword
                      ? 'Enter your app password'
                      : 'Enter your password'
                  }
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-11 rounded-xl bg-gray-50 border-0 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name (Optional)</Label>
              <Input
                id="displayName"
                placeholder="e.g., 72orionx Support"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="h-11 rounded-xl bg-gray-50 border-0"
              />
            </div>

            <details className="group">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-900 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Advanced Settings (IMAP/SMTP)
              </summary>
              <div className="mt-3 space-y-3 pl-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="imapHost" className="text-xs">
                      IMAP Host
                    </Label>
                    <Input
                      id="imapHost"
                      placeholder="mail.72orionx.com"
                      value={formData.imapHost}
                      onChange={(e) => setFormData({ ...formData, imapHost: e.target.value })}
                      className="h-9 text-sm rounded-lg bg-gray-50 border-0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imapPort" className="text-xs">
                      IMAP Port
                    </Label>
                    <Input
                      id="imapPort"
                      placeholder="993"
                      value={formData.imapPort}
                      onChange={(e) => setFormData({ ...formData, imapPort: e.target.value })}
                      className="h-9 text-sm rounded-lg bg-gray-50 border-0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost" className="text-xs">
                      SMTP Host
                    </Label>
                    <Input
                      id="smtpHost"
                      placeholder="mail.72orionx.com"
                      value={formData.smtpHost}
                      onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                      className="h-9 text-sm rounded-lg bg-gray-50 border-0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort" className="text-xs">
                      SMTP Port
                    </Label>
                    <Input
                      id="smtpPort"
                      placeholder="465"
                      value={formData.smtpPort}
                      onChange={(e) => setFormData({ ...formData, smtpPort: e.target.value })}
                      className="h-9 text-sm rounded-lg bg-gray-50 border-0"
                    />
                  </div>
                </div>
              </div>
            </details>

            {testResult && (
              <Alert
                className={cn(
                  'rounded-xl border-0',
                  testResult.success ? 'bg-green-50' : 'bg-red-50'
                )}
              >
                {testResult.success ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription
                  className={testResult.success ? 'text-green-800' : 'text-red-800'}
                >
                  {testResult.success
                    ? testResult.message || 'Connection successful!'
                    : testResult.error}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 rounded-xl">
                Back
              </Button>
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={testing || !formData.email || !formData.password}
                className="rounded-xl"
              >
                {testing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Test
              </Button>
              <Button
                onClick={handleConnect}
                disabled={connectIMAP.isPending}
                className="flex-1 rounded-xl"
              >
                {connectIMAP.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {connectIMAP.isPending ? 'Connecting...' : 'Connect'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ManageAccessDialog({ isOpen, onClose, account }) {
  const { toast } = useToast();
  const [grantMode, setGrantMode] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [selectedPermission, setSelectedPermission] = useState('READ_REPLY');

  const {
    data: accessData,
    isLoading: loadingAccess,
    refetch: refetchAccess,
  } = useEmailAccountAccess(account?.id);
  const { data: users = [], isLoading: loadingUsers } = useTenantUsers();
  const { data: teams = [], isLoading: loadingTeams } = useTenantTeams();

  const grantUserAccess = useGrantUserAccess();
  const grantTeamAccess = useGrantTeamAccess();
  const revokeAccess = useRevokeEmailAccess();
  const updateAccess = useUpdateEmailAccess();

  const accessList = accessData?.accessList || [];

  const handleGrantUserAccess = async () => {
    if (!selectedUserId) {
      toast({ title: 'Error', description: 'Please select a user', variant: 'destructive' });
      return;
    }
    try {
      await grantUserAccess.mutateAsync({
        emailAccountId: account.id,
        userId: selectedUserId,
        permission: selectedPermission,
      });
      toast({ title: 'Success', description: 'User access granted' });
      setGrantMode(null);
      setSelectedUserId('');
      refetchAccess();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to grant access',
        variant: 'destructive',
      });
    }
  };

  const handleGrantTeamAccess = async () => {
    if (!selectedTeamId) {
      toast({ title: 'Error', description: 'Please select a team', variant: 'destructive' });
      return;
    }
    try {
      await grantTeamAccess.mutateAsync({
        emailAccountId: account.id,
        teamId: selectedTeamId,
        permission: selectedPermission,
      });
      toast({ title: 'Success', description: 'Team access granted' });
      setGrantMode(null);
      setSelectedTeamId('');
      refetchAccess();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to grant access',
        variant: 'destructive',
      });
    }
  };

  const handleRevokeAccess = async (accessId) => {
    if (!confirm('Are you sure you want to revoke this access?')) return;
    try {
      await revokeAccess.mutateAsync(accessId);
      toast({ title: 'Success', description: 'Access revoked' });
      refetchAccess();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to revoke access',
        variant: 'destructive',
      });
    }
  };

  const handleUpdatePermission = async (accessId, newPermission) => {
    try {
      await updateAccess.mutateAsync({ accessId, permission: newPermission });
      toast({ title: 'Success', description: 'Permission updated' });
      refetchAccess();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to update permission',
        variant: 'destructive',
      });
    }
  };

  const availableUsers = users.filter(
    (user) => !accessList.some((a) => a.entityType === 'user' && a.entity?.id === user.id)
  );

  const availableTeams = teams.filter(
    (team) => !accessList.some((a) => a.entityType === 'team' && a.entity?.id === team.id)
  );

  const handleClose = () => {
    setGrantMode(null);
    setSelectedUserId('');
    setSelectedTeamId('');
    setSelectedPermission('READ_REPLY');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            Manage Inbox Access
          </DialogTitle>
          <DialogDescription>
            Share <span className="font-medium">{account?.email}</span> with your team members
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!grantMode ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setGrantMode('user')}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setGrantMode('team')}
                disabled={teams.length === 0}
              >
                <Users className="h-4 w-4 mr-2" />
                Add Team
              </Button>
            </div>
          ) : grantMode === 'user' ? (
            <div className="p-4 rounded-xl bg-gray-50 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Grant User Access</Label>
                <Button variant="ghost" size="icon" onClick={() => setGrantMode(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger className="rounded-xl bg-white">
                  <SelectValue placeholder="Select a user..." />
                </SelectTrigger>
                <SelectContent>
                  {loadingUsers ? (
                    <div className="p-2 text-center text-sm text-gray-500">Loading...</div>
                  ) : availableUsers.length === 0 ? (
                    <div className="p-2 text-center text-sm text-gray-500">No users available</div>
                  ) : (
                    availableUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatarUrl} />
                            <AvatarFallback className="text-xs">
                              {(user.firstName?.[0] || '') + (user.lastName?.[0] || user.email[0])}
                            </AvatarFallback>
                          </Avatar>
                          <span>
                            {user.firstName || user.lastName
                              ? `${user.firstName} ${user.lastName}`.trim()
                              : user.email}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <Select value={selectedPermission} onValueChange={setSelectedPermission}>
                <SelectTrigger className="rounded-xl bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PERMISSION_LEVELS).map(([key, { label, description }]) => (
                    <SelectItem key={key} value={key}>
                      <div>
                        <div className="font-medium">{label}</div>
                        <div className="text-xs text-gray-500">{description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleGrantUserAccess}
                disabled={!selectedUserId || grantUserAccess.isPending}
                className="w-full rounded-xl"
              >
                {grantUserAccess.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Grant Access
              </Button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-gray-50 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Grant Team Access</Label>
                <Button variant="ghost" size="icon" onClick={() => setGrantMode(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                <SelectTrigger className="rounded-xl bg-white">
                  <SelectValue placeholder="Select a team..." />
                </SelectTrigger>
                <SelectContent>
                  {loadingTeams ? (
                    <div className="p-2 text-center text-sm text-gray-500">Loading...</div>
                  ) : availableTeams.length === 0 ? (
                    <div className="p-2 text-center text-sm text-gray-500">No teams available</div>
                  ) : (
                    availableTeams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded bg-blue-50 flex items-center justify-center">
                            <Users className="h-3 w-3 text-blue-600" />
                          </div>
                          <span>{team.name}</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <Select value={selectedPermission} onValueChange={setSelectedPermission}>
                <SelectTrigger className="rounded-xl bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PERMISSION_LEVELS).map(([key, { label, description }]) => (
                    <SelectItem key={key} value={key}>
                      <div>
                        <div className="font-medium">{label}</div>
                        <div className="text-xs text-gray-500">{description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleGrantTeamAccess}
                disabled={!selectedTeamId || grantTeamAccess.isPending}
                className="w-full rounded-xl"
              >
                {grantTeamAccess.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Grant Access
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-medium">Current Access</Label>
            {loadingAccess ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : accessList.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm">Only you have access to this inbox</p>
              </div>
            ) : (
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {accessList.map((access) => (
                    <div
                      key={access.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white border"
                    >
                      <div className="flex items-center gap-3">
                        {access.entityType === 'user' ? (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={access.entity?.avatarUrl} />
                            <AvatarFallback className="text-xs">
                              {(access.entity?.firstName?.[0] || '') +
                                (access.entity?.lastName?.[0] || access.entity?.email?.[0] || '?')}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm">
                            {access.entityType === 'user'
                              ? access.entity?.firstName || access.entity?.lastName
                                ? `${access.entity?.firstName || ''} ${access.entity?.lastName || ''}`.trim()
                                : access.entity?.email
                              : access.entity?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {access.entityType === 'user' ? access.entity?.email : 'Team'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={access.permission}
                          onValueChange={(value) => handleUpdatePermission(access.id, value)}
                        >
                          <SelectTrigger className="h-8 w-[130px] rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(PERMISSION_LEVELS).map(([key, { label }]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleRevokeAccess(access.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ConnectedAccountCard({ account, onRefresh, onDisconnect, onSetDefault, onManageAccess }) {
  const [syncing, setSyncing] = useState(false);
  const Icon = getProviderIcon(account.provider);
  const colors = getProviderColor(account.provider);

  const handleSync = async () => {
    setSyncing(true);
    await onRefresh?.(account.id);
    setSyncing(false);
  };

  const formatLastSync = (date) => {
    if (!date) return 'Never';
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000 / 60);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <motion.div whileHover={{ scale: 1.01 }} className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center', colors.bg)}>
            <Icon className={cn('h-6 w-6', colors.text)} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{account.email}</h3>
              {account.isDefault && (
                <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">Default</Badge>
              )}
              {account.isPrimary && (
                <Badge variant="outline" className="text-xs">
                  Primary
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500">{account.displayName || account.provider}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={account.status} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-lg">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem onClick={handleSync}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Now
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onManageAccess?.(account)}>
                <Users className="h-4 w-4 mr-2" />
                Manage Access
              </DropdownMenuItem>
              {!account.isDefault && (
                <DropdownMenuItem onClick={() => onSetDefault?.(account.id)}>
                  <Star className="h-4 w-4 mr-2" />
                  Set as Default
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => onDisconnect?.(account.id)}
              >
                <Unlink className="h-4 w-4 mr-2" />
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <Shield className="h-4 w-4" />
          IMAP
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          Last sync: {formatLastSync(account.lastSyncAt)}
        </span>
        {syncing && (
          <span className="flex items-center gap-1 text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Syncing...
          </span>
        )}
      </div>

      {account.lastSyncError && (
        <Alert className="mt-4 rounded-xl border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{account.lastSyncError}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-lg" asChild>
            <a href="/inbox?channel=email">
              <Inbox className="h-4 w-4 mr-2" />
              Open Inbox
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            onClick={handleSync}
            disabled={syncing}
          >
            <RefreshCw className={cn('h-4 w-4 mr-2', syncing && 'animate-spin')} />
            Sync
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg"
          onClick={() => onManageAccess?.(account)}
        >
          <Users className="h-4 w-4 mr-2" />
          Share Inbox
        </Button>
      </div>
    </motion.div>
  );
}

function DnsRecordsDialog({ isOpen, onClose, domain }) {
  const { data: domainDetails, isLoading } = useEmailDomain(domain?.id);
  const verifyDomain = useVerifyEmailDomain();
  const { toast } = useToast();

  const handleVerify = async () => {
    try {
      const result = await verifyDomain.mutateAsync(domain.id);
      if (result.status === 'VERIFIED') {
        toast({ title: 'Success', description: 'Domain verified successfully!' });
      } else {
        toast({ title: 'Info', description: 'Verification in progress. Please wait.' });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Verification failed',
        variant: 'destructive',
      });
    }
  };

  const dkimRecords = domainDetails?.dkimTokens || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Globe className="h-5 w-5 text-blue-600" />
            </div>
            DNS Records for {domain?.domain}
          </DialogTitle>
          <DialogDescription>
            Add these DNS records to your domain to verify ownership and enable email sending.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
              <div className="flex items-center gap-3">
                <DomainStatusBadge status={domain?.status} />
                <span className="text-sm text-gray-500">
                  {domain?.status === 'VERIFIED'
                    ? 'Domain is verified and ready to use'
                    : 'Add the DNS records below to verify your domain'}
                </span>
              </div>
              {domain?.status !== 'VERIFIED' && (
                <Button
                  onClick={handleVerify}
                  disabled={verifyDomain.isPending}
                  size="sm"
                  className="rounded-lg"
                >
                  {verifyDomain.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Check Verification
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Shield className="h-4 w-4" />
                DKIM Records (for email authentication)
              </h4>
              <p className="text-sm text-gray-500">
                Add these CNAME records to enable DKIM signing for your emails.
              </p>
              <div className="space-y-2">
                {dkimRecords.length > 0 ? (
                  dkimRecords.map((record, index) => (
                    <div key={index} className="p-4 rounded-xl border bg-white">
                      <div className="grid gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-500">Type: CNAME</span>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-500">Name / Host</Label>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 text-xs bg-gray-50 px-3 py-2 rounded-lg break-all">
                              {record.name || `${record}._domainkey.${domain?.domain}`}
                            </code>
                            <CopyButton
                              value={record.name || `${record}._domainkey.${domain?.domain}`}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-500">Value / Points to</Label>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 text-xs bg-gray-50 px-3 py-2 rounded-lg break-all">
                              {record.value || `${record}.dkim.amazonses.com`}
                            </code>
                            <CopyButton value={record.value || `${record}.dkim.amazonses.com`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <Alert className="rounded-xl border-amber-200 bg-amber-50">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      DKIM records will be available after initial domain setup.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            <Alert className="rounded-xl border-blue-200 bg-blue-50">
              <HelpCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                DNS changes can take up to 72 hours to propagate. Click "Check Verification" after
                adding the records.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddDomainDialog({ isOpen, onClose, onSuccess }) {
  const [domain, setDomain] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [fromName, setFromName] = useState('');
  const addDomain = useAddEmailDomain();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!domain) {
      toast({ title: 'Error', description: 'Please enter a domain', variant: 'destructive' });
      return;
    }
    try {
      await addDomain.mutateAsync({
        domain: domain.toLowerCase().trim(),
        fromEmail: fromEmail || undefined,
        fromName: fromName || undefined,
      });
      toast({ title: 'Success', description: 'Domain added. Please add DNS records to verify.' });
      onSuccess?.();
      handleClose();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to add domain',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    setDomain('');
    setFromEmail('');
    setFromName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Globe className="h-5 w-5 text-blue-600" />
            </div>
            Add Custom Domain
          </DialogTitle>
          <DialogDescription>
            Add your domain to send emails with your own branding.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domain">Domain</Label>
            <Input
              id="domain"
              placeholder="mail.yourdomain.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="h-11 rounded-xl bg-gray-50 border-0"
            />
            <p className="text-xs text-gray-500">
              Enter your domain (e.g., mail.company.com or company.com)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fromEmail">Default From Email (Optional)</Label>
            <Input
              id="fromEmail"
              type="email"
              placeholder="noreply@yourdomain.com"
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              className="h-11 rounded-xl bg-gray-50 border-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fromName">Default From Name (Optional)</Label>
            <Input
              id="fromName"
              placeholder="Your Company Name"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              className="h-11 rounded-xl bg-gray-50 border-0"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={addDomain.isPending} className="flex-1 rounded-xl">
              {addDomain.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Domain
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CustomDomainsTab() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const { toast } = useToast();
  const { isAdmin, user } = useAuth();

  const { data: domains = [], isLoading, refetch } = useEmailDomains();
  const verifyDomain = useVerifyEmailDomain();
  const setDefaultDomain = useSetDefaultDomain();
  const deleteDomain = useDeleteEmailDomain();

  if (!isAdmin) {
    return (
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl p-12 shadow-sm text-center"
      >
        <div className="mx-auto w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-orange-600" />
        </div>
        <h2 className="text-xl font-semibold mb-2 text-gray-900">Admin Access Required</h2>
        <p className="text-gray-500 mb-4 max-w-md mx-auto">
          Custom domain management requires admin privileges. Contact your administrator to add or
          manage email domains.
        </p>
        <Badge className="bg-gray-100 text-gray-700 border-0">
          Your role: {user?.roleName || 'User'}
        </Badge>
      </motion.div>
    );
  }

  const handleVerify = async (domainId) => {
    try {
      const result = await verifyDomain.mutateAsync(domainId);
      if (result.status === 'VERIFIED') {
        toast({ title: 'Success', description: 'Domain verified!' });
      } else {
        toast({
          title: 'Info',
          description: 'Verification in progress. Please ensure DNS records are added.',
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Verification failed',
        variant: 'destructive',
      });
    }
  };

  const handleSetDefault = async (domainId) => {
    try {
      await setDefaultDomain.mutateAsync(domainId);
      toast({ title: 'Success', description: 'Default domain updated' });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to set default',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (domainId) => {
    if (!confirm('Are you sure you want to delete this domain?')) return;
    try {
      await deleteDomain.mutateAsync(domainId);
      toast({ title: 'Success', description: 'Domain deleted' });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete domain',
        variant: 'destructive',
      });
    }
  };

  const hasDomains = domains.length > 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="show">
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Custom Domains</h2>
          <p className="text-sm text-gray-500">
            Send emails from your own domain with DKIM authentication
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="rounded-xl">
          <Plus className="h-4 w-4 mr-2" />
          Add Domain
        </Button>
      </motion.div>

      {hasDomains ? (
        <>
          <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{domains.length}</p>
                  <p className="text-xs text-gray-500">Total Domains</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {domains.filter((d) => d.status === 'VERIFIED').length}
                  </p>
                  <p className="text-xs text-gray-500">Verified</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      domains.filter((d) => d.status === 'PENDING' || d.status === 'VERIFYING')
                        .length
                    }
                  </p>
                  <p className="text-xs text-gray-500">Pending</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="p-5 border-b">
              <h3 className="font-semibold text-gray-900">Your Domains</h3>
            </div>
            <div className="divide-y">
              {domains.map((domain, index) => (
                <motion.div
                  key={domain.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{domain.domain}</span>
                        {domain.isDefault && (
                          <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {domain.fromEmail || 'No from email set'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DomainStatusBadge status={domain.status} />
                    <span className="text-xs text-gray-400">
                      {new Date(domain.createdAt).toLocaleDateString()}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-lg">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem onClick={() => setSelectedDomain(domain)}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View DNS Records
                        </DropdownMenuItem>
                        {domain.status !== 'VERIFIED' && (
                          <DropdownMenuItem onClick={() => handleVerify(domain.id)}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Check Verification
                          </DropdownMenuItem>
                        )}
                        {domain.status === 'VERIFIED' && !domain.isDefault && (
                          <DropdownMenuItem onClick={() => handleSetDefault(domain.id)}>
                            <Star className="h-4 w-4 mr-2" />
                            Set as Default
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDelete(domain.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      ) : (
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl p-12 shadow-sm text-center border-2 border-dashed"
        >
          <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <Globe className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">Add Your Custom Domain</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Send emails from your own domain with proper authentication. Improve deliverability and
            brand recognition.
          </p>
          <Button size="lg" onClick={() => setShowAddDialog(true)} className="rounded-xl">
            <Plus className="h-5 w-5 mr-2" />
            Add Custom Domain
          </Button>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="bg-blue-50 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <HelpCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">How Custom Domains Work</h4>
            <p className="text-sm text-gray-600 mt-1">
              1. Add your domain and get DNS records. <br />
              2. Add the DKIM records to your DNS provider. <br />
              3. Click verify once DNS propagates (up to 72 hours). <br />
              4. Start sending emails from your domain!
            </p>
          </div>
        </div>
      </motion.div>

      <AddDomainDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSuccess={() => refetch()}
      />

      <DnsRecordsDialog
        isOpen={!!selectedDomain}
        onClose={() => setSelectedDomain(null)}
        domain={selectedDomain}
      />
    </motion.div>
  );
}

export default function EmailSettingsPage() {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedAccountForAccess, setSelectedAccountForAccess] = useState(null);
  const [activeTab, setActiveTab] = useState('accounts');
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const { data: accounts = [], isLoading, refetch } = useEmailAccounts();
  const { data: oauthProviders = {} } = useOAuthProviders();

  useEffect(() => {
    const connected = searchParams.get('connected');
    const email = searchParams.get('email');
    const error = searchParams.get('error');

    if (connected && email) {
      toast({
        title: 'Email Connected',
        description: `Successfully connected ${email} via ${connected === 'google' ? 'Google' : 'Microsoft'}`,
      });
      refetch();
      window.history.replaceState({}, '', '/settings/email');
    } else if (error) {
      toast({
        title: 'Connection Failed',
        description: error,
        variant: 'destructive',
      });
      window.history.replaceState({}, '', '/settings/email');
    }
  }, [searchParams, toast, refetch]);

  const handleOAuthConnect = (provider) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast({
        title: 'Error',
        description: 'Please log in to connect an email account',
        variant: 'destructive',
      });
      return;
    }
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'https://api.nexoraos.pro/api/v1'}/oauth/${provider}/authorize?returnUrl=/settings/email&token=${token}`;
  };

  const disconnectAccount = useDisconnectEmailAccount();
  const updateAccount = useUpdateEmailAccount();

  const handleRefresh = async (id) => {
    toast({ title: 'Info', description: 'Email sync coming soon!' });
    await refetch();
  };

  const handleManageAccess = (account) => {
    setSelectedAccountForAccess(account);
  };

  const handleDisconnect = async (id) => {
    if (!confirm('Are you sure you want to disconnect this email account?')) return;
    try {
      await disconnectAccount.mutateAsync(id);
      toast({ title: 'Success', description: 'Email account disconnected' });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to disconnect email account',
        variant: 'destructive',
      });
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await updateAccount.mutateAsync({ id, isDefault: true });
      toast({ title: 'Success', description: 'Default email updated' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to set default email', variant: 'destructive' });
    }
  };

  const hasAccounts = accounts.length > 0;

  // Stats calculations
  const stats = {
    connected: accounts.length,
    active: accounts.filter((a) => a.status === 'ACTIVE').length,
    issues: accounts.filter((a) => a.lastSyncError).length,
    emailsSent: 0, // Would come from API
  };

  return (
    <motion.div
      className="flex-1 p-6 space-y-6 overflow-auto"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header with Stats */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center">
              <Mail className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Email Settings</h1>
              <p className="text-sm text-gray-500">
                Manage email accounts, custom domains, and sending configuration
              </p>
            </div>
          </div>
          {hasAccounts && (
            <Button onClick={() => setShowConnectModal(true)} className="rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add Email
            </Button>
          )}
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.connected}</p>
              <p className="text-xs text-gray-500">Connected</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.issues}</p>
              <p className="text-xs text-gray-500">Issues</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Send className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.emailsSent}</p>
              <p className="text-xs text-gray-500">Emails Sent</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white rounded-xl p-1 shadow-sm">
            <TabsTrigger
              value="accounts"
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:font-medium"
            >
              <Mail className="h-4 w-4" />
              Email Accounts
            </TabsTrigger>
            <TabsTrigger
              value="domains"
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:font-medium"
            >
              <Globe className="h-4 w-4" />
              Custom Domains
            </TabsTrigger>
          </TabsList>

          <TabsContent value="accounts" className="mt-6 space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : hasAccounts ? (
              <motion.div className="space-y-4" variants={containerVariants}>
                {accounts.map((account, index) => (
                  <motion.div key={account.id} variants={itemVariants}>
                    <ConnectedAccountCard
                      account={account}
                      onRefresh={handleRefresh}
                      onDisconnect={handleDisconnect}
                      onSetDefault={handleSetDefault}
                      onManageAccess={handleManageAccess}
                    />
                  </motion.div>
                ))}

                {/* Help Section */}
                <motion.div variants={itemVariants} className="bg-blue-50 rounded-2xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                      <HelpCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Need help connecting your email?
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Check our guide for step-by-step instructions on connecting Gmail, Outlook,
                        and other email providers.
                      </p>
                      <Button variant="link" className="px-0 mt-2 text-blue-600" asChild>
                        <a href="/settings/email/help">
                          View Email Connection Guide
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div className="space-y-6" variants={containerVariants}>
                {/* Empty State Hero */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-2xl p-12 shadow-sm text-center border-2 border-dashed"
                >
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                    <Mail className="h-8 w-8 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2 text-gray-900">Connect Your Email</h2>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Connect your email accounts to send and receive emails directly from Nexora. All
                    your conversations in one unified inbox.
                  </p>
                  <Button
                    size="lg"
                    onClick={() => setShowConnectModal(true)}
                    className="rounded-xl"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Connect Email Account
                  </Button>
                </motion.div>

                {/* Provider Options */}
                <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'bg-white rounded-2xl p-6 shadow-sm text-center cursor-pointer transition-all',
                      oauthProviders.google?.enabled
                        ? 'hover:shadow-md'
                        : 'opacity-50 cursor-not-allowed'
                    )}
                    onClick={() => oauthProviders.google?.enabled && handleOAuthConnect('google')}
                  >
                    <div className="mx-auto w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-3">
                      <GmailIcon className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium text-gray-900">Gmail</h3>
                    <p className="text-sm text-gray-500">
                      {oauthProviders.google?.enabled ? 'One-click OAuth' : 'Not configured'}
                    </p>
                    {oauthProviders.google?.enabled && (
                      <Badge className="mt-2 bg-green-100 text-green-700 border-0 text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        OAuth Ready
                      </Badge>
                    )}
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'bg-white rounded-2xl p-6 shadow-sm text-center cursor-pointer transition-all',
                      oauthProviders.microsoft?.enabled
                        ? 'hover:shadow-md'
                        : 'opacity-50 cursor-not-allowed'
                    )}
                    onClick={() =>
                      oauthProviders.microsoft?.enabled && handleOAuthConnect('microsoft')
                    }
                  >
                    <div className="mx-auto w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                      <OutlookIcon className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium text-gray-900">Outlook</h3>
                    <p className="text-sm text-gray-500">
                      {oauthProviders.microsoft?.enabled ? 'One-click OAuth' : 'Not configured'}
                    </p>
                    {oauthProviders.microsoft?.enabled && (
                      <Badge className="mt-2 bg-green-100 text-green-700 border-0 text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        OAuth Ready
                      </Badge>
                    )}
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-2xl p-6 shadow-sm text-center cursor-pointer hover:shadow-md transition-all"
                    onClick={() => setShowConnectModal(true)}
                  >
                    <div className="mx-auto w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
                      <Mail className="h-6 w-6 text-gray-600" />
                    </div>
                    <h3 className="font-medium text-gray-900">Custom Domain</h3>
                    <p className="text-sm text-gray-500">IMAP/SMTP</p>
                  </motion.div>
                </motion.div>

                {/* Features */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4">Why Connect Your Email?</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                        <Inbox className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Unified Inbox</h4>
                        <p className="text-sm text-gray-500">
                          All your emails from all accounts in one place
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <Link2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Contact Linking</h4>
                        <p className="text-sm text-gray-500">
                          Emails auto-linked to your CRM contacts
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">AI Assistance</h4>
                        <p className="text-sm text-gray-500">Smart replies and email suggestions</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="domains" className="mt-6">
            <CustomDomainsTab />
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Modals */}
      <ConnectEmailModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onSuccess={() => refetch()}
      />

      <ManageAccessDialog
        isOpen={!!selectedAccountForAccess}
        onClose={() => setSelectedAccountForAccess(null)}
        account={selectedAccountForAccess}
      />
    </motion.div>
  );
}
