'use client';

import { useState } from 'react';
import { UnifiedLayout } from '@/components/layout/unified';
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  Globe,
  Bell,
  Volume2,
  VolumeX,
  Keyboard,
  Languages,
  Calendar,
  Clock,
  Save,
  RotateCcw,
  Zap,
  Search,
  MessageSquare,
  Reply,
  CheckCircle,
  Timer,
  UserPlus,
  StickyNote,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Edit2,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Shortcut definitions with icons and descriptions
const SHORTCUT_DEFINITIONS = {
  quickReplies: {
    label: 'Quick Replies',
    description: 'Open quick replies picker',
    icon: Zap,
    category: 'Compose',
  },
  aiSuggestions: {
    label: 'AI Suggestions',
    description: 'Get AI-powered reply suggestions',
    icon: Sparkles,
    category: 'Compose',
  },
  search: {
    label: 'Search',
    description: 'Focus search input',
    icon: Search,
    category: 'Navigation',
  },
  newMessage: {
    label: 'New Message',
    description: 'Start a new conversation',
    icon: MessageSquare,
    category: 'Actions',
  },
  reply: {
    label: 'Reply',
    description: 'Focus reply input',
    icon: Reply,
    category: 'Actions',
  },
  resolve: {
    label: 'Resolve',
    description: 'Mark conversation as resolved',
    icon: CheckCircle,
    category: 'Actions',
  },
  snooze: {
    label: 'Snooze',
    description: 'Snooze conversation',
    icon: Timer,
    category: 'Actions',
  },
  assign: {
    label: 'Assign',
    description: 'Assign conversation to team/agent',
    icon: UserPlus,
    category: 'Actions',
  },
  addNote: {
    label: 'Add Note',
    description: 'Add internal note',
    icon: StickyNote,
    category: 'Actions',
  },
  nextConversation: {
    label: 'Next Conversation',
    description: 'Go to next conversation',
    icon: ChevronDown,
    category: 'Navigation',
  },
  prevConversation: {
    label: 'Previous Conversation',
    description: 'Go to previous conversation',
    icon: ChevronUp,
    category: 'Navigation',
  },
};

// Customizable keyboard shortcuts
const defaultShortcuts = {
  quickReplies: '/',
  search: 'ctrl+k',
  newMessage: 'n',
  reply: 'r',
  resolve: 'e',
  snooze: 's',
  assign: 'a',
  addNote: 'n',
  aiSuggestions: 'ctrl+.',
  nextConversation: 'j',
  prevConversation: 'k',
};

// Mock preferences
const defaultPreferences = {
  theme: 'system',
  language: 'en',
  timezone: 'Asia/Kolkata',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '12h',
  weekStart: 'monday',
  soundEnabled: true,
  desktopNotifications: true,
  emailDigest: 'daily',
  compactMode: false,
  showAvatars: true,
  autoArchive: false,
  keyboardShortcuts: true,
  shortcuts: defaultShortcuts,
};

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [isSaving, setIsSaving] = useState(false);
  const [editingShortcut, setEditingShortcut] = useState(null);
  const [shortcutValue, setShortcutValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handleReset = () => {
    setPreferences(defaultPreferences);
  };

  const handleEditShortcut = (key) => {
    setEditingShortcut(key);
    setShortcutValue(preferences.shortcuts[key] || '');
    setIsRecording(false);
  };

  const handleSaveShortcut = () => {
    if (editingShortcut && shortcutValue) {
      setPreferences({
        ...preferences,
        shortcuts: {
          ...preferences.shortcuts,
          [editingShortcut]: shortcutValue,
        },
      });
    }
    setEditingShortcut(null);
    setShortcutValue('');
    setIsRecording(false);
  };

  const handleRecordShortcut = (e) => {
    if (!isRecording) return;
    e.preventDefault();

    const parts = [];
    if (e.ctrlKey || e.metaKey) parts.push('ctrl');
    if (e.altKey) parts.push('alt');
    if (e.shiftKey) parts.push('shift');

    let key = e.key.toLowerCase();
    if (key === ' ') key = 'space';
    if (key !== 'control' && key !== 'alt' && key !== 'shift' && key !== 'meta') {
      parts.push(key);
      setShortcutValue(parts.join('+'));
      setIsRecording(false);
    }
  };

  const formatShortcut = (shortcut) => {
    if (!shortcut) return '-';
    return shortcut
      .split('+')
      .map((k) => {
        if (k === 'ctrl') return 'Ctrl';
        if (k === 'shift') return 'Shift';
        if (k === 'alt') return 'Alt';
        return k.toUpperCase();
      })
      .join(' + ');
  };

  // Group shortcuts by category
  const shortcutsByCategory = Object.entries(SHORTCUT_DEFINITIONS).reduce((acc, [key, def]) => {
    const category = def.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push({ key, ...def, value: preferences.shortcuts[key] });
    return acc;
  }, {});

  return (
    <UnifiedLayout hubId="settings" pageTitle="Preferences" fixedMenu={null}>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Preferences</h1>
            <p className="text-muted-foreground">Customize your Nexora experience</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset to Defaults
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>Customize how Nexora looks on your device</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Theme</Label>
              <RadioGroup
                value={preferences.theme}
                onValueChange={(value) => setPreferences({ ...preferences, theme: value })}
                className="grid grid-cols-3 gap-4"
              >
                <Label
                  htmlFor="theme-light"
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                    preferences.theme === 'light'
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-muted-foreground/50'
                  }`}
                >
                  <RadioGroupItem value="light" id="theme-light" className="sr-only" />
                  <Sun className="h-6 w-6" />
                  <span className="text-sm font-medium">Light</span>
                </Label>
                <Label
                  htmlFor="theme-dark"
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                    preferences.theme === 'dark'
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-muted-foreground/50'
                  }`}
                >
                  <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
                  <Moon className="h-6 w-6" />
                  <span className="text-sm font-medium">Dark</span>
                </Label>
                <Label
                  htmlFor="theme-system"
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                    preferences.theme === 'system'
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-muted-foreground/50'
                  }`}
                >
                  <RadioGroupItem value="system" id="theme-system" className="sr-only" />
                  <Monitor className="h-6 w-6" />
                  <span className="text-sm font-medium">System</span>
                </Label>
              </RadioGroup>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="font-medium">Compact Mode</p>
                <p className="text-sm text-muted-foreground">
                  Use smaller spacing and fonts throughout the app
                </p>
              </div>
              <Switch
                checked={preferences.compactMode}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, compactMode: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="font-medium">Show Avatars</p>
                <p className="text-sm text-muted-foreground">
                  Display user avatars in lists and conversations
                </p>
              </div>
              <Switch
                checked={preferences.showAvatars}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, showAvatars: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Language & Region */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Language & Region
            </CardTitle>
            <CardDescription>Set your language, timezone, and date preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select
                  value={preferences.language}
                  onValueChange={(value) => setPreferences({ ...preferences, language: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                    <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                    <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                    <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                    <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select
                  value={preferences.timezone}
                  onValueChange={(value) => setPreferences({ ...preferences, timezone: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Kolkata">India Standard Time (IST)</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                    <SelectItem value="Asia/Dubai">Gulf Standard Time (GST)</SelectItem>
                    <SelectItem value="Asia/Singapore">Singapore Time (SGT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date Format</Label>
                <Select
                  value={preferences.dateFormat}
                  onValueChange={(value) => setPreferences({ ...preferences, dateFormat: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (15/01/2024)</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (01/15/2024)</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2024-01-15)</SelectItem>
                    <SelectItem value="DD-MMM-YYYY">DD-MMM-YYYY (15-Jan-2024)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Time Format</Label>
                <Select
                  value={preferences.timeFormat}
                  onValueChange={(value) => setPreferences({ ...preferences, timeFormat: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour (2:30 PM)</SelectItem>
                    <SelectItem value="24h">24-hour (14:30)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <Label>Week Starts On</Label>
              <RadioGroup
                value={preferences.weekStart}
                onValueChange={(value) => setPreferences({ ...preferences, weekStart: value })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sunday" id="week-sunday" />
                  <Label htmlFor="week-sunday">Sunday</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monday" id="week-monday" />
                  <Label htmlFor="week-monday">Monday</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="saturday" id="week-saturday" />
                  <Label htmlFor="week-saturday">Saturday</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Notifications & Sounds */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications & Sounds
            </CardTitle>
            <CardDescription>Control how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {preferences.soundEnabled ? (
                  <Volume2 className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <VolumeX className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">Sound Effects</p>
                  <p className="text-sm text-muted-foreground">
                    Play sounds for notifications and actions
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.soundEnabled}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, soundEnabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="font-medium">Desktop Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Show browser notifications for new messages
                </p>
              </div>
              <Switch
                checked={preferences.desktopNotifications}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, desktopNotifications: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="font-medium">Email Digest</p>
                <p className="text-sm text-muted-foreground">Receive email summaries of activity</p>
              </div>
              <Select
                value={preferences.emailDigest}
                onValueChange={(value) => setPreferences({ ...preferences, emailDigest: value })}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Behavior */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Behavior
            </CardTitle>
            <CardDescription>Configure app behavior and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Keyboard Shortcuts</p>
                <p className="text-sm text-muted-foreground">
                  Use keyboard shortcuts for quick actions
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  View Shortcuts
                </Button>
                <Switch
                  checked={preferences.keyboardShortcuts}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, keyboardShortcuts: checked })
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="font-medium">Auto-archive Conversations</p>
                <p className="text-sm text-muted-foreground">
                  Automatically archive resolved conversations after 7 days
                </p>
              </div>
              <Switch
                checked={preferences.autoArchive}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, autoArchive: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Customizable Keyboard Shortcuts */}
        {preferences.keyboardShortcuts && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                Customize Keyboard Shortcuts
              </CardTitle>
              <CardDescription>
                Click on any shortcut to customize it. Press the key combination you want to use.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(shortcutsByCategory).map(([category, shortcuts]) => (
                <div key={category} className="space-y-3">
                  <p className="text-sm font-semibold text-muted-foreground">{category}</p>
                  <div className="space-y-2">
                    {shortcuts.map((shortcut) => {
                      const Icon = shortcut.icon;
                      return (
                        <div
                          key={shortcut.key}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{shortcut.label}</p>
                              <p className="text-xs text-muted-foreground">
                                {shortcut.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <kbd className="px-2.5 py-1 text-xs font-mono bg-muted rounded border min-w-[60px] text-center">
                              {formatShortcut(shortcut.value)}
                            </kbd>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleEditShortcut(shortcut.key)}
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Tip: For Quick Replies, you can also type{' '}
                  <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">/</kbd> at the start of
                  an empty message to open the picker.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Shortcut Dialog */}
        <Dialog open={!!editingShortcut} onOpenChange={() => setEditingShortcut(null)}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Edit Keyboard Shortcut</DialogTitle>
              <DialogDescription>
                {editingShortcut && SHORTCUT_DEFINITIONS[editingShortcut]?.label}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Current Shortcut</Label>
                <div
                  className={`
                  flex items-center justify-center h-16 rounded-lg border-2 border-dashed
                  ${isRecording ? 'border-primary bg-primary/5' : 'border-muted'}
                  transition-colors cursor-pointer
                `}
                  onClick={() => setIsRecording(true)}
                  onKeyDown={handleRecordShortcut}
                  tabIndex={0}
                >
                  {isRecording ? (
                    <p className="text-sm text-muted-foreground animate-pulse">
                      Press your shortcut keys...
                    </p>
                  ) : shortcutValue ? (
                    <kbd className="px-4 py-2 text-lg font-mono bg-muted rounded">
                      {formatShortcut(shortcutValue)}
                    </kbd>
                  ) : (
                    <p className="text-sm text-muted-foreground">Click to record shortcut</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Or type manually</Label>
                <Input
                  value={shortcutValue}
                  onChange={(e) => setShortcutValue(e.target.value)}
                  placeholder="e.g., ctrl+/, /, ctrl+shift+r"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Use lowercase. Combine with +. Examples: /, ctrl+k, ctrl+shift+p
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingShortcut(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveShortcut}>Save Shortcut</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </UnifiedLayout>
  );
}
