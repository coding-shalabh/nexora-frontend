'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import {
  Plus,
  Settings,
  Trash2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Phone,
  Mail,
  Smartphone,
  PhoneCall,
  Shield,
  Clock,
  BarChart3,
  Wifi,
  WifiOff,
  Key,
  Globe,
  Building2,
  FileText,
  ChevronRight,
  X,
  Loader2,
  Eye,
  EyeOff,
  Link2,
  Unlink,
  Search,
  TrendingUp,
  FlaskConical,
} from 'lucide-react';
import { UnifiedLayout } from '@/components/layout/unified';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

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

// WhatsApp icon
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const channelTypes = {
  WHATSAPP: {
    icon: WhatsAppIcon,
    label: 'WhatsApp Business',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    description: 'Connect WhatsApp Business API',
  },
  SMS: {
    icon: Smartphone,
    label: 'SMS',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'Send SMS messages',
  },
  EMAIL: {
    icon: Mail,
    label: 'Email',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Connect email mailbox',
  },
  VOICE: {
    icon: PhoneCall,
    label: 'Voice',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    description: 'Click-to-call and call tracking',
  },
};

// Providers per channel type
const channelProviders = {
  WHATSAPP: [
    {
      id: 'msg91',
      name: 'MSG91',
      color: '#00C853',
      oauthEnabled: false,
      apiFields: ['authKey', 'phoneNumber'],
      description: 'Indian WhatsApp Business API provider',
    },
    {
      id: 'twilio',
      name: 'Twilio',
      color: '#F22F46',
      oauthEnabled: true,
      oauthLabel: 'Connect Twilio Account',
      apiFields: ['accountSid', 'authToken', 'phoneNumber'],
      description: 'Global WhatsApp Business API',
    },
    {
      id: 'apidog',
      name: 'API Dog',
      color: '#FA5A28',
      oauthEnabled: false,
      apiFields: ['baseUrl', 'apiToken'],
      description: 'All-in-one API service partner',
    },
  ],
  SMS: [
    {
      id: 'msg91',
      name: 'MSG91',
      color: '#00C853',
      oauthEnabled: false,
      apiFields: ['authKey', 'senderId', 'dltEntityId'],
      description: 'Indian SMS with DLT compliance',
    },
    {
      id: 'twilio',
      name: 'Twilio',
      color: '#F22F46',
      oauthEnabled: true,
      oauthLabel: 'Connect Twilio Account',
      apiFields: ['accountSid', 'authToken', 'phoneNumber'],
      description: 'Global SMS provider',
    },
    {
      id: 'apidog',
      name: 'API Dog',
      color: '#FA5A28',
      oauthEnabled: false,
      apiFields: ['baseUrl', 'apiToken'],
      description: 'All-in-one API service partner',
    },
  ],
  VOICE: [
    {
      id: 'msg91',
      name: 'MSG91',
      color: '#00C853',
      oauthEnabled: false,
      apiFields: ['authKey', 'callerId'],
      description: 'Indian voice calling',
    },
    {
      id: 'twilio',
      name: 'Twilio',
      color: '#F22F46',
      oauthEnabled: true,
      oauthLabel: 'Connect Twilio Account',
      apiFields: ['accountSid', 'authToken', 'phoneNumber'],
      description: 'Global voice calling',
    },
    {
      id: 'apidog',
      name: 'API Dog',
      color: '#FA5A28',
      oauthEnabled: false,
      apiFields: ['baseUrl', 'apiToken'],
      description: 'All-in-one API service partner',
    },
  ],
  EMAIL: [
    {
      id: 'google',
      name: 'Gmail',
      color: '#EA4335',
      oauthEnabled: true,
      apiFields: [],
      description: 'Connect via Google OAuth',
    },
    {
      id: 'microsoft',
      name: 'Microsoft 365',
      color: '#0078D4',
      oauthEnabled: true,
      apiFields: [],
      description: 'Connect via Microsoft OAuth',
    },
    {
      id: 'apidog',
      name: 'API Dog',
      color: '#FA5A28',
      oauthEnabled: false,
      apiFields: ['baseUrl', 'apiToken'],
      description: 'All-in-one API service partner',
    },
  ],
};

// Map API channel types to display types
const mapChannelType = (type) => {
  const typeMap = {
    WHATSAPP: 'WHATSAPP',
    EMAIL: 'EMAIL',
    SMS: 'SMS',
    VOICE: 'VOICE',
    whatsapp: 'WHATSAPP',
    email: 'EMAIL',
    sms: 'SMS',
    voice: 'VOICE',
  };
  return typeMap[type] || type?.toUpperCase() || 'UNKNOWN';
};

function HealthBadge({ status }) {
  const config = {
    HEALTHY: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', label: 'Healthy' },
    DEGRADED: {
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      label: 'Degraded',
    },
    ERROR: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Error' },
    UNKNOWN: { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-50', label: 'Unknown' },
  };

  const { icon: Icon, color, bg, label } = config[status] || config.UNKNOWN;

  return (
    <span
      className={cn(
        'flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium',
        bg,
        color
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

// Helper to format identifier with label based on channel type
function formatIdentifier(channelType, identifier) {
  const labels = {
    WHATSAPP: { label: 'Phone', icon: Phone },
    SMS: { label: 'Sender ID', icon: Smartphone },
    EMAIL: { label: 'Email', icon: Mail },
    VOICE: { label: 'Caller ID', icon: PhoneCall },
  };
  const config = labels[channelType] || { label: 'ID', icon: null };
  return { label: config.label, value: identifier, icon: config.icon };
}

function ChannelCard({ channel, onToggle, onDelete, onRefresh }) {
  const router = useRouter();
  const config = channelTypes[channel.channelType];
  const Icon = config?.icon || Mail;
  const identifierInfo = formatIdentifier(channel.channelType, channel.identifier);

  const handleConfigure = () => {
    const channelRoutes = {
      WHATSAPP: '/settings/whatsapp',
      EMAIL: '/settings/email',
      SMS: '/settings/sms',
      VOICE: '/settings/voice',
    };
    const route = channelRoutes[channel.channelType] || '/settings/channels';
    router.push(route);
  };

  const borderColors = {
    WHATSAPP: 'border-green-200',
    SMS: 'border-purple-200',
    EMAIL: 'border-blue-200',
    VOICE: 'border-orange-200',
  };

  return (
    <motion.div variants={itemVariants} whileHover={{ scale: 1.01, y: -2 }} className="group">
      <div
        className={cn(
          'bg-white rounded-2xl p-5 transition-all border',
          borderColors[channel.channelType] || 'border-gray-200',
          !channel.isEnabled && 'opacity-60'
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'h-12 w-12 rounded-xl flex items-center justify-center',
                config?.bgColor
              )}
            >
              <Icon className={cn('h-6 w-6', config?.color)} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{channel.name}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-400">{identifierInfo.label}:</span>
                <span>{identifierInfo.value}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <HealthBadge status={channel.healthStatus} />
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
              onClick={() => onRefresh(channel.id)}
            >
              <RefreshCw className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-gray-50 mb-4">
          {channel.channelType === 'VOICE' ? (
            <>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{channel.stats.calls}</p>
                <p className="text-[10px] text-gray-500">Total Calls</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">{channel.stats.answered}</p>
                <p className="text-[10px] text-gray-500">Answered</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-red-600">{channel.stats.missed}</p>
                <p className="text-[10px] text-gray-500">Missed</p>
              </div>
            </>
          ) : channel.channelType === 'EMAIL' ? (
            <>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{channel.stats.sent}</p>
                <p className="text-[10px] text-gray-500">Sent</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">{channel.stats.opened}</p>
                <p className="text-[10px] text-gray-500">Opened</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">{channel.stats.replied}</p>
                <p className="text-[10px] text-gray-500">Replied</p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">
                  {channel.stats.sent?.toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-500">Sent</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">
                  {channel.stats.delivered?.toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-500">Delivered</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">
                  {channel.stats.read?.toLocaleString() ||
                    channel.stats.failed?.toLocaleString() ||
                    0}
                </p>
                <p className="text-[10px] text-gray-500">
                  {channel.stats.read ? 'Read' : 'Failed'}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Metadata */}
        <div className="text-xs text-gray-500 space-y-1.5 mb-4">
          {channel.metadata.businessName && (
            <div className="flex items-center gap-2">
              <Building2 className="h-3 w-3" />
              <span>{channel.metadata.businessName}</span>
            </div>
          )}
          {channel.metadata.dltEntityId && (
            <div className="flex items-center gap-2">
              <Shield className="h-3 w-3" />
              <span>DLT: {channel.metadata.dltEntityId}</span>
            </div>
          )}
          {channel.metadata.provider && (
            <div className="flex items-center gap-2">
              <Globe className="h-3 w-3" />
              <span>
                {channel.metadata.provider} • {channel.metadata.syncStatus}
              </span>
            </div>
          )}
          {channel.metadata.templatesApproved && (
            <div className="flex items-center gap-2">
              <FileText className="h-3 w-3" />
              <span>{channel.metadata.templatesApproved} templates approved</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>Last check: {channel.lastHealthCheck}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Button
              variant={channel.isEnabled ? 'outline' : 'default'}
              size="sm"
              onClick={() => onToggle(channel.id)}
              className="h-8 rounded-lg"
            >
              {channel.isEnabled ? (
                <>
                  <WifiOff className="h-3.5 w-3.5 mr-1.5" /> Disable
                </>
              ) : (
                <>
                  <Wifi className="h-3.5 w-3.5 mr-1.5" /> Enable
                </>
              )}
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleConfigure} className="h-8 w-8 p-0">
              <Settings className="h-4 w-4 text-gray-400" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => onDelete(channel.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AddChannelModal({ isOpen, onClose, onAdd }) {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [authMethod, setAuthMethod] = useState('api');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    authKey: '',
    phoneNumber: '',
    senderId: '',
    dltEntityId: '',
    callerId: '',
    accountSid: '',
    authToken: '',
  });
  const [loading, setLoading] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const handleClose = () => {
    setSelectedType(null);
    setSelectedProvider(null);
    setAuthMethod('api');
    setStep(1);
    setFormData({
      name: '',
      authKey: '',
      phoneNumber: '',
      senderId: '',
      dltEntityId: '',
      callerId: '',
      accountSid: '',
      authToken: '',
    });
    setShowSecret(false);
    onClose();
  };

  const handleBack = () => {
    if (step === 4) setStep(3);
    else if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    if (selectedType === 'EMAIL') {
      setAuthMethod('oauth');
      setStep(4);
    } else {
      setStep(3);
    }
  };

  const handleAuthMethodSelect = (method) => {
    setAuthMethod(method);
    if (method === 'oauth') {
      const provider = selectedProvider?.id;
      const token = localStorage.getItem('accessToken');

      if (!token) {
        alert('Please log in to connect an account');
        return;
      }

      if (provider === 'twilio') {
        const oauthUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://api.nexoraos.pro/api/v1'}/oauth/twilio/authorize?returnUrl=/settings/channels&token=${token}`;
        window.location.href = oauthUrl;
        return;
      }

      return;
    }
    setStep(4);
  };

  const handleConnect = async () => {
    setLoading(true);
    try {
      const provider = selectedProvider?.id;
      let configPayload = { provider, name: formData.name };

      if (provider === 'msg91') {
        if (selectedType === 'WHATSAPP') {
          configPayload = {
            ...configPayload,
            setupMode: 'SELF_SERVICE',
            msg91AuthKey: formData.authKey,
            phoneNumber: formData.phoneNumber.replace(/\D/g, ''),
          };
        } else if (selectedType === 'SMS') {
          configPayload = {
            ...configPayload,
            setupMode: 'SELF_SERVICE',
            msg91AuthKey: formData.authKey,
            senderId: formData.senderId,
            dltEntityId: formData.dltEntityId,
          };
        } else if (selectedType === 'VOICE') {
          configPayload = {
            ...configPayload,
            setupMode: 'SELF_SERVICE',
            msg91AuthKey: formData.authKey,
            callerId: formData.callerId.replace(/\D/g, ''),
            enableRecording: true,
          };
        }
      } else if (provider === 'twilio') {
        configPayload = {
          ...configPayload,
          setupMode: 'SELF_SERVICE',
          accountSid: formData.accountSid,
          authToken: formData.authToken,
          phoneNumber: formData.phoneNumber.replace(/\D/g, ''),
        };
      } else if (provider === 'apidog') {
        configPayload = {
          ...configPayload,
          setupMode: 'SELF_SERVICE',
          baseUrl: formData.baseUrl,
          apiToken: formData.apiToken,
          provider: 'APIDOG',
        };
      } else if (provider === 'google' || provider === 'microsoft') {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('Please log in to connect an email account');
        }
        const oauthUrl =
          provider === 'google'
            ? `${process.env.NEXT_PUBLIC_API_URL || 'https://api.nexoraos.pro/api/v1'}/oauth/google/authorize?returnUrl=/settings/channels&token=${token}`
            : `${process.env.NEXT_PUBLIC_API_URL || 'https://api.nexoraos.pro/api/v1'}/oauth/microsoft/authorize?returnUrl=/settings/channels&token=${token}`;
        window.location.href = oauthUrl;
        return;
      }

      const endpoint = `/channels/${selectedType.toLowerCase()}/configure`;
      const res = await api.post(endpoint, configPayload);

      if (!res.success) {
        throw new Error(res.message || `Failed to configure ${selectedType}`);
      }

      onAdd({ ...formData, channelType: selectedType, provider });
      handleClose();
    } catch (err) {
      console.error('Failed to connect channel:', err);
      alert(err.message || 'Failed to connect channel');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const providers = selectedType ? channelProviders[selectedType] || [] : [];

  const getStepTitle = () => {
    if (step === 1) return 'Add Channel';
    if (step === 2) return `Select ${channelTypes[selectedType]?.label} Provider`;
    if (step === 3) return 'Choose Connection Method';
    if (step === 4) return `Connect ${selectedProvider?.name}`;
    return 'Add Channel';
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="h-8 w-8 p-0 rounded-lg"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
              </Button>
            )}
            <h2 className="text-xl font-semibold text-gray-900">{getStepTitle()}</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0 rounded-lg"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Step 1: Select Channel Type */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(channelTypes).map(([type, config]) => {
              const TypeIcon = config.icon;
              const providerCount = channelProviders[type]?.length || 0;
              return (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedType(type);
                    setStep(2);
                  }}
                  className="p-4 rounded-xl bg-gray-50 text-left transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div
                    className={cn(
                      'h-11 w-11 rounded-xl flex items-center justify-center mb-3',
                      config.bgColor
                    )}
                  >
                    <TypeIcon className={cn('h-5 w-5', config.color)} />
                  </div>
                  <h3 className="font-semibold text-gray-900">{config.label}</h3>
                  <p className="text-xs text-gray-500 mt-1">{config.description}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-gray-600 mt-2 inline-block">
                    {providerCount} provider{providerCount !== 1 ? 's' : ''}
                  </span>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Step 2: Select Provider */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Choose your {channelTypes[selectedType]?.label.toLowerCase()} provider
            </p>
            <div className="space-y-3">
              {providers.map((provider) => (
                <motion.button
                  key={provider.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleProviderSelect(provider)}
                  className="w-full p-4 rounded-xl bg-gray-50 flex items-center gap-4 transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center text-xl font-bold text-white"
                    style={{ backgroundColor: provider.color }}
                  >
                    {provider.name.charAt(0)}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                    <p className="text-xs text-gray-500">{provider.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Select Auth Method */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              How would you like to connect {selectedProvider?.name}?
            </p>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.01 }}
                onClick={() => handleAuthMethodSelect('oauth')}
                disabled={!selectedProvider?.oauthEnabled}
                className={cn(
                  'w-full p-4 rounded-xl flex items-center gap-4 transition-all',
                  selectedProvider?.oauthEnabled
                    ? 'bg-gray-50 hover:bg-gray-100'
                    : 'bg-gray-50 opacity-60 cursor-not-allowed'
                )}
              >
                <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <ExternalLink className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {selectedProvider?.oauthLabel || 'Connect with OAuth'}
                    </h3>
                    <Badge
                      className={cn(
                        'text-[10px]',
                        selectedProvider?.oauthEnabled
                          ? 'bg-green-50 text-green-700'
                          : 'bg-yellow-50 text-yellow-700'
                      )}
                    >
                      {selectedProvider?.oauthEnabled ? 'Available' : 'Coming Soon'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">One-click secure connection</p>
                </div>
                {selectedProvider?.oauthEnabled && (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.01 }}
                onClick={() => handleAuthMethodSelect('api')}
                className="w-full p-4 rounded-xl bg-gray-50 flex items-center gap-4 transition-all hover:bg-gray-100"
              >
                <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center">
                  <Key className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">Enter API Credentials</h3>
                    <Badge className="text-[10px] bg-green-50 text-green-700">Available</Badge>
                  </div>
                  <p className="text-xs text-gray-500">
                    Manually enter your {selectedProvider?.name} API keys
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </motion.button>
            </div>
          </div>
        )}

        {/* Step 4: Credentials Form */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-700">Channel Name</Label>
              <Input
                placeholder={`e.g., ${channelTypes[selectedType]?.label} - Main`}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-11 rounded-xl bg-gray-50 border-0"
              />
            </div>

            {/* MSG91 Credentials */}
            {selectedProvider?.id === 'msg91' && (
              <>
                <div className="space-y-2">
                  <Label className="text-gray-700">MSG91 Auth Key</Label>
                  <div className="relative">
                    <Input
                      type={showSecret ? 'text' : 'password'}
                      placeholder="Enter your MSG91 auth key"
                      value={formData.authKey}
                      onChange={(e) => setFormData({ ...formData, authKey: e.target.value })}
                      className="h-11 rounded-xl bg-gray-50 border-0 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-9 w-9 p-0"
                      onClick={() => setShowSecret(!showSecret)}
                    >
                      {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {selectedType === 'WHATSAPP' && (
                  <div className="space-y-2">
                    <Label className="text-gray-700">WhatsApp Phone Number</Label>
                    <Input
                      placeholder="+91 98765 43210"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="h-11 rounded-xl bg-gray-50 border-0"
                    />
                  </div>
                )}

                {selectedType === 'SMS' && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-gray-700">Sender ID (Header)</Label>
                      <Input
                        placeholder="e.g., ACMECO"
                        value={formData.senderId}
                        onChange={(e) => setFormData({ ...formData, senderId: e.target.value })}
                        maxLength={6}
                        className="h-11 rounded-xl bg-gray-50 border-0"
                      />
                      <p className="text-xs text-gray-400">6 character alphanumeric</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">DLT Entity ID</Label>
                      <Input
                        placeholder="1201159XXXXXX"
                        value={formData.dltEntityId}
                        onChange={(e) => setFormData({ ...formData, dltEntityId: e.target.value })}
                        className="h-11 rounded-xl bg-gray-50 border-0"
                      />
                    </div>
                  </>
                )}

                {selectedType === 'VOICE' && (
                  <div className="space-y-2">
                    <Label className="text-gray-700">Caller ID (Phone Number)</Label>
                    <Input
                      placeholder="+91 98765 43210"
                      value={formData.callerId}
                      onChange={(e) => setFormData({ ...formData, callerId: e.target.value })}
                      className="h-11 rounded-xl bg-gray-50 border-0"
                    />
                  </div>
                )}
              </>
            )}

            {/* Twilio Credentials */}
            {selectedProvider?.id === 'twilio' && (
              <>
                <div className="space-y-2">
                  <Label className="text-gray-700">Account SID</Label>
                  <Input
                    placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    value={formData.accountSid}
                    onChange={(e) => setFormData({ ...formData, accountSid: e.target.value })}
                    className="h-11 rounded-xl bg-gray-50 border-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Auth Token</Label>
                  <div className="relative">
                    <Input
                      type={showSecret ? 'text' : 'password'}
                      placeholder="Enter your Twilio auth token"
                      value={formData.authToken}
                      onChange={(e) => setFormData({ ...formData, authToken: e.target.value })}
                      className="h-11 rounded-xl bg-gray-50 border-0 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-9 w-9 p-0"
                      onClick={() => setShowSecret(!showSecret)}
                    >
                      {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Phone Number</Label>
                  <Input
                    placeholder="+1 234 567 8900"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="h-11 rounded-xl bg-gray-50 border-0"
                  />
                  <p className="text-xs text-gray-400">Your Twilio phone number</p>
                </div>
              </>
            )}

            {/* API Dog */}
            {selectedProvider?.id === 'apidog' && (
              <>
                <div className="space-y-2">
                  <Label className="text-gray-700">API Dog Base URL</Label>
                  <Input
                    placeholder="https://mock.apidog.com/m1/xxxxx-xxxxx-default"
                    value={formData.baseUrl || ''}
                    onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                    className="h-11 rounded-xl bg-gray-50 border-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">API Token</Label>
                  <Input
                    placeholder="Your API Dog authentication token"
                    value={formData.apiToken || ''}
                    onChange={(e) => setFormData({ ...formData, apiToken: e.target.value })}
                    className="h-11 rounded-xl bg-gray-50 border-0"
                  />
                </div>
                <div className="p-4 rounded-xl bg-orange-50 text-orange-700 text-sm">
                  <p className="font-medium mb-2">API Dog Service Partner</p>
                  <p className="text-xs">
                    API Dog provides all channel APIs (WhatsApp, SMS, Voice, Email) through a
                    single base URL. Enter your API Dog project URL and token above.
                  </p>
                </div>
              </>
            )}

            {/* Email OAuth */}
            {(selectedProvider?.id === 'google' || selectedProvider?.id === 'microsoft') && (
              <div className="p-4 rounded-xl bg-blue-50 text-blue-700 text-sm">
                <p className="font-medium mb-2">OAuth Connection</p>
                <p className="text-xs">
                  You'll be redirected to {selectedProvider.name} to authorize access to your
                  mailbox. We only request read and send permissions.
                </p>
              </div>
            )}

            {/* Help text */}
            {selectedProvider?.id === 'msg91' && (
              <div className="p-4 rounded-xl bg-blue-50 text-blue-700 text-sm">
                <p className="font-medium mb-2">Where to find your Auth Key</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Log in to MSG91 Dashboard</li>
                  <li>Go to Settings → API Keys</li>
                  <li>Copy your Auth Key</li>
                </ol>
              </div>
            )}

            {selectedProvider?.id === 'twilio' && (
              <div className="p-4 rounded-xl bg-blue-50 text-blue-700 text-sm">
                <p className="font-medium mb-2">Where to find your credentials</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Log in to Twilio Console</li>
                  <li>Find Account SID and Auth Token on the dashboard</li>
                  <li>Get your phone number from Phone Numbers section</li>
                </ol>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleBack} className="flex-1 h-11 rounded-xl">
                Back
              </Button>
              <Button onClick={handleConnect} disabled={loading} className="flex-1 h-11 rounded-xl">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : selectedProvider?.id === 'google' || selectedProvider?.id === 'microsoft' ? (
                  <ExternalLink className="h-4 w-4 mr-2" />
                ) : (
                  <Link2 className="h-4 w-4 mr-2" />
                )}
                {selectedProvider?.id === 'google' || selectedProvider?.id === 'microsoft'
                  ? `Connect with ${selectedProvider.name}`
                  : 'Connect'}
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function ChannelConnectionsPage() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    setLoading(true);
    try {
      const res = await api.get('/channels');
      const channelsData = res.data || res;
      if (channelsData && Array.isArray(channelsData)) {
        const transformedChannels = channelsData.map((ch) => ({
          id: ch.id,
          name: ch.displayName || ch.name,
          channelType: mapChannelType(ch.channelType || ch.type),
          identifier:
            ch.credentials?.phoneNumber ||
            ch.credentials?.email ||
            ch.credentials?.senderId ||
            ch.phoneNumber ||
            ch.identifier ||
            ch.email ||
            'N/A',
          isEnabled: ch.status === 'ACTIVE' || ch.status === 'active',
          healthStatus: ch.healthStatus || (ch.status === 'ACTIVE' ? 'HEALTHY' : 'UNKNOWN'),
          lastHealthCheck: ch.lastHealthCheck ? formatLastCheck(ch.lastHealthCheck) : 'N/A',
          stats: ch.stats || {
            sent: 0,
            delivered: 0,
            read: 0,
            messagesSent: 0,
            messagesReceived: 0,
          },
          metadata: {
            businessName: ch.providerConfig?.businessName || ch.settings?.businessName,
            templatesApproved: ch.templatesCount,
            provider: ch.provider,
            syncStatus: ch.settings?.isConfigComplete ? 'Complete' : 'Pending',
          },
        }));
        setChannels(transformedChannels);
      }
    } catch (err) {
      console.error('Failed to fetch channels:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatLastCheck = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} min ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  const filteredChannels = channels.filter((ch) => {
    const matchesFilter = filter === 'all' || ch.channelType === filter;
    const matchesSearch =
      !searchQuery ||
      ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.identifier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: channels.length,
    healthy: channels.filter((ch) => ch.healthStatus === 'HEALTHY').length,
    enabled: channels.filter((ch) => ch.isEnabled).length,
    messages: channels.reduce((sum, ch) => sum + (ch.stats.sent || ch.stats.calls || 0), 0),
  };

  const handleToggle = async (id) => {
    const channel = channels.find((ch) => ch.id === id);
    if (!channel) return;

    if (
      channel.isEnabled &&
      !confirm(
        `Are you sure you want to disable "${channel.name}"? This will stop all messages on this channel.`
      )
    ) {
      return;
    }

    try {
      const newStatus = channel.isEnabled ? 'INACTIVE' : 'ACTIVE';
      await api.patch(`/channels/${id}`, { status: newStatus });
      setChannels((prev) =>
        prev.map((ch) => (ch.id === id ? { ...ch, isEnabled: !ch.isEnabled } : ch))
      );
    } catch (err) {
      console.error('Failed to toggle channel:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to disconnect this channel?')) return;

    try {
      await api.delete(`/channels/${id}`);
      setChannels((prev) => prev.filter((ch) => ch.id !== id));
    } catch (err) {
      console.error('Failed to delete channel:', err);
    }
  };

  const handleRefresh = async (id) => {
    try {
      await api.post(`/channels/${id}/health`);
      await fetchChannels();
    } catch (err) {
      console.error('Failed to refresh channel:', err);
    }
  };

  const handleAdd = async () => {
    await fetchChannels();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <UnifiedLayout hubId="settings" pageTitle="Channels" fixedMenu={null}>
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
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-64 pl-10 pr-4 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Filter Section - Left Column */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl p-6 border border-blue-200/50"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <Link2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Channel Types</h3>
                <p className="text-sm text-gray-500">Filter by communication type</p>
              </div>
            </div>

            <div className="space-y-2">
              <motion.button
                whileHover={{ scale: 1.01 }}
                onClick={() => setFilter('all')}
                className={cn(
                  'w-full flex items-center justify-between p-3 rounded-xl transition-colors',
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-blue-200 hover:border-blue-300'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'h-9 w-9 rounded-lg flex items-center justify-center',
                      filter === 'all' ? 'bg-white/20' : 'bg-blue-50'
                    )}
                  >
                    <Link2
                      className={cn('h-4 w-4', filter === 'all' ? 'text-white' : 'text-blue-600')}
                    />
                  </div>
                  <span className="font-medium">All Channels</span>
                </div>
                <Badge
                  className={cn(
                    'rounded-lg',
                    filter === 'all' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                  )}
                >
                  {channels.length}
                </Badge>
              </motion.button>

              {Object.entries(channelTypes).map(([type, config]) => {
                const TypeIcon = config.icon;
                const count = channels.filter((ch) => ch.channelType === type).length;
                const isActive = filter === type;
                return (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setFilter(type)}
                    className={cn(
                      'w-full flex items-center justify-between p-3 rounded-xl transition-colors',
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-blue-200 hover:border-blue-300'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'h-9 w-9 rounded-lg flex items-center justify-center',
                          isActive ? 'bg-white/20' : config.bgColor
                        )}
                      >
                        <TypeIcon
                          className={cn('h-4 w-4', isActive ? 'text-white' : config.color)}
                        />
                      </div>
                      <span className="font-medium">{config.label}</span>
                    </div>
                    <Badge
                      className={cn(
                        'rounded-lg',
                        isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                      )}
                    >
                      {count}
                    </Badge>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Actions - Right Column */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 rounded-2xl p-6 border border-green-200/50"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <Plus className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Quick Setup</h3>
                <p className="text-sm text-gray-500">Connect a new channel</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {Object.entries(channelTypes).map(([type, config]) => {
                const TypeIcon = config.icon;
                return (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddModal(true)}
                    className="p-4 rounded-xl bg-white border border-green-200 hover:border-green-300 hover:shadow-sm transition-all text-left"
                  >
                    <div
                      className={cn(
                        'h-10 w-10 rounded-lg flex items-center justify-center mb-3',
                        config.bgColor
                      )}
                    >
                      <TypeIcon className={cn('h-5 w-5', config.color)} />
                    </div>
                    <p className="font-medium text-gray-900 text-sm">{config.label}</p>
                    <p className="text-xs text-gray-500 mt-1">{config.description}</p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Connected Channels */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <Wifi className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Connected Channels</h3>
                <p className="text-sm text-gray-500">
                  {filteredChannels.length} channel{filteredChannels.length !== 1 ? 's' : ''}{' '}
                  {filter !== 'all' ? `(${channelTypes[filter]?.label})` : ''}
                </p>
              </div>
            </div>
          </div>

          {filteredChannels.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Link2 className="h-7 w-7 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">
                {searchQuery ? 'No channels found' : 'No channels connected'}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {searchQuery
                  ? 'Try adjusting your search'
                  : 'Connect your first channel to get started'}
              </p>
              {!searchQuery && (
                <Button onClick={() => setShowAddModal(true)} className="mt-4 rounded-xl">
                  <Plus className="h-4 w-4 mr-2" /> Add Channel
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {filteredChannels.map((channel) => (
                  <ChannelCard
                    key={channel.id}
                    channel={channel}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onRefresh={handleRefresh}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Add Channel Modal */}
        <AddChannelModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAdd}
        />
      </motion.div>
    </UnifiedLayout>
  );
}
