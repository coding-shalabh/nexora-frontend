'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FormInput,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  GripVertical,
  Users,
  Building2,
  Briefcase,
  Loader2,
  Type,
  Hash,
  Calendar,
  ToggleLeft,
  List,
  Mail,
  Phone,
  Link,
  DollarSign,
  AlignLeft,
  CheckSquare,
  ChevronRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import {
  useCustomFields,
  useCreateCustomField,
  useUpdateCustomField,
  useDeleteCustomField,
} from '@/hooks/use-custom-fields';
import { toast } from 'sonner';
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

const FIELD_TYPES = [
  { value: 'TEXT', label: 'Text', icon: Type, description: 'Single line text' },
  { value: 'TEXTAREA', label: 'Text Area', icon: AlignLeft, description: 'Multi-line text' },
  { value: 'NUMBER', label: 'Number', icon: Hash, description: 'Numeric value' },
  { value: 'DATE', label: 'Date', icon: Calendar, description: 'Date picker' },
  { value: 'DATETIME', label: 'Date & Time', icon: Calendar, description: 'Date and time picker' },
  { value: 'BOOLEAN', label: 'Checkbox', icon: ToggleLeft, description: 'Yes/No toggle' },
  { value: 'SELECT', label: 'Dropdown', icon: List, description: 'Single select' },
  {
    value: 'MULTISELECT',
    label: 'Multi-Select',
    icon: CheckSquare,
    description: 'Multiple selection',
  },
  { value: 'EMAIL', label: 'Email', icon: Mail, description: 'Email address' },
  { value: 'PHONE', label: 'Phone', icon: Phone, description: 'Phone number' },
  { value: 'URL', label: 'URL', icon: Link, description: 'Web address' },
  { value: 'CURRENCY', label: 'Currency', icon: DollarSign, description: 'Money amount' },
];

const ENTITY_TYPES = [
  { value: 'CONTACT', label: 'Contacts', icon: Users, color: 'blue' },
  { value: 'COMPANY', label: 'Companies', icon: Building2, color: 'green' },
  { value: 'DEAL', label: 'Deals', icon: Briefcase, color: 'orange' },
];

const getFieldTypeIcon = (type) => {
  const fieldType = FIELD_TYPES.find((f) => f.value === type);
  return fieldType?.icon || Type;
};

const getFieldTypeColor = (type) => {
  const colors = {
    TEXT: 'bg-gray-50 text-gray-600',
    TEXTAREA: 'bg-gray-50 text-gray-600',
    NUMBER: 'bg-blue-50 text-blue-600',
    DATE: 'bg-purple-50 text-purple-600',
    DATETIME: 'bg-purple-50 text-purple-600',
    BOOLEAN: 'bg-green-50 text-green-600',
    SELECT: 'bg-primary/5 text-primary',
    MULTISELECT: 'bg-primary/5 text-primary',
    EMAIL: 'bg-amber-50 text-amber-600',
    PHONE: 'bg-teal-50 text-teal-600',
    URL: 'bg-cyan-50 text-cyan-600',
    CURRENCY: 'bg-emerald-50 text-emerald-600',
  };
  return colors[type] || 'bg-gray-50 text-gray-600';
};

const initialFormData = {
  name: '',
  apiName: '',
  entityType: 'CONTACT',
  fieldType: 'TEXT',
  description: '',
  isRequired: false,
  options: [],
  defaultValue: '',
  placeholder: '',
};

export default function CustomFieldsPage() {
  const [activeTab, setActiveTab] = useState('CONTACT');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [optionsInput, setOptionsInput] = useState('');

  const { data: fieldsData, isLoading } = useCustomFields(activeTab);
  const createField = useCreateCustomField();
  const updateField = useUpdateCustomField();
  const deleteField = useDeleteCustomField();

  const fields = fieldsData?.data || [];

  const generateApiName = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .replace(/^(\d)/, 'f_$1');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      apiName: formData.apiName || generateApiName(name),
    });
  };

  const handleCreateField = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a field name');
      return;
    }

    const data = {
      ...formData,
      entityType: activeTab,
      options: optionsInput.split('\n').filter((o) => o.trim()),
    };

    try {
      await createField.mutateAsync(data);
      toast.success('Custom field created successfully');
      setShowCreateDialog(false);
      setFormData(initialFormData);
      setOptionsInput('');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create custom field');
    }
  };

  const handleEditField = (field) => {
    setSelectedField(field);
    setFormData({
      name: field.name,
      apiName: field.apiName,
      entityType: field.entityType,
      fieldType: field.fieldType,
      description: field.description || '',
      isRequired: field.isRequired || false,
      options: field.options || [],
      defaultValue: field.defaultValue || '',
      placeholder: field.placeholder || '',
    });
    setOptionsInput((field.options || []).join('\n'));
    setShowEditDialog(true);
  };

  const handleUpdateField = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a field name');
      return;
    }

    const data = {
      ...formData,
      options: optionsInput.split('\n').filter((o) => o.trim()),
    };

    try {
      await updateField.mutateAsync({ id: selectedField.id, data });
      toast.success('Custom field updated successfully');
      setShowEditDialog(false);
      setSelectedField(null);
      setFormData(initialFormData);
      setOptionsInput('');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update custom field');
    }
  };

  const handleDeleteField = (field) => {
    setSelectedField(field);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteField = async () => {
    try {
      await deleteField.mutateAsync(selectedField.id);
      toast.success('Custom field deleted successfully');
      setShowDeleteConfirm(false);
      setSelectedField(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete custom field');
    }
  };

  const filteredFields = fields.filter(
    (field) =>
      field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.apiName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fieldCounts = {
    CONTACT: fields.filter((f) => f.entityType === 'CONTACT').length,
    COMPANY: fields.filter((f) => f.entityType === 'COMPANY').length,
    DEAL: fields.filter((f) => f.entityType === 'DEAL').length,
  };

  const needsOptions = ['SELECT', 'MULTISELECT'].includes(formData.fieldType);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const FieldForm = ({ isEdit = false }) => (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="field-name" className="text-gray-700">
            Field Name *
          </Label>
          <Input
            id="field-name"
            placeholder="e.g., Customer ID"
            value={formData.name}
            onChange={handleNameChange}
            className="h-11 rounded-xl bg-gray-50 border-0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="api-name" className="text-gray-700">
            API Name
          </Label>
          <Input
            id="api-name"
            placeholder="e.g., customer_id"
            value={formData.apiName}
            onChange={(e) => setFormData({ ...formData, apiName: e.target.value })}
            className="h-11 rounded-xl bg-gray-50 border-0"
          />
          <p className="text-xs text-gray-500">Used in API requests</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700">Field Type *</Label>
        <Select
          value={formData.fieldType}
          onValueChange={(value) => setFormData({ ...formData, fieldType: value })}
        >
          <SelectTrigger className="h-11 rounded-xl bg-gray-50 border-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FIELD_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center gap-2">
                  <type.icon className="h-4 w-4 text-gray-500" />
                  <span>{type.label}</span>
                  <span className="text-xs text-gray-500">- {type.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {needsOptions && (
        <div className="space-y-2">
          <Label htmlFor="options" className="text-gray-700">
            Options (one per line) *
          </Label>
          <Textarea
            id="options"
            placeholder="Option 1&#10;Option 2&#10;Option 3"
            value={optionsInput}
            onChange={(e) => setOptionsInput(e.target.value)}
            rows={4}
            className="rounded-xl bg-gray-50 border-0"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="description" className="text-gray-700">
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="Help text for this field..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={2}
          className="rounded-xl bg-gray-50 border-0"
        />
      </div>

      <div className="grid gap-4 grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="placeholder" className="text-gray-700">
            Placeholder
          </Label>
          <Input
            id="placeholder"
            placeholder="Placeholder text..."
            value={formData.placeholder}
            onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
            className="h-11 rounded-xl bg-gray-50 border-0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="default-value" className="text-gray-700">
            Default Value
          </Label>
          <Input
            id="default-value"
            placeholder="Default value..."
            value={formData.defaultValue}
            onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
            className="h-11 rounded-xl bg-gray-50 border-0"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
        <Switch
          id="is-required"
          checked={formData.isRequired}
          onCheckedChange={(checked) => setFormData({ ...formData, isRequired: checked })}
        />
        <Label htmlFor="is-required" className="text-gray-700 cursor-pointer">
          Required field
        </Label>
      </div>
    </div>
  );

  return (
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
            <div className="h-14 w-14 rounded-2xl bg-purple-50 flex items-center justify-center">
              <FormInput className="h-7 w-7 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Custom Fields</h1>
              <p className="text-sm text-gray-500">
                Create custom properties to store additional data
              </p>
            </div>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} className="rounded-xl">
            <Plus className="mr-2 h-4 w-4" />
            Create Field
          </Button>
        </div>

        {/* Stats Bar */}
        <div className="mt-6 flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <FormInput className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{fields.length}</p>
              <p className="text-xs text-gray-500">Total Fields</p>
            </div>
          </div>
          <div className="h-10 w-px bg-gray-100" />
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{fieldCounts.CONTACT}</p>
              <p className="text-xs text-gray-500">Contacts</p>
            </div>
          </div>
          <div className="h-10 w-px bg-gray-100" />
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{fieldCounts.COMPANY}</p>
              <p className="text-xs text-gray-500">Companies</p>
            </div>
          </div>
          <div className="h-10 w-px bg-gray-100" />
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{fieldCounts.DEAL}</p>
              <p className="text-xs text-gray-500">Deals</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Entity Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-white rounded-xl p-1 shadow-sm">
              {ENTITY_TYPES.map((entity) => (
                <TabsTrigger
                  key={entity.value}
                  value={entity.value}
                  className="rounded-lg data-[state=active]:bg-gray-100"
                >
                  <entity.icon className="mr-2 h-4 w-4" />
                  {entity.label}
                  <Badge variant="secondary" className="ml-2 bg-gray-100">
                    {fieldCounts[entity.value]}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search fields..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-white border-0 shadow-sm"
              />
            </div>
          </div>

          {ENTITY_TYPES.map((entity) => (
            <TabsContent key={entity.value} value={entity.value} className="mt-0">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {filteredFields.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="h-16 w-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                      <FormInput className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium text-gray-900">No custom fields</p>
                    <p className="text-sm text-gray-500 mb-4">
                      {searchQuery
                        ? 'Try a different search term'
                        : `Create custom fields for ${entity.label.toLowerCase()}`}
                    </p>
                    {!searchQuery && (
                      <Button onClick={() => setShowCreateDialog(true)} className="rounded-xl">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Field
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {/* Header */}
                    <div className="px-6 py-3 bg-gray-50 grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="col-span-1"></div>
                      <div className="col-span-3">Field Name</div>
                      <div className="col-span-2">API Name</div>
                      <div className="col-span-2">Type</div>
                      <div className="col-span-2">Required</div>
                      <div className="col-span-1">Created</div>
                      <div className="col-span-1 text-right">Actions</div>
                    </div>

                    {/* Field Rows */}
                    {filteredFields.map((field, index) => {
                      const FieldIcon = getFieldTypeIcon(field.fieldType);
                      const fieldTypeColor = getFieldTypeColor(field.fieldType);
                      return (
                        <motion.div
                          key={field.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors"
                        >
                          <div className="col-span-1">
                            <GripVertical className="h-4 w-4 text-gray-300 cursor-move" />
                          </div>
                          <div className="col-span-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  'h-9 w-9 rounded-lg flex items-center justify-center',
                                  fieldTypeColor.split(' ')[0]
                                )}
                              >
                                <FieldIcon
                                  className={cn('h-4 w-4', fieldTypeColor.split(' ')[1])}
                                />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{field.name}</p>
                                {field.description && (
                                  <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                    {field.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-span-2">
                            <code className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                              {field.apiName}
                            </code>
                          </div>
                          <div className="col-span-2">
                            <Badge
                              variant="secondary"
                              className="bg-gray-100 text-gray-700 font-normal"
                            >
                              {FIELD_TYPES.find((f) => f.value === field.fieldType)?.label ||
                                field.fieldType}
                            </Badge>
                          </div>
                          <div className="col-span-2">
                            {field.isRequired ? (
                              <Badge className="bg-orange-50 text-orange-700 hover:bg-orange-100">
                                Required
                              </Badge>
                            ) : (
                              <span className="text-sm text-gray-400">Optional</span>
                            )}
                          </div>
                          <div className="col-span-1">
                            <span className="text-sm text-gray-500">
                              {new Date(field.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="col-span-1 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100"
                                >
                                  <MoreHorizontal className="h-4 w-4 text-gray-500" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => handleEditField(field)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Field
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteField(field)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Field
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>

      {/* Create Field Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Custom Field</DialogTitle>
            <DialogDescription>
              Add a custom field to{' '}
              {ENTITY_TYPES.find((e) => e.value === activeTab)?.label.toLowerCase()}
            </DialogDescription>
          </DialogHeader>
          <FieldForm />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                setFormData(initialFormData);
                setOptionsInput('');
              }}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateField}
              disabled={createField.isPending}
              className="rounded-xl"
            >
              {createField.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Field
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Field Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Custom Field</DialogTitle>
            <DialogDescription>Update the field configuration</DialogDescription>
          </DialogHeader>
          <FieldForm isEdit />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditDialog(false);
                setSelectedField(null);
                setFormData(initialFormData);
                setOptionsInput('');
              }}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateField}
              disabled={updateField.isPending}
              className="rounded-xl"
            >
              {updateField.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Custom Field?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the field &quot;{selectedField?.name}&quot; and remove
              all associated data from records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 rounded-xl"
              onClick={confirmDeleteField}
              disabled={deleteField.isPending}
            >
              {deleteField.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Field
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
