'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  UserPlus,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building2,
  Target,
  CheckCircle2,
  XCircle,
  Download,
  Upload,
  ArrowRight,
  Flame,
  Snowflake,
  ThermometerSun,
  Users,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

// Mock leads data
const mockLeads = [
  {
    id: 1,
    name: 'Jennifer Martinez',
    email: 'jennifer@techcorp.com',
    phone: '+1 555-0101',
    company: 'TechCorp Solutions',
    title: 'VP of Sales',
    status: 'New',
    score: 85,
    source: 'Website',
    temperature: 'hot',
    createdAt: '2024-12-20',
    lastActivity: '2 hours ago',
    estimatedValue: 75000,
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'mchen@innovate.io',
    phone: '+1 555-0102',
    company: 'Innovate Inc',
    title: 'CTO',
    status: 'Contacted',
    score: 72,
    source: 'Referral',
    temperature: 'warm',
    createdAt: '2024-12-19',
    lastActivity: '1 day ago',
    estimatedValue: 95000,
  },
  {
    id: 3,
    name: 'Sarah Williams',
    email: 'sarah.w@globalent.com',
    phone: '+1 555-0103',
    company: 'Global Enterprises',
    title: 'Director of IT',
    status: 'Qualified',
    score: 90,
    source: 'LinkedIn',
    temperature: 'hot',
    createdAt: '2024-12-18',
    lastActivity: '3 hours ago',
    estimatedValue: 120000,
  },
  {
    id: 4,
    name: 'David Thompson',
    email: 'dthompson@startup.co',
    phone: '+1 555-0104',
    company: 'StartupCo',
    title: 'Founder & CEO',
    status: 'New',
    score: 45,
    source: 'Trade Show',
    temperature: 'cold',
    createdAt: '2024-12-17',
    lastActivity: '1 week ago',
    estimatedValue: 25000,
  },
  {
    id: 5,
    name: 'Emily Rodriguez',
    email: 'emily@bigcorp.com',
    phone: '+1 555-0105',
    company: 'BigCorp International',
    title: 'SVP Operations',
    status: 'Nurturing',
    score: 68,
    source: 'Email Campaign',
    temperature: 'warm',
    createdAt: '2024-12-16',
    lastActivity: '2 days ago',
    estimatedValue: 85000,
  },
];

const leadStats = [
  { label: 'Total Leads', value: 248, change: 12, trend: 'up' },
  { label: 'Qualified', value: 87, change: 8, trend: 'up' },
  { label: 'Conversion Rate', value: 35, change: -2, trend: 'down', suffix: '%' },
  { label: 'Avg Lead Score', value: 72, change: 5, trend: 'up' },
];

const statuses = ['New', 'Contacted', 'Qualified', 'Nurturing', 'Unqualified'];
const sources = ['Website', 'Referral', 'LinkedIn', 'Trade Show', 'Email Campaign', 'Cold Call'];
const temperatures = ['hot', 'warm', 'cold'];

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [temperatureFilter, setTemperatureFilter] = useState('all');

  const getTemperatureColor = (temp) => {
    switch (temp) {
      case 'hot':
        return 'text-red-500 bg-red-50';
      case 'warm':
        return 'text-amber-500 bg-amber-50';
      case 'cold':
        return 'text-blue-500 bg-blue-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const getTemperatureIcon = (temp) => {
    switch (temp) {
      case 'hot':
        return <Flame className="h-4 w-4" />;
      case 'warm':
        return <ThermometerSun className="h-4 w-4" />;
      case 'cold':
        return <Snowflake className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const filteredLeads = useMemo(() => {
    return mockLeads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
      const matchesTemp = temperatureFilter === 'all' || lead.temperature === temperatureFilter;
      return matchesSearch && matchesStatus && matchesSource && matchesTemp;
    });
  }, [searchQuery, statusFilter, sourceFilter, temperatureFilter]);

  const totalValue = mockLeads.reduce((sum, lead) => sum + lead.estimatedValue, 0);

  const layoutStats = useMemo(
    () => [
      createStat('Total', leadStats[0].value, Users, 'blue'),
      createStat('Qualified', leadStats[1].value, CheckCircle2, 'green'),
      createStat('Conv Rate', `${leadStats[2].value}%`, Target, 'purple'),
      createStat('Est. Value', `$${(totalValue / 1000).toFixed(0)}K`, DollarSign, 'orange'),
    ],
    [totalValue]
  );

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const actionButtons = (
    <div className="flex items-center gap-2">
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          {statuses.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sourceFilter} onValueChange={setSourceFilter}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sources</SelectItem>
          {sources.map((source) => (
            <SelectItem key={source} value={source}>
              {source}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={temperatureFilter} onValueChange={setTemperatureFilter}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Temp" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Temps</SelectItem>
          {temperatures.map((temp) => (
            <SelectItem key={temp} value={temp} className="capitalize">
              {temp}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        New Lead
      </Button>
    </div>
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const mainContent = (
    <div className="space-y-6">
      {/* Leads List */}
      <Card>
        <div className="divide-y">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Link href={`/sales/leads/${lead.id}`} className="font-medium hover:underline">
                    {lead.name}
                  </Link>
                  <Badge variant="outline" className={getTemperatureColor(lead.temperature)}>
                    {getTemperatureIcon(lead.temperature)}
                    <span className="ml-1 capitalize">{lead.temperature}</span>
                  </Badge>
                  <Badge variant="outline">{lead.status}</Badge>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {lead.company}
                  </span>
                  <span>•</span>
                  <span>{lead.title}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {lead.email}
                  </span>
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-6">
                <div className="text-center min-w-[80px]">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className={cn('font-bold', getScoreColor(lead.score))}>{lead.score}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Score</p>
                </div>
                <div className="text-center min-w-[100px]">
                  <p className="font-semibold text-green-600">
                    {formatCurrency(lead.estimatedValue)}
                  </p>
                  <p className="text-xs text-muted-foreground">Est. Value</p>
                </div>
                <div className="text-center min-w-[100px]">
                  <p className="text-sm">{lead.source}</p>
                  <p className="text-xs text-muted-foreground">Source</p>
                </div>
                <div className="text-center min-w-[100px]">
                  <p className="text-sm">{lead.lastActivity}</p>
                  <p className="text-xs text-muted-foreground">Last Activity</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Convert
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/sales/leads/${lead.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Phone className="h-4 w-4 mr-2" />
                      Make Call
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark as Qualified
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <XCircle className="h-4 w-4 mr-2" />
                      Mark as Unqualified
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {filteredLeads.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <UserPlus className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No leads found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or create a new lead
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Lead
            </Button>
          </div>
        </Card>
      )}
    </div>
  );

  return (
    <HubLayout
      title="Leads"
      description="Capture, qualify, and convert leads into deals"
      stats={layoutStats}
      searchValue={searchQuery}
      onSearchChange={handleSearch}
      searchPlaceholder="Search leads..."
      actionButtons={actionButtons}
      showFixedMenu={false}
    >
      {mainContent}
    </HubLayout>
  );
}
