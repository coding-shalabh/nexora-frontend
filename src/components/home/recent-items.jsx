'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  User,
  Building2,
  Kanban,
  Ticket,
  MessageSquare,
  Clock,
  Pin,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BentoCard } from '@/components/ui/glass-card';

// Mock recent items - replace with API data
const recentItems = [
  {
    id: 'c1',
    type: 'contact',
    title: 'Sarah Johnson',
    subtitle: 'sarah@acme.com',
    icon: User,
    route: '/crm/contacts/c1',
    lastOpenedAt: '5 mins ago',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'd1',
    type: 'deal',
    title: 'Enterprise License',
    subtitle: 'Acme Corp • $45,000',
    icon: Kanban,
    route: '/pipeline/deals/d1',
    lastOpenedAt: '15 mins ago',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 't1',
    type: 'ticket',
    title: 'Ticket #128',
    subtitle: 'Payment Issue',
    icon: Ticket,
    route: '/tickets/t1',
    lastOpenedAt: '1 hour ago',
    color: 'from-orange-500 to-amber-500',
  },
  {
    id: 'conv1',
    type: 'conversation',
    title: 'Mike Chen',
    subtitle: '+91 98765...',
    icon: MessageSquare,
    route: '/inbox/conv1',
    lastOpenedAt: '2 hours ago',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'comp1',
    type: 'company',
    title: 'TechCorp Inc',
    subtitle: '5 contacts',
    icon: Building2,
    route: '/crm/companies/comp1',
    lastOpenedAt: '3 hours ago',
    color: 'from-indigo-500 to-violet-500',
  },
];

// Mock pinned items
const pinnedItems = [
  {
    id: 'pin1',
    title: 'My Hot Deals',
    type: 'view',
    route: '/pipeline/deals?filter=hot&owner=me',
    icon: Kanban,
  },
  {
    id: 'pin2',
    title: 'Unassigned Chats',
    type: 'view',
    route: '/inbox?filter=unassigned',
    icon: MessageSquare,
  },
];

const typeLabels = {
  contact: 'Contact',
  deal: 'Deal',
  ticket: 'Ticket',
  conversation: 'Chat',
  company: 'Company',
  view: 'View',
};

export function RecentItems() {
  return (
    <BentoCard>
      <div className="space-y-6">
        {/* Pinned Items */}
        {pinnedItems.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Pin className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-muted-foreground">Pinned</h3>
            </div>
            <div className="space-y-2">
              {pinnedItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={item.route}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{typeLabels[item.type]}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-muted-foreground">Recent</h3>
            </div>
            <Link
              href="/recent"
              className="text-xs text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {recentItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={item.route}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                  >
                    <motion.div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br shadow-sm',
                        item.color
                      )}
                      whileHover={{ scale: 1.1 }}
                    >
                      <item.icon className="h-4 w-4 text-white" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="truncate">{item.subtitle}</span>
                        <span>•</span>
                        <span className="shrink-0">{item.lastOpenedAt}</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </BentoCard>
  );
}
