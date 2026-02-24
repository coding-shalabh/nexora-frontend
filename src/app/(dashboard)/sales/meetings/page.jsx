'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Calendar,
  Plus,
  Video,
  Phone,
  Users,
  Clock,
  MapPin,
  MoreHorizontal,
  Edit,
  Copy,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { UnifiedLayout, createStat, createAction } from '@/components/layout/unified';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const mockMeetings = [
  {
    id: 1,
    title: 'Enterprise Demo - Acme Corp',
    type: 'video',
    date: '2025-01-15',
    time: '10:00 AM',
    duration: 60,
    attendees: ['John Smith', 'Sarah Johnson'],
    company: 'Acme Corp',
    status: 'scheduled',
    location: 'Zoom',
    notes: 'Prepare product demo focusing on enterprise features',
  },
  {
    id: 2,
    title: 'Discovery Call - TechStart',
    type: 'phone',
    date: '2025-01-15',
    time: '2:00 PM',
    duration: 30,
    attendees: ['Mike Wilson'],
    company: 'TechStart Inc',
    status: 'scheduled',
    location: 'Phone',
    notes: 'Discuss requirements and budget',
  },
  {
    id: 3,
    title: 'Negotiation Meeting - Global Ltd',
    type: 'in-person',
    date: '2025-01-16',
    time: '11:00 AM',
    duration: 90,
    attendees: ['Emily Brown', 'David Chen'],
    company: 'Global Industries',
    status: 'scheduled',
    location: 'Office - Conference Room A',
    notes: 'Final contract discussion',
  },
  {
    id: 4,
    title: 'Kickoff Call - SmallBiz',
    type: 'video',
    date: '2025-01-14',
    time: '3:00 PM',
    duration: 45,
    attendees: ['Lisa Anderson'],
    company: 'SmallBiz LLC',
    status: 'completed',
    location: 'Google Meet',
    notes: 'Successful onboarding session',
  },
];

const meetingStats = {
  thisWeek: 12,
  today: 3,
  completed: 48,
  cancelled: 5,
};

export default function MeetingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('upcoming');

  const getMeetingIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'in-person':
        return <MapPin className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const upcomingMeetings = mockMeetings.filter((m) => m.status === 'scheduled');
  const completedMeetings = mockMeetings.filter((m) => m.status === 'completed');

  const stats = [
    createStat('This Week', meetingStats.thisWeek, Calendar, 'blue'),
    createStat('Today', meetingStats.today, Clock, 'green'),
    createStat('Completed', meetingStats.completed, CheckCircle2, 'purple'),
    createStat('Cancelled', meetingStats.cancelled, XCircle, 'red'),
  ];

  const actions = [
    createAction('Schedule Meeting', Plus, () => router.push('/calendar'), { primary: true }),
  ];

  return (
    <UnifiedLayout
      hubId="sales"
      pageTitle="Meetings"
      stats={stats}
      actions={actions}
      fixedMenu={null}
    >
      <div className="p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4 mt-4">
            {upcomingMeetings.map((meeting, index) => (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-16 text-center">
                        <p className="text-2xl font-bold">{new Date(meeting.date).getDate()}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(meeting.date).toLocaleDateString('en-US', { month: 'short' })}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{meeting.title}</h3>
                          <Badge className={getStatusColor(meeting.status)}>{meeting.status}</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {meeting.time} ({meeting.duration} min)
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getMeetingIcon(meeting.type)}
                            <span className="capitalize">{meeting.type}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{meeting.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{meeting.attendees.length} attendees</span>
                          </div>
                        </div>
                        {meeting.notes && (
                          <p className="text-sm text-muted-foreground mt-2">{meeting.notes}</p>
                        )}
                        <div className="flex items-center gap-2 mt-3">
                          {meeting.attendees.slice(0, 3).map((attendee, idx) => (
                            <Avatar key={idx} className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {attendee
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {meeting.attendees.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{meeting.attendees.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Video className="h-4 w-4 mr-2" />
                            Join Meeting
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Link
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel Meeting
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {upcomingMeetings.length === 0 && (
              <Card className="p-12">
                <div className="text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No upcoming meetings</h3>
                  <p className="text-muted-foreground mb-4">
                    Schedule your first meeting to get started
                  </p>
                  <Button onClick={() => router.push('/calendar')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-4">
            {completedMeetings.map((meeting, index) => (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-16 text-center">
                        <p className="text-2xl font-bold text-muted-foreground">
                          {new Date(meeting.date).getDate()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(meeting.date).toLocaleDateString('en-US', { month: 'short' })}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{meeting.title}</h3>
                          <Badge className={getStatusColor(meeting.status)}>
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {meeting.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{meeting.time}</span>
                          <span>-</span>
                          <span>{meeting.duration} minutes</span>
                          <span>-</span>
                          <span>{meeting.attendees.length} attendees</span>
                        </div>
                        {meeting.notes && (
                          <p className="text-sm text-muted-foreground mt-2">{meeting.notes}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {completedMeetings.length === 0 && (
              <Card className="p-12">
                <div className="text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No completed meetings</h3>
                  <p className="text-muted-foreground">No completed meetings yet</p>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedLayout>
  );
}
