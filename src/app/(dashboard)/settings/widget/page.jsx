'use client';

import { useState, useEffect } from 'react';
import {
  MessageCircle,
  Settings,
  Palette,
  Code,
  Copy,
  Check,
  Eye,
  Save,
  Loader2,
  Globe,
  Clock,
  User,
  Bell,
  ExternalLink,
  X,
  Send,
  Smile,
  Paperclip,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

export default function WidgetSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Widget Settings
  const [settings, setSettings] = useState({
    enabled: true,
    position: 'bottom-right',
    primaryColor: '#6366f1',
    headerText: 'Chat with us',
    welcomeMessage: "Hi there! How can we help you today?",
    offlineMessage: "We're currently offline. Leave us a message and we'll get back to you.",
    placeholder: 'Type your message...',
    showAgentAvatar: true,
    showAgentName: true,
    collectEmailBeforeChat: true,
    emailRequired: true,
    allowAttachments: true,
    showPoweredBy: true,
    notificationSound: true,
    autoOpen: false,
    autoOpenDelay: 5,
    domains: '',
  });

  // Business Hours
  const [businessHours, setBusinessHours] = useState({
    enabled: false,
    timezone: 'Asia/Kolkata',
    schedule: {
      monday: { enabled: true, start: '09:00', end: '18:00' },
      tuesday: { enabled: true, start: '09:00', end: '18:00' },
      wednesday: { enabled: true, start: '09:00', end: '18:00' },
      thursday: { enabled: true, start: '09:00', end: '18:00' },
      friday: { enabled: true, start: '09:00', end: '18:00' },
      saturday: { enabled: false, start: '09:00', end: '18:00' },
      sunday: { enabled: false, start: '09:00', end: '18:00' },
    },
  });

  // Pre-chat form fields
  const [prechatFields, setPrechatFields] = useState([
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
  ]);

  const generateEmbedCode = () => {
    return `<!-- Nexora Live Chat Widget -->
<script>
  (function(w,d,s,l,i){
    w[l]=w[l]||[];
    var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s);
    j.async=true;
    j.src='https://widget.crm360.app/chat.js';
    j.setAttribute('data-widget-id', '${crypto.randomUUID()}');
    f.parentNode.insertBefore(j,f);
  })(window,document,'script','crm360',[]);
</script>
<!-- End Nexora Live Chat Widget -->`;
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await api.post('/settings/integrations', {
        type: 'widget',
        name: 'Live Chat Widget',
        provider: 'crm360',
        config: { settings, businessHours, prechatFields },
      });
      // Show success
    } catch (error) {
      console.error('Failed to save widget settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generateEmbedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Live Chat Widget</h1>
          <p className="text-muted-foreground">
            Configure your website chat widget for customer support
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enabled: checked }))}
            />
            <Label>{settings.enabled ? 'Enabled' : 'Disabled'}</Label>
          </div>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="col-span-2 space-y-6">
          <Tabs defaultValue="appearance" className="space-y-4">
            <TabsList>
              <TabsTrigger value="appearance">
                <Palette className="h-4 w-4 mr-2" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="behavior">
                <Settings className="h-4 w-4 mr-2" />
                Behavior
              </TabsTrigger>
              <TabsTrigger value="hours">
                <Clock className="h-4 w-4 mr-2" />
                Business Hours
              </TabsTrigger>
              <TabsTrigger value="install">
                <Code className="h-4 w-4 mr-2" />
                Installation
              </TabsTrigger>
            </TabsList>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Widget Appearance</CardTitle>
                  <CardDescription>Customize how the chat widget looks on your website</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primary-color"
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="w-12 h-10 p-1 cursor-pointer"
                        />
                        <Input
                          value={settings.primaryColor}
                          onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Widget Position</Label>
                      <Select
                        value={settings.position}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, position: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bottom-right">Bottom Right</SelectItem>
                          <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="header-text">Header Text</Label>
                    <Input
                      id="header-text"
                      placeholder="Chat with us"
                      value={settings.headerText}
                      onChange={(e) => setSettings(prev => ({ ...prev, headerText: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="welcome-message">Welcome Message</Label>
                    <Textarea
                      id="welcome-message"
                      placeholder="Hi there! How can we help you today?"
                      value={settings.welcomeMessage}
                      onChange={(e) => setSettings(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="offline-message">Offline Message</Label>
                    <Textarea
                      id="offline-message"
                      placeholder="We're currently offline..."
                      value={settings.offlineMessage}
                      onChange={(e) => setSettings(prev => ({ ...prev, offlineMessage: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="placeholder">Input Placeholder</Label>
                    <Input
                      id="placeholder"
                      placeholder="Type your message..."
                      value={settings.placeholder}
                      onChange={(e) => setSettings(prev => ({ ...prev, placeholder: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Agent Avatar</Label>
                        <p className="text-sm text-muted-foreground">Display agent profile picture</p>
                      </div>
                      <Switch
                        checked={settings.showAgentAvatar}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showAgentAvatar: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Agent Name</Label>
                        <p className="text-sm text-muted-foreground">Display agent name in chat</p>
                      </div>
                      <Switch
                        checked={settings.showAgentName}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showAgentName: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Powered By</Label>
                        <p className="text-sm text-muted-foreground">Display "Powered by Nexora" branding</p>
                      </div>
                      <Switch
                        checked={settings.showPoweredBy}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showPoweredBy: checked }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Behavior Tab */}
            <TabsContent value="behavior" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Widget Behavior</CardTitle>
                  <CardDescription>Configure how the chat widget behaves</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Collect Email Before Chat</Label>
                        <p className="text-sm text-muted-foreground">Ask for visitor email before starting chat</p>
                      </div>
                      <Switch
                        checked={settings.collectEmailBeforeChat}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, collectEmailBeforeChat: checked }))}
                      />
                    </div>

                    {settings.collectEmailBeforeChat && (
                      <div className="flex items-center justify-between pl-4 border-l-2">
                        <div>
                          <Label>Email Required</Label>
                          <p className="text-sm text-muted-foreground">Make email mandatory</p>
                        </div>
                        <Switch
                          checked={settings.emailRequired}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailRequired: checked }))}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Allow Attachments</Label>
                        <p className="text-sm text-muted-foreground">Let visitors send files</p>
                      </div>
                      <Switch
                        checked={settings.allowAttachments}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowAttachments: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Notification Sound</Label>
                        <p className="text-sm text-muted-foreground">Play sound on new messages</p>
                      </div>
                      <Switch
                        checked={settings.notificationSound}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notificationSound: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto Open Widget</Label>
                        <p className="text-sm text-muted-foreground">Automatically open chat after delay</p>
                      </div>
                      <Switch
                        checked={settings.autoOpen}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoOpen: checked }))}
                      />
                    </div>

                    {settings.autoOpen && (
                      <div className="pl-4 border-l-2 space-y-2">
                        <Label htmlFor="auto-open-delay">Auto Open Delay (seconds)</Label>
                        <Input
                          id="auto-open-delay"
                          type="number"
                          min={1}
                          value={settings.autoOpenDelay}
                          onChange={(e) => setSettings(prev => ({ ...prev, autoOpenDelay: parseInt(e.target.value) }))}
                          className="w-32"
                        />
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <Label htmlFor="domains">Allowed Domains</Label>
                    <Textarea
                      id="domains"
                      placeholder="example.com&#10;subdomain.example.com"
                      value={settings.domains}
                      onChange={(e) => setSettings(prev => ({ ...prev, domains: e.target.value }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      One domain per line. Leave empty to allow all domains.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Business Hours Tab */}
            <TabsContent value="hours" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Business Hours</CardTitle>
                  <CardDescription>Set when your team is available for live chat</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Business Hours</Label>
                      <p className="text-sm text-muted-foreground">Show offline message outside business hours</p>
                    </div>
                    <Switch
                      checked={businessHours.enabled}
                      onCheckedChange={(checked) => setBusinessHours(prev => ({ ...prev, enabled: checked }))}
                    />
                  </div>

                  {businessHours.enabled && (
                    <>
                      <div className="space-y-2">
                        <Label>Timezone</Label>
                        <Select
                          value={businessHours.timezone}
                          onValueChange={(value) => setBusinessHours(prev => ({ ...prev, timezone: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                            <SelectItem value="Europe/London">London (GMT)</SelectItem>
                            <SelectItem value="Asia/Singapore">Singapore (SGT)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3 pt-4">
                        {Object.entries(businessHours.schedule).map(([day, config]) => (
                          <div key={day} className="flex items-center gap-4">
                            <Switch
                              checked={config.enabled}
                              onCheckedChange={(checked) => setBusinessHours(prev => ({
                                ...prev,
                                schedule: {
                                  ...prev.schedule,
                                  [day]: { ...config, enabled: checked }
                                }
                              }))}
                            />
                            <span className="w-24 capitalize">{day}</span>
                            {config.enabled ? (
                              <>
                                <Input
                                  type="time"
                                  value={config.start}
                                  onChange={(e) => setBusinessHours(prev => ({
                                    ...prev,
                                    schedule: {
                                      ...prev.schedule,
                                      [day]: { ...config, start: e.target.value }
                                    }
                                  }))}
                                  className="w-32"
                                />
                                <span>to</span>
                                <Input
                                  type="time"
                                  value={config.end}
                                  onChange={(e) => setBusinessHours(prev => ({
                                    ...prev,
                                    schedule: {
                                      ...prev.schedule,
                                      [day]: { ...config, end: e.target.value }
                                    }
                                  }))}
                                  className="w-32"
                                />
                              </>
                            ) : (
                              <span className="text-muted-foreground">Closed</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Installation Tab */}
            <TabsContent value="install" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Installation Code</CardTitle>
                  <CardDescription>Add this code to your website to enable live chat</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{generateEmbedCode()}</code>
                    </pre>
                    <Button
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={copyToClipboard}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 mr-1" />
                      ) : (
                        <Copy className="h-4 w-4 mr-1" />
                      )}
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">Installation Instructions</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
                      <li>Copy the code above</li>
                      <li>Paste it just before the closing <code className="bg-yellow-100 px-1 rounded">&lt;/body&gt;</code> tag</li>
                      <li>Save and deploy your website</li>
                      <li>The chat widget will appear on your website</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Widget Preview */}
              <div className="relative bg-gray-100 rounded-lg h-[500px] p-4">
                {/* Fake website */}
                <div className="bg-white rounded shadow-sm p-4 mb-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>

                {/* Widget Button */}
                <div
                  className={cn(
                    'absolute bottom-4',
                    settings.position === 'bottom-right' ? 'right-4' : 'left-4'
                  )}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                </div>

                {/* Chat Window Preview (Collapsed) */}
                <div
                  className={cn(
                    'absolute bottom-20 w-80 bg-white rounded-lg shadow-xl border overflow-hidden',
                    settings.position === 'bottom-right' ? 'right-4' : 'left-4'
                  )}
                >
                  {/* Header */}
                  <div
                    className="p-4 text-white flex items-center justify-between"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    <div className="flex items-center gap-3">
                      {settings.showAgentAvatar && (
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          <User className="h-5 w-5" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{settings.headerText}</div>
                        {settings.showAgentName && (
                          <div className="text-xs opacity-80">Agent</div>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Chat Body */}
                  <div className="h-48 p-4 overflow-y-auto">
                    <div className="flex gap-2">
                      {settings.showAgentAvatar && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                      )}
                      <div
                        className="bg-gray-100 rounded-lg p-3 text-sm max-w-[80%]"
                      >
                        {settings.welcomeMessage}
                      </div>
                    </div>
                  </div>

                  {/* Input */}
                  <div className="border-t p-3">
                    <div className="flex items-center gap-2">
                      {settings.allowAttachments && (
                        <Button variant="ghost" size="icon" className="text-gray-400">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      )}
                      <Input
                        placeholder={settings.placeholder}
                        className="flex-1"
                        disabled
                      />
                      <Button size="icon" style={{ backgroundColor: settings.primaryColor }}>
                        <Send className="h-4 w-4 text-white" />
                      </Button>
                    </div>
                    {settings.showPoweredBy && (
                      <div className="text-center text-xs text-gray-400 mt-2">
                        Powered by Nexora
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
