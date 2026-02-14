'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Eye,
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Smartphone,
  MoreVertical,
  Upload,
  Shield,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const channelConfig = {
  whatsapp: {
    icon: WhatsAppIcon,
    label: 'WhatsApp',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  sms: { icon: Smartphone, label: 'SMS', color: 'text-purple-600', bg: 'bg-purple-50' },
  email: { icon: Mail, label: 'Email', color: 'text-blue-600', bg: 'bg-blue-50' },
};

const categoryColors = {
  marketing: 'bg-pink-50 text-pink-700',
  utility: 'bg-blue-50 text-blue-700',
  authentication: 'bg-green-50 text-green-700',
  transactional: 'bg-purple-50 text-purple-700',
  promotional: 'bg-orange-50 text-orange-700',
  support: 'bg-cyan-50 text-cyan-700',
};

const templates = [
  {
    id: '1',
    name: 'Welcome Message',
    channel: 'whatsapp',
    category: 'utility',
    status: 'approved',
    content:
      'Hello {{1}}! Welcome to {{2}}. We are excited to have you. Reply HELP for assistance.',
    variables: ['customer_name', 'company_name'],
    usageCount: 1234,
    lastUsed: '2 hours ago',
    createdBy: 'John Doe',
    createdAt: '2024-01-10',
    approvedAt: '2024-01-11',
    version: 3,
  },
  {
    id: '2',
    name: 'OTP Verification',
    channel: 'whatsapp',
    category: 'authentication',
    status: 'approved',
    content: 'Your verification code is {{1}}. Valid for {{2}} minutes. Do not share this code.',
    variables: ['otp_code', 'validity_minutes'],
    usageCount: 8567,
    lastUsed: '5 min ago',
    createdBy: 'System',
    createdAt: '2024-01-05',
    approvedAt: '2024-01-05',
    version: 1,
  },
  {
    id: '3',
    name: 'Order Shipped',
    channel: 'sms',
    category: 'transactional',
    status: 'approved',
    content: 'Hi {#var#}, your order #{#var#} has been shipped! Track at {#var#}. -ACME',
    variables: ['customer_name', 'order_id', 'tracking_url'],
    dltTemplateId: '1207165432109876',
    usageCount: 3421,
    lastUsed: '1 hour ago',
    createdBy: 'Sarah Smith',
    createdAt: '2024-01-15',
    approvedAt: '2024-01-16',
    version: 2,
  },
  {
    id: '4',
    name: 'Payment Reminder',
    channel: 'sms',
    category: 'transactional',
    status: 'approved',
    content:
      'Dear {#var#}, payment of Rs.{#var#} for invoice {#var#} is due on {#var#}. Pay: {#var#}',
    variables: ['name', 'amount', 'invoice_id', 'due_date', 'payment_link'],
    dltTemplateId: '1207165432109877',
    usageCount: 1567,
    lastUsed: '3 hours ago',
    createdBy: 'Mike Wilson',
    createdAt: '2024-01-18',
    approvedAt: '2024-01-19',
    version: 1,
  },
  {
    id: '5',
    name: 'Weekly Newsletter',
    channel: 'email',
    category: 'marketing',
    status: 'approved',
    subject: 'This Week at {{company_name}} - {{date}}',
    content: '<h1>Hello {{first_name}},</h1><p>Here are the highlights from this week...</p>',
    variables: ['company_name', 'date', 'first_name'],
    usageCount: 2345,
    lastUsed: '1 day ago',
    createdBy: 'Emily Davis',
    createdAt: '2024-01-20',
    approvedAt: '2024-01-20',
    version: 5,
  },
  {
    id: '6',
    name: 'Holiday Sale',
    channel: 'whatsapp',
    category: 'marketing',
    status: 'pending',
    content: 'Big Holiday Sale! Get {{1}}% off on all products. Use code {{2}}. Shop now: {{3}}',
    variables: ['discount_percent', 'promo_code', 'shop_url'],
    usageCount: 0,
    lastUsed: 'Never',
    createdBy: 'John Doe',
    createdAt: '2024-02-01',
    version: 1,
  },
  {
    id: '7',
    name: 'Appointment Confirmation',
    channel: 'email',
    category: 'utility',
    status: 'rejected',
    rejectionReason: 'Missing unsubscribe link',
    subject: 'Your Appointment is Confirmed',
    content: '<p>Dear {{name}}, your appointment on {{date}} at {{time}} is confirmed.</p>',
    variables: ['name', 'date', 'time'],
    usageCount: 0,
    lastUsed: 'Never',
    createdBy: 'Sarah Smith',
    createdAt: '2024-01-28',
    version: 1,
  },
];

function StatusBadge({ status }) {
  const config = {
    approved: {
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-50',
      label: 'Approved',
    },
    pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Pending' },
    rejected: { icon: X, color: 'text-red-600', bg: 'bg-red-50', label: 'Rejected' },
    draft: { icon: FileText, color: 'text-gray-600', bg: 'bg-gray-50', label: 'Draft' },
  };

  const { icon: Icon, color, bg, label } = config[status] || config.draft;

  return (
    <span className={cn('flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg', bg, color)}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

function TemplateCard({ template, onEdit, onDelete, onDuplicate, onPreview }) {
  const channelCfg = channelConfig[template.channel];
  const ChannelIcon = channelCfg?.icon || FileText;

  return (
    <motion.div whileHover={{ y: -2 }} className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={cn(
              'h-11 w-11 rounded-xl flex items-center justify-center shrink-0',
              channelCfg?.bg
            )}
          >
            <ChannelIcon className={cn('h-5 w-5', channelCfg?.color)} />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{template.name}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
              <span>{channelCfg?.label}</span>
              <span className="text-gray-300">•</span>
              <span>v{template.version}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={template.status} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onPreview(template)}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(template)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(template)}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={() => onDelete(template.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Category & DLT */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className={cn(
            'text-xs px-2.5 py-1 rounded-lg capitalize font-medium',
            categoryColors[template.category]
          )}
        >
          {template.category}
        </span>
        {template.dltTemplateId && (
          <span className="text-xs px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 flex items-center gap-1 font-medium">
            <Shield className="h-3 w-3" /> DLT
          </span>
        )}
      </div>

      {/* Content Preview */}
      <div className="p-3.5 rounded-xl bg-gray-50 mb-4">
        {template.subject && (
          <p className="text-xs font-medium mb-1.5 text-gray-500">Subject: {template.subject}</p>
        )}
        <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
          {template.content.replace(/<[^>]*>/g, '')}
        </p>
      </div>

      {/* Variables */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {template.variables.slice(0, 4).map((v, i) => (
          <span
            key={i}
            className="text-[11px] px-2 py-1 rounded-lg bg-primary/5 text-primary font-mono"
          >
            {v}
          </span>
        ))}
        {template.variables.length > 4 && (
          <span className="text-[11px] px-2 py-1 rounded-lg bg-gray-100 text-gray-500">
            +{template.variables.length - 4} more
          </span>
        )}
      </div>

      {/* Rejection Reason */}
      {template.status === 'rejected' && template.rejectionReason && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm mb-4 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{template.rejectionReason}</span>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" />
            {template.usageCount.toLocaleString()} uses
          </span>
          <span className="text-gray-300">•</span>
          <span>Last: {template.lastUsed}</span>
        </div>
      </div>
    </motion.div>
  );
}

function CreateTemplateModal({ isOpen, onClose, onCreate }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    channel: 'whatsapp',
    name: '',
    category: 'utility',
    subject: '',
    content: '',
    dltTemplateId: '',
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Create Template</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-lg">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {step === 1 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-gray-700">Select Channel</Label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(channelConfig).map(([key, cfg]) => {
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setFormData({ ...formData, channel: key })}
                      className={cn(
                        'p-4 rounded-xl flex flex-col items-center gap-2 transition-all',
                        formData.channel === key
                          ? 'bg-primary/5 ring-2 ring-indigo-500'
                          : 'bg-gray-50 hover:bg-gray-100'
                      )}
                    >
                      <Icon className={cn('h-8 w-8', cfg.color)} />
                      <span className="font-medium text-gray-900">{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700">Template Name</Label>
                <Input
                  placeholder="e.g., Order Confirmation"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-11 rounded-xl bg-gray-50 border-0"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700">Category</Label>
                <select
                  className="w-full h-11 rounded-xl bg-gray-50 border-0 px-3 text-sm"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="utility">Utility</option>
                  <option value="authentication">Authentication</option>
                  <option value="marketing">Marketing</option>
                  <option value="transactional">Transactional</option>
                  <option value="promotional">Promotional</option>
                  <option value="support">Support</option>
                </select>
              </div>
            </div>

            {formData.channel === 'sms' && (
              <div className="space-y-2">
                <Label className="text-gray-700">DLT Template ID (Required for India)</Label>
                <Input
                  placeholder="1207165432109876"
                  value={formData.dltTemplateId}
                  onChange={(e) => setFormData({ ...formData, dltTemplateId: e.target.value })}
                  className="h-11 rounded-xl bg-gray-50 border-0"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose} className="rounded-xl">
                Cancel
              </Button>
              <Button onClick={() => setStep(2)} disabled={!formData.name} className="rounded-xl">
                Next: Content
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            {formData.channel === 'email' && (
              <div className="space-y-2">
                <Label className="text-gray-700">Email Subject</Label>
                <Input
                  placeholder="e.g., Your Order #{{order_id}} has shipped"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="h-11 rounded-xl bg-gray-50 border-0"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-gray-700">Template Content</Label>
              <Textarea
                placeholder={
                  formData.channel === 'whatsapp'
                    ? 'Hello {{1}}! Your order {{2}} is confirmed.'
                    : formData.channel === 'sms'
                      ? 'Hi {#var#}, your OTP is {#var#}. -ACME'
                      : '<h1>Hello {{name}}</h1><p>Your content here...</p>'
                }
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={8}
                className="font-mono text-sm rounded-xl bg-gray-50 border-0"
              />
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {formData.channel === 'whatsapp' && 'Use {{1}}, {{2}} for variables'}
                  {formData.channel === 'sms' && 'Use {#var#} for variables (DLT format)'}
                  {formData.channel === 'email' && 'Use {{variable_name}} for variables'}
                </span>
                <span>{formData.content.length} characters</span>
              </div>
            </div>

            {formData.channel === 'whatsapp' && formData.category === 'marketing' && (
              <div className="p-4 rounded-xl bg-amber-50 text-amber-700 text-sm">
                <p className="font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> Marketing Template
                </p>
                <p className="text-xs mt-1 text-amber-600">
                  Marketing templates require Meta approval and may take 24-48 hours. Ensure you
                  have user opt-in before sending.
                </p>
              </div>
            )}

            <div className="flex justify-between gap-2 pt-4">
              <Button variant="outline" onClick={() => setStep(1)} className="rounded-xl">
                Back
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    onCreate({ ...formData, status: 'draft' });
                    onClose();
                  }}
                  className="rounded-xl"
                >
                  Save as Draft
                </Button>
                <Button
                  onClick={() => {
                    onCreate({ ...formData, status: 'pending' });
                    onClose();
                  }}
                  className="rounded-xl"
                >
                  Submit for Review
                </Button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function TemplateGovernancePage() {
  const [templatesList, setTemplatesList] = useState(templates);
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const filteredTemplates = templatesList.filter((t) => {
    if (channelFilter !== 'all' && t.channel !== channelFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        t.name.toLowerCase().includes(query) ||
        t.content.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const stats = {
    total: templatesList.length,
    approved: templatesList.filter((t) => t.status === 'approved').length,
    pending: templatesList.filter((t) => t.status === 'pending').length,
    rejected: templatesList.filter((t) => t.status === 'rejected').length,
  };

  return (
    <UnifiedLayout hubId="settings" pageTitle="Message Templates" fixedMenu={null}>
      <motion.div
        className="flex-1 p-6 space-y-6 overflow-auto"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header with Stats */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center">
                <FileText className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Template Governance</h1>
                <p className="text-sm text-gray-500">
                  Manage message templates across all channels
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-xl">
                <Upload className="h-4 w-4 mr-2" /> Import
              </Button>
              <Button onClick={() => setShowCreateModal(true)} className="rounded-xl">
                <Plus className="h-4 w-4 mr-2" /> Create Template
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-6 flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500">Total Templates</p>
              </div>
            </div>
            <div className="h-10 w-px bg-gray-100" />
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                <p className="text-xs text-gray-500">Approved</p>
              </div>
            </div>
            <div className="h-10 w-px bg-gray-100" />
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>
            <div className="h-10 w-px bg-gray-100" />
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center">
                <X className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                <p className="text-xs text-gray-500">Rejected</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                className="pl-10 h-10 rounded-xl bg-gray-50 border-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 whitespace-nowrap">Channel:</span>
                <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                  <Button
                    variant={channelFilter === 'all' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setChannelFilter('all')}
                    className="rounded-lg"
                  >
                    All
                  </Button>
                  {Object.entries(channelConfig).map(([key, cfg]) => {
                    const Icon = cfg.icon;
                    return (
                      <Button
                        key={key}
                        variant={channelFilter === key ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setChannelFilter(key)}
                        className={cn('rounded-lg', channelFilter !== key && cfg.color)}
                      >
                        <Icon className="h-4 w-4" />
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 whitespace-nowrap">Status:</span>
                <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                  {['all', 'approved', 'pending', 'rejected'].map((status) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setStatusFilter(status)}
                      className="capitalize rounded-lg"
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Templates Grid */}
        <motion.div variants={itemVariants}>
          {filteredTemplates.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm">
              <div className="text-center py-16">
                <div className="h-16 w-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-900">No templates found</p>
                <p className="text-sm text-gray-500 mb-4">
                  Create your first template to get started
                </p>
                <Button onClick={() => setShowCreateModal(true)} className="rounded-xl">
                  <Plus className="h-4 w-4 mr-2" /> Create Template
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AnimatePresence>
                {filteredTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <TemplateCard
                      template={template}
                      onEdit={() => console.log('Edit:', template.id)}
                      onDelete={(id) => setTemplatesList((prev) => prev.filter((t) => t.id !== id))}
                      onDuplicate={() => console.log('Duplicate:', template.id)}
                      onPreview={setPreviewTemplate}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Create Modal */}
        <CreateTemplateModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={(data) => {
            setTemplatesList((prev) => [
              ...prev,
              {
                id: `${Date.now()}`,
                ...data,
                variables: data.content.match(/\{\{[^}]+\}\}|\{#var#\}/g) || [],
                usageCount: 0,
                lastUsed: 'Never',
                createdBy: 'You',
                createdAt: new Date().toISOString().split('T')[0],
                version: 1,
              },
            ]);
          }}
        />

        {/* Preview Modal */}
        {previewTemplate && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setPreviewTemplate(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Template Preview</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewTemplate(null)}
                  className="h-8 w-8 p-0 rounded-lg"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <StatusBadge status={previewTemplate.status} />
                  <span
                    className={cn(
                      'text-xs px-2.5 py-1 rounded-lg capitalize',
                      categoryColors[previewTemplate.category]
                    )}
                  >
                    {previewTemplate.category}
                  </span>
                </div>
                {previewTemplate.subject && (
                  <div>
                    <p className="text-sm text-gray-500">Subject</p>
                    <p className="font-medium text-gray-900">{previewTemplate.subject}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 mb-2">Content</p>
                  <div className="p-4 rounded-xl bg-gray-50 font-mono text-sm whitespace-pre-wrap text-gray-700">
                    {previewTemplate.content.replace(/<[^>]*>/g, '')}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Variables</p>
                  <div className="flex flex-wrap gap-2">
                    {previewTemplate.variables.map((v, i) => (
                      <span
                        key={i}
                        className="text-sm px-3 py-1 rounded-lg bg-primary/5 text-primary font-mono"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-gray-500 pt-4 border-t border-gray-100">
                  <p>
                    Created by {previewTemplate.createdBy} on {previewTemplate.createdAt}
                  </p>
                  <p>
                    Used {previewTemplate.usageCount.toLocaleString()} times • Version{' '}
                    {previewTemplate.version}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </UnifiedLayout>
  );
}
