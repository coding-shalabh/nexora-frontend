'use client';

import { Plus, Users, MoreHorizontal, DollarSign, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UnifiedLayout, createStat, createAction } from '@/components/layout/unified';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const pipelineStages = [
  {
    id: 'lead',
    name: 'Lead',
    deals: [
      { id: 1, name: 'Acme Corp Deal', value: 25000, contact: 'John Doe' },
      { id: 2, name: 'Tech Solutions', value: 15000, contact: 'Jane Smith' },
    ],
    color: 'bg-gray-100',
  },
  {
    id: 'qualified',
    name: 'Qualified',
    deals: [{ id: 3, name: 'Enterprise Project', value: 50000, contact: 'Bob Wilson' }],
    color: 'bg-blue-100',
  },
  {
    id: 'proposal',
    name: 'Proposal',
    deals: [{ id: 4, name: 'Software License', value: 35000, contact: 'Alice Brown' }],
    color: 'bg-purple-100',
  },
  {
    id: 'negotiation',
    name: 'Negotiation',
    deals: [{ id: 5, name: 'Annual Contract', value: 75000, contact: 'Charlie Davis' }],
    color: 'bg-amber-100',
  },
  {
    id: 'closed',
    name: 'Closed Won',
    deals: [{ id: 6, name: 'Consulting Package', value: 20000, contact: 'Diana Evans' }],
    color: 'bg-green-100',
  },
];

const totalDeals = pipelineStages.reduce((sum, stage) => sum + stage.deals.length, 0);
const totalValue = pipelineStages.reduce(
  (sum, stage) => sum + stage.deals.reduce((s, d) => s + d.value, 0),
  0
);

export default function SalesPipelinePage() {
  const router = useRouter();

  const stats = [
    createStat('Total Deals', totalDeals, Target, 'blue'),
    createStat('Pipeline Value', `$${(totalValue / 1000).toFixed(0)}K`, DollarSign, 'green'),
    createStat('Stages', pipelineStages.length, Target, 'purple'),
    createStat(
      'Avg Deal',
      `$${(totalValue / totalDeals / 1000).toFixed(0)}K`,
      DollarSign,
      'orange'
    ),
  ];

  const actions = [
    createAction('Add Deal', Plus, () => router.push('/sales/deals/new'), { primary: true }),
  ];

  return (
    <UnifiedLayout
      hubId="sales"
      pageTitle="Sales Pipeline"
      stats={stats}
      actions={actions}
      fixedMenu={null}
    >
      <div className="p-6 space-y-6">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {pipelineStages.map((stage, index) => (
            <div key={stage.id} className="flex-shrink-0 w-72">
              <Card className="h-full">
                <CardHeader className={`${stage.color} rounded-t-lg`}>
                  <CardTitle className="text-sm flex items-center justify-between">
                    {stage.name}
                    <Badge variant="secondary">{stage.deals.length}</Badge>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    ${stage.deals.reduce((sum, d) => sum + d.value, 0).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2 space-y-2">
                  {stage.deals.map((deal) => (
                    <Card
                      key={deal.id}
                      className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{deal.name}</h4>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {deal.contact}
                      </p>
                      <p className="text-sm font-semibold text-green-600 mt-2">
                        ${deal.value.toLocaleString()}
                      </p>
                    </Card>
                  ))}
                  <Button
                    variant="ghost"
                    className="w-full text-muted-foreground"
                    size="sm"
                    onClick={() => router.push('/sales/deals/new')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Deal
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </UnifiedLayout>
  );
}
