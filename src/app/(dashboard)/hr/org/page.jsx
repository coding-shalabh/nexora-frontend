'use client';

import { motion } from 'framer-motion';
import { GitBranch, Users, Building2, ChevronDown, ChevronRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const orgStructure = {
  name: 'CEO',
  person: 'John Smith',
  children: [
    {
      name: 'CTO',
      person: 'Sarah Johnson',
      department: 'Technology',
      children: [
        { name: 'Engineering Lead', person: 'Michael Chen', team: 'Backend Team (12)' },
        { name: 'Engineering Lead', person: 'Priya Sharma', team: 'Frontend Team (8)' },
        { name: 'DevOps Lead', person: 'Rahul Gupta', team: 'DevOps Team (5)' },
      ],
    },
    {
      name: 'CFO',
      person: 'Emily Brown',
      department: 'Finance',
      children: [
        { name: 'Finance Manager', person: 'David Wilson', team: 'Accounts Team (6)' },
        { name: 'Audit Head', person: 'Lisa Anderson', team: 'Audit Team (4)' },
      ],
    },
    {
      name: 'COO',
      person: 'James Miller',
      department: 'Operations',
      children: [
        { name: 'HR Director', person: 'Nina Patel', team: 'HR Team (8)' },
        { name: 'Admin Head', person: 'Tom Harris', team: 'Admin Team (10)' },
      ],
    },
    {
      name: 'CMO',
      person: 'Alice Cooper',
      department: 'Marketing',
      children: [
        { name: 'Marketing Lead', person: 'Bob Williams', team: 'Marketing Team (15)' },
        { name: 'Sales Director', person: 'Carol Davis', team: 'Sales Team (20)' },
      ],
    },
  ],
};

const stats = [
  { label: 'Departments', value: '8', icon: Building2 },
  { label: 'Teams', value: '24', icon: Users },
  { label: 'Managers', value: '32', icon: User },
  { label: 'Reporting Lines', value: '156', icon: GitBranch },
];

function OrgNode({ node, level = 0 }) {
  return (
    <div className={cn('relative', level > 0 && 'ml-8 mt-4')}>
      {level > 0 && (
        <div className="absolute left-0 top-0 w-4 h-8 border-l-2 border-b-2 border-gray-300 -translate-x-4" />
      )}
      <Card className="inline-block min-w-[200px]">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{node.person}</p>
              <p className="text-sm text-muted-foreground">{node.name}</p>
              {node.department && (
                <Badge variant="secondary" className="mt-1 text-xs">
                  {node.department}
                </Badge>
              )}
              {node.team && <p className="text-xs text-muted-foreground mt-1">{node.team}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
      {node.children && (
        <div className="space-y-2">
          {node.children.map((child, index) => (
            <OrgNode key={index} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrgChartPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Organization Chart</h1>
          <p className="text-muted-foreground">View company structure and reporting lines</p>
        </div>
        <Button variant="outline" className="gap-2">
          <GitBranch className="h-4 w-4" />
          Edit Structure
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Organization Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[800px] p-4">
            <OrgNode node={orgStructure} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
