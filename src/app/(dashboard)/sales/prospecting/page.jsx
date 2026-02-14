'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserPlus,
  Mail,
  Sparkles,
  Database,
  MoreHorizontal,
  Building2,
  Linkedin,
  Phone,
  MapPin,
  Users,
  Target,
  Zap,
  CheckCircle2,
  XCircle,
  Download,
  Star,
  Briefcase,
  Search,
} from 'lucide-react';
import { UnifiedLayout, createStat, createAction } from '@/components/layout/unified';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock prospects data
const mockProspects = [
  {
    id: 1,
    name: 'John Smith',
    title: 'VP of Engineering',
    company: 'TechCorp Inc',
    industry: 'Technology',
    location: 'San Francisco, CA',
    email: 'john.smith@techcorp.com',
    linkedin: 'linkedin.com/in/johnsmith',
    phone: '+1 415-555-1234',
    score: 92,
    signals: ['Recent funding', 'Hiring engineers'],
    status: 'new',
    enriched: true,
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    title: 'CTO',
    company: 'StartupXYZ',
    industry: 'SaaS',
    location: 'New York, NY',
    email: 'sarah@startupxyz.com',
    linkedin: 'linkedin.com/in/sarahjohnson',
    phone: '+1 212-555-5678',
    score: 88,
    signals: ['Product launch', 'Attended webinar'],
    status: 'contacted',
    enriched: true,
  },
  {
    id: 3,
    name: 'Mike Wilson',
    title: 'Director of Operations',
    company: 'Global Industries',
    industry: 'Manufacturing',
    location: 'Chicago, IL',
    email: 'mwilson@globalind.com',
    linkedin: 'linkedin.com/in/mikewilson',
    phone: '+1 312-555-9012',
    score: 75,
    signals: ['Website visit'],
    status: 'new',
    enriched: false,
  },
  {
    id: 4,
    name: 'Emily Chen',
    title: 'Head of Product',
    company: 'InnovateCo',
    industry: 'Technology',
    location: 'Austin, TX',
    email: 'emily.chen@innovateco.com',
    linkedin: 'linkedin.com/in/emilychen',
    phone: '+1 512-555-3456',
    score: 85,
    signals: ['Downloaded whitepaper', 'Form submission'],
    status: 'qualified',
    enriched: true,
  },
  {
    id: 5,
    name: 'David Brown',
    title: 'CEO',
    company: 'SmallBiz Solutions',
    industry: 'Consulting',
    location: 'Boston, MA',
    email: 'david@smallbizsolutions.com',
    linkedin: 'linkedin.com/in/davidbrown',
    phone: '+1 617-555-7890',
    score: 68,
    signals: [],
    status: 'new',
    enriched: false,
  },
];

// Stats
const prospectingStats = {
  totalProspects: 156,
  newThisWeek: 42,
  enriched: 89,
  avgScore: 78,
};

export default function ProspectingPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProspects, setSelectedProspects] = useState([]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700';
      case 'contacted':
        return 'bg-amber-100 text-amber-700';
      case 'qualified':
        return 'bg-green-100 text-green-700';
      case 'disqualified':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProspects(mockProspects.map((p) => p.id));
    } else {
      setSelectedProspects([]);
    }
  };

  const handleSelectProspect = (id) => {
    if (selectedProspects.includes(id)) {
      setSelectedProspects(selectedProspects.filter((p) => p !== id));
    } else {
      setSelectedProspects([...selectedProspects, id]);
    }
  };

  const filteredProspects = mockProspects.filter((prospect) => {
    return statusFilter === 'all' || prospect.status === statusFilter;
  });

  const stats = [
    createStat('Prospects', prospectingStats.totalProspects, Users, 'blue'),
    createStat('New', prospectingStats.newThisWeek, UserPlus, 'green'),
    createStat('Enriched', prospectingStats.enriched, Database, 'purple'),
    createStat('Avg Score', prospectingStats.avgScore, Target, 'orange'),
  ];

  const actions = [
    createAction('Import Leads', Database, () => console.log('import')),
    createAction('AI Search', Sparkles, () => console.log('ai search'), { primary: true }),
  ];

  return (
    <UnifiedLayout
      hubId="sales"
      pageTitle="Prospecting"
      stats={stats}
      actions={actions}
      fixedMenu={null}
    >
      <div className="p-6 space-y-6">
        {/* Filter */}
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {selectedProspects.length > 0 && (
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <span className="text-sm font-medium">{selectedProspects.length} selected</span>
            <Button size="sm" variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            <Button size="sm" variant="outline">
              <Database className="h-4 w-4 mr-2" />
              Enrich
            </Button>
            <Button size="sm" variant="outline">
              <UserPlus className="h-4 w-4 mr-2" />
              Add to Sequence
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        )}

        {/* Prospects Table */}
        <Card>
          <div className="divide-y">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 bg-muted/50 font-medium text-sm">
              <Checkbox
                checked={selectedProspects.length === mockProspects.length}
                onCheckedChange={handleSelectAll}
              />
              <div className="flex-1">Name</div>
              <div className="w-48 hidden lg:block">Company</div>
              <div className="w-32 hidden md:block">Score</div>
              <div className="w-24 hidden md:block">Status</div>
              <div className="w-24">Actions</div>
            </div>

            {/* Rows */}
            {filteredProspects.map((prospect, index) => (
              <motion.div
                key={prospect.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  checked={selectedProspects.includes(prospect.id)}
                  onCheckedChange={() => handleSelectProspect(prospect.id)}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{prospect.name}</span>
                    {prospect.enriched && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Enriched
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{prospect.title}</span>
                    <span>-</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {prospect.location}
                    </span>
                  </div>
                  {prospect.signals.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {prospect.signals.map((signal, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-xs bg-green-50 text-green-700"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          {signal}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-48 hidden lg:block">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{prospect.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-3 w-3" />
                    <span>{prospect.industry}</span>
                  </div>
                </div>

                <div className="w-32 hidden md:block">
                  <div className="flex items-center gap-2">
                    <Target className={cn('h-4 w-4', getScoreColor(prospect.score))} />
                    <span className={cn('font-bold', getScoreColor(prospect.score))}>
                      {prospect.score}
                    </span>
                  </div>
                </div>

                <div className="w-24 hidden md:block">
                  <Badge variant="outline" className={getStatusColor(prospect.status)}>
                    {prospect.status}
                  </Badge>
                </div>

                <div className="w-24 flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" title="Email">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" title="LinkedIn">
                    <Linkedin className="h-4 w-4" />
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
                        <Database className="h-4 w-4 mr-2" />
                        Enrich Data
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add to Sequence
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Star className="h-4 w-4 mr-2" />
                        Add to Target Accounts
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark Qualified
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <XCircle className="h-4 w-4 mr-2" />
                        Disqualify
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {filteredProspects.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No prospects found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search criteria
              </p>
              <Button>
                <Sparkles className="h-4 w-4 mr-2" />
                AI Search for Prospects
              </Button>
            </div>
          </Card>
        )}

        {/* AI Suggestion */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-purple-900 mb-1">AI Prospecting Suggestions</h3>
                <p className="text-sm text-purple-800 mb-3">
                  Based on your ideal customer profile, we found 24 new prospects that match your
                  criteria. Would you like to review them?
                </p>
                <div className="flex items-center gap-2">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    View Suggestions
                  </Button>
                  <Button size="sm" variant="outline" className="border-purple-300 text-purple-700">
                    Update ICP
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </UnifiedLayout>
  );
}
