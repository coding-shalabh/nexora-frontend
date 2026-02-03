'use client';

import { useState } from 'react';
import { format, addHours, addDays, setHours, setMinutes, nextMonday } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Clock,
  Calendar,
  Sun,
  CalendarClock,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useSnoozeConversation } from '@/hooks/use-inbox-agent';

// Snooze duration options
const SNOOZE_OPTIONS = [
  {
    id: 'later_today',
    label: 'Later today',
    icon: Clock,
    description: 'In 3 hours',
    getDuration: () => 'LATER_TODAY',
  },
  {
    id: 'tomorrow',
    label: 'Tomorrow',
    icon: Sun,
    description: '9:00 AM',
    getDuration: () => 'TOMORROW',
  },
  {
    id: 'next_week',
    label: 'Next week',
    icon: Calendar,
    description: 'Monday 9:00 AM',
    getDuration: () => 'NEXT_WEEK',
  },
  {
    id: 'custom',
    label: 'Custom',
    icon: CalendarClock,
    description: 'Pick date & time',
    getDuration: () => null,
  },
];

// Get minimum date string for date input (today)
function getMinDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export function SnoozeDialog({ open, onOpenChange, conversationId, conversationName }) {
  const { toast } = useToast();
  const [selectedOption, setSelectedOption] = useState(null);
  const [customDateStr, setCustomDateStr] = useState('');
  const [customTime, setCustomTime] = useState('09:00');
  const [reason, setReason] = useState('');

  const snoozeConversation = useSnoozeConversation();

  // Parse date string to Date object
  const customDate = customDateStr ? new Date(customDateStr + 'T00:00:00') : null;

  const handleSnooze = async () => {
    if (!selectedOption) {
      toast({
        variant: 'destructive',
        title: 'Select a snooze option',
        description: 'Please choose when to be reminded',
      });
      return;
    }

    if (selectedOption === 'custom' && !customDate) {
      toast({
        variant: 'destructive',
        title: 'Select a date',
        description: 'Please choose a custom date for the snooze',
      });
      return;
    }

    try {
      let snoozeData = {
        conversationId,
        reason: reason.trim() || undefined,
      };

      if (selectedOption === 'custom') {
        // Combine custom date and time
        const [hours, minutes] = customTime.split(':').map(Number);
        const customDateTime = setMinutes(setHours(customDate, hours), minutes);
        snoozeData.customUntil = customDateTime.toISOString();
      } else {
        snoozeData.duration = SNOOZE_OPTIONS.find(o => o.id === selectedOption)?.getDuration();
      }

      await snoozeConversation.mutateAsync(snoozeData);

      toast({
        title: 'Conversation snoozed',
        description: getSnoozeDescription(),
      });

      // Reset and close
      resetForm();
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to snooze conversation',
      });
    }
  };

  const getSnoozeDescription = () => {
    if (selectedOption === 'custom' && customDate) {
      const [hours, minutes] = customTime.split(':').map(Number);
      const customDateTime = setMinutes(setHours(customDate, hours), minutes);
      return `Snoozed until ${format(customDateTime, 'MMM d, h:mm a')}`;
    }

    const option = SNOOZE_OPTIONS.find(o => o.id === selectedOption);
    if (option) {
      return `Snoozed: ${option.label} (${option.description})`;
    }

    return 'Conversation snoozed';
  };

  const resetForm = () => {
    setSelectedOption(null);
    setCustomDateStr('');
    setCustomTime('09:00');
    setReason('');
  };

  const getPreviewTime = () => {
    if (!selectedOption) return null;

    const now = new Date();

    switch (selectedOption) {
      case 'later_today':
        return format(addHours(now, 3), 'h:mm a');
      case 'tomorrow':
        return format(setHours(addDays(now, 1), 9), 'MMM d, h:mm a');
      case 'next_week':
        const nextMon = nextMonday(now);
        return format(setHours(nextMon, 9), 'MMM d, h:mm a');
      case 'custom':
        if (customDate) {
          const [hours, minutes] = customTime.split(':').map(Number);
          const customDateTime = setMinutes(setHours(customDate, hours), minutes);
          return format(customDateTime, 'MMM d, h:mm a');
        }
        return 'Select date & time';
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) resetForm(); onOpenChange(o); }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Snooze Conversation
          </DialogTitle>
          <DialogDescription>
            {conversationName
              ? `Temporarily hide "${conversationName}" and get reminded later.`
              : 'Temporarily hide this conversation and get reminded later.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Snooze Options */}
          <div className="grid grid-cols-2 gap-2">
            {SNOOZE_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedOption(option.id)}
                  className={cn(
                    'p-3 rounded-lg border-2 text-left transition-all',
                    selectedOption === option.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">{option.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </button>
              );
            })}
          </div>

          {/* Custom Date/Time Picker */}
          {selectedOption === 'custom' && (
            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center gap-3">
                <Input
                  type="date"
                  value={customDateStr}
                  onChange={(e) => setCustomDateStr(e.target.value)}
                  min={getMinDate()}
                  className="flex-1"
                />
                <Input
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="w-28"
                />
              </div>
            </div>
          )}

          {/* Preview */}
          {selectedOption && (
            <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Reminder: <strong>{getPreviewTime()}</strong>
              </span>
            </div>
          )}

          {/* Reason (optional) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason (optional)</label>
            <Textarea
              placeholder="e.g., Waiting for customer response..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => { resetForm(); onOpenChange(false); }}
            disabled={snoozeConversation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSnooze}
            disabled={!selectedOption || snoozeConversation.isPending}
          >
            {snoozeConversation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Snoozing...
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 mr-2" />
                Snooze
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Simple snooze button that can be used inline
export function SnoozeButton({ conversationId, conversationName, variant = 'outline', size = 'sm', className }) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setShowDialog(true)}
      >
        <Clock className="h-4 w-4 mr-1" />
        Snooze
      </Button>
      <SnoozeDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        conversationId={conversationId}
        conversationName={conversationName}
      />
    </>
  );
}
