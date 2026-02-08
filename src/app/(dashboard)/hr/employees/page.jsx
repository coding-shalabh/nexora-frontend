'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  Mail,
  MapPin,
  UserPlus,
  UserCheck,
  UserX,
  Calendar,
  ChevronRight,
  CheckSquare,
  Square,
  MinusSquare,
  FileDown,
  Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { FixedMenuPanel } from '@/components/layout/fixed-menu-panel';

const employees = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'Product Designer',
    department: 'Design',
    status: 'active',
    avatar: 'SJ',
    location: 'Mumbai',
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael@company.com',
    role: 'Software Engineer',
    department: 'Engineering',
    status: 'active',
    avatar: 'MC',
    location: 'Bangalore',
  },
  {
    id: 3,
    name: 'Emily Brown',
    email: 'emily@company.com',
    role: 'Marketing Manager',
    department: 'Marketing',
    status: 'active',
    avatar: 'EB',
    location: 'Delhi',
  },
  {
    id: 4,
    name: 'David Wilson',
    email: 'david@company.com',
    role: 'Sales Executive',
    department: 'Sales',
    status: 'on-leave',
    avatar: 'DW',
    location: 'Chennai',
  },
  {
    id: 5,
    name: 'Priya Sharma',
    email: 'priya@company.com',
    role: 'HR Manager',
    department: 'Human Resources',
    status: 'active',
    avatar: 'PS',
    location: 'Mumbai',
  },
  {
    id: 6,
    name: 'Rahul Gupta',
    email: 'rahul@company.com',
    role: 'DevOps Engineer',
    department: 'Engineering',
    status: 'active',
    avatar: 'RG',
    location: 'Pune',
  },
];

// Employee List Item Component
function EmployeeListItem({
  employee,
  isSelected,
  onClick,
  isChecked,
  onCheckChange,
  showCheckbox,
}) {
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

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
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
            <span className="text-sm font-semibold text-primary">{employee.avatar}</span>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm truncate">{employee.name}</span>
            {employee.status === 'active' && (
              <span className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
            )}
          </div>

          {/* Email & Role */}
          <div className="flex items-center gap-1.5 mb-2">
            {employee.email && (
              <span className="text-[10px] text-muted-foreground truncate">{employee.email}</span>
            )}
          </div>

          {/* Department & Location */}
          <div className="flex items-center gap-2">
            {employee.department && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                {employee.department}
              </Badge>
            )}
            {employee.location && (
              <span className="text-[10px] text-muted-foreground truncate flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {employee.location}
              </span>
            )}
          </div>
        </div>

        {/* Arrow - Clickable to open employee */}
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

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectionMode, setSelectionMode] = useState(false);

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        !searchQuery ||
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment =
        departmentFilter === 'all' ||
        emp.department.toLowerCase() === departmentFilter.toLowerCase();

      const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [employees, searchQuery, departmentFilter, statusFilter]);

  // Stats
  const stats = useMemo(
    () => ({
      total: employees.length,
      active: employees.filter((e) => e.status === 'active').length,
      onLeave: employees.filter((e) => e.status === 'on-leave').length,
      newThisMonth: 5,
    }),
    [employees]
  );

  // Handlers
  const openEmployee = (employee) => {
    setSelectedEmployee(employee);
  };

  const toggleSelectEmployee = (employeeId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(employeeId)) {
        next.delete(employeeId);
      } else {
        next.add(employeeId);
      }
      return next;
    });
  };

  const selectAllEmployees = () => {
    if (selectedIds.size === filteredEmployees.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredEmployees.map((e) => e.id)));
    }
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setSelectionMode(false);
  };

  const toggleSelectionMode = () => {
    if (selectionMode) {
      clearSelection();
    } else {
      setSelectionMode(true);
    }
  };

  // Stats for the top bar
  const layoutStats = [
    createStat('Total', stats.total, Users, 'blue'),
    createStat('Active', stats.active, UserCheck, 'green'),
    createStat('On Leave', stats.onLeave, Calendar, 'amber'),
    createStat('New', stats.newThisMonth, UserPlus, 'purple'),
  ];

  // FixedMenuPanel configuration - only filters and selection toggle
  const fixedMenuConfig = {
    primaryActions: [
      {
        id: 'selection',
        label: selectionMode ? 'Exit Selection' : 'Select',
        icon: selectionMode ? MinusSquare : CheckSquare,
        variant: selectionMode ? 'secondary' : 'outline',
      },
    ],
    filters: {
      quickFilters: [
        { id: 'all', label: 'All' },
        { id: 'active', label: 'Active' },
        { id: 'on-leave', label: 'On Leave' },
      ],
    },
  };

  // Handle FixedMenuPanel actions
  const handleMenuAction = (actionId) => {
    switch (actionId) {
      case 'selection':
        toggleSelectionMode();
        break;
      default:
        break;
    }
  };

  // Actions for the stats bar (top bar)
  const topBarActions = (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1.5"
        onClick={() => console.log('Import')}
      >
        <Upload className="h-3.5 w-3.5" />
        <span className="text-xs">Import</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1.5"
        onClick={() => console.log('Export')}
      >
        <Download className="h-3.5 w-3.5" />
        <span className="text-xs">Export</span>
      </Button>
      <Button size="sm" className="h-7 gap-1.5" onClick={() => console.log('Add Employee')}>
        <Plus className="h-3.5 w-3.5" />
        <span className="text-xs">Add Employee</span>
      </Button>
    </>
  );

  // Bulk actions configuration
  const bulkActions = [
    { id: 'export', label: 'Export', icon: FileDown, variant: 'outline' },
    { id: 'delete', label: 'Delete', icon: Trash2, variant: 'destructive' },
  ];

  const handleBulkAction = (actionId) => {
    switch (actionId) {
      case 'export':
        console.log('Export selected:', Array.from(selectedIds));
        break;
      case 'delete':
        if (confirm(`Delete ${selectedIds.size} employee(s)?`)) {
          console.log('Delete selected:', Array.from(selectedIds));
          clearSelection();
        }
        break;
      default:
        break;
    }
  };

  // Fixed menu list
  const fixedMenuListContent = (
    <div className="py-2">
      {/* Search Bar */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Department Filter */}
      <div className="px-4 mb-4">
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="h-8 text-xs">
            <Briefcase className="h-3 w-3 mr-1" />
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">
              All Departments
            </SelectItem>
            <SelectItem value="engineering" className="text-xs">
              Engineering
            </SelectItem>
            <SelectItem value="design" className="text-xs">
              Design
            </SelectItem>
            <SelectItem value="marketing" className="text-xs">
              Marketing
            </SelectItem>
            <SelectItem value="sales" className="text-xs">
              Sales
            </SelectItem>
            <SelectItem value="human resources" className="text-xs">
              Human Resources
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredEmployees.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-slate-400" />
          </div>
          <p className="font-medium mb-1">No employees found</p>
          <p className="text-xs text-muted-foreground mb-4">
            {searchQuery ? 'Try a different search term' : 'Add your first employee'}
          </p>
        </div>
      ) : (
        <>
          {/* Select All Row */}
          {selectionMode && filteredEmployees.length > 0 && (
            <button
              onClick={selectAllEmployees}
              className="w-full px-5 py-2 flex items-center gap-3 text-sm hover:bg-slate-50 transition-colors border-b border-gray-100"
            >
              {selectedIds.size === filteredEmployees.length ? (
                <CheckSquare className="h-4 w-4 text-primary" />
              ) : selectedIds.size > 0 ? (
                <MinusSquare className="h-4 w-4 text-primary" />
              ) : (
                <Square className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-muted-foreground">
                {selectedIds.size === filteredEmployees.length
                  ? 'Deselect all'
                  : `Select all (${filteredEmployees.length})`}
              </span>
            </button>
          )}
          {filteredEmployees.map((employee) => (
            <EmployeeListItem
              key={employee.id}
              employee={employee}
              isSelected={selectedEmployee?.id === employee.id}
              onClick={() => openEmployee(employee)}
              showCheckbox={selectionMode}
              isChecked={selectedIds.has(employee.id)}
              onCheckChange={() => toggleSelectEmployee(employee.id)}
            />
          ))}
        </>
      )}
    </div>
  );

  // Content area - Employee Detail View
  const contentArea = (
    <div className="h-full flex flex-col overflow-auto">
      {selectedEmployee ? (
        <div className="flex-1 p-6">
          {/* Employee Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-semibold text-primary">
                  {selectedEmployee.avatar}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedEmployee.name}</h2>
                <p className="text-muted-foreground">{selectedEmployee.role}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          {/* Employee Details */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedEmployee.email}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Department</label>
                <div className="mt-1">
                  <Badge variant="secondary">{selectedEmployee.department}</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge
                    className={cn(
                      selectedEmployee.status === 'active' && 'bg-green-100 text-green-700',
                      selectedEmployee.status === 'on-leave' && 'bg-orange-100 text-orange-700'
                    )}
                  >
                    {selectedEmployee.status === 'active' ? 'Active' : 'On Leave'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedEmployee.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="h-20 w-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Users className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No employee selected</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Select an employee from the list to view their details
          </p>
        </div>
      )}
    </div>
  );

  return (
    <HubLayout
      hubId="hr"
      showTopBar={false}
      showSidebar={false}
      title="Employees"
      description="Manage your team members"
      stats={layoutStats}
      actions={topBarActions}
      showFixedMenu={true}
      fixedMenuFilters={
        <FixedMenuPanel
          config={fixedMenuConfig}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
          onAction={handleMenuAction}
          selectedCount={selectedIds.size}
          bulkActions={bulkActions}
          onBulkAction={handleBulkAction}
          className="p-4"
        />
      }
      fixedMenuList={fixedMenuListContent}
    >
      {contentArea}
    </HubLayout>
  );
}
