'use client';

import { useState } from 'react';
import { Receipt, Search, Download, Eye, Printer, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

const mockReceipts = [
  {
    id: 'RCP-001',
    orderId: 'ORD-2024-001',
    customer: 'John Doe',
    amount: 299,
    date: '2024-03-10',
    status: 'sent',
  },
  {
    id: 'RCP-002',
    orderId: 'ORD-2024-002',
    customer: 'Jane Smith',
    amount: 499,
    date: '2024-03-09',
    status: 'sent',
  },
  {
    id: 'RCP-003',
    orderId: 'ORD-2024-003',
    customer: 'Bob Wilson',
    amount: 199,
    date: '2024-03-08',
    status: 'pending',
  },
  {
    id: 'RCP-004',
    orderId: 'ORD-2024-004',
    customer: 'Alice Brown',
    amount: 799,
    date: '2024-03-07',
    status: 'sent',
  },
];

export default function CommerceReceiptsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReceipts = mockReceipts.filter(
    (receipt) =>
      receipt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receipt.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receipt.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    createStat('Total Receipts', mockReceipts.length, Receipt, 'primary'),
    createStat(
      'Sent',
      mockReceipts.filter((r) => r.status === 'sent').length,
      CheckCircle,
      'green'
    ),
    createStat(
      'Pending',
      mockReceipts.filter((r) => r.status === 'pending').length,
      Clock,
      'amber'
    ),
    createStat(
      'Total Value',
      `$${mockReceipts.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}`,
      Receipt,
      'blue'
    ),
  ];

  const getStatusBadge = (status) => {
    const styles = {
      sent: 'bg-green-100 text-green-700',
      pending: 'bg-amber-100 text-amber-700',
    };
    return <Badge className={styles[status]}>{status}</Badge>;
  };

  return (
    <HubLayout
      hubId="commerce"
      title="Receipts"
      description="View and manage payment receipts"
      stats={stats}
      showFixedMenu={false}
      actions={
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export All
        </Button>
      }
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search receipts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Receipt ID</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReceipts.map((receipt) => (
              <TableRow key={receipt.id}>
                <TableCell className="font-mono">{receipt.id}</TableCell>
                <TableCell className="font-mono">{receipt.orderId}</TableCell>
                <TableCell>{receipt.customer}</TableCell>
                <TableCell>${receipt.amount}</TableCell>
                <TableCell>{new Date(receipt.date).toLocaleDateString()}</TableCell>
                <TableCell>{getStatusBadge(receipt.status)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </HubLayout>
  );
}
