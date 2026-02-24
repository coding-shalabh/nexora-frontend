'use client';

import { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Video,
  Phone,
  MoreHorizontal,
  Filter,
  RefreshCw,
  ExternalLink,
  Settings,
  Link2,
  Loader2,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useCalendarEvents, useCreateCalendarEvent, useDeleteCalendarEvent } from '@/hooks';
import { useToast } from '@/hooks/use-toast';
import { UnifiedLayout, createStat } from '@/components/layout/unified';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const eventTypes = {
  MEETING: { color: 'bg-blue-500', label: 'Meeting' },
  CALL: { color: 'bg-green-500', label: 'Call' },
  TASK: { color: 'bg-purple-500', label: 'Task' },
  REMINDER: { color: 'bg-yellow-500', label: 'Reminder' },
  DEADLINE: { color: 'bg-orange-500', label: 'Deadline' },
  OTHER: { color: 'bg-gray-500', label: 'Other' },
};

export default function CalendarPage() {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // month, week, day
  const [showEventModal, setShowEventModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [outlookConnected, setOutlookConnected] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);

  // Form state
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    type: 'MEETING',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    attendees: '',
    meetingLink: '',
    allDay: false,
    reminder: 15,
  });

  // Calculate date range for current view
  const dateRange = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const from = new Date(year, month - 1, 1).toISOString();
    const to = new Date(year, month + 2, 0).toISOString();
    return { from, to };
  }, [currentDate]);

  // Fetch events from API
  const { data: eventsData, isLoading } = useCalendarEvents(dateRange);
  const createEvent = useCreateCalendarEvent();
  const deleteEvent = useDeleteCalendarEvent();

  // Transform events for display
  const events = useMemo(() => {
    if (!eventsData?.data?.events) return [];
    return eventsData.data.events.map((event) => ({
      id: event.id,
      title: event.title,
      type: event.type,
      start: new Date(event.startTime),
      end: new Date(event.endTime),
      location: event.location,
      description: event.description,
      meetingLink: event.meetingUrl,
      attendees: event.attendees,
    }));
  }, [eventsData]);

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEvents = events.filter((e) => {
      const eventDate = new Date(e.start.getFullYear(), e.start.getMonth(), e.start.getDate());
      return eventDate.getTime() === today.getTime();
    });
    const upcomingEvents = events.filter((e) => e.start > now);

    return [
      createStat('Total Events', events.length, CalendarIcon, 'primary'),
      createStat('Today', todayEvents.length, Clock, 'blue'),
      createStat('Upcoming', upcomingEvents.length, CalendarIcon, 'green'),
      createStat(
        'Connected',
        (googleConnected ? 1 : 0) + (outlookConnected ? 1 : 0),
        Link2,
        'purple'
      ),
    ];
  }, [events, googleConnected, outlookConnected]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];

    // Previous month days
    const prevMonth = new Date(year, month, 0);
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonth.getDate() - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const getEventsForDate = (date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setEventForm((prev) => ({
      ...prev,
      startDate: date.toISOString().split('T')[0],
      endDate: date.toISOString().split('T')[0],
    }));
    setShowEventModal(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleConnectGoogle = async () => {
    // In production, this would redirect to Google OAuth
    try {
      setConnectLoading(true);
      // Simulated OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setGoogleConnected(true);
      setShowConnectModal(false);
    } catch (error) {
      console.error('Failed to connect Google:', error);
    } finally {
      setConnectLoading(false);
    }
  };

  const handleConnectOutlook = async () => {
    // In production, this would redirect to Microsoft OAuth
    try {
      setConnectLoading(true);
      // Simulated OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setOutlookConnected(true);
      setShowConnectModal(false);
    } catch (error) {
      console.error('Failed to connect Outlook:', error);
    } finally {
      setConnectLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    try {
      const startTime = new Date(`${eventForm.startDate}T${eventForm.startTime || '09:00'}`);
      const endTime = new Date(`${eventForm.endDate}T${eventForm.endTime || '10:00'}`);

      await createEvent.mutateAsync({
        title: eventForm.title,
        description: eventForm.description || undefined,
        type: eventForm.type,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        location: eventForm.location || undefined,
        meetingUrl: eventForm.meetingLink || undefined,
        allDay: eventForm.allDay,
        attendees: eventForm.attendees
          ? eventForm.attendees.split(',').map((a) => a.trim())
          : undefined,
      });

      toast({
        title: 'Success',
        description: 'Event created successfully',
      });

      setShowEventModal(false);
      setEventForm({
        title: '',
        description: '',
        type: 'MEETING',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        location: '',
        attendees: '',
        meetingLink: '',
        allDay: false,
        reminder: 15,
      });
    } catch (error) {
      console.error('Failed to create event:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create event',
        variant: 'destructive',
      });
    }
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const days = getDaysInMonth(currentDate);

  return (
    <>
      <UnifiedLayout hubId="home" pageTitle="Calendar" stats={stats} fixedMenu={null}>
        <div className="h-full overflow-y-auto p-6 space-y-6">
          {/* Calendar Header */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => navigateMonth(1)}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <h2 className="text-xl font-semibold">
                    {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <Button variant="outline" size="sm" onClick={goToToday}>
                    Today
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={view} onValueChange={setView}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="day">Day</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calendar Grid */}
          <Card>
            <CardContent className="p-0">
              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b">
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="p-3 text-center text-sm font-medium text-muted-foreground border-r last:border-r-0"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7">
                {days.map((day, index) => {
                  const dayEvents = getEventsForDate(day.date);
                  return (
                    <div
                      key={index}
                      className={cn(
                        'min-h-[120px] p-2 border-r border-b last:border-r-0 cursor-pointer hover:bg-muted/50 transition-colors',
                        !day.isCurrentMonth && 'bg-muted/30 text-muted-foreground',
                        isToday(day.date) && 'bg-primary/5'
                      )}
                      onClick={() => handleDateClick(day.date)}
                    >
                      <div
                        className={cn(
                          'text-sm font-medium mb-1',
                          isToday(day.date) &&
                            'bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center'
                        )}
                      >
                        {day.date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className={cn(
                              'text-xs p-1 rounded truncate text-white cursor-pointer hover:opacity-80',
                              eventTypes[event.type]?.color || 'bg-gray-500'
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event);
                            }}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Connected Calendars Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Connected Calendars</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg',
                    googleConnected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {googleConnected ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                  <span className="text-sm font-medium">Google Calendar</span>
                </div>
                <div
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg',
                    outlookConnected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {outlookConnected ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                  <span className="text-sm font-medium">Outlook Calendar</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </UnifiedLayout>

      {/* Create Event Modal */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="event-title">Title</Label>
              <Input
                id="event-title"
                placeholder="Event title"
                value={eventForm.title}
                onChange={(e) => setEventForm((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-type">Type</Label>
                <Select
                  value={eventForm.type}
                  onValueChange={(value) => setEventForm((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(eventTypes).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <div className={cn('w-3 h-3 rounded-full', value.color)} />
                          {value.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-location">Location</Label>
                <Input
                  id="event-location"
                  placeholder="Location or video link"
                  value={eventForm.location}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={eventForm.startDate}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={eventForm.startTime}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={eventForm.endDate}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={eventForm.endTime}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                placeholder="Event description"
                value={eventForm.description}
                onChange={(e) => setEventForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-attendees">Attendees (comma separated)</Label>
              <Input
                id="event-attendees"
                placeholder="email1@example.com, email2@example.com"
                value={eventForm.attendees}
                onChange={(e) => setEventForm((prev) => ({ ...prev, attendees: e.target.value }))}
              />
            </div>

            {(eventForm.type === 'meeting' || eventForm.type === 'call') && (
              <div className="space-y-2">
                <Label htmlFor="meeting-link">Meeting Link</Label>
                <div className="flex gap-2">
                  <Input
                    id="meeting-link"
                    placeholder="https://meet.jit.si/..."
                    value={eventForm.meetingLink}
                    onChange={(e) =>
                      setEventForm((prev) => ({ ...prev, meetingLink: e.target.value }))
                    }
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      const meetingId = `crm360-${Date.now()}`;
                      setEventForm((prev) => ({
                        ...prev,
                        meetingLink: `https://meet.jit.si/${meetingId}`,
                      }));
                    }}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEventModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateEvent}
              disabled={createEvent.isPending || !eventForm.title}
            >
              {createEvent.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {selectedEvent ? 'Update' : 'Create'} Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Connect Calendar Modal */}
      <Dialog open={showConnectModal} onOpenChange={setShowConnectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Calendar</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Connect your calendar to sync events and schedule meetings automatically.
            </p>

            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-14"
              onClick={handleConnectGoogle}
              disabled={googleConnected || connectLoading}
            >
              <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-medium">Google Calendar</div>
                <div className="text-xs text-muted-foreground">
                  {googleConnected ? 'Connected' : 'Sync with Google Calendar'}
                </div>
              </div>
              {googleConnected && <Check className="ml-auto h-5 w-5 text-green-500" />}
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-14"
              onClick={handleConnectOutlook}
              disabled={outlookConnected || connectLoading}
            >
              <div className="w-8 h-8 rounded-full bg-[#0078D4] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                  <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.5V2.55q0-.44.3-.75.3-.3.75-.3h12.9q.44 0 .75.3.3.3.3.75V12zm-6-8.25v3h3v-3zm0 4.5v3h3v-3zm0 4.5v1.83l3.05-1.83zm-5.25-9v3h3.75v-3zm0 4.5v3h3.75v-3zm0 4.5v2.03l2.41 1.5 1.34-.8v-2.73zM9 3.75V6h2l.13.01.12.04v-2.3zM5.98 15.98q.9 0 1.6-.3.7-.32 1.19-.86.48-.55.73-1.28.25-.74.25-1.61 0-.83-.25-1.55-.24-.71-.71-1.24t-1.15-.83q-.68-.3-1.55-.3-.92 0-1.64.3-.71.3-1.2.85-.5.54-.75 1.3-.25.74-.25 1.63 0 .85.26 1.56.26.72.74 1.23.48.52 1.17.81.69.3 1.56.3zM7.5 21h12.39L12 16.08V17q0 .41-.3.7-.29.3-.7.3H7.5zm15-.13v-7.24l-5.9 3.54Z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-medium">Outlook Calendar</div>
                <div className="text-xs text-muted-foreground">
                  {outlookConnected ? 'Connected' : 'Sync with Microsoft Outlook'}
                </div>
              </div>
              {outlookConnected && <Check className="ml-auto h-5 w-5 text-green-500" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Detail Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2">
                <Badge className={cn('text-white', eventTypes[selectedEvent.type]?.color)}>
                  {eventTypes[selectedEvent.type]?.label}
                </Badge>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {selectedEvent.start.toLocaleDateString()}{' '}
                  {selectedEvent.start.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {' - '}
                  {selectedEvent.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {selectedEvent.location && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedEvent.location}</span>
                </div>
              )}

              {selectedEvent.attendees && (
                <div className="flex items-center gap-3 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedEvent.attendees.join(', ')}</span>
                </div>
              )}

              {selectedEvent.meetingLink && (
                <div className="flex items-center gap-3 text-sm">
                  <Video className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={selectedEvent.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    Join Meeting <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedEvent(null)}>
              Close
            </Button>
            {selectedEvent?.meetingLink && (
              <Button asChild>
                <a href={selectedEvent.meetingLink} target="_blank" rel="noopener noreferrer">
                  <Video className="h-4 w-4 mr-2" />
                  Join Now
                </a>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
