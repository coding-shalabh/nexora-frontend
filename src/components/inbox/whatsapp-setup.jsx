'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  Key,
  Building2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  HelpCircle,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Settings,
  Zap,
  Shield,
  Search,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/auth-context'
import { api } from '@/lib/api'

// WhatsApp icon component
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

// Setup mode configurations
const setupModes = {
  self_service: {
    id: 'self_service',
    title: 'Self-Service Setup',
    description: 'Connect your own MSG91 account',
    icon: Key,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    recommended: true,
    steps: [
      'Create or login to MSG91 account',
      'Get your Auth Key from MSG91 Dashboard',
      'Enter credentials below',
      'Configure webhook URL in MSG91',
    ],
  },
  managed: {
    id: 'managed',
    title: 'Managed Setup',
    description: 'We handle MSG91 onboarding for you',
    icon: Building2,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    steps: [
      'Provide your business details',
      'Our team will set up MSG91 account',
      'You will receive credentials via email',
      'Typically takes 24-48 hours',
    ],
  },
  byok: {
    id: 'byok',
    title: 'Bring Your Own Key',
    description: 'Use any WhatsApp API provider',
    icon: ExternalLink,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    steps: [
      'Select your WhatsApp provider',
      'Enter API credentials',
      'Map response fields to our system',
      'Configure webhook URL',
    ],
  },
}

// BYOK Provider options
const byokProviders = [
  { id: 'twilio', name: 'Twilio', description: 'Global communication platform' },
  { id: 'gupshup', name: 'Gupshup', description: 'Conversational messaging' },
  { id: 'infobip', name: 'Infobip', description: 'Enterprise messaging' },
  { id: 'messagebird', name: 'MessageBird', description: 'Omnichannel platform' },
  { id: 'vonage', name: 'Vonage', description: 'API communications' },
  { id: 'custom', name: 'Custom Provider', description: 'Any other provider' },
]

// Our expected fields that need to be mapped
const ourExpectedFields = [
  { key: 'messageId', label: 'Message ID', description: 'Unique identifier for the message', required: true },
  { key: 'status', label: 'Message Status', description: 'Delivery status (sent, delivered, read, failed)', required: true },
  { key: 'timestamp', label: 'Timestamp', description: 'When the event occurred', required: true },
  { key: 'from', label: 'From Number', description: 'Sender phone number', required: true },
  { key: 'to', label: 'To Number', description: 'Recipient phone number', required: true },
  { key: 'text', label: 'Message Text', description: 'Message content/body', required: false },
  { key: 'mediaUrl', label: 'Media URL', description: 'URL of attached media', required: false },
  { key: 'mediaType', label: 'Media Type', description: 'Type of media (image, video, document)', required: false },
  { key: 'error', label: 'Error Message', description: 'Error details if failed', required: false },
  { key: 'conversationId', label: 'Conversation ID', description: 'Thread/conversation identifier', required: false },
]

// Default mappings for known providers
const defaultMappings = {
  msg91: {
    messageId: 'requestId',
    status: 'status',
    timestamp: 'timestamp',
    from: 'sender',
    to: 'mobile',
    text: 'message',
    mediaUrl: 'media.url',
    mediaType: 'media.type',
    error: 'error.message',
  },
  twilio: {
    messageId: 'MessageSid',
    status: 'MessageStatus',
    timestamp: 'DateUpdated',
    from: 'From',
    to: 'To',
    text: 'Body',
    mediaUrl: 'MediaUrl0',
    mediaType: 'MediaContentType0',
    error: 'ErrorMessage',
  },
  gupshup: {
    messageId: 'messageId',
    status: 'eventType',
    timestamp: 'timestamp',
    from: 'mobile',
    to: 'destAddr',
    text: 'text',
    mediaUrl: 'media.url',
    error: 'errorMessage',
  },
}

// Field Mapping Component
function FieldMappingEditor({ provider, mappings, onMappingsChange }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [sampleResponse, setSampleResponse] = useState('')
  const [detectedFields, setDetectedFields] = useState([])

  // Parse sample response to detect fields
  const parseSampleResponse = () => {
    try {
      const parsed = JSON.parse(sampleResponse)
      const fields = extractFields(parsed)
      setDetectedFields(fields)
    } catch (e) {
      // Not valid JSON yet
    }
  }

  // Extract all field paths from an object
  const extractFields = (obj, prefix = '') => {
    const fields = []
    for (const key in obj) {
      const path = prefix ? `${prefix}.${key}` : key
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        fields.push(...extractFields(obj[key], path))
      } else {
        fields.push(path)
      }
    }
    return fields
  }

  const updateMapping = (ourField, providerField) => {
    onMappingsChange({
      ...mappings,
      [ourField]: providerField,
    })
  }

  return (
    <Card className="p-4">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Field Mapping</span>
            <Badge variant="outline" className="ml-2">
              {Object.values(mappings).filter(Boolean).length} / {ourExpectedFields.filter(f => f.required).length} required
            </Badge>
          </div>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-4 space-y-4">
          {/* Sample Response Input */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Paste Sample Webhook Response
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    Paste a sample JSON response from your provider's webhook to auto-detect available fields
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder='{"messageId": "abc123", "status": "delivered", ...}'
                value={sampleResponse}
                onChange={(e) => setSampleResponse(e.target.value)}
                className="font-mono text-xs"
              />
              <Button variant="outline" size="sm" onClick={parseSampleResponse}>
                Parse
              </Button>
            </div>
            {detectedFields.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Detected {detectedFields.length} fields: {detectedFields.slice(0, 5).join(', ')}
                {detectedFields.length > 5 && ` +${detectedFields.length - 5} more`}
              </p>
            )}
          </div>

          {/* Field Mappings */}
          <div className="space-y-3">
            <Label>Map Provider Fields to Our System</Label>
            <div className="grid gap-3">
              {ourExpectedFields.map((field) => (
                <div key={field.key} className="flex items-center gap-3">
                  <div className="w-1/3">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">{field.label}</span>
                      {field.required && <span className="text-red-500">*</span>}
                    </div>
                    <p className="text-xs text-muted-foreground">{field.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    {detectedFields.length > 0 ? (
                      <Select
                        value={mappings[field.key] || ''}
                        onValueChange={(value) => updateMapping(field.key, value)}
                      >
                        <SelectTrigger className="font-mono text-xs">
                          <SelectValue placeholder="Select provider field..." />
                        </SelectTrigger>
                        <SelectContent>
                          {detectedFields.map((f) => (
                            <SelectItem key={f} value={f} className="font-mono text-xs">
                              {f}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        placeholder="e.g., data.messageId"
                        value={mappings[field.key] || ''}
                        onChange={(e) => updateMapping(field.key, e.target.value)}
                        className="font-mono text-xs"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Load Default Mapping */}
          {provider && defaultMappings[provider] && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMappingsChange(defaultMappings[provider])}
            >
              <Zap className="h-3 w-3 mr-1" />
              Load Default {provider.charAt(0).toUpperCase() + provider.slice(1)} Mapping
            </Button>
          )}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

// Main WhatsApp Setup Component
export function WhatsAppSetup({ onComplete, onBack }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { token } = useAuth()

  // Get mode from URL or show selection
  const urlMode = searchParams.get('mode')
  const [selectedMode, setSelectedMode] = useState(urlMode || null)
  const [step, setStep] = useState(urlMode ? 2 : 1) // 1 = mode selection, 2 = configuration

  // Form states
  const [isLoading, setIsLoading] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [showAuthKey, setShowAuthKey] = useState(false)

  // Validated Integrations state
  const [validatedProviders, setValidatedProviders] = useState([])
  const [loadingProviders, setLoadingProviders] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState(null)
  const [integrationSearchOpen, setIntegrationSearchOpen] = useState(false)
  const [integrationSearch, setIntegrationSearch] = useState('')

  // Self-Service / MSG91 state
  const [msg91Config, setMsg91Config] = useState({
    authKey: '',
    integrationId: '', // New: linked integration ID
    phoneNumber: '',
    phoneNumberId: '',
    senderId: '',
  })

  // Managed state
  const [managedRequest, setManagedRequest] = useState({
    businessName: '',
    contactEmail: '',
    contactPhone: '',
    expectedVolume: '',
    notes: '',
  })

  // BYOK state
  const [byokConfig, setByokConfig] = useState({
    provider: '',
    apiKey: '',
    apiSecret: '',
    accountSid: '',
    phoneNumber: '',
    webhookSecret: '',
    apiEndpoint: '',
  })
  const [fieldMappings, setFieldMappings] = useState({})

  // Webhook URL (generated)
  const webhookUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/v1/whatsapp/webhook`

  // Fetch validated messaging providers when entering self-service mode
  useEffect(() => {
    if (selectedMode === 'self_service' && token) {
      fetchValidatedProviders()
    }
  }, [selectedMode, token])

  const fetchValidatedProviders = async () => {
    if (!token) return
    setLoadingProviders(true)
    try {
      const data = await api.get('/integrations/messaging')
      if (data.success) {
        // Filter for providers that support WhatsApp
        setValidatedProviders(data.data.filter(p =>
          ['msg91', 'twilio', 'gupshup', 'infobip'].includes(p.provider)
        ))
      }
    } catch (error) {
      console.error('Failed to fetch providers:', error)
    } finally {
      setLoadingProviders(false)
    }
  }

  // Filter providers based on search
  const filteredProviders = validatedProviders.filter(p =>
    p.name.toLowerCase().includes(integrationSearch.toLowerCase()) ||
    p.provider.toLowerCase().includes(integrationSearch.toLowerCase())
  )

  // Handle mode selection
  const handleModeSelect = (mode) => {
    setSelectedMode(mode)
    setStep(2)

    // Load default mappings for MSG91 modes
    if (mode === 'self_service' || mode === 'managed') {
      setFieldMappings(defaultMappings.msg91)
    }
  }

  // Test connection for Self-Service
  const testConnection = async () => {
    if (!msg91Config.authKey) {
      toast({
        title: 'Missing Auth Key',
        description: 'Please enter your MSG91 Auth Key',
        variant: 'destructive',
      })
      return
    }

    setIsTesting(true)
    try {
      const response = await api.post('/channels/whatsapp/test', {
        provider: 'msg91',
        authKey: msg91Config.authKey,
      })

      // Check response.data.valid for actual validation result
      // response.success just means HTTP request succeeded
      if (response.data?.valid) {
        toast({
          title: 'Connection Successful',
          description: response.data.message || 'Your MSG91 credentials are valid',
        })
      } else {
        toast({
          title: 'Connection Failed',
          description: response.data?.error || 'Invalid credentials',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: error.response?.data?.error || error.message || 'Unable to connect to MSG91',
        variant: 'destructive',
      })
    } finally {
      setIsTesting(false)
    }
  }

  // Save configuration
  const handleSave = async () => {
    setIsLoading(true)
    try {
      let payload = {
        setupMode: selectedMode,
        fieldMappings,
      }

      if (selectedMode === 'self_service') {
        if (!selectedIntegration || !msg91Config.phoneNumber) {
          toast({
            title: 'Missing Fields',
            description: 'Please select a messaging provider and enter phone number',
            variant: 'destructive',
          })
          setIsLoading(false)
          return
        }
        payload = {
          ...payload,
          provider: selectedIntegration.provider,
          integrationId: selectedIntegration.id,
          phoneNumber: msg91Config.phoneNumber,
          senderId: msg91Config.senderId,
        }
      } else if (selectedMode === 'managed') {
        if (!managedRequest.businessName || !managedRequest.contactEmail) {
          toast({
            title: 'Missing Fields',
            description: 'Please provide business name and contact email',
            variant: 'destructive',
          })
          setIsLoading(false)
          return
        }
        payload = {
          ...payload,
          provider: 'msg91',
          managedRequest,
        }
      } else if (selectedMode === 'byok') {
        if (!byokConfig.provider || !byokConfig.apiKey) {
          toast({
            title: 'Missing Fields',
            description: 'Please select a provider and enter API credentials',
            variant: 'destructive',
          })
          setIsLoading(false)
          return
        }
        payload = {
          ...payload,
          provider: byokConfig.provider,
          ...byokConfig,
        }
      }

      const response = await api.post('/channels/whatsapp/configure', payload)

      if (response.success) {
        toast({
          title: 'WhatsApp Configured',
          description: selectedMode === 'managed'
            ? 'Your request has been submitted. We will contact you shortly.'
            : 'WhatsApp channel has been set up successfully',
        })
        onComplete?.()
        router.push('/inbox/settings')
      } else {
        throw new Error(response.error || 'Failed to save configuration')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save configuration',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Copy webhook URL
  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl)
    toast({
      title: 'Copied',
      description: 'Webhook URL copied to clipboard',
    })
  }

  // Render mode selection
  const renderModeSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="h-16 w-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
          <WhatsAppIcon className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold">Set Up WhatsApp</h2>
        <p className="text-muted-foreground mt-2">
          Choose how you want to connect WhatsApp Business API
        </p>
      </div>

      <div className="grid gap-4">
        {Object.values(setupModes).map((mode) => (
          <button
            key={mode.id}
            onClick={() => handleModeSelect(mode.id)}
            className={cn(
              'w-full flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all',
              'hover:border-primary/50 hover:bg-muted/30',
              'focus:outline-none focus:ring-2 focus:ring-primary/20'
            )}
          >
            <div className={cn('p-3 rounded-xl', mode.bgColor)}>
              <mode.icon className={cn('h-6 w-6', mode.color)} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-lg">{mode.title}</span>
                {mode.recommended && (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    Recommended
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mb-3">{mode.description}</p>
              <div className="flex flex-wrap gap-2">
                {mode.steps.slice(0, 2).map((step, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {i + 1}. {step}
                  </Badge>
                ))}
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground mt-2" />
          </button>
        ))}
      </div>
    </div>
  )

  // Render Self-Service configuration
  const renderSelfServiceConfig = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className={cn('p-2 rounded-lg', setupModes.self_service.bgColor)}>
          <Key className={cn('h-5 w-5', setupModes.self_service.color)} />
        </div>
        <div>
          <h3 className="font-semibold">Self-Service Setup</h3>
          <p className="text-sm text-muted-foreground">Connect using your validated integration</p>
        </div>
      </div>

      {/* Steps Guide */}
      <Card className="p-4 bg-blue-50/50 border-blue-100">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-2">Setup Steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-800">
              <li>Select your validated messaging provider</li>
              <li>Enter your WhatsApp phone number</li>
              <li>Configure webhook URL in provider dashboard</li>
              <li>Save to activate the channel</li>
            </ol>
          </div>
        </div>
      </Card>

      {/* Configuration Form */}
      <div className="space-y-4">
        {/* Integration Selector */}
        <div className="space-y-2">
          <Label>Select Messaging Provider *</Label>
          {loadingProviders ? (
            <div className="flex items-center gap-2 p-3 border rounded-md">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading providers...</span>
            </div>
          ) : validatedProviders.length === 0 ? (
            <Card className="p-4 bg-amber-50/50 border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900">No providers configured</p>
                  <p className="text-sm text-amber-800 mt-1">
                    You need to add and validate a messaging provider first in Settings → Integrations
                  </p>
                  <Link href="/settings/integrations">
                    <Button size="sm" className="mt-3">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Integration
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ) : (
            <>
              {/* Searchable dropdown for providers (shows search when > 6) */}
              {validatedProviders.length > 6 ? (
                <Popover open={integrationSearchOpen} onOpenChange={setIntegrationSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={integrationSearchOpen}
                      className="w-full justify-between"
                    >
                      {selectedIntegration ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>{selectedIntegration.name}</span>
                          <Badge variant="outline" className="text-xs ml-2">
                            {selectedIntegration.provider.toUpperCase()}
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Select a provider...</span>
                      )}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Search providers..."
                        value={integrationSearch}
                        onValueChange={setIntegrationSearch}
                      />
                      <CommandList>
                        <CommandEmpty>No provider found.</CommandEmpty>
                        <CommandGroup>
                          {filteredProviders.map((provider) => (
                            <CommandItem
                              key={provider.id}
                              onSelect={() => {
                                setSelectedIntegration(provider)
                                setMsg91Config({ ...msg91Config, integrationId: provider.id })
                                setIntegrationSearchOpen(false)
                                // Load default mappings
                                if (defaultMappings[provider.provider]) {
                                  setFieldMappings(defaultMappings[provider.provider])
                                }
                              }}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                              <span className="flex-1">{provider.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {provider.provider.toUpperCase()}
                              </Badge>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              ) : (
                /* Simple grid for <= 6 providers */
                <div className="grid grid-cols-2 gap-2">
                  {validatedProviders.map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => {
                        setSelectedIntegration(provider)
                        setMsg91Config({ ...msg91Config, integrationId: provider.id })
                        // Load default mappings
                        if (defaultMappings[provider.provider]) {
                          setFieldMappings(defaultMappings[provider.provider])
                        }
                      }}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all',
                        selectedIntegration?.id === provider.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-sm font-bold uppercase">
                        {provider.provider.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{provider.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-muted-foreground">Validated</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                API credentials already validated in{' '}
                <Link href="/settings/integrations" className="text-primary hover:underline">
                  Settings → Integrations
                </Link>
              </p>
            </>
          )}
        </div>

        {/* Phone Number - Only show after selecting integration */}
        {selectedIntegration && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">WhatsApp Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+91 XXXXXXXXXX"
                  value={msg91Config.phoneNumber}
                  onChange={(e) => setMsg91Config({ ...msg91Config, phoneNumber: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  The WhatsApp Business number linked to your {selectedIntegration.provider.toUpperCase()} account
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="senderId">Sender ID / Display Name</Label>
                <Input
                  id="senderId"
                  placeholder="Your business name"
                  value={msg91Config.senderId}
                  onChange={(e) => setMsg91Config({ ...msg91Config, senderId: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Webhook URL</Label>
              <div className="flex gap-2">
                <Input value={webhookUrl} readOnly className="font-mono text-sm bg-muted" />
                <Button variant="outline" size="icon" onClick={copyWebhookUrl}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Configure this URL in your {selectedIntegration.provider.toUpperCase()} WhatsApp settings
              </p>
            </div>
          </>
        )}
      </div>

      {/* Field Mapping - Pre-configured based on selected provider */}
      {selectedIntegration && (
        <FieldMappingEditor
          provider={selectedIntegration.provider}
          mappings={fieldMappings}
          onMappingsChange={setFieldMappings}
        />
      )}
    </div>
  )

  // Render Managed configuration
  const renderManagedConfig = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className={cn('p-2 rounded-lg', setupModes.managed.bgColor)}>
          <Building2 className={cn('h-5 w-5', setupModes.managed.color)} />
        </div>
        <div>
          <h3 className="font-semibold">Managed Setup</h3>
          <p className="text-sm text-muted-foreground">We'll handle the setup for you</p>
        </div>
      </div>

      {/* Info Card */}
      <Card className="p-4 bg-purple-50/50 border-purple-100">
        <div className="flex items-start gap-3">
          <Building2 className="h-5 w-5 text-purple-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-purple-900 mb-2">How it works:</p>
            <ul className="list-disc list-inside space-y-1 text-purple-800">
              <li>Submit your business details below</li>
              <li>Our team will create and configure MSG91 account</li>
              <li>You'll receive login credentials via email</li>
              <li>Setup typically completes in 24-48 hours</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Request Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            placeholder="Your Company Name"
            value={managedRequest.businessName}
            onChange={(e) => setManagedRequest({ ...managedRequest, businessName: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email *</Label>
            <Input
              id="contactEmail"
              type="email"
              placeholder="admin@company.com"
              value={managedRequest.contactEmail}
              onChange={(e) => setManagedRequest({ ...managedRequest, contactEmail: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input
              id="contactPhone"
              placeholder="+91 XXXXXXXXXX"
              value={managedRequest.contactPhone}
              onChange={(e) => setManagedRequest({ ...managedRequest, contactPhone: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectedVolume">Expected Monthly Volume</Label>
          <Select
            value={managedRequest.expectedVolume}
            onValueChange={(value) => setManagedRequest({ ...managedRequest, expectedVolume: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select expected message volume" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1k">Less than 1,000 messages</SelectItem>
              <SelectItem value="10k">1,000 - 10,000 messages</SelectItem>
              <SelectItem value="50k">10,000 - 50,000 messages</SelectItem>
              <SelectItem value="100k">50,000 - 100,000 messages</SelectItem>
              <SelectItem value="100k+">More than 100,000 messages</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Input
            id="notes"
            placeholder="Any specific requirements or questions"
            value={managedRequest.notes}
            onChange={(e) => setManagedRequest({ ...managedRequest, notes: e.target.value })}
          />
        </div>
      </div>

      {/* Field Mapping - Pre-configured for MSG91 (same as self-service) */}
      <FieldMappingEditor
        provider="msg91"
        mappings={fieldMappings}
        onMappingsChange={setFieldMappings}
      />
    </div>
  )

  // Render BYOK configuration
  const renderByokConfig = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className={cn('p-2 rounded-lg', setupModes.byok.bgColor)}>
          <ExternalLink className={cn('h-5 w-5', setupModes.byok.color)} />
        </div>
        <div>
          <h3 className="font-semibold">Bring Your Own Key</h3>
          <p className="text-sm text-muted-foreground">Connect any WhatsApp API provider</p>
        </div>
      </div>

      {/* Provider Selection */}
      <div className="space-y-2">
        <Label>Select Provider *</Label>
        <div className="grid grid-cols-3 gap-2">
          {byokProviders.map((provider) => (
            <button
              key={provider.id}
              onClick={() => {
                setByokConfig({ ...byokConfig, provider: provider.id })
                // Load default mappings if available
                if (defaultMappings[provider.id]) {
                  setFieldMappings(defaultMappings[provider.id])
                } else {
                  setFieldMappings({})
                }
              }}
              className={cn(
                'p-3 rounded-lg border-2 text-left transition-all',
                byokConfig.provider === provider.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <p className="font-medium text-sm">{provider.name}</p>
              <p className="text-xs text-muted-foreground">{provider.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Provider-specific credentials */}
      {byokConfig.provider && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key *</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter API key"
              value={byokConfig.apiKey}
              onChange={(e) => setByokConfig({ ...byokConfig, apiKey: e.target.value })}
              className="font-mono"
            />
          </div>

          {(byokConfig.provider === 'twilio') && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountSid">Account SID</Label>
                <Input
                  id="accountSid"
                  placeholder="ACXXXXXXXXXXXXXXXX"
                  value={byokConfig.accountSid}
                  onChange={(e) => setByokConfig({ ...byokConfig, accountSid: e.target.value })}
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiSecret">Auth Token</Label>
                <Input
                  id="apiSecret"
                  type="password"
                  placeholder="Auth token"
                  value={byokConfig.apiSecret}
                  onChange={(e) => setByokConfig({ ...byokConfig, apiSecret: e.target.value })}
                  className="font-mono"
                />
              </div>
            </div>
          )}

          {byokConfig.provider === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="apiEndpoint">API Endpoint URL</Label>
              <Input
                id="apiEndpoint"
                placeholder="https://api.yourprovider.com/v1/messages"
                value={byokConfig.apiEndpoint}
                onChange={(e) => setByokConfig({ ...byokConfig, apiEndpoint: e.target.value })}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="byokPhone">WhatsApp Phone Number *</Label>
            <Input
              id="byokPhone"
              placeholder="+1 XXX XXX XXXX"
              value={byokConfig.phoneNumber}
              onChange={(e) => setByokConfig({ ...byokConfig, phoneNumber: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <div className="flex gap-2">
              <Input value={webhookUrl} readOnly className="font-mono text-sm bg-muted" />
              <Button variant="outline" size="icon" onClick={copyWebhookUrl}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhookSecret">Webhook Secret (Optional)</Label>
            <Input
              id="webhookSecret"
              type="password"
              placeholder="For webhook signature verification"
              value={byokConfig.webhookSecret}
              onChange={(e) => setByokConfig({ ...byokConfig, webhookSecret: e.target.value })}
              className="font-mono"
            />
          </div>
        </div>
      )}

      {/* Field Mapping - Required for BYOK */}
      {byokConfig.provider && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-700">
              Field mapping is required for custom providers
            </span>
          </div>
          <FieldMappingEditor
            provider={byokConfig.provider}
            mappings={fieldMappings}
            onMappingsChange={setFieldMappings}
          />
        </div>
      )}
    </div>
  )

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      {step === 1 && renderModeSelection()}
      {step === 2 && selectedMode === 'self_service' && renderSelfServiceConfig()}
      {step === 2 && selectedMode === 'managed' && renderManagedConfig()}
      {step === 2 && selectedMode === 'byok' && renderByokConfig()}

      {/* Action Buttons */}
      {step === 2 && (
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
          <Button variant="outline" onClick={onBack || (() => router.back())}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {selectedMode === 'managed' ? 'Submit Request' : 'Save Configuration'}
          </Button>
        </div>
      )}
    </Card>
  )
}

export default WhatsAppSetup
