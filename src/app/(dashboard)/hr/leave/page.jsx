'use client';

import { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Search,
  Check,
  X,
  Clock,
  Calendar,
  AlertCircle,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { UnifiedLayout, createStat } from '@/components/layout/unified';
import { FixedMenuPanel } from '@/components/layout/fixed-menu-panel';

const leaveRequests = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'SJ',
    type: 'Annual Leave',
    from: '2026-01-25',
    to: '2026-01-30',
    days: 5,
    status: 'pending',
    reason: 'Family vacation',
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'MC',
    type: 'Sick Leave',
    from: '2026-01-20',
    to: '2026-01-20',
    days: 1,
    status: 'approved',
    reason: 'Doctor appointment',
  },
  {
    id: 3,
    name: 'Emily Brown',
    avatar: 'EB',
    type: 'Work From Home',
    from: '2026-01-22',
    to: '2026-01-23',
    days: 2,
    status: 'approved',
    reason: 'Personal work',
  },
  {
    id: 4,
    name: 'David Wilson',
    avatar: 'DW',
    type: 'Annual Leave',
    from: '2026-02-01',
    to: '2026-02-07',
    days: 5,
    status: 'pending',
    reason: 'Travel',
  },
  {
    id: 5,
    name: 'Priya Sharma',
    avatar: 'PS',
    type: 'Maternity Leave',
    from: '2026-03-01',
    to: '2026-06-01',
    days: 90,
    status: 'approved',
    reason: 'Maternity',
  },
  {
    id: 6,
    name: 'Rahul Gupta',
    avatar: 'RG',
    type: 'Sick Leave',
    from: '2026-01-18',
    to: '2026-01-18',
    days: 1,
    status: 'rejected',
    reason: 'Unwell',
  },
];

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
};

const getStatusBadge = (status) => {
  const config = statusConfig[status];
  return <Badge className={config.color}>{config.label}</Badge>;
};

export default function LeavePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Calculate stats
  const pendingCount = leaveRequests.filter((r) => r.status === 'pending').length;
  const approvedCount = leaveRequests.filter((r) => r.status === 'approved').length;
  const onLeaveToday = 8; // This would be calculated based on current date
  const rejectedCount = leaveRequests.filter((r) => r.status === 'rejected').length;

  // Filter requests
  const filteredRequests = leaveRequests.filter((request) => {
    const matchesSearch = request.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats for HubLayout
  const stats = [
    createStat('Pending', pendingCount, Clock, 'amber'),
    createStat('Approved', approvedCount, Check, 'green'),
    createStat('On Leave', onLeaveToday, CalendarDays, 'blue'),
    createStat('Rejected', rejectedCount, X, 'red'),
  ];

  // FixedMenuPanel configuration - only filters
  const fixedMenuConfig = {
    filters: {
      quickFilters: [
        { id: 'all', label: 'All' },
        { id: 'pending', label: 'Pending' },
        { id: 'approved', label: 'Approved' },
        { id: 'rejected', label: 'Rejected' },
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
      <Button size="sm" className="h-7 gap-1.5" onClick={() => console.log('Apply Leave')}>
        <Plus className="h-3.5 w-3.5" />
        <span className="text-xs">Apply Leave</span>
      </Button>
    </>
  );

  const handleApprove = (request) => {
    console.log('Approve:', request);
    // Handle approve logic
  };

  const handleReject = (request) => {
    console.log('Reject:', request);
    // Handle reject logic
  };

  const handleView = (request) => {
    setSelectedRequest(request);
  };

  // Empty state
  const EmptyState = () => (
    <div className="p-12 text-center">
      <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No leave requests found</h3>
      <p className="text-muted-foreground mb-4">
        {searchQuery || statusFilter !== 'all'
          ? 'Try adjusting your filters'
          : 'No leave requests to display'}
      </p>
    </div>
  );

  // Leave Request Card
  const LeaveRequestCard = ({ request }) => {
    const config = statusConfig[request.status];
    return (
      <Card
        className="p-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => handleView(request)}
      >
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">{request.avatar}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4 mb-2">
              <h3 className="font-medium">{request.name}</h3>
              <Badge className={config.color}>{config.label}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{request.type}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {request.from} to {request.to}
              </span>
              <span>{request.days} days</span>
            </div>
            {request.status === 'pending' && (
              <div className="flex items-center gap-2 mt-3">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-green-600 hover:text-green-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApprove(request);
                  }}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReject(request);
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <UnifiedLayout hubId="hr" pageTitle="Leave Management" stats={stats} fixedMenu={null}>
      {/* Detail View in Content Area */}
      {selectedRequest ? (
        <div className="h-full overflow-y-auto p-6">
          {/* Request Header */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-medium text-primary">{selectedRequest.avatar}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedRequest.name}</h2>
                <p className="text-muted-foreground">{selectedRequest.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={statusConfig[selectedRequest.status].color}>
                {statusConfig[selectedRequest.status].label}
              </Badge>
            </div>
          </div>

          {/* Request Details */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">From Date</p>
                <p className="font-medium">{selectedRequest.from}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">To Date</p>
                <p className="font-medium">{selectedRequest.to}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Duration</p>
              <p className="font-medium">{selectedRequest.days} days</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Leave Type</p>
              <p className="font-medium">{selectedRequest.type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Reason</p>
              <p className="bg-muted/50 p-4 rounded-lg">{selectedRequest.reason}</p>
            </div>
          </div>

          {/* Actions */}
          {selectedRequest.status === 'pending' && (
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => handleApprove(selectedRequest)}
              >
                <Check className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                variant="outline"
                className="flex-1 text-red-600 hover:text-red-700 border-red-200"
                onClick={() => handleReject(selectedRequest)}
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Request Selected</h3>
            <p className="text-muted-foreground">Select a leave request to view details</p>
          </div>
        </div>
      )}
    </UnifiedLayout>
  );
}
