'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Plus,
  Download,
  Upload,
  Edit,
  Trash2,
  Mail,
  MapPin,
  UserPlus,
  UserCheck,
  Calendar,
  ChevronRight,
  CheckSquare,
  Square,
  MinusSquare,
  FileDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { UnifiedLayout, createStat, createAction } from '@/components/layout/unified';

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

  // Actions for the status bar
  const actions = [
    createAction('Import', Upload, () => console.log('Import')),
    createAction('Export', Download, () => console.log('Export')),
    createAction('Add Employee', Plus, () => console.log('Add Employee'), { primary: true }),
  ];

  // Handle bulk actions
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

  // Fixed menu config for UnifiedLayout
  const fixedMenuConfig = {
    items: filteredEmployees,
    searchPlaceholder: 'Search employees...',
    emptyMessage: searchQuery ? 'No employees match your search' : 'Add your first employee',
    EmptyIcon: Users,
    filters: [
      {
        id: 'status',
        label: 'Status',
        options: [
          { value: 'all', label: 'All' },
          { value: 'active', label: 'Active' },
          { value: 'on-leave', label: 'On Leave' },
        ],
      },
    ],
    switchOptions: [
      { value: 'all', label: 'All Departments' },
      { value: 'engineering', label: 'Engineering' },
      { value: 'design', label: 'Design' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'sales', label: 'Sales' },
      { value: 'human resources', label: 'Human Resources' },
    ],
    getItemId: (emp) => emp.id,
    renderItem: ({ item: employee, isSelected }) => (
      <EmployeeListItem
        employee={employee}
        isSelected={isSelected}
        onClick={() => openEmployee(employee)}
        showCheckbox={selectionMode}
        isChecked={selectedIds.has(employee.id)}
        onCheckChange={() => toggleSelectEmployee(employee.id)}
      />
    ),
    footer: selectionMode && selectedIds.size > 0 && (
      <div className="p-3 border-t bg-slate-50 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{selectedIds.size} selected</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleBulkAction('export')}>
            <FileDown className="h-3.5 w-3.5 mr-1" />
            Export
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleBulkAction('delete')}>
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    ),
  };

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

  // Handle filter changes from UnifiedLayout
  const handleFilterApply = (filters) => {
    if (filters.status) {
      setStatusFilter(filters.status);
    }
  };

  // Handle switch (department) changes
  const handleSwitchChange = (value) => {
    setDepartmentFilter(value);
  };

  return (
    <UnifiedLayout
      hubId="hr"
      pageTitle="Employees"
      stats={layoutStats}
      actions={actions}
      fixedMenu={{
        ...fixedMenuConfig,
        onFilterApply: handleFilterApply,
        onSwitchChange: handleSwitchChange,
      }}
    >
      {contentArea}
    </UnifiedLayout>
  );
}
