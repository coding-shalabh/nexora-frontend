'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookText,
  Search,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const ledgerEntries = [
  {
    id: 1,
    date: '2026-01-19',
    reference: 'JE-001',
    description: 'Sales Invoice #INV-2024',
    debit: 50000,
    credit: 0,
    balance: 890000,
  },
  {
    id: 2,
    date: '2026-01-18',
    reference: 'JE-003',
    description: 'Customer Payment - XYZ Corp',
    debit: 0,
    credit: 75000,
    balance: 840000,
  },
  {
    id: 3,
    date: '2026-01-17',
    reference: 'JE-005',
    description: 'Sales Invoice #INV-2023',
    debit: 120000,
    credit: 0,
    balance: 915000,
  },
  {
    id: 4,
    date: '2026-01-16',
    reference: 'JE-008',
    description: 'Customer Payment - ABC Ltd',
    debit: 0,
    credit: 45000,
    balance: 795000,
  },
  {
    id: 5,
    date: '2026-01-15',
    reference: 'JE-012',
    description: 'Credit Note #CN-001',
    debit: 0,
    credit: 15000,
    balance: 840000,
  },
];

const accounts = [
  { value: 'ar', label: 'Accounts Receivable', balance: 890000 },
  { value: 'ap', label: 'Accounts Payable', balance: -450000 },
  { value: 'cash', label: 'Cash in Hand', balance: 250000 },
  { value: 'bank', label: 'HDFC Bank - Current', balance: 1450000 },
];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function LedgerPage() {
  const [selectedAccount, setSelectedAccount] = useState('ar');
  const [searchQuery, setSearchQuery] = useState('');

  const currentAccount = accounts.find((a) => a.value === selectedAccount);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">General Ledger</h1>
          <p className="text-muted-foreground">View account transactions and balances</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Date Range
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select Account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.value} value={account.value}>
                      {account.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p
                className={cn(
                  'text-2xl font-bold',
                  currentAccount?.balance >= 0 ? 'text-green-600' : 'text-red-600'
                )}
              >
                {formatCurrency(currentAccount?.balance || 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{currentAccount?.label}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <BookText className="h-4 w-4" />
            {currentAccount?.label} - Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ledgerEntries.map((entry, index) => (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b cursor-pointer hover:bg-muted/50"
                >
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{entry.reference}</Badge>
                  </TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell className="text-right">
                    {entry.debit > 0 && (
                      <span className="text-green-600 flex items-center justify-end gap-1">
                        <ArrowUpRight className="h-3 w-3" />
                        {formatCurrency(entry.debit)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.credit > 0 && (
                      <span className="text-red-600 flex items-center justify-end gap-1">
                        <ArrowDownRight className="h-3 w-3" />
                        {formatCurrency(entry.credit)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(entry.balance)}
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
