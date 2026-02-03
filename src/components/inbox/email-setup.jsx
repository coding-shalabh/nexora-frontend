'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  Mail,
  Key,
  Shield,
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
  Settings,
  Search,
  Globe,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
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

// Provider icons
const GoogleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const MicrosoftIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path fill="#F25022" d="M1 1h10v10H1z"/>
    <path fill="#00A4EF" d="M1 13h10v10H1z"/>
    <path fill="#7FBA00" d="M13 1h10v10H13z"/>
    <path fill="#FFB900" d="M13 13h10v10H13z"/>
  </svg>
)

// Setup mode configurations
const setupModes = {
  oauth: {
    id: 'oauth',
    title: 'Connect with OAuth',
    description: 'Sign in with Google or Microsoft',
    icon: Shield,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    recommended: true,
    steps: [
      'Click to sign in with your email provider',
      'Grant permission to access your inbox',
      'We securely sync your emails',
      'Start managing conversations',
    ],
  },
  imap: {
    id: 'imap',
    title: 'IMAP/SMTP Connection',
    description: 'Connect using email credentials',
    icon: Key,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    steps: [
      'Enter your email address',
      'Provide IMAP/SMTP settings',
      'Enter app password or credentials',
      'Test connection and save',
    ],
  },
  smtp_only: {
    id: 'smtp_only',
    title: 'SMTP Only (Send)',
    description: 'Use validated integration for sending',
    icon: ExternalLink,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    steps: [
      'Select your validated email provider',
      'Configure sender email address',
      'Set reply-to settings',
      'Test and activate',
    ],
  },
}

// OAuth providers
const oauthProviders = [
  {
    id: 'google',
    name: 'Google / Gmail',
    description: 'Gmail and Google Workspace',
    icon: GoogleIcon,
    color: 'bg-white border hover:bg-gray-50',
  },
  {
    id: 'microsoft',
    name: 'Microsoft / Outlook',
    description: 'Outlook, Office 365, Hotmail',
    icon: MicrosoftIcon,
    color: 'bg-white border hover:bg-gray-50',
  },
]

// Common IMAP presets
const imapPresets = {
  gmail: {
    name: 'Gmail',
    imapHost: 'imap.gmail.com',
    imapPort: 993,
    smtpHost: 'smtp.gmail.com',
    smtpPort: 465,
    secure: true,
    note: 'Use App Password from Google Account settings',
  },
  outlook: {
    name: 'Outlook/Hotmail',
    imapHost: 'outlook.office365.com',
    imapPort: 993,
    smtpHost: 'smtp.office365.com',
    smtpPort: 587,
    secure: true,
    note: 'Use App Password if 2FA is enabled',
  },
  yahoo: {
    name: 'Yahoo Mail',
    imapHost: 'imap.mail.yahoo.com',
    imapPort: 993,
    smtpHost: 'smtp.mail.yahoo.com',
    smtpPort: 465,
    secure: true,
    note: 'Generate App Password in Yahoo Account security',
  },
  zoho: {
    name: 'Zoho Mail',
    imapHost: 'imap.zoho.com',
    imapPort: 993,
    smtpHost: 'smtp.zoho.com',
    smtpPort: 465,
    secure: true,
    note: 'Enable IMAP access in Zoho settings',
  },
  custom: {
    name: 'Custom / Other',
    imapHost: '',
    imapPort: 993,
    smtpHost: '',
    smtpPort: 465,
    secure: true,
    note: 'Enter your email provider settings',
  },
}

export function EmailSetup({ onComplete, onBack }) {
  const router = useRouter()
  const { toast } = useToast()
  const { token } = useAuth()

  const [selectedMode, setSelectedMode] = useState(null)
  const [step, setStep] = useState(1)

  // Form states
  const [isLoading, setIsLoading] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [testResult, setTestResult] = useState(null)

  // Validated SMTP providers from integrations
  const [validatedProviders, setValidatedProviders] = useState([])
  const [loadingProviders, setLoadingProviders] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState(null)
  const [integrationSearchOpen, setIntegrationSearchOpen] = useState(false)
  const [integrationSearch, setIntegrationSearch] = useState('')

  // IMAP config
  const [imapConfig, setImapConfig] = useState({
    email: '',
    password: '',
    displayName: '',
    preset: '',
    imapHost: '',
    imapPort: 993,
    imapSecure: true,
    smtpHost: '',
    smtpPort: 465,
    smtpSecure: true,
  })

  // SMTP-only config
  const [smtpConfig, setSmtpConfig] = useState({
    fromEmail: '',
    fromName: '',
    replyTo: '',
    signature: '',
    integrationId: '',
  })

  // Fetch validated email providers
  useEffect(() => {
    if (selectedMode === 'smtp_only' && token) {
      fetchValidatedProviders()
    }
  }, [selectedMode, token])

  const fetchValidatedProviders = async () => {
    if (!token) return
    setLoadingProviders(true)
    try {
      const data = await api.get('/integrations/messaging')
      if (data.success) {
        // Filter for email providers
        setValidatedProviders(data.data.filter(p =>
          ['sendgrid', 'mailgun', 'ses', 'resend', 'smtp'].includes(p.provider)
        ))
      }
    } catch (error) {
      console.error('Failed to fetch providers:', error)
    } finally {
      setLoadingProviders(false)
    }
  }

  // Handle mode selection
  const handleModeSelect = (mode) => {
    setSelectedMode(mode)
    setStep(2)
    setTestResult(null)
  }

  // Apply IMAP preset
  const applyPreset = (presetId) => {
    const preset = imapPresets[presetId]
    if (preset) {
      setImapConfig({
        ...imapConfig,
        preset: presetId,
        imapHost: preset.imapHost,
        imapPort: preset.imapPort,
        imapSecure: preset.secure,
        smtpHost: preset.smtpHost,
        smtpPort: preset.smtpPort,
        smtpSecure: preset.secure,
      })
    }
  }

  // Handle OAuth connection
  const handleOAuthConnect = async (provider) => {
    setIsLoading(true)
    try {
      const response = await api.get(`/email-accounts/oauth/${provider}/url`)
      if (response.success && response.data?.url) {
        // Redirect to OAuth URL
        window.location.href = response.data.url
      } else {
        throw new Error('Failed to get OAuth URL')
      }
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: error.message || 'Failed to initiate OAuth connection',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Test IMAP connection
  const testImapConnection = async () => {
    if (!imapConfig.email || !imapConfig.password) {
      toast({
        title: 'Missing Fields',
        description: 'Please enter email and password',
        variant: 'destructive',
      })
      return
    }

    setIsTesting(true)
    setTestResult(null)
    try {
      const response = await api.post('/email-accounts/test-connection', {
        email: imapConfig.email,
        password: imapConfig.password,
        imapHost: imapConfig.imapHost,
        imapPort: imapConfig.imapPort,
        imapSecure: imapConfig.imapSecure,
        smtpHost: imapConfig.smtpHost,
        smtpPort: imapConfig.smtpPort,
        smtpSecure: imapConfig.smtpSecure,
      })

      if (response.success && response.data?.valid) {
        setTestResult({ success: true, message: 'Connection successful!' })
        toast({
          title: 'Connection Successful',
          description: 'IMAP and SMTP connection verified',
        })
      } else {
        setTestResult({ success: false, message: response.data?.error || 'Connection failed' })
        toast({
          title: 'Connection Failed',
          description: response.data?.error || 'Failed to verify connection',
          variant: 'destructive',
        })
      }
    } catch (error) {
      setTestResult({ success: false, message: error.message })
      toast({
        title: 'Connection Failed',
        description: error.message || 'Unable to test connection',
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
      let response

      if (selectedMode === 'imap') {
        if (!testResult?.success) {
          toast({
            title: 'Test Required',
            description: 'Please test the connection before saving',
            variant: 'destructive',
          })
          setIsLoading(false)
          return
        }

        response = await api.post('/email-accounts/connect/imap', {
          email: imapConfig.email,
          password: imapConfig.password,
          displayName: imapConfig.displayName || imapConfig.email.split('@')[0],
          imapHost: imapConfig.imapHost,
          imapPort: imapConfig.imapPort,
          imapSecure: imapConfig.imapSecure,
          smtpHost: imapConfig.smtpHost,
          smtpPort: imapConfig.smtpPort,
          smtpSecure: imapConfig.smtpSecure,
        })
      } else if (selectedMode === 'smtp_only') {
        if (!selectedIntegration || !smtpConfig.fromEmail) {
          toast({
            title: 'Missing Fields',
            description: 'Please select a provider and enter sender email',
            variant: 'destructive',
          })
          setIsLoading(false)
          return
        }

        response = await api.post('/channels/email/configure', {
          setupMode: 'smtp_only',
          provider: selectedIntegration.provider,
          integrationId: selectedIntegration.id,
          fromEmail: smtpConfig.fromEmail,
          fromName: smtpConfig.fromName,
          replyTo: smtpConfig.replyTo,
          signature: smtpConfig.signature,
        })
      }

      if (response?.success) {
        toast({
          title: 'Email Configured',
          description: 'Email channel has been set up successfully',
        })
        onComplete?.()
        router.push('/inbox/settings')
      } else {
        throw new Error(response?.error || 'Failed to save configuration')
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

  // Render mode selection
  const renderModeSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold">Set Up Email</h2>
        <p className="text-muted-foreground mt-2">
          Choose how you want to connect your email
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
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                    Recommended
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mb-3">{mode.description}</p>
              <div className="flex flex-wrap gap-2">
                {mode.steps.slice(0, 2).map((s, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {i + 1}. {s}
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

  // Render OAuth configuration
  const renderOAuthConfig = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className={cn('p-2 rounded-lg', setupModes.oauth.bgColor)}>
          <Shield className={cn('h-5 w-5', setupModes.oauth.color)} />
        </div>
        <div>
          <h3 className="font-semibold">Connect with OAuth</h3>
          <p className="text-sm text-muted-foreground">Secure sign-in with your email provider</p>
        </div>
      </div>

      <Card className="p-4 bg-blue-50/50 border-blue-100">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">Secure & Simple</p>
            <p className="text-blue-800">
              OAuth provides secure access without storing your password.
              You can revoke access anytime from your email provider settings.
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <Label>Choose Your Email Provider</Label>
        <div className="grid gap-3">
          {oauthProviders.map((provider) => (
            <button
              key={provider.id}
              onClick={() => handleOAuthConnect(provider.id)}
              disabled={isLoading}
              className={cn(
                'flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all',
                'hover:border-primary/50 hover:shadow-sm',
                provider.color
              )}
            >
              <div className="h-12 w-12 flex items-center justify-center">
                <provider.icon className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{provider.name}</p>
                <p className="text-sm text-muted-foreground">{provider.description}</p>
              </div>
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : (
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  // Render IMAP configuration
  const renderImapConfig = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className={cn('p-2 rounded-lg', setupModes.imap.bgColor)}>
          <Key className={cn('h-5 w-5', setupModes.imap.color)} />
        </div>
        <div>
          <h3 className="font-semibold">IMAP/SMTP Connection</h3>
          <p className="text-sm text-muted-foreground">Connect using email credentials</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Provider Preset */}
        <div className="space-y-2">
          <Label>Email Provider</Label>
          <Select
            value={imapConfig.preset}
            onValueChange={applyPreset}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your email provider" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(imapPresets).map(([key, preset]) => (
                <SelectItem key={key} value={key}>
                  {preset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Email & Password */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={imapConfig.email}
              onChange={(e) => setImapConfig({ ...imapConfig, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password / App Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="App password"
                value={imapConfig.password}
                onChange={(e) => setImapConfig({ ...imapConfig, password: e.target.value })}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Display Name */}
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            placeholder="Your Name"
            value={imapConfig.displayName}
            onChange={(e) => setImapConfig({ ...imapConfig, displayName: e.target.value })}
          />
        </div>

        {/* Server Settings */}
        {imapConfig.preset && (
          <Card className="p-4 bg-muted/50">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">Server Settings</Label>
              {imapConfig.preset !== 'custom' && (
                <Badge variant="outline" className="text-xs">Auto-configured</Badge>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">IMAP Server</Label>
                <Input
                  placeholder="imap.example.com"
                  value={imapConfig.imapHost}
                  onChange={(e) => setImapConfig({ ...imapConfig, imapHost: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">IMAP Port</Label>
                <Input
                  type="number"
                  placeholder="993"
                  value={imapConfig.imapPort}
                  onChange={(e) => setImapConfig({ ...imapConfig, imapPort: parseInt(e.target.value) })}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">SMTP Server</Label>
                <Input
                  placeholder="smtp.example.com"
                  value={imapConfig.smtpHost}
                  onChange={(e) => setImapConfig({ ...imapConfig, smtpHost: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">SMTP Port</Label>
                <Input
                  type="number"
                  placeholder="465"
                  value={imapConfig.smtpPort}
                  onChange={(e) => setImapConfig({ ...imapConfig, smtpPort: parseInt(e.target.value) })}
                  className="text-sm"
                />
              </div>
            </div>
            {imapPresets[imapConfig.preset]?.note && (
              <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                <HelpCircle className="h-3 w-3" />
                {imapPresets[imapConfig.preset].note}
              </p>
            )}
          </Card>
        )}

        {/* Test Result */}
        {testResult && (
          <Card className={cn(
            'p-3',
            testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          )}>
            <div className="flex items-center gap-2">
              {testResult.success ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <span className={cn(
                'text-sm font-medium',
                testResult.success ? 'text-green-800' : 'text-red-800'
              )}>
                {testResult.message}
              </span>
            </div>
          </Card>
        )}

        {/* Test Button */}
        <Button
          variant="outline"
          onClick={testImapConnection}
          disabled={isTesting || !imapConfig.email || !imapConfig.password}
          className="w-full"
        >
          {isTesting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Testing Connection...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Test Connection
            </>
          )}
        </Button>
      </div>
    </div>
  )

  // Render SMTP-only configuration
  const renderSmtpOnlyConfig = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className={cn('p-2 rounded-lg', setupModes.smtp_only.bgColor)}>
          <ExternalLink className={cn('h-5 w-5', setupModes.smtp_only.color)} />
        </div>
        <div>
          <h3 className="font-semibold">SMTP Only (Send)</h3>
          <p className="text-sm text-muted-foreground">Use validated integration for sending</p>
        </div>
      </div>

      <Card className="p-4 bg-orange-50/50 border-orange-100">
        <div className="flex items-start gap-3">
          <Globe className="h-5 w-5 text-orange-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-orange-900 mb-1">Send-Only Mode</p>
            <p className="text-orange-800">
              This mode uses your validated email service (SendGrid, Mailgun, etc.)
              to send emails. Replies will go to your reply-to address.
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {/* Provider Selection */}
        <div className="space-y-2">
          <Label>Select Email Provider *</Label>
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
                  <p className="text-sm font-medium text-amber-900">No email providers configured</p>
                  <p className="text-sm text-amber-800 mt-1">
                    Add and validate an email provider in Settings → Integrations
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
            <div className="grid grid-cols-2 gap-2">
              {validatedProviders.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => {
                    setSelectedIntegration(provider)
                    setSmtpConfig({ ...smtpConfig, integrationId: provider.id })
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
        </div>

        {/* Sender Config */}
        {selectedIntegration && (
          <>
            <div className="space-y-2">
              <Label htmlFor="fromEmail">From Email Address *</Label>
              <Input
                id="fromEmail"
                type="email"
                placeholder="noreply@yourdomain.com"
                value={smtpConfig.fromEmail}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, fromEmail: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Must be a verified domain/email in your {selectedIntegration.provider} account
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromName">From Name</Label>
                <Input
                  id="fromName"
                  placeholder="Your Company"
                  value={smtpConfig.fromName}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, fromName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="replyTo">Reply-To Email</Label>
                <Input
                  id="replyTo"
                  type="email"
                  placeholder="support@yourdomain.com"
                  value={smtpConfig.replyTo}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, replyTo: e.target.value })}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      {step === 1 && renderModeSelection()}
      {step === 2 && selectedMode === 'oauth' && renderOAuthConfig()}
      {step === 2 && selectedMode === 'imap' && renderImapConfig()}
      {step === 2 && selectedMode === 'smtp_only' && renderSmtpOnlyConfig()}

      {/* Action Buttons */}
      {step === 2 && selectedMode !== 'oauth' && (
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
          <Button variant="outline" onClick={onBack || (() => router.back())}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Configuration
          </Button>
        </div>
      )}
    </Card>
  )
}

export default EmailSetup
