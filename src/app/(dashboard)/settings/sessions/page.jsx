'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Clock,
  MapPin,
  LogOut,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Search,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

// Mock sessions data
const sessionsData = [
  {
    id: 'session_1',
    device: 'Windows PC',
    browser: 'Chrome 120',
    deviceType: 'desktop',
    ip: '192.168.1.100',
    location: 'Mumbai, India',
    lastActive: 'Active now',
    isCurrent: true,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'session_2',
    device: 'iPhone 15',
    browser: 'Safari Mobile',
    deviceType: 'mobile',
    ip: '103.45.67.89',
    location: 'Delhi, India',
    lastActive: '2 hours ago',
    isCurrent: false,
    createdAt: '2024-01-14T15:20:00Z',
  },
  {
    id: 'session_3',
    device: 'MacBook Pro',
    browser: 'Firefox 121',
    deviceType: 'desktop',
    ip: '172.16.0.50',
    location: 'Bangalore, India',
    lastActive: '1 day ago',
    isCurrent: false,
    createdAt: '2024-01-13T09:15:00Z',
  },
  {
    id: 'session_4',
    device: 'iPad Pro',
    browser: 'Safari',
    deviceType: 'tablet',
    ip: '10.0.0.25',
    location: 'Chennai, India',
    lastActive: '3 days ago',
    isCurrent: false,
    createdAt: '2024-01-10T14:45:00Z',
  },
];

const deviceIcons = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

const deviceColors = {
  desktop: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  mobile: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  tablet: { bg: 'bg-primary/5', text: 'text-primary', border: 'border-primary/20' },
};

export default function SessionsPage() {
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);
  const [showRevokeAllConfirm, setShowRevokeAllConfirm] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessions, setSessions] = useState(sessionsData);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRevokeSession = (session) => {
    setSelectedSession(session);
    setShowRevokeConfirm(true);
  };

  const confirmRevokeSession = () => {
    setSessions(sessions.filter((s) => s.id !== selectedSession?.id));
    setShowRevokeConfirm(false);
  };

  const confirmRevokeAllSessions = () => {
    setSessions(sessions.filter((s) => s.isCurrent));
    setShowRevokeAllConfirm(false);
  };

  const currentSession = sessions.find((s) => s.isCurrent);
  const otherSessions = sessions.filter((s) => !s.isCurrent);

  // Filter sessions based on search
  const filteredOtherSessions = otherSessions.filter(
    (session) =>
      session.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.browser.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      className="flex-1 space-y-6 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Search Bar - Right Aligned */}
      <motion.div variants={itemVariants} className="flex justify-end">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 w-64 pl-10 pr-4 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Current Session - Left Column */}
        {currentSession && (
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Current Session</h3>
                <p className="text-sm text-gray-500">This device</p>
              </div>
            </div>

            <motion.div
              className="p-4 rounded-xl bg-white border border-green-200 hover:border-green-300 transition-colors"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                  {(() => {
                    const DeviceIcon = deviceIcons[currentSession.deviceType];
                    return <DeviceIcon className="h-6 w-6 text-green-600" />;
                  })()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{currentSession.device}</p>
                    <Badge className="rounded-lg bg-green-100 text-green-700 hover:bg-green-100">
                      Active now
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {currentSession.browser}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {currentSession.location}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <p className="text-xs text-green-700 mt-4 flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Your current session is secure
            </p>
          </motion.div>
        )}

        {/* Security Notice - Right Column */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-2xl p-6 border border-amber-200/50"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Security Notice</h3>
              <p className="text-sm text-gray-500">Keep your account safe</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-amber-200">
            <p className="text-sm text-gray-700">
              If you see a session you don't recognize, sign out of that device immediately and
              change your password to secure your account.
            </p>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="text-amber-600 border-amber-200 hover:bg-amber-50"
              >
                Change Password
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => setShowRevokeAllConfirm(true)}
              >
                <LogOut className="mr-1.5 h-3.5 w-3.5" />
                Sign Out All
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Other Sessions */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-6 border border-gray-200"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
              <Monitor className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Other Sessions</h3>
              <p className="text-sm text-gray-500">
                {filteredOtherSessions.length} session
                {filteredOtherSessions.length !== 1 ? 's' : ''} from other devices
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {filteredOtherSessions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-7 w-7 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">
                {searchQuery ? 'No sessions found' : 'No other active sessions'}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {searchQuery ? 'Try adjusting your search' : "You're only signed in on this device"}
              </p>
            </div>
          ) : (
            filteredOtherSessions.map((session) => {
              const DeviceIcon = deviceIcons[session.deviceType];
              const colors = deviceColors[session.deviceType] || deviceColors.desktop;
              return (
                <motion.div
                  key={session.id}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-xl bg-white border transition-colors',
                    colors.border,
                    'hover:shadow-sm'
                  )}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'h-12 w-12 rounded-xl flex items-center justify-center',
                        colors.bg
                      )}
                    >
                      <DeviceIcon className={cn('h-6 w-6', colors.text)} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{session.device}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {session.browser}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {session.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {session.lastActive}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleRevokeSession(session)}
                  >
                    <LogOut className="mr-1.5 h-3.5 w-3.5" />
                    Sign Out
                  </Button>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>

      {/* Revoke Single Session Dialog */}
      <AlertDialog open={showRevokeConfirm} onOpenChange={setShowRevokeConfirm}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out Device?</AlertDialogTitle>
            <AlertDialogDescription>
              This will sign out the session from "{selectedSession?.device}". The user will need to
              sign in again on that device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-red-600 hover:bg-red-700"
              onClick={confirmRevokeSession}
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Revoke All Sessions Dialog */}
      <AlertDialog open={showRevokeAllConfirm} onOpenChange={setShowRevokeAllConfirm}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out All Other Devices?</AlertDialogTitle>
            <AlertDialogDescription>
              This will sign out all sessions except your current one. You will stay signed in on
              this device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-red-600 hover:bg-red-700"
              onClick={confirmRevokeAllSessions}
            >
              Sign Out All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
