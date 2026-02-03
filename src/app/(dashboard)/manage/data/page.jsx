'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  Upload,
  Download,
  GitMerge,
  Trash2,
  RefreshCw,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// Data tools
const dataTools = [
  {
    id: 'import',
    name: 'Import Data',
    description: 'Import contacts, companies, deals from CSV or Excel',
    icon: Upload,
    color: 'from-green-500 to-emerald-500',
    action: 'Start Import',
  },
  {
    id: 'export',
    name: 'Export Data',
    description: 'Export your data to CSV or Excel format',
    icon: Download,
    color: 'from-blue-500 to-cyan-500',
    action: 'Export',
  },
  {
    id: 'merge',
    name: 'Merge Duplicates',
    description: 'Find and merge duplicate records',
    icon: GitMerge,
    color: 'from-purple-500 to-pink-500',
    action: 'Find Duplicates',
  },
  {
    id: 'cleanup',
    name: 'Data Cleanup',
    description: 'Clean up invalid emails, phones, and empty fields',
    icon: RefreshCw,
    color: 'from-orange-500 to-amber-500',
    action: 'Run Cleanup',
  },
];

// Recent imports
const recentImports = [
  {
    id: '1',
    name: 'contacts_jan2024.csv',
    type: 'Contacts',
    records: 1234,
    status: 'completed',
    date: '2024-01-15',
  },
  {
    id: '2',
    name: 'companies_q4.xlsx',
    type: 'Companies',
    records: 567,
    status: 'completed',
    date: '2024-01-14',
  },
  {
    id: '3',
    name: 'deals_export.csv',
    type: 'Deals',
    records: 89,
    status: 'failed',
    date: '2024-01-13',
    error: '3 rows failed validation',
  },
  {
    id: '4',
    name: 'leads_list.csv',
    type: 'Leads',
    records: 456,
    status: 'processing',
    date: '2024-01-12',
    progress: 67,
  },
];

// Data health
const dataHealth = [
  { label: 'Valid Emails', value: 94, total: 12500 },
  { label: 'Valid Phones', value: 87, total: 8900 },
  { label: 'Complete Records', value: 78, total: 15000 },
  { label: 'Duplicate-Free', value: 96, total: 15000 },
];

export default function ManageDataPage() {
  const avgHealth = useMemo(
    () => Math.round(dataHealth.reduce((sum, d) => sum + d.value, 0) / dataHealth.length),
    []
  );
  const totalRecords = useMemo(() => Math.max(...dataHealth.map((d) => d.total)), []);

  const layoutStats = [
    createStat('Tools', dataTools.length, Database, 'blue'),
    createStat('Health', `${avgHealth}%`, Activity, avgHealth >= 90 ? 'green' : 'yellow'),
    createStat('Records', totalRecords, FileSpreadsheet, 'purple'),
    createStat('Imports', recentImports.length, Upload, 'orange'),
  ];

  const mainContent = (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Data Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dataTools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className={cn('p-4 rounded-xl bg-gradient-to-br mb-4', tool.color)}>
                  <tool.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{tool.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                <Button variant="outline" size="sm" className="mt-auto">
                  {tool.action}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Data Health */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data Health</CardTitle>
          <CardDescription>Overview of your data quality</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {dataHealth.map((metric) => (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{metric.label}</span>
                  <span
                    className={cn(
                      'text-sm font-bold',
                      metric.value >= 90
                        ? 'text-green-600'
                        : metric.value >= 70
                          ? 'text-yellow-600'
                          : 'text-red-600'
                    )}
                  >
                    {metric.value}%
                  </span>
                </div>
                <Progress value={metric.value} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {metric.total.toLocaleString()} records
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Imports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Imports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentImports.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg border">
                <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.type} • {item.records.toLocaleString()} records • {item.date}
                  </p>
                </div>
                {item.status === 'completed' && (
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
                {item.status === 'failed' && (
                  <Badge className="bg-red-100 text-red-700">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Failed
                  </Badge>
                )}
                {item.status === 'processing' && (
                  <div className="flex items-center gap-2">
                    <Progress value={item.progress} className="w-20 h-2" />
                    <Badge className="bg-blue-100 text-blue-700">
                      <Clock className="h-3 w-3 mr-1" />
                      {item.progress}%
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <HubLayout
      hubId="manage"
      title="Data Tools"
      description="Import, export, merge, and clean your data"
      stats={layoutStats}
      showFixedMenu={false}
    >
      {mainContent}
    </HubLayout>
  );
}
