'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Plus, Search, Check, X, Clock, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

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

const stats = [
  { label: 'Pending Requests', value: '12', color: 'bg-yellow-100 text-yellow-700' },
  { label: 'Approved (Month)', value: '45', color: 'bg-green-100 text-green-700' },
  { label: 'On Leave Today', value: '8', color: 'bg-blue-100 text-blue-700' },
  { label: 'Rejected (Month)', value: '3', color: 'bg-red-100 text-red-700' },
];

const getStatusBadge = (status) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };
  return (
    <Badge className={styles[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  );
};

export default function LeavePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leave Management</h1>
          <p className="text-muted-foreground">Manage employee leave requests</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Calendar View
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Apply Leave
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <Badge className={stat.color}>{stat.label}</Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leave requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Leave Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">{request.avatar}</span>
                      </div>
                      <span className="font-medium">{request.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>{request.from}</TableCell>
                  <TableCell>{request.to}</TableCell>
                  <TableCell>{request.days}</TableCell>
                  <TableCell className="max-w-[150px] truncate">{request.reason}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    {request.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
