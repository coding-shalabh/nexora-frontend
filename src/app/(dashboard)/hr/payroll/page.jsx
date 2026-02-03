'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Download,
  Calendar,
  Users,
  TrendingUp,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
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

const payrollData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'SJ',
    department: 'Design',
    basicSalary: 85000,
    allowances: 15000,
    deductions: 12000,
    netPay: 88000,
    status: 'paid',
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'MC',
    department: 'Engineering',
    basicSalary: 95000,
    allowances: 18000,
    deductions: 14000,
    netPay: 99000,
    status: 'paid',
  },
  {
    id: 3,
    name: 'Emily Brown',
    avatar: 'EB',
    department: 'Marketing',
    basicSalary: 75000,
    allowances: 12000,
    deductions: 10000,
    netPay: 77000,
    status: 'pending',
  },
  {
    id: 4,
    name: 'David Wilson',
    avatar: 'DW',
    department: 'Sales',
    basicSalary: 70000,
    allowances: 20000,
    deductions: 11000,
    netPay: 79000,
    status: 'pending',
  },
  {
    id: 5,
    name: 'Priya Sharma',
    avatar: 'PS',
    department: 'HR',
    basicSalary: 80000,
    allowances: 14000,
    deductions: 11500,
    netPay: 82500,
    status: 'paid',
  },
];

const stats = [
  { label: 'Total Payroll', value: '₹24.5L', icon: DollarSign, color: 'text-green-600' },
  { label: 'Employees', value: '156', icon: Users, color: 'text-blue-600' },
  { label: 'Pending', value: '12', icon: Clock, color: 'text-yellow-600' },
  { label: 'Processed', value: '144', icon: CheckCircle, color: 'text-green-600' },
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
    paid: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    failed: 'bg-red-100 text-red-700',
  };
  return (
    <Badge className={styles[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  );
};

export default function PayrollPage() {
  const [month, setMonth] = useState('january');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payroll</h1>
          <p className="text-muted-foreground">Manage employee salaries and payments</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="january">January 2026</SelectItem>
              <SelectItem value="december">December 2025</SelectItem>
              <SelectItem value="november">November 2025</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            Run Payroll
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
            <DollarSign className="h-4 w-4" />
            Payroll for January 2026
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Basic</TableHead>
                <TableHead className="text-right">Allowances</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Net Pay</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollData.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">{record.avatar}</span>
                      </div>
                      <span className="font-medium">{record.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell className="text-right">{formatCurrency(record.basicSalary)}</TableCell>
                  <TableCell className="text-right text-green-600">
                    +{formatCurrency(record.allowances)}
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    -{formatCurrency(record.deductions)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(record.netPay)}
                  </TableCell>
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
