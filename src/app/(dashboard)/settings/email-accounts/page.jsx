'use client';

import { useState } from 'react';
import {
  Mail,
  Plus,
  MoreHorizontal,
  Users,
  Shield,
  Trash2,
  Edit,
  Settings,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  UserPlus,
  UserMinus,
  Inbox,
  Send,
  Bell,
  Key,
  Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useToast } from '@/hooks/use-toast';
import { useEmailAccounts, useDisconnectEmailAccount } from '@/hooks/use-email-accounts';
import {
  useSharedInboxes,
  useCreateSharedInbox,
  useUpdateSharedInbox,
  useDeleteSharedInbox,
  useAddInboxMember,
  useRemoveInboxMember,
} from '@/hooks/use-shared-inboxes';
import { useAuth } from '@/contexts/auth-context';
import { EmailSetup } from '@/components/inbox/email-setup';

// Provider icons
const GoogleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const MicrosoftIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path fill="#F25022" d="M1 1h10v10H1z" />
    <path fill="#00A4EF" d="M1 13h10v10H1z" />
    <path fill="#7FBA00" d="M13 1h10v10H13z" />
    <path fill="#FFB900" d="M13 13h10v10H13z" />
  </svg>
);

// Get provider icon
const getProviderIcon = (provider) => {
  switch (provider?.toLowerCase()) {
    case 'gmail':
    case 'google':
      return <GoogleIcon className="h-5 w-5" />;
    case 'outlook':
    case 'microsoft':
      return <MicrosoftIcon className="h-5 w-5" />;
    default:
      return <Mail className="h-5 w-5 text-muted-foreground" />;
  }
};

// Status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    ACTIVE: { label: 'Active', color: 'bg-green-100 text-green-700 border-green-200' },
    ERROR: { label: 'Error', color: 'bg-red-100 text-red-700 border-red-200' },
    SYNCING: { label: 'Syncing', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    DISCONNECTED: { label: 'Disconnected', color: 'bg-gray-100 text-gray-700 border-gray-200' },
    active: { label: 'Active', color: 'bg-green-100 text-green-700 border-green-200' },
    paused: { label: 'Paused', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    disconnected: { label: 'Disconnected', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  };

  const config = statusConfig[status] || statusConfig.DISCONNECTED;

  return (
    <Badge variant="outline" className={cn('text-xs', config.color)}>
      {config.label}
    </Badge>
  );
};

// Default form values
const defaultSharedInboxForm = {
  name: '',
  email: '',
  inboundType: 'forwarding',
  autoAssign: false,
  assignmentType: 'round_robin',
  signature: '',
};

export default function EmailAccountsPage() {
  const { toast } = useToast();
  const { user } = useAuth();

  // Dialog states
  const [showAddAccountDialog, setShowAddAccountDialog] = useState(false);
  const [showCreateInboxDialog, setShowCreateInboxDialog] = useState(false);
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(null);
  const [disconnectConfirmDialog, setDisconnectConfirmDialog] = useState(null);

  // Form states
  const [inboxForm, setInboxForm] = useState(defaultSharedInboxForm);
  const [editingInbox, setEditingInbox] = useState(null);
  const [selectedInbox, setSelectedInbox] = useState(null);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('member');

  // Queries
  const {
    data: emailAccountsData,
    isLoading: accountsLoading,
    refetch: refetchAccounts,
  } = useEmailAccounts();
  const {
    data: sharedInboxesData,
    isLoading: inboxesLoading,
    refetch: refetchInboxes,
  } = useSharedInboxes();

  // Mutations
  const disconnectAccount = useDisconnectEmailAccount();
  const createInbox = useCreateSharedInbox();
  const updateInbox = useUpdateSharedInbox();
  const deleteInbox = useDeleteSharedInbox();
  const addMember = useAddInboxMember();
  const removeMember = useRemoveInboxMember();

  const emailAccounts = emailAccountsData?.data || [];
  const sharedInboxes = sharedInboxesData?.data || [];

  // Handle create/edit inbox
  const handleSaveInbox = async () => {
    if (!inboxForm.name.trim() || !inboxForm.email.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Name and email are required',
      });
      return;
    }

    try {
      if (editingInbox) {
        await updateInbox.mutateAsync({
          id: editingInbox.id,
          data: inboxForm,
        });
        toast({ title: 'Inbox updated', description: `"${inboxForm.name}" has been updated` });
      } else {
        await createInbox.mutateAsync(inboxForm);
        toast({ title: 'Inbox created', description: `"${inboxForm.name}" has been created` });
      }
      setShowCreateInboxDialog(false);
      setEditingInbox(null);
      setInboxForm(defaultSharedInboxForm);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to save inbox',
      });
    }
  };

  // Handle edit inbox
  const handleEditInbox = (inbox) => {
    setEditingInbox(inbox);
    setInboxForm({
      name: inbox.name,
      email: inbox.email,
      inboundType: inbox.inboundType || 'forwarding',
      autoAssign: inbox.autoAssign || false,
      assignmentType: inbox.assignmentType || 'round_robin',
      signature: inbox.signature || '',
    });
    setShowCreateInboxDialog(true);
  };

  // Handle delete inbox
  const handleDeleteInbox = async () => {
    if (!deleteConfirmDialog) return;

    try {
      await deleteInbox.mutateAsync(deleteConfirmDialog.id);
      toast({
        title: 'Inbox deleted',
        description: `"${deleteConfirmDialog.name}" has been deleted`,
      });
      setDeleteConfirmDialog(null);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete inbox',
      });
    }
  };

  // Handle disconnect email account
  const handleDisconnectAccount = async () => {
    if (!disconnectConfirmDialog) return;

    try {
      await disconnectAccount.mutateAsync(disconnectConfirmDialog.id);
      toast({
        title: 'Account disconnected',
        description: `"${disconnectConfirmDialog.email}" has been disconnected`,
      });
      setDisconnectConfirmDialog(null);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to disconnect account',
      });
    }
  };

  // Handle manage members
  const handleManageMembers = (inbox) => {
    setSelectedInbox(inbox);
    setShowMembersDialog(true);
  };

  // Handle add member (simplified - in production, would search users)
  const handleAddMember = async () => {
    if (!selectedInbox || !newMemberEmail.trim()) return;

    toast({
      title: 'Feature in progress',
      description: 'User search and add member will be available soon',
    });
    setShowAddMemberDialog(false);
    setNewMemberEmail('');
  };

  // Handle remove member
  const handleRemoveMember = async (userId) => {
    if (!selectedInbox) return;

    try {
      await removeMember.mutateAsync({
        inboxId: selectedInbox.id,
        userId,
      });
      toast({ title: 'Member removed', description: 'Member has been removed from the inbox' });
      refetchInboxes();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to remove member',
      });
    }
  };

  const isSubmitting = createInbox.isPending || updateInbox.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Mail className="h-6 w-6" />
            Email Accounts
          </h1>
          <p className="text-muted-foreground">
            Manage connected email accounts and shared inboxes
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{emailAccounts.length}</p>
                <p className="text-sm text-muted-foreground">Connected Accounts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Inbox className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sharedInboxes.length}</p>
                <p className="text-sm text-muted-foreground">Shared Inboxes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {sharedInboxes.reduce((sum, inbox) => sum + (inbox.memberCount || 0), 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Connected Accounts
          </TabsTrigger>
          <TabsTrigger value="shared-inboxes" className="flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            Shared Inboxes
          </TabsTrigger>
        </TabsList>

        {/* Connected Accounts Tab */}
        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Connected Email Accounts</CardTitle>
                  <CardDescription>
                    Email accounts connected via OAuth or IMAP for sending and receiving emails
                  </CardDescription>
                </div>
                <Button onClick={() => setShowAddAccountDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Account
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {accountsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : emailAccounts.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="font-medium mb-2">No email accounts connected</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect your Gmail or Outlook account to start sending and receiving emails
                  </p>
                  <Button onClick={() => setShowAddAccountDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Connect Your First Account
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {emailAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                          {getProviderIcon(account.provider)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{account.email}</p>
                            <StatusBadge status={account.status} />
                            {account.isDefault && (
                              <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                                Default
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {account.displayName || account.provider} • Last synced:{' '}
                            {account.lastSyncAt
                              ? new Date(account.lastSyncAt).toLocaleString()
                              : 'Never'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => refetchAccounts()}>
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Settings className="h-4 w-4 mr-2" />
                              Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="h-4 w-4 mr-2" />
                              Manage Access
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setDisconnectConfirmDialog(account)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Disconnect
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shared Inboxes Tab */}
        <TabsContent value="shared-inboxes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Shared Inboxes</CardTitle>
                  <CardDescription>
                    Team inboxes that multiple agents can access and respond from
                  </CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setEditingInbox(null);
                    setInboxForm(defaultSharedInboxForm);
                    setShowCreateInboxDialog(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Inbox
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {inboxesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : sharedInboxes.length === 0 ? (
                <div className="text-center py-12">
                  <Inbox className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="font-medium mb-2">No shared inboxes</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create a shared inbox so your team can collaborate on customer emails
                  </p>
                  <Button onClick={() => setShowCreateInboxDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Inbox
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {sharedInboxes.map((inbox) => (
                    <div
                      key={inbox.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                          <Inbox className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{inbox.name}</p>
                            <StatusBadge status={inbox.status} />
                          </div>
                          <p className="text-sm text-muted-foreground">{inbox.email}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {inbox.memberCount || 0} members
                            </span>
                            {inbox.autoAssign && (
                              <Badge variant="outline" className="text-xs">
                                Auto-assign: {inbox.assignmentType?.replace('_', ' ')}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleManageMembers(inbox)}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Members
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditInbox(inbox)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleManageMembers(inbox)}>
                              <Users className="h-4 w-4 mr-2" />
                              Manage Members
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setDeleteConfirmDialog(inbox)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                About Shared Inboxes
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• Shared inboxes allow multiple team members to view and respond to emails</p>
              <p>• Auto-assign distributes new emails to available agents automatically</p>
              <p>• Round Robin assigns emails evenly across team members</p>
              <p>• Load Balanced assigns to the agent with fewest active conversations</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Account Dialog */}
      <Dialog open={showAddAccountDialog} onOpenChange={setShowAddAccountDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Connect Email Account</DialogTitle>
            <DialogDescription>
              Connect your email account via OAuth or IMAP to send and receive emails
            </DialogDescription>
          </DialogHeader>
          <EmailSetup
            onComplete={() => {
              setShowAddAccountDialog(false);
              refetchAccounts();
            }}
            onBack={() => setShowAddAccountDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Create/Edit Inbox Dialog */}
      <Dialog open={showCreateInboxDialog} onOpenChange={setShowCreateInboxDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingInbox ? 'Edit Shared Inbox' : 'Create Shared Inbox'}</DialogTitle>
            <DialogDescription>
              {editingInbox
                ? 'Update the shared inbox settings'
                : 'Create a new shared inbox for your team'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="inbox-name">Inbox Name *</Label>
              <Input
                id="inbox-name"
                placeholder="e.g., Support Inbox"
                value={inboxForm.name}
                onChange={(e) => setInboxForm({ ...inboxForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inbox-email">Email Address *</Label>
              <Input
                id="inbox-email"
                type="email"
                placeholder="e.g., support@yourcompany.com"
                value={inboxForm.email}
                onChange={(e) => setInboxForm({ ...inboxForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Inbound Type</Label>
              <Select
                value={inboxForm.inboundType}
                onValueChange={(value) => setInboxForm({ ...inboxForm, inboundType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="forwarding">Email Forwarding</SelectItem>
                  <SelectItem value="oauth">OAuth (Gmail/Outlook)</SelectItem>
                  <SelectItem value="imap">IMAP</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                How emails will be received in this inbox
              </p>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label>Auto-Assign</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically assign new emails to team members
                </p>
              </div>
              <Switch
                checked={inboxForm.autoAssign}
                onCheckedChange={(checked) => setInboxForm({ ...inboxForm, autoAssign: checked })}
              />
            </div>
            {inboxForm.autoAssign && (
              <div className="space-y-2">
                <Label>Assignment Type</Label>
                <Select
                  value={inboxForm.assignmentType}
                  onValueChange={(value) => setInboxForm({ ...inboxForm, assignmentType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="round_robin">Round Robin</SelectItem>
                    <SelectItem value="load_balanced">Load Balanced</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="inbox-signature">Email Signature</Label>
              <Textarea
                id="inbox-signature"
                placeholder="Add a signature for outgoing emails..."
                rows={3}
                value={inboxForm.signature}
                onChange={(e) => setInboxForm({ ...inboxForm, signature: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateInboxDialog(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveInbox} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingInbox ? 'Save Changes' : 'Create Inbox'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Members Dialog */}
      <Dialog open={showMembersDialog} onOpenChange={setShowMembersDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Manage Members</DialogTitle>
            <DialogDescription>
              {selectedInbox?.name} - {selectedInbox?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {selectedInbox?.members?.length || 0} members
              </p>
              <Button size="sm" onClick={() => setShowAddMemberDialog(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>
            {selectedInbox?.members?.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No members yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedInbox?.members?.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.user?.avatarUrl} />
                        <AvatarFallback>
                          {member.user?.firstName?.[0]}
                          {member.user?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {member.user?.firstName} {member.user?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{member.user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {member.role}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleRemoveMember(member.userId)}
                      >
                        <UserMinus className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
            <DialogDescription>Add a team member to this shared inbox</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Search User</Label>
              <Input
                placeholder="Enter email to search..."
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={newMemberRole} onValueChange={setNewMemberRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMemberDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember}>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Inbox Confirmation */}
      <AlertDialog
        open={!!deleteConfirmDialog}
        onOpenChange={(open) => !open && setDeleteConfirmDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Shared Inbox</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirmDialog?.name}"? This will remove all
              members and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteInbox.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteInbox}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteInbox.isPending}
            >
              {deleteInbox.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Disconnect Account Confirmation */}
      <AlertDialog
        open={!!disconnectConfirmDialog}
        onOpenChange={(open) => !open && setDisconnectConfirmDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Email Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disconnect "{disconnectConfirmDialog?.email}"? You can
              reconnect it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={disconnectAccount.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisconnectAccount}
              className="bg-destructive hover:bg-destructive/90"
              disabled={disconnectAccount.isPending}
            >
              {disconnectAccount.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
