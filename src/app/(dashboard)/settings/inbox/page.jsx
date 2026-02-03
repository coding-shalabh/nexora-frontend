'use client';

import { useState } from 'react';
import {
  Inbox,
  Settings2,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Zap,
  Users,
  User,
  Loader2,
  AlertCircle,
  ChevronRight,
  RefreshCw,
  ArrowUpDown,
  MessageSquare,
  Mail,
  Phone,
  Building2,
  Clock,
  Timer,
  Shield,
  Star,
  Bell,
  ArrowUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  useAutoAssignmentRules,
  useCreateAutoAssignmentRule,
  useUpdateAutoAssignmentRule,
  useDeleteAutoAssignmentRule,
  useInboxTeams,
  useSLAPolicies,
  useCreateSLAPolicy,
  useUpdateSLAPolicy,
  useDeleteSLAPolicy,
} from '@/hooks/use-inbox-agent';

// Channel Icons
const ChannelIcon = ({ channel, className }) => {
  switch (channel) {
    case 'WHATSAPP':
      return <MessageSquare className={className} />;
    case 'EMAIL':
      return <Mail className={className} />;
    case 'SMS':
      return <Phone className={className} />;
    default:
      return <Inbox className={className} />;
  }
};

// Assignment type labels
const assignmentTypeLabels = {
  USER: { label: 'Specific User', icon: User, description: 'Assign to a specific team member' },
  TEAM: { label: 'Team', icon: Building2, description: 'Assign to a team for routing' },
  ROUND_ROBIN: { label: 'Round Robin', icon: RefreshCw, description: 'Rotate between team members' },
  LEAST_BUSY: { label: 'Least Busy', icon: ArrowUpDown, description: 'Assign to agent with fewest active conversations' },
};

// Priority levels
const priorityLevels = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

// Time presets for SLA
const timePresets = [
  { label: '15 minutes', value: 15 },
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '2 hours', value: 120 },
  { label: '4 hours', value: 240 },
  { label: '8 hours', value: 480 },
  { label: '24 hours', value: 1440 },
  { label: '48 hours', value: 2880 },
];

// Format minutes to readable time
const formatTime = (minutes) => {
  if (!minutes) return 'Not set';
  if (minutes < 60) return `${minutes} min`;
  if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  const days = Math.floor(minutes / 1440);
  const remainingHours = Math.floor((minutes % 1440) / 60);
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
};

// Default SLA policy form
const defaultSLAForm = {
  name: '',
  description: '',
  isDefault: false,
  isActive: true,
  firstResponseTime: 60,
  firstResponseBreach: null,
  resolutionTime: 1440,
  resolutionBreach: null,
  useBusinessHours: true,
  businessHoursConfig: null,
  priorityOverrides: {},
  escalationEnabled: false,
  escalationConfig: null,
};

// Default rule form
const defaultRuleForm = {
  name: '',
  description: '',
  priority: 0,
  isActive: true,
  conditions: {
    channel: null,
    keywords: [],
    businessHours: null,
    priority: null,
  },
  assignToType: 'TEAM',
  assignToUserId: null,
  assignToTeamId: null,
  roundRobinConfig: null,
};

export default function InboxSettingsPage() {
  const { toast } = useToast();

  // Auto-assignment rules state
  const [showRuleDialog, setShowRuleDialog] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [deletingRule, setDeletingRule] = useState(null);
  const [ruleForm, setRuleForm] = useState(defaultRuleForm);
  const [keywordInput, setKeywordInput] = useState('');

  // SLA policies state
  const [showSLADialog, setShowSLADialog] = useState(false);
  const [editingSLA, setEditingSLA] = useState(null);
  const [deletingSLA, setDeletingSLA] = useState(null);
  const [slaForm, setSLAForm] = useState(defaultSLAForm);

  // Fetch data
  const { data: rulesData, isLoading: rulesLoading, refetch: refetchRules } = useAutoAssignmentRules();
  const { data: teamsData } = useInboxTeams();
  const { data: slaData, isLoading: slaLoading } = useSLAPolicies();

  // Mutations
  const createRule = useCreateAutoAssignmentRule();
  const updateRule = useUpdateAutoAssignmentRule();
  const deleteRule = useDeleteAutoAssignmentRule();

  // SLA mutations
  const createSLA = useCreateSLAPolicy();
  const updateSLA = useUpdateSLAPolicy();
  const deleteSLA = useDeleteSLAPolicy();

  const rules = rulesData?.data || [];
  const teams = teamsData?.data || [];
  const slaPolicies = slaData?.data || [];

  // Open dialog for new rule
  const handleNewRule = () => {
    setEditingRule(null);
    setRuleForm(defaultRuleForm);
    setKeywordInput('');
    setShowRuleDialog(true);
  };

  // Open dialog for editing
  const handleEditRule = (rule) => {
    setEditingRule(rule);
    setRuleForm({
      name: rule.name,
      description: rule.description || '',
      priority: rule.priority,
      isActive: rule.isActive,
      conditions: {
        channel: rule.conditions?.channel || null,
        keywords: rule.conditions?.keywords || [],
        businessHours: rule.conditions?.businessHours ?? null,
        priority: rule.conditions?.priority || null,
      },
      assignToType: rule.assignToType,
      assignToUserId: rule.assignToUserId,
      assignToTeamId: rule.assignToTeamId,
      roundRobinConfig: rule.roundRobinConfig,
    });
    setKeywordInput('');
    setShowRuleDialog(true);
  };

  // Toggle rule active status
  const handleToggleActive = async (rule) => {
    try {
      await updateRule.mutateAsync({
        id: rule.id,
        data: { isActive: !rule.isActive },
      });
      toast({
        title: rule.isActive ? 'Rule disabled' : 'Rule enabled',
        description: `"${rule.name}" has been ${rule.isActive ? 'disabled' : 'enabled'}`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update rule',
      });
    }
  };

  // Save rule
  const handleSaveRule = async () => {
    if (!ruleForm.name.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Rule name is required',
      });
      return;
    }

    try {
      const payload = {
        name: ruleForm.name.trim(),
        description: ruleForm.description.trim() || undefined,
        priority: ruleForm.priority,
        isActive: ruleForm.isActive,
        conditions: {
          channel: ruleForm.conditions.channel || undefined,
          keywords: ruleForm.conditions.keywords.length > 0 ? ruleForm.conditions.keywords : undefined,
          businessHours: ruleForm.conditions.businessHours ?? undefined,
          priority: ruleForm.conditions.priority || undefined,
        },
        assignToType: ruleForm.assignToType,
        assignToUserId: ruleForm.assignToType === 'USER' ? ruleForm.assignToUserId : undefined,
        assignToTeamId: ['TEAM', 'ROUND_ROBIN', 'LEAST_BUSY'].includes(ruleForm.assignToType)
          ? ruleForm.assignToTeamId
          : undefined,
      };

      if (editingRule) {
        await updateRule.mutateAsync({ id: editingRule.id, data: payload });
        toast({ title: 'Rule updated', description: `"${payload.name}" has been updated` });
      } else {
        await createRule.mutateAsync(payload);
        toast({ title: 'Rule created', description: `"${payload.name}" has been created` });
      }

      setShowRuleDialog(false);
      setEditingRule(null);
      setRuleForm(defaultRuleForm);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to save rule',
      });
    }
  };

  // Delete rule
  const handleDeleteRule = async () => {
    if (!deletingRule) return;

    try {
      await deleteRule.mutateAsync(deletingRule.id);
      toast({ title: 'Rule deleted', description: `"${deletingRule.name}" has been deleted` });
      setDeletingRule(null);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete rule',
      });
    }
  };

  // Add keyword
  const handleAddKeyword = () => {
    if (!keywordInput.trim()) return;
    if (ruleForm.conditions.keywords.includes(keywordInput.trim())) return;
    setRuleForm(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        keywords: [...prev.conditions.keywords, keywordInput.trim()],
      },
    }));
    setKeywordInput('');
  };

  // Remove keyword
  const handleRemoveKeyword = (keyword) => {
    setRuleForm(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        keywords: prev.conditions.keywords.filter(k => k !== keyword),
      },
    }));
  };

  // ============================================================================
  // SLA POLICY HANDLERS
  // ============================================================================

  // Open dialog for new SLA policy
  const handleNewSLA = () => {
    setEditingSLA(null);
    setSLAForm(defaultSLAForm);
    setShowSLADialog(true);
  };

  // Open dialog for editing SLA policy
  const handleEditSLA = (policy) => {
    setEditingSLA(policy);
    setSLAForm({
      name: policy.name,
      description: policy.description || '',
      isDefault: policy.isDefault || false,
      isActive: policy.isActive !== false,
      firstResponseTime: policy.firstResponseTime || 60,
      firstResponseBreach: policy.firstResponseBreach || null,
      resolutionTime: policy.resolutionTime || 1440,
      resolutionBreach: policy.resolutionBreach || null,
      useBusinessHours: policy.useBusinessHours !== false,
      businessHoursConfig: policy.businessHoursConfig || null,
      priorityOverrides: policy.priorityOverrides || {},
      escalationEnabled: policy.escalationEnabled || false,
      escalationConfig: policy.escalationConfig || null,
    });
    setShowSLADialog(true);
  };

  // Toggle SLA policy active status
  const handleToggleSLAActive = async (policy) => {
    try {
      await updateSLA.mutateAsync({
        id: policy.id,
        data: { isActive: !policy.isActive },
      });
      toast({
        title: policy.isActive ? 'Policy disabled' : 'Policy enabled',
        description: `"${policy.name}" has been ${policy.isActive ? 'disabled' : 'enabled'}`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update policy',
      });
    }
  };

  // Set as default SLA policy
  const handleSetDefaultSLA = async (policy) => {
    try {
      await updateSLA.mutateAsync({
        id: policy.id,
        data: { isDefault: true },
      });
      toast({
        title: 'Default policy updated',
        description: `"${policy.name}" is now the default SLA policy`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to set default policy',
      });
    }
  };

  // Save SLA policy
  const handleSaveSLA = async () => {
    if (!slaForm.name.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Policy name is required',
      });
      return;
    }

    if (!slaForm.firstResponseTime || slaForm.firstResponseTime < 1) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'First response time is required',
      });
      return;
    }

    if (!slaForm.resolutionTime || slaForm.resolutionTime < 1) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Resolution time is required',
      });
      return;
    }

    try {
      const payload = {
        name: slaForm.name.trim(),
        description: slaForm.description.trim() || undefined,
        isDefault: slaForm.isDefault,
        isActive: slaForm.isActive,
        firstResponseTime: slaForm.firstResponseTime,
        firstResponseBreach: slaForm.firstResponseBreach || undefined,
        resolutionTime: slaForm.resolutionTime,
        resolutionBreach: slaForm.resolutionBreach || undefined,
        useBusinessHours: slaForm.useBusinessHours,
        escalationEnabled: slaForm.escalationEnabled,
      };

      if (editingSLA) {
        await updateSLA.mutateAsync({ id: editingSLA.id, data: payload });
        toast({ title: 'Policy updated', description: `"${payload.name}" has been updated` });
      } else {
        await createSLA.mutateAsync(payload);
        toast({ title: 'Policy created', description: `"${payload.name}" has been created` });
      }

      setShowSLADialog(false);
      setEditingSLA(null);
      setSLAForm(defaultSLAForm);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to save policy',
      });
    }
  };

  // Delete SLA policy
  const handleDeleteSLA = async () => {
    if (!deletingSLA) return;

    try {
      await deleteSLA.mutateAsync(deletingSLA.id);
      toast({ title: 'Policy deleted', description: `"${deletingSLA.name}" has been deleted` });
      setDeletingSLA(null);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete policy',
      });
    }
  };

  const isSubmitting = createRule.isPending || updateRule.isPending;
  const isSLASubmitting = createSLA.isPending || updateSLA.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Inbox className="h-6 w-6" />
            Inbox Settings
          </h1>
          <p className="text-muted-foreground">
            Configure auto-assignment rules and inbox automation
          </p>
        </div>
      </div>

      <Tabs defaultValue="auto-assignment" className="space-y-4">
        <TabsList>
          <TabsTrigger value="auto-assignment" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Auto-Assignment
          </TabsTrigger>
          <TabsTrigger value="sla" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            SLA Policies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="auto-assignment" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Auto-Assignment Rules
                  </CardTitle>
                  <CardDescription>
                    Automatically assign incoming conversations to teams or agents based on conditions
                  </CardDescription>
                </div>
                <Button onClick={handleNewRule}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {rulesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : rules.length === 0 ? (
                <div className="text-center py-12">
                  <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="font-medium mb-2">No auto-assignment rules</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create rules to automatically route conversations to the right team or agent
                  </p>
                  <Button onClick={handleNewRule}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Rule
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {rules.sort((a, b) => b.priority - a.priority).map((rule) => {
                    const typeConfig = assignmentTypeLabels[rule.assignToType];
                    const TypeIcon = typeConfig?.icon || Users;

                    return (
                      <div
                        key={rule.id}
                        className={cn(
                          'p-4 rounded-lg border transition-colors',
                          rule.isActive ? 'bg-card' : 'bg-muted/30 opacity-60'
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              'h-10 w-10 rounded-lg flex items-center justify-center',
                              rule.isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                            )}>
                              <TypeIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{rule.name}</h4>
                                <Badge variant={rule.isActive ? 'default' : 'secondary'} className="text-xs">
                                  {rule.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  Priority: {rule.priority}
                                </Badge>
                              </div>
                              {rule.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {rule.description}
                                </p>
                              )}
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                {/* Conditions */}
                                {rule.conditions?.channel && (
                                  <Badge variant="secondary" className="text-xs gap-1">
                                    <ChannelIcon channel={rule.conditions.channel} className="h-3 w-3" />
                                    {rule.conditions.channel}
                                  </Badge>
                                )}
                                {rule.conditions?.keywords?.length > 0 && (
                                  <Badge variant="secondary" className="text-xs">
                                    {rule.conditions.keywords.length} keyword{rule.conditions.keywords.length > 1 ? 's' : ''}
                                  </Badge>
                                )}
                                {rule.conditions?.businessHours === true && (
                                  <Badge variant="secondary" className="text-xs">
                                    Business hours
                                  </Badge>
                                )}
                                {rule.conditions?.priority && (
                                  <Badge variant="secondary" className="text-xs">
                                    {rule.conditions.priority} priority
                                  </Badge>
                                )}

                                <ChevronRight className="h-4 w-4 text-muted-foreground" />

                                {/* Assignment target */}
                                <Badge variant="outline" className="text-xs gap-1">
                                  <TypeIcon className="h-3 w-3" />
                                  {typeConfig?.label}
                                  {rule.assignToTeam && `: ${rule.assignToTeam.name}`}
                                  {rule.assignToUser && `: ${rule.assignToUser.firstName} ${rule.assignToUser.lastName}`}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={rule.isActive}
                              onCheckedChange={() => handleToggleActive(rule)}
                            />
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditRule(rule)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => setDeletingRule(rule)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                Tips for Auto-Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• Rules are evaluated in priority order (highest first). The first matching rule is applied.</p>
              <p>• Use "Round Robin" to distribute workload evenly across team members.</p>
              <p>• "Least Busy" assigns to the agent with the fewest active conversations.</p>
              <p>• Keywords are matched against the message content (case-insensitive).</p>
              <p>• Business hours rules only match during your configured working hours.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sla" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    SLA Policies
                  </CardTitle>
                  <CardDescription>
                    Define response time expectations and escalation rules for your team
                  </CardDescription>
                </div>
                <Button onClick={handleNewSLA}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Policy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {slaLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : slaPolicies.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="font-medium mb-2">No SLA policies</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create SLA policies to set response time expectations for your team
                  </p>
                  <Button onClick={handleNewSLA}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Policy
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {slaPolicies.map((policy) => (
                    <div
                      key={policy.id}
                      className={cn(
                        'p-4 rounded-lg border transition-colors',
                        policy.isActive ? 'bg-card' : 'bg-muted/30 opacity-60'
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            'h-10 w-10 rounded-lg flex items-center justify-center',
                            policy.isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                          )}>
                            <Shield className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{policy.name}</h4>
                              {policy.isDefault && (
                                <Badge className="text-xs gap-1 bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                                  <Star className="h-3 w-3" />
                                  Default
                                </Badge>
                              )}
                              <Badge variant={policy.isActive ? 'default' : 'secondary'} className="text-xs">
                                {policy.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            {policy.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {policy.description}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-3 mt-3">
                              {/* First Response Time */}
                              <div className="flex items-center gap-1.5 text-sm">
                                <Clock className="h-4 w-4 text-blue-500" />
                                <span className="text-muted-foreground">First response:</span>
                                <span className="font-medium">{formatTime(policy.firstResponseTime)}</span>
                              </div>
                              {/* Resolution Time */}
                              <div className="flex items-center gap-1.5 text-sm">
                                <Timer className="h-4 w-4 text-green-500" />
                                <span className="text-muted-foreground">Resolution:</span>
                                <span className="font-medium">{formatTime(policy.resolutionTime)}</span>
                              </div>
                              {/* Business Hours */}
                              {policy.useBusinessHours && (
                                <Badge variant="secondary" className="text-xs">
                                  Business hours only
                                </Badge>
                              )}
                              {/* Escalation */}
                              {policy.escalationEnabled && (
                                <Badge variant="secondary" className="text-xs gap-1">
                                  <ArrowUp className="h-3 w-3" />
                                  Escalation enabled
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={policy.isActive}
                            onCheckedChange={() => handleToggleSLAActive(policy)}
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditSLA(policy)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              {!policy.isDefault && (
                                <DropdownMenuItem onClick={() => handleSetDefaultSLA(policy)}>
                                  <Star className="h-4 w-4 mr-2" />
                                  Set as Default
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setDeletingSLA(policy)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* SLA Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                Understanding SLA Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• <strong>First Response Time:</strong> Maximum time to send the first reply to a customer.</p>
              <p>• <strong>Resolution Time:</strong> Maximum time to resolve and close the conversation.</p>
              <p>• <strong>Business Hours:</strong> When enabled, SLA timers only count during working hours.</p>
              <p>• <strong>Default Policy:</strong> Applied to all new conversations unless overridden.</p>
              <p>• <strong>Escalation:</strong> Notify managers when SLA breaches are imminent.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Rule Dialog */}
      <Dialog open={showRuleDialog} onOpenChange={setShowRuleDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRule ? 'Edit Assignment Rule' : 'Create Assignment Rule'}
            </DialogTitle>
            <DialogDescription>
              Configure conditions and assignment behavior for this rule
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Rule Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Sales Inquiries"
                  value={ruleForm.name}
                  onChange={(e) => setRuleForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this rule does..."
                  value={ruleForm.description}
                  onChange={(e) => setRuleForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Input
                    id="priority"
                    type="number"
                    placeholder="0"
                    value={ruleForm.priority}
                    onChange={(e) => setRuleForm(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))}
                  />
                  <p className="text-xs text-muted-foreground">Higher = evaluated first</p>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Active</Label>
                    <p className="text-xs text-muted-foreground">Rule is enabled</p>
                  </div>
                  <Switch
                    checked={ruleForm.isActive}
                    onCheckedChange={(checked) => setRuleForm(prev => ({ ...prev, isActive: checked }))}
                  />
                </div>
              </div>
            </div>

            {/* Conditions */}
            <div className="space-y-4">
              <h4 className="font-medium">Conditions</h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Channel</Label>
                  <Select
                    value={ruleForm.conditions.channel || 'any'}
                    onValueChange={(value) => setRuleForm(prev => ({
                      ...prev,
                      conditions: { ...prev.conditions, channel: value === 'any' ? null : value },
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any channel</SelectItem>
                      <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                      <SelectItem value="EMAIL">Email</SelectItem>
                      <SelectItem value="SMS">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Priority Level</Label>
                  <Select
                    value={ruleForm.conditions.priority || 'any'}
                    onValueChange={(value) => setRuleForm(prev => ({
                      ...prev,
                      conditions: { ...prev.conditions, priority: value === 'any' ? null : value },
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any priority</SelectItem>
                      {priorityLevels.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Keywords (match message content)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add keyword..."
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                  />
                  <Button type="button" variant="outline" onClick={handleAddKeyword}>
                    Add
                  </Button>
                </div>
                {ruleForm.conditions.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {ruleForm.conditions.keywords.map((keyword) => (
                      <Badge
                        key={keyword}
                        variant="secondary"
                        className="gap-1 cursor-pointer hover:bg-destructive/20"
                        onClick={() => handleRemoveKeyword(keyword)}
                      >
                        {keyword}
                        <span className="text-muted-foreground">×</span>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label>Business Hours Only</Label>
                  <p className="text-xs text-muted-foreground">Only apply during working hours</p>
                </div>
                <Select
                  value={ruleForm.conditions.businessHours === true ? 'true' : ruleForm.conditions.businessHours === false ? 'false' : 'any'}
                  onValueChange={(value) => setRuleForm(prev => ({
                    ...prev,
                    conditions: {
                      ...prev.conditions,
                      businessHours: value === 'any' ? null : value === 'true',
                    },
                  }))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any time</SelectItem>
                    <SelectItem value="true">During hours</SelectItem>
                    <SelectItem value="false">Outside hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Assignment Target */}
            <div className="space-y-4">
              <h4 className="font-medium">Assign To</h4>

              <div className="grid grid-cols-2 gap-3">
                {Object.entries(assignmentTypeLabels).map(([type, config]) => {
                  const Icon = config.icon;
                  const isSelected = ruleForm.assignToType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setRuleForm(prev => ({ ...prev, assignToType: type }))}
                      className={cn(
                        'p-3 rounded-lg border-2 text-left transition-all',
                        isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={cn('h-4 w-4', isSelected && 'text-primary')} />
                        <span className="font-medium text-sm">{config.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{config.description}</p>
                    </button>
                  );
                })}
              </div>

              {/* Team selection */}
              {['TEAM', 'ROUND_ROBIN', 'LEAST_BUSY'].includes(ruleForm.assignToType) && (
                <div className="space-y-2">
                  <Label>Select Team</Label>
                  <Select
                    value={ruleForm.assignToTeamId || ''}
                    onValueChange={(value) => setRuleForm(prev => ({ ...prev, assignToTeamId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a team..." />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name} ({team.members?.length || 0} members)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRuleDialog(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveRule} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {editingRule ? 'Saving...' : 'Creating...'}
                </>
              ) : (
                editingRule ? 'Save Changes' : 'Create Rule'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingRule} onOpenChange={(open) => !open && setDeletingRule(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Assignment Rule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingRule?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteRule.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRule}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteRule.isPending}
            >
              {deleteRule.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* SLA Policy Dialog */}
      <Dialog open={showSLADialog} onOpenChange={setShowSLADialog}>
        <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {editingSLA ? 'Edit SLA Policy' : 'Create SLA Policy'}
            </DialogTitle>
            <DialogDescription>
              Set response time targets and escalation rules for this policy
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sla-name">Policy Name *</Label>
                <Input
                  id="sla-name"
                  placeholder="e.g., Standard Support"
                  value={slaForm.name}
                  onChange={(e) => setSLAForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sla-description">Description</Label>
                <Textarea
                  id="sla-description"
                  placeholder="Describe when this policy applies..."
                  value={slaForm.description}
                  onChange={(e) => setSLAForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Set as Default</Label>
                  <p className="text-xs text-muted-foreground">Apply to all new conversations</p>
                </div>
                <Switch
                  checked={slaForm.isDefault}
                  onCheckedChange={(checked) => setSLAForm(prev => ({ ...prev, isDefault: checked }))}
                />
              </div>
            </div>

            {/* Response Times */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                Response Times
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Response Time *</Label>
                  <Select
                    value={slaForm.firstResponseTime?.toString() || '60'}
                    onValueChange={(value) => setSLAForm(prev => ({ ...prev, firstResponseTime: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time..." />
                    </SelectTrigger>
                    <SelectContent>
                      {timePresets.map((preset) => (
                        <SelectItem key={preset.value} value={preset.value.toString()}>
                          {preset.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Max time to send first reply</p>
                </div>

                <div className="space-y-2">
                  <Label>Resolution Time *</Label>
                  <Select
                    value={slaForm.resolutionTime?.toString() || '1440'}
                    onValueChange={(value) => setSLAForm(prev => ({ ...prev, resolutionTime: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time..." />
                    </SelectTrigger>
                    <SelectContent>
                      {timePresets.map((preset) => (
                        <SelectItem key={preset.value} value={preset.value.toString()}>
                          {preset.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Max time to resolve conversation</p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Label>Business Hours Only</Label>
                    <p className="text-xs text-muted-foreground">
                      SLA timers pause outside working hours
                    </p>
                  </div>
                </div>
                <Switch
                  checked={slaForm.useBusinessHours}
                  onCheckedChange={(checked) => setSLAForm(prev => ({ ...prev, useBusinessHours: checked }))}
                />
              </div>
            </div>

            {/* Escalation */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Bell className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <Label>Enable Escalation</Label>
                    <p className="text-xs text-muted-foreground">
                      Notify managers when SLA breach is imminent
                    </p>
                  </div>
                </div>
                <Switch
                  checked={slaForm.escalationEnabled}
                  onCheckedChange={(checked) => setSLAForm(prev => ({ ...prev, escalationEnabled: checked }))}
                />
              </div>

              {slaForm.escalationEnabled && (
                <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                  <p>Escalation will be triggered at 75% of the SLA time limit.</p>
                  <p className="mt-1">Configure escalation contacts in Team Settings.</p>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label>Policy Active</Label>
                <p className="text-xs text-muted-foreground">Enable or disable this policy</p>
              </div>
              <Switch
                checked={slaForm.isActive}
                onCheckedChange={(checked) => setSLAForm(prev => ({ ...prev, isActive: checked }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSLADialog(false)}
              disabled={isSLASubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveSLA} disabled={isSLASubmitting}>
              {isSLASubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {editingSLA ? 'Saving...' : 'Creating...'}
                </>
              ) : (
                editingSLA ? 'Save Changes' : 'Create Policy'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SLA Delete Confirmation */}
      <AlertDialog open={!!deletingSLA} onOpenChange={(open) => !open && setDeletingSLA(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete SLA Policy</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingSLA?.name}"? Conversations using this policy will fall back to the default policy.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteSLA.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSLA}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteSLA.isPending}
            >
              {deleteSLA.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
