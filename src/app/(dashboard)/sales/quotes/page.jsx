'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FileText,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  Send,
  Copy,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
  Building2,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
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

const mockQuotes = [
  {
    id: 1,
    number: 'QT-2025-001',
    name: 'Enterprise License Quote',
    company: 'Acme Corp',
    contact: 'John Smith',
    amount: 125000,
    status: 'Sent',
    validUntil: '2025-01-31',
    createdAt: '2025-01-03',
    items: 5,
  },
  {
    id: 2,
    number: 'QT-2025-002',
    name: 'Annual Subscription',
    company: 'TechStart Inc',
    contact: 'Sarah Johnson',
    amount: 48000,
    status: 'Accepted',
    validUntil: '2025-02-15',
    createdAt: '2025-01-05',
    items: 3,
  },
  {
    id: 3,
    number: 'QT-2025-003',
    name: 'Platform Upgrade',
    company: 'Global Industries',
    contact: 'Mike Wilson',
    amount: 95000,
    status: 'Draft',
    validUntil: '2025-02-28',
    createdAt: '2025-01-10',
    items: 7,
  },
  {
    id: 4,
    number: 'QT-2024-158',
    name: 'Starter Package',
    company: 'SmallBiz LLC',
    contact: 'Lisa Anderson',
    amount: 8500,
    status: 'Expired',
    validUntil: '2024-12-31',
    createdAt: '2024-12-01',
    items: 2,
  },
];

const quoteStats = [
  { label: 'Total Quotes', value: 156, change: 12, trend: 'up' },
  { label: 'Accepted', value: 48, change: 8, trend: 'up' },
  { label: 'Pending', value: 32, change: -2, trend: 'down' },
  { label: 'Total Value', value: 2840000, change: 15, trend: 'up', isCurrency: true },
];

const statuses = ['Draft', 'Sent', 'Viewed', 'Accepted', 'Rejected', 'Expired'];

export default function QuotesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-700';
      case 'Sent':
        return 'bg-blue-100 text-blue-700';
      case 'Viewed':
        return 'bg-purple-100 text-purple-700';
      case 'Accepted':
        return 'bg-green-100 text-green-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      case 'Expired':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle2 className="h-3 w-3" />;
      case 'Rejected':
        return <XCircle className="h-3 w-3" />;
      case 'Expired':
        return <Clock className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const filteredQuotes = useMemo(() => {
    return mockQuotes.filter((quote) => {
      const matchesSearch =
        quote.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const layoutStats = useMemo(
    () => [
      createStat('Total', quoteStats[0].value, FileText, 'blue'),
      createStat('Accepted', quoteStats[1].value, CheckCircle2, 'green'),
      createStat('Pending', quoteStats[2].value, Clock, 'amber'),
      createStat('Value', `$${(quoteStats[3].value / 1000000).toFixed(1)}M`, DollarSign, 'purple'),
    ],
    []
  );

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const actionButtons = (
    <div className="flex items-center gap-2">
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {statuses.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button asChild>
        <Link href="/sales/quotes/new">
          <Plus className="h-4 w-4 mr-2" />
          New Quote
        </Link>
      </Button>
    </div>
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const mainContent = (
    <div className="space-y-6">
      <Card>
        <div className="divide-y">
          {filteredQuotes.map((quote) => (
            <div
              key={quote.id}
              className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Link href={`/sales/quotes/${quote.id}`} className="font-medium hover:underline">
                    {quote.number}
                  </Link>
                  <Badge className={getStatusColor(quote.status)}>
                    {getStatusIcon(quote.status)}
                    <span className={cn(getStatusIcon(quote.status) && 'ml-1')}>
                      {quote.status}
                    </span>
                  </Badge>
                </div>
                <p className="text-sm mb-1">{quote.name}</p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {quote.company}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {quote.contact}
                  </span>
                  <span>•</span>
                  <span>{quote.items} items</span>
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-6">
                <div className="text-center min-w-[120px]">
                  <p className="font-bold text-green-600">{formatCurrency(quote.amount)}</p>
                  <p className="text-xs text-muted-foreground">Amount</p>
                </div>
                <div className="text-center min-w-[100px]">
                  <p className="text-sm font-medium">
                    {new Date(quote.validUntil).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Valid Until</p>
                </div>
                <div className="text-center min-w-[100px]">
                  <p className="text-sm">{new Date(quote.createdAt).toLocaleDateString()}</p>
                  <p className="text-xs text-muted-foreground">Created</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/sales/quotes/${quote.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Send className="h-4 w-4 mr-2" />
                      Send to Customer
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {filteredQuotes.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No quotes found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or create a new quote
            </p>
            <Button asChild>
              <Link href="/sales/quotes/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Quote
              </Link>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );

  return (
    <HubLayout
      title="Quotes"
      description="Create and manage sales quotes"
      stats={layoutStats}
      searchValue={searchQuery}
      onSearchChange={handleSearch}
      searchPlaceholder="Search quotes..."
      actionButtons={actionButtons}
      showFixedMenu={false}
    >
      {mainContent}
    </HubLayout>
  );
}
