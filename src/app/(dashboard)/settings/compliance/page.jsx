'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardList,
  Search,
  Filter,
  Download,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  Mail,
  Phone,
  Smartphone,
  Calendar,
  User,
  Building2,
  FileText,
  AlertTriangle,
  Shield,
  RefreshCw,
  MoreHorizontal,
  Eye,
  History,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';

// Mock consent statistics
const consentStats = {
  totalContacts: 45782,
  consentedContacts: 38456,
  pendingConsent: 4126,
  optedOut: 3200,
  consentRate: 84.0,
  changeFromLastMonth: 2.3,
};

// Mock channel consent breakdown
const channelConsent = [
  { channel: 'WhatsApp', icon: MessageSquare, consented: 32450, total: 35000, rate: 92.7, color: 'bg-green-500' },
  { channel: 'SMS', icon: Smartphone, consented: 28900, total: 34000, rate: 85.0, color: 'bg-blue-500' },
  { channel: 'Email', icon: Mail, consented: 25600, total: 32000, rate: 80.0, color: 'bg-purple-500' },
  { channel: 'Voice', icon: Phone, consented: 18200, total: 24000, rate: 75.8, color: 'bg-orange-500' },
];

// Mock consent logs
const consentLogs = [
  {
    id: 'cl_001',
    contactName: 'Rajesh Kumar',
    contactPhone: '+91 98765 43210',
    contactEmail: 'rajesh@example.com',
    action: 'opted_in',
    channel: 'whatsapp',
    source: 'web_form',
    timestamp: '2024-01-15T10:30:00Z',
    ipAddress: '103.21.45.67',
    consentText: 'I agree to receive promotional messages via WhatsApp',
  },
  {
    id: 'cl_002',
    contactName: 'Priya Sharma',
    contactPhone: '+91 98765 43211',
    contactEmail: 'priya@example.com',
    action: 'opted_out',
    channel: 'sms',
    source: 'sms_reply',
    timestamp: '2024-01-15T09:45:00Z',
    ipAddress: null,
    consentText: 'STOP received via SMS',
  },
  {
    id: 'cl_003',
    contactName: 'Amit Patel',
    contactPhone: '+91 98765 43212',
    contactEmail: 'amit@example.com',
    action: 'opted_in',
    channel: 'email',
    source: 'double_optin',
    timestamp: '2024-01-15T08:20:00Z',
    ipAddress: '103.21.45.89',
    consentText: 'Email subscription confirmed via double opt-in',
  },
  {
    id: 'cl_004',
    contactName: 'Sneha Reddy',
    contactPhone: '+91 98765 43213',
    contactEmail: 'sneha@example.com',
    action: 'updated',
    channel: 'all',
    source: 'preference_center',
    timestamp: '2024-01-14T16:30:00Z',
    ipAddress: '103.21.45.90',
    consentText: 'Updated communication preferences',
  },
  {
    id: 'cl_005',
    contactName: 'Vikram Singh',
    contactPhone: '+91 98765 43214',
    contactEmail: 'vikram@example.com',
    action: 'opted_in',
    channel: 'voice',
    source: 'api',
    timestamp: '2024-01-14T14:15:00Z',
    ipAddress: null,
    consentText: 'Consent captured via API integration',
  },
];

// Mock consent purposes
const consentPurposes = [
  { id: 'marketing', name: 'Marketing Communications', description: 'Promotional offers and updates', enabled: true, required: false },
  { id: 'transactional', name: 'Transactional Messages', description: 'Order confirmations, receipts', enabled: true, required: true },
  { id: 'service', name: 'Service Updates', description: 'Product updates, maintenance notices', enabled: true, required: false },
  { id: 'newsletter', name: 'Newsletter', description: 'Weekly/monthly newsletters', enabled: true, required: false },
  { id: 'research', name: 'Research & Surveys', description: 'Feedback and survey requests', enabled: false, required: false },
];

const getActionBadge = (action) => {
  switch (action) {
    case 'opted_in':
      return <Badge className="bg-green-100 text-green-700">Opted In</Badge>;
    case 'opted_out':
      return <Badge className="bg-red-100 text-red-700">Opted Out</Badge>;
    case 'updated':
      return <Badge className="bg-blue-100 text-blue-700">Updated</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
    default:
      return <Badge variant="outline">{action}</Badge>;
  }
};

const getChannelIcon = (channel) => {
  switch (channel) {
    case 'whatsapp':
      return <MessageSquare className="h-4 w-4 text-green-600" />;
    case 'sms':
      return <Smartphone className="h-4 w-4 text-blue-600" />;
    case 'email':
      return <Mail className="h-4 w-4 text-purple-600" />;
    case 'voice':
      return <Phone className="h-4 w-4 text-orange-600" />;
    case 'all':
      return <Shield className="h-4 w-4 text-gray-600" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
};

const getSourceLabel = (source) => {
  const sources = {
    web_form: 'Web Form',
    sms_reply: 'SMS Reply',
    double_optin: 'Double Opt-in',
    preference_center: 'Preference Center',
    api: 'API',
    import: 'Data Import',
    manual: 'Manual Entry',
  };
  return sources[source] || source;
};

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [showLogDetail, setShowLogDetail] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showRecordConsent, setShowRecordConsent] = useState(false);
  const [purposes, setPurposes] = useState(consentPurposes);

  const handleViewLog = (log) => {
    setSelectedLog(log);
    setShowLogDetail(true);
  };

  const togglePurpose = (purposeId) => {
    setPurposes(purposes.map(p =>
      p.id === purposeId ? { ...p, enabled: !p.enabled } : p
    ));
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Consent Management</h1>
          <p className="text-muted-foreground">
            Track and manage contact consent across all communication channels
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
          <Button size="sm" onClick={() => setShowRecordConsent(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Record Consent
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consentStats.totalContacts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">In your contact database</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consented Contacts</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {consentStats.consentedContacts.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              {consentStats.changeFromLastMonth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opted Out</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {consentStats.optedOut.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {((consentStats.optedOut / consentStats.totalContacts) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consent Rate</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consentStats.consentRate}%</div>
            <div className="mt-2 h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${consentStats.consentRate}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Channel Consent Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Channel Consent Breakdown</CardTitle>
          <CardDescription>Consent status across communication channels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {channelConsent.map((channel) => (
              <div
                key={channel.channel}
                className="rounded-lg border p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`rounded-lg p-2 ${channel.color} bg-opacity-10`}>
                    <channel.icon className={`h-5 w-5 ${channel.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div>
                    <p className="font-medium">{channel.channel}</p>
                    <p className="text-xs text-muted-foreground">
                      {channel.consented.toLocaleString()} / {channel.total.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Consent Rate</span>
                    <span className="font-medium">{channel.rate}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className={`h-2 rounded-full ${channel.color}`}
                      style={{ width: `${channel.rate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="logs">Consent Logs</TabsTrigger>
          <TabsTrigger value="purposes">Consent Purposes</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Generate Report</CardTitle>
                    <CardDescription className="text-sm">
                      Export compliance report for audits
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-100 p-2">
                    <RefreshCw className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Re-consent Campaign</CardTitle>
                    <CardDescription className="text-sm">
                      Request consent renewal from contacts
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-100 p-2">
                    <Building2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Preference Center</CardTitle>
                    <CardDescription className="text-sm">
                      Manage customer preference portal
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Consent Activity</CardTitle>
              <CardDescription>Latest consent changes from contacts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consentLogs.slice(0, 5).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {getChannelIcon(log.channel)}
                      <div>
                        <p className="font-medium">{log.contactName}</p>
                        <p className="text-sm text-muted-foreground">{log.contactPhone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getActionBadge(log.action)}
                      <span className="text-sm text-muted-foreground">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => handleViewLog(log)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4 mt-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, phone, or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={channelFilter} onValueChange={setChannelFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Channels</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="voice">Voice</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="opted_in">Opted In</SelectItem>
                    <SelectItem value="opted_out">Opted Out</SelectItem>
                    <SelectItem value="updated">Updated</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Consent Logs Table */}
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consentLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{log.contactName}</p>
                          <p className="text-sm text-muted-foreground">{log.contactPhone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getChannelIcon(log.channel)}
                          <span className="capitalize">{log.channel}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getActionBadge(log.action)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getSourceLabel(log.source)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">
                            {new Date(log.timestamp).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewLog(log)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <History className="mr-2 h-4 w-4" />
                              View History
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Export Record
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

        <TabsContent value="purposes" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Consent Purposes</CardTitle>
              <CardDescription>
                Define and manage the purposes for which you collect consent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purposes.map((purpose) => (
                  <div
                    key={purpose.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={purpose.enabled}
                        onCheckedChange={() => togglePurpose(purpose.id)}
                        disabled={purpose.required}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{purpose.name}</p>
                          {purpose.required && (
                            <Badge variant="outline" className="text-xs">Required</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{purpose.description}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add Purpose
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Consent Settings</CardTitle>
              <CardDescription>Configure how consent is collected and managed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Double Opt-in</p>
                  <p className="text-sm text-muted-foreground">
                    Require email confirmation for new subscriptions
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Consent Expiry</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically expire consent after a period
                  </p>
                </div>
                <Select defaultValue="never">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="6months">6 Months</SelectItem>
                    <SelectItem value="1year">1 Year</SelectItem>
                    <SelectItem value="2years">2 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto Opt-out Keywords</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically process STOP, UNSUBSCRIBE keywords
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Log IP Addresses</p>
                  <p className="text-sm text-muted-foreground">
                    Record IP addresses with consent for compliance
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Preference Center</p>
                  <p className="text-sm text-muted-foreground">
                    Enable self-service preference management portal
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Compliance Notifications</CardTitle>
              <CardDescription>Get notified about important consent events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mass Opt-out Alert</p>
                  <p className="text-sm text-muted-foreground">
                    Alert when opt-out rate exceeds threshold
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Consent Expiry Reminder</p>
                  <p className="text-sm text-muted-foreground">
                    Remind before consent expires
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Summary Report</p>
                  <p className="text-sm text-muted-foreground">
                    Send weekly consent summary report
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Log Detail Dialog */}
      <Dialog open={showLogDetail} onOpenChange={setShowLogDetail}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Consent Record Details</DialogTitle>
            <DialogDescription>
              Full details of the consent action
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Contact Name</Label>
                  <p className="font-medium">{selectedLog.contactName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium">{selectedLog.contactPhone}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedLog.contactEmail}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Channel</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {getChannelIcon(selectedLog.channel)}
                    <span className="capitalize">{selectedLog.channel}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Action</Label>
                  <div className="mt-1">{getActionBadge(selectedLog.action)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Source</Label>
                  <p className="font-medium">{getSourceLabel(selectedLog.source)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Timestamp</Label>
                  <p className="font-medium">
                    {new Date(selectedLog.timestamp).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">IP Address</Label>
                  <p className="font-medium">{selectedLog.ipAddress || 'N/A'}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Consent Text</Label>
                <p className="mt-1 p-3 rounded-lg bg-muted text-sm">
                  {selectedLog.consentText}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogDetail(false)}>
              Close
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Consent Dialog */}
      <Dialog open={showRecordConsent} onOpenChange={setShowRecordConsent}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Record Consent</DialogTitle>
            <DialogDescription>
              Manually record consent for a contact
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Contact Name</Label>
                <Input id="contact-name" placeholder="Enter name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Phone Number</Label>
                <Input id="contact-phone" placeholder="+91 98765 43210" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email Address</Label>
              <Input id="contact-email" type="email" placeholder="email@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Consent Channels</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="ch-whatsapp" />
                  <label htmlFor="ch-whatsapp" className="text-sm">WhatsApp</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="ch-sms" />
                  <label htmlFor="ch-sms" className="text-sm">SMS</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="ch-email" />
                  <label htmlFor="ch-email" className="text-sm">Email</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="ch-voice" />
                  <label htmlFor="ch-voice" className="text-sm">Voice</label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="consent-source">Source</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web_form">Web Form</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="in_person">In Person</SelectItem>
                  <SelectItem value="written">Written Consent</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="consent-text">Consent Text / Notes</Label>
              <Textarea
                id="consent-text"
                placeholder="Enter the consent text or additional notes..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRecordConsent(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowRecordConsent(false)}>
              Record Consent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
