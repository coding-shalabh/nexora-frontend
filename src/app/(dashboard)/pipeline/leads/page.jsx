'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  MoreHorizontal,
  User,
  Building2,
  Mail,
  Star,
  ArrowRight,
  Loader2,
  AlertCircle,
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  DollarSign,
  Users,
} from 'lucide-react';
import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  useLeads,
  useCreateLead,
  useUpdateLead,
  useDeleteLead,
  useConvertLead,
} from '@/hooks/use-leads';
import { useToast } from '@/hooks/use-toast';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const statusConfig = {
  NEW: { label: 'New', color: 'bg-blue-100 text-blue-700' },
  CONTACTED: { label: 'Contacted', color: 'bg-yellow-100 text-yellow-700' },
  QUALIFIED: { label: 'Qualified', color: 'bg-green-100 text-green-700' },
  UNQUALIFIED: { label: 'Unqualified', color: 'bg-gray-100 text-gray-700' },
  CONVERTED: { label: 'Converted', color: 'bg-purple-100 text-purple-700' },
};

const sources = [
  'WEBSITE',
  'LINKEDIN',
  'REFERRAL',
  'TRADE_SHOW',
  'COLD_CALL',
  'EMAIL_CAMPAIGN',
  'OTHER',
];

const emptyLead = {
  title: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  source: '',
  status: 'NEW',
  estimatedValue: '',
  notes: '',
};

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount || 0);
}

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 25;

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewSheet, setShowViewSheet] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [formData, setFormData] = useState(emptyLead);

  const { toast } = useToast();

  // Fetch leads from API
  const { data, isLoading, error, refetch } = useLeads({
    page,
    limit,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: searchQuery || undefined,
  });

  // Mutations
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();
  const convertLead = useConvertLead();

  const leads = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, totalPages: 1 };

  // Calculate stats
  const totalValue = leads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0);
  const qualifiedCount = leads.filter((l) => l.status === 'QUALIFIED').length;
  const newLeads = leads.filter((l) => l.status === 'NEW').length;

  // Layout stats for HubLayout
  const layoutStats = useMemo(
    () => [
      createStat('Total', meta.total, Users, 'blue'),
      createStat('New', newLeads, Star, 'green'),
      createStat('Qualified', qualifiedCount, CheckCircle, 'purple'),
      createStat('Value', formatCurrency(totalValue), DollarSign, 'orange'),
    ],
    [meta.total, newLeads, qualifiedCount, totalValue]
  );

  const handleSearch = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormData(emptyLead);
    setShowAddModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (lead) => {
    setCurrentLead(lead);
    setFormData({
      title: lead.title || '',
      firstName: lead.firstName || '',
      lastName: lead.lastName || '',
      email: lead.email || '',
      phone: lead.phone || '',
      company: lead.company || '',
      source: lead.source || '',
      status: lead.status || 'NEW',
      estimatedValue: lead.estimatedValue?.toString() || '',
      notes: lead.notes || '',
    });
    setShowEditModal(true);
  };

  // Open View Sheet
  const handleOpenView = (lead) => {
    setCurrentLead(lead);
    setShowViewSheet(true);
  };

  // Open Convert Modal
  const handleOpenConvert = (lead) => {
    setCurrentLead(lead);
    setShowConvertModal(true);
  };

  // Create Lead
  const handleCreate = async () => {
    if (!formData.title) {
      toast({
        title: 'Validation Error',
        description: 'Lead title is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createLead.mutateAsync({
        ...formData,
        estimatedValue: formData.estimatedValue ? parseFloat(formData.estimatedValue) : null,
      });
      setShowAddModal(false);
      setFormData(emptyLead);
      toast({
        title: 'Lead Created',
        description: 'The lead has been created successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create lead',
        variant: 'destructive',
      });
    }
  };

  // Update Lead
  const handleUpdate = async () => {
    if (!formData.title) {
      toast({
        title: 'Validation Error',
        description: 'Lead title is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateLead.mutateAsync({
        id: currentLead.id,
        data: {
          ...formData,
          estimatedValue: formData.estimatedValue ? parseFloat(formData.estimatedValue) : null,
        },
      });
      setShowEditModal(false);
      setCurrentLead(null);
      toast({
        title: 'Lead Updated',
        description: 'The lead has been updated successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to update lead',
        variant: 'destructive',
      });
    }
  };

  // Convert Lead
  const handleConvert = async () => {
    try {
      await convertLead.mutateAsync({
        id: currentLead.id,
        createContact: true,
        createDeal: true,
      });
      setShowConvertModal(false);
      setCurrentLead(null);
      toast({
        title: 'Lead Converted',
        description: 'The lead has been converted to a contact and deal',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to convert lead',
        variant: 'destructive',
      });
    }
  };

  // Delete Lead
  const handleDelete = async (lead) => {
    if (!confirm(`Delete "${lead.title}"?`)) return;

    try {
      await deleteLead.mutateAsync(lead.id);
      toast({
        title: 'Lead Deleted',
        description: 'The lead has been deleted successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete lead',
        variant: 'destructive',
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-lg font-medium">Failed to load leads</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <Button onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  // Action buttons for HubLayout
  const actionButtons = (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 border rounded-lg p-1">
        <Button
          variant={statusFilter === 'all' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => {
            setStatusFilter('all');
            setPage(1);
          }}
        >
          All
        </Button>
        {Object.entries(statusConfig).map(([key, config]) => (
          <Button
            key={key}
            variant={statusFilter === key ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => {
              setStatusFilter(key);
              setPage(1);
            }}
          >
            {config.label}
          </Button>
        ))}
      </div>
      <Button size="sm" onClick={handleOpenAdd}>
        <Plus className="h-4 w-4 mr-2" />
        Add Lead
      </Button>
    </div>
  );

  // Main content
  const mainContent = (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Empty State */}
      {leads.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[300px] gap-4">
          <User className="h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg font-medium">No leads found</p>
          <Button onClick={handleOpenAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add your first lead
          </Button>
        </div>
      )}

      {/* Leads List */}
      {leads.length > 0 && (
        <div className="space-y-3">
          {leads.map((lead) => (
            <Card
              key={lead.id}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleOpenView(lead)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{lead.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                      {(lead.firstName || lead.lastName) && (
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {[lead.firstName, lead.lastName].filter(Boolean).join(' ')}
                        </span>
                      )}
                      {lead.company && (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {lead.company}
                        </span>
                      )}
                      {lead.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {lead.email}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          statusConfig[lead.status]?.color || 'bg-gray-100'
                        )}
                      >
                        {statusConfig[lead.status]?.label || lead.status}
                      </span>
                      {lead.source && (
                        <span className="text-sm text-muted-foreground">
                          Source: {lead.source.replace('_', ' ')}
                        </span>
                      )}
                      {lead.assignedTo && (
                        <span className="text-sm text-muted-foreground">
                          Assigned: {lead.assignedTo.displayName || lead.assignedTo.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    {lead.score && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{lead.score}</span>
                      </div>
                    )}
                    {lead.estimatedValue && (
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(lead.estimatedValue)}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {lead.status !== 'CONVERTED' && lead.status !== 'UNQUALIFIED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenConvert(lead);
                        }}
                      >
                        <ArrowRight className="h-4 w-4 mr-1" />
                        Convert
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenView(lead);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEdit(lead);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {lead.status !== 'CONVERTED' && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenConvert(lead);
                            }}
                          >
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Convert to Deal
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(lead);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Pagination */}
          <div className="flex items-center justify-between p-4">
            <span className="text-sm text-muted-foreground">
              Showing {leads.length} of {meta.total} leads
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                Page {meta.page} of {meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <HubLayout
        hubId="pipeline"
        title="Leads"
        description="Capture and qualify potential customers"
        stats={layoutStats}
        searchValue={searchQuery}
        onSearchChange={handleSearch}
        searchPlaceholder="Search leads..."
        actions={actionButtons}
        showFixedMenu={false}
      >
        {mainContent}
      </HubLayout>

      {/* Add Lead Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
            <DialogDescription>Capture a new potential customer</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Lead Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Enterprise software inquiry"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Smith"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 555 123 4567"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Company name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select
                  value={formData.source}
                  onValueChange={(value) => setFormData({ ...formData, source: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map((src) => (
                      <SelectItem key={src} value={src}>
                        {src.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedValue">Estimated Value ($)</Label>
              <Input
                id="estimatedValue"
                type="number"
                value={formData.estimatedValue}
                onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                placeholder="50000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes about this lead..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createLead.isPending}>
              {createLead.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Lead Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
            <DialogDescription>Update lead information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editTitle">Lead Title *</Label>
              <Input
                id="editTitle"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editFirstName">First Name</Label>
                <Input
                  id="editFirstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLastName">Last Name</Label>
                <Input
                  id="editLastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPhone">Phone</Label>
                <Input
                  id="editPhone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editCompany">Company</Label>
              <Input
                id="editCompany"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editSource">Source</Label>
                <Select
                  value={formData.source}
                  onValueChange={(value) => setFormData({ ...formData, source: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map((src) => (
                      <SelectItem key={src} value={src}>
                        {src.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editStatus">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editEstimatedValue">Estimated Value ($)</Label>
              <Input
                id="editEstimatedValue"
                type="number"
                value={formData.estimatedValue}
                onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editNotes">Notes</Label>
              <Textarea
                id="editNotes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateLead.isPending}>
              {updateLead.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Convert Lead Modal */}
      <Dialog open={showConvertModal} onOpenChange={setShowConvertModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Convert Lead</DialogTitle>
            <DialogDescription>Convert this lead into a contact and deal</DialogDescription>
          </DialogHeader>
          {currentLead && (
            <div className="py-4">
              <p className="text-sm text-muted-foreground mb-4">
                You are about to convert <strong>{currentLead.title}</strong> to:
              </p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>A new contact with the lead's information</li>
                <li>A new deal in your sales pipeline</li>
              </ul>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConvertModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleConvert} disabled={convertLead.isPending}>
              {convertLead.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Convert Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Lead Sheet */}
      <Sheet open={showViewSheet} onOpenChange={setShowViewSheet}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Lead Details</SheetTitle>
            <SheetDescription>View and manage lead information</SheetDescription>
          </SheetHeader>
          {currentLead && (
            <div className="mt-6 space-y-6">
              {/* Lead Header */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{currentLead.title}</h3>
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-full',
                      statusConfig[currentLead.status]?.color || 'bg-gray-100'
                    )}
                  >
                    {statusConfig[currentLead.status]?.label || currentLead.status}
                  </span>
                </div>
              </div>

              {/* Lead Info */}
              <div className="space-y-4">
                {(currentLead.firstName || currentLead.lastName) && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Contact Name</span>
                    <span className="text-sm">
                      {[currentLead.firstName, currentLead.lastName].filter(Boolean).join(' ')}
                    </span>
                  </div>
                )}
                {currentLead.email && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Email</span>
                    <span className="text-sm">{currentLead.email}</span>
                  </div>
                )}
                {currentLead.phone && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Phone</span>
                    <span className="text-sm">{currentLead.phone}</span>
                  </div>
                )}
                {currentLead.company && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Company</span>
                    <span className="text-sm">{currentLead.company}</span>
                  </div>
                )}
                {currentLead.source && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Source</span>
                    <span className="text-sm">{currentLead.source.replace('_', ' ')}</span>
                  </div>
                )}
                {currentLead.estimatedValue && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Estimated Value</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(currentLead.estimatedValue)}
                    </span>
                  </div>
                )}
                {currentLead.score && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Lead Score</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{currentLead.score}</span>
                    </div>
                  </div>
                )}
                {currentLead.notes && (
                  <div className="py-2 border-b">
                    <span className="text-sm text-muted-foreground">Notes</span>
                    <p className="text-sm mt-1">{currentLead.notes}</p>
                  </div>
                )}
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm">
                    {currentLead.createdAt
                      ? new Date(currentLead.createdAt).toLocaleDateString()
                      : '-'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowViewSheet(false);
                    handleOpenEdit(currentLead);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                {currentLead.status !== 'CONVERTED' && currentLead.status !== 'UNQUALIFIED' && (
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setShowViewSheet(false);
                      handleOpenConvert(currentLead);
                    }}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Convert
                  </Button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
