'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UsersRound,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  Mail,
  Phone,
  MessageSquare,
  Search,
  Crown,
  Loader2,
  UserPlus,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { UnifiedLayout } from '@/components/layout/unified';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { cn } from '@/lib/utils';
import {
  useTeams,
  useCreateTeam,
  useUpdateTeam,
  useDeleteTeam,
  useTeamMembers,
  useAddTeamMember,
  useRemoveTeamMember,
  useUsers,
} from '@/hooks/use-users';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

const channelIcons = {
  whatsapp: MessageSquare,
  email: Mail,
  sms: Phone,
};

const colorConfig = {
  blue: {
    bg: 'bg-blue-500',
    light: 'bg-blue-50',
    text: 'text-blue-600',
    badge: 'bg-blue-50 text-blue-700',
  },
  green: {
    bg: 'bg-green-500',
    light: 'bg-green-50',
    text: 'text-green-600',
    badge: 'bg-green-50 text-green-700',
  },
  purple: {
    bg: 'bg-purple-500',
    light: 'bg-purple-50',
    text: 'text-purple-600',
    badge: 'bg-purple-50 text-purple-700',
  },
  orange: {
    bg: 'bg-orange-500',
    light: 'bg-orange-50',
    text: 'text-orange-600',
    badge: 'bg-orange-50 text-orange-700',
  },
  red: {
    bg: 'bg-red-500',
    light: 'bg-red-50',
    text: 'text-red-600',
    badge: 'bg-red-50 text-red-700',
  },
  gray: {
    bg: 'bg-gray-500',
    light: 'bg-gray-50',
    text: 'text-gray-600',
    badge: 'bg-gray-50 text-gray-700',
  },
};

const channelBadgeColors = {
  whatsapp: 'bg-emerald-50 text-emerald-700',
  email: 'bg-blue-50 text-blue-700',
  sms: 'bg-amber-50 text-amber-700',
};

export default function TeamsPage() {
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showEditTeam, setShowEditTeam] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showManageMembers, setShowManageMembers] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedColor, setSelectedColor] = useState('blue');
  const [searchQuery, setSearchQuery] = useState('');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [formData, setFormData] = useState({ name: '', description: '' });

  // API hooks
  const { data: teamsResponse, isLoading, error } = useTeams();
  const createTeam = useCreateTeam();
  const updateTeam = useUpdateTeam();
  const deleteTeam = useDeleteTeam();

  // Team member hooks
  const { data: teamMembersResponse, isLoading: isLoadingMembers } = useTeamMembers(
    selectedTeam?.id
  );
  const { data: usersResponse } = useUsers();
  const addTeamMember = useAddTeamMember();
  const removeTeamMember = useRemoveTeamMember();

  const teams = teamsResponse?.data || [];
  const teamMembers = teamMembersResponse?.data || [];
  const allUsers = usersResponse?.data || [];

  const handleEditTeam = (team) => {
    setSelectedTeam(team);
    setFormData({ name: team.name, description: team.description || '' });
    setSelectedColor(team.color || 'blue');
    setShowEditTeam(true);
  };

  const handleDeleteTeam = (team) => {
    setSelectedTeam(team);
    setShowDeleteConfirm(true);
  };

  const handleCreateSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Team name is required');
      return;
    }

    try {
      await createTeam.mutateAsync({
        name: formData.name,
        description: formData.description,
        color: selectedColor,
      });
      toast.success('Team created successfully');
      setShowCreateTeam(false);
      setFormData({ name: '', description: '' });
      setSelectedColor('blue');
    } catch (err) {
      toast.error(err.message || 'Failed to create team');
    }
  };

  const handleEditSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Team name is required');
      return;
    }

    try {
      await updateTeam.mutateAsync({
        teamId: selectedTeam.id,
        data: {
          name: formData.name,
          description: formData.description,
          color: selectedColor,
        },
      });
      toast.success('Team updated successfully');
      setShowEditTeam(false);
      setSelectedTeam(null);
      setFormData({ name: '', description: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to update team');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTeam.mutateAsync(selectedTeam.id);
      toast.success('Team deleted successfully');
      setShowDeleteConfirm(false);
      setSelectedTeam(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete team');
    }
  };

  const openCreateDialog = () => {
    setFormData({ name: '', description: '' });
    setSelectedColor('blue');
    setShowCreateTeam(true);
  };

  const handleManageMembers = (team) => {
    setSelectedTeam(team);
    setMemberSearchQuery('');
    setShowManageMembers(true);
  };

  const handleAddMember = async (userId) => {
    if (!selectedTeam) return;
    try {
      await addTeamMember.mutateAsync({
        teamId: selectedTeam.id,
        data: { userId, role: 'MEMBER' },
      });
      toast.success('Member added to team');
    } catch (err) {
      toast.error(err.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!selectedTeam) return;
    try {
      await removeTeamMember.mutateAsync({
        teamId: selectedTeam.id,
        userId,
      });
      toast.success('Member removed from team');
    } catch (err) {
      toast.error(err.message || 'Failed to remove member');
    }
  };

  // Get users who are not already in the team
  const memberIds = teamMembers.map((m) => m.userId || m.id);
  const availableUsers = allUsers.filter(
    (user) => !memberIds.includes(user.id) && user.status === 'ACTIVE'
  );

  // Filter available users by search
  const filteredAvailableUsers = availableUsers.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(memberSearchQuery.toLowerCase())
  );

  const filteredTeams = teams.filter(
    (team) =>
      team.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load teams</p>
          <p className="text-sm text-gray-500">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <UnifiedLayout hubId="settings" pageTitle="Teams" fixedMenu={null}>
      <div className="flex-1 space-y-6 p-6">
        {/* Header with Search and Add Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center justify-between gap-4"
        >
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Teams</h2>
            <p className="text-sm text-gray-500">Manage your organization's teams</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-64 pl-10 pr-4 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <Button
              onClick={openCreateDialog}
              className="h-11 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Team
            </Button>
          </div>
        </motion.div>

        {/* Teams Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredTeams.map((team) => {
            const colors = colorConfig[team.color] || colorConfig.blue;
            // API returns members as a number (count) or could be an array
            const membersCount =
              typeof team.members === 'number'
                ? team.members
                : team._count?.members ||
                  team._count?.users ||
                  (Array.isArray(team.members) ? team.members.length : 0);
            const channels = team.channels || [];

            return (
              <motion.div
                key={team.id}
                variants={itemVariants}
                whileHover={{ scale: 1.01, y: -2 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-gray-300 cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-12 w-12 rounded-xl ${colors.light} flex items-center justify-center`}
                    >
                      <UsersRound className={`h-6 w-6 ${colors.text}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{team.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {team.description || 'No description'}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-xl hover:bg-gray-100"
                      >
                        <MoreHorizontal className="h-4 w-4 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem
                        onClick={() => handleManageMembers(team)}
                        className="rounded-lg cursor-pointer"
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Manage Members
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEditTeam(team)}
                        className="rounded-lg cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Team
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 rounded-lg cursor-pointer focus:text-red-600 focus:bg-red-50"
                        onClick={() => handleDeleteTeam(team)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Team
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Members Count */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Members
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-lg ${colors.badge}`}>
                      {membersCount} member{membersCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <button
                    onClick={() => handleManageMembers(team)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {membersCount > 0 ? 'View & manage members' : 'Add members'}
                  </button>
                </div>

                {/* Channels */}
                {channels.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">
                      Channels
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {channels.map((channel) => {
                        const Icon = channelIcons[channel] || MessageSquare;
                        const badgeColor =
                          channelBadgeColors[channel] || 'bg-gray-50 text-gray-700';
                        return (
                          <span
                            key={channel}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium ${badgeColor}`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            {channel.charAt(0).toUpperCase() + channel.slice(1)}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* Empty State */}
          {filteredTeams.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full bg-white rounded-2xl p-12 shadow-sm text-center"
            >
              <div className="h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No teams found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Get started by creating your first team'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={openCreateDialog}
                  className="h-11 px-6 rounded-xl bg-gray-900 hover:bg-gray-800 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Team
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Create/Edit Team Dialog */}
        <Dialog
          open={showCreateTeam || showEditTeam}
          onOpenChange={(open) => {
            if (!open) {
              setShowCreateTeam(false);
              setShowEditTeam(false);
              setSelectedTeam(null);
              setFormData({ name: '', description: '' });
            }
          }}
        >
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
                  <UsersRound className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold">
                    {showEditTeam ? 'Edit Team' : 'Create Team'}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-500">
                    {showEditTeam
                      ? 'Update team details'
                      : 'Create a new team for your organization'}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="team-name" className="text-sm font-medium text-gray-700">
                  Team Name
                </Label>
                <Input
                  id="team-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Sales Team"
                  className="h-11 rounded-xl bg-gray-50 border-0 focus-visible:ring-2 focus-visible:ring-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Input
                  id="team-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the team's purpose..."
                  className="h-11 rounded-xl bg-gray-50 border-0 focus-visible:ring-2 focus-visible:ring-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Team Color</Label>
                <div className="flex gap-3 mt-2">
                  {Object.keys(colorConfig).map((color) => (
                    <motion.button
                      key={color}
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedColor(color)}
                      className={`h-10 w-10 rounded-xl ${colorConfig[color].bg} transition-all ${
                        selectedColor === color
                          ? 'ring-2 ring-offset-2 ring-gray-400'
                          : 'hover:ring-2 hover:ring-offset-2 hover:ring-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter className="gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateTeam(false);
                  setShowEditTeam(false);
                  setSelectedTeam(null);
                  setFormData({ name: '', description: '' });
                }}
                className="h-11 px-6 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={showEditTeam ? handleEditSubmit : handleCreateSubmit}
                disabled={createTeam.isPending || updateTeam.isPending}
                className="h-11 px-6 rounded-xl bg-gray-900 hover:bg-gray-800 text-white"
              >
                {(createTeam.isPending || updateTeam.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {showEditTeam ? 'Save Changes' : 'Create Team'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center mb-3">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <AlertDialogTitle className="text-lg font-semibold">Delete Team?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-500">
                This will permanently delete the "{selectedTeam?.name}" team. Team members will not
                be deleted but will be removed from this team.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3">
              <AlertDialogCancel className="h-11 px-6 rounded-xl">Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="h-11 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDeleteConfirm}
                disabled={deleteTeam.isPending}
              >
                {deleteTeam.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete Team
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Manage Members Dialog */}
        <Dialog
          open={showManageMembers}
          onOpenChange={(open) => {
            if (!open) {
              setShowManageMembers(false);
              setSelectedTeam(null);
              setMemberSearchQuery('');
            }
          }}
        >
          <DialogContent className="sm:max-w-lg rounded-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold">
                    Manage Members - {selectedTeam?.name}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-500">
                    Add or remove members from this team
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto space-y-6 py-4">
              {/* Current Members */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Current Members ({teamMembers.length})
                </h4>
                {isLoadingMembers ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
                ) : teamMembers.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {teamMembers.map((member) => (
                      <div
                        key={member.id || member.userId}
                        className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={member.user?.avatarUrl} />
                            <AvatarFallback className="bg-white text-gray-600 text-xs">
                              {(member.user?.firstName || 'U')
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {member.user?.firstName} {member.user?.lastName}
                            </p>
                            <p className="text-xs text-gray-500">{member.user?.email}</p>
                          </div>
                          {member.role === 'LEADER' && (
                            <span className="text-xs font-medium px-2 py-1 rounded-lg bg-amber-50 text-amber-700">
                              Leader
                            </span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member.userId || member.user?.id)}
                          disabled={removeTeamMember.isPending}
                          className="h-8 w-8 p-0 rounded-lg hover:bg-red-50 hover:text-red-600"
                        >
                          {removeTeamMember.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic py-2">No members in this team yet</p>
                )}
              </div>

              {/* Add Members */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Add Members</h4>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                    className="h-10 w-full pl-10 pr-4 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                {filteredAvailableUsers.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {filteredAvailableUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatarUrl} />
                            <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                              {(user.firstName || user.email || 'U')
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddMember(user.id)}
                          disabled={addTeamMember.isPending}
                          className="h-8 px-3 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-xs"
                        >
                          {addTeamMember.isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>
                              <Plus className="h-3 w-3 mr-1" />
                              Add
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic py-2">
                    {memberSearchQuery
                      ? 'No users found matching your search'
                      : 'All active users are already in this team'}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={() => {
                  setShowManageMembers(false);
                  setSelectedTeam(null);
                  setMemberSearchQuery('');
                }}
                className="h-11 px-6 rounded-xl bg-gray-900 hover:bg-gray-800 text-white"
              >
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </UnifiedLayout>
  );
}
