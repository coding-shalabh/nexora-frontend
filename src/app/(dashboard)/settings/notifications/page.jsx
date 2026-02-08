'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { testNotificationSound } from '@/hooks/use-notifications';
import {
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Volume2,
  VolumeX,
  Save,
  Clock,
  Zap,
  Shield,
  Loader2,
  BellRing,
  BellOff,
  Chrome,
  Monitor,
  RefreshCw,
  Copy,
  ExternalLink,
  Key,
  Settings2,
  TestTube,
} from 'lucide-react';

import { HubLayout } from '@/components/layout/hub-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Available notification sounds
const notificationSounds = [
  { id: 'default', name: 'Default', file: '/sounds/notification.mp3' },
  { id: 'chime', name: 'Chime', file: '/sounds/chime.mp3' },
  { id: 'ding', name: 'Ding', file: '/sounds/ding.mp3' },
  { id: 'pop', name: 'Pop', file: '/sounds/pop.mp3' },
  { id: 'bell', name: 'Bell', file: '/sounds/bell.mp3' },
  { id: 'none', name: 'No Sound', file: null },
];

// Mock notification settings
const defaultSettings = {
  // Inbox notifications
  newMessage: { inApp: true, email: false, push: true },
  messageAssigned: { inApp: true, email: true, push: true },
  messageMentioned: { inApp: true, email: true, push: true },
  conversationResolved: { inApp: true, email: false, push: false },
  slaWarning: { inApp: true, email: true, push: true },

  // Team notifications
  teamMemberAdded: { inApp: true, email: true, push: false },
  teamMemberRemoved: { inApp: true, email: true, push: false },
  roleChanged: { inApp: true, email: true, push: false },

  // Campaign notifications
  campaignStarted: { inApp: true, email: false, push: false },
  campaignCompleted: { inApp: true, email: true, push: false },
  campaignFailed: { inApp: true, email: true, push: true },

  // System notifications
  systemMaintenance: { inApp: true, email: true, push: false },
  securityAlert: { inApp: true, email: true, push: true },
  billingAlert: { inApp: true, email: true, push: false },

  // Quiet hours
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',

  // Digest
  dailyDigest: true,
  weeklyReport: true,

  // Sound settings
  soundEnabled: true,
  soundId: 'default',
  soundVolume: 70,
};

const notificationCategories = [
  {
    id: 'inbox',
    title: 'Inbox & Conversations',
    icon: MessageSquare,
    notifications: [
      {
        id: 'newMessage',
        label: 'New message received',
        description: 'When a contact sends a new message',
      },
      {
        id: 'messageAssigned',
        label: 'Conversation assigned to you',
        description: 'When a conversation is assigned to you',
      },
      {
        id: 'messageMentioned',
        label: 'Mentioned in conversation',
        description: 'When someone @mentions you',
      },
      {
        id: 'conversationResolved',
        label: 'Conversation resolved',
        description: 'When a conversation is marked as resolved',
      },
      {
        id: 'slaWarning',
        label: 'SLA warning',
        description: 'When a conversation is approaching SLA breach',
      },
    ],
  },
  {
    id: 'team',
    title: 'Team & Users',
    icon: Users,
    notifications: [
      {
        id: 'teamMemberAdded',
        label: 'New team member',
        description: 'When someone joins your workspace',
      },
      {
        id: 'teamMemberRemoved',
        label: 'Team member removed',
        description: 'When someone leaves the workspace',
      },
      {
        id: 'roleChanged',
        label: 'Role changed',
        description: 'When your role or permissions change',
      },
    ],
  },
  {
    id: 'campaigns',
    title: 'Campaigns & Broadcasts',
    icon: Zap,
    notifications: [
      {
        id: 'campaignStarted',
        label: 'Campaign started',
        description: 'When a scheduled campaign begins',
      },
      {
        id: 'campaignCompleted',
        label: 'Campaign completed',
        description: 'When a campaign finishes sending',
      },
      {
        id: 'campaignFailed',
        label: 'Campaign failed',
        description: 'When a campaign encounters errors',
      },
    ],
  },
  {
    id: 'system',
    title: 'System & Security',
    icon: Shield,
    notifications: [
      {
        id: 'systemMaintenance',
        label: 'System maintenance',
        description: 'Scheduled maintenance notices',
      },
      {
        id: 'securityAlert',
        label: 'Security alerts',
        description: 'Suspicious login attempts or security issues',
      },
      {
        id: 'billingAlert',
        label: 'Billing alerts',
        description: 'Payment issues or subscription changes',
      },
    ],
  },
];

export default function NotificationsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState(defaultSettings);
  const [activeTab, setActiveTab] = useState('channels');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Push notification state
  const [pushPermission, setPushPermission] = useState('default');
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [fcmToken, setFcmToken] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [firebaseConfig, setFirebaseConfig] = useState({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    vapidKey: '',
  });

  // Load notification settings from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await api.get('/settings/notifications');
        if (response.data?.data) {
          // Merge API settings with defaults (in case API has fewer fields)
          setSettings((prev) => ({ ...prev, ...response.data.data }));
        }
      } catch (error) {
        console.error('Failed to load notification settings:', error);
        // Use defaults if API fails
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  // Check browser notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushPermission(Notification.permission);
    }
  }, []);

  // Request browser notification permission
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support push notifications');
      return;
    }

    setIsRequestingPermission(true);
    try {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);

      if (permission === 'granted') {
        // In a real app, you would initialize Firebase and get FCM token here
        // For demo purposes, we'll generate a mock token
        const mockToken =
          'fcm_' +
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);
        setFcmToken(mockToken);
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    } finally {
      setIsRequestingPermission(false);
    }
  };

  // Send test notification
  const sendTestNotification = async () => {
    if (pushPermission !== 'granted') {
      alert('Please enable notifications first');
      return;
    }

    setIsSendingTest(true);
    try {
      // Show a local test notification
      new Notification('Nexora Test Notification', {
        body: 'Push notifications are working correctly!',
        icon: '/favicon.png',
        badge: '/favicon.png',
        tag: 'test-notification',
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error sending test notification:', error);
    } finally {
      setIsSendingTest(false);
    }
  };

  // Copy FCM token to clipboard
  const copyToken = () => {
    navigator.clipboard.writeText(fcmToken);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.patch('/settings/notifications', settings);
      toast({
        title: 'Settings saved',
        description: 'Your notification preferences have been updated.',
      });
    } catch (error) {
      console.error('Failed to save notification settings:', error);
      toast({
        title: 'Failed to save',
        description: error.response?.data?.message || 'Could not save notification settings.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateNotification = (id, channel, value) => {
    setSettings({
      ...settings,
      [id]: {
        ...settings[id],
        [channel]: value,
      },
    });
  };

  const toggleAllForChannel = (channel, value) => {
    const updated = { ...settings };
    notificationCategories.forEach((category) => {
      category.notifications.forEach((notif) => {
        if (updated[notif.id]) {
          updated[notif.id][channel] = value;
        }
      });
    });
    setSettings(updated);
  };

  if (isLoading) {
    return (
      <HubLayout
        hubId="settings"
        showFixedMenu={false}
        title="Notification Settings"
        description="Choose how and when you want to be notified"
      >
        <div className="flex-1 flex items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </HubLayout>
    );
  }

  return (
    <HubLayout
      hubId="settings"
      showFixedMenu={false}
      title="Notification Settings"
      description="Choose how and when you want to be notified"
      actions={
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      }
    >
      <div className="flex-1 space-y-6 p-6 overflow-auto">
        {/* Quick Settings */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">In-App</p>
                    <p className="text-sm text-muted-foreground">Notifications in the app</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-100 p-2">
                    <Mail className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">Email notifications</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-100 p-2">
                    <Smartphone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Push</p>
                    <p className="text-sm text-muted-foreground">Mobile push notifications</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="channels">By Category</TabsTrigger>
            <TabsTrigger value="sound">Sound</TabsTrigger>
            <TabsTrigger value="push">Push Setup</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="digest">Email Digest</TabsTrigger>
          </TabsList>

          {/* By Category */}
          <TabsContent value="channels" className="space-y-4 mt-4">
            {notificationCategories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <category.icon className="h-5 w-5" />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Header row */}
                    <div className="flex items-center justify-end gap-8 pr-4 pb-2 border-b">
                      <div className="w-16 text-center">
                        <span className="text-xs font-medium text-muted-foreground">In-App</span>
                      </div>
                      <div className="w-16 text-center">
                        <span className="text-xs font-medium text-muted-foreground">Email</span>
                      </div>
                      <div className="w-16 text-center">
                        <span className="text-xs font-medium text-muted-foreground">Push</span>
                      </div>
                    </div>

                    {/* Notification rows */}
                    {category.notifications.map((notif) => (
                      <div key={notif.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{notif.label}</p>
                          <p className="text-sm text-muted-foreground">{notif.description}</p>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="w-16 flex justify-center">
                            <Switch
                              checked={settings[notif.id]?.inApp}
                              onCheckedChange={(checked) =>
                                updateNotification(notif.id, 'inApp', checked)
                              }
                            />
                          </div>
                          <div className="w-16 flex justify-center">
                            <Switch
                              checked={settings[notif.id]?.email}
                              onCheckedChange={(checked) =>
                                updateNotification(notif.id, 'email', checked)
                              }
                            />
                          </div>
                          <div className="w-16 flex justify-center">
                            <Switch
                              checked={settings[notif.id]?.push}
                              onCheckedChange={(checked) =>
                                updateNotification(notif.id, 'push', checked)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Sound Settings */}
          <TabsContent value="sound" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Notification Sound
                </CardTitle>
                <CardDescription>
                  Configure sound alerts for incoming messages and notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Enable Sound Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Sound Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Play a sound when new messages arrive
                    </p>
                  </div>
                  <Switch
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, soundEnabled: checked })
                    }
                  />
                </div>

                {settings.soundEnabled && (
                  <>
                    {/* Sound Selection */}
                    <div className="space-y-3 pt-4 border-t">
                      <Label>Notification Sound</Label>
                      <div className="grid gap-2">
                        {notificationSounds.map((sound) => (
                          <div
                            key={sound.id}
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                              settings.soundId === sound.id
                                ? 'border-primary bg-primary/5'
                                : 'hover:bg-muted/50'
                            }`}
                            onClick={() => setSettings({ ...settings, soundId: sound.id })}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                                  settings.soundId === sound.id
                                    ? 'border-primary'
                                    : 'border-muted-foreground'
                                }`}
                              >
                                {settings.soundId === sound.id && (
                                  <div className="h-2 w-2 rounded-full bg-primary" />
                                )}
                              </div>
                              <span className="font-medium">{sound.name}</span>
                            </div>
                            {sound.file && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Play sound preview
                                  const audio = new Audio(sound.file);
                                  audio.volume = settings.soundVolume / 100;
                                  audio.play().catch(() => {
                                    // Sound file doesn't exist yet, show toast
                                    console.log('Sound file not found:', sound.file);
                                  });
                                }}
                              >
                                <Volume2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Volume Control */}
                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <Label>Volume</Label>
                        <span className="text-sm text-muted-foreground">
                          {settings.soundVolume}%
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <VolumeX className="h-4 w-4 text-muted-foreground" />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={settings.soundVolume}
                          onChange={(e) =>
                            setSettings({ ...settings, soundVolume: parseInt(e.target.value) })
                          }
                          className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <Volume2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>

                    {/* Test Sound */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <p className="font-medium">Test Sound</p>
                        <p className="text-sm text-muted-foreground">
                          Preview the selected notification sound
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (settings.soundId !== 'none') {
                            testNotificationSound(settings.soundId, settings.soundVolume / 100);
                          }
                        }}
                        disabled={settings.soundId === 'none'}
                      >
                        <Volume2 className="mr-2 h-4 w-4" />
                        Play Sound
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sound Settings Per Channel</CardTitle>
                <CardDescription>Customize sounds for different message channels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-100 p-2">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">WhatsApp Messages</p>
                      <p className="text-sm text-muted-foreground">
                        Sound for WhatsApp notifications
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-100 p-2">
                      <Mail className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Email Messages</p>
                      <p className="text-sm text-muted-foreground">Sound for email notifications</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <Smartphone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">SMS Messages</p>
                      <p className="text-sm text-muted-foreground">Sound for SMS notifications</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Push Setup */}
          <TabsContent value="push" className="space-y-4 mt-4">
            {/* Browser Permission Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BellRing className="h-5 w-5" />
                  Browser Notifications
                </CardTitle>
                <CardDescription>
                  Enable push notifications in your browser to receive real-time alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Permission Status */}
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div
                      className={`rounded-full p-3 ${
                        pushPermission === 'granted'
                          ? 'bg-green-100'
                          : pushPermission === 'denied'
                            ? 'bg-red-100'
                            : 'bg-yellow-100'
                      }`}
                    >
                      {pushPermission === 'granted' ? (
                        <BellRing className={`h-6 w-6 text-green-600`} />
                      ) : pushPermission === 'denied' ? (
                        <BellOff className={`h-6 w-6 text-red-600`} />
                      ) : (
                        <Bell className={`h-6 w-6 text-yellow-600`} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {pushPermission === 'granted'
                          ? 'Notifications Enabled'
                          : pushPermission === 'denied'
                            ? 'Notifications Blocked'
                            : 'Notifications Not Set'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {pushPermission === 'granted'
                          ? 'You will receive push notifications'
                          : pushPermission === 'denied'
                            ? 'Please enable notifications in browser settings'
                            : 'Click the button to enable notifications'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {pushPermission === 'granted' && (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Active
                      </Badge>
                    )}
                    {pushPermission !== 'granted' && (
                      <Button
                        onClick={requestNotificationPermission}
                        disabled={isRequestingPermission || pushPermission === 'denied'}
                      >
                        {isRequestingPermission ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Requesting...
                          </>
                        ) : (
                          <>
                            <Bell className="mr-2 h-4 w-4" />
                            Enable Notifications
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Blocked Notification Help */}
                {pushPermission === 'denied' && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Notifications Blocked</AlertTitle>
                    <AlertDescription>
                      <p className="mb-2">
                        You have blocked notifications for this site. To enable them:
                      </p>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Click the lock/info icon in your browser's address bar</li>
                        <li>Find "Notifications" in the permissions list</li>
                        <li>Change the setting to "Allow"</li>
                        <li>Refresh this page</li>
                      </ol>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Test Notification */}
                {pushPermission === 'granted' && (
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="font-medium">Test Notification</p>
                      <p className="text-sm text-muted-foreground">
                        Send a test notification to verify everything is working
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={sendTestNotification}
                      disabled={isSendingTest}
                    >
                      {isSendingTest ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <TestTube className="mr-2 h-4 w-4" />
                          Send Test
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Device Token Card */}
            {pushPermission === 'granted' && fcmToken && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Device Token
                  </CardTitle>
                  <CardDescription>
                    Your device's unique push notification identifier
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Input value={fcmToken} readOnly className="font-mono text-xs" />
                    <Button variant="outline" size="icon" onClick={copyToken}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    This token is used to send push notifications to your device
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Firebase Configuration (Admin Only) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings2 className="h-5 w-5" />
                  Firebase Cloud Messaging Configuration
                  <Badge variant="secondary">Admin</Badge>
                </CardTitle>
                <CardDescription>
                  Configure Firebase Cloud Messaging for push notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Setup Required</AlertTitle>
                  <AlertDescription>
                    To enable push notifications, you need to create a Firebase project and
                    configure FCM.{' '}
                    <a
                      href="https://firebase.google.com/docs/cloud-messaging"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline inline-flex items-center gap-1"
                    >
                      Learn more <ExternalLink className="h-3 w-3" />
                    </a>
                  </AlertDescription>
                </Alert>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      placeholder="AIza..."
                      value={firebaseConfig.apiKey}
                      onChange={(e) =>
                        setFirebaseConfig({ ...firebaseConfig, apiKey: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="authDomain">Auth Domain</Label>
                    <Input
                      id="authDomain"
                      placeholder="your-project.firebaseapp.com"
                      value={firebaseConfig.authDomain}
                      onChange={(e) =>
                        setFirebaseConfig({ ...firebaseConfig, authDomain: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectId">Project ID</Label>
                    <Input
                      id="projectId"
                      placeholder="your-project-id"
                      value={firebaseConfig.projectId}
                      onChange={(e) =>
                        setFirebaseConfig({ ...firebaseConfig, projectId: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storageBucket">Storage Bucket</Label>
                    <Input
                      id="storageBucket"
                      placeholder="your-project.appspot.com"
                      value={firebaseConfig.storageBucket}
                      onChange={(e) =>
                        setFirebaseConfig({ ...firebaseConfig, storageBucket: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="messagingSenderId">Messaging Sender ID</Label>
                    <Input
                      id="messagingSenderId"
                      placeholder="123456789012"
                      value={firebaseConfig.messagingSenderId}
                      onChange={(e) =>
                        setFirebaseConfig({ ...firebaseConfig, messagingSenderId: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="appId">App ID</Label>
                    <Input
                      id="appId"
                      placeholder="1:123456789:web:abc123"
                      value={firebaseConfig.appId}
                      onChange={(e) =>
                        setFirebaseConfig({ ...firebaseConfig, appId: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vapidKey">VAPID Key (Web Push Certificate)</Label>
                  <Input
                    id="vapidKey"
                    placeholder="BNz..."
                    value={firebaseConfig.vapidKey}
                    onChange={(e) =>
                      setFirebaseConfig({ ...firebaseConfig, vapidKey: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Found in Firebase Console → Project Settings → Cloud Messaging → Web Push
                    Certificates
                  </p>
                </div>

                <div className="flex justify-end pt-4">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Firebase Config
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Supported Browsers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Browser Support</CardTitle>
                <CardDescription>Push notifications work in these browsers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <Chrome className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium">Chrome</p>
                      <p className="text-xs text-muted-foreground">Version 50+</p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-green-600 ml-auto" />
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <Monitor className="h-8 w-8 text-orange-500" />
                    <div>
                      <p className="font-medium">Firefox</p>
                      <p className="text-xs text-muted-foreground">Version 44+</p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-green-600 ml-auto" />
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <Monitor className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-medium">Edge</p>
                      <p className="text-xs text-muted-foreground">Version 17+</p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-green-600 ml-auto" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule */}
          <TabsContent value="schedule" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Quiet Hours
                </CardTitle>
                <CardDescription>
                  Pause non-urgent notifications during specific hours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Quiet Hours</p>
                    <p className="text-sm text-muted-foreground">
                      Only urgent notifications will be delivered during quiet hours
                    </p>
                  </div>
                  <Switch
                    checked={settings.quietHoursEnabled}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, quietHoursEnabled: checked })
                    }
                  />
                </div>

                {settings.quietHoursEnabled && (
                  <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Select
                        value={settings.quietHoursStart}
                        onValueChange={(value) =>
                          setSettings({ ...settings, quietHoursStart: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, '0');
                            return (
                              <SelectItem key={hour} value={`${hour}:00`}>
                                {`${hour}:00`}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Select
                        value={settings.quietHoursEnd}
                        onValueChange={(value) =>
                          setSettings({ ...settings, quietHoursEnd: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, '0');
                            return (
                              <SelectItem key={hour} value={`${hour}:00`}>
                                {`${hour}:00`}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Urgent Notifications</CardTitle>
                <CardDescription>
                  These notifications will always be delivered, even during quiet hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">SLA breach warnings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Security alerts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Campaign failures</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Digest */}
          <TabsContent value="digest" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Summaries
                </CardTitle>
                <CardDescription>Receive periodic summaries of your activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Daily Digest</p>
                    <p className="text-sm text-muted-foreground">
                      Summary of yesterday's conversations and tasks
                    </p>
                  </div>
                  <Switch
                    checked={settings.dailyDigest}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, dailyDigest: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="font-medium">Weekly Report</p>
                    <p className="text-sm text-muted-foreground">
                      Weekly summary with metrics and insights
                    </p>
                  </div>
                  <Switch
                    checked={settings.weeklyReport}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, weeklyReport: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Digest Preview</CardTitle>
                <CardDescription>What your daily digest includes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border p-4 bg-muted/50">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Conversations handled: 24</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                      <span>New messages: 156</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span>Average response time: 4m 32s</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      <span>New contacts: 12</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </HubLayout>
  );
}
