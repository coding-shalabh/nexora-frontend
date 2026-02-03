'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ScrollText,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Key,
  MessageSquare,
  Users,
  Trash2,
  Edit,
  Plus,
  Eye,
  LogIn,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Zap,
  Settings,
  Activity,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

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

// Mock audit logs
const auditLogs = [
  {
    id: 'audit_001',
    timestamp: '2024-01-15T14:32:15Z',
    actor: { id: 'user_1', name: 'Rajesh Kumar', email: 'rajesh@company.com', role: 'admin' },
    action: 'user.login',
    category: 'authentication',
    resource: 'session',
    resourceId: 'sess_abc123',
    status: 'success',
    ipAddress: '103.21.45.67',
    userAgent: 'Chrome/120.0 (Windows 10)',
    details: { method: '2fa', location: 'Mumbai, India' },
  },
  {
    id: 'audit_002',
    timestamp: '2024-01-15T14:28:00Z',
    actor: { id: 'user_2', name: 'Priya Sharma', email: 'priya@company.com', role: 'manager' },
    action: 'channel.create',
    category: 'channels',
    resource: 'whatsapp_account',
    resourceId: 'ch_wa_123',
    status: 'success',
    ipAddress: '103.21.45.89',
    userAgent: 'Firefox/121.0 (macOS)',
    details: { channelType: 'whatsapp', name: 'Support Line' },
  },
  {
    id: 'audit_003',
    timestamp: '2024-01-15T14:15:30Z',
    actor: { id: 'user_1', name: 'Rajesh Kumar', email: 'rajesh@company.com', role: 'admin' },
    action: 'user.invite',
    category: 'users',
    resource: 'invitation',
    resourceId: 'inv_xyz789',
    status: 'success',
    ipAddress: '103.21.45.67',
    userAgent: 'Chrome/120.0 (Windows 10)',
    details: { invitedEmail: 'newuser@company.com', role: 'agent' },
  },
  {
    id: 'audit_004',
    timestamp: '2024-01-15T13:45:00Z',
    actor: { id: 'user_3', name: 'Unknown', email: 'unknown@attacker.com', role: null },
    action: 'user.login',
    category: 'authentication',
    resource: 'session',
    resourceId: null,
    status: 'failed',
    ipAddress: '45.33.32.156',
    userAgent: 'curl/7.68.0',
    details: { reason: 'invalid_credentials', attempts: 3 },
  },
  {
    id: 'audit_005',
    timestamp: '2024-01-15T13:30:20Z',
    actor: { id: 'user_2', name: 'Priya Sharma', email: 'priya@company.com', role: 'manager' },
    action: 'template.update',
    category: 'templates',
    resource: 'message_template',
    resourceId: 'tmpl_order_confirm',
    status: 'success',
    ipAddress: '103.21.45.89',
    userAgent: 'Firefox/121.0 (macOS)',
    details: { field: 'content', previousVersion: 'v2', newVersion: 'v3' },
  },
  {
    id: 'audit_006',
    timestamp: '2024-01-15T12:45:10Z',
    actor: { id: 'user_1', name: 'Rajesh Kumar', email: 'rajesh@company.com', role: 'admin' },
    action: 'api_key.create',
    category: 'security',
    resource: 'api_key',
    resourceId: 'key_prod_123',
    status: 'success',
    ipAddress: '103.21.45.67',
    userAgent: 'Chrome/120.0 (Windows 10)',
    details: { name: 'Production API Key', scopes: ['read', 'write'] },
  },
  {
    id: 'audit_007',
    timestamp: '2024-01-15T11:30:00Z',
    actor: { id: 'system', name: 'System', email: null, role: 'system' },
    action: 'webhook.delivery',
    category: 'integrations',
    resource: 'webhook',
    resourceId: 'wh_crm_sync',
    status: 'failed',
    ipAddress: null,
    userAgent: null,
    details: { endpoint: 'https://crm.example.com/webhook', error: 'Connection timeout' },
  },
  {
    id: 'audit_008',
    timestamp: '2024-01-15T10:15:45Z',
    actor: { id: 'user_4', name: 'Amit Patel', email: 'amit@company.com', role: 'agent' },
    action: 'conversation.assign',
    category: 'inbox',
    resource: 'conversation',
    resourceId: 'conv_456',
    status: 'success',
    ipAddress: '103.21.45.91',
    userAgent: 'Chrome/120.0 (Windows 10)',
    details: { assignedTo: 'user_5', previousOwner: 'unassigned' },
  },
];

// Action categories
const actionCategories = [
  { value: 'all', label: 'All Categories' },
  { value: 'authentication', label: 'Authentication' },
  { value: 'users', label: 'User Management' },
  { value: 'channels', label: 'Channels' },
  { value: 'templates', label: 'Templates' },
  { value: 'security', label: 'Security' },
  { value: 'integrations', label: 'Integrations' },
  { value: 'inbox', label: 'Inbox' },
  { value: 'settings', label: 'Settings' },
];

const getActionIcon = (action) => {
  const actionMap = {
    'user.login': LogIn,
    'user.logout': LogOut,
    'user.invite': Users,
    'channel.create': Plus,
    'channel.update': Edit,
    'channel.delete': Trash2,
    'template.create': Plus,
    'template.update': Edit,
    'template.delete': Trash2,
    'api_key.create': Key,
    'api_key.revoke': XCircle,
    'webhook.delivery': Zap,
    'conversation.assign': MessageSquare,
    'settings.update': Settings,
  };
  const Icon = actionMap[action] || ScrollText;
  return Icon;
};

const getStatusStyles = (status) => {
  switch (status) {
    case 'success':
      return { bg: 'bg-green-50', color: 'text-green-700', badgeBg: 'bg-green-50 text-green-700' };
    case 'failed':
      return { bg: 'bg-red-50', color: 'text-red-700', badgeBg: 'bg-red-50 text-red-700' };
    case 'pending':
      return { bg: 'bg-amber-50', color: 'text-amber-700', badgeBg: 'bg-amber-50 text-amber-700' };
    default:
      return { bg: 'bg-gray-50', color: 'text-gray-700', badgeBg: 'bg-gray-100 text-gray-700' };
  }
};

const getCategoryStyles = (category) => {
  const colors = {
    authentication: { bg: 'bg-blue-50', color: 'text-blue-700' },
    users: { bg: 'bg-purple-50', color: 'text-purple-700' },
    channels: { bg: 'bg-green-50', color: 'text-green-700' },
    templates: { bg: 'bg-orange-50', color: 'text-orange-700' },
    security: { bg: 'bg-red-50', color: 'text-red-700' },
    integrations: { bg: 'bg-amber-50', color: 'text-amber-700' },
    inbox: { bg: 'bg-cyan-50', color: 'text-cyan-700' },
    settings: { bg: 'bg-gray-100', color: 'text-gray-700' },
  };
  return colors[category] || { bg: 'bg-gray-100', color: 'text-gray-700' };
};

const formatAction = (action) => {
  return action
    .replace(/\./g, ' → ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7d');
  const [showLogDetail, setShowLogDetail] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const handleViewLog = (log) => {
    setSelectedLog(log);
    setShowLogDetail(true);
  };

  // Filter logs based on search and filters
  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      searchQuery === '' ||
      log.actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
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
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 w-64 pl-10 pr-4 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Filters - Left Column */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
              <Filter className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <p className="text-sm text-gray-500">Narrow down your search</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-white border border-purple-200">
              <Label className="text-xs text-gray-500 mb-2 block">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full h-10 rounded-xl bg-gray-50 border-gray-200">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {actionCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-white border border-purple-200">
                <Label className="text-xs text-gray-500 mb-2 block">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full h-10 rounded-xl bg-gray-50 border-gray-200">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 rounded-xl bg-white border border-purple-200">
                <Label className="text-xs text-gray-500 mb-2 block">Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-full h-10 rounded-xl bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Last 7 days" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">Last 24 hours</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="custom">Custom range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <p className="text-xs text-purple-700 mt-4 flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Showing {filteredLogs.length} of {auditLogs.length} events
          </p>
        </motion.div>

        {/* Quick Stats - Right Column */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-2xl p-6 border border-amber-200/50"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Security Alerts</h3>
              <p className="text-sm text-gray-500">Recent suspicious activity</p>
            </div>
          </div>

          <div className="space-y-2">
            {auditLogs
              .filter((log) => log.status === 'failed')
              .slice(0, 3)
              .map((log, index) => {
                const statusStyles = getStatusStyles(log.status);
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white border border-amber-200 cursor-pointer hover:border-amber-300 transition-colors"
                    onClick={() => handleViewLog(log)}
                  >
                    <div
                      className={cn(
                        'h-9 w-9 rounded-lg flex items-center justify-center shrink-0',
                        statusStyles.bg
                      )}
                    >
                      <XCircle className={cn('h-4 w-4', statusStyles.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {formatAction(log.action)}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{log.actor.name}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </motion.div>
                );
              })}
            {auditLogs.filter((log) => log.status === 'failed').length === 0 && (
              <div className="text-center py-6 bg-white rounded-xl border border-amber-200">
                <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No security alerts</p>
                <p className="text-xs text-gray-400 mt-1">All systems operating normally</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Activity Log */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-6 border border-gray-200"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
              <Activity className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Activity Log</h3>
              <p className="text-sm text-gray-500">
                {filteredLogs.length} event{filteredLogs.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <ScrollText className="h-7 w-7 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">
                {searchQuery ? 'No logs found' : 'No activity yet'}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {searchQuery ? 'Try adjusting your search or filters' : 'Activity will appear here'}
              </p>
            </div>
          ) : (
            filteredLogs.map((log, index) => {
              const ActionIcon = getActionIcon(log.action);
              const statusStyles = getStatusStyles(log.status);
              const categoryStyles = getCategoryStyles(log.category);

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.005 }}
                  onClick={() => handleViewLog(log)}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-xl bg-white border transition-colors cursor-pointer group',
                    log.status === 'failed'
                      ? 'border-red-200 hover:border-red-300'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  {/* Status Icon */}
                  <div
                    className={cn(
                      'h-10 w-10 rounded-xl flex items-center justify-center shrink-0',
                      statusStyles.bg
                    )}
                  >
                    <ActionIcon className={cn('h-5 w-5', statusStyles.color)} />
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 truncate">
                        {formatAction(log.action)}
                      </p>
                      <Badge className={cn('px-2 py-0.5 text-[10px]', statusStyles.badgeBg)}>
                        {log.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1.5">
                        <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center">
                          {log.actor.role === 'system' ? (
                            <Zap className="h-3 w-3 text-gray-500" />
                          ) : (
                            <User className="h-3 w-3 text-gray-500" />
                          )}
                        </div>
                        <span className="text-sm text-gray-600">{log.actor.name}</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">{log.resource}</span>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <Badge
                    className={cn(
                      'px-2.5 py-1 text-xs shrink-0',
                      categoryStyles.bg,
                      categoryStyles.color
                    )}
                  >
                    {log.category}
                  </Badge>

                  {/* IP Address */}
                  <div className="hidden lg:block text-right shrink-0 w-28">
                    <p className="text-xs font-mono text-gray-500">{log.ipAddress || '—'}</p>
                  </div>

                  {/* Timestamp */}
                  <div className="text-right shrink-0 w-24">
                    <p className="text-sm text-gray-900">
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(log.timestamp).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* View Icon */}
                  <Eye className="h-4 w-4 text-gray-300 group-hover:text-gray-500 shrink-0" />
                </motion.div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {filteredLogs.length > 0 && (
          <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Showing 1-{filteredLogs.length} of 15,420 events
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-xl border-gray-200" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl border-gray-200">
                Next
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Log Detail Dialog */}
      <Dialog open={showLogDetail} onOpenChange={setShowLogDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>Full details of the audit event</DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-6">
              {/* Event Summary */}
              <div
                className={cn(
                  'flex items-start justify-between p-4 rounded-xl',
                  getStatusStyles(selectedLog.status).bg
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'h-11 w-11 rounded-xl flex items-center justify-center bg-white shadow-sm'
                    )}
                  >
                    {(() => {
                      const Icon = getActionIcon(selectedLog.action);
                      return (
                        <Icon
                          className={cn('h-5 w-5', getStatusStyles(selectedLog.status).color)}
                        />
                      );
                    })()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {formatAction(selectedLog.action)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedLog.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Badge className={cn('px-3 py-1', getStatusStyles(selectedLog.status).badgeBg)}>
                  {selectedLog.status}
                </Badge>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-gray-50">
                  <Label className="text-xs text-gray-500">Actor</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedLog.actor.name}</p>
                  <p className="text-sm text-gray-500">{selectedLog.actor.email}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50">
                  <Label className="text-xs text-gray-500">Role</Label>
                  <p className="font-medium text-gray-900 mt-1 capitalize">
                    {selectedLog.actor.role || 'Unknown'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50">
                  <Label className="text-xs text-gray-500">Category</Label>
                  <div className="mt-1">
                    <Badge
                      className={cn(
                        'px-2.5 py-1',
                        getCategoryStyles(selectedLog.category).bg,
                        getCategoryStyles(selectedLog.category).color
                      )}
                    >
                      {selectedLog.category}
                    </Badge>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gray-50">
                  <Label className="text-xs text-gray-500">Resource</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedLog.resource}</p>
                  {selectedLog.resourceId && (
                    <p className="text-xs font-mono text-gray-500">{selectedLog.resourceId}</p>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-gray-50">
                  <Label className="text-xs text-gray-500">IP Address</Label>
                  <p className="font-mono text-gray-900 mt-1">{selectedLog.ipAddress || 'N/A'}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50">
                  <Label className="text-xs text-gray-500">User Agent</Label>
                  <p className="text-sm text-gray-900 mt-1 truncate">
                    {selectedLog.userAgent || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Additional Details */}
              {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500">Additional Details</Label>
                  <div className="rounded-xl bg-gray-50 p-4 font-mono text-sm">
                    <pre className="whitespace-pre-wrap text-gray-700">
                      {JSON.stringify(selectedLog.details, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Event ID */}
              <div className="flex items-center justify-between text-sm p-3 rounded-xl bg-gray-50">
                <span className="text-gray-500">Event ID</span>
                <span className="font-mono text-gray-900">{selectedLog.id}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogDetail(false)}
              className="rounded-xl"
            >
              Close
            </Button>
            <Button className="rounded-xl">
              <Download className="mr-2 h-4 w-4" />
              Export Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
