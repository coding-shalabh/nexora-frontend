'use client';

import { useState, useMemo, useDeferredValue, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  Building2,
  Download,
  Upload,
  Tag,
  Loader2,
  AlertCircle,
  RefreshCw,
  Edit,
  Trash2,
  X,
  User,
  MessageSquare,
  Linkedin,
  Twitter,
  MapPin,
  Globe,
  Briefcase,
  Facebook,
  Users,
  Target,
  Smartphone,
  ArrowUpDown,
  ChevronRight,
  Star,
  TrendingUp,
  UserPlus,
  Filter,
  CheckSquare,
  Square,
  MinusSquare,
  FileDown,
  Tags,
  UserX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  useContacts,
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
  useBulkDeleteContacts,
  useBulkAddTags,
} from '@/hooks/use-contacts';
import { useCompanies } from '@/hooks/use-companies';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ContactImportExportModal } from '@/components/crm/contact-import-export-modal';
import { ContactDetailPanel } from '@/components/crm/contact-detail-panel';
import { Skeleton } from '@/components/ui/skeleton';
import { UnifiedLayout, createStat, createAction } from '@/components/layout/unified';

// Helper to safely render a value (avoids rendering objects)
function safeRender(value, fallback = '') {
  // Extract a safe string from any value
  const getSafeValue = (v) => {
    if (v === null || v === undefined) return '';
    if (typeof v === 'object') {
      // Handle objects - try to extract a displayable string
      if (Array.isArray(v)) return '';
      if (v.name) return String(v.name);
      if (v.label) return String(v.label);
      if (v.title) return String(v.title);
      if (v.value) return String(v.value);
      return ''; // Empty object or unknown structure
    }
    return String(v);
  };

  // Try value first, then fallback
  const safeValue = getSafeValue(value);
  if (safeValue) return safeValue;

  return getSafeValue(fallback);
}

// Contact sources
const CONTACT_SOURCES = [
  { value: 'WEBSITE', label: 'Website' },
  { value: 'REFERRAL', label: 'Referral' },
  { value: 'SOCIAL_MEDIA', label: 'Social Media' },
  { value: 'LINKEDIN', label: 'LinkedIn' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'EMAIL_CAMPAIGN', label: 'Email Campaign' },
  { value: 'COLD_CALL', label: 'Cold Call' },
  { value: 'DIRECT', label: 'Direct' },
  { value: 'OTHER', label: 'Other' },
];

// Contact status options
const CONTACT_STATUSES = [
  { value: 'ACTIVE', label: 'Active', color: 'bg-green-100 text-green-700' },
  { value: 'INACTIVE', label: 'Inactive', color: 'bg-gray-100 text-gray-700' },
  { value: 'BLOCKED', label: 'Blocked', color: 'bg-red-100 text-red-700' },
];

// Lifecycle stages
const LIFECYCLE_STAGES = [
  { value: 'SUBSCRIBER', label: 'Subscriber', color: 'bg-slate-100 text-slate-700' },
  { value: 'LEAD', label: 'Lead', color: 'bg-blue-100 text-blue-700' },
  { value: 'MQL', label: 'MQL', color: 'bg-cyan-100 text-cyan-700' },
  { value: 'SQL', label: 'SQL', color: 'bg-primary/10 text-primary' },
  { value: 'OPPORTUNITY', label: 'Opportunity', color: 'bg-purple-100 text-purple-700' },
  { value: 'CUSTOMER', label: 'Customer', color: 'bg-green-100 text-green-700' },
  { value: 'EVANGELIST', label: 'Evangelist', color: 'bg-amber-100 text-amber-700' },
];

// Lead status options
const LEAD_STATUSES = [
  { value: 'NEW', label: 'New', color: 'bg-blue-100 text-blue-700' },
  { value: 'OPEN', label: 'Open', color: 'bg-green-100 text-green-700' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'OPEN_DEAL', label: 'Open Deal', color: 'bg-purple-100 text-purple-700' },
  { value: 'UNQUALIFIED', label: 'Unqualified', color: 'bg-red-100 text-red-700' },
  { value: 'CONNECTED', label: 'Connected', color: 'bg-teal-100 text-teal-700' },
];

const emptyContact = {
  firstName: '',
  lastName: '',
  displayName: '',
  email: '',
  phone: '',
  companyId: '',
  jobTitle: '',
  department: '',
  mobilePhone: '',
  lifecycleStage: '',
  leadStatus: '',
  linkedinUrl: '',
  twitterUrl: '',
  facebookUrl: '',
  status: 'ACTIVE',
  source: '',
  billingCity: '',
  billingState: '',
  tags: [],
};

// Contact List Item Component
function ContactListItem({ contact, isSelected, onClick, isChecked, onCheckChange, showCheckbox }) {
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
              {contact.firstName?.[0] || ''}
              {contact.lastName?.[0] || ''}
            </span>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm truncate">
              {contact.displayName ||
                `${contact.firstName || ''} ${contact.lastName || ''}`.trim() ||
                'Unknown'}
            </span>
            {contact.status === 'ACTIVE' && (
              <span className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
            )}
          </div>

          {/* Email & Company */}
          <div className="flex items-center gap-1.5 mb-2">
            {contact.email && (
              <span className="text-[10px] text-muted-foreground truncate">{contact.email}</span>
            )}
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2">
            {contact.lifecycleStage && typeof contact.lifecycleStage === 'string' && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                {safeRender(contact.lifecycleStage)}
              </Badge>
            )}
            {contact.company?.name && (
              <span className="text-[10px] text-muted-foreground truncate flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {safeRender(contact.company?.name)}
              </span>
            )}
          </div>
        </div>

        {/* Arrow - Clickable to open contact */}
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

// Contact Form Component
function ContactForm({ contact, onSubmit, onCancel, isSubmitting, companies }) {
  const [formData, setFormData] = useState({
    firstName: contact?.firstName || '',
    lastName: contact?.lastName || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    companyId: contact?.companyId || '',
    jobTitle: contact?.jobTitle || '',
    lifecycleStage: contact?.lifecycleStage || '',
    leadStatus: contact?.leadStatus || '',
    source: contact?.source || '',
    status: contact?.status || 'ACTIVE',
    linkedinUrl: contact?.linkedinUrl || '',
    twitterUrl: contact?.twitterUrl || '',
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
            {contact ? (
              <Edit className="h-5 w-5 text-white" />
            ) : (
              <Plus className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <h2 className="font-semibold">{contact ? 'Edit Contact' : 'Create Contact'}</h2>
            <p className="text-sm text-muted-foreground">
              {contact ? 'Update contact information' : 'Add a new contact to your CRM'}
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
              Company
            </Label>
            <Select
              value={formData.companyId || 'none'}
              onValueChange={(v) => setFormData({ ...formData, companyId: v === 'none' ? '' : v })}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select company" />
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
        </div>

        {/* Lead Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              Lifecycle Stage
            </Label>
            <Select
              value={formData.lifecycleStage || 'none'}
              onValueChange={(v) =>
                setFormData({ ...formData, lifecycleStage: v === 'none' ? '' : v })
              }
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Not Set</SelectItem>
                {LIFECYCLE_STAGES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              Lead Status
            </Label>
            <Select
              value={formData.leadStatus || 'none'}
              onValueChange={(v) => setFormData({ ...formData, leadStatus: v === 'none' ? '' : v })}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Not Set</SelectItem>
                {LEAD_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Source & Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4 text-muted-foreground" />
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
                {CONTACT_SOURCES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(v) => setFormData({ ...formData, status: v })}
            >
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONTACT_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
          ) : contact ? (
            'Save Changes'
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Create Contact
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export default function ContactsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearch = useDeferredValue(searchQuery);
  const [selectedContact, setSelectedContact] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // list, preview, create, edit
  const [editingContact, setEditingContact] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 25;

  // Filter states
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLifecycle, setFilterLifecycle] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Modal states
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectionMode, setSelectionMode] = useState(false);

  // Fetch contacts from API
  const { data, isLoading, error, refetch } = useContacts({
    page,
    limit,
    search: deferredSearch || undefined,
    status: filterStatus !== 'all' ? filterStatus : undefined,
    lifecycleStage: filterLifecycle !== 'all' ? filterLifecycle : undefined,
  });

  // Fetch companies for dropdown
  const { data: companiesData } = useCompanies({ limit: 100 });
  const companies = companiesData?.data || [];

  // Mutations
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();
  const bulkDeleteContacts = useBulkDeleteContacts();

  const contacts = data?.data || [];

  // Bulk selection handlers
  const toggleSelectContact = useCallback((contactId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(contactId)) {
        next.delete(contactId);
      } else {
        next.add(contactId);
      }
      return next;
    });
  }, []);

  const selectAllContacts = useCallback(() => {
    if (selectedIds.size === contacts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(contacts.map((c) => c.id)));
    }
  }, [contacts, selectedIds.size]);

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

  // Bulk action handlers
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} contact(s)? This action cannot be undone.`)) return;

    try {
      await bulkDeleteContacts.mutateAsync({ ids: Array.from(selectedIds) });
      toast({
        title: 'Contacts Deleted',
        description: `${selectedIds.size} contact(s) deleted successfully.`,
      });
      clearSelection();
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleBulkExport = () => {
    if (selectedIds.size === 0) return;
    setShowExportModal(true);
  };
  const meta = data?.meta || { total: 0, page: 1, totalPages: 1 };

  // Stats
  const stats = useMemo(
    () => ({
      total: meta.total || contacts.length,
      active: contacts.filter((c) => c.status === 'ACTIVE').length,
      leads: contacts.filter((c) => c.lifecycleStage === 'LEAD').length,
      customers: contacts.filter((c) => c.lifecycleStage === 'CUSTOMER').length,
    }),
    [contacts, meta.total]
  );

  // Sorted contacts
  const sortedContacts = useMemo(() => {
    let result = [...contacts];
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
    }
    return result;
  }, [contacts, sortBy]);

  // Handlers
  const openPreview = (contact) => {
    setSelectedContact(contact);
    setViewMode('preview');
  };

  const openCreate = () => {
    setEditingContact(null);
    setViewMode('create');
  };

  const openEdit = (contact) => {
    setEditingContact(contact);
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
      await createContact.mutateAsync(data);
      setViewMode('list');
      toast({
        title: 'Contact Created',
        description: `${data.firstName} ${data.lastName} has been created.`,
      });
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateContact.mutateAsync({ id: editingContact.id, data });
      setSelectedContact({ ...editingContact, ...data });
      setViewMode('preview');
      setEditingContact(null);
      toast({ title: 'Contact Updated', description: 'Contact has been updated.' });
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (contact) => {
    if (!confirm(`Delete ${contact.firstName} ${contact.lastName}?`)) return;
    try {
      await deleteContact.mutateAsync(contact.id);
      if (selectedContact?.id === contact.id) {
        setSelectedContact(null);
        setViewMode('list');
      }
      toast({
        title: 'Contact Deleted',
        description: `${contact.firstName} ${contact.lastName} deleted.`,
      });
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
        <h3 className="font-semibold text-lg mb-2">Failed to load contacts</h3>
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
    createStat('Total', stats.total, Users, 'blue'),
    createStat('Active', stats.active, User, 'green'),
    createStat('Leads', stats.leads, Target, 'amber'),
    createStat('Customers', stats.customers, Star, 'purple'),
  ];

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
          <ContactForm
            onSubmit={handleCreate}
            onCancel={() => setViewMode('list')}
            isSubmitting={createContact.isPending}
            companies={companies}
          />
        </motion.div>
      )}

      {viewMode === 'edit' && editingContact && (
        <motion.div
          key="edit"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="h-full"
        >
          <ContactForm
            contact={editingContact}
            onSubmit={handleUpdate}
            onCancel={() => {
              setViewMode(selectedContact ? 'preview' : 'list');
              setEditingContact(null);
            }}
            isSubmitting={updateContact.isPending}
            companies={companies}
          />
        </motion.div>
      )}

      {viewMode === 'preview' && selectedContact && (
        <motion.div
          key="preview"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="h-full"
        >
          <ContactDetailPanel
            contact={selectedContact}
            onEdit={() => openEdit(selectedContact)}
            onDelete={handleDelete}
            onClose={() => {
              setSelectedContact(null);
              setViewMode('list');
            }}
          />
        </motion.div>
      )}

      {(viewMode === 'list' || (!selectedContact && viewMode === 'preview')) && (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-full"
        >
          <ContactDetailPanel
            contact={null}
            onEdit={() => {}}
            onDelete={() => {}}
            onClose={() => {}}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Actions for status bar
  const layoutActions = [
    createAction('Import', Upload, () => setShowImportModal(true)),
    createAction('Add Contact', Plus, openCreate, { primary: true }),
  ];

  // Fixed menu configuration for UnifiedLayout
  const unifiedFixedMenuConfig = {
    items: sortedContacts,
    getItemId: (item) => item.id,
    getItemLabel: (item) =>
      item.displayName || `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'Unknown',
    getItemSubLabel: (item) => item.email || '',
    getItemBadge: (item) => item.lifecycleStage,
    selectedId: selectedContact?.id,
    searchPlaceholder: 'Search contacts...',
    searchValue: searchQuery,
    onSearchChange: setSearchQuery,
    onSelect: openPreview,
    isLoading: isLoading,
    emptyMessage: searchQuery ? 'No contacts found' : 'No contacts yet',
    emptyAction: !searchQuery ? { label: 'Add Contact', onClick: openCreate } : null,
    renderItem: ({ item, isSelected }) => (
      <ContactListItem
        key={item.id}
        contact={item}
        isSelected={isSelected}
        onClick={() => openPreview(item)}
        showCheckbox={selectionMode}
        isChecked={selectedIds.has(item.id)}
        onCheckChange={() => toggleSelectContact(item.id)}
      />
    ),
    customFilters: (
      <div className="px-4 mb-4 flex gap-2">
        <Select value={filterLifecycle} onValueChange={setFilterLifecycle}>
          <SelectTrigger className="h-8 text-xs flex-1">
            <Target className="h-3 w-3 mr-1" />
            <SelectValue placeholder="Lifecycle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">
              All Stages
            </SelectItem>
            {LIFECYCLE_STAGES.map((s) => (
              <SelectItem key={s.value} value={s.value} className="text-xs">
                {s.label}
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
          </SelectContent>
        </Select>
      </div>
    ),
    customHeader:
      selectionMode && sortedContacts.length > 0 ? (
        <div className="px-4 py-2 border-b flex items-center justify-between">
          <button
            onClick={selectAllContacts}
            className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
          >
            {selectedIds.size === sortedContacts.length ? (
              <CheckSquare className="h-4 w-4 text-primary" />
            ) : selectedIds.size > 0 ? (
              <MinusSquare className="h-4 w-4 text-primary" />
            ) : (
              <Square className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-muted-foreground">
              {selectedIds.size === sortedContacts.length
                ? 'Deselect all'
                : `Select all (${sortedContacts.length})`}
            </span>
          </button>
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={handleBulkExport}
              >
                <FileDown className="h-3 w-3 mr-1" /> Export
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="h-7 text-xs"
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-3 w-3 mr-1" /> Delete
              </Button>
            </div>
          )}
        </div>
      ) : null,
    customFooter:
      sortedContacts.length > 0 ? (
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
    secondaryActions: [
      {
        label: selectionMode ? 'Exit Selection' : 'Select',
        icon: selectionMode ? MinusSquare : CheckSquare,
        onClick: toggleSelectionMode,
      },
    ],
  };

  return (
    <>
      <UnifiedLayout
        hubId="crm"
        pageTitle="Contacts"
        stats={layoutStats}
        actions={layoutActions}
        fixedMenu={unifiedFixedMenuConfig}
      >
        {contentArea}
      </UnifiedLayout>

      {/* Import/Export Modal */}
      <ContactImportExportModal
        open={showImportModal || showExportModal}
        onOpenChange={(open) => {
          if (!open) {
            setShowImportModal(false);
            setShowExportModal(false);
          }
        }}
        mode={showImportModal ? 'import' : 'export'}
        selectedIds={Array.from(selectedIds)}
        onExportComplete={() => {
          clearSelection();
          setShowExportModal(false);
        }}
      />
    </>
  );
}
