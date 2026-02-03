'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
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

const expenses = [
  {
    id: 1,
    date: '2026-01-19',
    employee: 'Sarah Johnson',
    category: 'Travel',
    description: 'Client visit - Mumbai to Delhi',
    amount: 15000,
    status: 'pending',
    receipt: true,
  },
  {
    id: 2,
    date: '2026-01-18',
    employee: 'Michael Chen',
    category: 'Software',
    description: 'Annual GitHub subscription',
    amount: 8500,
    status: 'approved',
    receipt: true,
  },
  {
    id: 3,
    date: '2026-01-17',
    employee: 'Emily Brown',
    category: 'Marketing',
    description: 'Facebook Ads - January campaign',
    amount: 25000,
    status: 'approved',
    receipt: true,
  },
  {
    id: 4,
    date: '2026-01-16',
    employee: 'David Wilson',
    category: 'Meals',
    description: 'Team lunch - Sales meeting',
    amount: 4500,
    status: 'rejected',
    receipt: false,
  },
  {
    id: 5,
    date: '2026-01-15',
    employee: 'Priya Sharma',
    category: 'Office Supplies',
    description: 'Stationery and printer cartridges',
    amount: 3200,
    status: 'approved',
    receipt: true,
  },
  {
    id: 6,
    date: '2026-01-15',
    employee: 'Rahul Gupta',
    category: 'Equipment',
    description: 'External monitor for home office',
    amount: 18000,
    status: 'pending',
    receipt: true,
  },
];

const stats = [
  { label: 'Pending Approval', value: '₹33K', icon: Clock, color: 'text-yellow-600' },
  { label: 'Approved (Month)', value: '₹1.8L', icon: CheckCircle, color: 'text-green-600' },
  { label: 'Rejected', value: '₹4.5K', icon: XCircle, color: 'text-red-600' },
  { label: 'Total (Month)', value: '₹2.2L', icon: Receipt, color: 'text-blue-600' },
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
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };
  return (
    <Badge className={styles[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  );
};

const getCategoryColor = (category) => {
  const colors = {
    Travel: 'bg-blue-100 text-blue-700',
    Software: 'bg-purple-100 text-purple-700',
    Marketing: 'bg-pink-100 text-pink-700',
    Meals: 'bg-orange-100 text-orange-700',
    'Office Supplies': 'bg-green-100 text-green-700',
    Equipment: 'bg-cyan-100 text-cyan-700',
  };
  return colors[category] || 'bg-gray-100 text-gray-700';
};

export default function ExpensesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Expenses</h1>
          <p className="text-muted-foreground">Track and approve employee expenses</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Submit Expense
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
                placeholder="Search expenses..."
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
            <Receipt className="h-4 w-4" />
            Expense Claims
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Receipt</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>{expense.date}</TableCell>
                  <TableCell className="font-medium">{expense.employee}</TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(expense.category)}>{expense.category}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{expense.description}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell>
                    {expense.receipt ? (
                      <Badge variant="secondary" className="gap-1">
                        <Eye className="h-3 w-3" />
                        View
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">No receipt</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(expense.status)}</TableCell>
                  <TableCell>
                    {expense.status === 'pending' && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-7 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 text-red-600">
                          <XCircle className="h-4 w-4" />
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
