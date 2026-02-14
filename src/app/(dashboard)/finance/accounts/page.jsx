'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Edit,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { UnifiedLayout, createStat } from '@/components/layout/unified';

const accounts = [
  {
    id: 1,
    name: 'Cash in Hand',
    code: '1001',
    type: 'Asset',
    balance: 250000,
    currency: 'INR',
    status: 'active',
  },
  {
    id: 2,
    name: 'HDFC Bank - Current',
    code: '1002',
    type: 'Asset',
    balance: 1450000,
    currency: 'INR',
    status: 'active',
  },
  {
    id: 3,
    name: 'Accounts Receivable',
    code: '1100',
    type: 'Asset',
    balance: 890000,
    currency: 'INR',
    status: 'active',
  },
  {
    id: 4,
    name: 'Accounts Payable',
    code: '2001',
    type: 'Liability',
    balance: -450000,
    currency: 'INR',
    status: 'active',
  },
  {
    id: 5,
    name: 'Sales Revenue',
    code: '4001',
    type: 'Revenue',
    balance: 2500000,
    currency: 'INR',
    status: 'active',
  },
  {
    id: 6,
    name: 'Operating Expenses',
    code: '5001',
    type: 'Expense',
    balance: -780000,
    currency: 'INR',
    status: 'active',
  },
];

const stats = [
  { label: 'Total Assets', value: '₹45.2L', trend: '+12%', isPositive: true },
  { label: 'Total Liabilities', value: '₹12.8L', trend: '-5%', isPositive: true },
  { label: 'Total Revenue', value: '₹25.0L', trend: '+18%', isPositive: true },
  { label: 'Total Expenses', value: '₹7.8L', trend: '+8%', isPositive: false },
];

const formatCurrency = (amount) => {
  const absAmount = Math.abs(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(absAmount);
};

const getTypeColor = (type) => {
  const colors = {
    Asset: 'bg-green-100 text-green-700',
    Liability: 'bg-red-100 text-red-700',
    Revenue: 'bg-blue-100 text-blue-700',
    Expense: 'bg-orange-100 text-orange-700',
    Equity: 'bg-purple-100 text-purple-700',
  };
  return colors[type] || 'bg-gray-100 text-gray-700';
};

export default function AccountsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const layoutStats = [
    createStat('Total Assets', '₹45.2L', TrendingUp, 'green'),
    createStat('Total Liabilities', '₹12.8L', TrendingDown, 'red'),
    createStat('Total Revenue', '₹25.0L', TrendingUp, 'blue'),
    createStat('Total Expenses', '₹7.8L', TrendingDown, 'amber'),
  ];

  return (
    <UnifiedLayout
      hubId="finance"
      pageTitle="Chart of Accounts"
      stats={layoutStats}
      fixedMenu={null}
    >
      <div className="h-full overflow-y-auto p-6 space-y-6">
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
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <Badge
                      className={cn(
                        stat.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      )}
                    >
                      {stat.isPositive ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                      )}
                      {stat.trend}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search accounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              All Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {accounts.map((account, index) => (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{account.name}</span>
                        <span className="text-xs text-muted-foreground">({account.code})</span>
                      </div>
                      <Badge className={getTypeColor(account.type)}>{account.type}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p
                        className={cn(
                          'font-bold',
                          account.balance >= 0 ? 'text-green-600' : 'text-red-600'
                        )}
                      >
                        {account.balance < 0 && '-'}
                        {formatCurrency(account.balance)}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" /> View Transactions
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" /> Edit Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </UnifiedLayout>
  );
}
