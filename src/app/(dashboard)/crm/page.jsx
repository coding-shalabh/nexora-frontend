'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  Building2,
  Tag,
  Download,
  Upload,
  Plus,
  ArrowUpRight,
  Target,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { UnifiedLayout, createStat, createAction } from '@/components/layout/unified';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const quickActions = [
  {
    label: 'Add Contact',
    href: '/crm/contacts/new',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    label: 'Add Company',
    href: '/crm/companies/new',
    icon: Building2,
    color: 'from-purple-500 to-pink-500',
  },
  {
    label: 'Import Contacts',
    href: '/crm/import',
    icon: Upload,
    color: 'from-green-500 to-emerald-500',
  },
  {
    label: 'Export Data',
    href: '/crm/export',
    icon: Download,
    color: 'from-orange-500 to-amber-500',
  },
];

const crmTools = [
  { name: 'Contacts', description: 'People & leads', href: '/crm/contacts', icon: Users },
  { name: 'Companies', description: 'Organizations', href: '/crm/companies', icon: Building2 },
  { name: 'Segments', description: 'Contact groups', href: '/crm/segments', icon: Target },
  { name: 'Tags', description: 'Labels & categories', href: '/crm/tags', icon: Tag },
  { name: 'Activities', description: 'Calls & meetings', href: '/crm/activities', icon: Activity },
  { name: 'Import / Export', description: 'Data management', href: '/crm/import', icon: Upload },
];

export default function CRMPage() {
  const router = useRouter();

  const stats = [
    createStat('Contacts', '1,847', Users, 'blue'),
    createStat('Companies', '342', Building2, 'purple'),
    createStat('Segments', '12', Target, 'green'),
    createStat('Tags', '28', Tag, 'orange'),
  ];

  const actions = [
    createAction('Add Contact', Plus, () => router.push('/crm/contacts/new'), { primary: true }),
  ];

  return (
    <UnifiedLayout
      hubId="crm"
      pageTitle="CRM Overview"
      stats={stats}
      actions={actions}
      fixedMenu={null}
    >
      <div className="p-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <Card className="hover:shadow-md transition-all cursor-pointer group">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color}`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium text-sm group-hover:text-primary transition-colors">
                    {action.label}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* CRM Tools */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">CRM Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {crmTools.map((tool) => (
                <Link key={tool.name} href={tool.href}>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <tool.icon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{tool.name}</p>
                      <p className="text-xs text-muted-foreground">{tool.description}</p>
                    </div>
                    <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </UnifiedLayout>
  );
}
