'use client';

import { useState } from 'react';
import { Settings, CreditCard, Truck, Receipt, Bell, Globe, Shield, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

const settingsSections = [
  {
    id: 'payment',
    title: 'Payment Settings',
    description: 'Configure payment methods and gateways',
    icon: CreditCard,
  },
  {
    id: 'shipping',
    title: 'Shipping Settings',
    description: 'Manage shipping zones and rates',
    icon: Truck,
  },
  {
    id: 'tax',
    title: 'Tax Settings',
    description: 'Configure tax rates and regions',
    icon: Percent,
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Order and inventory alerts',
    icon: Bell,
  },
];

export default function CommerceSettingsPage() {
  const [autoInvoice, setAutoInvoice] = useState(true);
  const [lowStockAlert, setLowStockAlert] = useState(true);
  const [orderNotifications, setOrderNotifications] = useState(true);

  const stats = [
    createStat('Settings', settingsSections.length, Settings, 'primary'),
    createStat('Payment Methods', 3, CreditCard, 'green'),
    createStat('Shipping Zones', 5, Truck, 'blue'),
    createStat('Tax Rates', 2, Percent, 'amber'),
  ];

  return (
    <HubLayout
      hubId="commerce"
      title="Commerce Settings"
      description="Configure your commerce preferences"
      stats={stats}
      showFixedMenu={false}
    >
      <div className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {settingsSections.map((section) => (
            <Card
              key={section.id}
              className="cursor-pointer hover:border-primary/50 transition-colors"
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <section.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Settings</CardTitle>
            <CardDescription>Common commerce preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-generate Invoices</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically create invoices for new orders
                </p>
              </div>
              <Switch checked={autoInvoice} onCheckedChange={setAutoInvoice} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Low Stock Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when inventory is running low
                </p>
              </div>
              <Switch checked={lowStockAlert} onCheckedChange={setLowStockAlert} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Order Notifications</Label>
                <p className="text-sm text-muted-foreground">Email notifications for new orders</p>
              </div>
              <Switch checked={orderNotifications} onCheckedChange={setOrderNotifications} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Store Information
            </CardTitle>
            <CardDescription>Your commerce store details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground">Store Name</p>
                <p className="font-medium">Nexora Commerce</p>
              </div>
              <div className="p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground">Default Currency</p>
                <p className="font-medium">USD ($)</p>
              </div>
              <div className="p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground">Timezone</p>
                <p className="font-medium">UTC-5 (EST)</p>
              </div>
              <div className="p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium text-green-600">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </HubLayout>
  );
}
