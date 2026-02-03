'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Plus,
  Search,
  Filter,
  Download,
  Clock,
  AlertTriangle,
  CheckCircle,
  CreditCard,
} from 'lucide-react';
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

const payables = [
  {
    id: 1,
    bill: 'BILL-301',
    vendor: 'ABC Supplies Ltd',
    amount: 125000,
    dueDate: '2026-01-22',
    daysOverdue: 0,
    status: 'pending',
  },
  {
    id: 2,
    bill: 'BILL-300',
    vendor: 'Tech Hardware Inc',
    amount: 250000,
    dueDate: '2026-01-15',
    daysOverdue: 4,
    status: 'overdue',
  },
  {
    id: 3,
    bill: 'BILL-299',
    vendor: 'Office Solutions',
    amount: 45000,
    dueDate: '2026-01-28',
    daysOverdue: 0,
    status: 'pending',
  },
  {
    id: 4,
    bill: 'BILL-298',
    vendor: 'Cloud Services Pro',
    amount: 85000,
    dueDate: '2026-01-10',
    daysOverdue: 9,
    status: 'overdue',
  },
  {
    id: 5,
    bill: 'BILL-297',
    vendor: 'Marketing Agency',
    amount: 180000,
    dueDate: '2026-01-18',
    daysOverdue: 0,
    status: 'paid',
  },
  {
    id: 6,
    bill: 'BILL-296',
    vendor: 'Consulting Firm',
    amount: 95000,
    dueDate: '2026-02-05',
    daysOverdue: 0,
    status: 'scheduled',
  },
];

const stats = [
  { label: 'Total Payables', value: '₹6.0L', icon: ArrowUpRight, color: 'text-blue-600' },
  { label: 'Due This Week', value: '₹1.7L', icon: Clock, color: 'text-yellow-600' },
  { label: 'Overdue', value: '₹3.35L', icon: AlertTriangle, color: 'text-red-600' },
  { label: 'Paid (Month)', value: '₹8.5L', icon: CheckCircle, color: 'text-green-600' },
];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const getStatusBadge = (status, daysOverdue) => {
  if (status === 'paid') {
    return <Badge className="bg-green-100 text-green-700">Paid</Badge>;
  }
  if (status === 'overdue') {
    return <Badge className="bg-red-100 text-red-700">{daysOverdue} days overdue</Badge>;
  }
  if (status === 'scheduled') {
    return <Badge className="bg-blue-100 text-blue-700">Scheduled</Badge>;
  }
  return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
};

export default function PayablesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Accounts Payable</h1>
          <p className="text-muted-foreground">Manage vendor bills and payments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Record Bill
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
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bills or vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4" />
            Outstanding Bills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill #</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payables.map((item) => (
                <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{item.bill}</TableCell>
                  <TableCell>{item.vendor}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.amount)}
                  </TableCell>
                  <TableCell>{item.dueDate}</TableCell>
                  <TableCell>{getStatusBadge(item.status, item.daysOverdue)}</TableCell>
                  <TableCell>
                    {item.status !== 'paid' && (
                      <Button size="sm" variant="ghost" className="gap-1">
                        <CreditCard className="h-3 w-3" />
                        Pay
                      </Button>
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
