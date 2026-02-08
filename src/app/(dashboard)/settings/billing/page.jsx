'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Check,
  X,
  Zap,
  Users,
  Crown,
  Sparkles,
  Building2,
  HelpCircle,
  RefreshCcw,
  Receipt,
  Calendar,
  Download,
  AlertTriangle,
} from 'lucide-react';

import { HubLayout } from '@/components/layout/hub-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

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

// Mock subscription data
const currentSubscription = {
  plan: 'Business',
  status: 'active',
  seats: 25,
  usedSeats: 18,
  price: 9999,
  currency: 'INR',
  billingCycle: 'monthly',
  currentPeriodStart: '2024-01-01',
  currentPeriodEnd: '2024-01-31',
  nextBillingDate: '2024-02-01',
  paymentMethod: {
    type: 'card',
    last4: '4242',
    brand: 'Visa',
    expiryMonth: 12,
    expiryYear: 2025,
  },
};

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'For small teams getting started',
    price: { monthly: 2999, yearly: 29990 },
    currency: 'INR',
    seats: 5,
    icon: Zap,
    color: 'blue',
    features: [
      { name: 'Up to 5 users', included: true },
      { name: 'WhatsApp & SMS channels', included: true },
      { name: 'Basic inbox', included: true },
      { name: 'Contact management', included: true },
      { name: 'Basic analytics', included: true },
      { name: 'Email support', included: true },
      { name: 'Campaigns & broadcasts', included: false },
      { name: 'Automations', included: false },
      { name: 'API access', included: false },
      { name: 'Custom integrations', included: false },
    ],
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For growing businesses',
    price: { monthly: 9999, yearly: 99990 },
    currency: 'INR',
    seats: 25,
    popular: true,
    icon: Crown,
    color: 'purple',
    features: [
      { name: 'Up to 25 users', included: true },
      { name: 'All channels (WhatsApp, SMS, Email, Voice)', included: true },
      { name: 'Advanced inbox with SLA', included: true },
      { name: 'Full contact & deal management', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Priority support', included: true },
      { name: 'Campaigns & broadcasts', included: true },
      { name: 'Automations', included: true },
      { name: 'API access', included: true },
      { name: 'Custom integrations', included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    price: { monthly: null, yearly: null },
    currency: 'INR',
    seats: 'Unlimited',
    icon: Building2,
    color: 'amber',
    features: [
      { name: 'Unlimited users', included: true },
      { name: 'All channels + custom', included: true },
      { name: 'Enterprise inbox', included: true },
      { name: 'Advanced CRM features', included: true },
      { name: 'Custom analytics & reporting', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'Unlimited campaigns', included: true },
      { name: 'Advanced automations', included: true },
      { name: 'Full API access', included: true },
      { name: 'Custom integrations & SSO', included: true },
    ],
  },
];

// Mock invoices
const invoices = [
  { id: 'inv_001', date: '2024-01-01', amount: 9999, status: 'paid' },
  { id: 'inv_002', date: '2023-12-01', amount: 9999, status: 'paid' },
  { id: 'inv_003', date: '2023-11-01', amount: 9999, status: 'paid' },
  { id: 'inv_004', date: '2023-10-01', amount: 9999, status: 'paid' },
];

export default function BillingPage() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleUpgrade = (plan) => {
    setSelectedPlan(plan);
    setShowUpgradeDialog(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const daysRemaining = Math.ceil(
    (new Date(currentSubscription.currentPeriodEnd) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <HubLayout
      hubId="settings"
      showFixedMenu={false}
      title="Billing & Subscription"
      description="Manage your plan, billing, and payment methods"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 space-y-6 p-6 overflow-auto"
      >
        {/* Stats */}
        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-4 border border-purple-200/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Crown className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-900">{currentSubscription.plan}</p>
                <p className="text-xs text-purple-600/80">Current Plan</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">
                  {currentSubscription.usedSeats}/{currentSubscription.seats}
                </p>
                <p className="text-xs text-blue-600/80">Seats Used</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(currentSubscription.price)}
                </p>
                <p className="text-xs text-green-600/80">Monthly Cost</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-900">{daysRemaining} days</p>
                <p className="text-xs text-amber-600/80">Until Renewal</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Current Plan Card */}
        <motion.div variants={itemVariants}>
          <Card className="rounded-2xl border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Current Plan Details
                  </CardTitle>
                  <CardDescription>
                    Your subscription renews on{' '}
                    {new Date(currentSubscription.nextBillingDate).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {formatCurrency(currentSubscription.price)}
                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {currentSubscription.usedSeats}/{currentSubscription.seats} seats
                    </p>
                    <p className="text-xs text-muted-foreground">Used</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50">
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {currentSubscription.paymentMethod.brand} ••••{' '}
                      {currentSubscription.paymentMethod.last4}
                    </p>
                    <p className="text-xs text-muted-foreground">Payment method</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Period ends</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="rounded-lg">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Update Payment
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setShowCancelDialog(true)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Billing Cycle Toggle */}
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-4">
          <span className={billingCycle === 'monthly' ? 'font-medium' : 'text-muted-foreground'}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              billingCycle === 'yearly' ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={billingCycle === 'yearly' ? 'font-medium' : 'text-muted-foreground'}>
            Yearly
            <Badge className="ml-2 bg-green-100 text-green-700 hover:bg-green-100">Save 17%</Badge>
          </span>
        </motion.div>

        {/* Plans */}
        <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const colorClasses = {
              blue: {
                bg: 'from-blue-50 to-indigo-50',
                border: 'border-blue-200/50',
                icon: 'bg-blue-100 text-blue-600',
              },
              purple: {
                bg: 'from-purple-50 to-violet-50',
                border: 'border-purple-200/50',
                icon: 'bg-purple-100 text-purple-600',
              },
              amber: {
                bg: 'from-amber-50 to-orange-50',
                border: 'border-amber-200/50',
                icon: 'bg-amber-100 text-amber-600',
              },
            };
            const colors = colorClasses[plan.color];
            const Icon = plan.icon;

            return (
              <Card
                key={plan.id}
                className={`relative rounded-2xl transition-all hover:shadow-lg ${
                  plan.popular
                    ? 'border-primary shadow-lg bg-gradient-to-br ' + colors.bg
                    : plan.name === currentSubscription.plan
                      ? 'bg-muted/50'
                      : 'hover:border-primary/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary shadow-lg">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center ${colors.icon}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle>{plan.name}</CardTitle>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="pt-4">
                    {plan.price.monthly ? (
                      <>
                        <span className="text-3xl font-bold">
                          {formatCurrency(
                            billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly / 12
                          )}
                        </span>
                        <span className="text-muted-foreground">/month</span>
                        {billingCycle === 'yearly' && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Billed annually ({formatCurrency(plan.price.yearly)}/year)
                          </p>
                        )}
                      </>
                    ) : (
                      <span className="text-3xl font-bold">Custom</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        {feature.included ? (
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="h-3 w-3 text-green-600" />
                          </div>
                        ) : (
                          <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center">
                            <X className="h-3 w-3 text-gray-400" />
                          </div>
                        )}
                        <span className={feature.included ? '' : 'text-muted-foreground'}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    {plan.name === currentSubscription.plan ? (
                      <Button variant="outline" className="w-full rounded-xl" disabled>
                        Current Plan
                      </Button>
                    ) : plan.price.monthly ? (
                      <Button
                        className={`w-full rounded-xl ${plan.popular ? '' : ''}`}
                        variant={plan.popular ? 'default' : 'outline'}
                        onClick={() => handleUpgrade(plan)}
                      >
                        {plans.findIndex((p) => p.name === currentSubscription.plan) <
                        plans.findIndex((p) => p.id === plan.id)
                          ? 'Upgrade'
                          : 'Downgrade'}
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full rounded-xl">
                        Contact Sales
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Recent Invoices */}
        <motion.div variants={itemVariants}>
          <Card className="rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Billing History
                  </CardTitle>
                  <CardDescription>View and download past invoices</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="rounded-lg">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 rounded-xl border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{formatCurrency(invoice.amount)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(invoice.date).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>
                    <Button variant="ghost" size="sm" className="rounded-lg">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Accordion */}
        <motion.div variants={itemVariants}>
          <Accordion type="single" collapsible className="bg-white rounded-2xl border">
            <AccordionItem value="plans" className="border-none">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Crown className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="font-medium">Understanding Our Plans</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="pl-11 space-y-2 text-muted-foreground">
                  <p>
                    Our pricing is designed to scale with your business. All plans include core CRM
                    features with additional capabilities as you grow.
                  </p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>
                      <strong>Starter</strong>: Perfect for small teams just getting started
                    </li>
                    <li>
                      <strong>Business</strong>: Ideal for growing companies needing advanced
                      features
                    </li>
                    <li>
                      <strong>Enterprise</strong>: Custom solutions for large organizations
                    </li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="billing" className="border-none">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium">Billing & Payment</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="pl-11 space-y-2 text-muted-foreground">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Payments are processed securely via Razorpay</li>
                    <li>We accept all major credit/debit cards and UPI</li>
                    <li>Annual plans get a 17% discount</li>
                    <li>Invoices are generated automatically each billing cycle</li>
                    <li>GST is applicable for Indian customers</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq" className="border-none">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <HelpCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium">Frequently Asked Questions</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="pl-11 space-y-3 text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground">Can I upgrade mid-cycle?</p>
                    <p className="text-sm">
                      Yes, you can upgrade anytime. You'll only pay the prorated difference.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">What happens if I cancel?</p>
                    <p className="text-sm">
                      You'll retain access until the end of your billing period. Data is preserved
                      for 30 days.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Can I add more seats?</p>
                    <p className="text-sm">
                      Additional seats can be purchased. Contact support for custom seat packages.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>

        {/* Upgrade Dialog */}
        <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>Upgrade to {selectedPlan?.name}</DialogTitle>
              <DialogDescription>Your plan will be upgraded immediately</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-muted">
                <div className="flex justify-between mb-2">
                  <span>New plan</span>
                  <span className="font-medium">{selectedPlan?.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Price</span>
                  <span className="font-medium">
                    {selectedPlan?.price.monthly &&
                      formatCurrency(
                        billingCycle === 'monthly'
                          ? selectedPlan.price.monthly
                          : selectedPlan.price.yearly / 12
                      )}
                    /month
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span>Due today (prorated)</span>
                  <span className="font-medium">
                    {selectedPlan?.price.monthly &&
                      formatCurrency(
                        (billingCycle === 'monthly'
                          ? selectedPlan.price.monthly
                          : selectedPlan.price.yearly / 12) - currentSubscription.price
                      )}
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowUpgradeDialog(false)}>Confirm Upgrade</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cancel Dialog */}
        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
              <AlertDialogDescription>
                <div className="space-y-4">
                  <p>
                    Your subscription will remain active until{' '}
                    {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}. After
                    that, you'll lose access to:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      All premium features
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      Team members beyond free tier
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      Stored data after 30 days
                    </li>
                  </ul>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => setShowCancelDialog(false)}
              >
                Cancel Subscription
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </HubLayout>
  );
}
