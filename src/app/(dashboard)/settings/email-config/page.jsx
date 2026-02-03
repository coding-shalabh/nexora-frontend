'use client'

import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import {
  Mail,
  Send,
  MessageSquare,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Info,
  FileText,
  Link2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/lib/api'

export default function EmailConfigPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [testResult, setTestResult] = useState(null)

  const [settings, setSettings] = useState({
    primaryEmail: '',
    primaryEmailName: '',
    supportEmail: '',
    supportEmailName: '',
    replyToEmail: '',
    replyToName: '',
    defaultFromEmail: '',
    defaultFromName: '',
    signature: '',
    signatureHtml: '',
    footerText: '',
    footerHtml: '',
    unsubscribeText: 'Click here to unsubscribe',
    trackOpens: true,
    trackClicks: true,
    includeLogo: true,
  })

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get('/settings/email')
      if (response.success && response.data) {
        setSettings(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch email settings:', error)
      toast({
        title: 'Error',
        description: 'Failed to load email settings',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await api.patch('/settings/email', settings)
      if (response.success) {
        toast({
          title: 'Settings Saved',
          description: 'Email settings have been updated successfully',
        })
      } else {
        throw new Error(response.message || 'Failed to save settings')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save settings',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleTestEmail = async (type = 'primary') => {
    if (!testEmail) {
      toast({
        title: 'Enter Email',
        description: 'Please enter an email address to send test email',
        variant: 'destructive',
      })
      return
    }

    try {
      setTesting(true)
      setTestResult(null)
      const response = await api.post('/settings/email/test', {
        toEmail: testEmail,
        type,
      })
      if (response.success && response.data?.success) {
        setTestResult({ success: true, message: response.data.message })
        toast({
          title: 'Test Email Sent',
          description: `Test email sent to ${testEmail}`,
        })
      } else {
        throw new Error(response.data?.error || 'Failed to send test email')
      }
    } catch (error) {
      setTestResult({ success: false, message: error.message })
      toast({
        title: 'Test Failed',
        description: error.message || 'Failed to send test email',
        variant: 'destructive',
      })
    } finally {
      setTesting(false)
    }
  }

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="space-y-4">
                <div className="h-6 w-40 bg-muted animate-pulse rounded" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 bg-muted animate-pulse rounded" />
                  <div className="h-10 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Email Configuration</h1>
          <p className="text-muted-foreground">
            Configure sender addresses, signatures, and tracking options
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="addresses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="addresses">
            <Mail className="h-4 w-4 mr-2" />
            Sender Addresses
          </TabsTrigger>
          <TabsTrigger value="signature">
            <FileText className="h-4 w-4 mr-2" />
            Signature & Footer
          </TabsTrigger>
          <TabsTrigger value="tracking">
            <Link2 className="h-4 w-4 mr-2" />
            Tracking
          </TabsTrigger>
        </TabsList>

        {/* Email Addresses Tab */}
        <TabsContent value="addresses" className="space-y-6">
          {/* Primary Email */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Primary Email</CardTitle>
                  <CardDescription>
                    Main email address used for outbound communications
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryEmail">Email Address</Label>
                  <Input
                    id="primaryEmail"
                    type="email"
                    placeholder="noreply@company.com"
                    value={settings.primaryEmail}
                    onChange={(e) => updateSetting('primaryEmail', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryEmailName">Display Name</Label>
                  <Input
                    id="primaryEmailName"
                    placeholder="Company Name"
                    value={settings.primaryEmailName}
                    onChange={(e) => updateSetting('primaryEmailName', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Email */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle>Support Email</CardTitle>
                  <CardDescription>
                    Email address for customer support and replies
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Email Address</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    placeholder="support@company.com"
                    value={settings.supportEmail}
                    onChange={(e) => updateSetting('supportEmail', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmailName">Display Name</Label>
                  <Input
                    id="supportEmailName"
                    placeholder="Support Team"
                    value={settings.supportEmailName}
                    onChange={(e) => updateSetting('supportEmailName', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reply-To */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Send className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle>Reply-To Address</CardTitle>
                  <CardDescription>
                    Where replies should be sent (optional, defaults to support email)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="replyToEmail">Email Address</Label>
                  <Input
                    id="replyToEmail"
                    type="email"
                    placeholder="replies@company.com"
                    value={settings.replyToEmail}
                    onChange={(e) => updateSetting('replyToEmail', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="replyToName">Display Name</Label>
                  <Input
                    id="replyToName"
                    placeholder="Company Support"
                    value={settings.replyToName}
                    onChange={(e) => updateSetting('replyToName', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Email */}
          <Card>
            <CardHeader>
              <CardTitle>Test Email Configuration</CardTitle>
              <CardDescription>
                Send a test email to verify your configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="Enter email to receive test"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleTestEmail('primary')}
                  disabled={testing || !testEmail}
                >
                  {testing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Test Primary'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleTestEmail('support')}
                  disabled={testing || !testEmail}
                >
                  {testing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Test Support'
                  )}
                </Button>
              </div>
              {testResult && (
                <div className={cn(
                  'p-3 rounded-lg flex items-center gap-2',
                  testResult.success
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                )}>
                  {testResult.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="text-sm">{testResult.message}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Signature & Footer Tab */}
        <TabsContent value="signature" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Signature</CardTitle>
              <CardDescription>
                Default signature appended to outgoing emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signature">Plain Text Signature</Label>
                <Textarea
                  id="signature"
                  placeholder="Best regards,&#10;Your Company&#10;www.company.com"
                  rows={4}
                  value={settings.signature}
                  onChange={(e) => updateSetting('signature', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signatureHtml">HTML Signature (Optional)</Label>
                <Textarea
                  id="signatureHtml"
                  placeholder="<p>Best regards,<br/><strong>Your Company</strong></p>"
                  rows={4}
                  value={settings.signatureHtml}
                  onChange={(e) => updateSetting('signatureHtml', e.target.value)}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to use plain text signature
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Footer</CardTitle>
              <CardDescription>
                Footer content and unsubscribe text for compliance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="footerText">Footer Text</Label>
                <Textarea
                  id="footerText"
                  placeholder="Your Company, Inc.&#10;123 Main St, City, State 12345"
                  rows={3}
                  value={settings.footerText}
                  onChange={(e) => updateSetting('footerText', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unsubscribeText">Unsubscribe Link Text</Label>
                <Input
                  id="unsubscribeText"
                  placeholder="Click here to unsubscribe"
                  value={settings.unsubscribeText}
                  onChange={(e) => updateSetting('unsubscribeText', e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="includeLogo"
                  checked={settings.includeLogo}
                  onCheckedChange={(checked) => updateSetting('includeLogo', checked)}
                />
                <Label htmlFor="includeLogo" className="cursor-pointer">
                  Include company logo in footer
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tracking Tab */}
        <TabsContent value="tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Tracking</CardTitle>
              <CardDescription>
                Configure tracking options for outgoing emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="trackOpens" className="text-base">Track Email Opens</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications when recipients open your emails
                  </p>
                </div>
                <Switch
                  id="trackOpens"
                  checked={settings.trackOpens}
                  onCheckedChange={(checked) => updateSetting('trackOpens', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="trackClicks" className="text-base">Track Link Clicks</Label>
                  <p className="text-sm text-muted-foreground">
                    Track when recipients click on links in your emails
                  </p>
                </div>
                <Switch
                  id="trackClicks"
                  checked={settings.trackClicks}
                  onCheckedChange={(checked) => updateSetting('trackClicks', checked)}
                />
              </div>

              <Card className="bg-blue-50/50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-medium mb-1">About Email Tracking</p>
                      <p className="text-blue-800">
                        Email tracking uses a small invisible pixel to detect opens and rewrites
                        links to track clicks. This helps you understand engagement with your
                        emails but may be affected by email clients that block tracking.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
