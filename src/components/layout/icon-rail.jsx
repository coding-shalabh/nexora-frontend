'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Home,
  MessageSquare,
  Users,
  TrendingUp,
  Megaphone,
  HeadphonesIcon,
  ShoppingCart,
  FolderKanban,
  Zap,
  BarChart3,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// NOTE: Pipeline merged into Sales, Tickets merged into Service
const coreHubs = [
  { title: 'Home', href: '/dashboard', icon: Home, color: 'from-violet-500 to-purple-600' },
  {
    title: 'Inbox',
    href: '/inbox',
    icon: MessageSquare,
    color: 'from-green-500 to-emerald-500',
    badge: '3',
  },
  { title: 'CRM', href: '/crm', icon: Users, color: 'from-blue-500 to-cyan-500' },
  { title: 'Sales', href: '/sales', icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
  { title: 'Marketing', href: '/marketing', icon: Megaphone, color: 'from-pink-500 to-rose-600' },
  {
    title: 'Service',
    href: '/service',
    icon: HeadphonesIcon,
    color: 'from-orange-500 to-amber-500',
  },
  {
    title: 'Commerce',
    href: '/commerce',
    icon: ShoppingCart,
    color: 'from-cyan-500 to-blue-500',
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: FolderKanban,
    color: 'from-violet-500 to-purple-500',
  },
  { title: 'HR', href: '/hr', icon: Users, color: 'from-blue-500 to-indigo-500' },
  { title: 'Automation', href: '/automation', icon: Zap, color: 'from-yellow-500 to-orange-500' },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    color: 'from-fuchsia-500 to-pink-500',
  },
];

const bottomHubs = [
  { title: 'Settings', href: '/settings', icon: Settings, color: 'from-gray-500 to-slate-500' },
  { title: 'Help', href: '/help', icon: HelpCircle, color: 'from-gray-500 to-slate-500' },
];

export function IconRail() {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === '/dashboard')
      return pathname === '/dashboard' || pathname === '/' || pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const NavIcon = ({ item }) => {
    const active = isActive(item.href);

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={
              item.href === '/crm'
                ? '/crm/contacts'
                : item.href === '/sales'
                  ? '/sales/deals'
                  : item.href === '/service'
                    ? '/service/tickets'
                    : item.href === '/settings'
                      ? '/settings/organization'
                      : item.href
            }
            aria-label={item.title}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200',
                active
                  ? 'text-white shadow-lg'
                  : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
              )}
              style={active ? { background: '#0004c3' } : undefined}
            >
              <item.icon className="h-5 w-5" />
              {item.badge && (
                <span
                  className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
                  style={{ background: '#0004c3' }}
                >
                  {item.badge}
                </span>
              )}
            </motion.div>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-white border-0 px-3 py-2 shadow-lg">
          <span className="font-medium text-gray-900">{item.title}</span>
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className="flex h-full w-16 flex-col items-center py-3 border-r border-gray-200"
        style={{
          background: '#ecf4ff',
        }}
      >
        {/* Main Hubs */}
        <nav className="flex-1 flex flex-col items-center gap-1 overflow-y-auto px-2">
          {coreHubs.map((item) => (
            <NavIcon key={item.href} item={item} />
          ))}
        </nav>

        {/* Divider */}
        <div className="w-8 h-px bg-gray-200 my-2" />

        {/* Bottom Hubs */}
        <div className="flex flex-col items-center gap-1 px-2">
          {bottomHubs.map((item) => (
            <NavIcon key={item.href} item={item} />
          ))}
        </div>
      </aside>
    </TooltipProvider>
  );
}
