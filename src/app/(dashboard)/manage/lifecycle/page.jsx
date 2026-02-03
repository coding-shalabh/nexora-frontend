'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Repeat, ArrowRight, Users, Percent, UserCheck } from 'lucide-react';
import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Lifecycle stages
const mockStages = [
  {
    id: '1',
    name: 'Subscriber',
    color: 'bg-gray-500',
    contacts: 2345,
    description: 'Newsletter or content subscribers',
  },
  {
    id: '2',
    name: 'Lead',
    color: 'bg-blue-500',
    contacts: 1234,
    description: 'Showed initial interest',
  },
  {
    id: '3',
    name: 'MQL',
    color: 'bg-purple-500',
    contacts: 567,
    description: 'Marketing Qualified Lead',
  },
  {
    id: '4',
    name: 'SQL',
    color: 'bg-primary',
    contacts: 234,
    description: 'Sales Qualified Lead',
  },
  {
    id: '5',
    name: 'Opportunity',
    color: 'bg-orange-500',
    contacts: 156,
    description: 'Active sales opportunity',
  },
  {
    id: '6',
    name: 'Customer',
    color: 'bg-green-500',
    contacts: 890,
    description: 'Paying customer',
  },
  {
    id: '7',
    name: 'Evangelist',
    color: 'bg-pink-500',
    contacts: 123,
    description: 'Brand advocates and referrers',
  },
  { id: '8', name: 'Churned', color: 'bg-red-500', contacts: 45, description: 'Former customers' },
];

export default function ManageLifecyclePage() {
  const [stages] = useState(mockStages);
  const totalContacts = stages.reduce((sum, s) => sum + s.contacts, 0);
  const customerCount = stages.find((s) => s.name === 'Customer')?.contacts || 0;
  const conversionRate = ((customerCount / totalContacts) * 100).toFixed(1);

  const layoutStats = [
    createStat('Stages', stages.length, Repeat, 'blue'),
    createStat('Contacts', totalContacts, Users, 'purple'),
    createStat('Customers', customerCount, UserCheck, 'green'),
    createStat('Conversion', `${conversionRate}%`, Percent, 'orange'),
  ];

  const actionButtons = (
    <Button size="sm" className="gap-2">
      <Plus className="h-4 w-4" />
    </Button>
  );

  const mainContent = (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Lifecycle Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lifecycle Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between overflow-x-auto pb-4">
            {stages
              .filter((s) => s.name !== 'Churned')
              .map((stage, index, arr) => (
                <div key={stage.id} className="flex items-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center min-w-[100px]"
                  >
                    <div
                      className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold',
                        stage.color
                      )}
                    >
                      {stage.contacts}
                    </div>
                    <p className="text-sm font-medium mt-2 text-center">{stage.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {((stage.contacts / totalContacts) * 100).toFixed(1)}%
                    </p>
                  </motion.div>
                  {index < arr.length - 1 && (
                    <ArrowRight className="h-5 w-5 text-muted-foreground mx-2 flex-shrink-0" />
                  )}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Stages List */}
      <div className="space-y-3">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={cn('w-4 h-4 rounded-full', stage.color)} />
                  <div className="flex-1">
                    <p className="font-semibold">{stage.name}</p>
                    <p className="text-sm text-muted-foreground">{stage.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      <Users className="h-3 w-3 mr-1" />
                      {stage.contacts.toLocaleString()}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <HubLayout
      hubId="manage"
      title="Lifecycle Stages"
      description="Define the customer journey from lead to advocate"
      stats={layoutStats}
      actions={actionButtons}
      showFixedMenu={false}
    >
      {mainContent}
    </HubLayout>
  );
}
