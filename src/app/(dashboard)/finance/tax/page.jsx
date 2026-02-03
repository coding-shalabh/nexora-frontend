'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  Download,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Upload,
} from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const taxFilings = [
  {
    id: 1,
    type: 'GST Return (GSTR-3B)',
    period: 'January 2026',
    dueDate: '2026-02-20',
    amount: 125000,
    status: 'pending',
  },
  {
    id: 2,
    type: 'TDS Return (24Q)',
    period: 'Q3 2025-26',
    dueDate: '2026-01-31',
    amount: 85000,
    status: 'due-soon',
  },
  {
    id: 3,
    type: 'GST Return (GSTR-1)',
    period: 'December 2025',
    dueDate: '2026-01-11',
    amount: 0,
    status: 'filed',
  },
  {
    id: 4,
    type: 'GST Return (GSTR-3B)',
    period: 'December 2025',
    dueDate: '2026-01-20',
    amount: 118000,
    status: 'filed',
  },
  {
    id: 5,
    type: 'Advance Tax',
    period: 'Q3 2025-26',
    dueDate: '2025-12-15',
    amount: 250000,
    status: 'paid',
  },
  {
    id: 6,
    type: 'Professional Tax',
    period: 'January 2026',
    dueDate: '2026-01-31',
    amount: 15000,
    status: 'due-soon',
  },
];

const stats = [
  { label: 'Tax Payable', value: '₹3.25L', icon: Calculator, color: 'text-blue-600' },
  { label: 'Filed (Month)', value: '4', icon: CheckCircle, color: 'text-green-600' },
  { label: 'Due Soon', value: '2', icon: Clock, color: 'text-yellow-600' },
  { label: 'Overdue', value: '0', icon: AlertTriangle, color: 'text-green-600' },
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
    pending: 'bg-gray-100 text-gray-700',
    'due-soon': 'bg-yellow-100 text-yellow-700',
    filed: 'bg-blue-100 text-blue-700',
    paid: 'bg-green-100 text-green-700',
    overdue: 'bg-red-100 text-red-700',
  };
  const labels = {
    pending: 'Pending',
    'due-soon': 'Due Soon',
    filed: 'Filed',
    paid: 'Paid',
    overdue: 'Overdue',
  };
  return <Badge className={styles[status]}>{labels[status]}</Badge>;
};

export default function TaxPage() {
  const [year, setYear] = useState('2025-26');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tax Management</h1>
          <p className="text-muted-foreground">Track tax filings and compliance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025-26">FY 2025-26</SelectItem>
              <SelectItem value="2024-25">FY 2024-25</SelectItem>
              <SelectItem value="2023-24">FY 2023-24</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download Reports
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
            <FileText className="h-4 w-4" />
            Tax Filings & Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxFilings.map((filing) => (
                <TableRow key={filing.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{filing.type}</TableCell>
                  <TableCell>{filing.period}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {filing.dueDate}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {filing.amount > 0 ? formatCurrency(filing.amount) : '-'}
                  </TableCell>
                  <TableCell>{getStatusBadge(filing.status)}</TableCell>
                  <TableCell>
                    {(filing.status === 'pending' || filing.status === 'due-soon') && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="gap-1 h-7">
                          <Upload className="h-3 w-3" />
                          File
                        </Button>
                      </div>
                    )}
                    {(filing.status === 'filed' || filing.status === 'paid') && (
                      <Button size="sm" variant="ghost" className="gap-1 h-7">
                        <Download className="h-3 w-3" />
                        Receipt
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
