'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserX,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  Trash2,
  MoreHorizontal,
  Phone,
  Mail,
  MessageSquare,
  Smartphone,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  History,
  RefreshCw,
  Eye,
  Edit,
  XCircle,
  ChevronDown,
  ArrowUpRight,
  Building2,
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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

// Mock opt-out statistics
const optOutStats = {
  totalOptOuts: 3200,
  phoneOptOuts: 1850,
  emailOptOuts: 1120,
  globalOptOuts: 230,
  lastWeekOptOuts: 45,
  changePercent: -12.5,
};

// Mock opt-out entries
const optOutEntries = [
  {
    id: 'opt_001',
    identifier: '+91 98765 43210',
    type: 'phone',
    channels: ['sms', 'whatsapp', 'voice'],
    reason: 'User requested via SMS STOP',
    source: 'sms_reply',
    createdAt: '2024-01-15T10:30:00Z',
    contactName: 'Rajesh Kumar',
    status: 'active',
  },
  {
    id: 'opt_002',
    identifier: 'priya.sharma@email.com',
    type: 'email',
    channels: ['email'],
    reason: 'Unsubscribe link clicked',
    source: 'unsubscribe_link',
    createdAt: '2024-01-15T09:45:00Z',
    contactName: 'Priya Sharma',
    status: 'active',
  },
  {
    id: 'opt_003',
    identifier: '+91 98765 43212',
    type: 'phone',
    channels: ['sms'],
    reason: 'Marked as spam by carrier',
    source: 'carrier_feedback',
    createdAt: '2024-01-14T16:20:00Z',
    contactName: 'Amit Patel',
    status: 'active',
  },
  {
    id: 'opt_004',
    identifier: 'sneha.reddy@company.com',
    type: 'email',
    channels: ['email'],
    reason: 'Hard bounce - invalid email',
    source: 'bounce',
    createdAt: '2024-01-14T14:10:00Z',
    contactName: 'Sneha Reddy',
    status: 'active',
  },
  {
    id: 'opt_005',
    identifier: '+91 98765 43214',
    type: 'phone',
    channels: ['whatsapp'],
    reason: 'WhatsApp blocked',
    source: 'whatsapp_block',
    createdAt: '2024-01-13T11:30:00Z',
    contactName: 'Vikram Singh',
    status: 'active',
  },
  {
    id: 'opt_006',
    identifier: '+91 98765 43215',
    type: 'phone',
    channels: ['sms', 'voice'],
    reason: 'DND registered number',
    source: 'dnd_registry',
    createdAt: '2024-01-12T09:00:00Z',
    contactName: 'Meera Kapoor',
    status: 'active',
  },
];

// Mock suppression lists
const suppressionLists = [
  {
    id: 'list_001',
    name: 'Global Do-Not-Contact',
    description: 'Master suppression list for all channels',
    count: 230,
    channels: ['all'],
    lastUpdated: '2024-01-15T10:00:00Z',
    autoSync: true,
  },
  {
    id: 'list_002',
    name: 'SMS Opt-outs',
    description: 'Contacts who opted out of SMS',
    count: 1450,
    channels: ['sms'],
    lastUpdated: '2024-01-15T09:30:00Z',
    autoSync: true,
  },
  {
    id: 'list_003',
    name: 'Email Unsubscribes',
    description: 'Contacts who unsubscribed from email',
    count: 1120,
    channels: ['email'],
    lastUpdated: '2024-01-15T08:45:00Z',
    autoSync: true,
  },
  {
    id: 'list_004',
    name: 'WhatsApp Blocks',
    description: 'Contacts who blocked on WhatsApp',
    count: 320,
    channels: ['whatsapp'],
    lastUpdated: '2024-01-14T16:00:00Z',
    autoSync: true,
  },
  {
    id: 'list_005',
    name: 'DND Registry',
    description: 'India TRAI DND registered numbers',
    count: 580,
    channels: ['sms', 'voice'],
    lastUpdated: '2024-01-10T00:00:00Z',
    autoSync: false,
  },
];

const getTypeIcon = (type) => {
  switch (type) {
    case 'phone':
      return <Phone className="h-4 w-4 text-blue-600" />;
    case 'email':
      return <Mail className="h-4 w-4 text-purple-600" />;
    default:
      return <UserX className="h-4 w-4" />;
  }
};

const getChannelBadge = (channel) => {
  const colors = {
    sms: 'bg-blue-100 text-blue-700',
    whatsapp: 'bg-green-100 text-green-700',
    email: 'bg-purple-100 text-purple-700',
    voice: 'bg-orange-100 text-orange-700',
    all: 'bg-gray-100 text-gray-700',
  };
  return (
    <Badge className={colors[channel] || colors.all} variant="outline">
      {channel.toUpperCase()}
    </Badge>
  );
};

const getSourceLabel = (source) => {
  const sources = {
    sms_reply: 'SMS Reply (STOP)',
    unsubscribe_link: 'Unsubscribe Link',
    carrier_feedback: 'Carrier Feedback',
    bounce: 'Email Bounce',
    whatsapp_block: 'WhatsApp Block',
    dnd_registry: 'DND Registry',
    manual: 'Manual Entry',
    api: 'API Import',
    complaint: 'Spam Complaint',
  };
  return sources[source] || source;
};

export default function OptOutsPage() {
  const [activeTab, setActiveTab] = useState('entries');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showCreateList, setShowCreateList] = useState(false);

  const handleDelete = (entry) => {
    setSelectedEntry(entry);
    setShowDeleteConfirm(true);
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Opt-out Lists</h1>
          <p className="text-muted-foreground">
            Manage do-not-contact lists and suppression entries
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setShowImport(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={() => setShowAddEntry(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Entry
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Opt-outs</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{optOutStats.totalOptOuts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all channels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phone Opt-outs</CardTitle>
            <Phone className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{optOutStats.phoneOptOuts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">SMS, WhatsApp, Voice</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Opt-outs</CardTitle>
            <Mail className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{optOutStats.emailOptOuts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Unsubscribes & bounces</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{optOutStats.lastWeekOptOuts}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="mr-1 h-3 w-3 rotate-180" />
              {Math.abs(optOutStats.changePercent)}% less than last week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="entries">Opt-out Entries</TabsTrigger>
          <TabsTrigger value="lists">Suppression Lists</TabsTrigger>
          <TabsTrigger value="dnd">DND Registry</TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="space-y-4 mt-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by phone, email, or name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={channelFilter} onValueChange={setChannelFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Channels</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="voice">Voice</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Entries Table */}
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30px]">
                      <Checkbox />
                    </TableHead>
                    <TableHead>Identifier</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Channels</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {optOutEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(entry.type)}
                          <span className="font-medium">{entry.identifier}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">{entry.contactName}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {entry.channels.map((ch) => (
                            <Badge key={ch} variant="outline" className="text-xs">
                              {ch}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{entry.reason}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getSourceLabel(entry.source)}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </span>
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
                              <History className="mr-2 h-4 w-4" />
                              View History
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(entry)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove from List
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

        <TabsContent value="lists" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowCreateList(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create List
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {suppressionLists.map((list) => (
              <Card key={list.id} className="hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{list.name}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {list.description}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Entries
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit List
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Sync Now
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Entries</span>
                      <span className="font-medium">{list.count.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Channels</span>
                      <div className="flex gap-1">
                        {list.channels.map((ch) => (
                          <Badge key={ch} variant="outline" className="text-xs">
                            {ch}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Auto-sync</span>
                      {list.autoSync ? (
                        <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                      ) : (
                        <Badge variant="outline">Disabled</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-muted-foreground">Last updated</span>
                      <span className="text-xs">
                        {new Date(list.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dnd" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-orange-100 p-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <CardTitle>DND Registry (India)</CardTitle>
                  <CardDescription>
                    TRAI Do Not Disturb Registry integration for India
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Registered Numbers</p>
                  <p className="text-2xl font-bold">580</p>
                  <p className="text-xs text-muted-foreground mt-1">In your contact database</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Last Sync</p>
                  <p className="text-2xl font-bold">Jan 10</p>
                  <p className="text-xs text-muted-foreground mt-1">5 days ago</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Sync Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Up to date</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4 bg-muted/50">
                <h4 className="font-medium mb-2">About DND Registry</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  The TRAI DND Registry contains phone numbers registered to not receive unsolicited
                  commercial communications. Messages to these numbers may result in penalties.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync Now
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    View Documentation
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">DND Categories</h4>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">Fully Blocked</p>
                      <p className="text-sm text-muted-foreground">No commercial communications</p>
                    </div>
                    <Badge>245 numbers</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">Partially Blocked</p>
                      <p className="text-sm text-muted-foreground">Some categories allowed</p>
                    </div>
                    <Badge>335 numbers</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">Banking/Financial</p>
                      <p className="text-sm text-muted-foreground">Blocked for finance messages</p>
                    </div>
                    <Badge variant="outline">120 numbers</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">Real Estate</p>
                      <p className="text-sm text-muted-foreground">Blocked for property messages</p>
                    </div>
                    <Badge variant="outline">98 numbers</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Entry Dialog */}
      <Dialog open={showAddEntry} onOpenChange={setShowAddEntry}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Opt-out Entry</DialogTitle>
            <DialogDescription>
              Manually add a contact to the opt-out list
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Identifier Type</Label>
              <Select defaultValue="phone">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">Phone Number</SelectItem>
                  <SelectItem value="email">Email Address</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="identifier">Phone Number / Email</Label>
              <Input id="identifier" placeholder="Enter phone or email" />
            </div>
            <div className="space-y-2">
              <Label>Opt-out Channels</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="opt-sms" defaultChecked />
                  <label htmlFor="opt-sms" className="text-sm">SMS</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="opt-whatsapp" />
                  <label htmlFor="opt-whatsapp" className="text-sm">WhatsApp</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="opt-email" />
                  <label htmlFor="opt-email" className="text-sm">Email</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="opt-voice" />
                  <label htmlFor="opt-voice" className="text-sm">Voice</label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for opt-out..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddEntry(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAddEntry(false)}>
              Add Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={showImport} onOpenChange={setShowImport}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import Opt-out List</DialogTitle>
            <DialogDescription>
              Upload a CSV file with opt-out entries
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">Drop your file here or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports CSV files up to 10MB
              </p>
              <Button variant="outline" size="sm" className="mt-4">
                Select File
              </Button>
            </div>
            <div className="rounded-lg border p-3 bg-muted/50">
              <p className="text-sm font-medium mb-2">Required columns:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• <code>identifier</code> - Phone number or email</li>
                <li>• <code>type</code> - "phone" or "email"</li>
                <li>• <code>channels</code> - Comma-separated (sms,whatsapp,email,voice)</li>
                <li>• <code>reason</code> - Optional reason for opt-out</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImport(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowImport(false)}>
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create List Dialog */}
      <Dialog open={showCreateList} onOpenChange={setShowCreateList}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Suppression List</DialogTitle>
            <DialogDescription>
              Create a new suppression list for organizing opt-outs
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="list-name">List Name</Label>
              <Input id="list-name" placeholder="e.g., Marketing Opt-outs" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="list-description">Description</Label>
              <Textarea
                id="list-description"
                placeholder="Describe the purpose of this list..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Channels</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="list-sms" />
                  <label htmlFor="list-sms" className="text-sm">SMS</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="list-whatsapp" />
                  <label htmlFor="list-whatsapp" className="text-sm">WhatsApp</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="list-email" />
                  <label htmlFor="list-email" className="text-sm">Email</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="list-voice" />
                  <label htmlFor="list-voice" className="text-sm">Voice</label>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="auto-sync" defaultChecked />
              <label htmlFor="auto-sync" className="text-sm">
                Enable auto-sync (automatically add new opt-outs)
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateList(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowCreateList(false)}>
              Create List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Opt-out List?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the entry from the opt-out list. The contact will be able to
              receive communications again. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
