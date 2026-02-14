'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UnifiedLayout } from '@/components/layout/unified';
import {
  Lock,
  Search,
  Plus,
  Shield,
  Key,
  Users,
  User,
  Globe,
  Smartphone,
  Monitor,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Settings,
  Fingerprint,
  MapPin,
  Calendar,
  Wifi,
  WifiOff,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

// Mock active sessions
const activeSessions = [
  {
    id: 'sess_001',
    userId: 'user_1',
    userName: 'Rajesh Kumar',
    userEmail: 'rajesh@company.com',
    device: 'Chrome on Windows',
    deviceType: 'desktop',
    ipAddress: '103.21.45.67',
    location: 'Mumbai, India',
    lastActive: '2024-01-15T14:32:00Z',
    createdAt: '2024-01-15T09:00:00Z',
    current: true,
  },
  {
    id: 'sess_002',
    userId: 'user_1',
    userName: 'Rajesh Kumar',
    userEmail: 'rajesh@company.com',
    device: 'Nexora Mobile App',
    deviceType: 'mobile',
    ipAddress: '103.21.45.90',
    location: 'Mumbai, India',
    lastActive: '2024-01-15T12:15:00Z',
    createdAt: '2024-01-14T18:30:00Z',
    current: false,
  },
  {
    id: 'sess_003',
    userId: 'user_2',
    userName: 'Priya Sharma',
    userEmail: 'priya@company.com',
    device: 'Firefox on macOS',
    deviceType: 'desktop',
    ipAddress: '103.21.45.89',
    location: 'Delhi, India',
    lastActive: '2024-01-15T14:28:00Z',
    createdAt: '2024-01-15T08:45:00Z',
    current: false,
  },
  {
    id: 'sess_004',
    userId: 'user_4',
    userName: 'Amit Patel',
    userEmail: 'amit@company.com',
    device: 'Safari on iPhone',
    deviceType: 'mobile',
    ipAddress: '103.21.45.91',
    location: 'Bangalore, India',
    lastActive: '2024-01-15T10:45:00Z',
    createdAt: '2024-01-15T10:00:00Z',
    current: false,
  },
];

// Mock IP whitelist
const ipWhitelist = [
  {
    id: 'ip_001',
    ipRange: '103.21.45.0/24',
    label: 'Office Network',
    description: 'Main office IP range',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'Rajesh Kumar',
    enabled: true,
  },
  {
    id: 'ip_002',
    ipRange: '203.45.67.89',
    label: 'VPN Gateway',
    description: 'Remote access VPN',
    createdAt: '2024-01-05T00:00:00Z',
    createdBy: 'Rajesh Kumar',
    enabled: true,
  },
  {
    id: 'ip_003',
    ipRange: '192.168.1.0/24',
    label: 'Development Network',
    description: 'Dev team local network',
    createdAt: '2024-01-10T00:00:00Z',
    createdBy: 'Priya Sharma',
    enabled: false,
  },
];

// Mock API keys
const apiKeys = [
  {
    id: 'key_001',
    name: 'Production API Key',
    prefix: 'crm_prod_',
    lastUsed: '2024-01-15T14:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'Rajesh Kumar',
    scopes: ['read', 'write', 'delete'],
    status: 'active',
    expiresAt: null,
  },
  {
    id: 'key_002',
    name: 'Webhook Integration',
    prefix: 'crm_webhook_',
    lastUsed: '2024-01-15T11:00:00Z',
    createdAt: '2024-01-05T00:00:00Z',
    createdBy: 'Priya Sharma',
    scopes: ['read', 'webhook'],
    status: 'active',
    expiresAt: '2024-06-30T00:00:00Z',
  },
  {
    id: 'key_003',
    name: 'Analytics Dashboard',
    prefix: 'crm_analytics_',
    lastUsed: '2024-01-10T00:00:00Z',
    createdAt: '2024-01-03T00:00:00Z',
    createdBy: 'Amit Patel',
    scopes: ['read'],
    status: 'active',
    expiresAt: null,
  },
  {
    id: 'key_004',
    name: 'Old Integration (Deprecated)',
    prefix: 'crm_old_',
    lastUsed: '2023-12-15T00:00:00Z',
    createdAt: '2023-06-01T00:00:00Z',
    createdBy: 'Rajesh Kumar',
    scopes: ['read', 'write'],
    status: 'revoked',
    expiresAt: null,
  },
];

// Security settings
const securitySettings = {
  twoFactorRequired: true,
  sessionTimeout: 30,
  passwordMinLength: 12,
  passwordRequireSpecial: true,
  passwordExpiryDays: 90,
  maxLoginAttempts: 5,
  ipWhitelistEnabled: false,
  ssoEnabled: false,
};

const getDeviceIcon = (deviceType) => {
  switch (deviceType) {
    case 'mobile':
      return <Smartphone className="h-4 w-4" />;
    case 'desktop':
      return <Monitor className="h-4 w-4" />;
    default:
      return <Globe className="h-4 w-4" />;
  }
};

export default function AccessControlPage() {
  const [activeTab, setActiveTab] = useState('sessions');
  const [showAddIp, setShowAddIp] = useState(false);
  const [showCreateKey, setShowCreateKey] = useState(false);
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [settings, setSettings] = useState(securitySettings);

  const handleRevokeSession = (session) => {
    setSelectedItem(session);
    setShowRevokeConfirm(true);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <UnifiedLayout hubId="settings" pageTitle="Access Control" fixedMenu={null}>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Access Control</h1>
            <p className="text-muted-foreground">
              Manage sessions, API keys, and security settings
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="ip-whitelist">IP Whitelist</TabsTrigger>
            <TabsTrigger value="settings">Security Settings</TabsTrigger>
          </TabsList>

          {/* Active Sessions */}
          <TabsContent value="sessions" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Active Sessions</CardTitle>
                    <CardDescription>
                      {activeSessions.length} active sessions across your workspace
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    Revoke All Other Sessions
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeSessions.map((session) => (
                    <div
                      key={session.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        session.current ? 'border-primary bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`rounded-lg p-2 ${session.current ? 'bg-primary/10' : 'bg-muted'}`}
                        >
                          {getDeviceIcon(session.deviceType)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{session.device}</p>
                            {session.current && (
                              <Badge className="bg-primary/10 text-primary">Current</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {session.userName}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {session.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Wifi className="h-3 w-3" />
                              {session.ipAddress}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatTimeAgo(session.lastActive)}</p>
                          <p className="text-xs text-muted-foreground">Last active</p>
                        </div>
                        {!session.current && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                            onClick={() => handleRevokeSession(session)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys */}
          <TabsContent value="api-keys" className="space-y-4 mt-4">
            <div className="flex justify-end">
              <Button size="sm" onClick={() => setShowCreateKey(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create API Key
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Key Prefix</TableHead>
                      <TableHead>Scopes</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((key) => (
                      <TableRow key={key.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{key.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Created by {key.createdBy}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {key.prefix}****
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {key.scopes.map((scope) => (
                              <Badge key={scope} variant="outline" className="text-xs">
                                {scope}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{formatTimeAgo(key.lastUsed)}</span>
                        </TableCell>
                        <TableCell>
                          {key.status === 'active' ? (
                            <Badge className="bg-green-100 text-green-700">Active</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-700">Revoked</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {key.expiresAt ? (
                            <span className="text-sm">
                              {new Date(key.expiresAt).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">Never</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Regenerate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {key.status === 'active' && (
                                <DropdownMenuItem className="text-red-600">
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Revoke Key
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* IP Whitelist */}
          <TabsContent value="ip-whitelist" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">IP Whitelist</CardTitle>
                    <CardDescription>
                      Restrict access to specific IP addresses or ranges
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={settings.ipWhitelistEnabled}
                        onCheckedChange={(checked) =>
                          setSettings({ ...settings, ipWhitelistEnabled: checked })
                        }
                      />
                      <Label>Enable IP Whitelist</Label>
                    </div>
                    <Button size="sm" onClick={() => setShowAddIp(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add IP
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!settings.ipWhitelistEnabled && (
                  <div className="mb-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <AlertTriangle className="h-4 w-4" />
                      <p className="text-sm">
                        IP whitelist is currently disabled. All IP addresses can access your
                        workspace.
                      </p>
                    </div>
                  </div>
                )}

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>IP / Range</TableHead>
                      <TableHead>Label</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Added By</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ipWhitelist.map((ip) => (
                      <TableRow key={ip.id}>
                        <TableCell>
                          <code className="text-sm bg-muted px-2 py-1 rounded">{ip.ipRange}</code>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{ip.label}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-muted-foreground">{ip.description}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{ip.createdBy}</span>
                        </TableCell>
                        <TableCell>
                          {ip.enabled ? (
                            <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                          ) : (
                            <Badge variant="outline">Disabled</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                {ip.enabled ? (
                                  <>
                                    <WifiOff className="mr-2 h-4 w-4" />
                                    Disable
                                  </>
                                ) : (
                                  <>
                                    <Wifi className="mr-2 h-4 w-4" />
                                    Enable
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="settings" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Authentication</CardTitle>
                  <CardDescription>Configure login and authentication settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Require Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        All users must enable 2FA to access the workspace
                      </p>
                    </div>
                    <Switch
                      checked={settings.twoFactorRequired}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, twoFactorRequired: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Session Timeout</p>
                      <p className="text-sm text-muted-foreground">
                        Automatically log out inactive users
                      </p>
                    </div>
                    <Select
                      value={String(settings.sessionTimeout)}
                      onValueChange={(value) =>
                        setSettings({ ...settings, sessionTimeout: parseInt(value) })
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="480">8 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Max Login Attempts</p>
                      <p className="text-sm text-muted-foreground">
                        Lock account after failed attempts
                      </p>
                    </div>
                    <Select
                      value={String(settings.maxLoginAttempts)}
                      onValueChange={(value) =>
                        setSettings({ ...settings, maxLoginAttempts: parseInt(value) })
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 attempts</SelectItem>
                        <SelectItem value="5">5 attempts</SelectItem>
                        <SelectItem value="10">10 attempts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Single Sign-On (SSO)</p>
                      <p className="text-sm text-muted-foreground">
                        Enable SAML/OAuth SSO integration
                      </p>
                    </div>
                    <Switch
                      checked={settings.ssoEnabled}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, ssoEnabled: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Password Policy</CardTitle>
                  <CardDescription>Set password requirements for all users</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Minimum Password Length</p>
                      <p className="text-sm text-muted-foreground">
                        Require passwords to be at least this long
                      </p>
                    </div>
                    <Select
                      value={String(settings.passwordMinLength)}
                      onValueChange={(value) =>
                        setSettings({ ...settings, passwordMinLength: parseInt(value) })
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8">8 characters</SelectItem>
                        <SelectItem value="10">10 characters</SelectItem>
                        <SelectItem value="12">12 characters</SelectItem>
                        <SelectItem value="16">16 characters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Require Special Characters</p>
                      <p className="text-sm text-muted-foreground">
                        Passwords must include special characters
                      </p>
                    </div>
                    <Switch
                      checked={settings.passwordRequireSpecial}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, passwordRequireSpecial: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Password Expiry</p>
                      <p className="text-sm text-muted-foreground">
                        Force password change after this period
                      </p>
                    </div>
                    <Select
                      value={String(settings.passwordExpiryDays)}
                      onValueChange={(value) =>
                        setSettings({ ...settings, passwordExpiryDays: parseInt(value) })
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Never</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Advanced Security</CardTitle>
                <CardDescription>Additional security features and configurations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-100 p-2">
                        <Fingerprint className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Biometric Login</p>
                        <p className="text-sm text-muted-foreground">
                          Enable fingerprint/face login
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Coming Soon</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-purple-100 p-2">
                        <Shield className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Security Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Get alerts for suspicious activity
                        </p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-green-100 p-2">
                        <Lock className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Data Encryption</p>
                        <p className="text-sm text-muted-foreground">
                          End-to-end encryption at rest
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-orange-100 p-2">
                        <Clock className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">Audit Log Retention</p>
                        <p className="text-sm text-muted-foreground">How long to keep audit logs</p>
                      </div>
                    </div>
                    <Select defaultValue="365">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                        <SelectItem value="730">2 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button>Save Security Settings</Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add IP Dialog */}
        <Dialog open={showAddIp} onOpenChange={setShowAddIp}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add IP to Whitelist</DialogTitle>
              <DialogDescription>
                Add an IP address or CIDR range to the whitelist
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ip-range">IP Address / CIDR Range</Label>
                <Input id="ip-range" placeholder="e.g., 192.168.1.0/24 or 10.0.0.1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ip-label">Label</Label>
                <Input id="ip-label" placeholder="e.g., Office Network" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ip-description">Description (Optional)</Label>
                <Textarea id="ip-description" placeholder="Describe this IP range..." rows={2} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddIp(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowAddIp(false)}>Add to Whitelist</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create API Key Dialog */}
        <Dialog open={showCreateKey} onOpenChange={setShowCreateKey}>
          <DialogContent className="max-w-md">
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
                <Label>Permissions</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="scope-read" defaultChecked />
                    <label htmlFor="scope-read" className="text-sm">
                      Read - Access data
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="scope-write" />
                    <label htmlFor="scope-write" className="text-sm">
                      Write - Create and update data
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="scope-delete" />
                    <label htmlFor="scope-delete" className="text-sm">
                      Delete - Remove data
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="scope-webhook" />
                    <label htmlFor="scope-webhook" className="text-sm">
                      Webhooks - Manage webhooks
                    </label>
                  </div>
                </div>
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateKey(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowCreateKey(false)}>Create Key</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Revoke Confirmation */}
        <AlertDialog open={showRevokeConfirm} onOpenChange={setShowRevokeConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Revoke Session?</AlertDialogTitle>
              <AlertDialogDescription>
                This will immediately log out the user from this session. They will need to log in
                again to access the workspace.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => setShowRevokeConfirm(false)}
              >
                Revoke Session
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </UnifiedLayout>
  );
}
