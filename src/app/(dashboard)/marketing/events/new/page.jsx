'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Calendar,
  MapPin,
  Users,
  Clock,
  Video,
  Globe,
  Building,
  Image as ImageIcon,
  Plus,
  X,
  DollarSign,
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

const eventTypes = [
  { value: 'webinar', label: 'Webinar', icon: Video },
  { value: 'conference', label: 'Conference', icon: Building },
  { value: 'workshop', label: 'Workshop', icon: Users },
  { value: 'meetup', label: 'Meetup', icon: Users },
  { value: 'virtual', label: 'Virtual Event', icon: Globe },
  { value: 'hybrid', label: 'Hybrid Event', icon: MapPin },
];

export default function NewEventPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('basics');

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    timezone: 'PST',
    location: '',
    isVirtual: false,
    virtualUrl: '',
    capacity: '',
    enableRegistration: true,
    registrationDeadline: '',
    tags: [],
    ticketTypes: [{ name: 'General', price: 0, capacity: '' }],
  });

  const [currentTag, setCurrentTag] = useState('');

  const addTag = () => {
    if (currentTag && !formData.tags.includes(currentTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addTicketType = () => {
    setFormData(prev => ({
      ...prev,
      ticketTypes: [...prev.ticketTypes, { name: '', price: 0, capacity: '' }]
    }));
  };

  const removeTicketType = (index) => {
    setFormData(prev => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter((_, i) => i !== index)
    }));
  };

  const updateTicketType = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      ticketTypes: prev.ticketTypes.map((ticket, i) =>
        i === index ? { ...ticket, [field]: value } : ticket
      )
    }));
  };

  const handleSubmit = () => {
    console.log('Creating event:', formData);
    router.push('/marketing/events');
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/marketing/events">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create New Event</h1>
            <p className="text-muted-foreground">Set up your event and start collecting registrations</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/marketing/events">Cancel</Link>
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Form Tabs */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basics">
              <Calendar className="mr-2 h-4 w-4" />
              Basics
            </TabsTrigger>
            <TabsTrigger value="location">
              <MapPin className="mr-2 h-4 w-4" />
              Location
            </TabsTrigger>
            <TabsTrigger value="registration">
              <Users className="mr-2 h-4 w-4" />
              Registration
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Plus className="mr-2 h-4 w-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          {/* Basics Tab */}
          <TabsContent value="basics" className="space-y-6 p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Event Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Product Launch Webinar 2024"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Event Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your event, what attendees will learn, and what to expect..."
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">Event Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PST">PST (Pacific)</SelectItem>
                      <SelectItem value="MST">MST (Mountain)</SelectItem>
                      <SelectItem value="CST">CST (Central)</SelectItem>
                      <SelectItem value="EST">EST (Eastern)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="IST">IST (India)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="startTime"
                      type="time"
                      className="pl-10"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="endTime"
                      type="time"
                      className="pl-10"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Location Tab */}
          <TabsContent value="location" className="space-y-6 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label>Virtual Event</Label>
                  <p className="text-sm text-muted-foreground">
                    This event will be held online
                  </p>
                </div>
                <Switch
                  checked={formData.isVirtual}
                  onCheckedChange={(checked) => setFormData({ ...formData, isVirtual: checked })}
                />
              </div>

              {formData.isVirtual ? (
                <div className="space-y-2">
                  <Label htmlFor="virtualUrl">Virtual Event URL</Label>
                  <div className="relative">
                    <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="virtualUrl"
                      type="url"
                      placeholder="https://zoom.us/j/..."
                      className="pl-10"
                      value={formData.virtualUrl}
                      onChange={(e) => setFormData({ ...formData, virtualUrl: e.target.value })}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Meeting link will be sent to registered attendees
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="location">Event Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="Enter venue address"
                      className="pl-10"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Registration Tab */}
          <TabsContent value="registration" className="space-y-6 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label>Enable Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow people to register for this event
                  </p>
                </div>
                <Switch
                  checked={formData.enableRegistration}
                  onCheckedChange={(checked) => setFormData({ ...formData, enableRegistration: checked })}
                />
              </div>

              {formData.enableRegistration && (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Event Capacity</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="capacity"
                          type="number"
                          placeholder="500"
                          className="pl-10"
                          value={formData.capacity}
                          onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Registration Deadline</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.registrationDeadline}
                        onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Ticket Types</Label>
                        <p className="text-sm text-muted-foreground">
                          Configure different ticket types for your event
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={addTicketType}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Ticket
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {formData.ticketTypes.map((ticket, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="flex-1 grid gap-3 md:grid-cols-3">
                                <div className="space-y-2">
                                  <Label>Ticket Name</Label>
                                  <Input
                                    placeholder="e.g., VIP, Early Bird"
                                    value={ticket.name}
                                    onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Price ($)</Label>
                                  <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      className="pl-10"
                                      value={ticket.price}
                                      onChange={(e) => updateTicketType(index, 'price', parseFloat(e.target.value))}
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label>Capacity</Label>
                                  <Input
                                    type="number"
                                    placeholder="Unlimited"
                                    value={ticket.capacity}
                                    onChange={(e) => updateTicketType(index, 'capacity', e.target.value)}
                                  />
                                </div>
                              </div>
                              {formData.ticketTypes.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeTicketType(index)}
                                  className="mt-7"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6 p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Event Tags</Label>
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

              <div className="space-y-2">
                <Label htmlFor="image">Event Image</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 5MB
                  </p>
                  <Input
                    id="image"
                    type="file"
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href="/marketing/events">Cancel</Link>
        </Button>
        <Button onClick={handleSubmit}>
          <Save className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>
    </div>
  );
}
