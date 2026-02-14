'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Copy,
  ExternalLink,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Zap,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

// Integration data (would come from API in real app)
const integrationData = {
  msg91: {
    id: 'msg91',
    name: 'MSG91',
    description: 'Complete communication platform for Email, SMS, WhatsApp, and Voice',
    logo: 'M',
    color: 'bg-blue-600',
    website: 'https://msg91.com',
    authType: 'single', // single API key for all services
    credentials: [
      {
        key: 'authKey',
        label: 'Auth Key',
        type: 'password',
        placeholder: 'Enter your MSG91 Auth Key',
        required: true,
      },
    ],
    services: {
      email: {
        id: 'email',
        name: 'Email',
        description: 'Transactional and marketing emails',
        icon: Mail,
        enabled: true,
        status: 'active',
        requiresWebhook: false,
        additionalFields: [],
      },
      sms: {
        id: 'sms',
        name: 'SMS',
        description: 'SMS delivery with DLT compliance',
        icon: MessageSquare,
        enabled: true,
        status: 'active',
        requiresWebhook: false,
        additionalFields: [
          {
            key: 'senderId',
            label: 'Sender ID',
            type: 'text',
            placeholder: 'e.g., NEXORA',
          },
          {
            key: 'dltEntityId',
            label: 'DLT Entity ID',
            type: 'text',
            placeholder: 'Enter DLT registered entity ID',
          },
        ],
      },
      whatsapp: {
        id: 'whatsapp',
        name: 'WhatsApp Business',
        description: 'WhatsApp Business API for customer messaging',
        icon: MessageSquare,
        enabled: false,
        status: 'inactive',
        requiresWebhook: true,
        webhookUrl: 'https://api.nexoraos.pro/api/v1/webhooks/msg91/whatsapp',
        additionalFields: [],
      },
      voice: {
        id: 'voice',
        name: 'Voice Calls',
        description: 'Programmable voice calls and IVR',
        icon: Phone,
        enabled: false,
        status: 'inactive',
        requiresWebhook: true,
        webhookUrl: 'https://api.nexoraos.pro/api/v1/webhooks/msg91/voice',
        additionalFields: [],
      },
    },
  },
  twilio: {
    id: 'twilio',
    name: 'Twilio',
    description: 'Cloud communications platform for SMS, WhatsApp, and Voice',
    logo: 'T',
    color: 'bg-red-600',
    website: 'https://twilio.com',
    authType: 'dual', // Account SID + Auth Token
    credentials: [
      {
        key: 'accountSid',
        label: 'Account SID',
        type: 'text',
        placeholder: 'Enter your Twilio Account SID',
        required: true,
      },
      {
        key: 'authToken',
        label: 'Auth Token',
        type: 'password',
        placeholder: 'Enter your Twilio Auth Token',
        required: true,
      },
    ],
    services: {
      sms: {
        id: 'sms',
        name: 'SMS',
        description: 'Global SMS delivery',
        icon: MessageSquare,
        enabled: false,
        status: 'inactive',
        requiresWebhook: false,
        additionalFields: [
          {
            key: 'phoneNumber',
            label: 'Twilio Phone Number',
            type: 'text',
            placeholder: '+1234567890',
          },
        ],
      },
      whatsapp: {
        id: 'whatsapp',
        name: 'WhatsApp',
        description: 'WhatsApp Business API via Twilio',
        icon: MessageSquare,
        enabled: false,
        status: 'inactive',
        requiresWebhook: true,
        webhookUrl: 'https://api.nexoraos.pro/api/v1/webhooks/twilio/whatsapp',
        additionalFields: [
          {
            key: 'whatsappNumber',
            label: 'WhatsApp Number',
            type: 'text',
            placeholder: 'whatsapp:+1234567890',
          },
        ],
      },
      voice: {
        id: 'voice',
        name: 'Voice',
        description: 'Programmable voice calls',
        icon: Phone,
        enabled: false,
        status: 'inactive',
        requiresWebhook: true,
        webhookUrl: 'https://api.nexoraos.pro/api/v1/webhooks/twilio/voice',
        additionalFields: [],
      },
    },
  },
  'zoho-sign': {
    id: 'zoho-sign',
    name: 'Zoho Sign',
    description: 'E-signature and document signing with Aadhaar integration',
    logo: 'Z',
    color: 'bg-orange-600',
    website: 'https://www.zoho.com/sign/',
    authType: 'single',
    credentials: [
      {
        key: 'apiKey',
        label: 'API Key',
        type: 'password',
        placeholder: 'Enter your Zoho Sign API Key',
        required: true,
      },
    ],
    services: {
      esign: {
        id: 'esign',
        name: 'E-Signature',
        description: 'Digital document signing with legal validity',
        icon: Zap,
        enabled: false,
        status: 'inactive',
        requiresWebhook: true,
        webhookUrl: 'https://api.nexoraos.pro/api/v1/webhooks/zoho-sign',
        additionalFields: [],
      },
    },
  },
  leegality: {
    id: 'leegality',
    name: 'Leegality',
    description: 'India-compliant e-signatures with Aadhaar eSign',
    logo: 'L',
    color: 'bg-purple-600',
    website: 'https://www.leegality.com',
    authType: 'single',
    credentials: [
      {
        key: 'apiKey',
        label: 'API Key',
        type: 'password',
        placeholder: 'Enter your Leegality API Key',
        required: true,
      },
    ],
    services: {
      esign: {
        id: 'esign',
        name: 'Aadhaar eSign',
        description: 'Legally binding e-signatures with Aadhaar verification',
        icon: Zap,
        enabled: false,
        status: 'inactive',
        requiresWebhook: true,
        webhookUrl: 'https://api.nexoraos.pro/api/v1/webhooks/leegality',
        additionalFields: [],
      },
    },
  },
  razorpay: {
    id: 'razorpay',
    name: 'Razorpay',
    description: 'Complete payment solution for online and offline payments',
    logo: 'R',
    color: 'bg-blue-700',
    website: 'https://razorpay.com',
    authType: 'dual', // key_id + key_secret
    credentials: [
      {
        key: 'keyId',
        label: 'Key ID',
        type: 'text',
        placeholder: 'rzp_test_xxxxxxxxxxxxxxxx',
        required: true,
      },
      {
        key: 'keySecret',
        label: 'Key Secret',
        type: 'password',
        placeholder: 'Enter your Razorpay Key Secret',
        required: true,
      },
    ],
    services: {
      payments: {
        id: 'payments',
        name: 'Payment Gateway',
        description: 'Accept online payments via UPI, cards, wallets, and net banking',
        icon: Zap,
        enabled: false,
        status: 'inactive',
        requiresWebhook: true,
        webhookUrl: 'https://api.nexoraos.pro/api/v1/webhooks/razorpay',
        additionalFields: [
          {
            key: 'webhookSecret',
            label: 'Webhook Secret',
            type: 'password',
            placeholder: 'Enter webhook secret from Razorpay dashboard',
          },
        ],
      },
    },
  },
  stripe: {
    id: 'stripe',
    name: 'Stripe',
    description: 'Global payment processing platform for online businesses',
    logo: 'S',
    color: 'bg-indigo-600',
    website: 'https://stripe.com',
    authType: 'dual', // publishable_key + secret_key
    credentials: [
      {
        key: 'publishableKey',
        label: 'Publishable Key',
        type: 'text',
        placeholder: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        required: true,
      },
      {
        key: 'secretKey',
        label: 'Secret Key',
        type: 'password',
        placeholder: 'sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        required: true,
      },
    ],
    services: {
      payments: {
        id: 'payments',
        name: 'Payment Processing',
        description: 'Accept payments from customers worldwide with cards and digital wallets',
        icon: Zap,
        enabled: false,
        status: 'inactive',
        requiresWebhook: true,
        webhookUrl: 'https://api.nexoraos.pro/api/v1/webhooks/stripe',
        additionalFields: [
          {
            key: 'webhookSecret',
            label: 'Webhook Signing Secret',
            type: 'password',
            placeholder: 'whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          },
        ],
      },
    },
  },
};

export default function IntegrationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const integrationId = params.id;

  const [integration, setIntegration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showCredentials, setShowCredentials] = useState({});
  const [credentials, setCredentials] = useState({});
  const [serviceConfigs, setServiceConfigs] = useState({});

  useEffect(() => {
    // Simulate loading from API
    setTimeout(() => {
      const data = integrationData[integrationId];
      if (data) {
        setIntegration(data);
        // Initialize service configs from integration data
        const configs = {};
        Object.keys(data.services).forEach((serviceId) => {
          configs[serviceId] = {
            enabled: data.services[serviceId].enabled,
            fields: {},
          };
        });
        setServiceConfigs(configs);
      }
      setLoading(false);
    }, 500);
  }, [integrationId]);

  const handleToggleService = (serviceId) => {
    setServiceConfigs({
      ...serviceConfigs,
      [serviceId]: {
        ...serviceConfigs[serviceId],
        enabled: !serviceConfigs[serviceId].enabled,
      },
    });
  };

  const handleServiceFieldChange = (serviceId, fieldKey, value) => {
    setServiceConfigs({
      ...serviceConfigs,
      [serviceId]: {
        ...serviceConfigs[serviceId],
        fields: {
          ...serviceConfigs[serviceId].fields,
          [fieldKey]: value,
        },
      },
    });
  };

  const handleTestConnection = async () => {
    setTesting(true);
    // Simulate API test
    setTimeout(() => {
      setTesting(false);
      toast.success('Connection test successful!');
    }, 1500);
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API save
    setTimeout(() => {
      setSaving(false);
      toast.success('Integration settings saved successfully');
    }, 1000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!integration) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Integration not found</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const isConnected = Object.keys(credentials).length > 0;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <div
              className={`w-16 h-16 ${integration.color} rounded-xl flex items-center justify-center text-white font-bold text-2xl`}
            >
              {integration.logo}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{integration.name}</h1>
              <p className="text-gray-500">{integration.description}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            variant={isConnected ? 'default' : 'outline'}
            className={isConnected ? 'bg-green-100 text-green-700' : ''}
          >
            {isConnected ? (
              <>
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Connected
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3 mr-1" />
                Not Connected
              </>
            )}
          </Badge>
          <Button variant="outline" size="sm" asChild>
            <a href={integration.website} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Website
            </a>
          </Button>
        </div>
      </div>

      <Separator />

      {/* Main Content */}
      <Tabs defaultValue="services" className="space-y-6">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Services</CardTitle>
              <CardDescription>
                Enable or disable services for this integration.{' '}
                {integration.authType === 'single'
                  ? 'Single authentication unlocks all services.'
                  : 'Each service may require additional configuration.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.values(integration.services).map((service) => {
                const Icon = service.icon;
                const isEnabled = serviceConfigs[service.id]?.enabled;

                return (
                  <div
                    key={service.id}
                    className={`border rounded-lg p-4 ${isEnabled ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div
                          className={`p-2 rounded-lg ${isEnabled ? 'bg-blue-100' : 'bg-gray-200'}`}
                        >
                          <Icon
                            className={`h-5 w-5 ${isEnabled ? 'text-blue-600' : 'text-gray-500'}`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">{service.name}</h3>
                            <Badge
                              variant="outline"
                              className={
                                isEnabled ? 'bg-green-100 text-green-700 border-green-200' : ''
                              }
                            >
                              {isEnabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{service.description}</p>

                          {/* Service-specific fields */}
                          {isEnabled &&
                            service.additionalFields &&
                            service.additionalFields.length > 0 && (
                              <div className="mt-4 space-y-3">
                                {service.additionalFields.map((field) => (
                                  <div key={field.key} className="space-y-1">
                                    <Label
                                      htmlFor={`${service.id}-${field.key}`}
                                      className="text-xs"
                                    >
                                      {field.label}
                                    </Label>
                                    <Input
                                      id={`${service.id}-${field.key}`}
                                      type={field.type}
                                      placeholder={field.placeholder}
                                      value={serviceConfigs[service.id]?.fields[field.key] || ''}
                                      onChange={(e) =>
                                        handleServiceFieldChange(
                                          service.id,
                                          field.key,
                                          e.target.value
                                        )
                                      }
                                      className="max-w-md"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}

                          {/* Webhook requirement */}
                          {isEnabled && service.requiresWebhook && (
                            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                              <div className="flex items-start space-x-2">
                                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-amber-900">
                                    Webhook Configuration Required
                                  </p>
                                  <p className="text-xs text-amber-700 mt-1">
                                    Configure this webhook URL in your {integration.name} dashboard
                                    to receive inbound messages and status updates.
                                  </p>
                                  <div className="mt-2 flex items-center space-x-2">
                                    <Input
                                      value={service.webhookUrl}
                                      readOnly
                                      className="text-xs bg-white"
                                    />
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => copyToClipboard(service.webhookUrl)}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Enable/Disable Toggle */}
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={isEnabled}
                          onCheckedChange={() => handleToggleService(service.id)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Credentials Tab */}
        <TabsContent value="credentials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Credentials</CardTitle>
              <CardDescription>
                {integration.authType === 'single'
                  ? 'Enter your API key to authenticate all services.'
                  : 'Enter your credentials to authenticate this integration.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {integration.credentials.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <div className="relative max-w-md">
                    <Input
                      id={field.key}
                      type={
                        showCredentials[field.key] || field.type !== 'password'
                          ? 'text'
                          : 'password'
                      }
                      placeholder={field.placeholder}
                      value={credentials[field.key] || ''}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          [field.key]: e.target.value,
                        })
                      }
                      className={field.type === 'password' ? 'pr-10' : ''}
                    />
                    {field.type === 'password' && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() =>
                          setShowCredentials({
                            ...showCredentials,
                            [field.key]: !showCredentials[field.key],
                          })
                        }
                      >
                        {showCredentials[field.key] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={testing || !Object.keys(credentials).length}
                >
                  {testing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Test Connection
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>
                Configure these webhook URLs in your {integration.name} account to receive real-time
                updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.values(integration.services)
                .filter((s) => s.requiresWebhook)
                .map((service) => (
                  <div key={service.id} className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <service.icon className="h-4 w-4 text-gray-600" />
                      <h3 className="font-semibold">{service.name} Webhook</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                      Use this URL to receive {service.name.toLowerCase()} events from{' '}
                      {integration.name}.
                    </p>
                    <div className="flex items-center space-x-2">
                      <Input value={service.webhookUrl} readOnly className="font-mono text-sm" />
                      <Button variant="outline" onClick={() => copyToClipboard(service.webhookUrl)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

              {Object.values(integration.services).filter((s) => s.requiresWebhook).length ===
                0 && (
                <p className="text-sm text-gray-500 text-center py-8">
                  No webhook configuration required for this integration.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button (Fixed at bottom) */}
      <div className="sticky bottom-0 bg-white border-t pt-4 pb-6 -mx-6 px-6">
        <div className="max-w-6xl mx-auto flex justify-end space-x-2">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
