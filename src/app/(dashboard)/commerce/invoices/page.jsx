'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Download,
  Send,
  Receipt,
  Eye,
  Edit,
  Copy,
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

// Mock invoices data
const mockInvoices = [
  { id: 'INV-2024-001', customer: 'Acme Corporation', amount: 2450.00, status: 'paid', dueDate: '2024-12-25', issueDate: '2024-12-10', items: 3 },
  { id: 'INV-2024-002', customer: 'Tech Solutions Inc', amount: 1890.50, status: 'sent', dueDate: '2024-12-28', issueDate: '2024-12-15', items: 2 },
  { id: 'INV-2024-003', customer: 'Design Studio LLC', amount: 3200.00, status: 'overdue', dueDate: '2024-12-15', issueDate: '2024-11-30', items: 5 },
  { id: 'INV-2024-004', customer: 'StartupX', amount: 750.00, status: 'draft', dueDate: '2025-01-05', issueDate: '2024-12-20', items: 1 },
  { id: 'INV-2024-005', customer: 'Enterprise Co', amount: 5600.00, status: 'paid', dueDate: '2024-12-20', issueDate: '2024-12-05', items: 8 },
];

const statuses = ['All Status', 'Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'];

export default function InvoicesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  // Filter invoices
  const filteredInvoices = mockInvoices.filter(invoice => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All Status' || invoice.status === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleSendInvoice = (invoice) => {
    toast({
      title: 'Invoice sent',
      description: `${invoice.id} has been sent to the customer.`,
    });
  };

  const handleDownload = (invoice) => {
    toast({
      title: 'Downloading invoice',
      description: `${invoice.id} is being downloaded.`,
    });
  };

  const stats = [
    { label: 'Total Invoiced', value: `$${mockInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}`, icon: DollarSign, color: 'text-blue-600' },
    { label: 'Paid', value: `$${mockInvoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}`, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Pending', value: mockInvoices.filter(i => i.status === 'sent').length, icon: Clock, color: 'text-yellow-600' },
    { label: 'Overdue', value: mockInvoices.filter(i => i.status === 'overdue').length, icon: AlertCircle, color: 'text-red-600' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      sent: 'bg-blue-100 text-blue-700',
      paid: 'bg-green-100 text-green-700',
      overdue: 'bg-red-100 text-red-700',
      cancelled: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">
            Create and manage customer invoices
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => router.push('/commerce/invoices/new')} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Invoice
          </Button>
        </div>
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
                placeholder="Search invoices by ID or customer..."
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
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <Receipt className="h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">No invoices found</p>
                    <Button onClick={() => router.push('/commerce/invoices/new')} className="gap-2 mt-2">
                      <Plus className="h-4 w-4" />
                      Create Invoice
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="cursor-pointer hover:bg-muted/50" onClick={() => router.push(`/commerce/invoices/${invoice.id}`)}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {invoice.id}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{invoice.customer}</TableCell>
                  <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {new Date(invoice.dueDate).toLocaleDateString()}
                    {invoice.status === 'overdue' && (
                      <span className="ml-2 text-red-600 text-xs">(Overdue)</span>
                    )}
                  </TableCell>
                  <TableCell className="font-bold">${invoice.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={cn('capitalize', getStatusColor(invoice.status))}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/commerce/invoices/${invoice.id}`); }}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDownload(invoice); }}>
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </DropdownMenuItem>
                        {invoice.status !== 'paid' && (
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleSendInvoice(invoice); }}>
                            <Send className="h-4 w-4 mr-2" />
                            Send to Customer
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/commerce/invoices/${invoice.id}/edit`); }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
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
