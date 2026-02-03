'use client';

import { useState, useMemo, useDeferredValue } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Building2,
  Plus,
  MoreHorizontal,
  Star,
  DollarSign,
  Target,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  LayoutGrid,
  List,
  Flame,
  AlertCircle,
  Clock,
  MapPin,
  Globe,
  Briefcase,
  Edit,
  Trash2,
  TrendingUp,
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

// Mock target accounts data
const mockAccounts = [
  {
    id: 1,
    name: 'Acme Corporation',
    website: 'acme.com',
    industry: 'Technology',
    employees: 500,
    location: 'San Francisco, CA',
    tier: 'A',
    health: 'engaged',
    starred: true,
    contacts: 8,
    deals: 3,
    totalDealValue: 175000,
    lastActivity: '2 hours ago',
    score: 85,
    signals: ['Website visit', 'Email opened', 'Content download'],
  },
  {
    id: 2,
    name: 'TechStart Inc',
    website: 'techstart.io',
    industry: 'SaaS',
    employees: 150,
    location: 'New York, NY',
    tier: 'A',
    health: 'at-risk',
    starred: true,
    contacts: 5,
    deals: 2,
    totalDealValue: 80000,
    lastActivity: '1 day ago',
    score: 72,
    signals: ['Demo completed'],
  },
  {
    id: 3,
    name: 'Global Industries',
    website: 'globalind.com',
    industry: 'Manufacturing',
    employees: 2500,
    location: 'Chicago, IL',
    tier: 'B',
    health: 'neutral',
    starred: false,
    contacts: 12,
    deals: 1,
    totalDealValue: 95000,
    lastActivity: '3 hours ago',
    score: 65,
    signals: ['Website visit'],
  },
  {
    id: 4,
    name: 'Nexus Solutions',
    website: 'nexussol.com',
    industry: 'Consulting',
    employees: 80,
    location: 'Austin, TX',
    tier: 'B',
    health: 'engaged',
    starred: false,
    contacts: 3,
    deals: 1,
    totalDealValue: 35000,
    lastActivity: '5 hours ago',
    score: 78,
    signals: ['Form submission', 'Email opened'],
  },
];

const tierStats = [
  { tier: 'A', count: 12, value: 2500000, color: 'bg-green-500' },
  { tier: 'B', count: 25, value: 1800000, color: 'bg-blue-500' },
  { tier: 'C', count: 48, value: 950000, color: 'bg-amber-500' },
];

export default function TargetAccountsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [tierFilter, setTierFilter] = useState('all');
  const [starredOnly, setStarredOnly] = useState(false);

  const deferredSearch = useDeferredValue(searchQuery);

  const formatCurrency = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const getHealthColor = (health) => {
    switch (health) {
      case 'engaged':
        return 'text-green-500 bg-green-50';
      case 'at-risk':
        return 'text-amber-500 bg-amber-50';
      case 'cold':
        return 'text-red-500 bg-red-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const getHealthIcon = (health) => {
    switch (health) {
      case 'engaged':
        return <Flame className="h-4 w-4" />;
      case 'at-risk':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'A':
        return 'bg-green-100 text-green-700';
      case 'B':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-amber-100 text-amber-700';
    }
  };

  const filteredAccounts = mockAccounts.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(deferredSearch.toLowerCase()) ||
      account.industry.toLowerCase().includes(deferredSearch.toLowerCase());
    const matchesTier = tierFilter === 'all' || account.tier === tierFilter;
    const matchesStarred = !starredOnly || account.starred;
    return matchesSearch && matchesTier && matchesStarred;
  });

  const totalPipeline = tierStats.reduce((sum, t) => sum + t.value, 0);
  const totalAccounts = tierStats.reduce((sum, t) => sum + t.count, 0);
  const tierACount = tierStats.find((t) => t.tier === 'A')?.count || 0;

  const layoutStats = useMemo(
    () => [
      createStat('Pipeline', formatCurrency(totalPipeline), DollarSign, 'green'),
      createStat('Accounts', totalAccounts, Building2, 'blue'),
      createStat('Tier A', tierACount, Star, 'amber'),
      createStat('Avg Score', 75, Target, 'purple'),
    ],
    [totalPipeline, totalAccounts, tierACount]
  );

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const actionButtons = (
    <div className="flex items-center gap-2">
      <Select value={tierFilter} onValueChange={setTierFilter}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Tier" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tiers</SelectItem>
          <SelectItem value="A">Tier A</SelectItem>
          <SelectItem value="B">Tier B</SelectItem>
          <SelectItem value="C">Tier C</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant={starredOnly ? 'default' : 'outline'}
        size="icon"
        onClick={() => setStarredOnly(!starredOnly)}
      >
        <Star className={cn('h-4 w-4', starredOnly && 'fill-current')} />
      </Button>
      <div className="flex items-center border rounded-md">
        <Button
          variant={viewMode === 'list' ? 'secondary' : 'ghost'}
          size="icon"
          className="rounded-r-none"
          onClick={() => setViewMode('list')}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
          size="icon"
          className="rounded-l-none"
          onClick={() => setViewMode('grid')}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </div>
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Add Account
      </Button>
    </div>
  );

  const mainContent = (
    <div className="space-y-6">
      {viewMode === 'list' ? (
        <Card>
          <div className="divide-y">
            {filteredAccounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
              >
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <Star
                    className={cn('h-4 w-4', account.starred && 'fill-amber-400 text-amber-400')}
                  />
                </Button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={`/crm/companies/${account.id}`}
                      className="font-medium hover:underline"
                    >
                      {account.name}
                    </Link>
                    <Badge variant="outline" className={getTierColor(account.tier)}>
                      {account.tier}
                    </Badge>
                    <Badge variant="outline" className={getHealthColor(account.health)}>
                      {getHealthIcon(account.health)}
                      <span className="ml-1 capitalize">{account.health}</span>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {account.website}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {account.industry}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {account.location}
                    </span>
                  </div>
                </div>
                <div className="hidden lg:flex items-center gap-6">
                  <div className="text-center">
                    <p className="font-semibold">{account.contacts}</p>
                    <p className="text-xs text-muted-foreground">Contacts</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">{account.deals}</p>
                    <p className="text-xs text-muted-foreground">Deals</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-green-600">
                      {formatCurrency(account.totalDealValue)}
                    </p>
                    <p className="text-xs text-muted-foreground">Pipeline</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <Target className="h-3 w-3 text-primary" />
                      <span className="font-semibold">{account.score}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/crm/companies/${account.id}`}>
                      View
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Meeting
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAccounts.map((account) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getTierColor(account.tier)}>
                        Tier {account.tier}
                      </Badge>
                      <Badge variant="outline" className={getHealthColor(account.health)}>
                        {getHealthIcon(account.health)}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Star
                        className={cn(
                          'h-4 w-4',
                          account.starred && 'fill-amber-400 text-amber-400'
                        )}
                      />
                    </Button>
                  </div>
                  <CardTitle className="text-lg mt-2">
                    <Link href={`/crm/companies/${account.id}`} className="hover:underline">
                      {account.name}
                    </Link>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {account.website}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span>{account.industry}</span>
                    <span>•</span>
                    <span>{account.employees} employees</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-muted rounded-lg">
                      <p className="font-semibold">{account.contacts}</p>
                      <p className="text-xs text-muted-foreground">Contacts</p>
                    </div>
                    <div className="p-2 bg-muted rounded-lg">
                      <p className="font-semibold">{account.deals}</p>
                      <p className="text-xs text-muted-foreground">Deals</p>
                    </div>
                    <div className="p-2 bg-muted rounded-lg">
                      <p className="font-semibold">{account.score}</p>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Pipeline Value</p>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(account.totalDealValue)}
                    </p>
                  </div>
                  {account.signals.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {account.signals.map((signal, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {signal}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Last activity: {account.lastActivity}
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/crm/companies/${account.id}`}>View</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {filteredAccounts.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No accounts found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or add new target accounts
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </div>
        </Card>
      )}
    </div>
  );

  return (
    <HubLayout
      title="Target Accounts"
      description="Manage and prioritize your key accounts"
      stats={layoutStats}
      searchValue={searchQuery}
      onSearchChange={handleSearch}
      searchPlaceholder="Search accounts..."
      actionButtons={actionButtons}
      showFixedMenu={false}
    >
      {mainContent}
    </HubLayout>
  );
}
