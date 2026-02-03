'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Pause,
  Play,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Clock,
  User,
  X,
  Loader2,
  ArrowRight,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  useInitiateCall,
  useEndCall,
  useHoldCall,
  useResumeCall,
  useTransferCall,
  useActiveCalls,
} from '@/hooks/use-dialer';

// Format duration from seconds to mm:ss
function formatDuration(seconds) {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Simple Click to Call Button for use in contact cards, tables, etc.
export function ClickToCallButton({
  phoneNumber,
  contactId,
  contactName,
  channelAccountId,
  variant = 'outline',
  size = 'sm',
  showLabel = false,
  className,
  onCallStarted,
}) {
  const initiateCall = useInitiateCall();
  const [isDialing, setIsDialing] = useState(false);

  const handleCall = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!phoneNumber) return;

    setIsDialing(true);
    try {
      const result = await initiateCall.mutateAsync({
        channelAccountId,
        toNumber: phoneNumber,
        contactId,
      });

      if (onCallStarted) {
        onCallStarted(result);
      }
    } catch (error) {
      console.error('Failed to initiate call:', error);
    } finally {
      setIsDialing(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={handleCall}
            disabled={isDialing || !phoneNumber}
            className={cn('gap-2', isDialing && 'animate-pulse', className)}
          >
            {isDialing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Phone className="h-4 w-4" />
            )}
            {showLabel && (isDialing ? 'Calling...' : 'Call')}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Call {contactName || phoneNumber}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Active Call Widget - floating widget showing current call
export function ActiveCallWidget() {
  const { data: activeCallsData } = useActiveCalls();
  const endCall = useEndCall();
  const holdCall = useHoldCall();
  const resumeCall = useResumeCall();

  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [transferNumber, setTransferNumber] = useState('');

  const activeCalls = activeCallsData?.data || [];
  const currentCall = activeCalls[0]; // Show first active call

  if (!currentCall) return null;

  const isOnHold = currentCall.status === 'on_hold';
  const isRinging = currentCall.status === 'ringing';

  const handleEndCall = async () => {
    try {
      await endCall.mutateAsync(currentCall.id);
    } catch (error) {
      console.error('Failed to end call:', error);
    }
  };

  const handleHold = async () => {
    try {
      if (isOnHold) {
        await resumeCall.mutateAsync(currentCall.id);
      } else {
        await holdCall.mutateAsync(currentCall.id);
      }
    } catch (error) {
      console.error('Failed to toggle hold:', error);
    }
  };

  return (
    <>
      {/* Floating Call Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white dark:bg-card rounded-2xl shadow-2xl border overflow-hidden w-80">
          {/* Header */}
          <div className={cn('p-4 text-white', isRinging ? 'bg-amber-500' : 'bg-green-500')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <PhoneCall className="h-5 w-5" />
                  </div>
                  {!isRinging && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-white animate-pulse" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {currentCall.contactName || currentCall.phoneNumber}
                  </p>
                  <p className="text-sm text-white/80">
                    {isRinging ? 'Ringing...' : isOnHold ? 'On Hold' : 'In Call'}
                  </p>
                </div>
              </div>
              <Badge className="bg-white/20 text-white border-0">
                <Clock className="h-3 w-3 mr-1" />
                {formatDuration(currentCall.duration || 0)}
              </Badge>
            </div>
          </div>

          {/* Call Controls */}
          <div className="p-4">
            <div className="flex items-center justify-center gap-3">
              {/* Mute */}
              <Button
                variant={isMuted ? 'secondary' : 'outline'}
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <MicOff className="h-5 w-5 text-red-500" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>

              {/* Hold/Resume */}
              <Button
                variant={isOnHold ? 'secondary' : 'outline'}
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={handleHold}
                disabled={holdCall.isPending || resumeCall.isPending}
              >
                {holdCall.isPending || resumeCall.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isOnHold ? (
                  <Play className="h-5 w-5 text-green-500" />
                ) : (
                  <Pause className="h-5 w-5" />
                )}
              </Button>

              {/* End Call */}
              <Button
                variant="destructive"
                size="icon"
                className="h-14 w-14 rounded-full"
                onClick={handleEndCall}
                disabled={endCall.isPending}
              >
                {endCall.isPending ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <PhoneOff className="h-6 w-6" />
                )}
              </Button>

              {/* Speaker */}
              <Button
                variant={isSpeakerOn ? 'secondary' : 'outline'}
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              >
                {isSpeakerOn ? (
                  <Volume2 className="h-5 w-5" />
                ) : (
                  <VolumeX className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>

              {/* More Options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTransferDialogOpen(true)}>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Transfer Call
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Contact Info */}
            {currentCall.contactId && (
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Contact linked</span>
                </div>
                <Button variant="ghost" size="sm">
                  View Contact
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transfer Dialog */}
      <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transfer Call</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Transfer to</label>
              <Input
                placeholder="Enter phone number or extension"
                value={transferNumber}
                onChange={(e) => setTransferNumber(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setTransferDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                disabled={!transferNumber}
                onClick={async () => {
                  // Transfer call logic
                  setTransferDialogOpen(false);
                }}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Transfer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Dialer Dialog - full dialer interface
export function DialerDialog({ open, onOpenChange, defaultNumber = '', contactId, contactName }) {
  const [phoneNumber, setPhoneNumber] = useState(defaultNumber);
  const initiateCall = useInitiateCall();

  const handleDial = async () => {
    if (!phoneNumber) return;

    try {
      await initiateCall.mutateAsync({
        toNumber: phoneNumber,
        contactId,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to initiate call:', error);
    }
  };

  const handleKeyPress = (key) => {
    if (key === 'delete') {
      setPhoneNumber((prev) => prev.slice(0, -1));
    } else {
      setPhoneNumber((prev) => prev + key);
    }
  };

  const dialpadKeys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#'],
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">
            {contactName ? `Call ${contactName}` : 'Make a Call'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Phone Number Display */}
          <div className="text-center">
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              className="text-center text-2xl font-mono h-14"
            />
          </div>

          {/* Dialpad */}
          <div className="space-y-2">
            {dialpadKeys.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-2">
                {row.map((key) => (
                  <Button
                    key={key}
                    variant="outline"
                    className="h-14 w-14 text-xl font-medium rounded-full"
                    onClick={() => handleKeyPress(key)}
                  >
                    {key}
                  </Button>
                ))}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-2">
            <Button
              variant="outline"
              size="icon"
              className="h-14 w-14 rounded-full"
              onClick={() => handleKeyPress('delete')}
            >
              <X className="h-6 w-6" />
            </Button>
            <Button
              size="icon"
              className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600"
              onClick={handleDial}
              disabled={!phoneNumber || initiateCall.isPending}
            >
              {initiateCall.isPending ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Phone className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Export all components
export default {
  ClickToCallButton,
  ActiveCallWidget,
  DialerDialog,
};
