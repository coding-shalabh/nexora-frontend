'use client';

import { useState } from 'react';
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  AlertTriangle,
  CreditCard,
  MessageSquare,
  Phone,
  Mail,
  BarChart3,
  Settings,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  useWallet,
  useWalletTransactions,
  useWalletUsage,
  useSpendLimits,
} from '@/hooks/use-wallet';

function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDateTime(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

const channelIcons = {
  WHATSAPP: MessageSquare,
  SMS: Phone,
  VOICE: Phone,
  EMAIL: Mail,
  EMAIL_SMTP: Mail,
  EMAIL_GMAIL: Mail,
  EMAIL_MICROSOFT: Mail,
};

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch data from API
  const { data: wallet, isLoading: walletLoading, error: walletError, refetch } = useWallet();
  const { data: transactionsData, isLoading: transactionsLoading } = useWalletTransactions({
    limit: 10,
  });
  const { data: usage, isLoading: usageLoading } = useWalletUsage();
  const { data: spendLimits, isLoading: limitsLoading } = useSpendLimits();

  const transactions = transactionsData?.data || [];
  const usageBreakdown = usage?.breakdown || [];

  // Convert spend limits object to array format
  const limits = spendLimits
    ? Object.entries(spendLimits).map(([channel, data]) => ({
        channel,
        dailyLimit: data.dailyLimit,
        monthlyLimit: data.monthlyLimit,
        dailyUsed: data.currentDailySpend,
        monthlyUsed: data.currentMonthlySpend,
      }))
    : [];

  // Loading state
  if (walletLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (walletError) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-lg font-medium">Failed to load wallet</p>
        <p className="text-sm text-muted-foreground">{walletError.message}</p>
        <Button onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  const isLowBalance = wallet && wallet.balance < (wallet.lowBalanceThreshold || 500);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Wallet</h1>
          <p className="text-muted-foreground">Manage your PAYG balance and usage</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Funds
          </Button>
        </div>
      </div>

      {/* Balance Card */}
      <Card className={cn('p-6', isLowBalance && 'border-orange-500')}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Current Balance</span>
            </div>
            <div className="text-4xl font-bold mt-2">{formatCurrency(wallet?.balance || 0)}</div>
            {isLowBalance && (
              <div className="flex items-center gap-2 mt-2 text-orange-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Low balance - consider adding funds</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Auto-recharge</div>
            <div
              className={cn(
                'text-sm font-medium',
                wallet?.autoRechargeEnabled ? 'text-green-600' : 'text-gray-500'
              )}
            >
              {wallet?.autoRechargeEnabled ? 'Enabled' : 'Disabled'}
            </div>
            {wallet?.autoRechargeEnabled && (
              <div className="text-xs text-muted-foreground mt-1">
                {formatCurrency(wallet?.autoRechargeAmount)} when below{' '}
                {formatCurrency(wallet?.autoRechargeThreshold)}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b">
        {['overview', 'transactions', 'limits'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors capitalize',
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Usage This Month */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Usage This Month</h3>
            {usageLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : usageBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No usage data available
              </p>
            ) : (
              <>
                <div className="space-y-4">
                  {usageBreakdown.map((item) => {
                    const Icon = channelIcons[item.channel] || MessageSquare;
                    return (
                      <div key={item.channel} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{item.channel?.replace(/_/g, ' ')}</div>
                            <div className="text-sm text-muted-foreground">
                              {(item.count || 0).toLocaleString()} {item.unit || 'messages'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right font-medium">
                          {formatCurrency(item.cost || 0)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t">
                  <span className="font-semibold">Total Usage</span>
                  <span className="font-bold text-lg">
                    {formatCurrency(
                      usage?.totalCost || usageBreakdown.reduce((sum, i) => sum + (i.cost || 0), 0)
                    )}
                  </span>
                </div>
              </>
            )}
          </Card>

          {/* Quick Actions */}
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto py-4 flex-col">
                  <CreditCard className="h-6 w-6 mb-2" />
                  <span>Add Funds</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  <span>View Reports</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col">
                  <AlertTriangle className="h-6 w-6 mb-2" />
                  <span>Set Alerts</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  <span>Usage Analytics</span>
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Payment Methods</h3>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">•••• •••• •••• 4242</div>
                  <div className="text-sm text-muted-foreground">Expires 12/25</div>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  Default
                </span>
              </div>
              <Button variant="ghost" className="w-full mt-3">
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <Card>
          {transactionsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'h-10 w-10 rounded-lg flex items-center justify-center',
                        tx.type === 'CREDIT' ? 'bg-green-100' : 'bg-red-100'
                      )}
                    >
                      {tx.type === 'CREDIT' ? (
                        <ArrowDownLeft className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">
                        {tx.description ||
                          (tx.type === 'CREDIT' ? 'Wallet top-up' : 'Usage charge')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDateTime(tx.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={cn(
                        'font-medium',
                        tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      {tx.type === 'CREDIT' ? '+' : '-'}
                      {formatCurrency(Math.abs(tx.amount))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Balance: {formatCurrency(tx.balanceAfter)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'limits' && (
        <div className="space-y-4">
          {limitsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : limits.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No spend limits configured</p>
              <Button variant="outline" className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Spend Limit
              </Button>
            </Card>
          ) : (
            limits.map((limit) => (
              <Card key={limit.channel} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{limit.channel?.replace(/_/g, ' ')}</h3>
                  <Button variant="outline" size="sm">
                    Edit Limits
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Daily Limit</span>
                      <span>
                        {formatCurrency(limit.dailyUsed || 0)} /{' '}
                        {formatCurrency(limit.dailyLimit || 0)}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${limit.dailyLimit ? ((limit.dailyUsed || 0) / limit.dailyLimit) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Monthly Limit</span>
                      <span>
                        {formatCurrency(limit.monthlyUsed || 0)} /{' '}
                        {formatCurrency(limit.monthlyLimit || 0)}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${limit.monthlyLimit ? ((limit.monthlyUsed || 0) / limit.monthlyLimit) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
