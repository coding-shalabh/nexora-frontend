'use client';

import { useState } from 'react';
import { Users, Plus, Filter, Settings, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UnifiedLayout } from '@/components/layout/unified';

const mockCustomSegments = [
  { id: 1, name: 'High Value Leads', contacts: 45, rules: 3, status: 'active' },
  { id: 2, name: 'Enterprise Prospects', contacts: 23, rules: 5, status: 'active' },
  { id: 3, name: 'Churned Customers', contacts: 12, rules: 2, status: 'draft' },
];

export default function CustomSegmentsPage() {
  return (
    <UnifiedLayout hubId="crm" pageTitle="Custom Segments" fixedMenu={null}>
      <div className="p-6 space-y-6">
        <div className="grid gap-4">
          {mockCustomSegments.map((segment) => (
            <Card key={segment.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{segment.name}</CardTitle>
                  <CardDescription>
                    {segment.contacts} contacts • {segment.rules} rules
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={segment.status === 'active' ? 'default' : 'secondary'}>
                    {segment.status}
                  </Badge>
                  <Button variant="ghost" size="icon" aria-label="Edit segment">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Delete segment">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </UnifiedLayout>
  );
}
