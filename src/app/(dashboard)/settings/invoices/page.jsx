'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UnifiedLayout } from '@/components/layout/unified';
import {
  Receipt,
  Download,
  Eye,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  CreditCard,
  FileText,
  TrendingUp,
  HelpCircle,
  DollarSign,
  Building2,
  Check,
  Sparkles,
  FileCheck,
  LayoutTemplate,
} from 'lucide-react';
import {
  INVOICE_TEMPLATES,
  getSelectedTemplateId,
  setSelectedTemplateId,
} from '@/config/invoice-templates';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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

// Mock invoices data
const invoicesData = [
  {
    id: 'INV-2024-001',
    date: '2024-01-15',
    amount: 9999,
    status: 'paid',
    description: 'Business Plan - Monthly',
    dueDate: '2024-01-15',
    type: 'subscription',
    paymentMethod: 'Credit Card ••••4242',
    paidAt: '2024-01-15',
  },
  {
    id: 'INV-2024-002',
    date: '2024-01-10',
    amount: 3500,
    status: 'paid',
    description: 'Wallet Credits - Growth Package',
    dueDate: '2024-01-10',
    type: 'credits',
    paymentMethod: 'UPI',
    paidAt: '2024-01-10',
  },
  {
    id: 'INV-2023-012',
    date: '2023-12-15',
    amount: 9999,
    status: 'paid',
    description: 'Business Plan - Monthly',
    dueDate: '2023-12-15',
    type: 'subscription',
    paymentMethod: 'Credit Card ••••4242',
    paidAt: '2023-12-15',
  },
  {
    id: 'INV-2023-011',
    date: '2023-12-01',
    amount: 2000,
    status: 'paid',
    description: 'Wallet Credits - Starter Package',
    dueDate: '2023-12-01',
    type: 'credits',
    paymentMethod: 'Credit Card ••••4242',
    paidAt: '2023-12-01',
  },
  {
    id: 'INV-2023-010',
    date: '2023-11-15',
    amount: 9999,
    status: 'paid',
    description: 'Business Plan - Monthly',
    dueDate: '2023-11-15',
    type: 'subscription',
    paymentMethod: 'Credit Card ••••4242',
    paidAt: '2023-11-15',
  },
  {
    id: 'INV-2023-009',
    date: '2023-10-15',
    amount: 9999,
    status: 'paid',
    description: 'Business Plan - Monthly',
    dueDate: '2023-10-15',
    type: 'subscription',
    paymentMethod: 'Credit Card ••••4242',
    paidAt: '2023-10-15',
  },
];

const statusConfig = {
  paid: {
    label: 'Paid',
    icon: CheckCircle,
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-200',
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
  },
  overdue: {
    label: 'Overdue',
    icon: AlertCircle,
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-200',
  },
};

const typeConfig = {
  subscription: {
    label: 'Subscription',
    icon: CreditCard,
    color: 'purple',
    gradient: 'from-purple-50 to-violet-50',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  credits: {
    label: 'Credits',
    icon: DollarSign,
    color: 'green',
    gradient: 'from-green-50 to-emerald-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
};

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [activeTemplate, setActiveTemplate] = useState('standard');

  useEffect(() => {
    setActiveTemplate(getSelectedTemplateId());
  }, []);

  const filteredInvoices = invoicesData.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    const matchesType = typeFilter === 'all' || invoice.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPaid = invoicesData
    .filter((i) => i.status === 'paid')
    .reduce((acc, i) => acc + i.amount, 0);
  const subscriptionTotal = invoicesData
    .filter((i) => i.type === 'subscription' && i.status === 'paid')
    .reduce((acc, i) => acc + i.amount, 0);
  const creditsTotal = invoicesData
    .filter((i) => i.type === 'credits' && i.status === 'paid')
    .reduce((acc, i) => acc + i.amount, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <UnifiedLayout hubId="settings" pageTitle="Invoices" fixedMenu={null}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 space-y-6 p-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
            <p className="text-muted-foreground">Manage invoice templates and billing history</p>
          </div>
          <Button variant="outline" size="sm" className="rounded-lg">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </motion.div>

        {/* Invoice Template Selector */}
        <motion.div variants={itemVariants}>
          <Card className="rounded-2xl border">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <LayoutTemplate className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Invoice Templates</CardTitle>
                  <CardDescription>Choose the default template for your invoices</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {Object.values(INVOICE_TEMPLATES).map((tpl) => {
                  const isActive = activeTemplate === tpl.id;
                  const icons = {
                    standard: Sparkles,
                    compact: FileText,
                    gst_formal: FileCheck,
                  };
                  const colors = {
                    standard: {
                      bg: 'bg-indigo-50',
                      border: 'border-indigo-200',
                      icon: 'text-indigo-600',
                      iconBg: 'bg-indigo-100',
                      ring: 'ring-indigo-500',
                    },
                    compact: {
                      bg: 'bg-slate-50',
                      border: 'border-slate-200',
                      icon: 'text-slate-600',
                      iconBg: 'bg-slate-100',
                      ring: 'ring-slate-500',
                    },
                    gst_formal: {
                      bg: 'bg-amber-50',
                      border: 'border-amber-200',
                      icon: 'text-amber-600',
                      iconBg: 'bg-amber-100',
                      ring: 'ring-amber-500',
                    },
                  };
                  const TplIcon = icons[tpl.id] || FileText;
                  const c = colors[tpl.id] || colors.standard;

                  return (
                    <div
                      key={tpl.id}
                      onClick={() => {
                        setSelectedTemplateId(tpl.id);
                        setActiveTemplate(tpl.id);
                      }}
                      className={cn(
                        'relative cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md',
                        isActive
                          ? `${c.border} ${c.bg} ring-2 ${c.ring} ring-offset-1`
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      )}
                    >
                      {isActive && (
                        <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                          <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                        </div>
                      )}
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            'h-10 w-10 rounded-lg flex items-center justify-center shrink-0',
                            c.iconBg
                          )}
                        >
                          <TplIcon className={cn('h-5 w-5', c.icon)} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm">{tpl.name}</h3>
                            {isActive && (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-[10px] px-1.5 py-0">
                                Default
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {tpl.description}
                          </p>
                          <p className="text-[10px] text-muted-foreground/70 mt-2 italic">
                            {tpl.preview}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Receipt className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">{invoicesData.length}</p>
                <p className="text-xs text-blue-600/80">Total Invoices</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-900">{formatCurrency(totalPaid)}</p>
                <p className="text-xs text-green-600/80">Total Paid</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-4 border border-purple-200/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-900">
                  {formatCurrency(subscriptionTotal)}
                </p>
                <p className="text-xs text-purple-600/80">Subscription</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-900">Feb 1, 2024</p>
                <p className="text-xs text-amber-600/80">Next Invoice</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="all" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="bg-gray-100/80">
                <TabsTrigger
                  value="all"
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-medium data-[state=active]:shadow-sm"
                >
                  <FileText className="h-4 w-4" />
                  All Invoices
                </TabsTrigger>
                <TabsTrigger
                  value="subscription"
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-medium data-[state=active]:shadow-sm"
                >
                  <CreditCard className="h-4 w-4" />
                  Subscription
                </TabsTrigger>
                <TabsTrigger
                  value="credits"
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-medium data-[state=active]:shadow-sm"
                >
                  <DollarSign className="h-4 w-4" />
                  Credits
                </TabsTrigger>
              </TabsList>

              {/* Filters */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices..."
                    className="pl-9 w-[200px] rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px] rounded-lg">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4">
              {filteredInvoices.map((invoice) => {
                const status = statusConfig[invoice.status];
                const type = typeConfig[invoice.type];
                const StatusIcon = status.icon;
                const TypeIcon = type.icon;

                return (
                  <Card
                    key={invoice.id}
                    className={`rounded-2xl border hover:shadow-md transition-all cursor-pointer bg-gradient-to-br ${type.gradient}`}
                    onClick={() => setSelectedInvoice(invoice)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`h-12 w-12 rounded-xl ${type.iconBg} flex items-center justify-center`}
                          >
                            <TypeIcon className={`h-6 w-6 ${type.iconColor}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{invoice.id}</p>
                              <Badge className={`${status.bg} ${status.text} hover:${status.bg}`}>
                                <StatusIcon className="mr-1 h-3 w-3" />
                                {status.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{invoice.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(invoice.date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xl font-bold">{formatCurrency(invoice.amount)}</p>
                            <p className="text-xs text-muted-foreground">{invoice.paymentMethod}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-lg"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedInvoice(invoice);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-lg"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="subscription" className="space-y-4">
              {filteredInvoices
                .filter((i) => i.type === 'subscription')
                .map((invoice) => {
                  const status = statusConfig[invoice.status];
                  const type = typeConfig[invoice.type];
                  const StatusIcon = status.icon;
                  const TypeIcon = type.icon;

                  return (
                    <Card
                      key={invoice.id}
                      className={`rounded-2xl border hover:shadow-md transition-all cursor-pointer bg-gradient-to-br ${type.gradient}`}
                      onClick={() => setSelectedInvoice(invoice)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`h-12 w-12 rounded-xl ${type.iconBg} flex items-center justify-center`}
                            >
                              <TypeIcon className={`h-6 w-6 ${type.iconColor}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">{invoice.id}</p>
                                <Badge className={`${status.bg} ${status.text} hover:${status.bg}`}>
                                  <StatusIcon className="mr-1 h-3 w-3" />
                                  {status.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{invoice.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(invoice.date).toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-xl font-bold">{formatCurrency(invoice.amount)}</p>
                              <p className="text-xs text-muted-foreground">
                                {invoice.paymentMethod}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="rounded-lg">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-lg"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </TabsContent>

            <TabsContent value="credits" className="space-y-4">
              {filteredInvoices
                .filter((i) => i.type === 'credits')
                .map((invoice) => {
                  const status = statusConfig[invoice.status];
                  const type = typeConfig[invoice.type];
                  const StatusIcon = status.icon;
                  const TypeIcon = type.icon;

                  return (
                    <Card
                      key={invoice.id}
                      className={`rounded-2xl border hover:shadow-md transition-all cursor-pointer bg-gradient-to-br ${type.gradient}`}
                      onClick={() => setSelectedInvoice(invoice)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`h-12 w-12 rounded-xl ${type.iconBg} flex items-center justify-center`}
                            >
                              <TypeIcon className={`h-6 w-6 ${type.iconColor}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">{invoice.id}</p>
                                <Badge className={`${status.bg} ${status.text} hover:${status.bg}`}>
                                  <StatusIcon className="mr-1 h-3 w-3" />
                                  {status.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{invoice.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(invoice.date).toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-xl font-bold">{formatCurrency(invoice.amount)}</p>
                              <p className="text-xs text-muted-foreground">
                                {invoice.paymentMethod}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="rounded-lg">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-lg"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Info Accordion */}
        <motion.div variants={itemVariants}>
          <Accordion type="single" collapsible className="bg-white rounded-2xl border">
            <AccordionItem value="invoices" className="border-none">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Receipt className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium">Understanding Your Invoices</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="pl-11 space-y-2 text-muted-foreground">
                  <p>
                    Invoices are generated automatically for all your payments including
                    subscription renewals and credit purchases.
                  </p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Subscription invoices are generated monthly on your billing date</li>
                    <li>Credit purchase invoices are generated immediately after payment</li>
                    <li>All invoices include GST breakdown for Indian customers</li>
                    <li>Download PDF invoices for your records</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="payment" className="border-none">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium">Payment Methods</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="pl-11 space-y-2 text-muted-foreground">
                  <p>We accept multiple payment methods for your convenience:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Credit/Debit Cards (Visa, Mastercard, RuPay)</li>
                    <li>UPI (Google Pay, PhonePe, Paytm)</li>
                    <li>Net Banking (all major banks)</li>
                    <li>Wallets (Paytm, Amazon Pay)</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="support" className="border-none">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <HelpCircle className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="font-medium">Billing Support</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="pl-11 space-y-3 text-muted-foreground">
                  <p>Need help with billing? Here's how to reach us:</p>
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <p className="text-sm">billing@nexoraos.pro</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Response Time</p>
                      <p className="text-sm">We respond to billing queries within 24 hours</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Refunds</p>
                      <p className="text-sm">
                        Refund requests are processed within 5-7 business days
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>

        {/* Invoice Detail Dialog */}
        <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
          <DialogContent className="rounded-2xl max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Invoice Details
              </DialogTitle>
              <DialogDescription>View invoice information</DialogDescription>
            </DialogHeader>
            {selectedInvoice && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-muted/50 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Invoice ID</span>
                    <span className="font-medium">{selectedInvoice.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">
                      {new Date(selectedInvoice.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Description</span>
                    <span className="font-medium">{selectedInvoice.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-medium">{selectedInvoice.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="text-xl font-bold">
                      {formatCurrency(selectedInvoice.amount)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 rounded-lg">
                    <Eye className="mr-2 h-4 w-4" />
                    View PDF
                  </Button>
                  <Button className="flex-1 rounded-lg">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </UnifiedLayout>
  );
}
