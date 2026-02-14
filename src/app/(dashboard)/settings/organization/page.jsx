'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Camera,
  ExternalLink,
  Copy,
  CheckCircle2,
  Palette,
  Link2,
  Loader2,
  Trash2,
  Upload,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/auth-context';
import { UnifiedLayout } from '@/components/layout/unified';

// Animation variants for inner content
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

// Default organization data (used while loading)
const defaultOrganizationData = {
  id: '',
  name: 'Loading...',
  slug: '',
  logo: null,
  website: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  country: 'India',
  postalCode: '',
  industry: 'technology',
  size: '2-10',
  timezone: 'Asia/Kolkata',
  currency: 'INR',
  description: '',
  createdAt: new Date().toISOString(),
  plan: 'Starter',
  seats: 5,
  usedSeats: 1,
  brandColor: '#2563EB',
};

// Preset brand colors
const presetColors = [
  { name: 'Blue', value: '#2563EB' },
  { name: 'Indigo', value: '#4F46E5' },
  { name: 'Purple', value: '#7C3AED' },
  { name: 'Pink', value: '#DB2777' },
  { name: 'Red', value: '#DC2626' },
  { name: 'Orange', value: '#EA580C' },
  { name: 'Amber', value: '#D97706' },
  { name: 'Green', value: '#16A34A' },
  { name: 'Teal', value: '#0D9488' },
  { name: 'Cyan', value: '#0891B2' },
];

const industries = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'education', label: 'Education' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'other', label: 'Other' },
];

const companySizes = [
  { value: '1-10', label: '1-10 employees' },
  { value: '2-10', label: '2-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1000+', label: '1000+ employees' },
];

// Tab items
const tabs = [
  { id: 'general', label: 'General', icon: Building2 },
  { id: 'contact', label: 'Contact Info', icon: Phone },
  { id: 'branding', label: 'Branding', icon: Palette },
];

export default function OrganizationPage() {
  const [organization, setOrganization] = useState(defaultOrganizationData);
  const [companyId, setCompanyId] = useState(null); // Track company ID for updates
  const [activeTab, setActiveTab] = useState('general');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
  const [isSavingBrandColor, setIsSavingBrandColor] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const logoInputRef = useRef(null);
  const faviconInputRef = useRef(null);
  const colorInputRef = useRef(null);
  const { toast } = useToast();
  const { checkAuth, user } = useAuth();

  // Fetch organization and company data from API
  useEffect(() => {
    const fetchOrganizationData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch tenant, organization settings, and company data in parallel
        const [tenantResponse, orgSettingsResponse, companyResponse] = await Promise.all([
          api.get('/tenants/current'),
          api.get('/settings/organization'),
          api.get('/crm/companies'),
        ]);

        const tenant = tenantResponse.data;
        const orgSettings = orgSettingsResponse.data?.data || {};
        const company = companyResponse.data?.[0] || {}; // Get first company (main company)

        // Store company ID for updates
        if (company.id) {
          setCompanyId(company.id);
        }

        setOrganization({
          id: tenant.id,
          name: orgSettings.name || tenant.name || company.name || 'My Organization',
          slug: tenant.slug || '',
          logo: orgSettings.logoUrl || company.logoUrl || user?.tenant?.logo || null,
          website: orgSettings.website || company.websiteUrl || '',
          email: orgSettings.email || company.email || '',
          phone: orgSettings.phone || company.phone || '',
          address: orgSettings.address || company.address || '',
          city: company.city || '',
          state: company.state || '',
          country: company.country || 'India',
          postalCode: company.postalCode || '',
          industry: orgSettings.industry || company.industry || 'technology',
          size: orgSettings.size || company.employeeCount || '2-10',
          timezone: orgSettings.timezone || tenant.settings?.timezone || 'Asia/Kolkata',
          currency: orgSettings.currency || tenant.settings?.currency || 'INR',
          description: company.description || '',
          createdAt: tenant.createdAt || new Date().toISOString(),
          plan: 'Starter', // TODO: Get from subscription
          seats: 5,
          usedSeats: 1,
          brandColor: orgSettings.settings?.brandColor || user?.tenant?.brandColor || '#2563EB',
        });
      } catch (err) {
        console.error('Error fetching organization data:', err);
        setError('Failed to load organization data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizationData();
  }, []);

  const copySlug = () => {
    navigator.clipboard.writeText(`https://app.crm360.com/${organization.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle logo file selection and upload
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file (PNG, JPG, or GIF)',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Logo must be less than 2MB',
        variant: 'destructive',
      });
      return;
    }

    setIsUploadingLogo(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;

        try {
          // Upload to server
          const uploadResponse = await api.post('/uploads/logo', {
            image: base64Image,
          });

          // api helper already unwraps response.data
          if (uploadResponse?.success) {
            const logoUrl = uploadResponse.data.url;

            // Update organization settings with new logo URL
            await api.patch('/settings/organization', { logoUrl });

            // Update local state
            setOrganization((prev) => ({ ...prev, logo: logoUrl }));

            // Refresh auth context to update header logo
            await checkAuth(true);

            toast({
              title: 'Logo uploaded',
              description: 'Your organization logo has been updated successfully.',
            });
          } else {
            throw new Error(uploadResponse?.message || 'Upload failed');
          }
        } catch (err) {
          console.error('Logo upload error:', err);
          toast({
            title: 'Upload failed',
            description: err.message || 'Failed to upload logo. Please try again.',
            variant: 'destructive',
          });
        } finally {
          setIsUploadingLogo(false);
        }
      };

      reader.onerror = () => {
        toast({
          title: 'Read error',
          description: 'Failed to read the selected file',
          variant: 'destructive',
        });
        setIsUploadingLogo(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File handling error:', err);
      setIsUploadingLogo(false);
    }

    // Reset file input
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  // Handle favicon file selection and upload
  const handleFaviconUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file (ICO or PNG)',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (100KB max for favicon)
    if (file.size > 100 * 1024) {
      toast({
        title: 'File too large',
        description: 'Favicon must be less than 100KB',
        variant: 'destructive',
      });
      return;
    }

    setIsUploadingFavicon(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;

        try {
          // Upload to server
          const uploadResponse = await api.post('/uploads/favicon', {
            image: base64Image,
          });

          if (uploadResponse?.success) {
            const faviconUrl = uploadResponse.data.url;

            // Update organization settings with new favicon URL
            await api.patch('/settings/organization', {
              settings: {
                ...(organization.settings || {}),
                faviconUrl,
              },
            });

            // Update local state
            setOrganization((prev) => ({
              ...prev,
              settings: { ...(prev.settings || {}), faviconUrl },
            }));

            // Refresh auth context
            await checkAuth(true);

            toast({
              title: 'Favicon uploaded',
              description: 'Your organization favicon has been updated successfully.',
            });
          } else {
            throw new Error(uploadResponse?.message || 'Upload failed');
          }
        } catch (err) {
          console.error('Favicon upload error:', err);
          toast({
            title: 'Upload failed',
            description: err.message || 'Failed to upload favicon. Please try again.',
            variant: 'destructive',
          });
        } finally {
          setIsUploadingFavicon(false);
        }
      };

      reader.onerror = () => {
        toast({
          title: 'Read error',
          description: 'Failed to read the selected file',
          variant: 'destructive',
        });
        setIsUploadingFavicon(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File handling error:', err);
      setIsUploadingFavicon(false);
    }

    // Reset file input
    if (faviconInputRef.current) {
      faviconInputRef.current.value = '';
    }
  };

  // Handle brand color change
  const handleBrandColorChange = async (color) => {
    const previousColor = organization.brandColor;

    // Update local state immediately for instant feedback
    setOrganization((prev) => ({ ...prev, brandColor: color }));

    // Apply to DOM immediately for preview
    document.documentElement.style.setProperty('--brand-color', color);
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '37, 99, 235';
    };
    document.documentElement.style.setProperty('--brand-color-rgb', hexToRgb(color));

    setIsSavingBrandColor(true);

    try {
      // Get current settings and merge with new brand color
      const settingsResponse = await api.get('/settings/organization');
      const currentSettings = settingsResponse.data?.data?.settings || {};

      await api.patch('/settings/organization', {
        settings: {
          ...currentSettings,
          brandColor: color,
        },
      });

      // Refresh auth context to update brand color globally
      await checkAuth(true);

      toast({
        title: 'Brand color updated',
        description: 'Your brand color has been applied throughout the dashboard.',
      });
    } catch (err) {
      console.error('Brand color update error:', err);
      // Revert on error
      setOrganization((prev) => ({ ...prev, brandColor: previousColor }));
      document.documentElement.style.setProperty('--brand-color', previousColor);
      document.documentElement.style.setProperty('--brand-color-rgb', hexToRgb(previousColor));

      toast({
        title: 'Failed to update brand color',
        description: err.response?.data?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingBrandColor(false);
    }
  };

  // Handle logo removal
  const handleRemoveLogo = async () => {
    try {
      await api.patch('/settings/organization', { logoUrl: null });
      setOrganization((prev) => ({ ...prev, logo: null }));

      // Refresh auth context to update header logo
      await checkAuth(true);

      toast({
        title: 'Logo removed',
        description: 'Your organization logo has been removed.',
      });
    } catch (err) {
      console.error('Remove logo error:', err);
      toast({
        title: 'Failed to remove logo',
        description: err.response?.data?.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle save organization settings
  const handleSaveOrganization = async () => {
    setIsSaving(true);

    try {
      // Build organization settings payload
      const orgPayload = {
        name: organization.name,
        phone: organization.phone,
        address: organization.address,
        industry: organization.industry,
        size: organization.size,
        timezone: organization.timezone,
        currency: organization.currency,
      };

      // Only include email if it's a valid non-empty value
      if (organization.email && organization.email.trim()) {
        orgPayload.email = organization.email.trim();
      }

      // Only include website if it's a valid non-empty value
      if (organization.website && organization.website.trim()) {
        orgPayload.website = organization.website.trim();
      }

      // Build company data payload (for city, state, country, postalCode, description)
      const companyPayload = {
        name: organization.name,
        address: organization.address,
        city: organization.city || '',
        state: organization.state || '',
        country: organization.country || 'India',
        postalCode: organization.postalCode || '',
        industry: organization.industry,
        size: organization.size,
        description: organization.description || '',
      };

      // Save organization settings
      await api.patch('/settings/organization', orgPayload);

      // Save company data if we have a company ID
      if (companyId) {
        await api.patch(`/crm/companies/${companyId}`, companyPayload);
      }

      // Refresh auth context to update any cached data
      await checkAuth(true);

      toast({
        title: 'Settings saved',
        description: 'Your organization settings have been updated successfully.',
      });
    } catch (err) {
      console.error('Save organization error:', err);
      toast({
        title: 'Failed to save settings',
        description: err.response?.data?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <UnifiedLayout hubId="settings" pageTitle="Organization Settings" fixedMenu={null}>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading organization data...</p>
          </div>
        </div>
      </UnifiedLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <UnifiedLayout hubId="settings" pageTitle="Organization Settings" fixedMenu={null}>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-gray-900 font-medium mb-1">Failed to load organization</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        </div>
      </UnifiedLayout>
    );
  }

  return (
    <UnifiedLayout hubId="settings" pageTitle="Organization Settings" fixedMenu={null}>
      {/* Organization Header Card */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="bg-white rounded-2xl p-6 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={organization.logo} />
                <AvatarFallback className="text-xl bg-blue-50 text-blue-600">
                  {getInitials(organization.name)}
                </AvatarFallback>
              </Avatar>
              <button className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{organization.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">app.crm360.com/{organization.slug}</span>
                <button
                  onClick={copySlug}
                  className="h-6 w-6 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  {copied ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-gray-400" />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                  {organization.plan} Plan
                </Badge>
                <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                  {organization.usedSeats}/{organization.seats} seats
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Organization since</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(organization.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="bg-white rounded-2xl p-1.5 shadow-sm inline-flex"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      {activeTab === 'general' && (
        <motion.div
          variants={itemVariants}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Organization Details</h3>
              <p className="text-sm text-gray-500">Basic information about your organization</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-gray-700">Organization Name</Label>
              <Input
                value={organization.name}
                onChange={(e) => setOrganization({ ...organization, name: e.target.value })}
                className="h-11 rounded-xl bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">URL Slug</Label>
              <div className="flex items-center h-11 rounded-xl bg-gray-50 px-3">
                <span className="text-sm text-gray-400">app.crm360.com/</span>
                <input
                  value={organization.slug}
                  onChange={(e) => setOrganization({ ...organization, slug: e.target.value })}
                  className="flex-1 bg-transparent text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-gray-700">Industry</Label>
              <Select
                value={organization.industry}
                onValueChange={(value) => setOrganization({ ...organization, industry: value })}
              >
                <SelectTrigger className="h-11 rounded-xl bg-gray-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry.value} value={industry.value}>
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Company Size</Label>
              <Select
                value={organization.size}
                onValueChange={(value) => setOrganization({ ...organization, size: value })}
              >
                <SelectTrigger className="h-11 rounded-xl bg-gray-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {companySizes.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-gray-700">Timezone</Label>
              <Select
                value={organization.timezone}
                onValueChange={(value) => setOrganization({ ...organization, timezone: value })}
              >
                <SelectTrigger className="h-11 rounded-xl bg-gray-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Kolkata">India Standard Time (IST)</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                  <SelectItem value="Asia/Dubai">Gulf Standard Time (GST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Currency</Label>
              <Select
                value={organization.currency}
                onValueChange={(value) => setOrganization({ ...organization, currency: value })}
              >
                <SelectTrigger className="h-11 rounded-xl bg-gray-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                  <SelectItem value="USD">US Dollar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="GBP">British Pound (£)</SelectItem>
                  <SelectItem value="AED">UAE Dirham (د.إ)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Description</Label>
            <Textarea
              value={organization.description}
              onChange={(e) => setOrganization({ ...organization, description: e.target.value })}
              rows={3}
              placeholder="Brief description of your organization..."
              className="rounded-xl bg-gray-50 resize-none"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button onClick={handleSaveOrganization} disabled={isSaving} className="rounded-xl">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </motion.div>
      )}

      {activeTab === 'contact' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Contact Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center">
                <Mail className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Contact Information</h3>
                <p className="text-sm text-gray-500">How customers and partners can reach you</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-gray-700">Email Address</Label>
                <Input
                  type="email"
                  value={organization.email}
                  onChange={(e) => setOrganization({ ...organization, email: e.target.value })}
                  className="h-11 rounded-xl bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700">Phone Number</Label>
                <Input
                  value={organization.phone}
                  onChange={(e) => setOrganization({ ...organization, phone: e.target.value })}
                  className="h-11 rounded-xl bg-gray-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Website</Label>
              <div className="flex gap-2">
                <Input
                  value={organization.website}
                  onChange={(e) => setOrganization({ ...organization, website: e.target.value })}
                  className="h-11 rounded-xl bg-gray-50"
                />
                <a
                  href={organization.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-11 w-11 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 text-gray-500" />
                </a>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Address</h3>
                <p className="text-sm text-gray-500">Physical location of your organization</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Street Address</Label>
              <Input
                value={organization.address}
                onChange={(e) => setOrganization({ ...organization, address: e.target.value })}
                className="h-11 rounded-xl bg-gray-50"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-gray-700">City</Label>
                <Input
                  value={organization.city}
                  onChange={(e) => setOrganization({ ...organization, city: e.target.value })}
                  className="h-11 rounded-xl bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700">State / Province</Label>
                <Input
                  value={organization.state}
                  onChange={(e) => setOrganization({ ...organization, state: e.target.value })}
                  className="h-11 rounded-xl bg-gray-50"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-gray-700">Country</Label>
                <Select
                  value={organization.country}
                  onValueChange={(value) => setOrganization({ ...organization, country: value })}
                >
                  <SelectTrigger className="h-11 rounded-xl bg-gray-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Singapore">Singapore</SelectItem>
                    <SelectItem value="UAE">United Arab Emirates</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700">Postal Code</Label>
                <Input
                  value={organization.postalCode}
                  onChange={(e) => setOrganization({ ...organization, postalCode: e.target.value })}
                  className="h-11 rounded-xl bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSaveOrganization} disabled={isSaving} className="rounded-xl">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </motion.div>
      )}

      {activeTab === 'branding' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Logo & Branding */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-pink-50 flex items-center justify-center">
                <Palette className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Logo & Branding</h3>
                <p className="text-sm text-gray-500">Customize your organization's appearance</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="p-5 rounded-xl bg-gray-50">
                <Label className="text-gray-700 mb-4 block">Organization Logo</Label>
                <div className="flex items-start gap-4">
                  {/* Logo Preview */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-20 w-20 rounded-xl bg-white border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                      {organization.logo ? (
                        organization.logo.toLowerCase().endsWith('.svg') ? (
                          <img
                            src={organization.logo}
                            alt="Logo preview"
                            className="max-h-16 max-w-16 object-contain"
                          />
                        ) : (
                          <img
                            src={organization.logo}
                            alt="Logo preview"
                            className="max-h-16 max-w-16 object-contain"
                          />
                        )
                      ) : (
                        <span className="text-2xl font-semibold text-gray-300">
                          {getInitials(organization.name)}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400">Preview</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <input
                      type="file"
                      ref={logoInputRef}
                      onChange={handleLogoUpload}
                      accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                        onClick={() => logoInputRef.current?.click()}
                        disabled={isUploadingLogo}
                      >
                        {isUploadingLogo ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Logo
                          </>
                        )}
                      </Button>
                      {organization.logo && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={handleRemoveLogo}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p className="font-medium text-gray-600">Recommended specifications:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-gray-500">
                        <li>Format: PNG, JPG, or SVG (SVG preferred for crisp display)</li>
                        <li>Size: Max 2MB file size</li>
                        <li>Dimensions: 200x60px to 400x120px (horizontal logos work best)</li>
                        <li>Background: Transparent PNG or SVG for best results</li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* Header Preview */}
                {organization.logo && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Label className="text-gray-600 text-xs mb-2 block">Header Preview</Label>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-16 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-[8px] text-gray-400">NEXORA</span>
                        </div>
                        <div className="h-6 w-px bg-gray-300" />
                        {organization.logo.toLowerCase().endsWith('.svg') ? (
                          <img
                            src={organization.logo}
                            alt="Header preview"
                            className="h-6 w-auto max-w-[100px] object-contain"
                          />
                        ) : (
                          <img
                            src={organization.logo}
                            alt="Header preview"
                            className="h-6 w-auto max-w-[100px] object-contain"
                          />
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 ml-auto">
                        How it appears in header
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5 rounded-xl bg-gray-50">
                <Label className="text-gray-700 mb-4 block">Favicon</Label>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-white shadow-sm flex items-center justify-center overflow-hidden">
                    {organization.settings?.faviconUrl ? (
                      <img
                        src={organization.settings.faviconUrl}
                        alt="Favicon preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">32px</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      type="file"
                      ref={faviconInputRef}
                      onChange={handleFaviconUpload}
                      accept="image/png,image/x-icon,image/vnd.microsoft.icon"
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      onClick={() => faviconInputRef.current?.click()}
                      disabled={isUploadingFavicon}
                    >
                      {isUploadingFavicon ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        'Upload Favicon'
                      )}
                    </Button>
                    <p className="text-xs text-gray-500">ICO or PNG, max 100KB</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-gray-50">
              <Label className="text-gray-700 mb-4 block">Brand Color</Label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {/* Color Preview */}
                  <div
                    className="h-11 w-11 rounded-xl shadow-sm border border-gray-200 cursor-pointer transition-transform hover:scale-105"
                    style={{ backgroundColor: organization.brandColor }}
                    onClick={() => colorInputRef.current?.click()}
                  />
                  {/* Hidden native color picker */}
                  <input
                    type="color"
                    ref={colorInputRef}
                    value={organization.brandColor}
                    onChange={(e) => handleBrandColorChange(e.target.value)}
                    className="hidden"
                  />
                  {/* Hex Input */}
                  <Input
                    type="text"
                    value={organization.brandColor}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only update if valid hex format
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                        setOrganization((prev) => ({ ...prev, brandColor: value }));
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value;
                      // Save on blur if valid 6-digit hex
                      if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                        handleBrandColorChange(value);
                      }
                    }}
                    className="w-28 font-mono text-sm h-11 rounded-xl bg-white uppercase"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => colorInputRef.current?.click()}
                    disabled={isSavingBrandColor}
                  >
                    {isSavingBrandColor ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Pick Color'
                    )}
                  </Button>
                </div>
                {/* Preset Colors */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">Quick select:</p>
                  <div className="flex flex-wrap gap-2">
                    {presetColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleBrandColorChange(color.value)}
                        className={cn(
                          'h-8 w-8 rounded-lg shadow-sm border-2 transition-all hover:scale-110',
                          organization.brandColor === color.value
                            ? 'border-gray-800 ring-2 ring-offset-2 ring-gray-400'
                            : 'border-white'
                        )}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                        disabled={isSavingBrandColor}
                      />
                    ))}
                  </div>
                </div>
                {/* Preview */}
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Preview:</p>
                  <div className="flex items-center gap-3">
                    <button
                      className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
                      style={{ backgroundColor: organization.brandColor }}
                    >
                      Primary Button
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors"
                      style={{
                        borderColor: organization.brandColor,
                        color: organization.brandColor,
                      }}
                    >
                      Secondary Button
                    </button>
                    <span
                      className="text-sm font-medium"
                      style={{ color: organization.brandColor }}
                    >
                      Link Text
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Domain */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
                <Link2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Custom Domain</h3>
                <p className="text-sm text-gray-500">Use your own domain for the customer portal</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-5 rounded-xl bg-primary/5">
              <div>
                <p className="font-medium text-indigo-900">Custom Domain</p>
                <p className="text-sm text-primary">
                  Access Nexora at your own domain (e.g., crm.yourcompany.com)
                </p>
              </div>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                Enterprise Plan
              </Badge>
            </div>
          </div>
        </motion.div>
      )}
    </UnifiedLayout>
  );
}
