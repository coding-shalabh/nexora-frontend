'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Building2,
  TrendingUp,
  LayoutGrid,
  List,
  ChevronRight,
  Clock,
  Target,
  Flame,
  AlertCircle,
  Download,
  Upload,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// Mock deals data
const mockDeals = [
  {
    id: 1,
    name: 'Enterprise License - Acme Corp',
    company: 'Acme Corp',
    contact: 'John Smith',
    value: 125000,
    stage: 'Proposal',
    probability: 75,
    closeDate: '2025-01-15',
    owner: 'You',
    priority: 'high',
    health: 'good',
    lastActivity: '2 hours ago',
    nextStep: 'Schedule demo call',
    createdAt: '2024-12-01',
  },
  {
    id: 2,
    name: 'Annual Contract - TechStart',
    company: 'TechStart Inc',
    contact: 'Sarah Johnson',
    value: 48000,
    stage: 'Negotiation',
    probability: 60,
    closeDate: '2025-01-20',
    owner: 'You',
    priority: 'high',
    health: 'at-risk',
    lastActivity: '1 day ago',
    nextStep: 'Send pricing proposal',
    createdAt: '2024-11-15',
  },
  {
    id: 3,
    name: 'Platform Upgrade - Global Ltd',
    company: 'Global Industries',
    contact: 'Mike Wilson',
    value: 95000,
    stage: 'Discovery',
    probability: 40,
    closeDate: '2025-02-01',
    owner: 'Jane Doe',
    priority: 'medium',
    health: 'good',
    lastActivity: '3 hours ago',
    nextStep: 'Conduct needs assessment',
    createdAt: '2024-12-10',
  },
  {
    id: 4,
    name: 'Starter Plan - Nexus Co',
    company: 'Nexus Solutions',
    contact: 'Emily Brown',
    value: 15000,
    stage: 'Qualification',
    probability: 30,
    closeDate: '2025-01-30',
    owner: 'You',
    priority: 'low',
    health: 'neutral',
    lastActivity: '5 hours ago',
    nextStep: 'Qualify budget',
    createdAt: '2024-12-15',
  },
  {
    id: 5,
    name: 'Multi-Year Deal - BigCo',
    company: 'BigCo International',
    contact: 'David Chen',
    value: 250000,
    stage: 'Proposal',
    probability: 80,
    closeDate: '2025-01-25',
    owner: 'Jane Doe',
    priority: 'high',
    health: 'good',
    lastActivity: '30 minutes ago',
    nextStep: 'Final contract review',
    createdAt: '2024-11-01',
  },
  {
    id: 6,
    name: 'Basic Package - SmallBiz',
    company: 'SmallBiz LLC',
    contact: 'Lisa Anderson',
    value: 8500,
    stage: 'Closed Won',
    probability: 100,
    closeDate: '2024-12-20',
    owner: 'You',
    priority: 'low',
    health: 'good',
    lastActivity: '1 week ago',
    nextStep: 'Onboarding',
    createdAt: '2024-11-20',
  },
];

const stages = [
  { id: 'qualification', name: 'Qualification', color: 'bg-blue-500' },
  { id: 'discovery', name: 'Discovery', color: 'bg-purple-500' },
  { id: 'proposal', name: 'Proposal', color: 'bg-amber-500' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-500' },
  { id: 'closed-won', name: 'Closed Won', color: 'bg-green-500' },
  { id: 'closed-lost', name: 'Closed Lost', color: 'bg-red-500' },
];

const pipelineStats = [
  { label: 'Total Pipeline', value: 541500, change: 12.5, trend: 'up' },
  { label: 'Weighted Value', value: 312900, change: 8.3, trend: 'up' },
  { label: 'Avg Deal Size', value: 90250, change: -3.2, trend: 'down' },
  { label: 'Win Rate', value: 42, change: 5.1, trend: 'up', isPercentage: true },
];

export default function DealsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('kanban');
  const [stageFilter, setStageFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('all');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getHealthColor = (health) => {
    switch (health) {
      case 'good':
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
      case 'good':
        return <Flame className="h-4 w-4" />;
      case 'at-risk':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-50';
      case 'medium':
        return 'text-amber-500 bg-amber-50';
      default:
        return 'text-blue-500 bg-blue-50';
    }
  };

  const filteredDeals = useMemo(() => {
    return mockDeals.filter((deal) => {
      const matchesSearch =
        deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStage =
        stageFilter === 'all' || deal.stage.toLowerCase().replace(' ', '-') === stageFilter;
      const matchesOwner = ownerFilter === 'all' || deal.owner === ownerFilter;
      return matchesSearch && matchesStage && matchesOwner;
    });
  }, [searchQuery, stageFilter, ownerFilter]);

  const dealsByStage = useMemo(() => {
    const grouped = {};
    stages.forEach((stage) => {
      grouped[stage.id] = filteredDeals.filter(
        (deal) => deal.stage.toLowerCase().replace(' ', '-') === stage.id
      );
    });
    return grouped;
  }, [filteredDeals]);

  const totalPipeline = pipelineStats[0].value;
  const weightedValue = pipelineStats[1].value;
  const avgDealSize = pipelineStats[2].value;
  const winRate = pipelineStats[3].value;

  const layoutStats = useMemo(
    () => [
      createStat('Pipeline', formatCurrency(totalPipeline), DollarSign, 'blue'),
      createStat('Weighted', formatCurrency(weightedValue), TrendingUp, 'green'),
      createStat('Avg Deal', formatCurrency(avgDealSize), Target, 'purple'),
      createStat('Win Rate', `${winRate}%`, Flame, 'orange'),
    ],
    [totalPipeline, weightedValue, avgDealSize, winRate]
  );

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const actionButtons = (
    <div className="flex items-center gap-2">
      <Select value={stageFilter} onValueChange={setStageFilter}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Stage" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Stages</SelectItem>
          {stages.map((stage) => (
            <SelectItem key={stage.id} value={stage.id}>
              {stage.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={ownerFilter} onValueChange={setOwnerFilter}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Owner" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Owners</SelectItem>
          <SelectItem value="You">You</SelectItem>
          <SelectItem value="Jane Doe">Jane Doe</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex items-center border rounded-md">
        <Button
          variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
          size="icon"
          className="rounded-r-none"
          onClick={() => setViewMode('kanban')}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'secondary' : 'ghost'}
          size="icon"
          className="rounded-l-none"
          onClick={() => setViewMode('list')}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
      <Button variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button asChild>
        <Link href="/sales/deals/new">
          <Plus className="h-4 w-4 mr-2" />
          New Deal
        </Link>
      </Button>
    </div>
  );

  const DealCard = ({ deal }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link
              href={`/sales/deals/${deal.id}`}
              className="font-medium hover:underline line-clamp-2"
            >
              {deal.name}
            </Link>
            <p className="text-sm text-muted-foreground mt-1">{deal.company}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/sales/deals/${deal.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className={getHealthColor(deal.health)}>
            {getHealthIcon(deal.health)}
            <span className="ml-1 capitalize">{deal.health}</span>
          </Badge>
          <Badge variant="outline" className={getPriorityColor(deal.priority)}>
            {deal.priority}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Value</span>
            <span className="font-bold text-green-600">{formatCurrency(deal.value)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Probability</span>
            <span className="font-medium">{deal.probability}%</span>
          </div>
          <Progress value={deal.probability} className="h-1" />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Close: {new Date(deal.closeDate).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
          <User className="h-3 w-3" />
          <span>{deal.owner}</span>
        </div>
      </div>
    </motion.div>
  );

  const mainContent = (
    <div className="space-y-6">
      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {stages.map((stage) => (
              <div key={stage.id} className="flex-shrink-0 w-80">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn('w-3 h-3 rounded-full', stage.color)} />
                        <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
                      </div>
                      <Badge variant="secondary">{dealsByStage[stage.id]?.length || 0}</Badge>
                    </div>
                    <CardDescription className="text-xs">
                      {formatCurrency(
                        (dealsByStage[stage.id] || []).reduce((sum, deal) => sum + deal.value, 0)
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                    {dealsByStage[stage.id]?.map((deal) => (
                      <DealCard key={deal.id} deal={deal} />
                    ))}
                    {(!dealsByStage[stage.id] || dealsByStage[stage.id].length === 0) && (
                      <div className="text-center py-8 text-sm text-muted-foreground">No deals</div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <Card>
          <div className="divide-y">
            {filteredDeals.map((deal) => (
              <div
                key={deal.id}
                className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link href={`/sales/deals/${deal.id}`} className="font-medium hover:underline">
                      {deal.name}
                    </Link>
                    <Badge variant="outline" className={getHealthColor(deal.health)}>
                      {getHealthIcon(deal.health)}
                      <span className="ml-1 capitalize">{deal.health}</span>
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(deal.priority)}>
                      {deal.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {deal.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {deal.contact}
                    </span>
                    <Badge variant="outline">{deal.stage}</Badge>
                  </div>
                </div>
                <div className="hidden lg:flex items-center gap-6">
                  <div className="text-center min-w-[100px]">
                    <p className="font-bold text-green-600">{formatCurrency(deal.value)}</p>
                    <p className="text-xs text-muted-foreground">Value</p>
                  </div>
                  <div className="text-center min-w-[80px]">
                    <p className="font-semibold">{deal.probability}%</p>
                    <p className="text-xs text-muted-foreground">Probability</p>
                  </div>
                  <div className="text-center min-w-[100px]">
                    <p className="font-medium">{new Date(deal.closeDate).toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">Close Date</p>
                  </div>
                  <div className="text-center min-w-[80px]">
                    <p className="text-sm">{deal.owner}</p>
                    <p className="text-xs text-muted-foreground">Owner</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/sales/deals/${deal.id}`}>
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
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
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
      )}

      {filteredDeals.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <DollarSign className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No deals found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or create a new deal
            </p>
            <Button asChild>
              <Link href="/sales/deals/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Deal
              </Link>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );

  return (
    <HubLayout
      title="Deals"
      description="Manage your sales pipeline and opportunities"
      stats={layoutStats}
      searchValue={searchQuery}
      onSearchChange={handleSearch}
      searchPlaceholder="Search deals..."
      actionButtons={actionButtons}
      showFixedMenu={false}
    >
      {mainContent}
    </HubLayout>
  );
}
