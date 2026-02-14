'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Video,
  X,
  Loader2,
  ExternalLink,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UnifiedLayout } from '@/components/layout/unified';

export default function NewMeetingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    type: 'IN_PERSON',
    location: '',
    attendees: '',
    platform: null, // 'google_meet', 'teams', 'zoom'
  });

  const [connectedPlatforms, setConnectedPlatforms] = useState({
    google_meet: false,
    teams: false,
    zoom: false,
  });

  const meetingTypes = [
    { value: 'IN_PERSON', label: 'In-Person Meeting', icon: Users },
    { value: 'VIDEO_CALL', label: 'Video Call', icon: Video },
    { value: 'PHONE_CALL', label: 'Phone Call', icon: Clock },
  ];

  const meetingPlatforms = [
    {
      id: 'google_meet',
      name: 'Google Meet',
      logo: (
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="#00832d"
            d="M17 13h4v2h-4zm0-6h4v2h-4zm0 12h4v2h-4zM1 10h4v4H1zm0-6h4v4H1zm0 12h4v4H1z"
          />
          <path fill="#0066da" d="M7 7h10v10H7z" />
          <path fill="#e94235" d="M13 3h4v4h-4z" />
        </svg>
      ),
      color: 'from-green-500 to-emerald-600',
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      logo: (
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="#5059c9"
            d="M20.625 8.127v7.746a2.127 2.127 0 01-2.127 2.127H5.502a2.127 2.127 0 01-2.127-2.127V8.127A2.127 2.127 0 015.502 6h12.996a2.127 2.127 0 012.127 2.127z"
          />
          <path
            fill="#7b83eb"
            d="M18 6h-5.25v12H18a2.25 2.25 0 002.25-2.25v-7.5A2.25 2.25 0 0018 6z"
          />
        </svg>
      ),
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'zoom',
      name: 'Zoom',
      logo: (
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="#2d8cff"
            d="M21.5 12c0 5.247-4.253 9.5-9.5 9.5S2.5 17.247 2.5 12 6.753 2.5 12 2.5s9.5 4.253 9.5 9.5z"
          />
          <path
            fill="#fff"
            d="M15.5 8.5h-7c-.55 0-1 .45-1 1v5c0 .55.45 1 1 1h7c.55 0 1-.45 1-1v-5c0-.55-.45-1-1-1z"
          />
        </svg>
      ),
      color: 'from-blue-400 to-blue-600',
    },
  ];

  const handleConnectPlatform = (platformId) => {
    // TODO: Implement OAuth flow for each platform
    toast({
      title: 'Connection Started',
      description: `Redirecting to ${meetingPlatforms.find((p) => p.id === platformId)?.name} authorization...`,
    });

    // Simulate connection
    setTimeout(() => {
      setConnectedPlatforms((prev) => ({ ...prev, [platformId]: true }));
      setFormData({ ...formData, platform: platformId });
      toast({
        title: 'Connected Successfully',
        description: `${meetingPlatforms.find((p) => p.id === platformId)?.name} connected successfully!`,
      });
    }, 1500);
  };

  const handleDisconnectPlatform = () => {
    setFormData({ ...formData, platform: null, location: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.date || !formData.startTime) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: 'Meeting Created',
        description: 'Your meeting has been scheduled successfully',
      });

      router.push('/crm/meetings');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create meeting. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/crm/meetings');
  };

  return (
    <UnifiedLayout hubId="crm" pageTitle="Schedule Meeting" fixedMenu={null}>
      <div className="h-full overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Create New Meeting</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Schedule a meeting with contacts or team members
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Meeting Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Meeting Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Product Demo with Client"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="h-11 rounded-xl"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Add meeting agenda, notes, or any additional details..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="rounded-xl min-h-[100px]"
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">
                      Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="h-11 rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">
                      Start Time <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="h-11 rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>

                {/* Meeting Type */}
                <div className="space-y-2">
                  <Label>Meeting Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {meetingTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Meeting Platform - Only show for Video Calls */}
                {formData.type === 'VIDEO_CALL' && (
                  <div className="space-y-3">
                    <Label>Connect Meeting Platform</Label>
                    {formData.platform ? (
                      // Platform Connected - Show selected platform
                      <div className="flex items-center justify-between p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                            {meetingPlatforms.find((p) => p.id === formData.platform)?.logo}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-900">
                              {meetingPlatforms.find((p) => p.id === formData.platform)?.name}{' '}
                              Connected
                            </p>
                            <p className="text-xs text-gray-500">
                              Meeting link will be generated automatically
                            </p>
                          </div>
                          <Check className="h-5 w-5 text-green-600 ml-auto" />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleDisconnectPlatform}
                          className="rounded-lg"
                        >
                          Change
                        </Button>
                      </div>
                    ) : (
                      // Platform Not Connected - Show options
                      <div className="grid grid-cols-3 gap-3">
                        {meetingPlatforms.map((platform) => (
                          <button
                            key={platform.id}
                            type="button"
                            onClick={() => handleConnectPlatform(platform.id)}
                            className={`relative p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all group hover:shadow-md bg-gradient-to-br ${platform.color} bg-opacity-5 hover:bg-opacity-10`}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <div className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                {platform.logo}
                              </div>
                              <span className="text-xs font-medium text-gray-700">
                                {platform.name}
                              </span>
                              <ExternalLink className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            {connectedPlatforms[platform.id] && (
                              <div className="absolute top-2 right-2">
                                <Check className="h-4 w-4 text-green-600" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Video className="h-3 w-3" />
                      Connect your preferred platform to generate meeting links automatically
                    </p>
                  </div>
                )}

                {/* Location / Link */}
                <div className="space-y-2">
                  <Label htmlFor="location">
                    {formData.type === 'IN_PERSON'
                      ? 'Location'
                      : formData.platform
                        ? 'Additional Meeting Details (Optional)'
                        : 'Meeting Link (Manual)'}
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder={
                        formData.type === 'IN_PERSON'
                          ? 'e.g., Conference Room A'
                          : formData.platform
                            ? 'e.g., Add meeting room number or additional details'
                            : 'e.g., https://meet.google.com/abc-defg-hij'
                      }
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="h-11 rounded-xl pl-10"
                      disabled={formData.type === 'VIDEO_CALL' && formData.platform}
                    />
                  </div>
                  {formData.platform && formData.type === 'VIDEO_CALL' && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Meeting link will be auto-generated when you schedule
                    </p>
                  )}
                </div>

                {/* Attendees */}
                <div className="space-y-2">
                  <Label htmlFor="attendees">Attendees (comma-separated emails)</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="attendees"
                      placeholder="e.g., john@example.com, jane@example.com"
                      value={formData.attendees}
                      onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                      className="h-11 rounded-xl pl-10"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4">
                  <Button type="submit" disabled={isSubmitting} className="flex-1 rounded-xl h-11">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Schedule Meeting
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1 rounded-xl h-11"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </UnifiedLayout>
  );
}
