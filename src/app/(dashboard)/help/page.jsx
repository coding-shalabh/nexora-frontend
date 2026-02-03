'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  BookOpen,
  Users,
  Building2,
  DollarSign,
  Ticket,
  Mail,
  Settings,
  Shield,
  BarChart3,
  Zap,
  HelpCircle,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Phone,
  Video,
  FileText,
  Target,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lightbulb,
  Play,
  Globe,
  Loader2,
  FolderOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { useKBStats, useKBCategories, useKBArticles } from '@/hooks/use-knowledge-base';

// Icon mapping for categories
const categoryIcons = {
  'getting-started': Play,
  contacts: Users,
  deals: DollarSign,
  activities: CheckCircle2,
  tickets: Ticket,
  email: Mail,
  automation: Zap,
  reports: BarChart3,
  settings: Settings,
  default: FolderOpen,
};

// Color mapping for categories
const categoryColors = {
  'getting-started': 'bg-green-500',
  contacts: 'bg-blue-500',
  deals: 'bg-purple-500',
  activities: 'bg-orange-500',
  tickets: 'bg-red-500',
  email: 'bg-cyan-500',
  automation: 'bg-yellow-500',
  reports: 'bg-primary',
  settings: 'bg-gray-500',
  default: 'bg-primary',
};

// Frequently Asked Questions
const faqs = [
  {
    question: 'How do I import contacts from another CRM?',
    answer:
      'You can import contacts via CSV file. Go to Contacts > Import, download our template, fill in your data, and upload. We support imports from HubSpot, Salesforce, Zoho, and most other CRMs.',
  },
  {
    question: 'What is lead scoring and how does it work?',
    answer:
      'Lead scoring automatically assigns a score (0-100) to contacts based on their engagement and fit. Higher scores indicate more qualified leads. You can customize scoring rules in Settings > Lead Scoring.',
  },
  {
    question: 'How do I connect my email account?',
    answer:
      'Go to Settings > Email Integration and click "Connect Email". We support Gmail, Outlook, and other IMAP/SMTP providers. Once connected, emails are automatically logged to contact records.',
  },
  {
    question: 'Can I customize the deal pipeline stages?',
    answer:
      'Yes! Go to Settings > Pipeline and you can add, edit, reorder, or delete stages. You can also create multiple pipelines for different sales processes.',
  },
  {
    question: 'How do I set up workflow automation?',
    answer:
      'Navigate to Automation > Workflows and click "Create Workflow". Choose a trigger (e.g., new contact created), add conditions, and define actions (e.g., send email, create task).',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes, we use enterprise-grade security including 256-bit SSL encryption, SOC 2 compliance, and regular security audits. Your data is backed up daily and stored in secure data centers.',
  },
  {
    question: 'How do I add team members?',
    answer:
      'Go to Settings > Team and click "Invite Member". Enter their email address and select their role. They will receive an invitation email to join your workspace.',
  },
  {
    question: 'Can I use Nexora on mobile?',
    answer:
      'Yes! Nexora is fully responsive and works on any device. We also have native iOS and Android apps available on the App Store and Google Play.',
  },
];

// Video tutorials
const videoTutorials = [
  { id: 'v1', title: 'Nexora Quick Start Guide', duration: '5:32', thumbnail: '/help/video-1.jpg' },
  {
    id: 'v2',
    title: 'Managing Contacts Effectively',
    duration: '8:15',
    thumbnail: '/help/video-2.jpg',
  },
  { id: 'v3', title: 'Sales Pipeline Mastery', duration: '12:45', thumbnail: '/help/video-3.jpg' },
  {
    id: 'v4',
    title: 'Automation Best Practices',
    duration: '10:20',
    thumbnail: '/help/video-4.jpg',
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('knowledge-base');

  // Fetch real data from KB API
  const { data: stats, isLoading: statsLoading } = useKBStats();
  const { data: categoriesData, isLoading: categoriesLoading } = useKBCategories({
    isPublished: true,
  });
  const { data: articlesData, isLoading: articlesLoading } = useKBArticles({
    isPublished: true,
    orderBy: 'popular',
    limit: 50,
  });

  const isLoading = statsLoading || categoriesLoading || articlesLoading;
  const categories = categoriesData || [];
  const articles = articlesData?.articles || [];

  // Group articles by category
  const categoriesWithArticles = useMemo(() => {
    return categories.map((cat) => ({
      ...cat,
      icon: categoryIcons[cat.slug] || categoryIcons.default,
      color: categoryColors[cat.slug] || categoryColors.default,
      articles: articles.filter((a) => a.categoryId === cat.id),
    }));
  }, [categories, articles]);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categoriesWithArticles;

    const query = searchQuery.toLowerCase();
    return categoriesWithArticles
      .map((category) => ({
        ...category,
        articles: category.articles.filter(
          (article) =>
            article.title.toLowerCase().includes(query) ||
            category.name.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.articles.length > 0);
  }, [searchQuery, categoriesWithArticles]);

  // Filter FAQs based on search
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;

    const query = searchQuery.toLowerCase();
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const totalArticles = stats?.totalArticles || articles.length;
  const totalCategories = stats?.totalCategories || categories.length;

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10 p-8 md:p-12"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Help Center</h1>
              <p className="text-muted-foreground">Find answers and learn how to use Nexora</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for help articles, tutorials, FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 h-14 text-lg bg-background/80 backdrop-blur-sm border-border/50"
              />
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                </span>
              ) : (
                <>
                  <span>{totalArticles} articles</span>
                  <span>•</span>
                  <span>{totalCategories} categories</span>
                  <span>•</span>
                  <span>{faqs.length} FAQs</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-3xl" />
      </motion.div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Card className="cursor-pointer hover:border-primary/50 transition-colors">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Play className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="font-medium">Quick Start</p>
                <p className="text-xs text-muted-foreground">5 min guide</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Card className="cursor-pointer hover:border-primary/50 transition-colors">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Video className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium">Video Tutorials</p>
                <p className="text-xs text-muted-foreground">Watch & learn</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Card className="cursor-pointer hover:border-primary/50 transition-colors">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <MessageSquare className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="font-medium">Contact Support</p>
                <p className="text-xs text-muted-foreground">Get help</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Card className="cursor-pointer hover:border-primary/50 transition-colors">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Sparkles className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="font-medium">What's New</p>
                <p className="text-xs text-muted-foreground">Latest updates</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="knowledge-base" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="faq" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="videos" className="gap-2">
            <Video className="h-4 w-4" />
            Video Tutorials
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Contact Support
          </TabsTrigger>
        </TabsList>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge-base" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : searchQuery && filteredCategories.length === 0 ? (
            <Card className="p-12 text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try different keywords or browse categories below
              </p>
            </Card>
          ) : filteredCategories.length === 0 ? (
            <Card className="p-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No articles yet</h3>
              <p className="text-muted-foreground">Knowledge base articles will appear here</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className={cn('p-2 rounded-lg', category.color)}>
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{category.name}</CardTitle>
                            <CardDescription>{category.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {category.articles.length === 0 ? (
                          <p className="text-sm text-muted-foreground py-4">
                            No articles in this category
                          </p>
                        ) : (
                          <>
                            <ul className="space-y-2">
                              {category.articles.slice(0, 4).map((article) => (
                                <li key={article.id}>
                                  <Link
                                    href={`/help/article/${article.slug || article.id}`}
                                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted transition-colors group"
                                  >
                                    <span className="text-sm group-hover:text-primary transition-colors">
                                      {article.title}
                                    </span>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </Link>
                                </li>
                              ))}
                            </ul>
                            {category.articles.length > 4 && (
                              <Link
                                href={`/help/category/${category.slug || category.id}`}
                                className="flex items-center gap-1 text-sm text-primary mt-3 hover:underline"
                              >
                                View all {category.articles.length} articles
                                <ArrowRight className="h-4 w-4" />
                              </Link>
                            )}
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Quick answers to common questions about Nexora</CardDescription>
            </CardHeader>
            <CardContent>
              {searchQuery && filteredFaqs.length === 0 ? (
                <div className="p-8 text-center">
                  <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No matching FAQs</h3>
                  <p className="text-muted-foreground">Try different keywords or contact support</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left hover:no-underline">
                        <span className="hover:text-primary transition-colors">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videoTutorials.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-500/20 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="p-4 rounded-full bg-white/90 shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="h-8 w-8 text-primary fill-primary" />
                      </div>
                    </div>
                    <Badge className="absolute top-3 right-3 bg-black/70">{video.duration}</Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Contact Support Tab */}
        <TabsContent value="contact" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="p-4 rounded-full bg-blue-500/10 w-fit mx-auto mb-4">
                  <Mail className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get help via email within 24 hours
                </p>
                <Button variant="outline" className="w-full">
                  support@crm360.com
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="p-4 rounded-full bg-green-500/10 w-fit mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Chat with our support team in real-time
                </p>
                <Button className="w-full">Start Chat</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="p-4 rounded-full bg-purple-500/10 w-fit mx-auto mb-4">
                  <Phone className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="font-semibold mb-2">Phone Support</h3>
                <p className="text-sm text-muted-foreground mb-4">Available Mon-Fri, 9AM-6PM IST</p>
                <Button variant="outline" className="w-full">
                  +91 1800-XXX-XXXX
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Submit a Support Ticket</CardTitle>
              <CardDescription>
                Can't find what you're looking for? Create a support ticket and we'll help you out.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Input placeholder="Brief description of your issue" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                      <option value="">Select a category</option>
                      <option value="technical">Technical Issue</option>
                      <option value="billing">Billing & Account</option>
                      <option value="feature">Feature Request</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
                    placeholder="Please describe your issue in detail..."
                  />
                </div>
                <Button type="submit">Submit Ticket</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tips Section */}
      <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-500/20">
              <Lightbulb className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Pro Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Use keyboard shortcuts: Press{' '}
                  <kbd className="px-1.5 py-0.5 bg-muted rounded border text-xs">
                    Cmd/Ctrl + K
                  </kbd>{' '}
                  to open global search
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Set up email integration to automatically log all communications
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Use filters and saved views to quickly access frequently needed data
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Enable notifications to stay updated on important activities
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
