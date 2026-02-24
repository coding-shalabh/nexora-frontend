'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { sanitizeHtml } from '@/lib/sanitize';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  MessageSquare,
  Zap,
  Copy,
  MoreHorizontal,
  AlertTriangle,
  Eye,
  Folder,
  FolderPlus,
  Star,
  StarOff,
  ArrowUpDown,
  Keyboard,
  Clock,
  Users,
  Lock,
  Loader2,
  RefreshCw,
  ArrowLeft,
  X,
  Check,
  Sparkles,
  Hash,
  FileText,
  Send,
  ChevronRight,
  Calendar,
  User,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
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
import { useToast } from '@/hooks/use-toast';
import {
  useCannedResponses,
  useCannedResponseCategories,
  useCreateCannedResponse,
  useUpdateCannedResponse,
  useDeleteCannedResponse,
  useCreateCannedResponseCategory,
} from '@/hooks/use-inbox-agent';

// Category color schemes
const categoryColors = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
    gradient: 'from-blue-500 to-blue-600',
  },
  green: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-200',
    dot: 'bg-purple-500',
    gradient: 'from-purple-500 to-purple-600',
  },
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    border: 'border-orange-200',
    dot: 'bg-orange-500',
    gradient: 'from-orange-500 to-orange-600',
  },
  pink: {
    bg: 'bg-pink-50',
    text: 'text-pink-600',
    border: 'border-pink-200',
    dot: 'bg-pink-500',
    gradient: 'from-pink-500 to-pink-600',
  },
  cyan: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-600',
    border: 'border-cyan-200',
    dot: 'bg-cyan-500',
    gradient: 'from-cyan-500 to-cyan-600',
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
    dot: 'bg-red-500',
    gradient: 'from-red-500 to-red-600',
  },
  yellow: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    gradient: 'from-amber-500 to-amber-600',
  },
  gray: {
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
    dot: 'bg-slate-500',
    gradient: 'from-slate-500 to-slate-600',
  },
};

// Response Form Component
function ResponseForm({ response, onSubmit, onCancel, isSubmitting, categories }) {
  const [formData, setFormData] = useState({
    title: response?.title || '',
    shortcut: response?.shortcut || '',
    content: response?.content || '',
    category: response?.categoryId || '',
    visibility: (response?.visibility || 'TEAM').toLowerCase(),
  });

  const extractVariables = (content) => {
    const matches = content.match(/\{\{([^}]+)\}\}/g) || [];
    return matches.map((m) => m.replace(/\{\{|\}\}/g, ''));
  };

  const variables = extractVariables(formData.content);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      variables,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      {/* Form Header */}
      <div className="flex items-center justify-between p-6 border-b shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            {response ? (
              <Edit className="h-5 w-5 text-white" />
            ) : (
              <Plus className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <h2 className="font-semibold">{response ? 'Edit Response' : 'Create Response'}</h2>
            <p className="text-sm text-muted-foreground">
              {response ? 'Update your canned response' : 'Add a new quick reply template'}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Title & Shortcut */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="e.g., Welcome Message"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="h-11"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              Shortcut
            </label>
            <Input
              placeholder="/welcome"
              value={formData.shortcut}
              onChange={(e) => setFormData({ ...formData, shortcut: e.target.value })}
              className="h-11 font-mono"
            />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            Message Content <span className="text-destructive">*</span>
          </label>
          <Textarea
            placeholder="Hello {{name}}! Welcome to our support. How can I help you today?"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={6}
            className="resize-none"
            required
          />
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Use {'{{variable}}'} syntax for dynamic placeholders
          </p>
        </div>

        {/* Variables Preview */}
        {variables.length > 0 && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/10">
            <label className="text-sm font-medium flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-primary" />
              Detected Variables
            </label>
            <div className="flex flex-wrap gap-2">
              {variables.map((v) => (
                <span
                  key={v}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white border shadow-sm font-mono text-sm"
                >
                  <span className="text-primary">{'{'}</span>
                  <span className="text-purple-600">{v}</span>
                  <span className="text-primary">{'}'}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Category & Visibility */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Folder className="h-4 w-4 text-muted-foreground" />
              Category
            </label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <span className="mr-2">{cat.icon}</span> {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Visibility
            </label>
            <Select
              value={formData.visibility}
              onValueChange={(value) => setFormData({ ...formData, visibility: value })}
            >
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="team">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" /> Team (Everyone)
                  </div>
                </SelectItem>
                <SelectItem value="personal">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" /> Personal (Only me)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
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
          ) : response ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Create Response
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

// Response Preview Component
function ResponsePreview({ response, onEdit, onDuplicate, onDelete, onCopy, categories, onClose }) {
  const getCategoryInfo = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat || { name: 'Uncategorized', icon: '📁', color: 'gray' };
  };

  const getCategoryColors = (categoryOrId) => {
    const category =
      typeof categoryOrId === 'string' ? getCategoryInfo(categoryOrId) : categoryOrId;
    return categoryColors[category?.color] || categoryColors.gray;
  };

  const extractVariables = (content) => {
    const matches = content.match(/\{\{([^}]+)\}\}/g) || [];
    return matches.map((m) => m.replace(/\{\{|\}\}/g, ''));
  };

  const category = getCategoryInfo(response.categoryId);
  const colors = getCategoryColors(response.categoryId);
  const variables = extractVariables(response.content || '');

  // Highlight variables in content
  const highlightedContent = (response.content || '').replace(
    /\{\{([^}]+)\}\}/g,
    '<span class="px-1 py-0.5 rounded bg-primary/10 text-primary font-medium">{{$1}}</span>'
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header with gradient background */}
      <div className={cn('relative overflow-hidden shrink-0')}>
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-r opacity-10',
            `from-${category.color || 'blue'}-500 to-${category.color || 'blue'}-600`
          )}
          style={{
            background: `linear-gradient(135deg, ${colors.dot.replace('bg-', 'var(--')}20 0%, ${colors.dot.replace('bg-', 'var(--')}05 100%)`,
          }}
        />
        <div className="relative p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  'h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg',
                  colors.bg,
                  'border',
                  colors.border
                )}
              >
                <span className="text-2xl">{category.icon}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold">{response.title}</h2>
                  {response.isFavorite && (
                    <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium',
                      colors.bg,
                      colors.text,
                      'border',
                      colors.border
                    )}
                  >
                    {category.icon} {category.name}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono border border-slate-200">
                    <Keyboard className="h-3 w-3" />
                    {response.shortcut}
                  </span>
                  {response.visibility === 'PERSONAL' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs border border-amber-200">
                      <Lock className="h-3 w-3" />
                      Personal
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDuplicate}>
                    <Copy className="h-4 w-4 mr-2" /> Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onDelete} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Message Content Card */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Message Content
          </label>
          <div className="relative">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200">
              <p
                className="text-sm leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(highlightedContent) }}
              />
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-3 right-3"
              onClick={onCopy}
            >
              <Copy className="h-3.5 w-3.5 mr-1.5" />
              Copy
            </Button>
          </div>
        </div>

        {/* Variables */}
        {variables.length > 0 && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Dynamic Variables ({variables.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {variables.map((v, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/10"
                >
                  <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{i + 1}</span>
                  </div>
                  <span className="font-mono text-sm">{`{{${v}}}`}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/30 border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">{response.usageCount || 0}</p>
                <p className="text-xs text-blue-600/70">Times Used</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/30 border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-700">
                  {response.createdAt
                    ? new Date(response.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'N/A'}
                </p>
                <p className="text-xs text-emerald-600/70">Created</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/30 border border-purple-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-purple-700 truncate max-w-[100px]">
                  {response.createdBy?.name || 'Unknown'}
                </p>
                <p className="text-xs text-purple-600/70">Created By</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t shrink-0 bg-slate-50/50">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 h-11" onClick={onCopy}>
            <Copy className="h-4 w-4 mr-2" />
            Copy to Clipboard
          </Button>
          <Button className="flex-1 h-11" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Response
          </Button>
        </div>
      </div>
    </div>
  );
}

// Response List Item Component
function ResponseListItem({ response, isSelected, onClick, category, colors }) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        'w-full p-4 text-left transition-all rounded-xl mx-2 mb-2',
        isSelected
          ? 'bg-primary/5 ring-2 ring-primary/20 shadow-sm'
          : 'hover:bg-slate-50 border border-transparent hover:border-slate-200'
      )}
      style={{ width: 'calc(100% - 16px)' }}
    >
      <div className="flex gap-3">
        {/* Category Icon */}
        <div
          className={cn(
            'h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm',
            colors.bg,
            'border',
            colors.border
          )}
        >
          <span className="text-lg">{category.icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm truncate">{response.title}</span>
            {response.isFavorite && (
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
            )}
          </div>

          {/* Shortcut & Category */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono">
              {response.shortcut}
            </span>
            <span className={cn('text-[10px]', colors.text)}>{category.name}</span>
          </div>

          {/* Content Preview */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {response.content}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              {response.usageCount || 0} uses
            </span>
            {response.visibility === 'PERSONAL' && (
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-600">
                <Lock className="h-3 w-3" />
                Personal
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight
          className={cn(
            'h-5 w-5 shrink-0 transition-colors mt-3',
            isSelected ? 'text-primary' : 'text-muted-foreground/30'
          )}
        />
      </div>
    </motion.button>
  );
}

export default function CannedResponsesPage() {
  const { toast } = useToast();

  // API hooks
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterVisibility, setFilterVisibility] = useState('all');
  const [sortBy, setSortBy] = useState('usage');

  // Build filters for API
  const apiFilters = useMemo(
    () => ({
      categoryId: filterCategory !== 'all' ? filterCategory : undefined,
      visibility: filterVisibility !== 'all' ? filterVisibility.toUpperCase() : undefined,
      search: searchQuery || undefined,
    }),
    [filterCategory, filterVisibility, searchQuery]
  );

  // Fetch data from API
  const {
    data: responsesData,
    isLoading: isLoadingResponses,
    isError: isResponsesError,
    refetch: refetchResponses,
  } = useCannedResponses(apiFilters);

  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    isError: isCategoriesError,
    refetch: refetchCategories,
  } = useCannedResponseCategories();

  // Mutations
  const createResponseMutation = useCreateCannedResponse();
  const updateResponseMutation = useUpdateCannedResponse();
  const deleteResponseMutation = useDeleteCannedResponse();
  const createCategoryMutation = useCreateCannedResponseCategory();

  // Transform API data
  const responses = responsesData?.data || [];
  const categories = categoriesData?.data || [];

  // View states
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [editingResponse, setEditingResponse] = useState(null);
  const [deletingResponse, setDeletingResponse] = useState(null);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    icon: '📁',
    color: 'blue',
  });

  // Sort responses locally
  const filteredResponses = useMemo(() => {
    let result = [...responses];
    result.sort((a, b) => {
      switch (sortBy) {
        case 'usage':
          return (b.usageCount || 0) - (a.usageCount || 0);
        case 'name':
          return (a.title || '').localeCompare(b.title || '');
        case 'shortcut':
          return (a.shortcut || '').localeCompare(b.shortcut || '');
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });
    return result;
  }, [responses, sortBy]);

  // Stats
  const stats = useMemo(
    () => ({
      total: responses.length,
      totalUsage: responses.reduce((sum, r) => sum + (r.usageCount || 0), 0),
      favorites: responses.filter((r) => r.isFavorite).length,
      personal: responses.filter((r) => r.visibility === 'PERSONAL').length,
    }),
    [responses]
  );

  // Helper functions
  const getCategoryInfo = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat || { name: 'Uncategorized', icon: '📁', color: 'gray' };
  };

  const getCategoryColors = (categoryOrId) => {
    const category =
      typeof categoryOrId === 'string' ? getCategoryInfo(categoryOrId) : categoryOrId;
    return categoryColors[category?.color] || categoryColors.gray;
  };

  const isLoading = isLoadingResponses || isLoadingCategories;
  const isError = isResponsesError || isCategoriesError;

  // CRUD Operations
  const handleCreate = async (data) => {
    try {
      await createResponseMutation.mutateAsync({
        title: data.title.trim(),
        shortcut: data.shortcut.trim() || `/${data.title.toLowerCase().replace(/\s+/g, '')}`,
        content: data.content.trim(),
        categoryId: data.category || undefined,
        visibility: data.visibility.toUpperCase(),
      });
      setViewMode('list');
      toast({ title: 'Response Created', description: `"${data.title}" has been created.` });
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateResponseMutation.mutateAsync({
        id: editingResponse.id,
        title: data.title.trim(),
        shortcut: data.shortcut.trim(),
        content: data.content.trim(),
        categoryId: data.category || null,
        visibility: data.visibility.toUpperCase(),
      });
      setSelectedResponse({ ...editingResponse, ...data });
      setViewMode('preview');
      setEditingResponse(null);
      toast({ title: 'Response Updated', description: 'Response has been updated.' });
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deletingResponse) return;
    try {
      await deleteResponseMutation.mutateAsync(deletingResponse.id);
      if (selectedResponse?.id === deletingResponse.id) {
        setSelectedResponse(null);
        setViewMode('list');
      }
      setDeletingResponse(null);
      toast({ title: 'Response Deleted', description: `"${deletingResponse.title}" deleted.` });
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDuplicate = async (response) => {
    try {
      await createResponseMutation.mutateAsync({
        title: `${response.title} (Copy)`,
        shortcut: `${response.shortcut}-copy`,
        content: response.content,
        categoryId: response.categoryId || undefined,
        visibility: response.visibility,
      });
      toast({ title: 'Response Duplicated', description: `"${response.title} (Copy)" created.` });
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleCreateCategory = async () => {
    if (!categoryForm.name.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Category name required' });
      return;
    }
    try {
      await createCategoryMutation.mutateAsync({
        name: categoryForm.name.trim(),
        icon: categoryForm.icon,
        color: categoryForm.color,
      });
      setShowCategoryDialog(false);
      setCategoryForm({ name: '', icon: '📁', color: 'blue' });
      toast({ title: 'Category Created', description: `"${categoryForm.name}" created.` });
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    toast({ title: 'Copied!', description: 'Response copied to clipboard' });
  };

  const openPreview = (response) => {
    setSelectedResponse(response);
    setViewMode('preview');
  };

  const openEdit = (response) => {
    setEditingResponse(response);
    setViewMode('edit');
  };

  const openCreate = () => {
    setEditingResponse(null);
    setViewMode('create');
  };

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="h-16 w-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="font-semibold text-lg mb-2">Failed to load responses</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Please check your connection and try again.
        </p>
        <Button
          onClick={() => {
            refetchResponses();
            refetchCategories();
          }}
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      {/* Top Header with Search */}
      <div className="flex items-center px-4 py-3 shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search responses by title, shortcut or content..."
            className="pl-10 h-10 bg-white border-gray-200 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content Area - 3 Box Layout */}
      <div className="flex flex-1 gap-2 px-2 pb-2 overflow-hidden">
        {/* Left Panel - Response List */}
        <aside className="relative flex flex-col shrink-0 rounded-3xl w-[340px] bg-white shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold">Canned Responses</h2>
                <p className="text-xs text-muted-foreground">
                  {filteredResponses.length} quick replies
                </p>
              </div>
              <div className="flex gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowCategoryDialog(true)}
                  className="h-8 w-8 p-0"
                >
                  <FolderPlus className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={openCreate}
                  className="h-8 w-8 p-0"
                  title="Add new response"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 text-center">
                <p className="text-lg font-bold text-blue-600">{stats.total}</p>
                <p className="text-[10px] text-blue-600/70">Total</p>
              </div>
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 text-center">
                <p className="text-lg font-bold text-emerald-600">{stats.totalUsage}</p>
                <p className="text-[10px] text-emerald-600/70">Uses</p>
              </div>
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 text-center">
                <p className="text-lg font-bold text-amber-600">{stats.favorites}</p>
                <p className="text-[10px] text-amber-600/70">Starred</p>
              </div>
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 text-center">
                <p className="text-lg font-bold text-purple-600">{stats.personal}</p>
                <p className="text-[10px] text-purple-600/70">Personal</p>
              </div>
            </div>
          </div>

          {/* Visibility Filter Tabs */}
          <div className="px-4 py-2 border-b shrink-0">
            <Tabs value={filterVisibility} onValueChange={setFilterVisibility}>
              <TabsList className="w-full h-9 bg-slate-100 p-1">
                <TabsTrigger value="all" className="flex-1 text-xs h-7 rounded-md">
                  All
                </TabsTrigger>
                <TabsTrigger value="team" className="flex-1 text-xs h-7 rounded-md">
                  <Users className="h-3 w-3 mr-1" />
                  Team
                </TabsTrigger>
                <TabsTrigger value="personal" className="flex-1 text-xs h-7 rounded-md">
                  <Lock className="h-3 w-3 mr-1" />
                  Personal
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Category Filter + Sort */}
          <div className="px-4 py-2 border-b shrink-0 flex gap-2">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="h-8 text-xs flex-1">
                <Folder className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">
                  All Categories
                </SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id} className="text-xs">
                    <span className="mr-1">{cat.icon}</span> {cat.name}
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
                <SelectItem value="usage" className="text-xs">
                  Most Used
                </SelectItem>
                <SelectItem value="name" className="text-xs">
                  Name A-Z
                </SelectItem>
                <SelectItem value="newest" className="text-xs">
                  Newest
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Response List */}
          <div className="flex-1 overflow-y-auto py-2">
            {isLoading ? (
              <div className="px-4 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-4 rounded-xl border">
                    <div className="flex gap-3">
                      <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-20 mb-2" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredResponses.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-slate-400" />
                </div>
                <p className="font-medium mb-1">No responses found</p>
                <p className="text-xs text-muted-foreground mb-4">
                  {searchQuery ? 'Try a different search term' : 'Create your first quick reply'}
                </p>
                {!searchQuery && (
                  <Button size="sm" onClick={openCreate}>
                    <Plus className="h-4 w-4 mr-1" /> Create Response
                  </Button>
                )}
              </div>
            ) : (
              filteredResponses.map((response) => {
                const category = getCategoryInfo(response.categoryId);
                const colors = getCategoryColors(response.categoryId);
                const isSelected = selectedResponse?.id === response.id && viewMode === 'preview';

                return (
                  <ResponseListItem
                    key={response.id}
                    response={response}
                    isSelected={isSelected}
                    onClick={() => openPreview(response)}
                    category={category}
                    colors={colors}
                  />
                );
              })
            )}
          </div>
        </aside>

        {/* Right Panel - Content Area */}
        <div className="flex-1 w-full flex flex-col bg-white dark:bg-card min-w-0 min-h-0 rounded-3xl shadow-sm overflow-hidden">
          <AnimatePresence mode="wait">
            {viewMode === 'create' && (
              <motion.div
                key="create"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <ResponseForm
                  onSubmit={handleCreate}
                  onCancel={() => setViewMode('list')}
                  isSubmitting={createResponseMutation.isPending}
                  categories={categories}
                />
              </motion.div>
            )}

            {viewMode === 'edit' && editingResponse && (
              <motion.div
                key="edit"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <ResponseForm
                  response={editingResponse}
                  onSubmit={handleUpdate}
                  onCancel={() => {
                    setViewMode(selectedResponse ? 'preview' : 'list');
                    setEditingResponse(null);
                  }}
                  isSubmitting={updateResponseMutation.isPending}
                  categories={categories}
                />
              </motion.div>
            )}

            {viewMode === 'preview' && selectedResponse && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <ResponsePreview
                  response={selectedResponse}
                  onEdit={() => openEdit(selectedResponse)}
                  onDuplicate={() => handleDuplicate(selectedResponse)}
                  onDelete={() => setDeletingResponse(selectedResponse)}
                  onCopy={() => copyToClipboard(selectedResponse.content)}
                  categories={categories}
                  onClose={() => {
                    setSelectedResponse(null);
                    setViewMode('list');
                  }}
                />
              </motion.div>
            )}

            {(viewMode === 'list' || (!selectedResponse && viewMode === 'preview')) && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full p-8"
              >
                <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center mb-6">
                  <MessageSquare className="h-12 w-12 text-primary/50" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Canned Responses</h3>
                <p className="text-muted-foreground text-center max-w-sm mb-6">
                  Save time with pre-written responses. Select a response from the list or create a
                  new one.
                </p>
                <Button onClick={openCreate} size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Create New Response
                </Button>

                {/* Tips */}
                <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg">
                  <div className="text-center p-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-2">
                      <Keyboard className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-xs text-muted-foreground">Use shortcuts for quick access</p>
                  </div>
                  <div className="text-center p-3">
                    <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-2">
                      <Zap className="h-5 w-5 text-purple-600" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Add variables for personalization
                    </p>
                  </div>
                  <div className="text-center p-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                      <Folder className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="text-xs text-muted-foreground">Organize with categories</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingResponse} onOpenChange={() => setDeletingResponse(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              Delete Response
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2">
              Are you sure you want to delete <strong>"{deletingResponse?.title}"</strong>? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteResponseMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteResponseMutation.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteResponseMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Category Dialog */}
      <Dialog
        open={showCategoryDialog}
        onOpenChange={(open) => {
          setShowCategoryDialog(open);
          if (!open) setCategoryForm({ name: '', icon: '📁', color: 'blue' });
        }}
      >
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FolderPlus className="h-5 w-5 text-primary" />
              </div>
              Create Category
            </DialogTitle>
            <DialogDescription>
              Organize your canned responses into categories for easier access.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Category Name <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="e.g., Technical Support"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Icon</label>
              <div className="grid grid-cols-6 gap-2">
                {['📁', '👋', '🛠️', '💼', '💳', '✅', '📞', '📧', '🎯', '💡', '🔔', '⚡'].map(
                  (emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setCategoryForm({ ...categoryForm, icon: emoji })}
                      className={cn(
                        'h-11 w-full text-xl rounded-xl border-2 transition-all hover:scale-105',
                        categoryForm.icon === emoji
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-transparent bg-slate-50 hover:bg-slate-100'
                      )}
                    >
                      {emoji}
                    </button>
                  )
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Color</label>
              <div className="grid grid-cols-9 gap-2">
                {Object.keys(categoryColors).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setCategoryForm({ ...categoryForm, color })}
                    className={cn(
                      'h-8 w-8 rounded-full transition-all hover:scale-110',
                      categoryColors[color].dot,
                      categoryForm.color === color && 'ring-2 ring-offset-2 ring-primary'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCategoryDialog(false)}
              disabled={createCategoryMutation.isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateCategory} disabled={createCategoryMutation.isPending}>
              {createCategoryMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" /> Create Category
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
