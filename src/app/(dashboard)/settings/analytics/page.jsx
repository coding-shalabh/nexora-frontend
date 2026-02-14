'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Clock,
  MousePointer2,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Calendar,
  Download,
  Loader2,
  MapPin,
  ExternalLink,
  Search,
  Zap,
  Activity,
  Target,
} from 'lucide-react';
import { UnifiedLayout } from '@/components/layout/unified';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useAuth } from '@/contexts/auth-context';

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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.nexoraos.pro/api/v1';

export default function AnalyticsHubPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [selectedScript, setSelectedScript] = useState('all');
  const [scripts, setScripts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch tracking scripts
  const fetchScripts = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/tracking/scripts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setScripts(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching scripts:', error);
    }
  };

  // Fetch analytics data
  const fetchAnalytics = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const params = new URLSearchParams({ period: dateRange });
      if (selectedScript !== 'all') {
        params.append('scriptId', selectedScript);
      }

      const res = await fetch(`${API_BASE}/tracking/analytics?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScripts();
  }, [token]);

  useEffect(() => {
    fetchAnalytics();
  }, [token, dateRange, selectedScript]);

  // Mock data for demo
  const mockAnalytics = {
    overview: {
      visitors: { value: 12458, change: 12.5, trend: 'up' },
      pageViews: { value: 45892, change: 8.3, trend: 'up' },
      sessions: { value: 18234, change: -2.1, trend: 'down' },
      avgDuration: { value: '3m 24s', change: 5.7, trend: 'up' },
      bounceRate: { value: '42.3%', change: -3.2, trend: 'up' },
      pagesPerSession: { value: 2.52, change: 1.8, trend: 'up' },
    },
    topPages: [
      { path: '/', title: 'Home', views: 15234, visitors: 8542, avgTime: '2:45', bounceRate: 38 },
      {
        path: '/products',
        title: 'Products',
        views: 8456,
        visitors: 5234,
        avgTime: '4:12',
        bounceRate: 25,
      },
      {
        path: '/pricing',
        title: 'Pricing',
        views: 6234,
        visitors: 4123,
        avgTime: '3:30',
        bounceRate: 32,
      },
      {
        path: '/about',
        title: 'About Us',
        views: 4567,
        visitors: 3456,
        avgTime: '2:15',
        bounceRate: 45,
      },
      {
        path: '/contact',
        title: 'Contact',
        views: 3234,
        visitors: 2345,
        avgTime: '1:45',
        bounceRate: 55,
      },
    ],
    sources: [
      { source: 'Google', visitors: 5234, percentage: 42 },
      { source: 'Direct', visitors: 3456, percentage: 28 },
      { source: 'Facebook', visitors: 1567, percentage: 13 },
      { source: 'Twitter', visitors: 1234, percentage: 10 },
      { source: 'LinkedIn', visitors: 867, percentage: 7 },
    ],
    devices: [
      { type: 'Desktop', icon: Monitor, visitors: 7234, percentage: 58 },
      { type: 'Mobile', icon: Smartphone, visitors: 4234, percentage: 34 },
      { type: 'Tablet', icon: Tablet, visitors: 990, percentage: 8 },
    ],
    locations: [
      { country: 'India', visitors: 4567, percentage: 37 },
      { country: 'United States', visitors: 2345, percentage: 19 },
      { country: 'United Kingdom', visitors: 1234, percentage: 10 },
      { country: 'Germany', visitors: 987, percentage: 8 },
      { country: 'Canada', visitors: 756, percentage: 6 },
    ],
    browsers: [
      { name: 'Chrome', percentage: 64 },
      { name: 'Safari', percentage: 18 },
      { name: 'Firefox', percentage: 10 },
      { name: 'Edge', percentage: 6 },
      { name: 'Other', percentage: 2 },
    ],
    realtimeVisitors: 47,
    topEvents: [
      { name: 'button_click', count: 3456 },
      { name: 'form_submit', count: 1234 },
      { name: 'scroll_50', count: 8765 },
      { name: 'scroll_90', count: 2345 },
      { name: 'video_play', count: 567 },
    ],
  };

  const data = analytics || mockAnalytics;

  return (
    <UnifiedLayout hubId="settings" pageTitle="Analytics Hub" fixedMenu={null}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="h-full overflow-y-auto p-6 space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics Hub</h1>
            <p className="text-muted-foreground">Website analytics and visitor insights</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedScript} onValueChange={setSelectedScript}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All websites" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All websites</SelectItem>
                {scripts.map((script) => (
                  <SelectItem key={script.id} value={script.id}>
                    {script.domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="12m">Last 12 months</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={fetchAnalytics}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                <DropdownMenuItem>Export as JSON</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {/* Realtime Banner */}
        <motion.div variants={itemVariants}>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 h-3 w-3 bg-green-500 rounded-full animate-ping" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-green-700">{data.realtimeVisitors}</span>
                  <span className="ml-2 text-green-600">visitors right now</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-green-600">
                View realtime
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600/80">Total Visitors</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">
                      {data.overview.visitors.value.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {data.overview.visitors.trend === 'up' ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      <span
                        className={
                          data.overview.visitors.trend === 'up' ? 'text-green-500' : 'text-red-500'
                        }
                      >
                        {Math.abs(data.overview.visitors.change)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600/80">Page Views</p>
                    <p className="text-2xl font-bold text-green-900 mt-1">
                      {data.overview.pageViews.value.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {data.overview.pageViews.trend === 'up' ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      <span
                        className={
                          data.overview.pageViews.trend === 'up' ? 'text-green-500' : 'text-red-500'
                        }
                      >
                        {Math.abs(data.overview.pageViews.change)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-4 border border-purple-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600/80">Avg. Duration</p>
                    <p className="text-2xl font-bold text-purple-900 mt-1">
                      {data.overview.avgDuration.value}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {data.overview.avgDuration.trend === 'up' ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      <span
                        className={
                          data.overview.avgDuration.trend === 'up'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }
                      >
                        {Math.abs(data.overview.avgDuration.change)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-600/80">Bounce Rate</p>
                    <p className="text-2xl font-bold text-amber-900 mt-1">
                      {data.overview.bounceRate.value}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {data.overview.bounceRate.trend === 'up' ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      <span
                        className={
                          data.overview.bounceRate.trend === 'up'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }
                      >
                        {Math.abs(data.overview.bounceRate.change)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <MousePointer2 className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div variants={itemVariants}>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-gray-100/80">
                  <TabsTrigger
                    value="overview"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-medium data-[state=active]:shadow-sm"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="pages"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-medium data-[state=active]:shadow-sm"
                  >
                    Pages
                  </TabsTrigger>
                  <TabsTrigger
                    value="sources"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-medium data-[state=active]:shadow-sm"
                  >
                    Sources
                  </TabsTrigger>
                  <TabsTrigger
                    value="audience"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-medium data-[state=active]:shadow-sm"
                  >
                    Audience
                  </TabsTrigger>
                  <TabsTrigger
                    value="events"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-medium data-[state=active]:shadow-sm"
                  >
                    Events
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="rounded-2xl">
                      <CardHeader>
                        <CardTitle className="text-lg">Traffic Sources</CardTitle>
                        <CardDescription>Where your visitors come from</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {data.sources.map((source) => (
                          <div key={source.source} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">{source.source}</span>
                              <span className="text-muted-foreground">
                                {source.visitors.toLocaleString()} ({source.percentage}%)
                              </span>
                            </div>
                            <Progress value={source.percentage} className="h-2" />
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl">
                      <CardHeader>
                        <CardTitle className="text-lg">Devices</CardTitle>
                        <CardDescription>Visitor device breakdown</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {data.devices.map((device) => {
                          const DeviceIcon = device.icon;
                          return (
                            <div key={device.type} className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                                <DeviceIcon className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium">{device.type}</span>
                                  <span className="text-muted-foreground">
                                    {device.percentage}%
                                  </span>
                                </div>
                                <Progress value={device.percentage} className="h-2" />
                              </div>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="rounded-2xl">
                      <CardHeader>
                        <CardTitle className="text-lg">Top Locations</CardTitle>
                        <CardDescription>Visitor geography</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {data.locations.map((location, idx) => (
                            <div
                              key={location.country}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <span className="text-lg font-medium text-muted-foreground w-6">
                                {idx + 1}
                              </span>
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="flex-1 font-medium">{location.country}</span>
                              <span className="text-muted-foreground">
                                {location.visitors.toLocaleString()}
                              </span>
                              <Badge variant="outline">{location.percentage}%</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl">
                      <CardHeader>
                        <CardTitle className="text-lg">Browsers</CardTitle>
                        <CardDescription>Browser usage distribution</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {data.browsers.map((browser) => (
                          <div key={browser.name} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">{browser.name}</span>
                              <span className="text-muted-foreground">{browser.percentage}%</span>
                            </div>
                            <Progress value={browser.percentage} className="h-2" />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="pages" className="mt-4">
                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-lg">Top Pages</CardTitle>
                      <CardDescription>Most visited pages on your website</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {data.topPages.map((page, idx) => (
                          <div
                            key={page.path}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                          >
                            <span className="text-lg font-bold text-muted-foreground w-6">
                              {idx + 1}
                            </span>
                            <div className="flex-1">
                              <p className="font-medium">{page.title}</p>
                              <p className="text-xs text-muted-foreground">{page.path}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{page.views.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">views</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{page.avgTime}</p>
                              <p className="text-xs text-muted-foreground">avg time</p>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                page.bounceRate < 40
                                  ? 'border-green-500 text-green-500'
                                  : page.bounceRate > 50
                                    ? 'border-red-500 text-red-500'
                                    : ''
                              }
                            >
                              {page.bounceRate}% bounce
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="sources" className="mt-4">
                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-lg">Traffic Sources</CardTitle>
                      <CardDescription>Detailed breakdown of traffic sources</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {data.sources.map((source) => (
                          <div
                            key={source.source}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                          >
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                              <Globe className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <span className="font-medium">{source.source}</span>
                            </div>
                            <span className="text-muted-foreground">
                              {source.visitors.toLocaleString()} visitors
                            </span>
                            <div className="w-32">
                              <Progress value={source.percentage} className="h-2" />
                            </div>
                            <Badge variant="outline">{source.percentage}%</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="audience" className="mt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="rounded-2xl">
                      <CardHeader>
                        <CardTitle className="text-lg">Geographic Distribution</CardTitle>
                        <CardDescription>Where your audience is located</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {data.locations.map((location) => (
                            <div
                              key={location.country}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="flex-1 font-medium">{location.country}</span>
                              <span className="text-muted-foreground">
                                {location.visitors.toLocaleString()}
                              </span>
                              <Badge variant="outline">{location.percentage}%</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl">
                      <CardHeader>
                        <CardTitle className="text-lg">Technology</CardTitle>
                        <CardDescription>Devices and browsers used</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <h4 className="font-medium mb-3">Devices</h4>
                          <div className="space-y-2">
                            {data.devices.map((device) => {
                              const DeviceIcon = device.icon;
                              return (
                                <div key={device.type} className="flex items-center gap-3">
                                  <DeviceIcon className="h-4 w-4 text-muted-foreground" />
                                  <span className="flex-1">{device.type}</span>
                                  <Progress value={device.percentage} className="w-24 h-2" />
                                  <span className="text-sm text-muted-foreground w-12 text-right">
                                    {device.percentage}%
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3">Browsers</h4>
                          <div className="space-y-2">
                            {data.browsers.map((browser) => (
                              <div key={browser.name} className="flex items-center gap-3">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <span className="flex-1">{browser.name}</span>
                                <Progress value={browser.percentage} className="w-24 h-2" />
                                <span className="text-sm text-muted-foreground w-12 text-right">
                                  {browser.percentage}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="events" className="mt-4">
                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-lg">Top Events</CardTitle>
                      <CardDescription>Most triggered events on your website</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {data.topEvents.map((event) => {
                          const maxCount = Math.max(...data.topEvents.map((e) => e.count));
                          const percentage = (event.count / maxCount) * 100;
                          return (
                            <div
                              key={event.name}
                              className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                            >
                              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-100 to-violet-100 flex items-center justify-center">
                                <Zap className="h-5 w-5 text-purple-600" />
                              </div>
                              <code className="text-sm bg-muted px-2 py-1 rounded">
                                {event.name}
                              </code>
                              <div className="flex-1">
                                <Progress value={percentage} className="h-2" />
                              </div>
                              <span className="font-medium">{event.count.toLocaleString()}</span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </>
        )}

        {/* Info Accordion */}
        <motion.div variants={itemVariants}>
          <Accordion type="single" collapsible className="bg-white rounded-2xl border">
            <AccordionItem value="about" className="border-none">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium">Understanding Your Analytics</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="pl-11 space-y-2 text-muted-foreground">
                  <p>
                    The Analytics Hub provides insights into how visitors interact with your tracked
                    websites. All data is collected through the tracking script installed on your
                    sites.
                  </p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>
                      <strong>Visitors</strong> - Unique individuals who visited your site
                    </li>
                    <li>
                      <strong>Page Views</strong> - Total pages viewed across all visitors
                    </li>
                    <li>
                      <strong>Bounce Rate</strong> - Visitors who left after viewing only one page
                    </li>
                    <li>
                      <strong>Session Duration</strong> - Average time spent on your site
                    </li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="improve" className="border-none">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium">Improving Your Metrics</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="pl-11 space-y-2 text-muted-foreground">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Reduce bounce rate by improving page load times</li>
                    <li>Increase session duration with engaging content</li>
                    <li>Track custom events to measure conversions</li>
                    <li>Use traffic source data to optimize marketing spend</li>
                    <li>Analyze top pages to identify high-performing content</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="custom" className="border-none">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Target className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="font-medium">Custom Event Tracking</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="pl-11 space-y-2 text-muted-foreground">
                  <p>Track custom events to measure specific user actions:</p>
                  <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto mt-2">
                    {`// Track button clicks
nexora('track', 'button_click', {
  button_id: 'signup-btn'
});

// Track form submissions
nexora('track', 'form_submit', {
  form_id: 'contact-form'
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
