'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Shield,
  UserPlus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
  useUsers,
  useTeams,
  usePendingInvitations,
  useRoles,
  useInviteUser,
  useResendInvitation,
  useRevokeInvitation,
  useUpdateUser,
  useDeleteUser,
  useCreateTeam,
  useUpdateTeam,
  useDeleteTeam,
  useTeamMembers,
  useAddTeamMember,
  useRemoveTeamMember,
} from '@/hooks/use-users';
import { cn } from '@/lib/utils';
import { UnifiedLayout, createStat } from '@/components/layout/unified';
import { FixedMenuPanel } from '@/components/layout/fixed-menu-panel';
// HubLayout removed - migrated to UnifiedLayout

// Default roles fallback
const defaultRoles = ['Admin', 'Manager', 'Agent', 'Viewer'];

// Team colors for display
const teamColors = [
  'bg-purple-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-pink-500',
  'bg-cyan-500',
];

const tabs = [
  { id: 'users', label: 'Users' },
  { id: 'invitations', label: 'Invitations' },
];

const getInitials = (name) => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();
};

const getStatusStyles = (status) => {
  switch (status) {
    case 'active':
      return { bg: 'bg-green-50', color: 'text-green-700' };
    case 'inactive':
      return { bg: 'bg-gray-100', color: 'text-gray-600' };
    case 'suspended':
      return { bg: 'bg-red-50', color: 'text-red-700' };
    default:
      return { bg: 'bg-gray-100', color: 'text-gray-600' };
  }
};

const getRoleStyles = (role) => {
  switch (role) {
    case 'Admin':
      return { bg: 'bg-purple-50', color: 'text-purple-700' };
    case 'Manager':
      return { bg: 'bg-blue-50', color: 'text-blue-700' };
    case 'Agent':
      return { bg: 'bg-green-50', color: 'text-green-700' };
    default:
      return { bg: 'bg-gray-100', color: 'text-gray-600' };
  }
};

export default function UsersPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showEditTeamDialog, setShowEditTeamDialog] = useState(false);
  const [showManageMembersDialog, setShowManageMembersDialog] = useState(false);
  const [showDeleteTeamConfirm, setShowDeleteTeamConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  // New team form state
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamColor, setNewTeamColor] = useState('bg-blue-500');

  // Edit team form state
  const [editTeamName, setEditTeamName] = useState('');
  const [editTeamColor, setEditTeamColor] = useState('');

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Agent');
  const [inviteTeam, setInviteTeam] = useState('');

  // Edit user form state
  const [editRole, setEditRole] = useState('');
  const [editTeam, setEditTeam] = useState('');
  const [editStatus, setEditStatus] = useState('');

  // API hooks
  const { data: usersResponse, isLoading: usersLoading } = useUsers();
  const { data: teamsResponse, isLoading: teamsLoading } = useTeams();
  const { data: invitationsResponse, isLoading: invitationsLoading } = usePendingInvitations();
  const { data: rolesResponse } = useRoles();

  // Extract data from API responses
  const usersData = usersResponse?.data || [];
  const teamsData = teamsResponse?.data || [];
  const pendingInvitations = invitationsResponse?.data || [];
  // Normalize roles - API returns objects with {id, name, ...}, convert to array of names
  const rolesData = rolesResponse?.data || [];
  const roles =
    rolesData.length > 0
      ? rolesData.map((r) => (typeof r === 'string' ? r : r.name)).filter(Boolean)
      : defaultRoles;

  const inviteUserMutation = useInviteUser();
  const resendInvitationMutation = useResendInvitation();
  const revokeInvitationMutation = useRevokeInvitation();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  // Team mutations
  const createTeamMutation = useCreateTeam();
  const updateTeamMutation = useUpdateTeam();
  const deleteTeamMutation = useDeleteTeam();
  const addTeamMemberMutation = useAddTeamMember();
  const removeTeamMemberMutation = useRemoveTeamMember();

  // Team members query (only when a team is selected for managing members)
  const { data: teamMembersResponse, isLoading: teamMembersLoading } = useTeamMembers(
    showManageMembersDialog ? selectedTeam?.id : null
  );
  const teamMembers = teamMembersResponse?.data || [];

  const handleEditUser = (user) => {
    setSelectedUser(user);
    // Set initial values for edit form
    setEditRole(getUserRole(user));
    setEditTeam(getUserTeam(user) || '');
    setEditStatus(user.status || 'active');
    setShowEditDialog(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;

    try {
      await updateUserMutation.mutateAsync({
        userId: selectedUser.id,
        data: {
          role: editRole,
          team: editTeam || undefined,
          status: editStatus,
        },
      });
      toast({
        title: 'User Updated',
        description: `${getUserName(selectedUser)} has been updated successfully`,
      });
      setShowEditDialog(false);
      setSelectedUser(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update user',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  const handleInviteUser = async () => {
    if (!inviteEmail) {
      toast({
        title: 'Error',
        description: 'Please enter an email address',
        variant: 'destructive',
      });
      return;
    }

    try {
      await inviteUserMutation.mutateAsync({
        email: inviteEmail,
        firstName: inviteEmail.split('@')[0],
        lastName: '',
      });
      toast({ title: 'Invitation Sent', description: `Invitation sent to ${inviteEmail}` });
      setInviteEmail('');
      setInviteRole('Agent');
      setInviteTeam('Sales');
      setShowInviteDialog(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to send invitation',
        variant: 'destructive',
      });
    }
  };

  // Team handlers
  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a team name',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createTeamMutation.mutateAsync({
        name: newTeamName.trim(),
        color: newTeamColor,
      });
      toast({
        title: 'Team Created',
        description: `${newTeamName} has been created successfully`,
      });
      setNewTeamName('');
      setNewTeamColor('bg-blue-500');
      setShowCreateTeam(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create team',
        variant: 'destructive',
      });
    }
  };

  const handleEditTeam = (team) => {
    setSelectedTeam(team);
    setEditTeamName(team.name);
    setEditTeamColor(team.color || 'bg-blue-500');
    setShowEditTeamDialog(true);
  };

  const handleSaveTeam = async () => {
    if (!selectedTeam || !editTeamName.trim()) return;

    try {
      await updateTeamMutation.mutateAsync({
        teamId: selectedTeam.id,
        data: {
          name: editTeamName.trim(),
          color: editTeamColor,
        },
      });
      toast({
        title: 'Team Updated',
        description: `${editTeamName} has been updated successfully`,
      });
      setShowEditTeamDialog(false);
      setSelectedTeam(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update team',
        variant: 'destructive',
      });
    }
  };

  const handleManageMembers = (team) => {
    setSelectedTeam(team);
    setShowManageMembersDialog(true);
  };

  const handleDeleteTeam = (team) => {
    setSelectedTeam(team);
    setShowDeleteTeamConfirm(true);
  };

  const handleConfirmDeleteTeam = async () => {
    if (!selectedTeam) return;

    try {
      await deleteTeamMutation.mutateAsync(selectedTeam.id);
      toast({
        title: 'Team Deleted',
        description: `${selectedTeam.name} has been deleted`,
      });
      setShowDeleteTeamConfirm(false);
      setSelectedTeam(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete team',
        variant: 'destructive',
      });
    }
  };

  const handleAddMember = async (userId) => {
    if (!selectedTeam) return;

    try {
      await addTeamMemberMutation.mutateAsync({
        teamId: selectedTeam.id,
        data: { userId },
      });
      toast({
        title: 'Member Added',
        description: 'User has been added to the team',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add member',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!selectedTeam) return;

    try {
      await removeTeamMemberMutation.mutateAsync({
        teamId: selectedTeam.id,
        userId,
      });
      toast({
        title: 'Member Removed',
        description: 'User has been removed from the team',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to remove member',
        variant: 'destructive',
      });
    }
  };

  // Helper to get user display name
  const getUserName = (user) => {
    if (user.name) return user.name;
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    return user.email?.split('@')[0] || 'Unknown';
  };

  // Helper to get user team name
  const getUserTeam = (user) => {
    if (user.team?.name) return user.team.name;
    if (typeof user.team === 'string') return user.team;
    return user.teamId ? teamsData.find((t) => t.id === user.teamId)?.name : null;
  };

  // Helper to get user role
  const getUserRole = (user) => {
    if (user.role?.name) return user.role.name;
    if (typeof user.role === 'string') return user.role;
    return 'Agent';
  };

  const filteredUsers = usersData.filter((user) => {
    const userName = getUserName(user).toLowerCase();
    const userEmail = (user.email || '').toLowerCase();
    const userRole = getUserRole(user);
    const userTeam = getUserTeam(user);

    const matchesSearch =
      userName.includes(searchQuery.toLowerCase()) || userEmail.includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || userRole === roleFilter;
    const matchesTeam = teamFilter === 'all' || userTeam === teamFilter;
    return matchesSearch && matchesRole && matchesTeam;
  });

  // Calculate stats
  const stats = [
    createStat('Total Users', usersData.length, Users, 'blue'),
    createStat(
      'Active',
      usersData.filter((u) => u.status === 'active').length,
      CheckCircle2,
      'green'
    ),
    createStat('Teams', teamsData.length, Shield, 'purple'),
    createStat('Pending', pendingInvitations.length, Mail, 'orange'),
  ];

  // FixedMenuPanel configuration
  const fixedMenuConfig = {
    primaryActions: [{ id: 'invite', label: 'Invite User', icon: UserPlus, variant: 'default' }],
    secondaryActions: [],
    filters: {
      quickFilters: tabs.map((tab) => ({ id: tab.id, label: tab.label })),
    },
  };

  // Handle FixedMenuPanel actions
  const handleMenuAction = (actionId) => {
    if (actionId === 'invite') {
      setShowInviteDialog(true);
    }
  };

  // Fixed menu list content
  const fixedMenuListContent = (
    <div className="py-2">
      {activeTab === 'users' && (
        <>
          {/* Search Bar */}
          <div className="px-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Role & Team Filters */}
          <div className="px-4 mb-4 flex gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="h-8 text-xs flex-1">
                <Shield className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">
                  All Roles
                </SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role} value={role} className="text-xs">
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={teamFilter} onValueChange={setTeamFilter}>
              <SelectTrigger className="h-8 text-xs flex-1">
                <Users className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">
                  All Teams
                </SelectItem>
                {teamsData.map((team) => (
                  <SelectItem key={team.id} value={team.name} className="text-xs">
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Users List */}
          {usersLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-sm text-gray-500">Loading users...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Users className="h-7 w-7 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">No users found</p>
              <p className="text-xs text-gray-500 mb-4">
                {searchQuery || roleFilter !== 'all' || teamFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Invite team members to get started'}
              </p>
              <Button onClick={() => setShowInviteDialog(true)} size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Invite User
              </Button>
            </div>
          ) : (
            <div className="px-2">
              {filteredUsers.map((user, index) => {
                const userName = getUserName(user);
                const userRole = getUserRole(user);
                const userTeam = getUserTeam(user);
                const userStatus = user.status || 'active';
                const statusStyles = getStatusStyles(userStatus);
                const roleStyles = getRoleStyles(userRole);

                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center gap-3 p-3 mb-2 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 transition-all"
                  >
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={user.avatar || user.profileImage} />
                      <AvatarFallback className="bg-blue-50 text-blue-600 font-medium text-xs">
                        {getInitials(userName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-medium text-sm text-gray-900 truncate">{userName}</p>
                        <Badge
                          className={cn('px-1.5 py-0 text-[10px]', roleStyles.bg, roleStyles.color)}
                        >
                          {userRole}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      {userTeam && <p className="text-[10px] text-gray-400 mt-0.5">{userTeam}</p>}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 rounded-lg shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem
                          onClick={() => handleEditUser(user)}
                          className="rounded-lg text-xs"
                        >
                          <Edit className="mr-2 h-3 w-3" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg text-xs">
                          <Shield className="mr-2 h-3 w-3" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 rounded-lg text-xs"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <Trash2 className="mr-2 h-3 w-3" />
                          Remove User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {activeTab === 'invitations' && (
        <div className="px-2">
          {invitationsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-sm text-gray-500">Loading invitations...</span>
            </div>
          ) : pendingInvitations.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-7 w-7 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">No pending invitations</p>
              <p className="text-xs text-gray-500 mb-4">Invite team members to get started</p>
              <Button onClick={() => setShowInviteDialog(true)} size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Invite User
              </Button>
            </div>
          ) : (
            pendingInvitations.map((invitation, index) => {
              const inviterName =
                invitation.invitedBy?.name ||
                invitation.invitedByUser?.name ||
                `${invitation.invitedBy?.firstName || ''} ${invitation.invitedBy?.lastName || ''}`.trim() ||
                'Unknown';
              const invitationRole =
                invitation.role?.name || invitation.role || invitation.roleName || 'Agent';
              const invitationTeam =
                invitation.team?.name || invitation.team || invitation.teamName;

              return (
                <motion.div
                  key={invitation.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="p-3 mb-2 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-orange-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {invitation.email}
                      </p>
                      <p className="text-xs text-gray-500">Invited by {inviterName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-blue-50 text-blue-700 text-[10px]">{invitationRole}</Badge>
                    {invitationTeam && (
                      <Badge className="bg-gray-100 text-gray-600 text-[10px]">
                        {invitationTeam}
                      </Badge>
                    )}
                  </div>

                  {(invitation.expiresAt || invitation.expirationDate) && (
                    <p className="text-[10px] text-gray-500 mb-2">
                      Expires{' '}
                      {new Date(
                        invitation.expiresAt || invitation.expirationDate
                      ).toLocaleDateString()}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg flex-1 h-8 text-xs"
                      disabled={resendInvitationMutation.isPending}
                      onClick={async () => {
                        try {
                          await resendInvitationMutation.mutateAsync(invitation.id);
                          toast({
                            title: 'Invitation Resent',
                            description: `Invitation resent to ${invitation.email}`,
                          });
                        } catch (error) {
                          toast({
                            title: 'Error',
                            description:
                              error.response?.data?.message || 'Failed to resend invitation',
                            variant: 'destructive',
                          });
                        }
                      }}
                    >
                      {resendInvitationMutation.isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        'Resend'
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-lg flex-1 h-8 text-xs text-red-600 hover:text-red-700"
                      disabled={revokeInvitationMutation.isPending}
                      onClick={async () => {
                        try {
                          await revokeInvitationMutation.mutateAsync(invitation.id);
                          toast({
                            title: 'Invitation Revoked',
                            description: `Invitation to ${invitation.email} has been revoked`,
                          });
                        } catch (error) {
                          toast({
                            title: 'Error',
                            description:
                              error.response?.data?.message || 'Failed to revoke invitation',
                            variant: 'destructive',
                          });
                        }
                      }}
                    >
                      {revokeInvitationMutation.isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        'Revoke'
                      )}
                    </Button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}
    </div>
  );

  // Content area - Empty state for settings pages typically
  const contentArea = (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mb-4">
        <Users className="h-10 w-10 text-blue-600" />
      </div>
      <h3 className="font-semibold text-lg mb-2">User Management</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
        Select a user from the sidebar to view details, or invite new team members to your
        workspace.
      </p>
    </div>
  );

  return (
    <>
      <UnifiedLayout hubId="settings" pageTitle="Users" stats={stats} fixedMenu={null}>
        <div className="flex h-full">
          {/* Fixed Menu Panel */}
          <div className="w-80 border-r border-gray-200 flex flex-col">
            <FixedMenuPanel
              config={fixedMenuConfig}
              activeFilter={activeTab}
              onFilterChange={setActiveTab}
              onAction={handleMenuAction}
            />
            <div className="flex-1 overflow-auto">{fixedMenuListContent}</div>
          </div>
          {/* Content Area */}
          <div className="flex-1 overflow-auto">{contentArea}</div>
        </div>
      </UnifiedLayout>

      {/* Invite User Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>Send an invitation to join your workspace</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-700">Email Address</Label>
              <Input
                type="email"
                placeholder="user@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="h-11 rounded-xl bg-gray-50"
              />
            </div>
            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label className="text-gray-700">Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger className="h-11 rounded-xl bg-gray-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700">Team</Label>
                <Select value={inviteTeam} onValueChange={setInviteTeam}>
                  <SelectTrigger className="h-11 rounded-xl bg-gray-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {teamsData.map((team) => (
                      <SelectItem key={team.id} value={team.name}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowInviteDialog(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleInviteUser}
              disabled={inviteUserMutation.isPending}
              className="rounded-xl"
            >
              {inviteUserMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user details and permissions</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedUser.avatar || selectedUser.profileImage} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {getInitials(getUserName(selectedUser))}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{getUserName(selectedUser)}</p>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-gray-700">Role</Label>
                  <Select value={editRole} onValueChange={setEditRole}>
                    <SelectTrigger className="h-11 rounded-xl bg-gray-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Team</Label>
                  <Select value={editTeam} onValueChange={setEditTeam}>
                    <SelectTrigger className="h-11 rounded-xl bg-gray-50">
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamsData.map((team) => (
                        <SelectItem key={team.id} value={team.name}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700">Status</Label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger className="h-11 rounded-xl bg-gray-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveUser}
              disabled={updateUserMutation.isPending}
              className="rounded-xl"
            >
              {updateUserMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Team Dialog */}
      <Dialog open={showCreateTeam} onOpenChange={setShowCreateTeam}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Team</DialogTitle>
            <DialogDescription>Create a new team to organize your users</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-700">Team Name</Label>
              <Input
                placeholder="e.g., Customer Success"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="h-11 rounded-xl bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Team Color</Label>
              <div className="flex gap-2">
                {[
                  'bg-blue-500',
                  'bg-green-500',
                  'bg-purple-500',
                  'bg-orange-500',
                  'bg-red-500',
                  'bg-yellow-500',
                ].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewTeamColor(color)}
                    className={cn(
                      `h-9 w-9 rounded-xl ${color} ring-offset-2 hover:ring-2 ring-gray-400 transition-all`,
                      newTeamColor === color && 'ring-2 ring-gray-800'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateTeam(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTeam}
              disabled={createTeamMutation.isPending}
              className="rounded-xl"
            >
              {createTeamMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Create Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Team Dialog */}
      <Dialog open={showEditTeamDialog} onOpenChange={setShowEditTeamDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
            <DialogDescription>Update team details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-700">Team Name</Label>
              <Input
                placeholder="e.g., Customer Success"
                value={editTeamName}
                onChange={(e) => setEditTeamName(e.target.value)}
                className="h-11 rounded-xl bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Team Color</Label>
              <div className="flex gap-2">
                {[
                  'bg-blue-500',
                  'bg-green-500',
                  'bg-purple-500',
                  'bg-orange-500',
                  'bg-red-500',
                  'bg-yellow-500',
                ].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setEditTeamColor(color)}
                    className={cn(
                      `h-9 w-9 rounded-xl ${color} ring-offset-2 hover:ring-2 ring-gray-400 transition-all`,
                      editTeamColor === color && 'ring-2 ring-gray-800'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditTeamDialog(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveTeam}
              disabled={updateTeamMutation.isPending}
              className="rounded-xl"
            >
              {updateTeamMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Members Dialog */}
      <Dialog open={showManageMembersDialog} onOpenChange={setShowManageMembersDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage Team Members</DialogTitle>
            <DialogDescription>
              {selectedTeam
                ? `Add or remove members from ${selectedTeam.name}`
                : 'Manage team members'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {/* Current team members */}
            <div className="space-y-2">
              <Label className="text-gray-700 text-sm font-medium">Current Members</Label>
              {teamMembersLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  <span className="ml-2 text-sm text-gray-500">Loading members...</span>
                </div>
              ) : teamMembers.length === 0 ? (
                <p className="text-sm text-gray-500 py-2">No members in this team yet</p>
              ) : (
                <div className="space-y-2">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={member.avatar || member.avatarUrl} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                            {getInitials(getUserName(member))}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{getUserName(member)}</p>
                          <p className="text-xs text-gray-500">{member.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={removeTeamMemberMutation.isPending}
                      >
                        {removeTeamMemberMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add new members */}
            <div className="space-y-2 border-t pt-4">
              <Label className="text-gray-700 text-sm font-medium">Add Members</Label>
              <div className="space-y-2">
                {usersData
                  .filter((user) => !teamMembers.some((m) => m.id === user.id))
                  .slice(0, 5)
                  .map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.avatar || user.avatarUrl} />
                          <AvatarFallback className="bg-gray-100 text-gray-600 text-sm">
                            {getInitials(getUserName(user))}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{getUserName(user)}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 rounded-lg"
                        onClick={() => handleAddMember(user.id)}
                        disabled={addTeamMemberMutation.isPending}
                      >
                        {addTeamMemberMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                {usersData.filter((user) => !teamMembers.some((m) => m.id === user.id)).length ===
                  0 && (
                  <p className="text-sm text-gray-500 py-2">All users are already in this team</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowManageMembersDialog(false)}
              className="rounded-xl"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Team Confirmation */}
      <AlertDialog open={showDeleteTeamConfirm} onOpenChange={setShowDeleteTeamConfirm}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the team "{selectedTeam?.name}". Team members will not be deleted but
              will be removed from the team. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 rounded-xl"
              disabled={deleteTeamMutation.isPending}
              onClick={handleConfirmDeleteTeam}
            >
              {deleteTeamMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete Team
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove User?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {selectedUser ? getUserName(selectedUser) : 'this user'} from your
              workspace. They will lose access to all conversations and data. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 rounded-xl"
              disabled={deleteUserMutation.isPending}
              onClick={async () => {
                if (!selectedUser) return;
                try {
                  await deleteUserMutation.mutateAsync(selectedUser.id);
                  toast({
                    title: 'User Removed',
                    description: `${getUserName(selectedUser)} has been removed from your workspace`,
                  });
                  setShowDeleteConfirm(false);
                  setSelectedUser(null);
                } catch (error) {
                  toast({
                    title: 'Error',
                    description: error.response?.data?.message || 'Failed to remove user',
                    variant: 'destructive',
                  });
                }
              }}
            >
              {deleteUserMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Remove User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
