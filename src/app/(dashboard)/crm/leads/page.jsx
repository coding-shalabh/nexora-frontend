'use client';

import { useState, useMemo, useDeferredValue, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Mail,
  Phone,
  Building2,
  Upload,
  Loader2,
  AlertCircle,
  RefreshCw,
  Edit,
  Trash2,
  X,
  User,
  Target,
  ArrowUpDown,
  ChevronRight,
  Star,
  TrendingUp,
  UserPlus,
  CheckSquare,
  Square,
  MinusSquare,
  FileDown,
  Users,
  Briefcase,
  Linkedin,
  Twitter,
  MapPin,
  Zap,
  Award,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  useLeads,
  useCreateLead,
  useUpdateLead,
  useDeleteLead,
  useConvertLead,
  useQualifyLead,
} from '@/hooks/use-leads';
import { useCompanies } from '@/hooks/use-companies';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import {
  UnifiedLayout,
  createStat,
  createAction,
} from '@/components/layout/unified/unified-layout';

// Lead status options
const LEAD_STATUSES = [
  { value: 'NEW', label: 'New', color: 'bg-blue-100 text-blue-700' },
  { value: 'CONTACTED', label: 'Contacted', color: 'bg-cyan-100 text-cyan-700' },
  { value: 'QUALIFIED', label: 'Qualified', color: 'bg-green-100 text-green-700' },
  { value: 'PROPOSAL', label: 'Proposal', color: 'bg-purple-100 text-purple-700' },
  { value: 'NEGOTIATION', label: 'Negotiation', color: 'bg-amber-100 text-amber-700' },
  { value: 'CONVERTED', label: 'Converted', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'LOST', label: 'Lost', color: 'bg-red-100 text-red-700' },
];

// Lead sources
const LEAD_SOURCES = [
  { value: 'WEBSITE', label: 'Website' },
  { value: 'REFERRAL', label: 'Referral' },
  { value: 'SOCIAL_MEDIA', label: 'Social Media' },
  { value: 'LINKEDIN', label: 'LinkedIn' },
  { value: 'COLD_CALL', label: 'Cold Call' },
  { value: 'EMAIL_CAMPAIGN', label: 'Email Campaign' },
  { value: 'ADVERTISEMENT', label: 'Advertisement' },
  { value: 'TRADE_SHOW', label: 'Trade Show' },
  { value: 'PARTNER', label: 'Partner' },
  { value: 'OTHER', label: 'Other' },
];

// Lead priorities
const LEAD_PRIORITIES = [
  { value: 'LOW', label: 'Low', color: 'bg-gray-100 text-gray-700' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-blue-100 text-blue-700' },
  { value: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-700' },
  { value: 'URGENT', label: 'Urgent', color: 'bg-red-100 text-red-700' },
];

// Lead List Item Component
function LeadListItem({ lead, isSelected, onClick, isChecked, onCheckChange, showCheckbox }) {
  const handleAvatarClick = (e) => {
    if (showCheckbox) {
      e.stopPropagation();
      onCheckChange?.(!isChecked);
    }
  };

  const handleArrowClick = (e) => {
    e.stopPropagation();
    onClick?.();
  };

  const statusConfig = LEAD_STATUSES.find((s) => s.value === lead.status) || LEAD_STATUSES[0];
  const priorityConfig = LEAD_PRIORITIES.find((p) => p.value === lead.priority);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        'w-full p-4 text-left transition-all rounded-xl mx-2 mb-2 cursor-pointer',
        isSelected
          ? 'bg-primary/5 ring-2 ring-primary/20 shadow-sm'
          : isChecked
            ? 'bg-blue-50 ring-1 ring-blue-200'
            : 'hover:bg-slate-50 border border-transparent hover:border-slate-200'
      )}
      style={{ width: 'calc(100% - 16px)' }}
    >
      <div className="flex gap-3">
        {/* Avatar - Clickable for selection */}
        <button
          onClick={handleAvatarClick}
          className={cn(
            'h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all',
            isChecked
              ? 'bg-primary/80 border border-primary'
              : showCheckbox
                ? 'bg-primary/10 border border-primary/20 hover:bg-primary/20 cursor-pointer'
                : 'bg-primary/10 border border-primary/20 cursor-default'
          )}
        >
          {isChecked ? (
            <CheckSquare className="h-6 w-6 text-white/90" />
          ) : (
            <span className="text-sm font-semibold text-primary">
              {lead.firstName?.[0] || lead.companyName?.[0] || 'L'}
              {lead.lastName?.[0] || ''}
            </span>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm truncate">
              {lead.firstName && lead.lastName
                ? `${lead.firstName} ${lead.lastName}`
                : lead.companyName || 'Unnamed Lead'}
            </span>
            {priorityConfig && (
              <Badge
                variant="secondary"
                className={cn('text-[10px] px-1.5 py-0 h-5', priorityConfig.color)}
              >
                {priorityConfig.label}
              </Badge>
            )}
          </div>

          {/* Email & Company */}
          <div className="flex items-center gap-1.5 mb-2">
            {lead.email && (
              <span className="text-[10px] text-muted-foreground truncate">{lead.email}</span>
            )}
          </div>

          {/* Status & Source */}
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={cn('text-[10px] px-1.5 py-0 h-5', statusConfig.color)}
            >
              {statusConfig.label}
            </Badge>
            {lead.source && (
              <span className="text-[10px] text-muted-foreground truncate">
                {LEAD_SOURCES.find((s) => s.value === lead.source)?.label || lead.source}
              </span>
            )}
            {lead.estimatedValue && (
              <span className="text-[10px] text-green-600 font-medium">
                ${parseFloat(lead.estimatedValue).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Arrow - Clickable to open lead */}
        <button
          onClick={handleArrowClick}
          className="shrink-0 mt-2 p-1 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <ChevronRight
            className={cn(
              'h-5 w-5 transition-colors',
              isSelected ? 'text-primary' : 'text-muted-foreground/50 hover:text-muted-foreground'
            )}
          />
        </button>
      </div>
    </motion.div>
  );
}

// Lead Form Component
function LeadForm({ lead, onSubmit, onCancel, isSubmitting, companies }) {
  const [formData, setFormData] = useState({
    firstName: lead?.firstName || '',
    lastName: lead?.lastName || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    companyName: lead?.companyName || '',
    companyId: lead?.companyId || '',
    jobTitle: lead?.jobTitle || '',
    status: lead?.status || 'NEW',
    source: lead?.source || '',
    priority: lead?.priority || 'MEDIUM',
    estimatedValue: lead?.estimatedValue || '',
    notes: lead?.notes || '',
    linkedinUrl: lead?.linkedinUrl || '',
    twitterUrl: lead?.twitterUrl || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      {/* Form Header */}
      <div className="flex items-center justify-between p-6 border-b shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            {lead ? (
              <Edit className="h-5 w-5 text-white" />
            ) : (
              <Plus className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <h2 className="font-semibold">{lead ? 'Edit Lead' : 'Create Lead'}</h2>
            <p className="text-sm text-muted-foreground">
              {lead ? 'Update lead information' : 'Add a new lead to your pipeline'}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onCancel} aria-label="Cancel">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Name */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              First Name <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="h-11"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Last Name <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="h-11"
              required
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email
            </Label>
            <Input
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Phone
            </Label>
            <Input
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="h-11"
            />
          </div>
        </div>

        {/* Company */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              Company Name
            </Label>
            <Input
              placeholder="Acme Corp"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              Existing Company
            </Label>
            <Select
              value={formData.companyId || 'none'}
              onValueChange={(v) => setFormData({ ...formData, companyId: v === 'none' ? '' : v })}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Link to company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Company</SelectItem>
                {companies.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Job Title & Estimated Value */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              Job Title
            </Label>
            <Input
              placeholder="Sales Manager"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              Estimated Value
            </Label>
            <Input
              type="number"
              placeholder="10000"
              value={formData.estimatedValue}
              onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
              className="h-11"
            />
          </div>
        </div>

        {/* Status & Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(v) => setFormData({ ...formData, status: v })}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {LEAD_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              Priority
            </Label>
            <Select
              value={formData.priority}
              onValueChange={(v) => setFormData({ ...formData, priority: v })}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {LEAD_PRIORITIES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Source */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            Source
          </Label>
          <Select
            value={formData.source || 'none'}
            onValueChange={(v) => setFormData({ ...formData, source: v === 'none' ? '' : v })}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Not Set</SelectItem>
              {LEAD_SOURCES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Notes</Label>
          <textarea
            className="w-full min-h-[100px] px-3 py-2 rounded-lg border border-input bg-background text-sm"
            placeholder="Add notes about this lead..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        {/* Social */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Linkedin className="h-4 w-4 text-muted-foreground" />
              LinkedIn URL
            </Label>
            <Input
              placeholder="https://linkedin.com/in/..."
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Twitter className="h-4 w-4 text-muted-foreground" />
              Twitter URL
            </Label>
            <Input
              placeholder="https://twitter.com/..."
              value={formData.twitterUrl}
              onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
              className="h-11"
            />
          </div>
        </div>
      </div>

      {/* Form Footer */}
      <div className="p-6 border-t shrink-0 flex gap-3">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : lead ? (
            'Save Changes'
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Create Lead
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

// Lead Detail Panel Component
function LeadDetailPanel({ lead, onEdit, onDelete, onClose, onConvert, onQualify }) {
  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <Target className="h-8 w-8 text-slate-400" />
        </div>
        <p className="font-medium mb-1">No lead selected</p>
        <p className="text-xs text-muted-foreground text-center">
          Select a lead from the list to view details
        </p>
      </div>
    );
  }

  const statusConfig = LEAD_STATUSES.find((s) => s.value === lead.status) || LEAD_STATUSES[0];
  const priorityConfig = LEAD_PRIORITIES.find((p) => p.value === lead.priority);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <span className="text-lg font-bold text-white">
              {lead.firstName?.[0] || lead.companyName?.[0] || 'L'}
              {lead.lastName?.[0] || ''}
            </span>
          </div>
          <div>
            <h2 className="font-semibold text-lg">
              {lead.firstName && lead.lastName
                ? `${lead.firstName} ${lead.lastName}`
                : lead.companyName || 'Unnamed Lead'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={cn('text-xs', statusConfig.color)}>{statusConfig.label}</Badge>
              {priorityConfig && (
                <Badge className={cn('text-xs', priorityConfig.color)}>
                  {priorityConfig.label}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit?.(lead)}>
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close panel">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Contact Info */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-muted-foreground">Contact Information</h3>
          <div className="space-y-2">
            {lead.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{lead.email}</span>
              </div>
            )}
            {lead.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{lead.phone}</span>
              </div>
            )}
            {(lead.companyName || lead.company?.name) && (
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{lead.companyName || lead.company?.name}</span>
              </div>
            )}
            {lead.jobTitle && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{lead.jobTitle}</span>
              </div>
            )}
          </div>
        </div>

        {/* Lead Details */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-muted-foreground">Lead Details</h3>
          <div className="grid grid-cols-2 gap-4">
            {lead.source && (
              <div>
                <p className="text-xs text-muted-foreground">Source</p>
                <p className="text-sm font-medium">
                  {LEAD_SOURCES.find((s) => s.value === lead.source)?.label || lead.source}
                </p>
              </div>
            )}
            {lead.estimatedValue && (
              <div>
                <p className="text-xs text-muted-foreground">Estimated Value</p>
                <p className="text-sm font-medium text-green-600">
                  ${parseFloat(lead.estimatedValue).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {lead.notes && (
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-muted-foreground">Notes</h3>
            <p className="text-sm whitespace-pre-wrap">{lead.notes}</p>
          </div>
        )}

        {/* Social Links */}
        {(lead.linkedinUrl || lead.twitterUrl) && (
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-muted-foreground">Social Links</h3>
            <div className="flex gap-2">
              {lead.linkedinUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={lead.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4 mr-1" /> LinkedIn
                  </a>
                </Button>
              )}
              {lead.twitterUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={lead.twitterUrl} target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-4 w-4 mr-1" /> Twitter
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-muted-foreground">Actions</h3>
          <div className="flex flex-col gap-2">
            {lead.status !== 'QUALIFIED' && lead.status !== 'CONVERTED' && (
              <Button variant="outline" onClick={() => onQualify?.(lead)} className="justify-start">
                <Award className="h-4 w-4 mr-2" /> Qualify Lead
              </Button>
            )}
            {lead.status !== 'CONVERTED' && (
              <Button variant="outline" onClick={() => onConvert?.(lead)} className="justify-start">
                <UserPlus className="h-4 w-4 mr-2" /> Convert to Contact
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => onDelete?.(lead)}
              className="justify-start text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete Lead
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LeadsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearch = useDeferredValue(searchQuery);
  const [selectedLead, setSelectedLead] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // list, preview, create, edit
  const [editingLead, setEditingLead] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 25;

  // Filter states
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectionMode, setSelectionMode] = useState(false);

  // Fetch leads from API
  const { data, isLoading, error, refetch } = useLeads({
    page,
    limit,
    search: deferredSearch || undefined,
    status: filterStatus !== 'all' ? filterStatus : undefined,
    priority: filterPriority !== 'all' ? filterPriority : undefined,
  });

  // Fetch companies for dropdown
  const { data: companiesData } = useCompanies({ limit: 100 });
  const companies = companiesData?.data || [];

  // Mutations
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();
  const convertLead = useConvertLead();
  const qualifyLead = useQualifyLead();

  const leads = data?.data || [];
  const meta = data?.data?.meta || { total: 0, page: 1, totalPages: 1 };

  // Stats
  const stats = useMemo(
    () => ({
      total: meta.total || leads.length,
      new: leads.filter((l) => l.status === 'NEW').length,
      qualified: leads.filter((l) => l.status === 'QUALIFIED').length,
      converted: leads.filter((l) => l.status === 'CONVERTED').length,
    }),
    [leads, meta.total]
  );

  // Sorted leads
  const sortedLeads = useMemo(() => {
    let result = [...leads];
    switch (sortBy) {
      case 'name':
        result.sort((a, b) =>
          `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
        );
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'value':
        result.sort((a, b) => (b.estimatedValue || 0) - (a.estimatedValue || 0));
        break;
    }
    return result;
  }, [leads, sortBy]);

  // Bulk selection handlers
  const toggleSelectLead = useCallback((leadId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(leadId)) {
        next.delete(leadId);
      } else {
        next.add(leadId);
      }
      return next;
    });
  }, []);

  const selectAllLeads = useCallback(() => {
    if (selectedIds.size === leads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(leads.map((l) => l.id)));
    }
  }, [leads, selectedIds.size]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setSelectionMode(false);
  }, []);

  const toggleSelectionMode = useCallback(() => {
    if (selectionMode) {
      clearSelection();
    } else {
      setSelectionMode(true);
    }
  }, [selectionMode, clearSelection]);

  // Handlers
  const openPreview = (lead) => {
    setSelectedLead(lead);
    setViewMode('preview');
  };

  const openCreate = () => {
    setEditingLead(null);
    setViewMode('create');
  };

  const openEdit = (lead) => {
    setEditingLead(lead);
    setViewMode('edit');
  };

  const handleCreate = async (data) => {
    if (!data.firstName || !data.lastName) {
      toast({
        title: 'Error',
        description: 'First and last name required',
        variant: 'destructive',
      });
      return;
    }
    try {
      await createLead.mutateAsync(data);
      setViewMode('list');
      toast({
        title: 'Lead Created',
        description: `${data.firstName} ${data.lastName} has been created.`,
      });
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateLead.mutateAsync({ id: editingLead.id, data });
      setSelectedLead({ ...editingLead, ...data });
      setViewMode('preview');
      setEditingLead(null);
      toast({ title: 'Lead Updated', description: 'Lead has been updated.' });
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (lead) => {
    if (!confirm(`Delete ${lead.firstName} ${lead.lastName}?`)) return;
    try {
      await deleteLead.mutateAsync(lead.id);
      if (selectedLead?.id === lead.id) {
        setSelectedLead(null);
        setViewMode('list');
      }
      toast({
        title: 'Lead Deleted',
        description: `${lead.firstName} ${lead.lastName} deleted.`,
      });
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleConvert = async (lead) => {
    if (!confirm(`Convert ${lead.firstName} ${lead.lastName} to a contact?`)) return;
    try {
      await convertLead.mutateAsync({ id: lead.id });
      toast({
        title: 'Lead Converted',
        description: `${lead.firstName} ${lead.lastName} has been converted to a contact.`,
      });
      setSelectedLead(null);
      setViewMode('list');
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleQualify = async (lead) => {
    try {
      await qualifyLead.mutateAsync({ id: lead.id, data: { status: 'QUALIFIED' } });
      toast({
        title: 'Lead Qualified',
        description: `${lead.firstName} ${lead.lastName} has been marked as qualified.`,
      });
      setSelectedLead({ ...lead, status: 'QUALIFIED' });
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="h-16 w-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="font-semibold text-lg mb-2">Failed to load leads</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Please check your connection and try again.
        </p>
        <Button onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" /> Try Again
        </Button>
      </div>
    );
  }

  // Stats for the top bar
  const layoutStats = [
    createStat('Total', stats.total, Target, 'blue'),
    createStat('New', stats.new, Clock, 'amber'),
    createStat('Qualified', stats.qualified, Award, 'green'),
    createStat('Converted', stats.converted, Star, 'purple'),
  ];

  // Fixed menu list
  const fixedMenuListContent = (
    <div className="py-2">
      {/* Search Bar */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Priority & Sort Filters */}
      <div className="px-4 mb-4 flex gap-2">
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="h-8 text-xs flex-1">
            <Zap className="h-3 w-3 mr-1" />
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">
              All Priorities
            </SelectItem>
            {LEAD_PRIORITIES.map((p) => (
              <SelectItem key={p.value} value={p.value} className="text-xs">
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="h-8 text-xs w-[110px]">
            <ArrowUpDown className="h-3 w-3 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest" className="text-xs">
              Newest
            </SelectItem>
            <SelectItem value="oldest" className="text-xs">
              Oldest
            </SelectItem>
            <SelectItem value="name" className="text-xs">
              Name A-Z
            </SelectItem>
            <SelectItem value="value" className="text-xs">
              Highest Value
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="px-4 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 rounded-xl border">
              <div className="flex gap-3">
                <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-20 mb-2" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : sortedLeads.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Target className="h-8 w-8 text-slate-400" />
          </div>
          <p className="font-medium mb-1">No leads found</p>
          <p className="text-xs text-muted-foreground mb-4">
            {searchQuery ? 'Try a different search term' : 'Add your first lead'}
          </p>
          {!searchQuery && (
            <Button size="sm" onClick={openCreate}>
              <Plus className="h-4 w-4 mr-1" /> Add Lead
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Select All Row */}
          {selectionMode && sortedLeads.length > 0 && (
            <button
              onClick={selectAllLeads}
              className="w-full px-5 py-2 flex items-center gap-3 text-sm hover:bg-slate-50 transition-colors border-b border-gray-100"
            >
              {selectedIds.size === sortedLeads.length ? (
                <CheckSquare className="h-4 w-4 text-primary" />
              ) : selectedIds.size > 0 ? (
                <MinusSquare className="h-4 w-4 text-primary" />
              ) : (
                <Square className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-muted-foreground">
                {selectedIds.size === sortedLeads.length
                  ? 'Deselect all'
                  : `Select all (${sortedLeads.length})`}
              </span>
            </button>
          )}
          {sortedLeads.map((lead) => (
            <LeadListItem
              key={lead.id}
              lead={lead}
              isSelected={selectedLead?.id === lead.id && viewMode === 'preview'}
              onClick={() => openPreview(lead)}
              showCheckbox={selectionMode}
              isChecked={selectedIds.has(lead.id)}
              onCheckChange={() => toggleSelectLead(lead.id)}
            />
          ))}
        </>
      )}
    </div>
  );

  // Fixed menu footer (pagination)
  const fixedMenuFooterContent =
    sortedLeads.length > 0 ? (
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Page {meta.page} of {meta.totalPages}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    ) : null;

  // Content area
  const contentArea = (
    <AnimatePresence mode="wait">
      {viewMode === 'create' && (
        <motion.div
          key="create"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="h-full"
        >
          <LeadForm
            onSubmit={handleCreate}
            onCancel={() => setViewMode('list')}
            isSubmitting={createLead.isPending}
            companies={companies}
          />
        </motion.div>
      )}

      {viewMode === 'edit' && editingLead && (
        <motion.div
          key="edit"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="h-full"
        >
          <LeadForm
            lead={editingLead}
            onSubmit={handleUpdate}
            onCancel={() => {
              setViewMode(selectedLead ? 'preview' : 'list');
              setEditingLead(null);
            }}
            isSubmitting={updateLead.isPending}
            companies={companies}
          />
        </motion.div>
      )}

      {viewMode === 'preview' && selectedLead && (
        <motion.div
          key="preview"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="h-full"
        >
          <LeadDetailPanel
            lead={selectedLead}
            onEdit={() => openEdit(selectedLead)}
            onDelete={handleDelete}
            onClose={() => {
              setSelectedLead(null);
              setViewMode('list');
            }}
            onConvert={handleConvert}
            onQualify={handleQualify}
          />
        </motion.div>
      )}

      {(viewMode === 'list' || (!selectedLead && viewMode === 'preview')) && (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-full"
        >
          <LeadDetailPanel
            lead={null}
            onEdit={() => {}}
            onDelete={() => {}}
            onClose={() => {}}
            onConvert={() => {}}
            onQualify={() => {}}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Actions for the status bar
  const layoutActions = [
    createAction('Add Lead', Plus, openCreate, { primary: true }),
    createAction('Import', Upload, () =>
      toast({ title: 'Import', description: 'Import feature coming soon' })
    ),
  ];

  // Fixed menu configuration for UnifiedLayout
  const fixedMenuConfig = {
    items: sortedLeads,
    searchPlaceholder: 'Search leads...',
    emptyMessage: 'No leads found',
    EmptyIcon: Target,
    getItemId: (lead) => lead.id,
    renderItem: ({ item: lead, isSelected, onSelect }) => (
      <LeadListItem
        lead={lead}
        isSelected={isSelected}
        onClick={onSelect}
        showCheckbox={selectionMode}
        isChecked={selectedIds.has(lead.id)}
        onCheckChange={() => toggleSelectLead(lead.id)}
      />
    ),
    footer:
      sortedLeads.length > 0 ? (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Page {meta.page} of {meta.totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null,
    filters: [
      {
        id: 'status',
        label: 'Status',
        options: [
          { value: 'all', label: 'All' },
          ...LEAD_STATUSES.map((s) => ({ value: s.value, label: s.label })),
        ],
      },
      {
        id: 'priority',
        label: 'Priority',
        options: [
          { value: 'all', label: 'All' },
          ...LEAD_PRIORITIES.map((p) => ({ value: p.value, label: p.label })),
        ],
      },
    ],
    onSelect: (lead) => openPreview(lead),
    onSearchChange: setSearchQuery,
  };

  return (
    <UnifiedLayout
      hubId="sales"
      pageTitle="Leads"
      stats={layoutStats}
      actions={layoutActions}
      fixedMenu={fixedMenuConfig}
    >
      {contentArea}
    </UnifiedLayout>
  );
}
