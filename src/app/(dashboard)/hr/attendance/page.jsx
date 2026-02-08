'use client';

import { useState } from 'react';
import {
  CalendarCheck,
  Clock,
  Users,
  LogIn,
  LogOut,
  Calendar,
  Download,
  Search,
  Filter,
  User,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { FixedMenuPanel } from '@/components/layout/fixed-menu-panel';

const todayAttendance = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'SJ',
    email: 'sarah.johnson@company.com',
    phone: '+91 98765 43210',
    department: 'Design',
    role: 'Product Designer',
    clockIn: '09:00 AM',
    clockOut: '06:00 PM',
    status: 'present',
    hours: '9h 00m',
    location: 'Office - Mumbai',
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'MC',
    email: 'michael.chen@company.com',
    phone: '+91 98765 43211',
    department: 'Engineering',
    role: 'Software Engineer',
    clockIn: '09:15 AM',
    clockOut: '-',
    status: 'working',
    hours: '7h 45m',
    location: 'Office - Mumbai',
  },
  {
    id: 3,
    name: 'Emily Brown',
    avatar: 'EB',
    email: 'emily.brown@company.com',
    phone: '+91 98765 43212',
    department: 'Marketing',
    role: 'Marketing Manager',
    clockIn: '08:45 AM',
    clockOut: '05:30 PM',
    status: 'present',
    hours: '8h 45m',
    location: 'Remote',
  },
  {
    id: 4,
    name: 'David Wilson',
    avatar: 'DW',
    email: 'david.wilson@company.com',
    phone: '+91 98765 43213',
    department: 'Sales',
    role: 'Sales Executive',
    clockIn: '-',
    clockOut: '-',
    status: 'on-leave',
    hours: '-',
    location: '-',
  },
  {
    id: 5,
    name: 'Priya Sharma',
    avatar: 'PS',
    email: 'priya.sharma@company.com',
    phone: '+91 98765 43214',
    department: 'HR',
    role: 'HR Manager',
    clockIn: '10:00 AM',
    clockOut: '-',
    status: 'late',
    hours: '6h 00m',
    location: 'Office - Delhi',
  },
  {
    id: 6,
    name: 'Rahul Gupta',
    avatar: 'RG',
    email: 'rahul.gupta@company.com',
    phone: '+91 98765 43215',
    department: 'Finance',
    role: 'Financial Analyst',
    clockIn: '-',
    clockOut: '-',
    status: 'absent',
    hours: '-',
    location: '-',
  },
];

const statusConfig = {
  present: { label: 'Present', color: 'bg-green-100 text-green-700' },
  working: { label: 'Working', color: 'bg-blue-100 text-blue-700' },
  'on-leave': { label: 'On Leave', color: 'bg-orange-100 text-orange-700' },
  late: { label: 'Late', color: 'bg-yellow-100 text-yellow-700' },
  absent: { label: 'Absent', color: 'bg-red-100 text-red-700' },
};

export default function AttendancePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Filter attendance records
  const filteredRecords = todayAttendance.filter((record) => {
    const matchesSearch = record.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats for header
  const layoutStats = [
    createStat('Present', '142', Users, 'green'),
    createStat('On Leave', '8', Calendar, 'amber'),
    createStat('Late', '5', Clock, 'purple'),
    createStat('Absent', '6', LogOut, 'red'),
  ];

  // FixedMenuPanel config - only filters
  const fixedMenuConfig = {
    filters: {
      quickFilters: [
        { id: 'all', label: 'All' },
        { id: 'present', label: 'Present' },
        { id: 'working', label: 'Working' },
        { id: 'late', label: 'Late' },
        { id: 'absent', label: 'Absent' },
        { id: 'on-leave', label: 'On Leave' },
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
        onClick={() => console.log('Calendar')}
      >
        <Calendar className="h-3.5 w-3.5" />
        <span className="text-xs">Calendar</span>
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
    </>
  );

  // Attendance List Item Component
  const AttendanceListItem = ({ record }) => {
    const config = statusConfig[record.status];
    const isSelected = selectedRecord?.id === record.id;

    return (
      <div
        onClick={() => setSelectedRecord(record)}
        className={cn(
          'p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50',
          isSelected && 'bg-primary/5 border-l-2 border-l-primary'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-medium text-primary">{record.avatar}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-medium text-sm truncate">{record.name}</h3>
              <Badge className={cn('text-xs shrink-0', config.color)}>{config.label}</Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate">{record.role}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <LogIn className="h-3 w-3 text-green-500" />
                {record.clockIn}
              </span>
              <span className="flex items-center gap-1">
                <LogOut className="h-3 w-3 text-red-500" />
                {record.clockOut}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Middle panel list content
  const fixedMenuListContent = (
    <div>
      {/* Search */}
      <div className="p-4 border-b border-gray-100">
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

      {/* Date header */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarCheck className="h-4 w-4" />
          <span>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Attendance list */}
      {filteredRecords.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Users className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="font-medium">No records found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
        </div>
      ) : (
        filteredRecords.map((record) => <AttendanceListItem key={record.id} record={record} />)
      )}
    </div>
  );

  // Right panel content area
  const contentArea = selectedRecord ? (
    <div className="h-full overflow-y-auto p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="text-xl font-medium text-primary">{selectedRecord.avatar}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{selectedRecord.name}</h2>
            <p className="text-muted-foreground">
              {selectedRecord.role} • {selectedRecord.department}
            </p>
          </div>
        </div>
        <Badge className={cn('text-sm', statusConfig[selectedRecord.status].color)}>
          {statusConfig[selectedRecord.status].label}
        </Badge>
      </div>

      {/* Today's Summary Card */}
      <Card className="mb-6">
        <div className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CalendarCheck className="h-4 w-4" />
            Today's Attendance
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <LogIn className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-green-700">{selectedRecord.clockIn}</p>
              <p className="text-xs text-green-600">Clock In</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <LogOut className="h-5 w-5 text-red-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-red-700">{selectedRecord.clockOut}</p>
              <p className="text-xs text-red-600">Clock Out</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-blue-700">{selectedRecord.hours}</p>
              <p className="text-xs text-blue-600">Total Hours</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Employee Details */}
      <Card>
        <div className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <User className="h-4 w-4" />
            Employee Details
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{selectedRecord.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{selectedRecord.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Work Location</p>
                <p className="font-medium">{selectedRecord.location}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  ) : (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <CalendarCheck className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Record Selected</h3>
      <p className="text-muted-foreground">
        Select an employee from the list to view attendance details
      </p>
    </div>
  );

  return (
    <HubLayout
      hubId="hr"
      showTopBar={false}
      showSidebar={false}
      title="Attendance"
      description="Track employee attendance and work hours"
      stats={layoutStats}
      actions={topBarActions}
      showFixedMenu={true}
      fixedMenuFilters={
        <FixedMenuPanel
          config={fixedMenuConfig}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
          onAction={handleAction}
          className="p-4"
        />
      }
      fixedMenuList={fixedMenuListContent}
    >
      {contentArea}
    </HubLayout>
  );
}
