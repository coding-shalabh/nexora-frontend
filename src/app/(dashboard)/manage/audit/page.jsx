'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  History,
  Filter,
  Download,
  User,
  FileText,
  Settings,
  Trash2,
  Edit,
  Plus,
  LogIn,
  LogOut,
  Shield,
  Calendar,
} from 'lucide-react';
import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Action types
const ACTION_TYPES = {
  create: { label: 'Created', icon: Plus, color: 'text-green-600 bg-green-100' },
  update: { label: 'Updated', icon: Edit, color: 'text-blue-600 bg-blue-100' },
  delete: { label: 'Deleted', icon: Trash2, color: 'text-red-600 bg-red-100' },
  login: { label: 'Logged In', icon: LogIn, color: 'text-purple-600 bg-purple-100' },
  logout: { label: 'Logged Out', icon: LogOut, color: 'text-gray-600 bg-gray-100' },
  settings: { label: 'Settings Changed', icon: Settings, color: 'text-orange-600 bg-orange-100' },
  export: { label: 'Exported', icon: Download, color: 'text-cyan-600 bg-cyan-100' },
};

// Mock audit logs
const mockLogs = [
  {
    id: '1',
    action: 'create',
    entity: 'Contact',
    entityName: 'John Smith',
    user: 'Sarah M.',
    userEmail: 'sarah@company.com',
    timestamp: '2024-01-15 14:32:15',
    ip: '192.168.1.100',
  },
  {
    id: '2',
    action: 'update',
    entity: 'Deal',
    entityName: 'Enterprise License',
    user: 'John D.',
    userEmail: 'john@company.com',
    timestamp: '2024-01-15 14:28:00',
    ip: '192.168.1.101',
    changes: 'Stage: Proposal → Negotiation',
  },
  {
    id: '3',
    action: 'delete',
    entity: 'Contact',
    entityName: 'Old Lead',
    user: 'Mike R.',
    userEmail: 'mike@company.com',
    timestamp: '2024-01-15 14:15:30',
    ip: '192.168.1.102',
  },
  {
    id: '4',
    action: 'login',
    entity: 'User',
    entityName: 'sarah@company.com',
    user: 'Sarah M.',
    userEmail: 'sarah@company.com',
    timestamp: '2024-01-15 09:00:00',
    ip: '192.168.1.100',
  },
  {
    id: '5',
    action: 'settings',
    entity: 'Organization',
    entityName: 'Email Settings',
    user: 'Admin',
    userEmail: 'admin@company.com',
    timestamp: '2024-01-15 08:45:00',
    ip: '192.168.1.1',
    changes: 'SMTP server updated',
  },
  {
    id: '6',
    action: 'export',
    entity: 'Contacts',
    entityName: '1,234 records',
    user: 'John D.',
    userEmail: 'john@company.com',
    timestamp: '2024-01-14 16:30:00',
    ip: '192.168.1.101',
  },
  {
    id: '7',
    action: 'create',
    entity: 'Company',
    entityName: 'Acme Corp',
    user: 'Sarah M.',
    userEmail: 'sarah@company.com',
    timestamp: '2024-01-14 15:20:00',
    ip: '192.168.1.100',
  },
  {
    id: '8',
    action: 'update',
    entity: 'Template',
    entityName: 'Welcome Email',
    user: 'Marketing',
    userEmail: 'marketing@company.com',
    timestamp: '2024-01-14 14:00:00',
    ip: '192.168.1.105',
    changes: 'Content updated',
  },
];

export default function ManageAuditPage() {
  const [logs] = useState(mockLogs);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.entityName.toLowerCase().includes(search.toLowerCase()) ||
        log.user.toLowerCase().includes(search.toLowerCase());
      const matchesAction = actionFilter === 'all' || log.action === actionFilter;
      return matchesSearch && matchesAction;
    });
  }, [logs, search, actionFilter]);

  const layoutStats = [
    createStat('Total', logs.length, History, 'blue'),
    createStat('Created', logs.filter((l) => l.action === 'create').length, Plus, 'green'),
    createStat('Updated', logs.filter((l) => l.action === 'update').length, Edit, 'yellow'),
    createStat('Logins', logs.filter((l) => l.action === 'login').length, LogIn, 'purple'),
  ];

  const actionButtons = (
    <div className="flex items-center gap-2">
      <Select value={actionFilter} onValueChange={setActionFilter}>
        <SelectTrigger className="w-[140px] h-9">
          <SelectValue placeholder="All Actions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Actions</SelectItem>
          {Object.entries(ACTION_TYPES).map(([key, val]) => (
            <SelectItem key={key} value={key}>
              {val.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm" className="gap-2">
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );

  const mainContent = (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Logs Timeline */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredLogs.map((log, index) => {
              const action = ACTION_TYPES[log.action];
              const Icon = action.icon;

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className={cn('p-2 rounded-lg', action.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="font-normal">
                        {action.label}
                      </Badge>
                      <span className="font-medium">{log.entity}:</span>
                      <span className="text-muted-foreground">{log.entityName}</span>
                    </div>
                    {log.changes && (
                      <p className="text-sm text-muted-foreground mt-1">Changes: {log.changes}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {log.user}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {log.timestamp}
                      </span>
                      <span className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        {log.ip}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {filteredLogs.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No audit logs found</h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <HubLayout
      hubId="manage"
      title="Audit Logs"
      description="Track all changes and activities in your workspace"
      stats={layoutStats}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search by user or entity..."
      actions={actionButtons}
      showFixedMenu={false}
    >
      {mainContent}
    </HubLayout>
  );
}
