'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Mail,
  MousePointerClick,
  DollarSign,
  Eye,
  Target,
  Calendar,
  Download,
  Send,
  MessageSquare,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/auth-context';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function StatCard({ title, value, icon: Icon, trend, subtext, loading }) {
  const isPositive = trend > 0;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {trend !== undefined && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
                  {isPositive ? '+' : ''}
                  {trend}%
                </span>
                {subtext && <span className="ml-1">{subtext}</span>}
              </p>
            )}
            {!trend && subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function RateBar({ label, value, maxValue, color = 'bg-primary' }) {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}

export default function MarketingAnalyticsPage() {
  const { token } = useAuth();
  const [dateRange, setDateRange] = useState('30d');

  // Calculate date range for API
  const getDateParams = () => {
    const end = new Date();
    const start = new Date();
    switch (dateRange) {
      case '7d':
        start.setDate(start.getDate() - 7);
        break;
      case '30d':
        start.setDate(start.getDate() - 30);
        break;
      case '90d':
        start.setDate(start.getDate() - 90);
        break;
      case '1y':
        start.setFullYear(start.getFullYear() - 1);
        break;
      case 'all':
        return {};
    }
    return { startDate: start.toISOString(), endDate: end.toISOString() };
  };

  // Fetch campaign stats
  const {
    data: statsData,
    isLoading: loadingStats,
    refetch,
  } = useQuery({
    queryKey: ['campaign-stats', dateRange],
    queryFn: async () => {
      const params = new URLSearchParams(getDateParams());
      const res = await fetch(`${API_URL}/api/v1/campaigns/stats?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    enabled: !!token,
  });

  // Fetch campaigns list for top performers
  const { data: campaignsData, isLoading: loadingCampaigns } = useQuery({
    queryKey: ['campaigns-list'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/v1/campaigns?limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    enabled: !!token,
  });

  // Fetch broadcasts stats
  const { data: broadcastsData, isLoading: loadingBroadcasts } = useQuery({
    queryKey: ['broadcasts-stats'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/v1/broadcasts?limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    enabled: !!token,
  });

  const stats = statsData?.data || {};
  const campaigns = stats.campaigns || {};
  const broadcasts = stats.broadcasts || {};
  const contacts = stats.contacts || {};
  const rates = stats.rates || {};

  const loading = loadingStats || loadingCampaigns;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketing Analytics</h1>
          <p className="text-muted-foreground">Track performance across all marketing channels</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Sent"
          value={(campaigns.sent || 0).toLocaleString()}
          icon={Send}
          subtext="Messages delivered"
          loading={loading}
        />
        <StatCard
          title="Open Rate"
          value={`${rates.openRate || 0}%`}
          icon={Eye}
          subtext={`${(campaigns.opened || 0).toLocaleString()} opened`}
          loading={loading}
        />
        <StatCard
          title="Click Rate"
          value={`${rates.clickRate || 0}%`}
          icon={MousePointerClick}
          subtext={`${(campaigns.clicked || 0).toLocaleString()} clicks`}
          loading={loading}
        />
        <StatCard
          title="Conversions"
          value={(campaigns.converted || 0).toLocaleString()}
          icon={Target}
          subtext={`${rates.conversionRate || 0}% conversion rate`}
          loading={loading}
        />
      </div>

      {/* Channel Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="broadcasts">Broadcasts</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Campaign Performance Rates */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Rates</CardTitle>
                <CardDescription>Key performance metrics for your campaigns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RateBar
                  label="Delivery Rate"
                  value={parseFloat(rates.deliveryRate || 0)}
                  maxValue={100}
                />
                <RateBar label="Open Rate" value={parseFloat(rates.openRate || 0)} maxValue={50} />
                <RateBar
                  label="Click Rate"
                  value={parseFloat(rates.clickRate || 0)}
                  maxValue={20}
                />
                <RateBar
                  label="Conversion Rate"
                  value={parseFloat(rates.conversionRate || 0)}
                  maxValue={10}
                />
              </CardContent>
            </Card>

            {/* Channel Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Channel Breakdown</CardTitle>
                <CardDescription>Performance by marketing channel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      channel: 'WhatsApp',
                      icon: MessageSquare,
                      sent: broadcasts.sent || 0,
                      delivered: broadcasts.delivered || 0,
                      color: 'bg-green-500',
                    },
                    {
                      channel: 'Email',
                      icon: Mail,
                      sent: contacts.totalEmails || 0,
                      delivered: contacts.emailsOpened || 0,
                      color: 'bg-blue-500',
                    },
                    {
                      channel: 'SMS',
                      icon: MessageSquare,
                      sent: 0,
                      delivered: 0,
                      color: 'bg-orange-500',
                    },
                  ].map((item) => {
                    const rate =
                      item.sent > 0 ? ((item.delivered / item.sent) * 100).toFixed(1) : 0;
                    return (
                      <div key={item.channel} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <item.icon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{item.channel}</span>
                          </div>
                          <span className="text-muted-foreground">
                            {item.sent.toLocaleString()} sent
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${item.color}`}
                            style={{ width: `${Math.min(rate, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{item.delivered.toLocaleString()} delivered</span>
                          <span>{rate}% rate</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Campaigns</p>
                    <p className="text-2xl font-bold">{campaigns.total || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Send className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Broadcasts Sent</p>
                    <p className="text-2xl font-bold">{broadcasts.total || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Contacts</p>
                    <p className="text-2xl font-bold">{(contacts.total || 0).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <DollarSign className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold">
                      ${(campaigns.revenue || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              title="Total Campaigns"
              value={campaigns.total || 0}
              icon={Target}
              subtext="Created campaigns"
              loading={loadingStats}
            />
            <StatCard
              title="Total Sent"
              value={(campaigns.sent || 0).toLocaleString()}
              icon={Send}
              subtext="Messages sent"
              loading={loadingStats}
            />
            <StatCard
              title="Unsubscribed"
              value={(campaigns.unsubscribed || 0).toLocaleString()}
              icon={Users}
              subtext="Opted out contacts"
              loading={loadingStats}
            />
          </div>

          {/* Campaign List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Campaigns</CardTitle>
              <CardDescription>Your latest marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingCampaigns ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : campaignsData?.data?.length > 0 ? (
                <div className="space-y-4">
                  {campaignsData.data.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div>
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-4">
                          <span>{campaign.type}</span>
                          <span>{campaign.channels?.join(', ')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {(campaign.sentCount || 0).toLocaleString()} sent
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {campaign.openedCount || 0} opened
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            campaign.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : campaign.status === 'COMPLETED'
                                ? 'bg-blue-100 text-blue-700 border-blue-200'
                                : 'bg-gray-100 text-gray-700 border-gray-200'
                          }
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No campaigns found</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="broadcasts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard
              title="Total Broadcasts"
              value={broadcasts.total || 0}
              icon={Send}
              loading={loadingStats}
            />
            <StatCard
              title="Messages Sent"
              value={(broadcasts.sent || 0).toLocaleString()}
              icon={MessageSquare}
              loading={loadingStats}
            />
            <StatCard
              title="Read"
              value={(broadcasts.read || 0).toLocaleString()}
              icon={Eye}
              loading={loadingStats}
            />
            <StatCard
              title="Opt-Outs"
              value={(broadcasts.optedOut || 0).toLocaleString()}
              icon={Users}
              loading={loadingStats}
            />
          </div>

          {/* Recent Broadcasts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Broadcasts</CardTitle>
              <CardDescription>Your latest broadcast messages</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingBroadcasts ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : broadcastsData?.data?.length > 0 ? (
                <div className="space-y-4">
                  {broadcastsData.data.map((broadcast) => (
                    <div
                      key={broadcast.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div>
                        <div className="font-medium">{broadcast.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {broadcast.channel} · {new Date(broadcast.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right text-sm">
                          <div>{(broadcast.sentCount || 0).toLocaleString()} sent</div>
                          <div className="text-muted-foreground">
                            {broadcast.readCount || 0} read
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            broadcast.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-700'
                              : broadcast.status === 'SENDING'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                          }
                        >
                          {broadcast.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No broadcasts found</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard
              title="Total Contacts"
              value={(contacts.total || 0).toLocaleString()}
              icon={Users}
              loading={loadingStats}
            />
            <StatCard
              title="Marketing Emails"
              value={(contacts.totalEmails || 0).toLocaleString()}
              icon={Mail}
              subtext={`${contacts.emailsOpened || 0} opened`}
              loading={loadingStats}
            />
            <StatCard
              title="Broadcasts Received"
              value={(contacts.broadcastsReceived || 0).toLocaleString()}
              icon={Send}
              loading={loadingStats}
            />
            <StatCard
              title="Avg Marketing Score"
              value={Math.round(contacts.averageMarketingScore || 0)}
              icon={Target}
              loading={loadingStats}
            />
          </div>

          {/* Engagement Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Engagement</CardTitle>
              <CardDescription>How your contacts interact with marketing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Email Engagement</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Emails Received</span>
                      <span className="font-medium">
                        {(contacts.totalEmails || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Emails Opened</span>
                      <span className="font-medium">
                        {(contacts.emailsOpened || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Emails Clicked</span>
                      <span className="font-medium">
                        {(contacts.emailsClicked || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Sequence Engagement</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Broadcasts Received</span>
                      <span className="font-medium">
                        {(contacts.broadcastsReceived || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sequences Enrolled</span>
                      <span className="font-medium">
                        {(contacts.sequencesEnrolled || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg Marketing Score</span>
                      <span className="font-medium">
                        {Math.round(contacts.averageMarketingScore || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
