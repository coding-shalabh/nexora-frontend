'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Users,
  Lock,
  Eye,
  MessageSquare,
  Settings,
  Zap,
  CreditCard,
  BarChart3,
  Check,
  X,
  Search,
  Loader2,
  AlertCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useRoles } from '@/hooks/use-users';
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
      duration: 0.3,
    },
  },
};

// Color mapping for roles - assign colors based on role name
const roleColorMap = {
  'Super Admin': 'purple',
  Admin: 'red',
  Manager: 'blue',
  'Team Lead': 'indigo',
  'Sales Representative': 'green',
  Marketing: 'amber',
  'Support Agent': 'cyan',
  Staff: 'orange',
  'Read-only': 'gray',
};

// Default permissions template for display purposes
const defaultPermissions = {
  inbox: { view: false, manage: false, delete: false, assign: false },
  contacts: { view: false, create: false, edit: false, delete: false, export: false },
  campaigns: { view: false, create: false, edit: false, delete: false, send: false },
  analytics: { view: false, export: false },
  settings: { view: false, manage: false },
  billing: { view: false, manage: false },
  users: { view: false, invite: false, manage: false, delete: false },
  integrations: { view: false, manage: false },
};

const permissionCategories = [
  {
    id: 'inbox',
    name: 'Inbox',
    icon: MessageSquare,
    color: 'purple',
    permissions: [
      { id: 'view', label: 'View conversations' },
      { id: 'manage', label: 'Reply and manage' },
      { id: 'delete', label: 'Delete conversations' },
      { id: 'assign', label: 'Assign to others' },
    ],
  },
  {
    id: 'contacts',
    name: 'Contacts',
    icon: Users,
    color: 'blue',
    permissions: [
      { id: 'view', label: 'View contacts' },
      { id: 'create', label: 'Create contacts' },
      { id: 'edit', label: 'Edit contacts' },
      { id: 'delete', label: 'Delete contacts' },
      { id: 'export', label: 'Export contacts' },
    ],
  },
  {
    id: 'campaigns',
    name: 'Campaigns',
    icon: Zap,
    color: 'amber',
    permissions: [
      { id: 'view', label: 'View campaigns' },
      { id: 'create', label: 'Create campaigns' },
      { id: 'edit', label: 'Edit campaigns' },
      { id: 'delete', label: 'Delete campaigns' },
      { id: 'send', label: 'Send campaigns' },
    ],
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: BarChart3,
    color: 'green',
    permissions: [
      { id: 'view', label: 'View analytics' },
      { id: 'export', label: 'Export reports' },
    ],
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: Settings,
    color: 'slate',
    permissions: [
      { id: 'view', label: 'View settings' },
      { id: 'manage', label: 'Manage settings' },
    ],
  },
  {
    id: 'billing',
    name: 'Billing',
    icon: CreditCard,
    color: 'pink',
    permissions: [
      { id: 'view', label: 'View billing' },
      { id: 'manage', label: 'Manage billing' },
    ],
  },
  {
    id: 'users',
    name: 'Users',
    icon: Users,
    color: 'indigo',
    permissions: [
      { id: 'view', label: 'View users' },
      { id: 'invite', label: 'Invite users' },
      { id: 'manage', label: 'Manage users' },
      { id: 'delete', label: 'Delete users' },
    ],
  },
  {
    id: 'integrations',
    name: 'Integrations',
    icon: Zap,
    color: 'cyan',
    permissions: [
      { id: 'view', label: 'View integrations' },
      { id: 'manage', label: 'Manage integrations' },
    ],
  },
];

const colorStyles = {
  red: { bg: 'bg-red-50', text: 'text-red-600', iconBg: 'bg-red-500' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', iconBg: 'bg-blue-500' },
  green: { bg: 'bg-green-50', text: 'text-green-600', iconBg: 'bg-green-500' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', iconBg: 'bg-purple-500' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', iconBg: 'bg-amber-500' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-600', iconBg: 'bg-pink-500' },
  indigo: { bg: 'bg-primary/5', text: 'text-primary', iconBg: 'bg-primary' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', iconBg: 'bg-cyan-500' },
  slate: { bg: 'bg-slate-50', text: 'text-slate-600', iconBg: 'bg-slate-500' },
  gray: { bg: 'bg-gray-50', text: 'text-gray-600', iconBg: 'bg-gray-500' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', iconBg: 'bg-orange-500' },
};

export default function RolesPage() {
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [showEditRole, setShowEditRole] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [newRolePermissions, setNewRolePermissions] = useState({});
  const [activeTab, setActiveTab] = useState('roles');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState('blue');

  // Fetch roles from API
  const { data: rolesResponse, isLoading, isError, error } = useRoles();

  // Process roles data from API
  const rolesData = useMemo(() => {
    if (!rolesResponse?.data) return [];
    return rolesResponse.data.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description || '',
      isDefault: role.name === 'Admin',
      isSystem: role.isSystem,
      usersCount: role.userCount || 0,
      color: roleColorMap[role.name] || 'gray',
      permissions:
        role.permissions && Object.keys(role.permissions).length > 0
          ? role.permissions
          : defaultPermissions,
    }));
  }, [rolesResponse]);

  // Compute stats dynamically
  const stats = useMemo(() => {
    const totalRoles = rolesData.length;
    const systemRoles = rolesData.filter((r) => r.isSystem).length;
    const customRoles = rolesData.filter((r) => !r.isSystem).length;
    const totalUsers = rolesData.reduce((sum, r) => sum + r.usersCount, 0);

    return [
      {
        title: 'Total Roles',
        value: String(totalRoles),
        icon: Shield,
        iconBg: 'bg-purple-50',
        iconColor: 'text-purple-600',
      },
      {
        title: 'System Roles',
        value: String(systemRoles),
        icon: Lock,
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600',
      },
      {
        title: 'Custom Roles',
        value: String(customRoles),
        icon: Edit,
        iconBg: 'bg-green-50',
        iconColor: 'text-green-600',
      },
      {
        title: 'Total Users',
        value: String(totalUsers),
        icon: Users,
        iconBg: 'bg-orange-50',
        iconColor: 'text-orange-600',
      },
    ];
  }, [rolesData]);

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setNewRolePermissions(role.permissions);
    setSelectedColor(role.color);
    setShowEditRole(true);
  };

  const handleDeleteRole = (role) => {
    setSelectedRole(role);
    setShowDeleteConfirm(true);
  };

  const handleDuplicateRole = (role) => {
    setSelectedRole({
      ...role,
      id: null,
      name: `${role.name} (Copy)`,
      isSystem: false,
      usersCount: 0,
    });
    setNewRolePermissions(role.permissions);
    setSelectedColor(role.color);
    setShowCreateRole(true);
  };

  const togglePermission = (category, permission) => {
    setNewRolePermissions({
      ...newRolePermissions,
      [category]: {
        ...newRolePermissions[category],
        [permission]: !newRolePermissions[category]?.[permission],
      },
    });
  };

  const countPermissions = (permissions) => {
    let count = 0;
    Object.values(permissions).forEach((category) => {
      Object.values(category).forEach((value) => {
        if (value) count++;
      });
    });
    return count;
  };

  const filteredRoles = rolesData.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <Loader2 className="h-8 w-8 text-purple-600 animate-spin mb-4" />
        <p className="text-gray-500">Loading roles...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load roles</h3>
        <p className="text-gray-500 text-center max-w-md">
          {error?.message || 'An error occurred while fetching roles. Please try again.'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tab Navigation & Search */}
      <div className="px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex gap-1 p-1 bg-white rounded-xl shadow-sm">
            <button
              onClick={() => setActiveTab('roles')}
              className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'roles'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Roles
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'matrix'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Permission Matrix
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full sm:w-64 pl-10 pr-4 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        {activeTab === 'roles' ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4"
          >
            {filteredRoles.map((role) => {
              const style = colorStyles[role.color] || colorStyles.gray;
              return (
                <motion.div
                  key={role.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-white rounded-2xl p-6 shadow-sm cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    {/* Role Icon */}
                    <div
                      className={`shrink-0 h-12 w-12 rounded-xl ${style.iconBg} flex items-center justify-center`}
                    >
                      <Shield className="h-6 w-6 text-white" />
                    </div>

                    {/* Role Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{role.name}</span>
                        {role.isSystem && (
                          <Badge className="text-[10px] px-2 py-0.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-100">
                            System
                          </Badge>
                        )}
                        {role.isDefault && (
                          <Badge className="text-[10px] px-2 py-0.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-50">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{role.description}</p>
                    </div>

                    {/* Stats */}
                    <div className="hidden sm:flex items-center gap-6">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          {role.usersCount} users
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50">
                        <Lock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          {countPermissions(role.permissions)} permissions
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-xl hover:bg-gray-50"
                        onClick={() => handleEditRole(role)}
                      >
                        <Eye className="h-4 w-4 text-gray-500" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="rounded-xl hover:bg-gray-50">
                            <MoreHorizontal className="h-4 w-4 text-gray-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem
                            onClick={() => handleEditRole(role)}
                            className="rounded-lg"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {role.isSystem ? 'View' : 'Edit'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDuplicateRole(role)}
                            className="rounded-lg"
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          {!role.isSystem && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 rounded-lg"
                                onClick={() => handleDeleteRole(role)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          /* Permission Matrix View */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl p-6 shadow-sm overflow-x-auto"
          >
            {/* Matrix Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100 mb-4">
              <div className="w-48 shrink-0">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Module
                </span>
              </div>
              {rolesData.map((role) => {
                const style = colorStyles[role.color] || colorStyles.gray;
                return (
                  <div key={role.id} className="flex-1 min-w-[100px] text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`h-8 w-8 rounded-lg ${style.iconBg} flex items-center justify-center`}
                      >
                        <Shield className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">{role.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Matrix Body */}
            <div className="space-y-3">
              {permissionCategories.map((category) => {
                const CategoryIcon = category.icon;
                const catStyle = colorStyles[category.color] || colorStyles.gray;
                return (
                  <motion.div
                    key={category.id}
                    variants={itemVariants}
                    className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-48 shrink-0 flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-xl ${catStyle.bg} flex items-center justify-center`}
                      >
                        <CategoryIcon className={`h-5 w-5 ${catStyle.text}`} />
                      </div>
                      <span className="font-medium text-gray-900">{category.name}</span>
                    </div>
                    {rolesData.map((role) => {
                      const catPerms = role.permissions[category.id];
                      const enabledCount = catPerms
                        ? Object.values(catPerms).filter(Boolean).length
                        : 0;
                      const totalCount = category.permissions.length;
                      const percentage = Math.round((enabledCount / totalCount) * 100);

                      return (
                        <div key={role.id} className="flex-1 min-w-[100px] flex justify-center">
                          {enabledCount === totalCount ? (
                            <div className="flex flex-col items-center gap-1">
                              <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center">
                                <Check className="h-5 w-5 text-green-600" />
                              </div>
                              <span className="text-[10px] text-gray-400">Full access</span>
                            </div>
                          ) : enabledCount === 0 ? (
                            <div className="flex flex-col items-center gap-1">
                              <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center">
                                <X className="h-5 w-5 text-gray-400" />
                              </div>
                              <span className="text-[10px] text-gray-400">No access</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1">
                              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                <span className="text-sm font-semibold text-amber-600">
                                  {enabledCount}
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-400">
                                {enabledCount}/{totalCount}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* Create/Edit Role Dialog */}
      <Dialog
        open={showCreateRole || showEditRole}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateRole(false);
            setShowEditRole(false);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {showEditRole
                ? selectedRole?.isSystem
                  ? 'View Role'
                  : 'Edit Role'
                : 'Create New Role'}
            </DialogTitle>
            <DialogDescription>
              {showEditRole && selectedRole?.isSystem
                ? 'System roles cannot be modified'
                : 'Configure role details and permissions'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto space-y-6 pr-2">
            {/* Role Details */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role-name" className="text-sm font-medium">
                  Role Name
                </Label>
                <Input
                  id="role-name"
                  defaultValue={selectedRole?.name || ''}
                  placeholder="e.g., Team Lead"
                  disabled={selectedRole?.isSystem}
                  className="h-11 rounded-xl bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {['red', 'blue', 'green', 'purple', 'orange', 'pink', 'indigo', 'cyan'].map(
                    (color) => {
                      const style = colorStyles[color];
                      return (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`h-9 w-9 rounded-xl ${style.iconBg} transition-all ${
                            selectedColor === color
                              ? 'ring-2 ring-offset-2 ring-gray-400'
                              : 'hover:scale-110'
                          }`}
                          disabled={selectedRole?.isSystem}
                        />
                      );
                    }
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role-description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="role-description"
                defaultValue={selectedRole?.description || ''}
                placeholder="Brief description of this role..."
                rows={2}
                disabled={selectedRole?.isSystem}
                className="rounded-xl bg-gray-50 resize-none"
              />
            </div>

            {/* Permissions Grid */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Permissions</Label>
              <div className="grid gap-4 sm:grid-cols-2">
                {permissionCategories.map((category) => {
                  const CategoryIcon = category.icon;
                  const catStyle = colorStyles[category.color] || colorStyles.gray;
                  return (
                    <div key={category.id} className="p-4 rounded-2xl bg-gray-50">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`h-10 w-10 rounded-xl ${catStyle.bg} flex items-center justify-center`}
                        >
                          <CategoryIcon className={`h-5 w-5 ${catStyle.text}`} />
                        </div>
                        <span className="font-medium text-gray-900">{category.name}</span>
                      </div>
                      <div className="space-y-3">
                        {category.permissions.map((permission) => {
                          const isEnabled =
                            selectedRole?.permissions?.[category.id]?.[permission.id] ||
                            newRolePermissions[category.id]?.[permission.id];
                          return (
                            <div
                              key={permission.id}
                              className="flex items-center justify-between py-1"
                            >
                              <span className="text-sm text-gray-600">{permission.label}</span>
                              <Switch
                                checked={isEnabled}
                                onCheckedChange={() => togglePermission(category.id, permission.id)}
                                disabled={selectedRole?.isSystem}
                                className="scale-90"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4 pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateRole(false);
                setShowEditRole(false);
              }}
              className="rounded-xl"
            >
              {selectedRole?.isSystem ? 'Close' : 'Cancel'}
            </Button>
            {!selectedRole?.isSystem && (
              <Button
                onClick={() => {
                  setShowCreateRole(false);
                  setShowEditRole(false);
                }}
                className="rounded-xl"
              >
                {showEditRole ? 'Save Changes' : 'Create Role'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the &quot;{selectedRole?.name}&quot; role.
              {selectedRole?.usersCount > 0 && (
                <span className="block mt-2 px-3 py-2 rounded-xl bg-orange-50 text-orange-600">
                  Warning: {selectedRole.usersCount} users have this role and will need to be
                  reassigned.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 rounded-xl"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Delete Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
