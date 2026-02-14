'use client';

import { useState } from 'react';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, History, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UnifiedLayout, createStat } from '@/components/layout/unified';

const mockTransactions = [
  {
    id: 1,
    type: 'credit',
    amount: 500,
    description: 'Payment received - INV-001',
    date: '2024-03-10',
  },
  {
    id: 2,
    type: 'debit',
    amount: 150,
    description: 'Refund processed - ORD-123',
    date: '2024-03-09',
  },
  {
    id: 3,
    type: 'credit',
    amount: 1200,
    description: 'Payment received - INV-002',
    date: '2024-03-08',
  },
  {
    id: 4,
    type: 'credit',
    amount: 800,
    description: 'Payment received - INV-003',
    date: '2024-03-07',
  },
];

export default function CommerceWalletPage() {
  const totalBalance = 12500;
  const pendingBalance = 2300;

  const stats = [
    createStat('Available Balance', `$${totalBalance.toLocaleString()}`, Wallet, 'green'),
    createStat('Pending', `$${pendingBalance.toLocaleString()}`, History, 'amber'),
    createStat('This Month', '+$4,500', ArrowUpRight, 'blue'),
    createStat('Transactions', mockTransactions.length, CreditCard, 'primary'),
  ];

  return (
    <UnifiedLayout hubId="commerce" pageTitle="Wallet" stats={stats} fixedMenu={null}>
      <div className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common wallet operations</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Plus className="h-5 w-5" />
                Add Funds
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <ArrowUpRight className="h-5 w-5" />
                Withdraw
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <CreditCard className="h-5 w-5" />
                Link Card
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <History className="h-5 w-5" />
                Statement
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Balance Summary</CardTitle>
              <CardDescription>Current wallet status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <span className="text-sm text-muted-foreground">Available Balance</span>
                <span className="text-2xl font-bold text-green-600">
                  ${totalBalance.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
                <span className="text-sm text-muted-foreground">Pending</span>
                <span className="text-xl font-semibold text-amber-600">
                  ${pendingBalance.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
            <CardDescription>Latest wallet activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}
                    >
                      {tx.type === 'credit' ? (
                        <ArrowDownLeft className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-sm text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <span
                    className={`font-semibold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {tx.type === 'credit' ? '+' : '-'}${tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </UnifiedLayout>
  );
}
