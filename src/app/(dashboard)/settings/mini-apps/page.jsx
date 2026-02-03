'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Smartphone,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  ExternalLink,
  Code,
  Palette,
  Globe,
  Lock,
  Search,
  Eye,
  Users,
  Layers,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

// Mock mini apps
const miniAppsData = [
  {
    id: 'app_1',
    name: 'Customer Portal',
    description: 'Self-service portal for customers',
    icon: '🏠',
    status: 'published',
    visits: 1250,
    url: 'https://portal.nexoraos.pro',
  },
  {
    id: 'app_2',
    name: 'Booking Widget',
    description: 'Appointment booking for website',
    icon: '📅',
    status: 'published',
    visits: 890,
    url: 'https://book.nexoraos.pro',
  },
  {
    id: 'app_3',
    name: 'Feedback Form',
    description: 'Collect customer feedback',
    icon: '📝',
    status: 'draft',
    visits: 0,
    url: null,
  },
];

const templates = [
  {
    id: 'portal',
    name: 'Customer Portal',
    icon: '🏠',
    description: 'Self-service customer dashboard',
    color: 'blue',
  },
  {
    id: 'booking',
    name: 'Booking System',
    icon: '📅',
    description: 'Appointment scheduling',
    color: 'green',
  },
  {
    id: 'form',
    name: 'Form Builder',
    icon: '📝',
    description: 'Custom forms and surveys',
    color: 'purple',
  },
  {
    id: 'catalog',
    name: 'Product Catalog',
    icon: '📦',
    description: 'Product showcase',
    color: 'amber',
  },
];

export default function MiniAppsPage() {
  const [activeTab, setActiveTab] = useState('apps');
  const [searchQuery, setSearchQuery] = useState('');

  const publishedApps = miniAppsData.filter((app) => app.status === 'published');
  const draftApps = miniAppsData.filter((app) => app.status === 'draft');
  const totalVisits = miniAppsData.reduce((sum, app) => sum + app.visits, 0);

  const filteredApps = miniAppsData.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 space-y-6 p-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mini Apps</h1>
          <p className="text-muted-foreground">Build lightweight apps for your customers</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create App
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">{miniAppsData.length}</p>
              <p className="text-xs text-blue-600/80">Total Apps</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Globe className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-900">{publishedApps.length}</p>
              <p className="text-xs text-green-600/80">Published</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-4 border border-purple-200/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Eye className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-900">{totalVisits.toLocaleString()}</p>
              <p className="text-xs text-purple-600/80">Total Visits</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Layers className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-900">{templates.length}</p>
              <p className="text-xs text-amber-600/80">Templates</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-gray-100/80">
              <TabsTrigger
                value="apps"
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-medium data-[state=active]:shadow-sm"
              >
                <Smartphone className="h-4 w-4" />
                My Apps
                <Badge variant="secondary" className="ml-1 bg-gray-200">
                  {miniAppsData.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="templates"
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-medium data-[state=active]:shadow-sm"
              >
                <Layers className="h-4 w-4" />
                Templates
              </TabsTrigger>
            </TabsList>

            {activeTab === 'apps' && (
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search apps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            )}
          </div>

          <TabsContent value="apps" className="space-y-4">
            {filteredApps.length === 0 ? (
              <Card className="rounded-2xl">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Smartphone className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No apps created yet</p>
                  <p className="text-sm">Create your first mini app to get started</p>
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Create App
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredApps.map((app) => (
                  <Card key={app.id} className="rounded-2xl hover:shadow-md transition-all group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center text-2xl">
                            {app.icon}
                          </div>
                          <div>
                            <CardTitle className="text-base flex items-center gap-2">
                              {app.name}
                            </CardTitle>
                            <CardDescription className="text-sm">{app.description}</CardDescription>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {app.status === 'published' ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              Published
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-500">
                              Draft
                            </Badge>
                          )}
                          <span className="text-sm text-muted-foreground">
                            {app.visits.toLocaleString()} visits
                          </span>
                        </div>
                        {app.url && (
                          <a
                            href={app.url}
                            target="_blank"
                            rel="noopener"
                            className="text-primary hover:underline flex items-center gap-1 text-sm"
                          >
                            <Globe className="h-3 w-3" />
                            View
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={`rounded-2xl cursor-pointer hover:shadow-md transition-all border-2 hover:border-${template.color}-300`}
                >
                  <CardContent className="pt-6 text-center">
                    <div
                      className={`h-16 w-16 rounded-2xl bg-gradient-to-br from-${template.color}-100 to-${template.color}-50 flex items-center justify-center text-3xl mx-auto mb-4`}
                    >
                      {template.icon}
                    </div>
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Features */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Mini App Features</CardTitle>
            <CardDescription>Everything you need to build customer-facing apps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <Code className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">No-Code Builder</p>
                    <p className="text-sm text-blue-700/70">Build apps without writing code</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200/50">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                    <Palette className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-purple-900">Custom Branding</p>
                    <p className="text-sm text-purple-700/70">Match your brand colors and logo</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                    <Lock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900">Secure Access</p>
                    <p className="text-sm text-green-700/70">Control who can access your apps</p>
                  </div>
                </div>
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
                  <Smartphone className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium">What are Mini Apps?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <div className="pl-11 space-y-2 text-muted-foreground">
                <p>
                  Mini Apps are lightweight, embeddable applications you can build for your
                  customers. They provide self-service capabilities without requiring customers to
                  contact support.
                </p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Customer portals for account management</li>
                  <li>Booking widgets for appointments</li>
                  <li>Feedback forms and surveys</li>
                  <li>Product catalogs and pricing pages</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="embed" className="border-none">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Code className="h-4 w-4 text-green-600" />
                </div>
                <span className="font-medium">Embedding Mini Apps</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <div className="pl-11 space-y-2 text-muted-foreground">
                <p>
                  You can embed mini apps on your website using an iframe or our JavaScript SDK:
                </p>
                <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto mt-2">
                  {`<!-- Embed as iframe -->
<iframe
  src="https://app.nexoraos.pro/embed/YOUR_APP_ID"
  width="100%"
  height="600"
></iframe>

<!-- Or use JavaScript SDK -->
<script src="https://cdn.nexoraos.pro/embed.js"></script>
<div id="nexora-app" data-app-id="YOUR_APP_ID"></div>`}
                </pre>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="access" className="border-none">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <span className="font-medium">Access Control</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <div className="pl-11 space-y-2 text-muted-foreground">
                <ul className="list-disc list-inside space-y-1">
                  <li>Public apps - accessible to anyone</li>
                  <li>Password protected - require a password to access</li>
                  <li>Contact authenticated - only logged-in contacts can access</li>
                  <li>Domain restricted - only accessible from specific domains</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>
    </motion.div>
  );
}
