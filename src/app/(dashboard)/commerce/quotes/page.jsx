'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  MoreHorizontal,
  Download,
  FileText,
  Eye,
  Edit,
  Send,
  Copy,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
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
import {
  UnifiedLayout,
  createStat,
  createAction,
} from '@/components/layout/unified/unified-layout';

const mockQuotes = [
  {
    id: 'QUO-2024-001',
    customer: 'Acme Corporation',
    amount: 5250.0,
    status: 'accepted',
    validUntil: '2025-01-15',
    createdDate: '2024-12-10',
    items: 5,
  },
  {
    id: 'QUO-2024-002',
    customer: 'Tech Solutions Inc',
    amount: 3890.0,
    status: 'sent',
    validUntil: '2025-01-10',
    createdDate: '2024-12-15',
    items: 3,
  },
  {
    id: 'QUO-2024-003',
    customer: 'Design Studio LLC',
    amount: 2200.0,
    status: 'draft',
    validUntil: '2025-01-20',
    createdDate: '2024-12-18',
    items: 2,
  },
  {
    id: 'QUO-2024-004',
    customer: 'StartupX',
    amount: 1500.0,
    status: 'expired',
    validUntil: '2024-12-15',
    createdDate: '2024-11-30',
    items: 1,
  },
  {
    id: 'QUO-2024-005',
    customer: 'Enterprise Co',
    amount: 8900.0,
    status: 'rejected',
    validUntil: '2024-12-25',
    createdDate: '2024-12-05',
    items: 7,
  },
];

const statuses = ['All Status', 'Draft', 'Sent', 'Accepted', 'Rejected', 'Expired'];

export default function QuotesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  const filteredQuotes = mockQuotes.filter((quote) => {
    const matchesSearch =
      quote.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === 'All Status' || quote.status === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      label: 'Total Value',
      value: `$${mockQuotes.reduce((sum, q) => sum + q.amount, 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-blue-600',
    },
    {
      label: 'Accepted',
      value: mockQuotes.filter((q) => q.status === 'accepted').length,
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      label: 'Pending',
      value: mockQuotes.filter((q) => q.status === 'sent').length,
      icon: Clock,
      color: 'text-yellow-600',
    },
    {
      label: 'Win Rate',
      value: `${((mockQuotes.filter((q) => q.status === 'accepted').length / mockQuotes.length) * 100).toFixed(0)}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      sent: 'bg-blue-100 text-blue-700',
      accepted: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      expired: 'bg-orange-100 text-orange-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const handleConvertToInvoice = (quote) => {
    toast({
      title: 'Converting to invoice',
      description: `${quote.id} is being converted to an invoice.`,
    });
  };

  // Layout stats for UnifiedLayout
  const layoutStats = [
    createStat(
      'Total Value',
      `$${mockQuotes.reduce((sum, q) => sum + q.amount, 0).toLocaleString()}`,
      DollarSign,
      'blue'
    ),
    createStat(
      'Accepted',
      mockQuotes.filter((q) => q.status === 'accepted').length,
      CheckCircle,
      'green'
    ),
    createStat('Pending', mockQuotes.filter((q) => q.status === 'sent').length, Clock, 'amber'),
    createStat(
      'Win Rate',
      `${((mockQuotes.filter((q) => q.status === 'accepted').length / mockQuotes.length) * 100).toFixed(0)}%`,
      TrendingUp,
      'purple'
    ),
  ];

  // Layout actions for UnifiedLayout
  const layoutActions = [
    createAction('Create Quote', Plus, () => router.push('/commerce/quotes/new'), {
      primary: true,
    }),
    createAction('Export', Download, () =>
      toast({ title: 'Export', description: 'Export feature coming soon' })
    ),
  ];

  return (
    <UnifiedLayout
      hubId="sales"
      pageTitle="Quotes"
      stats={layoutStats}
      actions={layoutActions}
      fixedMenu={null}
    >
      <div className="p-6 space-y-6 overflow-auto h-full">
        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search quotes by ID or customer..."
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
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Quotes Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                      <p className="text-muted-foreground">No quotes found</p>
                      <Button
                        onClick={() => router.push('/commerce/quotes/new')}
                        className="gap-2 mt-2"
                      >
                        <Plus className="h-4 w-4" />
                        Create Quote
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredQuotes.map((quote) => (
                  <TableRow
                    key={quote.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/commerce/quotes/${quote.id}`)}
                  >
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {quote.id}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{quote.customer}</TableCell>
                    <TableCell>{new Date(quote.createdDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {new Date(quote.validUntil).toLocaleDateString()}
                      {quote.status === 'expired' && (
                        <span className="ml-2 text-red-600 text-xs">(Expired)</span>
                      )}
                    </TableCell>
                    <TableCell className="font-bold">${quote.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={cn('capitalize', getStatusColor(quote.status))}>
                        {quote.status}
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
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/commerce/quotes/${quote.id}`);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                          {quote.status !== 'accepted' && (
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <Send className="h-4 w-4 mr-2" />
                              Send to Customer
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          {quote.status === 'accepted' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleConvertToInvoice(quote);
                                }}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                Convert to Invoice
                              </DropdownMenuItem>
                            </>
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
    </UnifiedLayout>
  );
}
