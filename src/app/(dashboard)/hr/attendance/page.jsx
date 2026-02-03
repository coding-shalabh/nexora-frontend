'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, Clock, Users, LogIn, LogOut, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const todayAttendance = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'SJ',
    clockIn: '09:00 AM',
    clockOut: '06:00 PM',
    status: 'present',
    hours: '9h 00m',
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'MC',
    clockIn: '09:15 AM',
    clockOut: '-',
    status: 'working',
    hours: '7h 45m',
  },
  {
    id: 3,
    name: 'Emily Brown',
    avatar: 'EB',
    clockIn: '08:45 AM',
    clockOut: '05:30 PM',
    status: 'present',
    hours: '8h 45m',
  },
  {
    id: 4,
    name: 'David Wilson',
    avatar: 'DW',
    clockIn: '-',
    clockOut: '-',
    status: 'on-leave',
    hours: '-',
  },
  {
    id: 5,
    name: 'Priya Sharma',
    avatar: 'PS',
    clockIn: '10:00 AM',
    clockOut: '-',
    status: 'late',
    hours: '6h 00m',
  },
  {
    id: 6,
    name: 'Rahul Gupta',
    avatar: 'RG',
    clockIn: '-',
    clockOut: '-',
    status: 'absent',
    hours: '-',
  },
];

const stats = [
  { label: 'Present Today', value: '142', icon: Users, color: 'text-green-600' },
  { label: 'On Leave', value: '8', icon: Calendar, color: 'text-orange-600' },
  { label: 'Late Arrivals', value: '5', icon: Clock, color: 'text-yellow-600' },
  { label: 'Absent', value: '6', icon: LogOut, color: 'text-red-600' },
];

const getStatusBadge = (status) => {
  const styles = {
    present: 'bg-green-100 text-green-700',
    working: 'bg-blue-100 text-blue-700',
    'on-leave': 'bg-orange-100 text-orange-700',
    late: 'bg-yellow-100 text-yellow-700',
    absent: 'bg-red-100 text-red-700',
  };
  const labels = {
    present: 'Present',
    working: 'Working',
    'on-leave': 'On Leave',
    late: 'Late',
    absent: 'Absent',
  };
  return <Badge className={styles[status]}>{labels[status]}</Badge>;
};

export default function AttendancePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Attendance</h1>
          <p className="text-muted-foreground">Track employee attendance and work hours</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            View Calendar
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
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
                <div className="flex items-center gap-3">
                  <stat.icon className={cn('h-5 w-5', stat.color)} />
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <CalendarCheck className="h-4 w-4" />
            Today's Attendance -{' '}
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todayAttendance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">{record.avatar}</span>
                      </div>
                      <span className="font-medium">{record.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <LogIn className="h-4 w-4 text-green-500" />
                      {record.clockIn}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <LogOut className="h-4 w-4 text-red-500" />
                      {record.clockOut}
                    </div>
                  </TableCell>
                  <TableCell>{record.hours}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
