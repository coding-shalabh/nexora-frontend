'use client';

import { Mail, Plus, CheckCircle, Target, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

export default function CRMEmailsPage() {
  const stats = [
    createStat('Sent', '0', Mail, 'blue'),
    createStat('Opened', '0', CheckCircle, 'green'),
    createStat('Clicked', '0', Target, 'purple'),
    createStat('Replied', '0', MessageSquare, 'amber'),
  ];

  return (
    <HubLayout
      hubId="crm"
      showTopBar={false}
      showSidebar={false}
      title="Emails"
      description="Track email communications with contacts"
      stats={stats}
      showFixedMenu={false}
      actions={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Send Email
        </Button>
      }
    >
      <div className="h-full overflow-y-auto p-6">
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <Mail className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No emails tracked</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Connect your email to track communications automatically
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Connect Email
          </Button>
        </div>
      </div>
    </HubLayout>
  );
}
