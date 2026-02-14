'use client';

import { useState } from 'react';
import { UnifiedLayout } from '@/components/layout/unified';
import Link from 'next/link';
import {
  Mail,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Key,
  Settings,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

// Provider icons
const GmailIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
      fill="#EA4335"
    />
  </svg>
);

const OutlookIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M24 7.387v10.478c0 .23-.08.424-.238.576-.158.154-.352.233-.584.233h-8.501v-6.9l1.66 1.18c.1.063.209.095.329.095.12 0 .229-.032.329-.095l6.767-4.82.015-.012c.088-.058.132-.147.132-.266 0-.224-.133-.336-.399-.336h-.024l-8.809 6.278-8.809-6.278h-.024c-.266 0-.399.112-.399.336 0 .119.044.208.132.266l.015.012 6.767 4.82c.1.063.209.095.329.095.12 0 .229-.032.329-.095l1.66-1.18v6.9H.822c-.232 0-.426-.079-.584-.233-.158-.152-.238-.346-.238-.576V7.387c0-.23.08-.424.238-.576.158-.154.352-.233.584-.233h21.356c.232 0 .426.079.584.233.158.152.238.346.238.576z"
      fill="#0078D4"
    />
  </svg>
);

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
      {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
    </Button>
  );
}

function Step({ number, title, children }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
        {number}
      </div>
      <div className="flex-1 pb-6">
        <h4 className="font-medium mb-2">{title}</h4>
        <div className="text-sm text-muted-foreground space-y-2">{children}</div>
      </div>
    </div>
  );
}

export default function EmailHelpPage() {
  return (
    <UnifiedLayout hubId="settings" pageTitle="Email Connection Guide" fixedMenu={null}>
      <div className="flex-1 space-y-6 p-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings/email">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Email Connection Guide</h1>
            <p className="text-muted-foreground">
              Step-by-step instructions for connecting your email accounts
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="cursor-pointer hover:border-primary transition-colors">
            <a href="#gmail">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <GmailIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Gmail / Google</p>
                    <p className="text-sm text-muted-foreground">One-click OAuth</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </a>
          </Card>
          <Card className="cursor-pointer hover:border-primary transition-colors">
            <a href="#outlook">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <OutlookIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Outlook / Office 365</p>
                    <p className="text-sm text-muted-foreground">One-click OAuth</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </a>
          </Card>
          <Card className="cursor-pointer hover:border-primary transition-colors">
            <a href="#other">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Other Providers</p>
                    <p className="text-sm text-muted-foreground">IMAP/SMTP setup</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </a>
          </Card>
        </div>

        {/* Gmail Section */}
        <Card id="gmail">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                <GmailIcon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>Connect Gmail / Google Workspace</CardTitle>
                <CardDescription>Personal Gmail or Google Workspace accounts</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Recommended
              </Badge>
              <span className="text-muted-foreground">OAuth - Most secure and easy to set up</span>
            </div>

            <div className="space-y-4">
              <Step number={1} title="Go to Email Settings">
                <p>
                  Navigate to{' '}
                  <Link href="/settings/email" className="text-primary hover:underline">
                    Settings → Email
                  </Link>{' '}
                  in Nexora.
                </p>
              </Step>

              <Step number={2} title="Click 'Add Email'">
                <p>Click the "Add Email" or "Connect Email Account" button.</p>
              </Step>

              <Step number={3} title="Select Google">
                <p>In the provider selection, click on "Google" or "Gmail".</p>
              </Step>

              <Step number={4} title="Sign in to Google">
                <p>A Google sign-in popup will appear. Sign in with your Google account.</p>
              </Step>

              <Step number={5} title="Grant Permissions">
                <p>Review and accept the permissions requested:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Read and send emails</li>
                  <li>View email labels and folders</li>
                  <li>Manage drafts</li>
                </ul>
              </Step>

              <Step number={6} title="Done!">
                <p>Your Gmail account is now connected. Emails will sync automatically.</p>
              </Step>
            </div>

            <div className="rounded-lg border bg-blue-50 border-blue-200 p-4">
              <div className="flex gap-3">
                <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">Security Note</p>
                  <p className="text-blue-800 mt-1">
                    OAuth is the most secure method. We never see or store your Google password. You
                    can revoke access anytime from your Google Account settings.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Outlook Section */}
        <Card id="outlook">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <OutlookIcon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>Connect Outlook / Office 365</CardTitle>
                <CardDescription>Personal Outlook, Hotmail, or Office 365 accounts</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Recommended
              </Badge>
              <span className="text-muted-foreground">OAuth - Most secure and easy to set up</span>
            </div>

            <div className="space-y-4">
              <Step number={1} title="Go to Email Settings">
                <p>
                  Navigate to{' '}
                  <Link href="/settings/email" className="text-primary hover:underline">
                    Settings → Email
                  </Link>{' '}
                  in Nexora.
                </p>
              </Step>

              <Step number={2} title="Click 'Add Email'">
                <p>Click the "Add Email" or "Connect Email Account" button.</p>
              </Step>

              <Step number={3} title="Select Microsoft">
                <p>In the provider selection, click on "Microsoft" or "Outlook".</p>
              </Step>

              <Step number={4} title="Sign in to Microsoft">
                <p>A Microsoft sign-in popup will appear. Sign in with your Microsoft account.</p>
              </Step>

              <Step number={5} title="Grant Permissions">
                <p>Review and accept the permissions for email access.</p>
              </Step>

              <Step number={6} title="Done!">
                <p>Your Outlook account is now connected and syncing.</p>
              </Step>
            </div>
          </CardContent>
        </Card>

        {/* Other Providers Section */}
        <Card id="other">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <Mail className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <CardTitle>Connect Other Email Providers</CardTitle>
                <CardDescription>
                  Yahoo, iCloud, Zoho, GoDaddy, Hostinger, or any IMAP email
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                App Password Required
              </Badge>
              <span className="text-muted-foreground">
                Some providers need an app-specific password
              </span>
            </div>

            <div className="space-y-4">
              <Step number={1} title="Generate App Password (if required)">
                <p>
                  Many email providers require an "App Password" instead of your regular password.
                  See the provider-specific guides below.
                </p>
              </Step>

              <Step number={2} title="Go to Email Settings">
                <p>
                  Navigate to{' '}
                  <Link href="/settings/email" className="text-primary hover:underline">
                    Settings → Email
                  </Link>{' '}
                  in Nexora.
                </p>
              </Step>

              <Step number={3} title="Select Your Provider">
                <p>Click "Add Email" and choose your email provider from the list.</p>
              </Step>

              <Step number={4} title="Enter Credentials">
                <p>Enter your email address and the App Password you generated.</p>
              </Step>

              <Step number={5} title="Connect">
                <p>Click "Connect" and we'll verify your credentials and set up syncing.</p>
              </Step>
            </div>
          </CardContent>
        </Card>

        {/* App Password Guides */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              How to Generate App Passwords
            </CardTitle>
            <CardDescription>Step-by-step guides for each email provider</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="yahoo">
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-purple-600" />
                    </div>
                    <span>Yahoo Mail</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pl-11">
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>
                      Go to{' '}
                      <a
                        href="https://login.yahoo.com/account/security"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Yahoo Account Security <ExternalLink className="inline h-3 w-3" />
                      </a>
                    </li>
                    <li>Click "Generate app password"</li>
                    <li>Select "Other app" and enter "Nexora"</li>
                    <li>Copy the generated 16-character password</li>
                    <li>Use this password when connecting in Nexora</li>
                  </ol>
                  <div className="rounded-lg bg-muted p-3 text-sm">
                    <p className="font-medium mb-1">IMAP Settings (auto-configured):</p>
                    <div className="flex items-center gap-2">
                      <code className="bg-background px-2 py-1 rounded">
                        imap.mail.yahoo.com:993
                      </code>
                      <CopyButton text="imap.mail.yahoo.com" />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="icloud">
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-gray-800" />
                    </div>
                    <span>iCloud Mail (Apple)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pl-11">
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>
                      Go to{' '}
                      <a
                        href="https://appleid.apple.com/account/manage"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Apple ID Settings <ExternalLink className="inline h-3 w-3" />
                      </a>
                    </li>
                    <li>Sign in with your Apple ID</li>
                    <li>Go to "Sign-In and Security" → "App-Specific Passwords"</li>
                    <li>Click "Generate an app-specific password"</li>
                    <li>Enter "Nexora" as the label</li>
                    <li>Copy the generated password</li>
                  </ol>
                  <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-sm">
                    <p className="flex items-center gap-2 text-yellow-800">
                      <AlertTriangle className="h-4 w-4" />
                      Two-factor authentication must be enabled on your Apple ID
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="zoho">
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-yellow-600" />
                    </div>
                    <span>Zoho Mail</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pl-11">
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>
                      Go to{' '}
                      <a
                        href="https://accounts.zoho.com/home"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Zoho Account <ExternalLink className="inline h-3 w-3" />
                      </a>
                    </li>
                    <li>Navigate to Security → App Passwords</li>
                    <li>Click "Generate New Password"</li>
                    <li>Name it "Nexora" and generate</li>
                    <li>Copy and use this password in Nexora</li>
                  </ol>
                  <div className="rounded-lg bg-muted p-3 text-sm">
                    <p className="font-medium mb-1">IMAP Settings (auto-configured):</p>
                    <div className="flex items-center gap-2">
                      <code className="bg-background px-2 py-1 rounded">imap.zoho.com:993</code>
                      <CopyButton text="imap.zoho.com" />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="godaddy">
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-green-600" />
                    </div>
                    <span>GoDaddy Email</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pl-11">
                  <p className="text-sm">
                    GoDaddy workspace email uses standard IMAP. Use your regular email password.
                  </p>
                  <div className="rounded-lg bg-muted p-3 text-sm">
                    <p className="font-medium mb-1">IMAP Settings:</p>
                    <div className="flex items-center gap-2 mb-2">
                      <code className="bg-background px-2 py-1 rounded">
                        imap.secureserver.net:993
                      </code>
                      <CopyButton text="imap.secureserver.net" />
                    </div>
                    <p className="font-medium mb-1">SMTP Settings:</p>
                    <div className="flex items-center gap-2">
                      <code className="bg-background px-2 py-1 rounded">
                        smtpout.secureserver.net:465
                      </code>
                      <CopyButton text="smtpout.secureserver.net" />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="hostinger">
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <span>Hostinger Email</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pl-11">
                  <p className="text-sm">
                    Hostinger email uses standard IMAP. Use your regular email password.
                  </p>
                  <div className="rounded-lg bg-muted p-3 text-sm">
                    <p className="font-medium mb-1">IMAP Settings:</p>
                    <div className="flex items-center gap-2 mb-2">
                      <code className="bg-background px-2 py-1 rounded">
                        imap.hostinger.com:993
                      </code>
                      <CopyButton text="imap.hostinger.com" />
                    </div>
                    <p className="font-medium mb-1">SMTP Settings:</p>
                    <div className="flex items-center gap-2">
                      <code className="bg-background px-2 py-1 rounded">
                        smtp.hostinger.com:465
                      </code>
                      <CopyButton text="smtp.hostinger.com" />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="custom">
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Settings className="h-4 w-4 text-gray-600" />
                    </div>
                    <span>Custom / Other Provider</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pl-11">
                  <p className="text-sm">
                    For other email providers, you'll need to find the IMAP/SMTP settings from your
                    provider. Common settings:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>IMAP Port: 993 (SSL) or 143 (STARTTLS)</li>
                    <li>SMTP Port: 465 (SSL) or 587 (STARTTLS)</li>
                    <li>Security: SSL/TLS recommended</li>
                  </ul>
                  <p className="text-sm text-muted-foreground">
                    Contact your email provider's support for specific settings.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Troubleshooting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="auth-failed">
                <AccordionTrigger>Authentication failed</AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm">
                  <p>If you see "Authentication failed", try these steps:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Make sure you're using an App Password (not your regular password)</li>
                    <li>Check that two-factor authentication is enabled if required</li>
                    <li>Verify the email address is correct</li>
                    <li>Try generating a new App Password</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="connection-timeout">
                <AccordionTrigger>Connection timeout</AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm">
                  <p>If the connection times out:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Check your internet connection</li>
                    <li>Your email provider may be temporarily unavailable</li>
                    <li>Try again in a few minutes</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="oauth-popup">
                <AccordionTrigger>OAuth popup doesn't appear</AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm">
                  <p>If the sign-in popup doesn't appear:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Check that popups are not blocked in your browser</li>
                    <li>Try disabling popup blockers temporarily</li>
                    <li>Try using a different browser</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="emails-not-syncing">
                <AccordionTrigger>Emails not syncing</AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm">
                  <p>If emails are not syncing:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Click the "Sync" button to trigger a manual sync</li>
                    <li>Check that the account status shows "Connected"</li>
                    <li>Try disconnecting and reconnecting the account</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Back to settings */}
        <div className="flex justify-center pt-4">
          <Button variant="outline" asChild>
            <Link href="/settings/email">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Email Settings
            </Link>
          </Button>
        </div>
      </div>
    </UnifiedLayout>
  );
}
