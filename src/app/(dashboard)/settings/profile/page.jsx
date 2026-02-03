'use client';

import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Camera,
  Save,
  Lock,
  Shield,
  Smartphone,
  Key,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

// Mock user data
const userData = {
  id: 'user_001',
  firstName: 'Rajesh',
  lastName: 'Kumar',
  email: 'rajesh@company.com',
  phone: '+91 98765 43210',
  avatar: null,
  role: 'Admin',
  department: 'Sales',
  location: 'Mumbai, India',
  timezone: 'Asia/Kolkata',
  bio: 'Sales Manager with 10+ years of experience in B2B sales and customer relationship management.',
  twoFactorEnabled: true,
  emailVerified: true,
  phoneVerified: true,
  lastPasswordChange: '2024-01-01T00:00:00Z',
  createdAt: '2023-06-15T00:00:00Z',
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('general');
  const [profile, setProfile] = useState(userData);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showTwoFactorDialog, setShowTwoFactorDialog] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your personal information and account settings
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {getInitials(profile.firstName, profile.lastName)}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-muted-foreground">{profile.email}</p>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="outline">{profile.role}</Badge>
                <Badge variant="outline">{profile.department}</Badge>
                {profile.twoFactorEnabled && (
                  <Badge className="bg-green-100 text-green-700">2FA Enabled</Badge>
                )}
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>Member since</p>
              <p className="font-medium text-foreground">
                {new Date(profile.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Input id="email" value={profile.email} disabled />
                    {profile.emailVerified && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Contact admin to change email address
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                    {profile.phoneVerified && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={profile.department}
                    onValueChange={(value) => setProfile({ ...profile, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={profile.timezone}
                  onValueChange={(value) => setProfile({ ...profile, timezone: value })}
                >
                  <SelectTrigger className="w-full md:w-[300px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Kolkata">India Standard Time (IST)</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                    <SelectItem value="Asia/Dubai">Gulf Standard Time (GST)</SelectItem>
                    <SelectItem value="Asia/Singapore">Singapore Time (SGT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Password</CardTitle>
              <CardDescription>Manage your password settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Change Password</p>
                  <p className="text-sm text-muted-foreground">
                    Last changed {new Date(profile.lastPasswordChange).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="outline" onClick={() => setShowPasswordDialog(true)}>
                  <Lock className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${profile.twoFactorEnabled ? 'bg-green-100' : 'bg-muted'}`}>
                    <Shield className={`h-5 w-5 ${profile.twoFactorEnabled ? 'text-green-600' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <p className="font-medium">Authenticator App</p>
                    <p className="text-sm text-muted-foreground">
                      {profile.twoFactorEnabled
                        ? 'Two-factor authentication is enabled'
                        : 'Use an authenticator app for 2FA'}
                    </p>
                  </div>
                </div>
                {profile.twoFactorEnabled ? (
                  <Button variant="outline" className="text-red-600">
                    Disable 2FA
                  </Button>
                ) : (
                  <Button onClick={() => setShowTwoFactorDialog(true)}>
                    Enable 2FA
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg p-2 bg-muted">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">SMS Backup</p>
                    <p className="text-sm text-muted-foreground">
                      Receive codes via SMS as backup
                    </p>
                  </div>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg p-2 bg-muted">
                    <Key className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Recovery Codes</p>
                    <p className="text-sm text-muted-foreground">
                      Generate backup codes for account recovery
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Generate Codes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Verification</CardTitle>
              <CardDescription>Verify your email and phone number</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{profile.email}</p>
                    <p className="text-sm text-muted-foreground">Primary email</p>
                  </div>
                </div>
                {profile.emailVerified ? (
                  <Badge className="bg-green-100 text-green-700">Verified</Badge>
                ) : (
                  <Button variant="outline" size="sm">
                    Verify
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{profile.phone}</p>
                    <p className="text-sm text-muted-foreground">Phone number</p>
                  </div>
                </div>
                {profile.phoneVerified ? (
                  <Badge className="bg-green-100 text-green-700">Verified</Badge>
                ) : (
                  <Button variant="outline" size="sm">
                    Verify
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Active Sessions</CardTitle>
                  <CardDescription>Manage your active sessions across devices</CardDescription>
                </div>
                <Button variant="outline" className="text-red-600">
                  Sign Out All Other Sessions
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-primary bg-primary/5">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">Chrome on Windows</p>
                      <Badge className="bg-primary/10 text-primary">Current</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Mumbai, India • 103.21.45.67
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Active now</p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-muted p-2">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Nexora Mobile App</p>
                    <p className="text-sm text-muted-foreground">
                      Mumbai, India • 103.21.45.90
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    Revoke
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="Enter current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
              />
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm font-medium mb-2">Password requirements:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• At least 12 characters</li>
                <li>• Include uppercase and lowercase letters</li>
                <li>• Include at least one number</li>
                <li>• Include at least one special character</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowPasswordDialog(false)}>
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enable 2FA Dialog */}
      <Dialog open={showTwoFactorDialog} onOpenChange={setShowTwoFactorDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Scan the QR code with your authenticator app
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center p-4 bg-white rounded-lg border">
              <div className="w-48 h-48 bg-muted rounded flex items-center justify-center">
                <p className="text-sm text-muted-foreground">QR Code</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Or enter this code manually:
              </p>
              <code className="text-sm bg-muted px-3 py-2 rounded">
                ABCD EFGH IJKL MNOP
              </code>
            </div>
            <div className="space-y-2">
              <Label htmlFor="verifyCode">Verification Code</Label>
              <Input
                id="verifyCode"
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTwoFactorDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowTwoFactorDialog(false)}>
              Verify & Enable
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
