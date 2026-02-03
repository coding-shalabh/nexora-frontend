'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Landmark,
  Receipt,
  CreditCard,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowUpRight,
  ArrowUp,
  ArrowDown,
  FileSpreadsheet,
  Calculator,
  BookOpen,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// Quick actions
const quickActions = [
  { label: 'New Expense', href: '/finance/expenses/new', icon: Receipt, color: 'from-green-500 to-emerald-500' },
  { label: 'Record Payment', href: '/finance/payments/new', icon: CreditCard, color: 'from-blue-500 to-cyan-500' },
  { label: 'Create Invoice', href: '/commerce/invoices/new', icon: FileSpreadsheet, color: 'from-purple-500 to-pink-500' },
  { label: 'Bank Transfer', href: '/finance/bank/transfer', icon: Landmark, color: 'from-orange-500 to-amber-500' },
];

// Stats
const stats = [
  { label: 'Cash Balance', value: '$284,500', change: '+12%', positive: true, icon: DollarSign, color: 'text-green-600' },
  { label: 'Receivables', value: '$45,200', change: '+8%', positive: true, icon: TrendingUp, color: 'text-blue-600' },
  { label: 'Payables', value: '$23,800', change: '-15%', positive: true, icon: TrendingDown, color: 'text-orange-600' },
  { label: 'Net Profit', value: '$67,300', change: '+23%', positive: true, icon: PiggyBank, color: 'text-purple-600' },
];

// Recent transactions
const recentTransactions = [
  { id: 'TXN-001', description: 'Client Payment - Acme Corp', amount: 15000, type: 'credit', date: '2 hours ago', category: 'Revenue' },
  { id: 'TXN-002', description: 'Office Supplies', amount: -450, type: 'debit', date: '5 hours ago', category: 'Expense' },
  { id: 'TXN-003', description: 'Software Subscription', amount: -299, type: 'debit', date: '1 day ago', category: 'Expense' },
  { id: 'TXN-004', description: 'Client Payment - Tech Solutions', amount: 8500, type: 'credit', date: '2 days ago', category: 'Revenue' },
];

// Finance tools
const tools = [
  { name: 'Chart of Accounts', description: 'Account structure', href: '/finance/accounts', icon: FileSpreadsheet },
  { name: 'Journal Entries', description: 'Record transactions', href: '/finance/journal', icon: BookOpen },
  { name: 'Receivables', description: 'Money owed to you', href: '/finance/receivables', icon: TrendingUp },
  { name: 'Payables', description: 'Bills to pay', href: '/finance/payables', icon: TrendingDown },
  { name: 'Expenses', description: 'Expense claims', href: '/finance/expenses', icon: Receipt },
  { name: 'Reports', description: 'Financial reports', href: '/finance/reports', icon: Calculator },
];

// Pending bills
const pendingBills = [
  { vendor: 'AWS', amount: 2450, dueDate: 'Dec 28', status: 'due_soon' },
  { vendor: 'Office Rent', amount: 5000, dueDate: 'Jan 1', status: 'upcoming' },
  { vendor: 'Insurance', amount: 1200, dueDate: 'Jan 5', status: 'upcoming' },
];

export default function FinanceHubPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Finance Overview</h1>
          <p className="text-muted-foreground">
            Manage accounting, expenses, budgets, and financial reports
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Transaction
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={action.href}>
              <Card className="hover:shadow-md transition-all cursor-pointer group">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={cn('p-2 rounded-lg bg-gradient-to-br', action.color)}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium text-sm group-hover:text-primary transition-colors">
                    {action.label}
                  </span>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={cn('h-5 w-5', stat.color)} />
                  <Badge variant="secondary" className={cn('text-xs', stat.positive ? 'text-green-600' : 'text-red-600')}>
                    {stat.positive ? <ArrowUp className="h-3 w-3 mr-1 inline" /> : <ArrowDown className="h-3 w-3 mr-1 inline" />}
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
            <Link href="/finance/ledger">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowUpRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((txn) => (
                <div
                  key={txn.id}
                  className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className={cn(
                    'h-10 w-10 rounded-full flex items-center justify-center',
                    txn.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                  )}>
                    {txn.type === 'credit' ? (
                      <ArrowDown className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowUp className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{txn.description}</p>
                    <p className="text-sm text-muted-foreground">{txn.category} • {txn.date}</p>
                  </div>
                  <p className={cn(
                    'font-bold',
                    txn.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  )}>
                    {txn.type === 'credit' ? '+' : ''}{txn.amount < 0 ? '' : '$'}{Math.abs(txn.amount).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Bills */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Pending Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingBills.map((bill, index) => (
                <div key={index} className="p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm">{bill.vendor}</p>
                    <Badge
                      className={cn(
                        'text-xs',
                        bill.status === 'due_soon' && 'bg-orange-100 text-orange-700',
                        bill.status === 'upcoming' && 'bg-blue-100 text-blue-700'
                      )}
                    >
                      {bill.status === 'due_soon' ? 'Due Soon' : 'Upcoming'}
                    </Badge>
                  </div>
                  <p className="text-lg font-bold">${bill.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Due: {bill.dueDate}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" size="sm">
              View All Payables
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Finance Tools */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Finance Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {tools.map((tool) => (
              <Link key={tool.name} href={tool.href}>
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer text-center">
                  <tool.icon className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{tool.name}</p>
                    <p className="text-xs text-muted-foreground">{tool.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Budget Overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Budget vs Actual (This Month)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  Revenue
                </span>
                <span className="font-medium">$125,000 / $100,000</span>
              </div>
              <Progress value={125} className="h-2" />
              <p className="text-xs text-green-600">25% over target</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  Expenses
                </span>
                <span className="font-medium">$45,000 / $50,000</span>
              </div>
              <Progress value={90} className="h-2" />
              <p className="text-xs text-green-600">10% under budget</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  Net Profit
                </span>
                <span className="font-medium">$80,000 / $50,000</span>
              </div>
              <Progress value={100} className="h-2" />
              <p className="text-xs text-green-600">60% over target</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
