'use client';

import { useState, useEffect } from 'react';
import {
  Video,
  Mic,
  Users,
  Copy,
  Check,
  Plus,
  Calendar,
  Clock,
  Loader2,
  Play,
  Link2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [meetingCode, setMeetingCode] = useState('');

  // Meeting form
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    description: '',
    scheduledDate: '',
    scheduledTime: '',
    duration: 30,
    inviteEmails: '',
  });

  // Jitsi domain
  const jitsiDomain = process.env.NEXT_PUBLIC_JITSI_DOMAIN || 'meet.jit.si';

  // Sample meetings
  useEffect(() => {
    const now = new Date();
    setMeetings([
      {
        id: '1',
        title: 'Team Standup',
        roomId: 'crm360-team-standup',
        scheduledAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0),
        duration: 30,
        participants: ['john@example.com', 'jane@example.com'],
        status: 'scheduled',
      },
      {
        id: '2',
        title: 'Client Demo - Acme Inc',
        roomId: 'crm360-acme-demo',
        scheduledAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0),
        duration: 60,
        participants: ['client@acme.com', 'sales@company.com'],
        status: 'scheduled',
      },
      {
        id: '3',
        title: 'Product Review',
        roomId: 'crm360-product-review',
        scheduledAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 15, 0),
        duration: 45,
        participants: ['product@company.com'],
        status: 'completed',
      },
    ]);
  }, []);

  const generateRoomId = () => {
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `crm360-${randomPart}-${Date.now().toString(36)}`;
  };

  const handleCreateMeeting = async () => {
    try {
      setLoading(true);
      const roomId = generateRoomId();
      const newMeeting = {
        id: Date.now().toString(),
        title: meetingForm.title || 'New Meeting',
        roomId,
        scheduledAt:
          meetingForm.scheduledDate && meetingForm.scheduledTime
            ? new Date(`${meetingForm.scheduledDate}T${meetingForm.scheduledTime}`)
            : new Date(),
        duration: meetingForm.duration,
        participants: meetingForm.inviteEmails
          .split(',')
          .map((e) => e.trim())
          .filter(Boolean),
        status: 'scheduled',
      };
      setMeetings((prev) => [newMeeting, ...prev]);
      setShowCreateModal(false);
      setMeetingForm({
        title: '',
        description: '',
        scheduledDate: '',
        scheduledTime: '',
        duration: 30,
        inviteEmails: '',
      });

      // Open meeting in new tab
      window.open(`https://${jitsiDomain}/${roomId}`, '_blank');
    } catch (error) {
      console.error('Failed to create meeting:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartInstantMeeting = () => {
    const roomId = generateRoomId();
    window.open(`https://${jitsiDomain}/${roomId}`, '_blank');
  };

  const handleJoinMeeting = (roomId) => {
    window.open(`https://${jitsiDomain}/${roomId}`, '_blank');
  };

  const handleJoinWithCode = () => {
    if (meetingCode) {
      // Check if it's a full URL or just a room code
      if (meetingCode.includes('http')) {
        window.open(meetingCode, '_blank');
      } else {
        window.open(`https://${jitsiDomain}/${meetingCode}`, '_blank');
      }
      setShowJoinModal(false);
      setMeetingCode('');
    }
  };

  const copyMeetingLink = async (roomId) => {
    const link = `https://${jitsiDomain}/${roomId}`;
    await navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    return date.toLocaleDateString();
  };

  const upcomingMeetings = meetings.filter(
    (m) => m.status === 'scheduled' && new Date(m.scheduledAt) >= new Date()
  );
  const pastMeetings = meetings.filter(
    (m) => m.status === 'completed' || new Date(m.scheduledAt) < new Date()
  );

  // Stats for HubLayout
  const stats = [
    createStat('Total', meetings.length, Video, 'primary'),
    createStat('Upcoming', upcomingMeetings.length, Calendar, 'blue'),
    createStat('Past', pastMeetings.length, Clock, 'purple'),
  ];

  return (
    <>
      <HubLayout
        hubId="productivity"
        title="Video Meetings"
        description="Start instant meetings or schedule video calls with your team and clients"
        stats={stats}
        actions={
          <>
            <Button variant="outline" onClick={() => setShowJoinModal(true)}>
              <Link2 className="h-4 w-4 mr-2" />
              Join Meeting
            </Button>
            <Button onClick={handleStartInstantMeeting}>
              <Video className="h-4 w-4 mr-2" />
              Start Instant Meeting
            </Button>
          </>
        }
        showFixedMenu={false}
      >
        <div className="h-full overflow-y-auto p-6 space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            <Card
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={handleStartInstantMeeting}
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Start Now</h3>
                  <p className="text-sm text-muted-foreground">Begin an instant meeting</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setShowCreateModal(true)}
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Schedule</h3>
                  <p className="text-sm text-muted-foreground">Plan a meeting for later</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setShowJoinModal(true)}
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <Link2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Join</h3>
                  <p className="text-sm text-muted-foreground">Enter meeting code or link</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="upcoming" className="space-y-4">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming ({upcomingMeetings.length})</TabsTrigger>
              <TabsTrigger value="past">Past Meetings ({pastMeetings.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingMeetings.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Video className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No upcoming meetings</h3>
                    <p className="text-muted-foreground mb-4">
                      Schedule a new meeting or start an instant call
                    </p>
                    <Button onClick={() => setShowCreateModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Meeting
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                upcomingMeetings.map((meeting) => (
                  <Card key={meeting.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Video className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{meeting.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(new Date(meeting.scheduledAt))}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatTime(new Date(meeting.scheduledAt))} ({meeting.duration} min)
                            </span>
                            {meeting.participants.length > 0 && (
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {meeting.participants.length} participants
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyMeetingLink(meeting.roomId)}
                        >
                          {copiedLink ? (
                            <Check className="h-4 w-4 mr-2" />
                          ) : (
                            <Copy className="h-4 w-4 mr-2" />
                          )}
                          Copy Link
                        </Button>
                        <Button onClick={() => handleJoinMeeting(meeting.roomId)}>
                          <Play className="h-4 w-4 mr-2" />
                          Join
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastMeetings.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No past meetings</h3>
                    <p className="text-muted-foreground">
                      Your completed meetings will appear here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                pastMeetings.map((meeting) => (
                  <Card key={meeting.id} className="opacity-70">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Video className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{meeting.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(new Date(meeting.scheduledAt))}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatTime(new Date(meeting.scheduledAt))} ({meeting.duration} min)
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">Completed</Badge>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>

          {/* Info Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Video className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-blue-900">Powered by Jitsi Meet</p>
                  <p className="text-blue-800">
                    Nexora uses Jitsi Meet for secure, free video conferencing. Meetings support:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-blue-800">
                    <li>HD video and audio</li>
                    <li>Screen sharing</li>
                    <li>Chat and reactions</li>
                    <li>No account required for participants</li>
                    <li>End-to-end encryption available</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </HubLayout>

      {/* Create Meeting Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule a Meeting</DialogTitle>
            <DialogDescription>
              Create a new video meeting and invite participants
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="meeting-title">Meeting Title</Label>
              <Input
                id="meeting-title"
                placeholder="e.g., Team Standup"
                value={meetingForm.title}
                onChange={(e) => setMeetingForm((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meeting-description">Description (optional)</Label>
              <Textarea
                id="meeting-description"
                placeholder="Meeting agenda or notes"
                value={meetingForm.description}
                onChange={(e) =>
                  setMeetingForm((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meeting-date">Date</Label>
                <Input
                  id="meeting-date"
                  type="date"
                  value={meetingForm.scheduledDate}
                  onChange={(e) =>
                    setMeetingForm((prev) => ({ ...prev, scheduledDate: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meeting-time">Time</Label>
                <Input
                  id="meeting-time"
                  type="time"
                  value={meetingForm.scheduledTime}
                  onChange={(e) =>
                    setMeetingForm((prev) => ({ ...prev, scheduledTime: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meeting-duration">Duration (minutes)</Label>
              <Input
                id="meeting-duration"
                type="number"
                min={15}
                step={15}
                value={meetingForm.duration}
                onChange={(e) =>
                  setMeetingForm((prev) => ({ ...prev, duration: parseInt(e.target.value) }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invite-emails">Invite Participants (comma separated)</Label>
              <Input
                id="invite-emails"
                placeholder="email1@example.com, email2@example.com"
                value={meetingForm.inviteEmails}
                onChange={(e) =>
                  setMeetingForm((prev) => ({ ...prev, inviteEmails: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateMeeting} disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create & Start Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Join Meeting Modal */}
      <Dialog open={showJoinModal} onOpenChange={setShowJoinModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join a Meeting</DialogTitle>
            <DialogDescription>Enter the meeting code or paste the meeting link</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="meeting-code">Meeting Code or Link</Label>
              <Input
                id="meeting-code"
                placeholder="e.g., crm360-abc123 or https://meet.jit.si/room"
                value={meetingCode}
                onChange={(e) => setMeetingCode(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJoinModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleJoinWithCode} disabled={!meetingCode}>
              <Video className="h-4 w-4 mr-2" />
              Join Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
