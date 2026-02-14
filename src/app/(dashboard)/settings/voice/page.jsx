'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import {
  Loader2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ExternalLink,
  Eye,
  EyeOff,
  Unlink,
  FileText,
  Clock,
  Shield,
  Plus,
  Phone,
  PhoneCall,
  ArrowLeft,
  ChevronRight,
  Link2,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Search,
  Zap,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { HelpCircle } from 'lucide-react';
import { UnifiedLayout } from '@/components/layout/unified';

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

function StatusBadge({ status }) {
  const config = {
    HEALTHY: { color: 'bg-green-50 text-green-700', label: 'Connected' },
    ACTIVE: { color: 'bg-green-50 text-green-700', label: 'Active' },
    CONNECTED: { color: 'bg-green-50 text-green-700', label: 'Connected' },
    DEGRADED: { color: 'bg-yellow-50 text-yellow-700', label: 'Degraded' },
    ERROR: { color: 'bg-red-50 text-red-700', label: 'Error' },
    PENDING: { color: 'bg-blue-50 text-blue-700', label: 'Pending' },
    DISCONNECTED: { color: 'bg-gray-50 text-gray-700', label: 'Disconnected' },
  };
  const { color, label } = config[status] || config.DISCONNECTED;
  return <Badge className={cn('font-medium', color)}>{label}</Badge>;
}

// Provider Configuration Dialog
function ProviderDialog({ provider, isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [showCredentials, setShowCredentials] = useState({});
  const [credentials, setCredentials] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setCredentials({});
      setError(null);
      setTestResult(null);
    }
  }, [isOpen]);

  const handleTestConnection = async () => {
    setTesting(true);
    setError(null);
    setTestResult(null);

    try {
      const res = await api.post('/integrations/messaging/test', {
        provider: provider.id,
        credentials,
      });

      if (res.success && res.data.valid) {
        setTestResult(res.data);
        toast({
          title: 'Connection Successful',
          description: res.data.message || 'Credentials are valid',
        });
      } else {
        setError(res.data?.error || res.error || 'Invalid credentials');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Connection failed');
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/integrations/messaging', {
        provider: provider.id,
        name: provider.name,
        credentials,
      });

      if (res.success) {
        toast({
          title: 'Integration Connected',
          description: `${provider.name} connected successfully`,
        });
        onSuccess();
        onClose();
      } else {
        setError(res.error || 'Failed to save integration');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  if (!provider) return null;

  const hasAllCredentials = provider.credentials?.every((c) => credentials[c.key]?.trim());

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <Phone className="h-5 w-5 text-orange-600" />
            </div>
            Connect {provider.name}
          </DialogTitle>
          <DialogDescription>{provider.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive" className="rounded-xl">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {testResult && (
            <Alert className="rounded-xl bg-green-50 border-0">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                {testResult.message}
                {testResult.balance !== undefined && (
                  <span className="block mt-1 font-medium">Balance: ₹{testResult.balance}</span>
                )}
              </AlertDescription>
            </Alert>
          )}

          {provider.docsUrl && (
            <a
              href={provider.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              View {provider.name} Documentation
            </a>
          )}

          {provider.credentials?.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label className="text-gray-700">{field.label}</Label>
              <div className="relative">
                <Input
                  type={
                    showCredentials[field.key] || field.type !== 'password' ? 'text' : 'password'
                  }
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  value={credentials[field.key] || ''}
                  onChange={(e) => setCredentials({ ...credentials, [field.key]: e.target.value })}
                  className={cn(
                    'h-11 rounded-xl bg-gray-50 border-0',
                    field.type === 'password' && 'pr-10'
                  )}
                />
                {field.type === 'password' && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-9 w-9 p-0"
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

          {provider.features && (
            <div className="rounded-xl p-3 bg-gray-50">
              <p className="text-xs font-medium text-gray-700 mb-2">Features:</p>
              <div className="flex flex-wrap gap-1">
                {provider.features.map((feature) => (
                  <Badge key={feature} className="text-xs bg-white text-gray-600">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleTestConnection}
            disabled={testing || !hasAllCredentials}
            className="rounded-xl"
          >
            {testing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Test Connection
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || !hasAllCredentials}
            className="rounded-xl"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save & Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Connected Account Card
function ConnectedAccount({ account, provider, onRefresh, onDisconnect }) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  return (
    <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center">
            <Phone className="h-7 w-7 text-orange-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{account.name || 'Voice Gateway'}</h3>
            <p className="text-sm text-gray-500">
              Provider: {provider?.name || account.provider?.toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={account.status} />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={cn('h-4 w-4 text-gray-400', refreshing && 'animate-spin')} />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4 text-sm text-gray-500">
        <div className="flex items-center gap-1.5">
          <Shield className="h-4 w-4" />
          <span>Connected via {provider?.name || 'API'}</span>
        </div>
        {account.lastTestedAt && (
          <>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>Last verified: {new Date(account.lastTestedAt).toLocaleDateString()}</span>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild className="rounded-lg">
            <a href="/inbox/call-logs">
              <PhoneCall className="h-4 w-4 mr-2" />
              Call Logs
            </a>
          </Button>
          <Button variant="outline" size="sm" className="rounded-lg">
            <FileText className="h-4 w-4 mr-2" />
            IVR Scripts
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
          onClick={onDisconnect}
        >
          <Unlink className="h-4 w-4 mr-2" />
          Disconnect
        </Button>
      </div>
    </motion.div>
  );
}

export default function VoiceSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState([]);
  const [connectedProviders, setConnectedProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showProviderDialog, setShowProviderDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catalogRes, connectedRes] = await Promise.all([
        api.get('/integrations/messaging/catalog'),
        api.get('/integrations/messaging'),
      ]);

      if (catalogRes.success) {
        const voiceProviders = catalogRes.data.filter((p) => p.services?.includes('voice'));
        setProviders(voiceProviders);
      }

      if (connectedRes.success) {
        const connected = connectedRes.data.filter((p) => {
          const catalog = catalogRes.data?.find((c) => c.id === p.provider);
          return catalog?.services?.includes('voice');
        });
        setConnectedProviders(connected);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      toast({
        title: 'Error',
        description: 'Failed to load integrations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProviderClick = (provider) => {
    setSelectedProvider(provider);
    setShowProviderDialog(true);
  };

  const handleDisconnect = async (provider) => {
    if (!confirm(`Are you sure you want to disconnect ${provider.name}?`)) return;

    try {
      await api.delete(`/integrations/messaging/${provider.provider}`);
      toast({
        title: 'Disconnected',
        description: `${provider.name} has been disconnected`,
      });
      fetchData();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to disconnect',
        variant: 'destructive',
      });
    }
  };

  const availableProviders = providers.filter(
    (p) => !connectedProviders.find((cp) => cp.provider === p.id)
  );
  const hasConnected = connectedProviders.length > 0;

  // Calculate stats
  const stats = {
    connected: connectedProviders.length,
    totalCalls: connectedProviders.reduce((sum, p) => sum + (p.stats?.calls || 0), 0),
    inbound: connectedProviders.reduce((sum, p) => sum + (p.stats?.inbound || 0), 0),
    outbound: connectedProviders.reduce((sum, p) => sum + (p.stats?.outbound || 0), 0),
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('connected');

  // Filter providers based on search
  const filteredAvailableProviders = availableProviders.filter(
    (p) =>
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredConnected = connectedProviders.filter(
    (p) =>
      !searchQuery ||
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.provider?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <UnifiedLayout hubId="settings" pageTitle="Voice Settings" fixedMenu={null}>
      <motion.div
        className="flex-1 p-6 space-y-6 overflow-auto"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Search Bar - Right Aligned */}
        <motion.div variants={itemVariants} className="flex justify-end">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-64 pl-10 pr-4 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white rounded-xl p-1 shadow-sm">
              <TabsTrigger
                value="connected"
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:font-medium"
              >
                <Link2 className="h-4 w-4" />
                Connected ({connectedProviders.length})
              </TabsTrigger>
              <TabsTrigger
                value="available"
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:font-medium"
              >
                <Plus className="h-4 w-4" />
                Available ({availableProviders.length})
              </TabsTrigger>
            </TabsList>

            {/* Connected Tab */}
            <TabsContent value="connected" className="mt-6 space-y-6">
              {filteredConnected.length > 0 ? (
                <motion.div className="space-y-4" variants={containerVariants}>
                  {filteredConnected.map((connected) => {
                    const providerCatalog = providers.find((p) => p.id === connected.provider);
                    return (
                      <motion.div key={connected.id} variants={itemVariants}>
                        <ConnectedAccount
                          account={connected}
                          provider={providerCatalog}
                          onRefresh={fetchData}
                          onDisconnect={() => handleDisconnect(connected)}
                        />
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-12 border border-gray-200 text-center"
                >
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4">
                    <Phone className="h-8 w-8 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2 text-gray-900">
                    {searchQuery ? 'No providers found' : 'No Voice Provider Connected'}
                  </h2>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {searchQuery
                      ? 'Try adjusting your search'
                      : 'Connect a voice gateway provider to start making and receiving calls.'}
                  </p>
                  {!searchQuery && (
                    <Button
                      size="lg"
                      className="rounded-xl bg-orange-600 hover:bg-orange-700"
                      onClick={() => setActiveTab('available')}
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Connect Provider
                    </Button>
                  )}
                </motion.div>
              )}
            </TabsContent>

            {/* Available Tab */}
            <TabsContent value="available" className="mt-6 space-y-6">
              {/* Available Providers Grid - At Top */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-6 border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                    <Phone className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Available Providers</h3>
                    <p className="text-sm text-gray-500">
                      {filteredAvailableProviders.length} provider
                      {filteredAvailableProviders.length !== 1 ? 's' : ''} available
                    </p>
                  </div>
                </div>

                {filteredAvailableProviders.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Phone className="h-7 w-7 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">
                      {searchQuery ? 'No providers found' : 'All providers are connected'}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {searchQuery
                        ? 'Try adjusting your search'
                        : 'You have connected all available providers'}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {filteredAvailableProviders.map((provider) => (
                      <motion.div
                        key={provider.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white rounded-xl p-4 border border-gray-200 hover:border-orange-300 cursor-pointer group transition-colors"
                        onClick={() => handleProviderClick(provider)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center text-lg font-bold text-orange-600 shrink-0">
                            {provider.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900">{provider.name}</h3>
                            <p className="text-xs text-gray-500 line-clamp-2">
                              {provider.description}
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all shrink-0" />
                        </div>
                        {provider.features && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {provider.features.slice(0, 2).map((feature) => (
                              <Badge
                                key={feature}
                                className="text-[10px] bg-gray-50 text-gray-600 border-0"
                              >
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Accordion Section - At Bottom */}
              <motion.div variants={itemVariants}>
                <Accordion type="single" collapsible className="space-y-3">
                  {/* How It Works */}
                  <AccordionItem
                    value="how-it-works"
                    className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-2xl border border-amber-200/50 px-6"
                  >
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                          <HelpCircle className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900">How It Works</h3>
                          <p className="text-sm text-gray-500">Quick setup process in 4 steps</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-3 pt-2">
                        {[
                          {
                            step: '1',
                            title: 'Choose Provider',
                            desc: 'Select a voice gateway provider',
                          },
                          {
                            step: '2',
                            title: 'Enter Credentials',
                            desc: 'Add your API keys from the provider',
                          },
                          {
                            step: '3',
                            title: 'Test Connection',
                            desc: "We'll verify your account is working",
                          },
                          {
                            step: '4',
                            title: 'Start Calling',
                            desc: 'Make and receive calls from CRM',
                          },
                        ].map((item) => (
                          <div
                            key={item.step}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white border border-amber-200"
                          >
                            <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                              <span className="text-sm font-bold text-amber-600">{item.step}</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm text-gray-900">{item.title}</h4>
                              <p className="text-xs text-gray-500">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Provider Configuration Dialog */}
        <ProviderDialog
          provider={selectedProvider}
          isOpen={showProviderDialog}
          onClose={() => setShowProviderDialog(false)}
          onSuccess={fetchData}
        />
      </motion.div>
    </UnifiedLayout>
  );
}
