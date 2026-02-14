'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Smartphone,
  Key,
  Shield,
  CheckCircle2,
  Copy,
  AlertTriangle,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  Search,
  QrCode,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { UnifiedLayout } from '@/components/layout/unified';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

// Security tips
const securityTips = [
  {
    title: 'Use a strong password',
    description: 'Combine letters, numbers, and special characters',
    icon: Lock,
    color: 'blue',
  },
  {
    title: 'Never share your 2FA codes',
    description: 'Your codes are personal and should never be shared',
    icon: Eye,
    color: 'purple',
  },
  {
    title: 'Store backup codes safely',
    description: 'Keep them in a password manager or secure location',
    icon: Key,
    color: 'amber',
  },
];

const tipColors = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-100' },
  amber: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-100' },
};

export default function TwoFactorPage() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showManualCode, setShowManualCode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const backupCodes = [
    'ABCD-1234-EFGH',
    'IJKL-5678-MNOP',
    'QRST-9012-UVWX',
    'YZAB-3456-CDEF',
    'GHIJ-7890-KLMN',
    'OPQR-1234-STUV',
    'WXYZ-5678-ABCD',
    'EFGH-9012-IJKL',
  ];

  // Filter tips based on search
  const filteredTips = securityTips.filter(
    (tip) =>
      tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <UnifiedLayout hubId="settings" pageTitle="Two-Factor Authentication" fixedMenu={null}>
      <motion.div
        className="h-full overflow-y-auto p-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Search Bar - Right Aligned */}
        <motion.div variants={itemVariants} className="flex justify-end">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-64 pl-10 pr-4 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Authenticator Setup - Left Column */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-6 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Authenticator App</h3>
                <p className="text-sm text-gray-500">Google Authenticator, Authy, or similar</p>
              </div>
            </div>

            <div className="space-y-3">
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center">
                    <QrCode className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Setup via QR Code</p>
                    <p className="text-xs text-gray-500">Scan with your authenticator app</p>
                  </div>
                </div>
                {is2FAEnabled ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSetupDialog(true)}
                    className="text-primary border-primary/20 hover:bg-primary/5"
                  >
                    <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                    Reconfigure
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => setShowSetupDialog(true)}>
                    Setup
                  </Button>
                )}
              </motion.div>

              {is2FAEnabled && (
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-white border border-red-100 hover:border-red-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Disable 2FA</p>
                      <p className="text-xs text-gray-500">Remove extra security layer</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIs2FAEnabled(false)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Disable
                  </Button>
                </motion.div>
              )}

              {!is2FAEnabled && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800">2FA is disabled</p>
                      <p className="text-sm text-amber-700">
                        Your account is less secure without two-factor authentication.
                      </p>
                      <Button
                        size="sm"
                        className="mt-3 bg-amber-600 hover:bg-amber-700"
                        onClick={() => setShowSetupDialog(true)}
                      >
                        Enable 2FA Now
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Backup Codes - Right Column */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-2xl p-6 border border-amber-200/50"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <Key className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Backup Codes</h3>
                <p className="text-sm text-gray-500">Use if you lose your authenticator</p>
              </div>
            </div>

            {is2FAEnabled ? (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-white border border-amber-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-900">8 codes available</span>
                    </div>
                    <Badge className="bg-green-50 text-green-700 hover:bg-green-50">Active</Badge>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">
                    Each code can only be used once. Generate new codes if you run low.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowBackupCodes(true)}
                      className="flex-1"
                    >
                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                      View Codes
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                      Regenerate
                    </Button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/80 border border-amber-100">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                      Store these codes in a secure location like a password manager.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-xl border border-amber-200/50">
                <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Key className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">Enable 2FA to get backup codes</p>
                <p className="text-xs text-gray-400 mt-1">Backup codes provide account recovery</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Security Tips */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl p-6 border border-blue-200/50"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Security Tips</h3>
              <p className="text-sm text-gray-500">Best practices for account security</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {filteredTips.length === 0 ? (
              <div className="col-span-full text-center py-8 bg-white rounded-xl border border-blue-200/50">
                <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                  <Search className="h-6 w-6 text-blue-400" />
                </div>
                <p className="text-sm text-gray-500">No tips found</p>
                <p className="text-xs text-gray-400 mt-1">Try adjusting your search</p>
              </div>
            ) : (
              filteredTips.map((tip, index) => {
                const colors = tipColors[tip.color];
                return (
                  <motion.div
                    key={tip.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={cn(
                      'p-4 rounded-xl bg-white border transition-all cursor-pointer',
                      colors.border,
                      'hover:shadow-md'
                    )}
                  >
                    <div
                      className={cn(
                        'h-10 w-10 rounded-lg flex items-center justify-center mb-3',
                        colors.bg
                      )}
                    >
                      <tip.icon className={cn('h-5 w-5', colors.icon)} />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{tip.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{tip.description}</p>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Setup Dialog */}
        <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
              <DialogDescription>Scan this QR code with your authenticator app</DialogDescription>
            </DialogHeader>
            <div className="space-y-5">
              {/* QR Code */}
              <div className="flex justify-center p-6">
                <div className="h-48 w-48 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200">
                  <div className="text-center text-gray-400">
                    <QrCode className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">QR Code</p>
                  </div>
                </div>
              </div>

              {/* Manual Entry */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-700">Manual Entry Code</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowManualCode(!showManualCode)}
                    className="text-xs"
                  >
                    {showManualCode ? (
                      <>
                        <EyeOff className="mr-1 h-3 w-3" /> Hide
                      </>
                    ) : (
                      <>
                        <Eye className="mr-1 h-3 w-3" /> Show
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={showManualCode ? 'ABCD EFGH IJKL MNOP' : '•••• •••• •••• ••••'}
                    readOnly
                    className="font-mono bg-gray-50 rounded-xl"
                  />
                  <Button variant="outline" size="icon" className="rounded-xl">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Verification */}
              <div className="space-y-2">
                <Label htmlFor="verification-code" className="text-gray-700">
                  Verification Code
                </Label>
                <Input
                  id="verification-code"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="text-center text-lg tracking-widest rounded-xl"
                  maxLength={6}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowSetupDialog(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setIs2FAEnabled(true);
                  setShowSetupDialog(false);
                  setShowBackupCodes(true);
                }}
                className="rounded-xl"
              >
                Verify & Enable
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Backup Codes Dialog */}
        <Dialog open={showBackupCodes} onOpenChange={setShowBackupCodes}>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>Backup Codes</DialogTitle>
              <DialogDescription>Save these codes in a secure location</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 rounded-xl font-mono text-sm">
              {backupCodes.map((code, index) => (
                <div
                  key={index}
                  className="p-2.5 bg-white rounded-lg text-center text-gray-700 border border-gray-200"
                >
                  {code}
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowBackupCodes(false)}
                className="rounded-xl"
              >
                Close
              </Button>
              <Button className="rounded-xl">
                <Copy className="mr-2 h-4 w-4" />
                Copy All
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </UnifiedLayout>
  );
}
