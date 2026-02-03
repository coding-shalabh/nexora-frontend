'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  MoreHorizontal,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Code,
  ExternalLink,
  Search,
  Activity,
  Zap,
  BookOpen,
  Lock,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// TODO: Replace with actual API hook using useQuery
// API endpoint: GET /api/v1/settings/api-keys
const apiKeysData = [];

const availableScopes = [
  { id: 'contacts:read', name: 'Read Contacts', description: 'View contact information' },
  { id: 'contacts:write', name: 'Write Contacts', description: 'Create and update contacts' },
  { id: 'contacts:delete', name: 'Delete Contacts', description: 'Delete contacts' },
  { id: 'messages:read', name: 'Read Messages', description: 'View conversations' },
  { id: 'messages:send', name: 'Send Messages', description: 'Send messages via channels' },
  { id: 'campaigns:read', name: 'Read Campaigns', description: 'View campaigns' },
  { id: 'campaigns:write', name: 'Write Campaigns', description: 'Create and manage campaigns' },
  { id: 'analytics:read', name: 'Read Analytics', description: 'Access analytics data' },
  { id: 'reports:read', name: 'Read Reports', description: 'Access reports' },
  { id: 'webhooks:manage', name: 'Manage Webhooks', description: 'Configure webhooks' },
  { id: 'events:read', name: 'Read Events', description: 'Access event logs' },
];

export default function ApiKeysPage() {
  const [activeTab, setActiveTab] = useState('keys');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateKey, setShowCreateKey] = useState(false);
  const [showNewKey, setShowNewKey] = useState(false);
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [newKeyValue, setNewKeyValue] = useState('');
  const [selectedScopes, setSelectedScopes] = useState([]);
  const [copied, setCopied] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState({});

  const activeKeys = apiKeysData.filter((k) => k.status === 'active');
  const revokedKeys = apiKeysData.filter((k) => k.status === 'revoked');
  const totalCalls = apiKeysData.reduce((sum, k) => sum + k.usageCount, 0);
  const keysWithExpiry = apiKeysData.filter((k) => k.expiresAt).length;

  const filteredKeys = apiKeysData.filter(
    (key) =>
      key.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      key.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateKey = () => {
    const generatedKey = 'crm_live_sk_' + Math.random().toString(36).substring(2, 34);
    setNewKeyValue(generatedKey);
    setShowCreateKey(false);
    setShowNewKey(true);
  };

  const handleRevoke = (key) => {
    setSelectedKey(key);
    setShowRevokeConfirm(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleKeyVisibility = (keyId) => {
    setVisibleKeys({
      ...visibleKeys,
      [keyId]: !visibleKeys[keyId],
    });
  };

  const toggleScope = (scopeId) => {
    if (selectedScopes.includes(scopeId)) {
      setSelectedScopes(selectedScopes.filter((s) => s !== scopeId));
    } else {
      setSelectedScopes([...selectedScopes, scopeId]);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 space-y-6 p-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground">Manage API keys for integrations and automation</p>
        </div>
        <Button
          onClick={() => {
            setSelectedScopes([]);
            setShowCreateKey(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create API Key
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Key className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">{activeKeys.length}</p>
              <p className="text-xs text-blue-600/80">Active Keys</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-900">{totalCalls.toLocaleString()}</p>
              <p className="text-xs text-green-600/80">Total API Calls</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-900">{keysWithExpiry}</p>
              <p className="text-xs text-amber-600/80">Keys with Expiry</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-4 border border-red-200/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-900">{revokedKeys.length}</p>
              <p className="text-xs text-red-600/80">Revoked Keys</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-gray-100/80">
              <TabsTrigger
                value="keys"
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-medium data-[state=active]:shadow-sm"
              >
                <Key className="h-4 w-4" />
                API Keys
                <Badge variant="secondary" className="ml-1 bg-gray-200">
                  {apiKeysData.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="docs"
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-medium data-[state=active]:shadow-sm"
              >
                <BookOpen className="h-4 w-4" />
                Documentation
              </TabsTrigger>
            </TabsList>

            {activeTab === 'keys' && (
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search keys..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            )}
          </div>

          <TabsContent value="keys" className="space-y-4">
            <div className="grid gap-4">
              {filteredKeys.map((apiKey) => (
                <Card
                  key={apiKey.id}
                  className={`rounded-2xl hover:shadow-md transition-all ${apiKey.status === 'revoked' ? 'opacity-60' : ''}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div
                          className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                            apiKey.status === 'active'
                              ? 'bg-gradient-to-br from-blue-100 to-indigo-100'
                              : 'bg-gray-100'
                          }`}
                        >
                          <Key
                            className={`h-6 w-6 ${apiKey.status === 'active' ? 'text-blue-600' : 'text-gray-400'}`}
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{apiKey.name}</h3>
                            {apiKey.status === 'active' ? (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                Active
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                                Revoked
                              </Badge>
                            )}
                            {apiKey.expiresAt && (
                              <Badge variant="outline" className="text-amber-600 border-amber-300">
                                <Clock className="h-3 w-3 mr-1" />
                                Expires
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Created by {apiKey.createdBy} • {formatTimeAgo(apiKey.createdAt)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                              {visibleKeys[apiKey.id]
                                ? apiKey.key
                                : `${apiKey.prefix}${'•'.repeat(16)}`}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => toggleKeyVisibility(apiKey.id)}
                            >
                              {visibleKeys[apiKey.id] ? (
                                <EyeOff className="h-3 w-3" />
                              ) : (
                                <Eye className="h-3 w-3" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(apiKey.key)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {apiKey.usageCount.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">API calls</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatTimeAgo(apiKey.lastUsed)}</p>
                          <p className="text-xs text-muted-foreground">Last used</p>
                        </div>
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {apiKey.scopes.slice(0, 2).map((scope) => (
                            <Badge key={scope} variant="outline" className="text-xs">
                              {scope.split(':')[0]}
                            </Badge>
                          ))}
                          {apiKey.scopes.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{apiKey.scopes.length - 2}
                            </Badge>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => copyToClipboard(apiKey.key)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy Key
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Regenerate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {apiKey.status === 'active' && (
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleRevoke(apiKey)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Revoke Key
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="docs" className="space-y-4">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  API Documentation
                </CardTitle>
                <CardDescription>Learn how to integrate with our API</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border p-4 bg-gradient-to-br from-gray-50 to-slate-50">
                  <h4 className="font-medium mb-2">Base URL</h4>
                  <code className="text-sm bg-white px-3 py-1.5 rounded-lg border">
                    https://api.nexoraos.pro/v1
                  </code>
                </div>

                <div className="rounded-xl border p-4">
                  <h4 className="font-medium mb-2">Authentication</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Include your API key in the Authorization header:
                  </p>
                  <pre className="text-sm bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto">
                    {`curl -X GET "https://api.nexoraos.pro/v1/contacts" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                  </pre>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border p-4 hover:bg-muted/50 transition-colors">
                    <h4 className="font-medium mb-3">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a
                          href="#"
                          className="text-primary hover:underline flex items-center gap-2"
                        >
                          <Zap className="h-4 w-4" />
                          API Reference
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-primary hover:underline flex items-center gap-2"
                        >
                          <Code className="h-4 w-4" />
                          SDKs & Libraries
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-primary hover:underline flex items-center gap-2"
                        >
                          <Lock className="h-4 w-4" />
                          Webhooks Guide
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-xl border p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/50">
                    <h4 className="font-medium mb-3 text-amber-900">Rate Limits</h4>
                    <ul className="space-y-2 text-sm text-amber-800">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        1000 requests per minute (standard)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        5000 requests per minute (enterprise)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        Burst limit: 100 requests per second
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Info Accordion */}
      <motion.div variants={itemVariants}>
        <Accordion type="single" collapsible className="bg-white rounded-2xl border">
          <AccordionItem value="about" className="border-none">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Key className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium">What are API Keys?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <div className="pl-11 space-y-2 text-muted-foreground">
                <p>
                  API keys are secure tokens that authenticate your applications when making
                  requests to the Nexora API. Each key can have specific permissions (scopes) that
                  control what operations it can perform.
                </p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Use different keys for different environments (production, staging)</li>
                  <li>Grant minimal permissions following the principle of least privilege</li>
                  <li>Set expiration dates for temporary integrations</li>
                  <li>Revoke compromised keys immediately</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="security" className="border-none">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-green-600" />
                </div>
                <span className="font-medium">Security Best Practices</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <div className="pl-11 space-y-2 text-muted-foreground">
                <ul className="list-disc list-inside space-y-1">
                  <li>Never expose API keys in client-side code or public repositories</li>
                  <li>Store keys in environment variables or secure vaults</li>
                  <li>Rotate keys periodically, especially for production environments</li>
                  <li>Monitor API key usage for unusual patterns</li>
                  <li>Use IP allowlisting for additional security when possible</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>

      {/* Create Key Dialog */}
      <Dialog open={showCreateKey} onOpenChange={setShowCreateKey}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
            <DialogDescription>Generate a new API key for integrations</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="key-name">Key Name</Label>
              <Input id="key-name" placeholder="e.g., Production API" />
            </div>

            <div className="space-y-2">
              <Label>Expiration</Label>
              <Select defaultValue="never">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never expires</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto border rounded-lg p-3">
                {availableScopes.map((scope) => (
                  <div key={scope.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={scope.id}
                      checked={selectedScopes.includes(scope.id)}
                      onCheckedChange={() => toggleScope(scope.id)}
                    />
                    <label htmlFor={scope.id} className="text-sm cursor-pointer">
                      <span className="font-medium">{scope.name}</span>
                      <p className="text-xs text-muted-foreground">{scope.description}</p>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateKey(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateKey} disabled={selectedScopes.length === 0}>
              Create Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Key Created Dialog */}
      <Dialog open={showNewKey} onOpenChange={setShowNewKey}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              API Key Created
            </DialogTitle>
            <DialogDescription>
              Copy your API key now. You won't be able to see it again!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <p className="text-sm text-yellow-800">
                  Make sure to copy your API key now. For security reasons, we won't show it again.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Your API Key</Label>
              <div className="flex gap-2">
                <Input value={newKeyValue} readOnly className="font-mono text-sm" />
                <Button variant="outline" onClick={() => copyToClipboard(newKeyValue)}>
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowNewKey(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Confirmation */}
      <AlertDialog open={showRevokeConfirm} onOpenChange={setShowRevokeConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke API Key?</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately invalidate the API key "{selectedKey?.name}". Any applications
              using this key will lose access. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => setShowRevokeConfirm(false)}
            >
              Revoke Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
