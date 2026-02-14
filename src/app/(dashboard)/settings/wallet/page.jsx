'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UnifiedLayout } from '@/components/layout/unified';
import {
  Wallet,
  CreditCard,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  AlertTriangle,
  Settings,
  RefreshCw,
  Download,
  Filter,
  ChevronRight,
  Zap,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  Gift,
  Shield,
  Smartphone,
  HelpCircle,
  Receipt,
  BarChart3,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// WhatsApp icon
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// Mock data
const mockWallet = {
  balance: 1234500, // In paise (₹12,345)
  currency: 'INR',
  lowBalanceThreshold: 50000,
  autoRechargeEnabled: true,
  autoRechargeAmount: 500000,
  autoRechargeThreshold: 100000,
};

const mockMonthlyUsage = [
  { channel: 'WHATSAPP', amount: 245000, count: 3267 },
  { channel: 'SMS', amount: 125000, count: 5000 },
  { channel: 'EMAIL', amount: 15000, count: 3000 },
  { channel: 'VOICE', amount: 180000, count: 1200 },
];

const mockRecentTransactions = [
  {
    id: '1',
    type: 'DEBIT',
    amount: -7500,
    channel: 'WHATSAPP',
    description: 'WhatsApp template x100',
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    type: 'CREDIT',
    amount: 500000,
    channel: null,
    description: 'Wallet top-up',
    createdAt: new Date(Date.now() - 7200000),
  },
  {
    id: '3',
    type: 'DEBIT',
    amount: -2500,
    channel: 'SMS',
    description: 'SMS transactional x100',
    createdAt: new Date(Date.now() - 10800000),
  },
  {
    id: '4',
    type: 'DEBIT',
    amount: -15000,
    channel: 'VOICE',
    description: 'Voice outbound x10min',
    createdAt: new Date(Date.now() - 14400000),
  },
  {
    id: '5',
    type: 'DEBIT',
    amount: -500,
    channel: 'EMAIL',
    description: 'Email standard x100',
    createdAt: new Date(Date.now() - 18000000),
  },
];

const mockForecast = {
  dailyAverage: 18500,
  weeklyProjection: 129500,
  monthlyProjection: 555000,
  daysRemaining: 67,
  runOutDate: new Date(Date.now() + 67 * 24 * 60 * 60 * 1000),
};

const mockPricing = [
  {
    channel: 'WHATSAPP',
    icon: WhatsAppIcon,
    color: 'green',
    costs: [
      { type: 'text', amountRupees: '0.50' },
      { type: 'template', amountRupees: '0.75' },
      { type: 'media', amountRupees: '1.00' },
    ],
  },
  {
    channel: 'SMS',
    icon: Smartphone,
    color: 'purple',
    costs: [
      { type: 'transactional', amountRupees: '0.25' },
      { type: 'promotional', amountRupees: '0.20' },
    ],
  },
  {
    channel: 'EMAIL',
    icon: Mail,
    color: 'blue',
    costs: [
      { type: 'standard', amountRupees: '0.05' },
      { type: 'bulk', amountRupees: '0.03' },
    ],
  },
  {
    channel: 'VOICE',
    icon: Phone,
    color: 'orange',
    costs: [
      { type: 'outbound', amountRupees: '1.50/min' },
      { type: 'inbound', amountRupees: '1.00/min' },
    ],
  },
];

const packages = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 1000,
    price: 800,
    bonus: 0,
    popular: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    credits: 5000,
    price: 3500,
    bonus: 500,
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    credits: 10000,
    price: 6000,
    bonus: 1500,
    popular: false,
  },
];

function formatCurrency(paise) {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(rupees);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const channelIcons = {
  WHATSAPP: WhatsAppIcon,
  SMS: Smartphone,
  EMAIL: Mail,
  VOICE: Phone,
};

const channelColors = {
  WHATSAPP: { bg: 'bg-green-100', text: 'text-green-600', gradient: 'from-green-50 to-emerald-50' },
  SMS: { bg: 'bg-purple-100', text: 'text-purple-600', gradient: 'from-purple-50 to-violet-50' },
  EMAIL: { bg: 'bg-blue-100', text: 'text-blue-600', gradient: 'from-blue-50 to-indigo-50' },
  VOICE: { bg: 'bg-orange-100', text: 'text-orange-600', gradient: 'from-orange-50 to-amber-50' },
};

export default function WalletPage() {
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');

  const totalUsage = mockMonthlyUsage.reduce((sum, u) => sum + u.amount, 0);

  return (
    <UnifiedLayout hubId="settings" pageTitle="Wallet & Usage" fixedMenu={null}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 space-y-6 p-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Wallet & Usage</h1>
            <p className="text-muted-foreground">Manage your balance and track channel usage</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-lg">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button size="sm" className="rounded-lg" onClick={() => setShowTopUp(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Credits
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(mockWallet.balance)}
                </p>
                <p className="text-xs text-green-600/80">Available Balance</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalUsage)}</p>
                <p className="text-xs text-blue-600/80">This Month</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-4 border border-purple-200/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-900">
                  {formatCurrency(mockForecast.dailyAverage)}
                </p>
                <p className="text-xs text-purple-600/80">Daily Average</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-900">
                  {mockForecast.daysRemaining} days
                </p>
                <p className="text-xs text-amber-600/80">Balance Lasts</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-gray-100/80">
              <TabsTrigger
                value="overview"
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-medium data-[state=active]:shadow-sm"
              >
                <Wallet className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="transactions"
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-medium data-[state=active]:shadow-sm"
              >
                <Receipt className="h-4 w-4" />
                Transactions
              </TabsTrigger>
              <TabsTrigger
                value="pricing"
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-medium data-[state=active]:shadow-sm"
              >
                <CreditCard className="h-4 w-4" />
                Pricing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Usage by Channel */}
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Channel Usage This Month
                  </CardTitle>
                  <CardDescription>Breakdown of usage across all channels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    {mockMonthlyUsage.map((usage) => {
                      const Icon = channelIcons[usage.channel];
                      const colors = channelColors[usage.channel];
                      const percentage = ((usage.amount / totalUsage) * 100).toFixed(0);

                      return (
                        <div
                          key={usage.channel}
                          className={`bg-gradient-to-br ${colors.gradient} rounded-xl p-4 border border-${colors.text.replace('text-', '')}/20`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className={`h-10 w-10 rounded-lg ${colors.bg} flex items-center justify-center`}
                            >
                              <Icon className={`h-5 w-5 ${colors.text}`} />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{usage.channel}</p>
                              <p className="text-xs text-muted-foreground">
                                {percentage}% of total
                              </p>
                            </div>
                          </div>
                          <p className="text-xl font-bold">{formatCurrency(usage.amount)}</p>
                          <p className="text-xs text-muted-foreground">
                            {usage.count.toLocaleString()} messages
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card className="rounded-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Receipt className="h-5 w-5" />
                        Recent Transactions
                      </CardTitle>
                      <CardDescription>Your latest wallet activity</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-lg">
                      View All
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockRecentTransactions.slice(0, 5).map((tx) => {
                    const Icon = tx.channel
                      ? channelIcons[tx.channel]
                      : tx.type === 'CREDIT'
                        ? Plus
                        : ArrowDownRight;
                    const colors = tx.channel ? channelColors[tx.channel] : null;

                    return (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-4 rounded-xl border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                              tx.type === 'CREDIT'
                                ? 'bg-green-100'
                                : colors
                                  ? colors.bg
                                  : 'bg-gray-100'
                            }`}
                          >
                            <Icon
                              className={`h-5 w-5 ${
                                tx.type === 'CREDIT'
                                  ? 'text-green-600'
                                  : colors
                                    ? colors.text
                                    : 'text-gray-600'
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-medium">{tx.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(tx.createdAt)}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`font-semibold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {tx.type === 'CREDIT' ? '+' : ''}
                          {formatCurrency(tx.amount)}
                        </span>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Credit Packages */}
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Credit Packages
                  </CardTitle>
                  <CardDescription>Buy credit packages with bonus credits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className={`relative rounded-xl border p-5 transition-all hover:shadow-md ${
                          pkg.popular
                            ? 'border-primary/30 bg-gradient-to-br from-primary/5 to-transparent'
                            : 'hover:border-primary/50'
                        }`}
                      >
                        {pkg.popular && (
                          <Badge className="absolute -top-2 right-3 bg-primary shadow">
                            Popular
                          </Badge>
                        )}
                        <h4 className="text-lg font-bold">{pkg.name}</h4>
                        <div className="mt-2 flex items-baseline gap-1">
                          <span className="text-3xl font-bold">₹{pkg.price}</span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {pkg.credits.toLocaleString()} credits
                          {pkg.bonus > 0 && (
                            <span className="ml-1 text-green-600 font-medium">
                              +{pkg.bonus} bonus
                            </span>
                          )}
                        </p>
                        <Button
                          className={`mt-4 w-full rounded-lg ${pkg.popular ? '' : 'bg-muted text-foreground hover:bg-muted/80'}`}
                          variant={pkg.popular ? 'default' : 'secondary'}
                        >
                          Buy Now
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              {/* Filters */}
              <Card className="rounded-2xl">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Select>
                        <SelectTrigger className="pl-9 rounded-lg">
                          <SelectValue placeholder="All Channels" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Channels</SelectItem>
                          <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                          <SelectItem value="SMS">SMS</SelectItem>
                          <SelectItem value="EMAIL">Email</SelectItem>
                          <SelectItem value="VOICE">Voice</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Select>
                      <SelectTrigger className="w-[150px] rounded-lg">
                        <Calendar className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Last 7 days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">Last 7 days</SelectItem>
                        <SelectItem value="30">Last 30 days</SelectItem>
                        <SelectItem value="90">Last 90 days</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="rounded-lg">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction List */}
              <Card className="rounded-2xl">
                <CardContent className="pt-6 space-y-3">
                  {mockRecentTransactions.map((tx) => {
                    const Icon = tx.channel
                      ? channelIcons[tx.channel]
                      : tx.type === 'CREDIT'
                        ? Plus
                        : ArrowDownRight;
                    const colors = tx.channel ? channelColors[tx.channel] : null;

                    return (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-4 rounded-xl border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                              tx.type === 'CREDIT'
                                ? 'bg-green-100'
                                : colors
                                  ? colors.bg
                                  : 'bg-gray-100'
                            }`}
                          >
                            <Icon
                              className={`h-5 w-5 ${
                                tx.type === 'CREDIT'
                                  ? 'text-green-600'
                                  : colors
                                    ? colors.text
                                    : 'text-gray-600'
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-medium">{tx.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(tx.createdAt)}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`font-semibold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {tx.type === 'CREDIT' ? '+' : ''}
                          {formatCurrency(tx.amount)}
                        </span>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6">
              {/* Channel Pricing */}
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Channel Pricing
                  </CardTitle>
                  <CardDescription>
                    Pay-as-you-go pricing for all channels. Credits are deducted automatically based
                    on usage.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {mockPricing.map((channel) => {
                      const colorMap = {
                        green: {
                          bg: 'bg-green-100',
                          text: 'text-green-600',
                          gradient: 'from-green-50 to-emerald-50',
                        },
                        purple: {
                          bg: 'bg-purple-100',
                          text: 'text-purple-600',
                          gradient: 'from-purple-50 to-violet-50',
                        },
                        blue: {
                          bg: 'bg-blue-100',
                          text: 'text-blue-600',
                          gradient: 'from-blue-50 to-indigo-50',
                        },
                        orange: {
                          bg: 'bg-orange-100',
                          text: 'text-orange-600',
                          gradient: 'from-orange-50 to-amber-50',
                        },
                      };
                      const colors = colorMap[channel.color];

                      return (
                        <div
                          key={channel.channel}
                          className={`bg-gradient-to-br ${colors.gradient} rounded-xl p-5 border`}
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div
                              className={`h-10 w-10 rounded-lg ${colors.bg} flex items-center justify-center`}
                            >
                              <channel.icon className={`h-5 w-5 ${colors.text}`} />
                            </div>
                            <h4 className="text-lg font-semibold">{channel.channel}</h4>
                          </div>
                          <div className="space-y-2">
                            {channel.costs.map((cost) => (
                              <div
                                key={cost.type}
                                className="flex items-center justify-between text-sm"
                              >
                                <span className="capitalize text-muted-foreground">
                                  {cost.type}
                                </span>
                                <span className="font-medium">₹{cost.amountRupees}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Volume Discounts */}
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Gift className="h-5 w-5 text-primary" />
                    Volume Discounts
                  </CardTitle>
                  <CardDescription>
                    Get bonus credits when you purchase larger packages
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="font-medium">Growth Package (5,000 credits)</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700">+500 bonus (10%)</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200/50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-purple-600" />
                      </div>
                      <span className="font-medium">Enterprise Package (10,000 credits)</span>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700">+1,500 bonus (15%)</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Info Accordion */}
        <motion.div variants={itemVariants}>
          <Accordion type="single" collapsible className="bg-white rounded-2xl border">
            <AccordionItem value="wallet" className="border-none">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <Wallet className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium">How Wallet Credits Work</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="pl-11 space-y-2 text-muted-foreground">
                  <p>
                    Your wallet stores prepaid credits that are used for sending messages across all
                    channels. Credits are deducted automatically based on the pricing for each
                    message type.
                  </p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Add credits anytime via credit card or UPI</li>
                    <li>Set up auto-recharge to never run out</li>
                    <li>Credits never expire as long as your account is active</li>
                    <li>View detailed usage reports by channel</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="auto-recharge" className="border-none">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <RefreshCw className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium">Auto-Recharge Settings</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="pl-11 space-y-2 text-muted-foreground">
                  <p>
                    Never run out of credits by enabling auto-recharge. When your balance falls
                    below a threshold, we'll automatically add credits to your wallet.
                  </p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Set your minimum balance threshold</li>
                    <li>Choose your recharge amount</li>
                    <li>Uses your saved payment method</li>
                    <li>Receive email notifications for each recharge</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="billing" className="border-none">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <HelpCircle className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="font-medium">Billing FAQs</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="pl-11 space-y-3 text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground">Can I get a refund?</p>
                    <p className="text-sm">
                      Unused credits can be refunded within 30 days of purchase. Contact support for
                      assistance.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">How are credits calculated?</p>
                    <p className="text-sm">
                      Each message type has a fixed credit cost. You can view the pricing breakdown
                      in the Pricing tab.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Do credits expire?</p>
                    <p className="text-sm">
                      No, credits never expire as long as your account remains active.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>

        {/* Top-up Dialog */}
        <Dialog open={showTopUp} onOpenChange={setShowTopUp}>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>Add Credits</DialogTitle>
              <DialogDescription>Enter the amount you want to add to your wallet</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Amount (₹)</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  className="rounded-lg"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                {[500, 1000, 2000, 5000].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    className="flex-1 rounded-lg"
                    onClick={() => setTopUpAmount(amount.toString())}
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTopUp(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowTopUp(false)}>Proceed to Payment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </UnifiedLayout>
  );
}
