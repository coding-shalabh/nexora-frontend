'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Mail,
  Share2,
  Target,
  MessageSquare,
  Calendar,
  DollarSign,
  Users,
  Flag,
  Sparkles,
  Plus,
  X,
  Megaphone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { UnifiedLayout, createAction } from '@/components/layout/unified';

const channelOptions = [
  { id: 'email', label: 'Email Marketing', icon: Mail, color: 'bg-blue-100 text-blue-700' },
  { id: 'social', label: 'Social Media', icon: Share2, color: 'bg-purple-100 text-purple-700' },
  { id: 'ads', label: 'Paid Ads', icon: Target, color: 'bg-green-100 text-green-700' },
  {
    id: 'sms',
    label: 'SMS Marketing',
    icon: MessageSquare,
    color: 'bg-orange-100 text-orange-700',
  },
];

const campaignTypes = [
  { value: 'lead-generation', label: 'Lead Generation' },
  { value: 'brand-awareness', label: 'Brand Awareness' },
  { value: 'product-launch', label: 'Product Launch' },
  { value: 'event-promotion', label: 'Event Promotion' },
  { value: 'customer-retention', label: 'Customer Retention' },
  { value: 'nurture', label: 'Lead Nurture' },
  { value: 'other', label: 'Other' },
];

export default function NewCampaignPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('basics');

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    goal: '',
    startDate: '',
    endDate: '',
    budget: '',
    channels: [],
    targetAudience: '',
    owner: '',
    tags: [],
    autoStart: false,
  });

  const [currentTag, setCurrentTag] = useState('');

  const toggleChannel = (channelId) => {
    setFormData((prev) => ({
      ...prev,
      channels: prev.channels.includes(channelId)
        ? prev.channels.filter((c) => c !== channelId)
        : [...prev.channels, channelId],
    }));
  };

  const addTag = () => {
    if (currentTag && !formData.tags.includes(currentTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag],
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = () => {
    console.log('Creating campaign:', formData);
    router.push('/marketing/campaigns');
  };

  const actions = [
    createAction('Cancel', ArrowLeft, () => router.push('/marketing/campaigns')),
    createAction('Create Campaign', Save, handleSubmit, { primary: true }),
  ];

  return (
    <UnifiedLayout
      hubId="marketing"
      pageTitle="New Campaign"
      stats={[]}
      actions={actions}
      fixedMenu={null}
    >
      <div className="p-6 space-y-6 overflow-auto h-full">
        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basics">
                <Flag className="mr-2 h-4 w-4" />
                Basics
              </TabsTrigger>
              <TabsTrigger value="channels">
                <Share2 className="mr-2 h-4 w-4" />
                Channels
              </TabsTrigger>
              <TabsTrigger value="audience">
                <Users className="mr-2 h-4 w-4" />
                Audience
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Sparkles className="mr-2 h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Basics Tab */}
            <TabsContent value="basics" className="space-y-6 p-6">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Campaign Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Summer Product Launch 2024"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Campaign Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select campaign type" />
                      </SelectTrigger>
                      <SelectContent>
                        {campaignTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your campaign goals and strategy..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal">Campaign Goal</Label>
                  <Input
                    id="goal"
                    placeholder="e.g., Generate 500 qualified leads"
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  />
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="budget"
                        type="number"
                        placeholder="50000"
                        className="pl-10"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Channels Tab */}
            <TabsContent value="channels" className="space-y-6 p-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Select Marketing Channels</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Choose which channels you want to use for this campaign
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  {channelOptions.map((channel) => {
                    const Icon = channel.icon;
                    const isSelected = formData.channels.includes(channel.id);

                    return (
                      <Card
                        key={channel.id}
                        className={`cursor-pointer transition-all ${
                          isSelected ? 'border-primary ring-2 ring-primary ring-offset-2' : ''
                        }`}
                        onClick={() => toggleChannel(channel.id)}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${channel.color}`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <CardTitle className="text-base">{channel.label}</CardTitle>
                            </div>
                            <Switch checked={isSelected} />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {channel.id === 'email' &&
                              'Send targeted email campaigns to your audience'}
                            {channel.id === 'social' && 'Publish and schedule social media posts'}
                            {channel.id === 'ads' && 'Run paid advertising campaigns'}
                            {channel.id === 'sms' && 'Send SMS messages to engage customers'}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {formData.channels.length > 0 && (
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="font-medium">Selected Channels</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.channels.map((channelId) => {
                        const channel = channelOptions.find((c) => c.id === channelId);
                        const Icon = channel.icon;
                        return (
                          <Badge key={channelId} variant="secondary">
                            <Icon className="mr-1 h-3 w-3" />
                            {channel.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Audience Tab */}
            <TabsContent value="audience" className="space-y-6 p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Target Audience</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Define who you want to reach with this campaign
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Audience Description</Label>
                  <Textarea
                    id="targetAudience"
                    placeholder="Describe your target audience (demographics, interests, behaviors)..."
                    rows={4}
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  />
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Audience Segments</CardTitle>
                    <CardDescription>Select existing segments or create new ones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/marketing/segments">
                        <Plus className="mr-2 h-4 w-4" />
                        Browse Segments
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6 p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="owner">Campaign Owner</Label>
                  <Select
                    value={formData.owner}
                    onValueChange={(value) => setFormData({ ...formData, owner: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select campaign owner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user1">John Doe</SelectItem>
                      <SelectItem value="user2">Jane Smith</SelectItem>
                      <SelectItem value="user3">Bob Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag..."
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button type="button" onClick={addTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-start Campaign</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically start the campaign on the selected start date
                    </p>
                  </div>
                  <Switch
                    checked={formData.autoStart}
                    onCheckedChange={(checked) => setFormData({ ...formData, autoStart: checked })}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </UnifiedLayout>
  );
}
