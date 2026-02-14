'use client';

import { useState } from 'react';
import {
  UserMinus,
  Plus,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Key,
  Laptop,
  CreditCard,
  Calendar,
  User,
  Mail,
  Phone,
  Briefcase,
  Building2,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { UnifiedLayout, createStat } from '@/components/layout/unified';
import { FixedMenuPanel } from '@/components/layout/fixed-menu-panel';

const offboardingCases = [
  {
    id: 1,
    name: 'Alex Thompson',
    avatar: 'AT',
    email: 'alex.thompson@company.com',
    phone: '+91 98765 43210',
    role: 'Software Engineer',
    department: 'Engineering',
    lastDay: '2026-01-31',
    reason: 'Resignation',
    progress: 75,
    tasks: { completed: 6, total: 8 },
    status: 'in-progress',
    checklist: [
      { icon: FileText, label: 'Exit Interview', completed: true },
      { icon: Key, label: 'Access Revoked', completed: true },
      { icon: Laptop, label: 'Equipment Return', completed: true },
      { icon: CreditCard, label: 'Final Settlement', completed: true },
      { icon: FileText, label: 'Knowledge Transfer', completed: true },
      { icon: Key, label: 'Badge Collection', completed: true },
      { icon: Laptop, label: 'Software Deactivation', completed: false },
      { icon: CreditCard, label: 'Benefits Termination', completed: false },
    ],
  },
  {
    id: 2,
    name: 'Maria Garcia',
    avatar: 'MG',
    email: 'maria.garcia@company.com',
    phone: '+91 98765 43211',
    role: 'Marketing Specialist',
    department: 'Marketing',
    lastDay: '2026-02-15',
    reason: 'Career Change',
    progress: 25,
    tasks: { completed: 2, total: 8 },
    status: 'in-progress',
    checklist: [
      { icon: FileText, label: 'Exit Interview', completed: true },
      { icon: Key, label: 'Access Revoked', completed: true },
      { icon: Laptop, label: 'Equipment Return', completed: false },
      { icon: CreditCard, label: 'Final Settlement', completed: false },
      { icon: FileText, label: 'Knowledge Transfer', completed: false },
      { icon: Key, label: 'Badge Collection', completed: false },
      { icon: Laptop, label: 'Software Deactivation', completed: false },
      { icon: CreditCard, label: 'Benefits Termination', completed: false },
    ],
  },
  {
    id: 3,
    name: 'Robert Kim',
    avatar: 'RK',
    email: 'robert.kim@company.com',
    phone: '+91 98765 43212',
    role: 'Sales Executive',
    department: 'Sales',
    lastDay: '2026-01-20',
    reason: 'Retirement',
    progress: 100,
    tasks: { completed: 8, total: 8 },
    status: 'completed',
    checklist: [
      { icon: FileText, label: 'Exit Interview', completed: true },
      { icon: Key, label: 'Access Revoked', completed: true },
      { icon: Laptop, label: 'Equipment Return', completed: true },
      { icon: CreditCard, label: 'Final Settlement', completed: true },
      { icon: FileText, label: 'Knowledge Transfer', completed: true },
      { icon: Key, label: 'Badge Collection', completed: true },
      { icon: Laptop, label: 'Software Deactivation', completed: true },
      { icon: CreditCard, label: 'Benefits Termination', completed: true },
    ],
  },
  {
    id: 4,
    name: 'Lisa Wang',
    avatar: 'LW',
    email: 'lisa.wang@company.com',
    phone: '+91 98765 43213',
    role: 'HR Coordinator',
    department: 'HR',
    lastDay: '2026-02-28',
    reason: 'Relocation',
    progress: 0,
    tasks: { completed: 0, total: 8 },
    status: 'pending',
    checklist: [
      { icon: FileText, label: 'Exit Interview', completed: false },
      { icon: Key, label: 'Access Revoked', completed: false },
      { icon: Laptop, label: 'Equipment Return', completed: false },
      { icon: CreditCard, label: 'Final Settlement', completed: false },
      { icon: FileText, label: 'Knowledge Transfer', completed: false },
      { icon: Key, label: 'Badge Collection', completed: false },
      { icon: Laptop, label: 'Software Deactivation', completed: false },
      { icon: CreditCard, label: 'Benefits Termination', completed: false },
    ],
  },
];

const statusConfig = {
  'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
};

export default function OffboardingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCase, setSelectedCase] = useState(null);

  // Filter cases
  const filteredCases = offboardingCases.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const layoutStats = [
    createStat('Active', '4', UserMinus, 'amber'),
    createStat('Pending', '2', Clock, 'purple'),
    createStat('Completed', '8', CheckCircle, 'green'),
    createStat('Tasks Due', '12', AlertTriangle, 'red'),
  ];

  // FixedMenuPanel config - only filters
  const fixedMenuConfig = {
    filters: {
      quickFilters: [
        { id: 'all', label: 'All' },
        { id: 'in-progress', label: 'In Progress' },
        { id: 'pending', label: 'Pending' },
        { id: 'completed', label: 'Completed' },
      ],
    },
  };

  const handleAction = (actionId) => {
    console.log('Action:', actionId);
  };

  // Actions for the stats bar (top bar)
  const topBarActions = (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1.5"
        onClick={() => console.log('Export')}
      >
        <Download className="h-3.5 w-3.5" />
        <span className="text-xs">Export</span>
      </Button>
      <Button size="sm" className="h-7 gap-1.5" onClick={() => console.log('Initiate Offboarding')}>
        <Plus className="h-3.5 w-3.5" />
        <span className="text-xs">Initiate</span>
      </Button>
    </>
  );

  // Case List Item
  const CaseListItem = ({ caseItem }) => {
    const isSelected = selectedCase?.id === caseItem.id;
    const config = statusConfig[caseItem.status];

    return (
      <div
        onClick={() => setSelectedCase(caseItem)}
        className={cn(
          'p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50',
          isSelected && 'bg-primary/5 border-l-2 border-l-primary'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-medium text-primary">{caseItem.avatar}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-medium text-sm truncate">{caseItem.name}</h3>
              <Badge className={cn('text-xs shrink-0', config.color)}>{config.label}</Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate">{caseItem.role}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {caseItem.lastDay}
              </span>
              <span>{caseItem.progress}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Middle panel list
  const fixedMenuListContent = (
    <div>
      {/* Search */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Case list */}
      {filteredCases.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <UserMinus className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="font-medium">No cases found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
        </div>
      ) : (
        filteredCases.map((caseItem) => <CaseListItem key={caseItem.id} caseItem={caseItem} />)
      )}
    </div>
  );

  // Right panel content
  const contentArea = selectedCase ? (
    <div className="h-full overflow-y-auto p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="text-xl font-medium text-primary">{selectedCase.avatar}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{selectedCase.name}</h2>
            <p className="text-muted-foreground">
              {selectedCase.role} • {selectedCase.department}
            </p>
          </div>
        </div>
        <Badge className={cn('text-sm', statusConfig[selectedCase.status].color)}>
          {statusConfig[selectedCase.status].label}
        </Badge>
      </div>

      {/* Exit Info Card */}
      <Card className="mb-6">
        <div className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Exit Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <Calendar className="h-5 w-5 text-amber-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-amber-700">{selectedCase.lastDay}</p>
              <p className="text-xs text-amber-600">Last Working Day</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Briefcase className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-blue-700">{selectedCase.reason}</p>
              <p className="text-xs text-blue-600">Reason</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Progress Card */}
      <Card className="mb-6">
        <div className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Offboarding Progress
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Completed Tasks</span>
              <span className="font-medium">
                {selectedCase.tasks.completed} of {selectedCase.tasks.total}
              </span>
            </div>
            <Progress value={selectedCase.progress} className="h-3" />
          </div>
        </div>
      </Card>

      {/* Checklist */}
      <Card className="mb-6">
        <div className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Offboarding Checklist
          </h3>
          <div className="space-y-3">
            {selectedCase.checklist.map((item, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border',
                  item.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                )}
              >
                <div
                  className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center',
                    item.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                  )}
                >
                  {item.completed ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <item.icon className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={cn('font-medium text-sm', item.completed && 'text-green-700')}>
                    {item.label}
                  </p>
                </div>
                {!item.completed && (
                  <Button size="sm" variant="outline">
                    Complete
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Contact Info */}
      <Card>
        <div className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <User className="h-4 w-4" />
            Contact Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{selectedCase.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{selectedCase.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{selectedCase.department}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  ) : (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <UserMinus className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Case Selected</h3>
      <p className="text-muted-foreground">
        Select an offboarding case from the list to view details
      </p>
    </div>
  );

  return (
    <UnifiedLayout hubId="hr" pageTitle="Offboarding" stats={layoutStats} fixedMenu={null}>
      {contentArea}
    </UnifiedLayout>
  );
}
