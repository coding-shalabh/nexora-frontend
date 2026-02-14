'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UnifiedLayout } from '@/components/layout/unified';
import {
  FileCode,
  Copy,
  Check,
  Globe,
  Eye,
  MousePointer,
  Clock,
  BarChart3,
  Code,
  Search,
  Plus,
  Trash2,
  Shield,
  Zap,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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

export default function TrackingPage() {
  const [copied, setCopied] = useState(false);

  const trackingCode = `<!-- Nexora Tracking Script -->
<script>
  (function(n,e,x,o,r,a){n.NexoraObject=r;n[r]=n[r]||function(){
  (n[r].q=n[r].q||[]).push(arguments)};n[r].l=1*new Date();
  a=e.createElement(x);a.async=1;a.src=o;
  e.head.appendChild(a)})(window,document,'script',
  'https://cdn.nexoraos.pro/tracking.js','nexora');

  nexora('init', 'YOUR_TRACKING_ID');
  nexora('track', 'pageview');
</script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <UnifiedLayout hubId="settings" pageTitle="Tracking Scripts" fixedMenu={null}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 space-y-6 p-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tracking Scripts</h1>
            <p className="text-muted-foreground">Track website visitors and their behavior</p>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
            <div className="h-2 w-2 rounded-full bg-green-600 mr-2" />
            Active
          </Badge>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">12.5K</p>
                <p className="text-xs text-blue-600/80">Page Views</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <MousePointer className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-900">3.2K</p>
                <p className="text-xs text-green-600/80">Unique Visitors</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-4 border border-purple-200/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-900">4:32</p>
                <p className="text-xs text-purple-600/80">Avg. Session</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-900">45%</p>
                <p className="text-xs text-amber-600/80">Bounce Rate</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tracking Code */}
        <motion.div variants={itemVariants}>
          <Card className="rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Installation
                  </CardTitle>
                  <CardDescription>Add this code to your website</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <pre className="p-4 rounded-xl bg-gray-900 text-gray-100 text-sm overflow-x-auto">
                  <code>{trackingCode}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-3 right-3 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50">
                <p className="text-sm text-blue-800">
                  Add this script to the{' '}
                  <code className="bg-blue-100 px-1 rounded">&lt;head&gt;</code> section of your
                  website, before the closing{' '}
                  <code className="bg-blue-100 px-1 rounded">&lt;/head&gt;</code> tag.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings */}
        <motion.div variants={itemVariants}>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Tracking Settings</CardTitle>
              <CardDescription>Configure what data to collect</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Track Page Views</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically track when visitors view pages
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <MousePointer className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Track Clicks</p>
                    <p className="text-sm text-muted-foreground">Track button and link clicks</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <FileCode className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Track Form Submissions</p>
                    <p className="text-sm text-muted-foreground">Track when forms are submitted</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">Track Scroll Depth</p>
                    <p className="text-sm text-muted-foreground">Track how far visitors scroll</p>
                  </div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Domains */}
        <motion.div variants={itemVariants}>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Allowed Domains</CardTitle>
              <CardDescription>Domains where tracking is allowed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="example.com" className="pl-9" />
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Domain
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-4 rounded-xl border bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <span className="font-medium">nexoraos.pro</span>
                      <p className="text-xs text-muted-foreground">Added Jan 1, 2024</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Primary</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <span className="font-medium">app.nexoraos.pro</span>
                      <p className="text-xs text-muted-foreground">Added Jan 5, 2024</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Accordion */}
        <motion.div variants={itemVariants}>
          <Accordion type="single" collapsible className="bg-white rounded-2xl border">
            <AccordionItem value="about" className="border-none">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileCode className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium">What is Website Tracking?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="pl-11 space-y-2 text-muted-foreground">
                  <p>
                    Website tracking allows you to understand how visitors interact with your
                    website. The tracking script collects anonymous data about page views, clicks,
                    and user behavior.
                  </p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Identify which pages are most popular</li>
                    <li>Understand user flow through your site</li>
                    <li>Track form submissions and conversions</li>
                    <li>Attribute leads to specific marketing campaigns</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="privacy" className="border-none">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium">Privacy & Compliance</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="pl-11 space-y-2 text-muted-foreground">
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      Data is collected anonymously without personally identifiable information
                    </li>
                    <li>Compliant with GDPR and CCPA regulations</li>
                    <li>You own all collected data</li>
                    <li>Data is stored securely and encrypted</li>
                    <li>Users can opt-out of tracking if required</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="events" className="border-none">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="font-medium">Custom Events</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="pl-11 space-y-2 text-muted-foreground">
                  <p>You can track custom events using the JavaScript API:</p>
                  <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto mt-2">
                    {`// Track custom event
nexora('track', 'button_click', {
  button_id: 'signup-btn',
  page: '/pricing'
});

// Track conversion
nexora('track', 'purchase', {
  value: 99.99,
  currency: 'USD'
});`}
                  </pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </motion.div>
    </UnifiedLayout>
  );
}
