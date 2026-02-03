'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Phone,
  PhoneCall,
  PhoneOff,
  PhoneIncoming,
  Pause,
  Play,
  Mic,
  MicOff,
  Clock,
  X,
  Loader2,
  ArrowRight,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTelecmi, CallStatus } from '@/providers/telecmi-provider';

// Format duration from seconds to mm:ss
function formatDuration(seconds) {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * TeleCMI Call Widget - Floating widget for active WebRTC calls
 */
export function TelecmiCallWidget() {
  const {
    isInCall,
    incomingCall,
    callStatus,
    callDuration,
    isMuted,
    isHeld,
    currentCall,
    answerCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleHold,
  } = useTelecmi();

  const [isMinimized, setIsMinimized] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [transferNumber, setTransferNumber] = useState('');
  const [isEndingCall, setIsEndingCall] = useState(false);

  // Don't show if not in a call and no incoming call
  if (!isInCall && !incomingCall) {
    return null;
  }

  // Incoming call UI
  if (incomingCall && callStatus === CallStatus.RINGING) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white dark:bg-card rounded-2xl shadow-2xl border overflow-hidden w-80 animate-pulse">
          {/* Header */}
          <div className="p-4 bg-amber-500 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <PhoneIncoming className="h-5 w-5 animate-bounce" />
                </div>
                <div>
                  <p className="font-medium">Incoming Call</p>
                  <p className="text-sm text-white/80">{incomingCall.from || 'Unknown'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 flex justify-center gap-4">
            <Button
              variant="destructive"
              size="icon"
              className="h-14 w-14 rounded-full"
              onClick={async () => {
                try {
                  await rejectCall();
                } catch (e) {
                  console.error('Reject error:', e);
                }
              }}
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
            <Button
              size="icon"
              className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600"
              onClick={async () => {
                try {
                  await answerCall();
                } catch (e) {
                  console.error('Answer error:', e);
                }
              }}
            >
              <Phone className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Minimized view
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className={cn(
            'rounded-full h-14 w-14 shadow-lg',
            callStatus === CallStatus.CONNECTED
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-amber-500 hover:bg-amber-600'
          )}
          onClick={() => setIsMinimized(false)}
        >
          <PhoneCall className="h-6 w-6" />
        </Button>
        <Badge className="absolute -top-2 -right-2 bg-white text-foreground border">
          {formatDuration(callDuration)}
        </Badge>
      </div>
    );
  }

  // Active call widget
  const isConnecting = callStatus === CallStatus.CONNECTING;
  const isRinging = callStatus === CallStatus.RINGING;
  const isOnHold = callStatus === CallStatus.ON_HOLD;

  const handleEndCall = async () => {
    setIsEndingCall(true);
    try {
      await endCall();
    } catch (e) {
      console.error('End call error:', e);
    } finally {
      setIsEndingCall(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white dark:bg-card rounded-2xl shadow-2xl border overflow-hidden w-80">
          {/* Header */}
          <div
            className={cn(
              'p-4 text-white',
              isConnecting || isRinging ? 'bg-amber-500' : isOnHold ? 'bg-blue-500' : 'bg-green-500'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    {isConnecting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <PhoneCall className="h-5 w-5" />
                    )}
                  </div>
                  {!isConnecting && !isRinging && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-white animate-pulse" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{currentCall?.to || 'Call'}</p>
                  <p className="text-sm text-white/80">
                    {isConnecting
                      ? 'Connecting...'
                      : isRinging
                        ? 'Ringing...'
                        : isOnHold
                          ? 'On Hold'
                          : 'Connected'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-white/20 text-white border-0">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDuration(callDuration)}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={() => setIsMinimized(true)}
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
              </div>
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
                onClick={toggleMute}
                disabled={isConnecting}
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
                onClick={toggleHold}
                disabled={isConnecting || isRinging}
              >
                {isOnHold ? (
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
                disabled={isEndingCall}
              >
                {isEndingCall ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <PhoneOff className="h-6 w-6" />
                )}
              </Button>

              {/* Transfer */}
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={() => setTransferDialogOpen(true)}
                disabled={isConnecting || isRinging}
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
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
                  // Transfer call logic would go here
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

/**
 * TeleCMI Dialer Dialog - Dialpad for making calls
 */
export function TelecmiDialerDialog({ open, onOpenChange, defaultNumber = '', contactName = '' }) {
  const { makeCall, sdkReady, isInCall } = useTelecmi();
  const [phoneNumber, setPhoneNumber] = useState(defaultNumber);
  const [isDialing, setIsDialing] = useState(false);
  const [error, setError] = useState('');

  const handleDial = async () => {
    if (!phoneNumber || !sdkReady) return;

    setIsDialing(true);
    setError('');

    try {
      await makeCall(phoneNumber);
      onOpenChange(false);
    } catch (err) {
      console.error('Failed to initiate call:', err);
      setError(err.message || 'Failed to make call');
    } finally {
      setIsDialing(false);
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
          {error && <div className="text-sm text-red-500 text-center">{error}</div>}

          {!sdkReady && (
            <div className="text-sm text-amber-500 text-center">Please login to TeleCMI first</div>
          )}

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
              disabled={!phoneNumber || isDialing || !sdkReady || isInCall}
            >
              {isDialing ? (
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

export default TelecmiCallWidget;
