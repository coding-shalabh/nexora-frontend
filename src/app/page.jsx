'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Users,
  MessageSquare,
  TrendingUp,
  Megaphone,
  Ticket,
  FolderKanban,
  BarChart3,
  Zap,
  Mail,
  Phone,
  Globe,
  Briefcase,
  Video,
  CreditCard,
  DollarSign,
  ShoppingCart,
  FileText,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      id: 'crm',
      icon: Users,
      title: 'CRM & Contact Management',
      description: 'Manage contacts, companies, leads, and deals in one unified platform',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'inbox',
      icon: MessageSquare,
      title: 'Unified Inbox',
      description: 'Email, WhatsApp, SMS, and Voice in one intelligent inbox',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'sales',
      icon: TrendingUp,
      title: 'Sales Pipeline',
      description: 'Visual pipeline, deal tracking, quotes, and revenue forecasting',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'marketing',
      icon: Megaphone,
      title: 'Marketing Automation',
      description: 'Campaigns, broadcasts, segments, and automated sequences',
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 'support',
      icon: Ticket,
      title: 'Customer Support',
      description: 'Ticketing system, knowledge base, and customer surveys',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      id: 'projects',
      icon: FolderKanban,
      title: 'Project Management',
      description: 'Projects, tasks, calendar, and team collaboration',
      color: 'from-teal-500 to-cyan-500',
    },
    {
      id: 'analytics',
      icon: BarChart3,
      title: 'Analytics & Reporting',
      description: 'Real-time dashboards, visitor tracking, and business insights',
      color: 'from-pink-500 to-rose-500',
    },
    {
      id: 'automation',
      icon: Zap,
      title: 'Workflow Automation',
      description: 'Automate repetitive tasks and streamline your processes',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  const whatWeDoTabs = [
    {
      value: 'crm',
      label: 'CRM',
      title: 'Complete Customer Relationship Management',
      content: [
        {
          feature: 'Contact Management',
          description: 'Store unlimited contacts with custom fields, tags, and segments',
        },
        {
          feature: 'Company Profiles',
          description: 'Track organizations with hierarchies, deals, and relationships',
        },
        {
          feature: 'Lead Scoring',
          description: 'Automatic lead scoring based on behavior and engagement',
        },
        {
          feature: 'Activity Tracking',
          description: 'Log emails, calls, meetings, and notes automatically',
        },
        {
          feature: 'Custom Fields',
          description: 'Create unlimited custom fields for any data you need',
        },
      ],
    },
    {
      value: 'communication',
      label: 'Communication',
      title: 'Multi-Channel Communication Hub',
      content: [
        {
          feature: 'Email Integration',
          description: 'Connect Gmail, Outlook, or any SMTP server',
        },
        {
          feature: 'WhatsApp Business',
          description: 'Send and receive WhatsApp messages via MSG91 integration',
        },
        {
          feature: 'SMS Campaigns',
          description: 'Bulk SMS with delivery tracking and templates',
        },
        {
          feature: 'Voice & Dialer',
          description: 'Make calls directly from the platform with TeleCMI',
        },
        {
          feature: 'Shared Inboxes',
          description: 'Team collaboration on customer communications',
        },
      ],
    },
    {
      value: 'sales',
      label: 'Sales',
      title: 'Visual Sales Pipeline Management',
      content: [
        {
          feature: 'Deal Pipeline',
          description: 'Drag-and-drop deals through customizable stages',
        },
        {
          feature: 'Quote Builder',
          description: 'Create professional quotes with line items and taxes',
        },
        {
          feature: 'Product Catalog',
          description: 'Manage products with pricing, SKUs, and variations',
        },
        {
          feature: 'Revenue Forecasting',
          description: 'Predict revenue based on pipeline probability',
        },
        {
          feature: 'Billing & Invoices',
          description: 'Generate invoices and track payments',
        },
      ],
    },
    {
      value: 'marketing',
      label: 'Marketing',
      title: 'Marketing Automation & Campaigns',
      content: [
        {
          feature: 'Email Campaigns',
          description: 'Design and send beautiful email campaigns',
        },
        {
          feature: 'Broadcast Messages',
          description: 'Send bulk WhatsApp, SMS, or email to segments',
        },
        {
          feature: 'Contact Segments',
          description: 'Create dynamic segments based on behavior and attributes',
        },
        {
          feature: 'Automated Sequences',
          description: 'Set up drip campaigns and nurture sequences',
        },
        {
          feature: 'Landing Pages',
          description: 'Build conversion-optimized landing pages',
        },
      ],
    },
    {
      value: 'support',
      label: 'Support',
      title: 'Customer Support & Service',
      content: [
        {
          feature: 'Ticket Management',
          description: 'Track support tickets from creation to resolution',
        },
        {
          feature: 'Knowledge Base',
          description: 'Build a self-service help center for customers',
        },
        {
          feature: 'Customer Surveys',
          description: 'Collect feedback with customizable surveys',
        },
        {
          feature: 'SLA Management',
          description: 'Set and track service level agreements',
        },
        {
          feature: 'Multi-Agent Support',
          description: 'Assign tickets to team members based on skills',
        },
      ],
    },
    {
      value: 'automation',
      label: 'Automation',
      title: 'Workflow Automation Engine',
      content: [
        {
          feature: 'Visual Workflow Builder',
          description: 'Create workflows with drag-and-drop interface',
        },
        {
          feature: 'Trigger-Based Actions',
          description: 'Automate actions based on customer behavior',
        },
        {
          feature: 'Email Automation',
          description: 'Send automated emails based on triggers',
        },
        {
          feature: 'Task Automation',
          description: 'Automatically create tasks and reminders',
        },
        {
          feature: 'Integration Workflows',
          description: 'Connect with third-party apps via webhooks',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Nexora
              </div>
              <span className="text-sm text-gray-600">Business OS</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Your Complete
              <br />
              Business Operating System
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              CRM, Sales, Marketing, Support, Projects, and Communication—all in one powerful
              platform. Built for teams that want to move fast.
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/signup">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/support">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Watch Demo
                </Button>
              </Link>
            </motion.div>

            {/* Floating Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {[
                { value: '10,000+', label: 'Active Users' },
                { value: '50M+', label: 'Messages Sent' },
                { value: '99.9%', label: 'Uptime' },
                { value: '24/7', label: 'Support' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white"
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Everything You Need to Grow
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              All-in-one platform with powerful features to manage your entire business
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                onHoverStart={() => setHoveredFeature(feature.id)}
                onHoverEnd={() => setHoveredFeature(null)}
              >
                <Card
                  className={`h-full border-2 transition-all duration-300 ${
                    hoveredFeature === feature.id
                      ? 'border-transparent shadow-2xl'
                      : 'border-gray-200 shadow-lg'
                  }`}
                >
                  <CardContent className="p-6">
                    <motion.div
                      className={`mb-4 rounded-2xl p-4 bg-gradient-to-br ${feature.color} inline-block`}
                      animate={
                        hoveredFeature === feature.id
                          ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }
                          : { scale: 1, rotate: 0 }
                      }
                      transition={{ duration: 0.5 }}
                    >
                      <feature.icon className="w-12 h-12 text-white" strokeWidth={2} />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do - Tabs Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              What We Do
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive suite of business tools
            </p>
          </motion.div>

          <Tabs defaultValue="crm" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 gap-2 bg-transparent h-auto mb-8">
              {whatWeDoTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white px-6 py-3 rounded-lg transition-all"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {whatWeDoTabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="mt-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid md:grid-cols-2 gap-8"
                >
                  {/* Left Side - Content */}
                  <div className="space-y-6">
                    <h3 className="text-3xl font-bold text-gray-900">{tab.title}</h3>
                    <div className="space-y-4">
                      {tab.content.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-600"
                        >
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">
                            {item.feature}
                          </h4>
                          <p className="text-gray-600">{item.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Right Side - Visual/Illustration */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center justify-center"
                  >
                    <div className="relative w-full h-96 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-3xl shadow-2xl overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 90, 0],
                        }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          className="p-12 rounded-full bg-white/30 backdrop-blur-sm"
                          animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        >
                          {(() => {
                            const IconComponent =
                              features.find((f) => f.id === tab.value)?.icon || Sparkles;
                            return (
                              <IconComponent className="w-32 h-32 text-white" strokeWidth={1.5} />
                            );
                          })()}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Powerful Integrations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with tools you already use
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              { name: 'Gmail', icon: Mail, color: 'from-red-500 to-pink-500' },
              { name: 'WhatsApp', icon: MessageSquare, color: 'from-green-500 to-emerald-500' },
              { name: 'Outlook', icon: Mail, color: 'from-blue-500 to-cyan-500' },
              { name: 'Slack', icon: Briefcase, color: 'from-purple-500 to-pink-500' },
              { name: 'Zoom', icon: Video, color: 'from-blue-600 to-indigo-600' },
              { name: 'Stripe', icon: CreditCard, color: 'from-purple-600 to-blue-600' },
              { name: 'PayPal', icon: DollarSign, color: 'from-blue-500 to-sky-500' },
              { name: 'Shopify', icon: ShoppingCart, color: 'from-green-600 to-teal-600' },
              { name: 'WordPress', icon: Globe, color: 'from-gray-700 to-gray-900' },
              { name: 'Zapier', icon: Zap, color: 'from-orange-500 to-amber-500' },
              { name: 'SMS', icon: Phone, color: 'from-indigo-500 to-purple-500' },
              { name: 'Voice', icon: Phone, color: 'from-teal-500 to-cyan-500' },
            ].map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all"
              >
                <div className={`p-4 rounded-full bg-gradient-to-br ${integration.color} mb-3`}>
                  <integration.icon className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                <div className="text-sm font-medium text-gray-900">{integration.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-12 text-center text-white relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-white/10"
              animate={{
                scale: [1, 1.5, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of businesses already using Nexora to grow faster
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100"
                  >
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/support">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6 border-white text-white hover:bg-white/10"
                  >
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/features" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/integrations" className="hover:text-white transition-colors">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-white transition-colors">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="https://72orionx.com" className="hover:text-white transition-colors">
                    72orionx
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/docs" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/data-deletion" className="hover:text-white transition-colors">
                    Data Deletion
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm mb-4 md:mb-0">
              © 2026 72orionx Pvt Ltd. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-white transition-colors">
                LinkedIn
              </a>
              <a href="#" className="hover:text-white transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
