'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Phone,
  PhoneOff,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Pause,
  Play,
  Users,
  Clock,
  TrendingUp,
  BarChart3,
  Settings,
  History,
  User,
  Building2,
  Mail,
  MessageSquare,
  ChevronRight,
  Search,
  Plus,
  Zap,
  ArrowRight,
  X,
  MoreVertical,
  Download,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { useTelecmi, CallStatus } from '@/providers/telecmi-provider';
import { useToast } from '@/hooks/use-toast';

// Mock call data
const mockActiveCalls = [];

const mockRecentCalls = [
  {
    id: '1',
    contact: { name: 'Priya Sharma', phone: '+91 98765 43210', avatar: null },
    direction: 'OUTBOUND',
    status: 'COMPLETED',
    duration: 245,
    startedAt: new Date(Date.now() - 1800000),
    disposition: 'INTERESTED',
  },
  {
    id: '2',
    contact: { name: 'Rahul Verma', phone: '+91 87654 32109', avatar: null },
    direction: 'INBOUND',
    status: 'COMPLETED',
    duration: 120,
    startedAt: new Date(Date.now() - 3600000),
    disposition: 'CALLBACK_REQUESTED',
  },
  {
    id: '3',
    contact: { name: 'Amit Kumar', phone: '+91 76543 21098', avatar: null },
    direction: 'OUTBOUND',
    status: 'NO_ANSWER',
    duration: 0,
    startedAt: new Date(Date.now() - 5400000),
    disposition: null,
  },
  {
    id: '4',
    contact: { name: 'Sneha Patel', phone: '+91 65432 10987', avatar: null },
    direction: 'OUTBOUND',
    status: 'COMPLETED',
    duration: 380,
    startedAt: new Date(Date.now() - 7200000),
    disposition: 'DEAL_CLOSED',
  },
];

const mockStats = {
  totalCalls: 47,
  completedCalls: 38,
  missedCalls: 9,
  avgDuration: 185,
  successRate: 80.9,
};

const dispositions = [
  { value: 'INTERESTED', label: 'Interested', color: 'text-green-500' },
  { value: 'NOT_INTERESTED', label: 'Not Interested', color: 'text-red-500' },
  { value: 'CALLBACK_REQUESTED', label: 'Callback Requested', color: 'text-blue-500' },
  { value: 'VOICEMAIL_LEFT', label: 'Voicemail Left', color: 'text-purple-500' },
  { value: 'WRONG_NUMBER', label: 'Wrong Number', color: 'text-orange-500' },
  { value: 'FOLLOW_UP_NEEDED', label: 'Follow-up Needed', color: 'text-yellow-500' },
  { value: 'DEAL_CLOSED', label: 'Deal Closed', color: 'text-emerald-500' },
];

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function Dialpad({ onDial, phoneNumber, setPhoneNumber }) {
  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#'],
  ];

  const handleKeyPress = (key) => {
    setPhoneNumber((prev) => prev + key);
  };

  const handleBackspace = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  return (
    <div className="space-y-4">
      {/* Phone Number Display */}
      <div className="relative">
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter phone number"
          className="w-full rounded-xl border border-border/50 bg-muted/30 px-4 py-4 text-center text-2xl font-mono tracking-wider focus:border-primary/50 focus:outline-none"
        />
        {phoneNumber && (
          <button
            onClick={handleBackspace}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground hover:bg-muted/50"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Dialpad Grid */}
      <div className="grid grid-cols-3 gap-3">
        {keys.flat().map((key) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleKeyPress(key)}
            className="flex h-16 items-center justify-center rounded-xl bg-muted/50 text-2xl font-medium transition-all hover:bg-muted"
          >
            {key}
          </motion.button>
        ))}
      </div>

      {/* Call Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => phoneNumber && onDial(phoneNumber)}
        disabled={!phoneNumber}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-4 text-lg font-medium text-white shadow-lg shadow-green-500/25 transition-all hover:bg-green-600 disabled:opacity-50"
      >
        <Phone className="h-5 w-5" />
        Call
      </motion.button>
    </div>
  );
}

function ActiveCallCard({
  call,
  onEnd,
  onHold,
  onMute,
  isMuted,
  isOnHold,
  callDuration,
  callStatus,
}) {
  // Use callDuration from TeleCMI if provided, otherwise use local timer
  const [localDuration, setLocalDuration] = useState(0);
  const duration = callDuration !== undefined ? callDuration : localDuration;

  useEffect(() => {
    if (callDuration === undefined) {
      const interval = setInterval(() => {
        setLocalDuration((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [callDuration]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-green-600/5"
    >
      <div className="p-6">
        {/* Contact Info */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
            <User className="h-8 w-8 text-green-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{call.contact?.name || call.toNumber}</h3>
            <p className="text-muted-foreground">{call.toNumber}</p>
          </div>
        </div>

        {/* Call Status */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className={cn('h-3 w-3 rounded-full', isOnHold ? 'bg-yellow-500' : 'bg-green-500')}
          />
          <span className="text-lg font-medium">{isOnHold ? 'On Hold' : 'In Progress'}</span>
          <span className="font-mono text-2xl font-bold text-green-500">
            {formatDuration(duration)}
          </span>
        </div>

        {/* Call Controls */}
        <div className="flex items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onMute}
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-full transition-all',
              isMuted ? 'bg-red-500 text-white' : 'bg-muted hover:bg-muted/80'
            )}
          >
            {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onHold}
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-full transition-all',
              isOnHold ? 'bg-yellow-500 text-white' : 'bg-muted hover:bg-muted/80'
            )}
          >
            {isOnHold ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onEnd}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/25 transition-all hover:bg-red-600"
          >
            <PhoneOff className="h-7 w-7" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-muted transition-all hover:bg-muted/80"
          >
            <Volume2 className="h-6 w-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-muted transition-all hover:bg-muted/80"
          >
            <Users className="h-6 w-6" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function PowerDialerPanel({ isActive, onStart, onPause, onResume, onStop, status }) {
  const [selectedContacts, setSelectedContacts] = useState([]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Power Dialer</h3>
        <Zap className="h-5 w-5 text-yellow-500" />
      </div>

      {!isActive ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Automatically dial through a list of contacts without manual intervention.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-medium text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
          >
            <Zap className="h-4 w-4" />
            Start Power Dialer
          </motion.button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Progress */}
          <div className="rounded-xl bg-muted/50 p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {status?.stats?.completed || 0} / {status?.totalContacts || 0}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{
                  width: `${((status?.stats?.completed || 0) / (status?.totalContacts || 1)) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Current Contact */}
          {status?.currentContact && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
              <p className="mb-1 text-xs text-muted-foreground">Calling</p>
              <p className="font-medium">
                {status.currentContact.name || status.currentContact.phone}
              </p>
              <p className="text-sm text-muted-foreground">{status.currentContact.phone}</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-green-500/10 p-2">
              <p className="text-lg font-bold text-green-500">{status?.stats?.connected || 0}</p>
              <p className="text-[10px] text-muted-foreground">Connected</p>
            </div>
            <div className="rounded-lg bg-yellow-500/10 p-2">
              <p className="text-lg font-bold text-yellow-500">{status?.stats?.noAnswer || 0}</p>
              <p className="text-[10px] text-muted-foreground">No Answer</p>
            </div>
            <div className="rounded-lg bg-red-500/10 p-2">
              <p className="text-lg font-bold text-red-500">{status?.stats?.failed || 0}</p>
              <p className="text-[10px] text-muted-foreground">Failed</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            {status?.status === 'PAUSED' ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onResume}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 font-medium text-white"
              >
                <Play className="h-4 w-4" />
                Resume
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onPause}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-yellow-500 py-3 font-medium text-white"
              >
                <Pause className="h-4 w-4" />
                Pause
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStop}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-3 font-medium text-white"
            >
              <PhoneOff className="h-4 w-4" />
              Stop
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}

function CallHistoryItem({ call }) {
  const [showDisposition, setShowDisposition] = useState(false);

  const statusIcons = {
    COMPLETED: PhoneOutgoing,
    NO_ANSWER: PhoneMissed,
    BUSY: PhoneMissed,
    FAILED: PhoneMissed,
  };

  const StatusIcon = statusIcons[call.status] || Phone;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="group relative rounded-xl border border-border/50 bg-card/50 p-4 transition-all hover:border-primary/30"
    >
      <div className="flex items-center gap-3">
        {/* Status Icon */}
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full',
            call.status === 'COMPLETED' ? 'bg-green-500/10' : 'bg-red-500/10'
          )}
        >
          <StatusIcon
            className={cn(
              'h-5 w-5',
              call.status === 'COMPLETED' ? 'text-green-500' : 'text-red-500'
            )}
          />
        </div>

        {/* Contact Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{call.contact.name}</span>
            {call.direction === 'INBOUND' && <PhoneIncoming className="h-3 w-3 text-blue-500" />}
          </div>
          <p className="text-xs text-muted-foreground">{call.contact.phone}</p>
        </div>

        {/* Duration & Time */}
        <div className="text-right">
          <p className="font-mono text-sm">
            {call.duration > 0 ? formatDuration(call.duration) : '--:--'}
          </p>
          <p className="text-xs text-muted-foreground">{formatTime(call.startedAt)}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 transition-all group-hover:opacity-100">
          <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground">
            <Phone className="h-4 w-4" />
          </button>
          <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground">
            <MessageSquare className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Disposition Badge */}
      {call.disposition && (
        <div className="mt-2 pl-13">
          <span
            className={cn(
              'inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium',
              dispositions.find((d) => d.value === call.disposition)?.color,
              'bg-current/10'
            )}
          >
            {dispositions.find((d) => d.value === call.disposition)?.label}
          </span>
        </div>
      )}
    </motion.div>
  );
}

export default function DialerPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [recentCalls, setRecentCalls] = useState(mockRecentCalls);
  const [stats, setStats] = useState(mockStats);
  const [showPowerDialer, setShowPowerDialer] = useState(false);
  const [powerDialerActive, setPowerDialerActive] = useState(false);
  const [powerDialerStatus, setPowerDialerStatus] = useState(null);

  const { toast } = useToast();

  // TeleCMI context for real calls
  const {
    sdkReady,
    callStatus,
    callDuration,
    isMuted,
    isHeld: isOnHold,
    makeCall,
    endCall,
    toggleMute,
    toggleHold,
    sendDTMF,
    error: telecmiError,
  } = useTelecmi();

  // Track dialed number for active call display
  const [dialedNumber, setDialedNumber] = useState('');

  // Track active call state from TeleCMI
  const isInCall = callStatus !== CallStatus.IDLE && callStatus !== CallStatus.ENDED;
  const activeCall = isInCall
    ? {
        id: `call_${Date.now()}`,
        toNumber: dialedNumber || phoneNumber,
        contact: recentCalls.find((c) =>
          c.contact.phone
            .replace(/\s/g, '')
            .includes((dialedNumber || phoneNumber).replace(/\s/g, ''))
        )?.contact,
        startedAt: new Date(),
      }
    : null;

  const handleDial = async (number) => {
    if (!sdkReady) {
      toast({
        title: 'TeleCMI Not Ready',
        description: 'Please wait for TeleCMI SDK to initialize or login first.',
        variant: 'destructive',
      });
      return;
    }

    try {
      console.log('[Dialer] Making call to:', number);
      setDialedNumber(number); // Store the dialed number for display
      await makeCall(number);
      setPhoneNumber(''); // Clear input after call starts
      toast({
        title: 'Call Initiated',
        description: `Calling ${number}...`,
      });
    } catch (err) {
      setDialedNumber(''); // Clear on error
      console.error('[Dialer] Call error:', err);
      toast({
        title: 'Call Failed',
        description: err.message || 'Failed to initiate call',
        variant: 'destructive',
      });
    }
  };

  const handleEndCall = async () => {
    try {
      await endCall();
      setPhoneNumber('');
      setDialedNumber(''); // Clear dialed number
    } catch (err) {
      console.error('[Dialer] End call error:', err);
    }
  };

  const handleMute = async () => {
    try {
      await toggleMute();
    } catch (err) {
      console.error('[Dialer] Mute error:', err);
    }
  };

  const handleHold = async () => {
    try {
      await toggleHold();
    } catch (err) {
      console.error('[Dialer] Hold error:', err);
    }
  };

  const handleStartPowerDialer = () => {
    setPowerDialerActive(true);
    setPowerDialerStatus({
      status: 'ACTIVE',
      totalContacts: 25,
      currentIndex: 0,
      stats: { completed: 0, connected: 0, noAnswer: 0, failed: 0 },
      currentContact: { name: 'Priya Sharma', phone: '+91 98765 43210' },
    });
  };

  return (
    <div className="flex h-full">
      {/* Main Dialer Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold">Dialer</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Make calls and manage conversations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowPowerDialer(!showPowerDialer)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all',
                showPowerDialer || powerDialerActive
                  ? 'bg-yellow-500 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              <Zap className="h-4 w-4" />
              Power Dialer
            </motion.button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-5 gap-4 border-b border-border/50 bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalCalls}</p>
              <p className="text-xs text-muted-foreground">Total Calls</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <PhoneOutgoing className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.completedCalls}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <PhoneMissed className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.missedCalls}</p>
              <p className="text-xs text-muted-foreground">Missed</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatDuration(stats.avgDuration)}</p>
              <p className="text-xs text-muted-foreground">Avg Duration</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.successRate}%</p>
              <p className="text-xs text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Dialer Panel */}
          <div className="flex w-80 flex-col border-r border-border/50 p-6">
            {activeCall ? (
              <ActiveCallCard
                call={activeCall}
                onEnd={handleEndCall}
                onHold={handleHold}
                onMute={handleMute}
                isMuted={isMuted}
                isOnHold={isOnHold}
                callDuration={callDuration}
                callStatus={callStatus}
              />
            ) : (
              <Dialpad
                onDial={handleDial}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
              />
            )}

            {/* Power Dialer Panel */}
            <AnimatePresence>
              {showPowerDialer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 border-t border-border/50 pt-6"
                >
                  <PowerDialerPanel
                    isActive={powerDialerActive}
                    onStart={handleStartPowerDialer}
                    onPause={() => setPowerDialerStatus((prev) => ({ ...prev, status: 'PAUSED' }))}
                    onResume={() => setPowerDialerStatus((prev) => ({ ...prev, status: 'ACTIVE' }))}
                    onStop={() => {
                      setPowerDialerActive(false);
                      setPowerDialerStatus(null);
                    }}
                    status={powerDialerStatus}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Call History */}
          <div className="flex-1 overflow-auto p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Recent Calls</h2>
              <div className="flex items-center gap-2">
                <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted/50">
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted/50">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {recentCalls.map((call) => (
                <CallHistoryItem key={call.id} call={call} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
