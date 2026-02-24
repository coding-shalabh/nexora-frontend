'use client';

import { useState } from 'react';
import {
  TrendingUp,
  Plus,
  Target,
  Activity,
  CheckCircle,
  Star,
  Users,
  Zap,
  MoreHorizontal,
  Edit,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UnifiedLayout, createStat, createAction } from '@/components/layout/unified';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const mockRules = [
  {
    id: '1',
    name: 'Email Opened',
    description: 'Contact opened a marketing email',
    points: 10,
    category: 'Engagement',
    active: true,
  },
  {
    id: '2',
    name: 'Website Visit',
    description: 'Contact visited the pricing page',
    points: 15,
    category: 'Behavior',
    active: true,
  },
  {
    id: '3',
    name: 'Form Submitted',
    description: 'Contact submitted a contact or demo form',
    points: 25,
    category: 'Conversion',
    active: true,
  },
  {
    id: '4',
    name: 'Campaign Clicked',
    description: 'Contact clicked a link in a campaign',
    points: 5,
    category: 'Engagement',
    active: false,
  },
];

const categoryColors = {
  Engagement: 'bg-blue-100 text-blue-700',
  Behavior: 'bg-purple-100 text-purple-700',
  Conversion: 'bg-green-100 text-green-700',
  Demographic: 'bg-orange-100 text-orange-700',
};

export default function MarketingLeadScoringPage() {
  const [rules, setRules] = useState(mockRules);

  const activeRules = rules.filter((r) => r.active).length;
  const totalPoints = rules.reduce((sum, r) => sum + (r.active ? r.points : 0), 0);

  const stats = [
    createStat('Total Rules', rules.length.toString(), Target, 'purple'),
    createStat('Active Rules', activeRules.toString(), CheckCircle, 'green'),
    createStat('Leads Scored', '0', Users, 'blue'),
    createStat('Max Score', totalPoints.toString(), TrendingUp, 'emerald'),
  ];

  const actions = [createAction('New Scoring Rule', Plus, () => {}, { primary: true })];

  const handleToggle = (id) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));
  };

  const handleDelete = (id) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  return (
    <UnifiedLayout
      hubId="marketing"
      pageTitle="Lead Scoring"
      stats={stats}
      actions={actions}
      fixedMenu={null}
    >
      <div className="h-full overflow-y-auto p-6 space-y-6">
        {/* Info card */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Marketing Lead Scoring</p>
              <p className="text-sm text-blue-700 mt-1">
                Score leads based on their engagement with your marketing campaigns, emails, and
                website activity. Higher scores indicate more sales-ready leads.
              </p>
            </div>
          </div>
        </Card>

        {/* Scoring rules */}
        {rules.length === 0 ? (
          <Card className="p-12 text-center">
            <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No scoring rules yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create rules to automatically score leads based on their behavior and engagement
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create First Rule
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Scoring Rules ({rules.length})
              </h2>
            </div>
            {rules.map((rule) => (
              <Card key={rule.id} className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{rule.name}</span>
                        <Badge
                          className={categoryColors[rule.category] || 'bg-gray-100 text-gray-700'}
                        >
                          {rule.category}
                        </Badge>
                        {!rule.active && (
                          <Badge variant="outline" className="text-muted-foreground">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {rule.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-semibold">{rule.points} pts</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggle(rule.id)}
                      className={
                        rule.active ? 'border-green-300 text-green-700 hover:bg-green-50' : ''
                      }
                    >
                      {rule.active ? 'Active' : 'Inactive'}
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
                          Edit Rule
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(rule.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </UnifiedLayout>
  );
}
