'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Terminal,
  Copy,
  Check,
  Code2,
  Download,
  ExternalLink,
  FileJson,
  Package,
  Search,
  BookOpen,
  Zap,
  Github,
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

const codeExamples = {
  javascript: `// Install: npm install @nexora/sdk

import { Nexora } from '@nexora/sdk';

const client = new Nexora({
  apiKey: 'your_api_key'
});

// Get contacts
const contacts = await client.contacts.list();

// Send message
await client.messages.send({
  to: '+919876543210',
  channel: 'whatsapp',
  content: 'Hello from Nexora!'
});`,
  python: `# Install: pip install nexora-sdk

from nexora import Nexora

client = Nexora(api_key='your_api_key')

# Get contacts
contacts = client.contacts.list()

# Send message
client.messages.send(
    to='+919876543210',
    channel='whatsapp',
    content='Hello from Nexora!'
)`,
  curl: `# List contacts
curl -X GET "https://api.nexoraos.pro/api/v1/contacts" \\
  -H "Authorization: Bearer YOUR_API_KEY"

# Send message
curl -X POST "https://api.nexoraos.pro/api/v1/messages" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+919876543210",
    "channel": "whatsapp",
    "content": "Hello from Nexora!"
  }'`,
};

const sdks = [
  {
    id: 'javascript',
    name: 'JavaScript SDK',
    description: 'For Node.js and browser applications',
    version: 'v2.3.1',
    color: 'yellow',
    icon: Code2,
    package: 'npm install @nexora/sdk',
  },
  {
    id: 'python',
    name: 'Python SDK',
    description: 'For Python applications',
    version: 'v1.5.0',
    color: 'blue',
    icon: Code2,
    package: 'pip install nexora-sdk',
  },
  {
    id: 'php',
    name: 'PHP SDK',
    description: 'For PHP applications',
    version: 'v1.2.0',
    color: 'purple',
    icon: Code2,
    package: 'composer require nexora/sdk',
  },
  {
    id: 'rest',
    name: 'REST API',
    description: 'Direct API access for any language',
    version: 'v1',
    color: 'green',
    icon: FileJson,
    package: null,
  },
];

export default function SDKPage() {
  const [copied, setCopied] = useState(null);
  const [activeTab, setActiveTab] = useState('javascript');

  const handleCopy = (key) => {
    navigator.clipboard.writeText(codeExamples[key]);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

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
          <h1 className="text-2xl font-bold tracking-tight">SDK & Libraries</h1>
          <p className="text-muted-foreground">Integrate Nexora into your applications</p>
        </div>
        <Button variant="outline">
          <ExternalLink className="mr-2 h-4 w-4" />
          View Docs
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">{sdks.length}</p>
              <p className="text-xs text-blue-600/80">SDKs Available</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Terminal className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-900">50+</p>
              <p className="text-xs text-green-600/80">API Endpoints</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-4 border border-purple-200/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-900">100+</p>
              <p className="text-xs text-purple-600/80">Code Examples</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Github className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-900">Open</p>
              <p className="text-xs text-amber-600/80">Source SDKs</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Start */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Start
            </CardTitle>
            <CardDescription>Get started with our SDKs in minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-gray-100/80 mb-4">
                <TabsTrigger
                  value="javascript"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-medium data-[state=active]:shadow-sm"
                >
                  JavaScript
                </TabsTrigger>
                <TabsTrigger
                  value="python"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-medium data-[state=active]:shadow-sm"
                >
                  Python
                </TabsTrigger>
                <TabsTrigger
                  value="curl"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-medium data-[state=active]:shadow-sm"
                >
                  cURL
                </TabsTrigger>
              </TabsList>
              {Object.entries(codeExamples).map(([key, code]) => (
                <TabsContent key={key} value={key}>
                  <div className="relative">
                    <pre className="p-4 rounded-xl bg-gray-900 text-gray-100 text-sm overflow-x-auto">
                      <code>{code}</code>
                    </pre>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-3 right-3 bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={() => handleCopy(key)}
                    >
                      {copied === key ? (
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
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Available SDKs */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="text-lg font-semibold">Available SDKs</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {sdks.map((sdk) => {
            const Icon = sdk.icon;
            const colorClasses = {
              yellow: {
                bg: 'bg-gradient-to-br from-yellow-100 to-amber-50',
                icon: 'text-yellow-600',
                border: 'border-yellow-200/50',
              },
              blue: {
                bg: 'bg-gradient-to-br from-blue-100 to-indigo-50',
                icon: 'text-blue-600',
                border: 'border-blue-200/50',
              },
              purple: {
                bg: 'bg-gradient-to-br from-purple-100 to-violet-50',
                icon: 'text-purple-600',
                border: 'border-purple-200/50',
              },
              green: {
                bg: 'bg-gradient-to-br from-green-100 to-emerald-50',
                icon: 'text-green-600',
                border: 'border-green-200/50',
              },
            };
            const colors = colorClasses[sdk.color];

            return (
              <Card key={sdk.id} className="rounded-2xl hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-12 w-12 rounded-xl ${colors.bg} flex items-center justify-center`}
                      >
                        <Icon className={`h-6 w-6 ${colors.icon}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{sdk.name}</h3>
                        <p className="text-sm text-muted-foreground">{sdk.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{sdk.version}</Badge>
                          {sdk.package && (
                            <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                              {sdk.package}
                            </code>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {sdk.package ? (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Install
                        </>
                      ) : (
                        <>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Docs
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>

      {/* Resources */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Resources</CardTitle>
            <CardDescription>Everything you need to build with Nexora</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <a
                href="#"
                className="p-4 rounded-xl border bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50 hover:shadow-md transition-all group"
              >
                <Terminal className="h-8 w-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-medium text-blue-900">API Reference</h4>
                <p className="text-sm text-blue-700/70">Complete API documentation</p>
              </a>
              <a
                href="#"
                className="p-4 rounded-xl border bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200/50 hover:shadow-md transition-all group"
              >
                <Package className="h-8 w-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-medium text-purple-900">Code Examples</h4>
                <p className="text-sm text-purple-700/70">Sample integrations and use cases</p>
              </a>
              <a
                href="#"
                className="p-4 rounded-xl border bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50 hover:shadow-md transition-all group"
              >
                <Code2 className="h-8 w-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-medium text-green-900">GitHub</h4>
                <p className="text-sm text-green-700/70">Open source SDKs</p>
              </a>
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
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium">What are Nexora SDKs?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <div className="pl-11 space-y-2 text-muted-foreground">
                <p>
                  Nexora SDKs are official libraries that make it easy to integrate Nexora into your
                  applications. They handle authentication, request formatting, and error handling.
                </p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Type-safe interfaces for all API endpoints</li>
                  <li>Built-in retry logic and error handling</li>
                  <li>Automatic request signing and authentication</li>
                  <li>Comprehensive documentation and examples</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="auth" className="border-none">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Terminal className="h-4 w-4 text-green-600" />
                </div>
                <span className="font-medium">Authentication</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <div className="pl-11 space-y-2 text-muted-foreground">
                <p>All API requests require authentication using an API key:</p>
                <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto mt-2">
                  {`// Include in request headers
Authorization: Bearer YOUR_API_KEY

// Or initialize SDK with key
const client = new Nexora({ apiKey: 'YOUR_API_KEY' });`}
                </pre>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="rate-limits" className="border-none">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-purple-600" />
                </div>
                <span className="font-medium">Rate Limits</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <div className="pl-11 space-y-2 text-muted-foreground">
                <ul className="list-disc list-inside space-y-1">
                  <li>Standard plan: 1,000 requests per minute</li>
                  <li>Professional plan: 5,000 requests per minute</li>
                  <li>Enterprise plan: Unlimited (with fair use policy)</li>
                  <li>Rate limit headers included in all responses</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>
    </motion.div>
  );
}
