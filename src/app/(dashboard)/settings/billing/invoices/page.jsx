'use client';

import { useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  Search,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UnifiedLayout, createStat } from '@/components/layout/unified';

const mockInvoices = [
  { id: 'INV-2024-001', date: '2024-01-15', amount: 299, status: 'paid', plan: 'Professional' },
  { id: 'INV-2024-002', date: '2024-02-15', amount: 299, status: 'paid', plan: 'Professional' },
  { id: 'INV-2024-003', date: '2024-03-15', amount: 299, status: 'pending', plan: 'Professional' },
];

export default function BillingInvoicesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInvoices = mockInvoices.filter(
    (inv) =>
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.plan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    createStat('Total Invoices', mockInvoices.length, FileText, 'primary'),
    createStat(
      'Paid',
      mockInvoices.filter((i) => i.status === 'paid').length,
      CheckCircle,
      'green'
    ),
    createStat(
      'Pending',
      mockInvoices.filter((i) => i.status === 'pending').length,
      Clock,
      'amber'
    ),
    createStat(
      'Total Spent',
      `$${mockInvoices.reduce((sum, i) => sum + i.amount, 0)}`,
      DollarSign,
      'blue'
    ),
  ];

  const getStatusBadge = (status) => {
    const styles = {
      paid: 'bg-green-100 text-green-700',
      pending: 'bg-amber-100 text-amber-700',
      overdue: 'bg-red-100 text-red-700',
    };
    return <Badge className={styles[status]}>{status}</Badge>;
  };

  return (
    <UnifiedLayout hubId="settings" pageTitle="Billing Invoices" stats={stats} fixedMenu={null}>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono">{invoice.id}</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                    <TableCell>{invoice.plan}</TableCell>
                    <TableCell>${invoice.amount}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        PDF
                      </Button>
                    </TableCell>
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
