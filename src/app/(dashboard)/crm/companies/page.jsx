'use client';

import { useState, useMemo, useDeferredValue, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  MoreHorizontal,
  Building2,
  Globe,
  Users,
  MapPin,
  Loader2,
  AlertCircle,
  RefreshCw,
  Edit,
  Trash2,
  Mail,
  Phone,
  ExternalLink,
  FileText,
  Briefcase,
  Linkedin,
  Twitter,
  Facebook,
  Calendar,
  Clock,
  Target,
  X,
  ChevronRight,
  TrendingUp,
  Factory,
  ArrowUpDown,
  Upload,
  CheckSquare,
  Square,
  MinusSquare,
  FileDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import {
  useCompanies,
  useCreateCompany,
  useUpdateCompany,
  useDeleteCompany,
} from '@/hooks/use-companies';
import { useToast } from '@/hooks/use-toast';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { UnifiedLayout, createStat, createAction } from '@/components/layout/unified';

// Company Types
const COMPANY_TYPES = [
  { value: 'PROSPECT', label: 'Prospect', color: 'bg-blue-100 text-blue-700' },
  { value: 'CUSTOMER', label: 'Customer', color: 'bg-green-100 text-green-700' },
  { value: 'PARTNER', label: 'Partner', color: 'bg-purple-100 text-purple-700' },
  { value: 'VENDOR', label: 'Vendor', color: 'bg-orange-100 text-orange-700' },
  { value: 'COMPETITOR', label: 'Competitor', color: 'bg-red-100 text-red-700' },
  { value: 'OTHER', label: 'Other', color: 'bg-gray-100 text-gray-700' },
];

// Company Lifecycle Stages
const COMPANY_LIFECYCLE_STAGES = [
  { value: 'LEAD', label: 'Lead', color: 'bg-blue-100 text-blue-700' },
  { value: 'QUALIFIED', label: 'Qualified', color: 'bg-cyan-100 text-cyan-700' },
  { value: 'OPPORTUNITY', label: 'Opportunity', color: 'bg-purple-100 text-purple-700' },
  { value: 'CUSTOMER', label: 'Customer', color: 'bg-green-100 text-green-700' },
  { value: 'CHURNED', label: 'Churned', color: 'bg-red-100 text-red-700' },
];

const industries = [
  'Technology',
  'Software',
  'SaaS',
  'IT Services',
  'Consulting',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Retail',
  'E-commerce',
  'Education',
  'Real Estate',
  'Logistics',
  'Other',
];

const companySizes = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1000+', label: '1000+ employees' },
];

const emptyCompany = {
  name: '',
  domain: '',
  description: '',
  companyType: '',
  lifecycleStage: '',
  industry: '',
  employeeCount: '',
  foundedYear: '',
  phone: '',
  email: '',
  linkedinUrl: '',
  twitterUrl: '',
  address: '',
  city: '',
  state: '',
  country: 'India',
};

// Company List Item Component
function CompanyListItem({ company, isSelected, onClick, isChecked, onCheckChange, showCheckbox }) {
  const typeInfo = COMPANY_TYPES.find((t) => t.value === company.companyType);

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

  const handleRowClick = (e) => {
    // Don't trigger if clicking on interactive elements (avatar in selection mode or arrow button)
    if (e.target.closest('button')) return;
    onClick?.();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={handleRowClick}
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
            <Building2 className="h-5 w-5 text-primary" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm truncate">{company.name}</span>
          </div>

          {/* Domain */}
          <div className="flex items-center gap-1.5 mb-2">
            {company.domain && (
              <span className="text-[10px] text-muted-foreground truncate flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {company.domain}
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2">
            {typeInfo && (
              <Badge
                variant="secondary"
                className={cn('text-[10px] px-1.5 py-0 h-5', typeInfo.color)}
              >
                {typeInfo.label}
              </Badge>
            )}
            {company.industry && (
              <span className="text-[10px] text-muted-foreground truncate flex items-center gap-1">
                <Factory className="h-3 w-3" />
                {company.industry}
              </span>
            )}
          </div>
        </div>

        {/* Arrow - Clickable to open company */}
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

// Company Detail Panel Component
function CompanyDetailPanel({ company, onEdit, onDelete, onClose, onViewContacts }) {
  if (!company) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center mb-6">
          <Building2 className="h-12 w-12 text-primary/50" />
        </div>
        <h3 className="font-semibold text-xl mb-2">Companies</h3>
        <p className="text-muted-foreground text-center max-w-sm mb-6">
          Manage your companies and accounts. Select a company from the list to view their details.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-4 max-w-lg">
          <div className="text-center p-3">
            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-2">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground">Link contacts</p>
          </div>
          <div className="text-center p-3">
            <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-2">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-xs text-muted-foreground">Track deals</p>
          </div>
          <div className="text-center p-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-xs text-muted-foreground">Monitor growth</p>
          </div>
        </div>
      </div>
    );
  }

  const typeInfo = COMPANY_TYPES.find((t) => t.value === company.companyType);
  const stageInfo = COMPANY_LIFECYCLE_STAGES.find((s) => s.value === company.lifecycleStage);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5" />
        <div className="relative p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg bg-primary/10 border border-primary/20">
                <Building2 className="h-7 w-7 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold">{company.name}</h2>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {typeInfo && (
                    <Badge variant="secondary" className={cn(typeInfo.color)}>
                      {typeInfo.label}
                    </Badge>
                  )}
                  {stageInfo && <Badge variant="outline">{stageInfo.label}</Badge>}
                  {company.domain && (
                    <a
                      href={`https://${company.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <Globe className="h-3 w-3" />
                      {company.domain}
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={() => onEdit(company)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="More options">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => window.open(`https://${company.domain}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Website
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={() => onDelete(company)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={onClose}
                aria-label="Close panel"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/30 border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">
                  {company._count?.contacts || company.contactsCount || 0}
                </p>
                <p className="text-xs text-blue-600/70">Contacts</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/30 border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-700">
                  {company._count?.deals || company.dealsCount || 0}
                </p>
                <p className="text-xs text-emerald-600/70">Deals</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/30 border border-purple-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700">{company.foundedYear || '-'}</p>
                <p className="text-xs text-purple-600/70">Founded</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Contact Information
          </label>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200">
            <div className="grid grid-cols-2 gap-4">
              {company.email && (
                <a
                  href={`mailto:${company.email}`}
                  className="flex items-center gap-3 hover:text-primary"
                >
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{company.email}</span>
                </a>
              )}
              {company.phone && (
                <a
                  href={`tel:${company.phone}`}
                  className="flex items-center gap-3 hover:text-primary"
                >
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{company.phone}</span>
                </a>
              )}
              {company.domain && (
                <a
                  href={`https://${company.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-primary"
                >
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{company.domain}</span>
                </a>
              )}
              {!company.email && !company.phone && !company.domain && (
                <p className="text-sm text-muted-foreground col-span-2">No contact information</p>
              )}
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Business Details
          </label>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Industry</p>
                <p className="text-sm font-medium">{company.industry || 'Not set'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Company Size</p>
                <p className="text-sm font-medium">{company.employeeCount || 'Not set'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        {(company.address || company.city || company.state || company.country) && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address
            </label>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200">
              <div className="text-sm">
                {company.address && <p>{company.address}</p>}
                <p>
                  {[company.city, company.state, company.postalCode].filter(Boolean).join(', ')}
                </p>
                {company.country && <p>{company.country}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Social Links */}
        {(company.linkedinUrl || company.twitterUrl || company.facebookUrl) && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Social Profiles
            </label>
            <div className="flex flex-wrap gap-2">
              {company.linkedinUrl && (
                <a
                  href={company.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5]/20 transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              )}
              {company.twitterUrl && (
                <a
                  href={company.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1da1f2]/10 text-[#1da1f2] hover:bg-[#1da1f2]/20 transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                  Twitter
                </a>
              )}
              {company.facebookUrl && (
                <a
                  href={company.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1877f2]/10 text-[#1877f2] hover:bg-[#1877f2]/20 transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                  Facebook
                </a>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        {company.description && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Description
            </label>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200">
              <p className="text-sm text-muted-foreground">{company.description}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t shrink-0 bg-slate-50/50">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 h-11" onClick={onViewContacts}>
            <Users className="h-4 w-4 mr-2" />
            View Contacts
          </Button>
          <Button className="flex-1 h-11" onClick={() => onEdit(company)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Company
          </Button>
        </div>
      </div>
    </div>
  );
}

// Company Form Component
function CompanyForm({ company, onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: company?.name || '',
    domain: company?.domain || '',
    description: company?.description || '',
    companyType: company?.companyType || '',
    lifecycleStage: company?.lifecycleStage || '',
    industry: company?.industry || '',
    employeeCount: company?.employeeCount || '',
    foundedYear: company?.foundedYear || '',
    phone: company?.phone || '',
    email: company?.email || '',
    linkedinUrl: company?.linkedinUrl || '',
    twitterUrl: company?.twitterUrl || '',
    address: company?.address || '',
    city: company?.city || '',
    state: company?.state || '',
    country: company?.country || 'India',
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
            {company ? (
              <Edit className="h-5 w-5 text-white" />
            ) : (
              <Plus className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <h2 className="font-semibold">{company ? 'Edit Company' : 'Create Company'}</h2>
            <p className="text-sm text-muted-foreground">
              {company ? 'Update company information' : 'Add a new company to your CRM'}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onCancel} aria-label="Cancel">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Name & Domain */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              Company Name <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Acme Inc."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-11"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              Domain
            </Label>
            <Input
              placeholder="acme.com"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              className="h-11"
            />
          </div>
        </div>

        {/* Type & Stage */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              Company Type
            </Label>
            <Select
              value={formData.companyType || 'none'}
              onValueChange={(v) =>
                setFormData({ ...formData, companyType: v === 'none' ? '' : v })
              }
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Not Set</SelectItem>
                {COMPANY_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
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
                {COMPANY_LIFECYCLE_STAGES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Industry & Size */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Factory className="h-4 w-4 text-muted-foreground" />
              Industry
            </Label>
            <Select
              value={formData.industry || 'none'}
              onValueChange={(v) => setFormData({ ...formData, industry: v === 'none' ? '' : v })}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Not Set</SelectItem>
                {industries.map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Company Size
            </Label>
            <Select
              value={formData.employeeCount || 'none'}
              onValueChange={(v) =>
                setFormData({ ...formData, employeeCount: v === 'none' ? '' : v })
              }
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Not Set</SelectItem>
                {companySizes.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              placeholder="info@acme.com"
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
              placeholder="+91 22 1234 5678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="h-11"
            />
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              City
            </Label>
            <Input
              placeholder="Mumbai"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Country</Label>
            <Input
              placeholder="India"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="h-11"
            />
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
              placeholder="https://linkedin.com/company/..."
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

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Description
          </Label>
          <Textarea
            placeholder="Brief description of the company..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
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
          ) : company ? (
            'Save Changes'
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Create Company
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export default function CompaniesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearch = useDeferredValue(searchQuery);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // list, preview, create, edit
  const [editingCompany, setEditingCompany] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 25;

  // Filter states
  const [filterType, setFilterType] = useState('all');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectionMode, setSelectionMode] = useState(false);

  // Fetch companies from API
  const { data, isLoading, error, refetch } = useCompanies({
    page,
    limit,
    search: deferredSearch || undefined,
  });

  // Mutations
  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();
  const deleteCompany = useDeleteCompany();

  const companies = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, totalPages: 1 };

  // Stats
  const stats = useMemo(
    () => ({
      total: meta.total || companies.length,
      customers: companies.filter((c) => c.companyType === 'CUSTOMER').length,
      prospects: companies.filter((c) => c.companyType === 'PROSPECT').length,
      partners: companies.filter((c) => c.companyType === 'PARTNER').length,
    }),
    [companies, meta.total]
  );

  // Filtered and sorted companies
  const filteredCompanies = useMemo(() => {
    let result = [...companies];

    if (filterType !== 'all') {
      result = result.filter((c) => c.companyType === filterType);
    }
    if (filterIndustry !== 'all') {
      result = result.filter((c) => c.industry === filterIndustry);
    }

    switch (sortBy) {
      case 'name':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
    }
    return result;
  }, [companies, filterType, filterIndustry, sortBy]);

  // Bulk selection handlers
  const toggleSelectCompany = useCallback((companyId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(companyId)) {
        next.delete(companyId);
      } else {
        next.add(companyId);
      }
      return next;
    });
  }, []);

  const selectAllCompanies = useCallback(() => {
    if (selectedIds.size === filteredCompanies.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCompanies.map((c) => c.id)));
    }
  }, [filteredCompanies, selectedIds.size]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setSelectionMode(false);
  }, []);

  const toggleSelectionMode = useCallback(() => {
    setSelectionMode((prev) => !prev);
    if (selectionMode) {
      setSelectedIds(new Set());
    }
  }, [selectionMode]);

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (
      !confirm(`Delete ${selectedIds.size} company(s)? This will also remove associated contacts.`)
    )
      return;

    try {
      const ids = Array.from(selectedIds);
      for (const id of ids) {
        await deleteCompany.mutateAsync(id);
      }
      clearSelection();
      toast({
        title: 'Companies Deleted',
        description: `${ids.length} company(s) deleted successfully.`,
      });
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleBulkExport = () => {
    if (selectedIds.size === 0) return;

    const selectedCompanies = filteredCompanies.filter((c) => selectedIds.has(c.id));
    const csvData = [
      ['Name', 'Domain', 'Type', 'Industry', 'Email', 'Phone', 'City', 'Country'],
      ...selectedCompanies.map((c) => [
        c.name || '',
        c.domain || '',
        c.companyType || '',
        c.industry || '',
        c.email || '',
        c.phone || '',
        c.city || '',
        c.country || '',
      ]),
    ];

    const csvContent = csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `companies-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Complete',
      description: `${selectedCompanies.length} company(s) exported to CSV.`,
    });
  };

  // Handlers
  const openPreview = (company) => {
    setSelectedCompany(company);
    setViewMode('preview');
  };

  const openCreate = () => {
    setEditingCompany(null);
    setViewMode('create');
  };

  const openEdit = (company) => {
    setEditingCompany(company);
    setViewMode('edit');
  };

  const handleCreate = async (data) => {
    if (!data.name) {
      toast({ title: 'Error', description: 'Company name is required', variant: 'destructive' });
      return;
    }
    try {
      const result = await createCompany.mutateAsync(data);
      setSelectedCompany(result.data);
      setViewMode('preview');
      toast({ title: 'Company Created', description: `${data.name} has been created.` });
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateCompany.mutateAsync({ id: editingCompany.id, data });
      setSelectedCompany({ ...editingCompany, ...data });
      setViewMode('preview');
      setEditingCompany(null);
      toast({ title: 'Company Updated', description: 'Company has been updated.' });
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (company) => {
    if (!confirm(`Delete ${company.name}? This will also remove all associated contacts.`)) return;
    try {
      await deleteCompany.mutateAsync(company.id);
      if (selectedCompany?.id === company.id) {
        setSelectedCompany(null);
        setViewMode('list');
      }
      toast({ title: 'Company Deleted', description: `${company.name} deleted.` });
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
        <h3 className="font-semibold text-lg mb-2">Failed to load companies</h3>
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
    createStat('Total', stats.total, Building2, 'blue'),
    createStat('Customers', stats.customers, Users, 'green'),
    createStat('Prospects', stats.prospects, Target, 'amber'),
    createStat('Partners', stats.partners, Building2, 'purple'),
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
          <CompanyForm
            onSubmit={handleCreate}
            onCancel={() => setViewMode('list')}
            isSubmitting={createCompany.isPending}
          />
        </motion.div>
      )}

      {viewMode === 'edit' && editingCompany && (
        <motion.div
          key="edit"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="h-full"
        >
          <CompanyForm
            company={editingCompany}
            onSubmit={handleUpdate}
            onCancel={() => {
              setViewMode(selectedCompany ? 'preview' : 'list');
              setEditingCompany(null);
            }}
            isSubmitting={updateCompany.isPending}
          />
        </motion.div>
      )}

      {viewMode === 'preview' && selectedCompany && (
        <motion.div
          key="preview"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="h-full"
        >
          <CompanyDetailPanel
            company={selectedCompany}
            onEdit={() => openEdit(selectedCompany)}
            onDelete={handleDelete}
            onClose={() => {
              setSelectedCompany(null);
              setViewMode('list');
            }}
            onViewContacts={() => {
              if (selectedCompany?.id) {
                router.push(`/crm/contacts?company=${selectedCompany.id}`);
              }
            }}
          />
        </motion.div>
      )}

      {(viewMode === 'list' || (!selectedCompany && viewMode === 'preview')) && (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-full"
        >
          <CompanyDetailPanel
            company={null}
            onEdit={() => {}}
            onDelete={() => {}}
            onClose={() => {}}
            onViewContacts={() => {}}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Actions for status bar
  const layoutActions = [
    createAction('Import', Upload, () =>
      toast({ title: 'Import', description: 'Import functionality coming soon' })
    ),
    createAction('Add Company', Plus, openCreate, { primary: true }),
  ];

  // Fixed menu configuration for UnifiedLayout
  const unifiedFixedMenuConfig = {
    items: filteredCompanies,
    getItemId: (item) => item.id,
    getItemLabel: (item) => item.name || 'Unknown',
    getItemSubLabel: (item) => item.domain || '',
    getItemBadge: (item) => {
      const typeInfo = COMPANY_TYPES.find((t) => t.value === item.companyType);
      return typeInfo?.label || '';
    },
    selectedId: selectedCompany?.id,
    searchPlaceholder: 'Search companies...',
    searchValue: searchQuery,
    onSearchChange: setSearchQuery,
    onSelect: openPreview,
    isLoading: isLoading,
    emptyMessage: searchQuery ? 'No companies found' : 'No companies yet',
    emptyAction: !searchQuery ? { label: 'Add Company', onClick: openCreate } : null,
    renderItem: ({ item, isSelected }) => (
      <CompanyListItem
        key={item.id}
        company={item}
        isSelected={isSelected}
        onClick={() => openPreview(item)}
        showCheckbox={selectionMode}
        isChecked={selectedIds.has(item.id)}
        onCheckChange={() => toggleSelectCompany(item.id)}
      />
    ),
    customFilters: (
      <div className="px-4 mb-4 flex gap-2">
        <Select value={filterIndustry} onValueChange={setFilterIndustry}>
          <SelectTrigger className="h-8 text-xs flex-1">
            <Factory className="h-3 w-3 mr-1" />
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">
              All Industries
            </SelectItem>
            {industries.map((ind) => (
              <SelectItem key={ind} value={ind} className="text-xs">
                {ind}
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
      selectionMode && filteredCompanies.length > 0 ? (
        <div className="px-4 py-2 border-b flex items-center justify-between">
          <button
            onClick={selectAllCompanies}
            className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
          >
            {selectedIds.size === filteredCompanies.length ? (
              <CheckSquare className="h-4 w-4 text-primary" />
            ) : selectedIds.size > 0 ? (
              <MinusSquare className="h-4 w-4 text-primary" />
            ) : (
              <Square className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-muted-foreground">
              {selectedIds.size === filteredCompanies.length
                ? 'Deselect all'
                : `Select all (${filteredCompanies.length})`}
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
      filteredCompanies.length > 0 ? (
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
    <UnifiedLayout
      hubId="crm"
      pageTitle="Companies"
      stats={layoutStats}
      actions={layoutActions}
      fixedMenu={unifiedFixedMenuConfig}
    >
      {contentArea}
    </UnifiedLayout>
  );
}
