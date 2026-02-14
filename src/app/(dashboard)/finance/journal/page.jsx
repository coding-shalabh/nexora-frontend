'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Plus,
  Search,
  Calendar,
  Filter,
  Download,
  FileText,
  CheckCircle,
  Clock,
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
import { UnifiedLayout, createStat } from '@/components/layout/unified';

const journalEntries = [
  {
    id: 'JE-001',
    date: '2026-01-19',
    description: 'Sales Invoice #INV-2024',
    debit: { account: 'Accounts Receivable', amount: 50000 },
    credit: { account: 'Sales Revenue', amount: 50000 },
    status: 'posted',
    createdBy: 'System',
  },
  {
    id: 'JE-002',
    date: '2026-01-18',
    description: 'Vendor Payment - ABC Supplies',
    debit: { account: 'Accounts Payable', amount: 25000 },
    credit: { account: 'HDFC Bank', amount: 25000 },
    status: 'posted',
    createdBy: 'Priya Sharma',
  },
  {
    id: 'JE-003',
    date: '2026-01-18',
    description: 'Salary Disbursement - January',
    debit: { account: 'Salary Expense', amount: 450000 },
    credit: { account: 'HDFC Bank', amount: 450000 },
    status: 'posted',
    createdBy: 'System',
  },
  {
    id: 'JE-004',
    date: '2026-01-17',
    description: 'Office Rent Payment',
    debit: { account: 'Rent Expense', amount: 75000 },
    credit: { account: 'HDFC Bank', amount: 75000 },
    status: 'posted',
    createdBy: 'David Wilson',
  },
  {
    id: 'JE-005',
    date: '2026-01-17',
    description: 'Customer Payment Received',
    debit: { account: 'HDFC Bank', amount: 120000 },
    credit: { account: 'Accounts Receivable', amount: 120000 },
    status: 'draft',
    createdBy: 'Emily Brown',
  },
];

const stats = [
  { label: 'Total Entries', value: '1,234', icon: BookOpen, color: 'text-blue-600' },
  { label: 'Posted Today', value: '12', icon: CheckCircle, color: 'text-green-600' },
  { label: 'Pending Review', value: '5', icon: Clock, color: 'text-yellow-600' },
  { label: 'This Month', value: '156', icon: Calendar, color: 'text-purple-600' },
];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const getStatusBadge = (status) => {
  const styles = {
    posted: 'bg-green-100 text-green-700',
    draft: 'bg-yellow-100 text-yellow-700',
    reversed: 'bg-red-100 text-red-700',
  };
  return (
    <Badge className={styles[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  );
};

export default function JournalPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const layoutStats = [
    createStat('Total Entries', '1,234', BookOpen, 'blue'),
    createStat('Posted Today', '12', CheckCircle, 'green'),
    createStat('Pending Review', '5', Clock, 'amber'),
    createStat('This Month', '156', Calendar, 'purple'),
  ];

  return (
    <UnifiedLayout hubId="finance" pageTitle="Journal Entries" stats={layoutStats} fixedMenu={null}>
      <div className="h-full overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Journal Entries</h1>
            <p className="text-muted-foreground">Record and manage accounting transactions</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Entry
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
                  placeholder="Search entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                Date Range
              </Button>
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
              <FileText className="h-4 w-4" />
              Recent Journal Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entry ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Debit</TableHead>
                  <TableHead>Credit</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {journalEntries.map((entry) => (
                  <TableRow key={entry.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{entry.id}</TableCell>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{entry.description}</TableCell>
                    <TableCell className="text-sm">{entry.debit.account}</TableCell>
                    <TableCell className="text-sm">{entry.credit.account}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(entry.debit.amount)}
                    </TableCell>
                    <TableCell>{getStatusBadge(entry.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </UnifiedLayout>
  );
}
