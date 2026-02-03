'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Keyboard,
  X,
  Home,
  LayoutDashboard,
  MessageSquare,
  Users,
  Kanban,
  TrendingUp,
  Megaphone,
  HeadphonesIcon,
  ShoppingCart,
  FolderKanban,
  Calendar,
  Zap,
  BarChart3,
  Wallet,
  Search,
  Plus,
  Command,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// App navigation order for cycling
const appNavigation = [
  { name: 'Home', path: '/home', icon: Home },
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Inbox', path: '/inbox', icon: MessageSquare },
  { name: 'CRM', path: '/crm/contacts', icon: Users },
  { name: 'Pipeline', path: '/pipeline/leads', icon: Kanban },
  { name: 'Sales', path: '/sales/workspace', icon: TrendingUp },
  { name: 'Marketing', path: '/marketing/campaigns', icon: Megaphone },
  { name: 'Service', path: '/tickets', icon: HeadphonesIcon },
  { name: 'Commerce', path: '/commerce/orders', icon: ShoppingCart },
  { name: 'Projects', path: '/projects', icon: FolderKanban },
  { name: 'Meetings', path: '/calendar', icon: Calendar },
  { name: 'Automation', path: '/automation', icon: Zap },
  { name: 'Reporting', path: '/analytics', icon: BarChart3 },
  { name: 'Wallet', path: '/wallet', icon: Wallet },
];

// Keyboard shortcut definitions
const shortcutGroups = [
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['Ctrl', '['], description: 'Previous app', icon: ArrowLeft },
      { keys: ['Ctrl', ']'], description: 'Next app', icon: ArrowRight },
      { keys: ['Ctrl', 'K'], description: 'Command palette', icon: Search },
      { keys: ['G', 'H'], description: 'Go to Home', icon: Home },
      { keys: ['G', 'D'], description: 'Go to Dashboard', icon: LayoutDashboard },
      { keys: ['G', 'I'], description: 'Go to Inbox', icon: MessageSquare },
      { keys: ['G', 'C'], description: 'Go to CRM', icon: Users },
      { keys: ['G', 'P'], description: 'Go to Pipeline', icon: Kanban },
      { keys: ['G', 'S'], description: 'Go to Sales', icon: TrendingUp },
    ],
  },
  {
    title: 'Actions',
    shortcuts: [
      { keys: ['N'], description: 'New item (context aware)' },
      { keys: ['E'], description: 'Edit selected' },
      { keys: ['D'], description: 'Delete selected' },
      { keys: ['Esc'], description: 'Close modal / Cancel' },
      { keys: ['/'], description: 'Focus search' },
    ],
  },
  {
    title: 'General',
    shortcuts: [
      { keys: ['?'], description: 'Show keyboard shortcuts' },
      { keys: ['Ctrl', 'Shift', 'P'], description: 'Toggle command palette' },
      { keys: ['Ctrl', 'S'], description: 'Save changes' },
      { keys: ['Ctrl', 'Z'], description: 'Undo' },
    ],
  },
];

export function KeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();
  const [showHelp, setShowHelp] = useState(false);
  const [gKeyPressed, setGKeyPressed] = useState(false);
  const [lastNavApp, setLastNavApp] = useState(null);
  const [showNavToast, setShowNavToast] = useState(false);

  // Find current app index
  const getCurrentAppIndex = useCallback(() => {
    for (let i = 0; i < appNavigation.length; i++) {
      if (pathname.startsWith(appNavigation[i].path.split('/').slice(0, 2).join('/'))) {
        return i;
      }
      // Special case for root paths
      if (appNavigation[i].path === pathname) {
        return i;
      }
    }
    return 0; // Default to Home
  }, [pathname]);

  // Navigate to app
  const navigateToApp = useCallback((index) => {
    const app = appNavigation[index];
    if (app) {
      setLastNavApp(app);
      setShowNavToast(true);
      router.push(app.path);
      setTimeout(() => setShowNavToast(false), 1500);
    }
  }, [router]);

  // Handle keyboard shortcuts
  useEffect(() => {
    let gTimeout;

    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable
      ) {
        return;
      }

      // ? - Show help
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowHelp(true);
        return;
      }

      // Escape - Close help
      if (e.key === 'Escape') {
        setShowHelp(false);
        setGKeyPressed(false);
        return;
      }

      // Ctrl+[ - Previous app
      if ((e.ctrlKey || e.metaKey) && e.key === '[') {
        e.preventDefault();
        const currentIndex = getCurrentAppIndex();
        const prevIndex = currentIndex === 0 ? appNavigation.length - 1 : currentIndex - 1;
        navigateToApp(prevIndex);
        return;
      }

      // Ctrl+] - Next app
      if ((e.ctrlKey || e.metaKey) && e.key === ']') {
        e.preventDefault();
        const currentIndex = getCurrentAppIndex();
        const nextIndex = (currentIndex + 1) % appNavigation.length;
        navigateToApp(nextIndex);
        return;
      }

      // G key combos for navigation
      if (e.key.toLowerCase() === 'g' && !e.ctrlKey && !e.metaKey) {
        setGKeyPressed(true);
        clearTimeout(gTimeout);
        gTimeout = setTimeout(() => setGKeyPressed(false), 1000);
        return;
      }

      if (gKeyPressed) {
        e.preventDefault();
        setGKeyPressed(false);

        switch (e.key.toLowerCase()) {
          case 'h':
            router.push('/home');
            break;
          case 'd':
            router.push('/dashboard');
            break;
          case 'i':
            router.push('/inbox');
            break;
          case 'c':
            router.push('/crm/contacts');
            break;
          case 'p':
            router.push('/pipeline/leads');
            break;
          case 's':
            router.push('/sales/workspace');
            break;
          case 'm':
            router.push('/marketing/campaigns');
            break;
          case 't':
            router.push('/tickets');
            break;
          case 'o':
            router.push('/commerce/orders');
            break;
          case 'r':
            router.push('/analytics');
            break;
          case 'a':
            router.push('/automation');
            break;
          case 'w':
            router.push('/wallet');
            break;
          default:
            break;
        }
        return;
      }

      // / - Focus search
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const searchInput = document.querySelector('[data-search-input]');
        if (searchInput) {
          searchInput.focus();
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(gTimeout);
    };
  }, [gKeyPressed, getCurrentAppIndex, navigateToApp, router]);

  return (
    <>
      {/* Navigation Toast */}
      <AnimatePresence>
        {showNavToast && lastNavApp && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-3 px-4 py-3 bg-foreground text-background rounded-xl shadow-2xl">
              <div className="p-2 rounded-lg bg-primary/20">
                <lastNavApp.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Navigating to {lastNavApp.name}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* G key indicator */}
      <AnimatePresence>
        {gKeyPressed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className="flex items-center gap-2 px-3 py-2 bg-foreground text-background rounded-lg shadow-lg">
              <kbd className="px-2 py-1 text-xs font-mono bg-background/20 rounded">G</kbd>
              <span className="text-sm">then press a key...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Help Dialog */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Keyboard Shortcuts
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {shortcutGroups.map((group) => (
              <div key={group.title} className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                  {group.title}
                </h3>
                <div className="space-y-2">
                  {group.shortcuts.map((shortcut, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        {shortcut.icon && <shortcut.icon className="h-4 w-4 text-muted-foreground" />}
                        <span className="text-sm">{shortcut.description}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIdx) => (
                          <span key={keyIdx} className="flex items-center gap-1">
                            <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border shadow-sm">
                              {key}
                            </kbd>
                            {keyIdx < shortcut.keys.length - 1 && (
                              <span className="text-muted-foreground text-xs">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Navigation Apps */}
          <div className="mt-6 pt-4 border-t">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
              App Navigation (Ctrl+[ / Ctrl+])
            </h3>
            <div className="flex flex-wrap gap-2">
              {appNavigation.map((app, index) => {
                const Icon = app.icon;
                const isCurrentApp = getCurrentAppIndex() === index;
                return (
                  <div
                    key={app.name}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs ${
                      isCurrentApp
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    {app.name}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Press <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded">?</kbd> anytime to show this help
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Export keyboard shortcut indicator for header
export function KeyboardShortcutIndicator({ onClick }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="hidden md:flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
    >
      <Keyboard className="h-4 w-4" />
      <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-muted rounded">?</kbd>
    </Button>
  );
}
