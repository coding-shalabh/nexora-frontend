'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Bot,
  Link as LinkIcon,
  Unlink,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { UnifiedLayout } from '@/components/layout/unified';

// Animation variants for inner content
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export default function AIAssistantPage() {
  const searchParams = useSearchParams();
  const [linkStatus, setLinkStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [schedules, setSchedules] = useState([]);

  // Check if just linked
  useEffect(() => {
    if (searchParams.get('linked') === 'true') {
      toast.success('WhatsApp AI Assistant linked successfully!', {
        description: 'You will start receiving analytics on WhatsApp',
      });
      // Clean URL
      window.history.replaceState({}, '', '/settings/ai-assistant');
    }
  }, [searchParams]);

  // Fetch link status
  useEffect(() => {
    fetchLinkStatus();
    fetchSchedules();
  }, []);

  const fetchLinkStatus = async () => {
    try {
      const res = await fetch('/api/v1/ai-assistant/link/status', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await res.json();
      setLinkStatus(data);
    } catch (error) {
      console.error('Failed to fetch link status:', error);
      toast.error('Failed to load AI Assistant status');
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedules = async () => {
    try {
      const res = await fetch('/api/v1/ai-assistant/schedules', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await res.json();
      setSchedules(data.schedules || []);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    }
  };

  const handleLinkWhatsApp = async () => {
    setActionLoading(true);

    try {
      const res = await fetch('/api/v1/ai-assistant/link/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          redirectUrl: '/settings/ai-assistant',
        }),
      });

      const data = await res.json();

      if (data.success) {
        window.location.href = data.authorizationUrl;
      } else {
        toast.error(data.error || 'Failed to initiate linking');
      }
    } catch (error) {
      console.error('Link error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnlink = async () => {
    if (!confirm('Are you sure you want to unlink WhatsApp AI Assistant?')) {
      return;
    }

    setActionLoading(true);

    try {
      const res = await fetch('/api/v1/ai-assistant/link/revoke', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        toast.success('WhatsApp AI Assistant unlinked successfully');
        fetchLinkStatus();
      } else {
        toast.error(data.error || 'Failed to unlink');
      }
    } catch (error) {
      console.error('Unlink error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <UnifiedLayout hubId="settings" pageTitle="AI Assistant" fixedMenu={null}>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading AI Assistant settings...</p>
          </div>
        </div>
      </UnifiedLayout>
    );
  }

  return (
    <UnifiedLayout hubId="settings" pageTitle="AI Assistant" fixedMenu={null}>
      {/* Header Card */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="bg-white rounded-2xl p-6 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
            <Bot className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">AI Assistant</h2>
            <p className="text-sm text-gray-600">
              Get business insights and analytics directly on WhatsApp
            </p>
          </div>
        </div>
      </motion.div>

      {/* Link Status Card */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="bg-white rounded-2xl p-6 shadow-sm"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">WhatsApp Connection</h2>
            <p className="text-sm text-gray-600">
              Link your WhatsApp to receive real-time analytics
            </p>
          </div>
          {linkStatus?.linked ? (
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Active
            </Badge>
          ) : (
            <Badge variant="outline" className="text-gray-600">
              Not Linked
            </Badge>
          )}
        </div>

        {linkStatus?.linked ? (
          <div className="space-y-4">
            {/* Linked Number */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Linked Number</p>
                  <p className="text-lg font-semibold text-gray-900">{linkStatus.whatsappNumber}</p>
                </div>
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Linked On</p>
                <p className="font-semibold text-gray-900">
                  {new Date(linkStatus.linkedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Expires In</p>
                <p className="font-semibold text-gray-900">{linkStatus.daysRemaining} days</p>
              </div>
            </div>

            {/* Usage Stats */}
            {linkStatus.usage && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900">Today's Usage</p>
                  <p className="text-sm text-gray-600">
                    {linkStatus.usage.today}/{linkStatus.usage.limit} queries
                  </p>
                </div>
                <Progress
                  value={(linkStatus.usage.today / linkStatus.usage.limit) * 100}
                  className="h-2"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {linkStatus.usage.remaining} queries remaining today
                </p>
              </div>
            )}

            {/* Expiry Warning */}
            {linkStatus.daysRemaining <= 7 && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-900">Link Expiring Soon</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Your link expires in {linkStatus.daysRemaining} days. Renew to continue
                    receiving updates.
                  </p>
                </div>
              </div>
            )}

            {/* Unlink Button */}
            <Button
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
              onClick={handleUnlink}
              disabled={actionLoading}
            >
              <Unlink className="w-4 h-4 mr-2" />
              Unlink WhatsApp
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                  <Bot className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">How to Link Your WhatsApp</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Linking can only be initiated from WhatsApp. Follow these steps:
                  </p>
                  <ol className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-blue-600">1.</span>
                      <span>Send a message to Nexora AI Assistant on WhatsApp</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-blue-600">2.</span>
                      <span>Type "Link my account" or "Connect to Nexora"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-blue-600">3.</span>
                      <span>You'll receive an authorization link via WhatsApp</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-blue-600">4.</span>
                      <span>Click the link and authorize your WhatsApp number</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-blue-600">5.</span>
                      <span>Your WhatsApp will be linked and appear here</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h4 className="font-semibold text-gray-900 mb-3">What You'll Get</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Real-time Analytics</p>
                    <p className="text-xs text-gray-600 mt-1">Sales, CRM, tickets on demand</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Automated Reports</p>
                    <p className="text-xs text-gray-600 mt-1">Daily/weekly summaries</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Event Alerts</p>
                    <p className="text-xs text-gray-600 mt-1">Instant notifications</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Scheduled Reports */}
      {linkStatus?.linked && (
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="show"
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Scheduled Reports</h2>
              <p className="text-sm text-gray-600">
                Set up automated reports to receive on WhatsApp
              </p>
            </div>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add Schedule
            </Button>
          </div>

          {schedules.length > 0 ? (
            <div className="space-y-3">
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {schedule.type.replace(/_/g, ' ')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {schedule.frequency} at {schedule.time}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No scheduled reports yet</p>
              <p className="text-xs mt-1">Click "Add Schedule" to create one</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Feature Examples */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 shadow-sm border border-blue-100"
      >
        <h3 className="font-semibold text-gray-900 mb-3">Try These Queries</h3>
        <div className="space-y-2">
          <div className="bg-white rounded-lg p-3 text-sm">💬 "Show me this month's sales"</div>
          <div className="bg-white rounded-lg p-3 text-sm">💬 "How many open tickets?"</div>
          <div className="bg-white rounded-lg p-3 text-sm">💬 "What's my subscription plan?"</div>
          <div className="bg-white rounded-lg p-3 text-sm">💬 "Schedule daily report at 9 AM"</div>
        </div>
      </motion.div>
    </UnifiedLayout>
  );
}
