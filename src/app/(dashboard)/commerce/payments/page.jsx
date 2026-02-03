'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  Download,
  CreditCard,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  Eye,
  RefreshCw,
  Receipt,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const mockPayments = [
  { id: 'PAY-001', invoice: 'INV-2024-001', customer: 'Acme Corp', amount: 2450.00, method: 'Credit Card', status: 'succeeded', date: '2024-12-20T10:30:00Z' },
  { id: 'PAY-002', invoice: 'INV-2024-003', customer: 'Tech Solutions', amount: 890.50, method: 'Bank Transfer', status: 'processing', date: '2024-12-19T14:20:00Z' },
  { id: 'PAY-003', invoice: 'INV-2024-005', customer: 'Design Studio', amount: 1200.00, method: 'PayPal', status: 'succeeded', date: '2024-12-18T09:15:00Z' },
  { id: 'PAY-004', invoice: 'INV-2024-002', customer: 'StartupX', amount: 450.00, method: 'Credit Card', status: 'failed', date: '2024-12-17T16:45:00Z' },
  { id: 'PAY-005', invoice: 'INV-2024-008', customer: 'Enterprise Co', amount: 3500.00, method: 'Bank Transfer', status: 'succeeded', date: '2024-12-16T11:00:00Z' },
];

const statuses = ['All Status', 'Succeeded', 'Processing', 'Failed', 'Refunded'];
const methods = ['All Methods', 'Credit Card', 'Bank Transfer', 'PayPal', 'Stripe'];

export default function PaymentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedMethod, setSelectedMethod] = useState('All Methods');

  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.invoice.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All Status' || payment.status === selectedStatus.toLowerCase();
    const matchesMethod = selectedMethod === 'All Methods' || payment.method === selectedMethod;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const stats = [
    { label: 'Total Collected', value: `$${mockPayments.filter(p => p.status === 'succeeded').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}`, icon: DollarSign, color: 'text-green-600' },
    { label: 'Successful', value: mockPayments.filter(p => p.status === 'succeeded').length, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Processing', value: mockPayments.filter(p => p.status === 'processing').length, icon: Clock, color: 'text-yellow-600' },
    { label: 'Failed', value: mockPayments.filter(p => p.status === 'failed').length, icon: XCircle, color: 'text-red-600' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      succeeded: 'bg-green-100 text-green-700',
      processing: 'bg-yellow-100 text-yellow-700',
      failed: 'bg-red-100 text-red-700',
      refunded: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
          <p className="text-muted-foreground">Track and manage all payment transactions</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={cn('h-5 w-5', stat.color)} />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by payment ID, invoice, or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedMethod} onValueChange={setSelectedMethod}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {methods.map(method => (
                  <SelectItem key={method} value={method}>{method}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment ID</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <CreditCard className="h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">No payments found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {payment.id}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {payment.invoice}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{payment.customer}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{payment.method}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">${payment.amount.toLocaleString()}</TableCell>
                  <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={cn('capitalize', getStatusColor(payment.status))}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Receipt className="h-4 w-4 mr-2" />
                          View Invoice
                        </DropdownMenuItem>
                        {payment.status === 'failed' && (
                          <DropdownMenuItem>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry Payment
                          </DropdownMenuItem>
                        )}
                        {payment.status === 'succeeded' && (
                          <DropdownMenuItem>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Process Refund
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
