'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Zap,
  Search,
  Plus,
  MoreHorizontal,
  Settings,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  RefreshCw,
  Link2,
  Unlink,
  AlertTriangle,
  MessageSquare,
  Loader2,
  Eye,
  EyeOff,
  HelpCircle,
  Puzzle,
  Globe,
} from 'lucide-react';
import { UnifiedLayout } from '@/components/layout/unified';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Mock connected integrations (for other integrations - not messaging)
const connectedIntegrations = [
  {
    id: 'int_001',
    name: 'Salesforce',
    type: 'crm',
    status: 'connected',
    lastSync: '2024-01-15T14:30:00Z',
    syncStatus: 'success',
    connectedBy: 'Rajesh Kumar',
    connectedAt: '2024-01-01T00:00:00Z',
    logo: '🏢',
  },
  {
    id: 'int_002',
    name: 'Slack',
    type: 'communication',
    status: 'connected',
    lastSync: '2024-01-15T14:28:00Z',
    syncStatus: 'success',
    connectedBy: 'Priya Sharma',
    connectedAt: '2024-01-05T00:00:00Z',
    logo: '💬',
  },
  {
    id: 'int_003',
    name: 'Google Sheets',
    type: 'productivity',
    status: 'connected',
    lastSync: '2024-01-15T10:00:00Z',
    syncStatus: 'warning',
    connectedBy: 'Amit Patel',
    connectedAt: '2024-01-10T00:00:00Z',
    logo: '📊',
  },
];

// Available integrations
const availableIntegrations = [
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Sync contacts and deals with HubSpot CRM',
    category: 'CRM',
    logo: '🟠',
    popular: true,
  },
  {
    id: 'zoho',
    name: 'Zoho CRM',
    description: 'Two-way sync with Zoho CRM',
    category: 'CRM',
    logo: '🔴',
    popular: true,
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect with 5000+ apps via Zapier',
    category: 'Automation',
    logo: '⚡',
    popular: true,
  },
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Sync customers and orders from Shopify',
    category: 'E-commerce',
    logo: '🛒',
    popular: true,
  },
  {
    id: 'google_calendar',
    name: 'Google Calendar',
    description: 'Sync meetings and appointments',
    category: 'Productivity',
    logo: '📅',
    popular: true,
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    description: 'Send notifications to Teams channels',
    category: 'Communication',
    logo: '👥',
    popular: true,
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    description: 'Accept payments via UPI, cards, wallets, and net banking',
    category: 'Payments',
    logo: '💳',
    popular: true,
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Global payment processing for online businesses',
    category: 'Payments',
    logo: '💰',
    popular: true,
  },
];

const categories = [
  'All',
  'CRM',
  'Automation',
  'E-commerce',
  'Productivity',
  'Communication',
  'Payments',
];

// Provider logos - using official brand colors for fallback
const providerLogos = {
  msg91: {
    url: 'https://cdn.brandfetch.io/msg91.com/w/400/h/400/logo',
    fallbackBg: 'bg-blue-600',
    fallbackColor: 'text-white',
  },
  twilio: {
    url: 'https://cdn.brandfetch.io/twilio.com/w/400/h/400/logo',
    fallbackBg: 'bg-red-500',
    fallbackColor: 'text-white',
  },
  gupshup: {
    url: 'https://cdn.brandfetch.io/gupshup.io/w/400/h/400/logo',
    fallbackBg: 'bg-yellow-500',
    fallbackColor: 'text-black',
  },
  infobip: {
    url: 'https://cdn.brandfetch.io/infobip.com/w/400/h/400/logo',
    fallbackBg: 'bg-orange-500',
    fallbackColor: 'text-white',
  },
  resend: {
    url: 'https://cdn.brandfetch.io/resend.com/w/400/h/400/logo',
    fallbackBg: 'bg-black',
    fallbackColor: 'text-white',
  },
  fast2sms: {
    url: null,
    fallbackBg: 'bg-green-600',
    fallbackColor: 'text-white',
  },
  telecmi: {
    url: 'https://cdn.brandfetch.io/telecmi.com/w/400/h/400/logo',
    fallbackBg: 'bg-primary',
    fallbackColor: 'text-white',
  },
  razorpay: {
    url: 'https://cdn.brandfetch.io/razorpay.com/w/400/h/400/logo',
    fallbackBg: 'bg-blue-700',
    fallbackColor: 'text-white',
  },
  stripe: {
    url: 'https://cdn.brandfetch.io/stripe.com/w/400/h/400/logo',
    fallbackBg: 'bg-indigo-600',
    fallbackColor: 'text-white',
  },
};

// Provider logo component with fallback
const ProviderLogo = ({ providerId, name, size = 'md' }) => {
  const [imgError, setImgError] = useState(false);
  const logoConfig = providerLogos[providerId] || {};
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-12 w-12 text-xl',
    lg: 'h-16 w-16 text-2xl',
  };

  if (logoConfig.url && !imgError) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shrink-0`}
      >
        <img
          src={logoConfig.url}
          alt={`${name} logo`}
          className="h-full w-full object-contain"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-lg flex items-center justify-center font-bold uppercase shrink-0 ${logoConfig.fallbackBg || 'bg-gray-500'} ${logoConfig.fallbackColor || 'text-white'}`}
    >
      {name?.charAt(0)}
    </div>
  );
};

// Provider category colors and icons
const providerCategories = {
  email: { label: 'Email', color: 'text-blue-600', bg: 'bg-blue-100' },
  sms: { label: 'SMS', color: 'text-green-600', bg: 'bg-green-100' },
  whatsapp: { label: 'WhatsApp', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  voice: { label: 'Voice', color: 'text-orange-600', bg: 'bg-orange-100' },
  multi: { label: 'Multi-Channel', color: 'text-purple-600', bg: 'bg-purple-100' },
};

export default function IntegrationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('messaging');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);

  // Messaging Providers State
  const [providersCatalog, setProvidersCatalog] = useState([]);
  const [connectedProviders, setConnectedProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [showProviderDialog, setShowProviderDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [providerCredentials, setProviderCredentials] = useState({});
  const [showCredentials, setShowCredentials] = useState({});
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteProvider, setDeleteProvider] = useState(null);

  const { toast } = useToast();
  const { token } = useAuth();

  // Fetch messaging providers catalog and connected providers
  useEffect(() => {
    if (activeTab === 'messaging') {
      fetchMessagingData();
    }
  }, [activeTab, token]);

  const fetchMessagingData = async () => {
    if (!token) return;
    setLoadingProviders(true);

    try {
      const [catalogData, connectedData] = await Promise.all([
        api.get('/integrations/messaging/catalog'),
        api.get('/integrations/messaging'),
      ]);

      if (catalogData.success) {
        setProvidersCatalog(catalogData.data);
      }
      if (connectedData.success) {
        setConnectedProviders(connectedData.data);
      }
    } catch (error) {
      console.error('Failed to fetch messaging providers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messaging providers',
        variant: 'destructive',
      });
    } finally {
      setLoadingProviders(false);
    }
  };

  const handleConnect = (integration) => {
    setSelectedIntegration(integration);
    setShowConnectDialog(true);
  };

  const handleDisconnect = (integration) => {
    setSelectedIntegration(integration);
    setShowDisconnectConfirm(true);
  };

  const handleConfigureProvider = (provider) => {
    setSelectedProvider(provider);
    setProviderCredentials({});
    setShowCredentials({});
    setShowProviderDialog(true);
  };

  const handleTestConnection = async () => {
    if (!selectedProvider) return;
    setTesting(true);

    try {
      const data = await api.post('/integrations/messaging/test', {
        provider: selectedProvider.id,
        credentials: providerCredentials,
      });

      if (data.success && data.data.valid) {
        toast({
          title: 'Connection Successful',
          description: data.data.message || 'Credentials are valid',
        });
      } else {
        toast({
          title: 'Connection Failed',
          description: data.data?.error || data.error || 'Invalid credentials',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to test connection',
        variant: 'destructive',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveProvider = async () => {
    if (!selectedProvider) return;
    setSaving(true);

    try {
      const data = await api.post('/integrations/messaging', {
        provider: selectedProvider.id,
        name: selectedProvider.name,
        credentials: providerCredentials,
      });

      if (data.success) {
        toast({
          title: 'Integration Saved',
          description: data.message || 'Provider connected successfully',
        });
        setShowProviderDialog(false);
        fetchMessagingData();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to save integration',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to save integration',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProvider = async () => {
    if (!deleteProvider) return;

    try {
      await api.delete(`/integrations/messaging/${deleteProvider.provider}`);
      toast({
        title: 'Integration Removed',
        description: 'Provider disconnected successfully',
      });
      fetchMessagingData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove integration',
        variant: 'destructive',
      });
    } finally {
      setDeleteProvider(null);
    }
  };

  const filteredIntegrations = availableIntegrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || integration.category === selectedCategory;
    const isNotConnected = !connectedIntegrations.find(
      (c) => c.name.toLowerCase() === integration.name.toLowerCase()
    );
    return matchesSearch && matchesCategory && isNotConnected;
  });

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  // Get providers not yet connected
  const availableProviders = providersCatalog.filter(
    (p) => !connectedProviders.find((cp) => cp.provider === p.id)
  );

  return (
    <UnifiedLayout hubId="settings" pageTitle="Integrations" fixedMenu={null}>
      <motion.div
        className="flex-1 space-y-6 p-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Stats Row */}
        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-900">{connectedProviders.length}</p>
                <p className="text-xs text-green-600/80">Messaging Providers</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Link2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">{connectedIntegrations.length}</p>
                <p className="text-xs text-blue-600/80">Other Integrations</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-4 border border-purple-200/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Puzzle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-900">
                  {providersCatalog.length + availableIntegrations.length}
                </p>
                <p className="text-xs text-purple-600/80">Available</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Globe className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-900">
                  {connectedProviders.length + connectedIntegrations.length}
                </p>
                <p className="text-xs text-amber-600/80">Total Connected</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <TabsList className="bg-white rounded-xl p-1 shadow-sm border">
                <TabsTrigger
                  value="messaging"
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:font-medium"
                >
                  <MessageSquare className="h-4 w-4" />
                  Messaging Providers
                </TabsTrigger>
                <TabsTrigger
                  value="connected"
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:font-medium"
                >
                  <Link2 className="h-4 w-4" />
                  Connected ({connectedIntegrations.length})
                </TabsTrigger>
                <TabsTrigger
                  value="available"
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:font-medium"
                >
                  <Plus className="h-4 w-4" />
                  Available
                </TabsTrigger>
              </TabsList>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search integrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-[250px]"
                />
              </div>
            </div>

            {/* Messaging Providers Tab */}
            <TabsContent value="messaging" className="space-y-6 mt-0">
              {/* Connected Messaging Providers */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Connected Providers</h2>
                {loadingProviders ? (
                  <Card className="border-dashed">
                    <CardContent className="py-12 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                      <p className="mt-4 text-sm text-muted-foreground">Loading providers...</p>
                    </CardContent>
                  </Card>
                ) : connectedProviders.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="py-12 text-center">
                      <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                      <p className="text-lg font-medium text-muted-foreground">
                        No messaging providers connected
                      </p>
                      <p className="text-sm text-muted-foreground/80 mb-4">
                        Connect a provider below to enable SMS, WhatsApp, and other messaging
                        channels
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {connectedProviders.map((provider) => (
                      <motion.div
                        key={provider.id}
                        variants={itemVariants}
                        className="rounded-2xl border bg-gradient-to-r from-white to-green-50/30 border-green-200/50 p-4 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => router.push(`/settings/integrations/${provider.provider}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <ProviderLogo
                              providerId={provider.provider}
                              name={provider.name}
                              size="sm"
                            />
                            <div>
                              <h3 className="font-semibold flex items-center gap-2">
                                {provider.name}
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                  Connected
                                </Badge>
                              </h3>
                              <p className="text-xs text-muted-foreground mt-1">
                                {provider.provider.toUpperCase()}
                              </p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  const catalogProvider = providersCatalog.find(
                                    (p) => p.id === provider.provider
                                  );
                                  if (catalogProvider) handleConfigureProvider(catalogProvider);
                                }}
                              >
                                <Settings className="mr-2 h-4 w-4" />
                                Update Credentials
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => setDeleteProvider(provider)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="mt-4 space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span>Validated</span>
                            </div>
                          </div>
                          {provider.lastTestedAt && (
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Last tested</span>
                              <span>{formatTimeAgo(provider.lastTestedAt)}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Available Messaging Providers */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Available Providers</h2>
                <p className="text-sm text-muted-foreground">
                  Connect your own API keys from these providers. Bring Your Own Keys (BYOK) model.
                </p>
                {loadingProviders ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="py-8">
                          <div className="h-12 w-12 rounded-lg bg-muted mx-auto mb-4" />
                          <div className="h-4 w-24 bg-muted mx-auto mb-2" />
                          <div className="h-3 w-32 bg-muted mx-auto" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {availableProviders.map((provider) => {
                      const categoryConfig =
                        providerCategories[provider.category] || providerCategories.multi;
                      return (
                        <motion.div
                          key={provider.id}
                          variants={itemVariants}
                          className="rounded-2xl border bg-white p-4 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer"
                          onClick={() => router.push(`/settings/integrations/${provider.id}`)}
                        >
                          <div className="flex items-start gap-4">
                            <ProviderLogo providerId={provider.id} name={provider.name} size="md" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{provider.name}</h3>
                                <Badge
                                  className={`text-xs ${categoryConfig.bg} ${categoryConfig.color} border-0`}
                                >
                                  {categoryConfig.label}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">
                                {provider.description}
                              </p>
                              <div className="flex flex-wrap gap-1 mb-3">
                                {provider.services.map((service) => (
                                  <Badge
                                    key={service}
                                    variant="outline"
                                    className="text-[10px] py-0 px-1.5"
                                  >
                                    {service.toUpperCase()}
                                  </Badge>
                                ))}
                              </div>
                              {provider.features && (
                                <div className="text-[10px] text-muted-foreground">
                                  {provider.features.slice(0, 3).join(' • ')}
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-4 w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/settings/integrations/${provider.id}`);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Connect {provider.name}
                          </Button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Connected Integrations */}
            <TabsContent value="connected" className="space-y-4 mt-0">
              {connectedIntegrations.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center">
                    <Zap className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">
                      No integrations connected
                    </p>
                    <p className="text-sm text-muted-foreground/80 mb-4">
                      Connect your first integration to get started
                    </p>
                    <Button onClick={() => setActiveTab('available')}>Browse Integrations</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {connectedIntegrations.map((integration) => (
                    <motion.div
                      key={integration.id}
                      variants={itemVariants}
                      className="rounded-2xl border bg-gradient-to-r from-white to-blue-50/30 border-blue-200/50 p-4 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{integration.logo}</div>
                          <div>
                            <h3 className="font-semibold flex items-center gap-2">
                              {integration.name}
                              {integration.status === 'connected' ? (
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                  Connected
                                </Badge>
                              ) : (
                                <Badge variant="outline">Disconnected</Badge>
                              )}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              Connected by {integration.connectedBy}
                            </p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Settings className="mr-2 h-4 w-4" />
                              Configure
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Sync Now
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View in {integration.name}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDisconnect(integration)}
                            >
                              <Unlink className="mr-2 h-4 w-4" />
                              Disconnect
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Last sync</span>
                          <div className="flex items-center gap-2">
                            {integration.syncStatus === 'success' ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : integration.syncStatus === 'warning' ? (
                              <AlertTriangle className="h-4 w-4 text-orange-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span>{formatTimeAgo(integration.lastSync)}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          <Settings className="mr-2 h-4 w-4" />
                          Configure
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Available Integrations */}
            <TabsContent value="available" className="space-y-4 mt-0">
              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? '' : 'hover:bg-gray-100'}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Integration Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredIntegrations.map((integration) => (
                  <motion.div
                    key={integration.id}
                    variants={itemVariants}
                    className="rounded-2xl border bg-white p-4 hover:shadow-md hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{integration.logo}</div>
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            {integration.name}
                            {integration.popular && (
                              <Badge variant="outline" className="text-xs">
                                Popular
                              </Badge>
                            )}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {integration.category}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground my-4">{integration.description}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleConnect(integration)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Connect
                    </Button>
                  </motion.div>
                ))}
              </div>

              {filteredIntegrations.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center">
                    <Search className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">
                      No integrations found
                    </p>
                    <p className="text-sm text-muted-foreground/80">
                      Try adjusting your search or filter
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Info Accordion */}
        <motion.div variants={itemVariants}>
          <Accordion type="single" collapsible className="space-y-3">
            <AccordionItem
              value="what-are-integrations"
              className="bg-gradient-to-br from-purple-50/50 to-violet-50/50 rounded-2xl border border-purple-200/50 px-6"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <HelpCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-purple-900">What are Integrations?</h3>
                    <p className="text-sm text-purple-600/80">Connect your tools and services</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="grid gap-4 md:grid-cols-3 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-purple-900">Connect Services</p>
                      <p className="text-sm text-purple-700/70">
                        Link your CRM, email, and messaging platforms with a few clicks
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-purple-900">Sync Data</p>
                      <p className="text-sm text-purple-700/70">
                        Automatically keep contacts, deals, and messages in sync
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-purple-900">Automate Workflows</p>
                      <p className="text-sm text-purple-700/70">
                        Trigger actions across platforms when events occur
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="byok"
              className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 rounded-2xl border border-green-200/50 px-6"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-green-900">Bring Your Own Keys (BYOK)</h3>
                    <p className="text-sm text-green-600/80">Use your own API credentials</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="grid gap-3 md:grid-cols-2 pt-2">
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                    <span className="text-sm text-green-900">
                      Full control over your API usage and billing
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                    <span className="text-sm text-green-900">
                      No middleman - direct connection to providers
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                    <span className="text-sm text-green-900">
                      Use existing provider relationships & pricing
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                    <span className="text-sm text-green-900">
                      Secure credential storage with encryption
                    </span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>

        {/* Provider Configuration Dialog */}
        <Dialog open={showProviderDialog} onOpenChange={setShowProviderDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <ProviderLogo
                  providerId={selectedProvider?.id}
                  name={selectedProvider?.name}
                  size="sm"
                />
                Configure {selectedProvider?.name}
              </DialogTitle>
              <DialogDescription>{selectedProvider?.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {selectedProvider?.docsUrl && (
                <a
                  href={selectedProvider.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  View {selectedProvider.name} Documentation
                </a>
              )}

              {selectedProvider?.credentials?.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  <div className="relative">
                    <Input
                      id={field.key}
                      type={
                        showCredentials[field.key] || field.type !== 'password'
                          ? 'text'
                          : 'password'
                      }
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      value={providerCredentials[field.key] || ''}
                      onChange={(e) =>
                        setProviderCredentials({
                          ...providerCredentials,
                          [field.key]: e.target.value,
                        })
                      }
                      className={field.type === 'password' ? 'pr-10' : ''}
                    />
                    {field.type === 'password' && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() =>
                          setShowCredentials({
                            ...showCredentials,
                            [field.key]: !showCredentials[field.key],
                          })
                        }
                      >
                        {showCredentials[field.key] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              <div className="rounded-lg border p-4 bg-muted/50">
                <p className="text-sm font-medium mb-2">Supported Services:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProvider?.services?.map((service) => (
                    <Badge key={service} variant="secondary">
                      {service.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={testing || !Object.keys(providerCredentials).length}
              >
                {testing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Test Connection
              </Button>
              <Button
                onClick={handleSaveProvider}
                disabled={saving || !Object.keys(providerCredentials).length}
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Integration
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Connect Dialog for other integrations */}
        <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <span className="text-2xl">{selectedIntegration?.logo}</span>
                Connect {selectedIntegration?.name}
              </DialogTitle>
              <DialogDescription>{selectedIntegration?.description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-lg border p-4 bg-muted/50">
                <p className="text-sm font-medium mb-2">This integration will:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Sync contacts and data between platforms</li>
                  <li>• Send real-time updates on events</li>
                  <li>• Access your {selectedIntegration?.name} account</li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConnectDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowConnectDialog(false)}>
                <Link2 className="mr-2 h-4 w-4" />
                Connect with {selectedIntegration?.name}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Disconnect Confirmation */}
        <AlertDialog open={showDisconnectConfirm} onOpenChange={setShowDisconnectConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Disconnect {selectedIntegration?.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                This will stop syncing data between Nexora and {selectedIntegration?.name}. Your
                existing data will not be deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => setShowDisconnectConfirm(false)}
              >
                Disconnect
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Provider Confirmation */}
        <AlertDialog
          open={!!deleteProvider}
          onOpenChange={(open) => !open && setDeleteProvider(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove {deleteProvider?.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                This will disconnect the {deleteProvider?.provider?.toUpperCase()} integration. Any
                channels using this provider will need to be reconfigured.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDeleteProvider}
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </UnifiedLayout>
  );
}
