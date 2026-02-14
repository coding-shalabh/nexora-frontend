'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Users,
  Edit,
  Trash2,
  Copy,
  MoreHorizontal,
  Filter,
  Mail,
  Target,
  RefreshCw,
  Clock,
  Eye,
  X,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/contexts/auth-context';
import { toast } from '@/hooks/use-toast';
import { UnifiedLayout, createStat } from '@/components/layout/unified';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const segmentTypeConfig = {
  STATIC: {
    label: 'Static',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    icon: Users,
  },
  DYNAMIC: {
    label: 'Dynamic',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    icon: RefreshCw,
  },
};

// Available operators for different field types
const operatorsByType = {
  text: [
    { value: 'equals', label: 'equals' },
    { value: 'notEquals', label: 'not equals' },
    { value: 'contains', label: 'contains' },
    { value: 'notContains', label: 'not contains' },
    { value: 'startsWith', label: 'starts with' },
    { value: 'endsWith', label: 'ends with' },
    { value: 'isNull', label: 'is empty' },
    { value: 'isNotNull', label: 'is not empty' },
  ],
  select: [
    { value: 'equals', label: 'is' },
    { value: 'notEquals', label: 'is not' },
    { value: 'in', label: 'is any of' },
    { value: 'notIn', label: 'is none of' },
  ],
  number: [
    { value: 'equals', label: 'equals' },
    { value: 'notEquals', label: 'not equals' },
    { value: 'gt', label: 'greater than' },
    { value: 'gte', label: 'greater or equal' },
    { value: 'lt', label: 'less than' },
    { value: 'lte', label: 'less or equal' },
  ],
  boolean: [
    { value: 'isTrue', label: 'is true' },
    { value: 'isFalse', label: 'is false' },
  ],
  date: [
    { value: 'lessThan', label: 'in the last (days)' },
    { value: 'moreThan', label: 'more than (days ago)' },
    { value: 'equals', label: 'on date' },
  ],
  tags: [
    { value: 'contains', label: 'has tag' },
    { value: 'hasAny', label: 'has any of' },
    { value: 'hasAll', label: 'has all of' },
  ],
};

// Filter rule component
function FilterRule({ rule, fields, onUpdate, onRemove }) {
  const selectedField = fields.flat().find((f) => f.field === rule.field);
  const operators = operatorsByType[selectedField?.type || 'text'] || operatorsByType.text;

  return (
    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
      <Select
        value={rule.field}
        onValueChange={(value) => onUpdate({ ...rule, field: value, value: '' })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select field" />
        </SelectTrigger>
        <SelectContent>
          {fields.map((group, i) => (
            <div key={i}>
              {group.map((f) => (
                <SelectItem key={f.field} value={f.field}>
                  {f.label}
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={rule.operator}
        onValueChange={(value) => onUpdate({ ...rule, operator: value })}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Operator" />
        </SelectTrigger>
        <SelectContent>
          {operators.map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!['isNull', 'isNotNull', 'isTrue', 'isFalse'].includes(rule.operator) &&
        (selectedField?.type === 'select' && selectedField?.options ? (
          <Select value={rule.value} onValueChange={(value) => onUpdate({ ...rule, value })}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Value" />
            </SelectTrigger>
            <SelectContent>
              {selectedField.options.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : selectedField?.type === 'boolean' ? null : (
          <Input
            type={
              selectedField?.type === 'number' || selectedField?.type === 'date' ? 'number' : 'text'
            }
            value={rule.value || ''}
            onChange={(e) => onUpdate({ ...rule, value: e.target.value })}
            placeholder="Value"
            className="w-[150px]"
          />
        ))}

      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="h-8 w-8"
        aria-label="Remove condition"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Filter builder component
function FilterBuilder({ conditions, onChange, fields }) {
  const addRule = () => {
    onChange({
      ...conditions,
      rules: [...(conditions.rules || []), { field: '', operator: 'equals', value: '' }],
    });
  };

  const updateRule = (index, rule) => {
    const newRules = [...conditions.rules];
    newRules[index] = rule;
    onChange({ ...conditions, rules: newRules });
  };

  const removeRule = (index) => {
    onChange({
      ...conditions,
      rules: conditions.rules.filter((_, i) => i !== index),
    });
  };

  const allFields = fields
    ? [...(fields.contact || []), ...(fields.consent || []), ...(fields.engagement || [])]
    : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Match</span>
        <Select
          value={conditions.combinator || 'AND'}
          onValueChange={(value) => onChange({ ...conditions, combinator: value })}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AND">All</SelectItem>
            <SelectItem value="OR">Any</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">of the following conditions</span>
      </div>

      <div className="space-y-2">
        {conditions.rules?.map((rule, index) => (
          <FilterRule
            key={index}
            rule={rule}
            fields={[allFields]}
            onUpdate={(r) => updateRule(index, r)}
            onRemove={() => removeRule(index)}
          />
        ))}
      </div>

      <Button variant="outline" size="sm" onClick={addRule}>
        <Plus className="mr-2 h-4 w-4" />
        Add Condition
      </Button>
    </div>
  );
}

export default function CRMSegmentsPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewContactsDialog, setViewContactsDialog] = useState(null);
  const [editingSegment, setEditingSegment] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [segmentToDelete, setSegmentToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'STATIC',
    conditions: { combinator: 'AND', rules: [] },
  });

  // Fetch segments
  const { data: segmentsData, isLoading } = useQuery({
    queryKey: ['segments', typeFilter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (typeFilter !== 'all') params.append('type', typeFilter);
      if (searchQuery) params.append('search', searchQuery);
      const res = await fetch(`${API_URL}/segments?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    enabled: !!token,
  });

  // Fetch filter fields
  const { data: fieldsData } = useQuery({
    queryKey: ['segment-fields'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/segments/fields`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    enabled: !!token,
  });

  // Preview mutation
  const previewMutation = useMutation({
    mutationFn: async (conditions) => {
      const res = await fetch(`${API_URL}/segments/preview`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conditions, limit: 5 }),
      });
      return res.json();
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch(`${API_URL}/segments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Segment created successfully');
        queryClient.invalidateQueries(['segments']);
        setCreateDialogOpen(false);
        resetForm();
      } else {
        toast.error(data.error || 'Failed to create segment');
      }
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await fetch(`${API_URL}/segments/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Segment updated successfully');
        queryClient.invalidateQueries(['segments']);
        setEditingSegment(null);
        resetForm();
      } else {
        toast.error(data.error || 'Failed to update segment');
      }
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${API_URL}/segments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Segment deleted');
        queryClient.invalidateQueries(['segments']);
      } else {
        toast.error(data.error || 'Failed to delete segment');
      }
    },
  });

  // Sync mutation
  const syncMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${API_URL}/segments/${id}/sync`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Segment synced');
        queryClient.invalidateQueries(['segments']);
      } else {
        toast.error(data.error || 'Failed to sync segment');
      }
    },
  });

  // Duplicate mutation
  const duplicateMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${API_URL}/segments/${id}/duplicate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Segment duplicated');
        queryClient.invalidateQueries(['segments']);
      } else {
        toast.error(data.error || 'Failed to duplicate segment');
      }
    },
  });

  // Fetch contacts in segment
  const { data: contactsData, isLoading: loadingContacts } = useQuery({
    queryKey: ['segment-contacts', viewContactsDialog],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/segments/${viewContactsDialog}/contacts?limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    enabled: !!viewContactsDialog && !!token,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'STATIC',
      conditions: { combinator: 'AND', rules: [] },
    });
  };

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const handleUpdate = () => {
    if (editingSegment) {
      updateMutation.mutate({ id: editingSegment.id, data: formData });
    }
  };

  const handlePreview = () => {
    if (formData.type === 'DYNAMIC' && formData.conditions.rules?.length > 0) {
      previewMutation.mutate(formData.conditions);
    }
  };

  const openEdit = (segment) => {
    setEditingSegment(segment);
    setFormData({
      name: segment.name,
      description: segment.description || '',
      type: segment.type,
      conditions: segment.conditions || { combinator: 'AND', rules: [] },
    });
  };

  const confirmDelete = (segment) => {
    setSegmentToDelete(segment);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (segmentToDelete) {
      deleteMutation.mutate(segmentToDelete.id);
      setDeleteConfirmOpen(false);
      setSegmentToDelete(null);
    }
  };

  const segments = segmentsData?.data || [];
  const counts = segmentsData?.counts || { total: 0, static: 0, dynamic: 0 };
  const fields = fieldsData?.data || {};

  const filteredSegments = segments.filter((segment) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !segment.name.toLowerCase().includes(q) &&
        !segment.description?.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const totalContacts = segments.reduce((sum, s) => sum + (s.contactCount || 0), 0);

  // Stats for UnifiedLayout - using hubId="crm" for CRM context
  const hubStats = [
    createStat('Total', counts.total || 0, Filter, 'purple'),
    createStat('Contacts', totalContacts, Users, 'blue'),
    createStat('Static', counts.static || 0, Users, 'green'),
    createStat('Dynamic', counts.dynamic || 0, RefreshCw, 'amber'),
  ];

  return (
    <>
      <UnifiedLayout hubId="crm" pageTitle="Contact Segments" stats={hubStats} fixedMenu={null}>
        <div className="h-full overflow-y-auto p-6">
          {/* Search and filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search segments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="STATIC">Static</SelectItem>
                <SelectItem value="DYNAMIC">Dynamic</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Segment
            </Button>
          </div>

          {/* Segments grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredSegments.length === 0 ? (
            <div className="p-12 text-center">
              <Filter className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No segments found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || typeFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first segment to organize your contacts'}
              </p>
              {!searchQuery && typeFilter === 'all' && (
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Segment
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSegments.map((segment) => {
                const TypeIcon = segmentTypeConfig[segment.type]?.icon || Users;
                return (
                  <Card key={segment.id} className="group relative">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{segment.name}</CardTitle>
                          <CardDescription className="mt-2">{segment.description}</CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              aria-label="More options"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(segment)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Segment
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setViewContactsDialog(segment.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Contacts
                            </DropdownMenuItem>
                            {segment.type === 'DYNAMIC' && (
                              <DropdownMenuItem onClick={() => syncMutation.mutate(segment.id)}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Sync Now
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => duplicateMutation.mutate(segment.id)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Target className="mr-2 h-4 w-4" />
                              Create Campaign
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => confirmDelete(segment)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge className={segmentTypeConfig[segment.type]?.className}>
                            <TypeIcon className="mr-1 h-3 w-3" />
                            {segmentTypeConfig[segment.type]?.label}
                          </Badge>
                          <div className="text-sm">
                            <span className="font-bold">
                              {(segment.contactCount || 0).toLocaleString()}
                            </span>
                            <span className="text-muted-foreground ml-1">contacts</span>
                          </div>
                        </div>

                        {segment.type === 'DYNAMIC' && segment.conditions?.rules?.length > 0 && (
                          <div className="space-y-1">
                            <div className="text-xs font-medium text-muted-foreground">
                              Conditions
                            </div>
                            <div className="text-xs bg-muted p-2 rounded">
                              {segment.conditions.rules.length} rule
                              {segment.conditions.rules.length !== 1 ? 's' : ''} (
                              {segment.conditions.combinator})
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Updated {new Date(segment.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setViewContactsDialog(segment.id)}
                          >
                            <Users className="mr-2 h-3 w-3" />
                            View Contacts
                          </Button>
                          <Button size="sm" className="flex-1">
                            <Mail className="mr-2 h-3 w-3" />
                            Send Email
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </UnifiedLayout>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Segment
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{segmentToDelete?.name}&quot;? This action
              cannot be undone. The contacts in this segment will not be deleted, only the segment
              itself.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Segment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create/Edit Segment Dialog */}
      <Dialog
        open={createDialogOpen || !!editingSegment}
        onOpenChange={(open) => {
          if (!open) {
            setCreateDialogOpen(false);
            setEditingSegment(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSegment ? 'Edit Segment' : 'Create New Segment'}</DialogTitle>
            <DialogDescription>
              {formData.type === 'STATIC'
                ? 'Static segments contain a fixed list of contacts'
                : 'Dynamic segments automatically update based on filter conditions'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Segment Name</Label>
                <Input
                  placeholder="e.g., High-Value Customers"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Segment Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                  disabled={!!editingSegment}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STATIC">Static (Manual selection)</SelectItem>
                    <SelectItem value="DYNAMIC">Dynamic (Auto-updating)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe this segment..."
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {formData.type === 'DYNAMIC' && (
              <>
                <div className="border-t pt-4">
                  <Label className="mb-4 block">Filter Conditions</Label>
                  <FilterBuilder
                    conditions={formData.conditions}
                    onChange={(conditions) => setFormData({ ...formData, conditions })}
                    fields={fields}
                  />
                </div>

                {formData.conditions.rules?.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreview}
                      disabled={previewMutation.isPending}
                    >
                      {previewMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Eye className="mr-2 h-4 w-4" />
                      )}
                      Preview Contacts
                    </Button>
                    {previewMutation.data?.data && (
                      <span className="text-sm text-muted-foreground">
                        {previewMutation.data.data.total.toLocaleString()} contacts match
                      </span>
                    )}
                  </div>
                )}

                {previewMutation.data?.data?.contacts?.length > 0 && (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewMutation.data.data.contacts.map((contact) => (
                          <TableRow key={contact.id}>
                            <TableCell>
                              {contact.firstName} {contact.lastName}
                            </TableCell>
                            <TableCell>{contact.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{contact.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialogOpen(false);
                setEditingSegment(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={editingSegment ? handleUpdate : handleCreate}
              disabled={!formData.name || createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingSegment ? 'Update Segment' : 'Create Segment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Contacts Dialog */}
      <Dialog
        open={!!viewContactsDialog}
        onOpenChange={(open) => !open && setViewContactsDialog(null)}
      >
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Segment Contacts</DialogTitle>
            <DialogDescription>
              {contactsData?.pagination?.total || 0} contacts in this segment
            </DialogDescription>
          </DialogHeader>

          {loadingContacts ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : contactsData?.data?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Stage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contactsData.data.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">
                      {contact.firstName} {contact.lastName}
                    </TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{contact.status}</Badge>
                    </TableCell>
                    <TableCell>{contact.lifecycleStage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No contacts in this segment
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewContactsDialog(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
