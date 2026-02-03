'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  CreditCard,
  Wallet,
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

const bankAccounts = [
  {
    id: 1,
    name: 'HDFC Bank - Current',
    accountNo: '****4521',
    balance: 1450000,
    lastSync: '2 mins ago',
    status: 'active',
  },
  {
    id: 2,
    name: 'ICICI Bank - Savings',
    accountNo: '****7832',
    balance: 850000,
    lastSync: '5 mins ago',
    status: 'active',
  },
  {
    id: 3,
    name: 'Axis Bank - Current',
    accountNo: '****2156',
    balance: 320000,
    lastSync: '10 mins ago',
    status: 'active',
  },
];

const transactions = [
  {
    id: 1,
    date: '2026-01-19',
    description: 'Customer Payment - XYZ Corp',
    type: 'credit',
    amount: 150000,
    account: 'HDFC Bank',
    reference: 'TXN-28471',
  },
  {
    id: 2,
    date: '2026-01-19',
    description: 'Vendor Payment - ABC Supplies',
    type: 'debit',
    amount: 45000,
    account: 'HDFC Bank',
    reference: 'TXN-28470',
  },
  {
    id: 3,
    date: '2026-01-18',
    description: 'Salary Transfer - January',
    type: 'debit',
    amount: 450000,
    account: 'ICICI Bank',
    reference: 'TXN-28469',
  },
  {
    id: 4,
    date: '2026-01-18',
    description: 'Client Advance - Project Alpha',
    type: 'credit',
    amount: 200000,
    account: 'HDFC Bank',
    reference: 'TXN-28468',
  },
  {
    id: 5,
    date: '2026-01-17',
    description: 'Office Rent Payment',
    type: 'debit',
    amount: 75000,
    account: 'Axis Bank',
    reference: 'TXN-28467',
  },
];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function BankPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const totalBalance = bankAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bank & Cash</h1>
          <p className="text-muted-foreground">Manage bank accounts and transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Sync All
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Account
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-1"
        >
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5" />
                <div>
                  <p className="text-sm opacity-80">Total Balance</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalBalance)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {bankAccounts.map((account, index) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index + 1) * 0.05 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{account.name}</span>
                  </div>
                  <Badge variant="secondary">{account.accountNo}</Badge>
                </div>
                <p className="text-xl font-bold">{formatCurrency(account.balance)}</p>
                <p className="text-xs text-muted-foreground mt-1">Synced {account.lastSync}</p>
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
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>{txn.date}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{txn.reference}</Badge>
                  </TableCell>
                  <TableCell>{txn.description}</TableCell>
                  <TableCell>{txn.account}</TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        'flex items-center justify-end gap-1 font-medium',
                        txn.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      {txn.type === 'credit' ? (
                        <ArrowDownRight className="h-3 w-3" />
                      ) : (
                        <ArrowUpRight className="h-3 w-3" />
                      )}
                      {formatCurrency(txn.amount)}
                    </span>
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
