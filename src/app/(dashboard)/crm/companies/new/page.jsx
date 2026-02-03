'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  Globe,
  Phone,
  Mail,
  MapPin,
  FileText,
  Calendar,
  Clock,
  Linkedin,
  Twitter,
  Facebook,
  Printer,
  Loader2,
  Save,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useCreateCompany } from '@/hooks/use-companies';
import { useCustomFields } from '@/hooks/use-custom-fields';
import { CustomFieldGroup } from '@/components/crm/custom-field-renderer';

// Indian States with codes for GST
const INDIAN_STATES = [
  { code: '01', name: 'Jammu & Kashmir' },
  { code: '02', name: 'Himachal Pradesh' },
  { code: '03', name: 'Punjab' },
  { code: '04', name: 'Chandigarh' },
  { code: '05', name: 'Uttarakhand' },
  { code: '06', name: 'Haryana' },
  { code: '07', name: 'Delhi' },
  { code: '08', name: 'Rajasthan' },
  { code: '09', name: 'Uttar Pradesh' },
  { code: '10', name: 'Bihar' },
  { code: '11', name: 'Sikkim' },
  { code: '12', name: 'Arunachal Pradesh' },
  { code: '13', name: 'Nagaland' },
  { code: '14', name: 'Manipur' },
  { code: '15', name: 'Mizoram' },
  { code: '16', name: 'Tripura' },
  { code: '17', name: 'Meghalaya' },
  { code: '18', name: 'Assam' },
  { code: '19', name: 'West Bengal' },
  { code: '20', name: 'Jharkhand' },
  { code: '21', name: 'Odisha' },
  { code: '22', name: 'Chhattisgarh' },
  { code: '23', name: 'Madhya Pradesh' },
  { code: '24', name: 'Gujarat' },
  { code: '26', name: 'Dadra & Nagar Haveli and Daman & Diu' },
  { code: '27', name: 'Maharashtra' },
  { code: '29', name: 'Karnataka' },
  { code: '30', name: 'Goa' },
  { code: '32', name: 'Kerala' },
  { code: '33', name: 'Tamil Nadu' },
  { code: '36', name: 'Telangana' },
  { code: '37', name: 'Andhra Pradesh' },
];

const GST_REGISTRATION_TYPES = [
  { value: 'Regular', label: 'Regular' },
  { value: 'Composition', label: 'Composition Scheme' },
  { value: 'Unregistered', label: 'Unregistered' },
  { value: 'SEZ', label: 'SEZ Unit/Developer' },
];

const COMPANY_TYPES = [
  { value: 'PROSPECT', label: 'Prospect' },
  { value: 'CUSTOMER', label: 'Customer' },
  { value: 'PARTNER', label: 'Partner' },
  { value: 'VENDOR', label: 'Vendor' },
  { value: 'COMPETITOR', label: 'Competitor' },
  { value: 'OTHER', label: 'Other' },
];

const COMPANY_LIFECYCLE_STAGES = [
  { value: 'LEAD', label: 'Lead' },
  { value: 'QUALIFIED', label: 'Qualified' },
  { value: 'OPPORTUNITY', label: 'Opportunity' },
  { value: 'CUSTOMER', label: 'Customer' },
  { value: 'CHURNED', label: 'Churned' },
];

const INDUSTRIES = [
  'Technology', 'Software', 'SaaS', 'IT Services', 'Consulting',
  'Healthcare', 'Pharmaceuticals', 'Finance', 'Banking', 'Insurance',
  'Manufacturing', 'Automotive', 'Retail', 'E-commerce', 'FMCG',
  'Education', 'EdTech', 'Real Estate', 'Construction', 'Media',
  'Hospitality', 'Logistics', 'Textiles', 'Agriculture', 'Energy',
  'Telecom', 'Legal', 'Government', 'Non-Profit', 'Other',
];

const COMPANY_SIZES = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1000+', label: '1000+ employees' },
];

const REVENUE_RANGES = [
  { value: 'Below ₹40L', label: 'Below ₹40 Lakhs' },
  { value: '₹40L - ₹1.5Cr', label: '₹40 Lakhs - ₹1.5 Crore' },
  { value: '₹1.5Cr - ₹5Cr', label: '₹1.5 Crore - ₹5 Crore' },
  { value: '₹5Cr - ₹10Cr', label: '₹5 Crore - ₹10 Crore' },
  { value: '₹10Cr - ₹50Cr', label: '₹10 Crore - ₹50 Crore' },
  { value: '₹50Cr - ₹100Cr', label: '₹50 Crore - ₹100 Crore' },
  { value: '₹100Cr+', label: '₹100 Crore+' },
];

const TIMEZONES = [
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST)' },
  { value: 'Asia/Singapore', label: 'Singapore Time (SGT)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
];

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ta', label: 'Tamil' },
  { value: 'te', label: 'Telugu' },
  { value: 'mr', label: 'Marathi' },
];

const emptyCompany = {
  name: '',
  domain: '',
  description: '',
  companyType: '',
  lifecycleStage: '',
  industry: '',
  employeeCount: '',
  annualRevenue: '',
  foundedYear: '',
  phone: '',
  email: '',
  fax: '',
  timezone: 'Asia/Kolkata',
  preferredLanguage: 'en',
  linkedinUrl: '',
  twitterUrl: '',
  facebookUrl: '',
  address: '',
  city: '',
  state: '',
  country: 'India',
  postalCode: '',
  gstin: '',
  pan: '',
  legalName: '',
  stateCode: '',
  gstRegistrationType: '',
  isGstRegistered: false,
  customFields: {},
};

export default function NewCompanyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState(emptyCompany);
  const [activeTab, setActiveTab] = useState('basic');

  const createCompany = useCreateCompany();

  // Fetch custom fields for companies
  const { data: customFieldsData, isLoading: customFieldsLoading } = useCustomFields('COMPANY');
  const customFields = customFieldsData?.data || [];

  const handleCustomFieldsChange = (values) => {
    setFormData({ ...formData, customFields: values });
  };

  const handleStateChange = (stateCode) => {
    const state = INDIAN_STATES.find(s => s.code === stateCode);
    setFormData({
      ...formData,
      stateCode: stateCode,
      state: state?.name || '',
    });
  };

  const handleCreate = async () => {
    if (!formData.name) {
      toast({
        title: 'Validation Error',
        description: 'Company name is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      const result = await createCompany.mutateAsync(formData);
      toast({
        title: 'Company Created',
        description: 'The company has been created successfully',
      });
      router.push(`/crm/companies/${result.data.id}`);
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create company',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/crm/companies">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Add New Company</h1>
            <p className="text-muted-foreground">Create a new company in your CRM</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/crm/companies">Cancel</Link>
          </Button>
          <Button onClick={handleCreate} disabled={createCompany.isPending}>
            {createCompany.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Company
          </Button>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="basic">
              <Building2 className="h-4 w-4 mr-2" />
              Basic
            </TabsTrigger>
            <TabsTrigger value="contact">
              <Phone className="h-4 w-4 mr-2" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="social">
              <Globe className="h-4 w-4 mr-2" />
              Social
            </TabsTrigger>
            <TabsTrigger value="address">
              <MapPin className="h-4 w-4 mr-2" />
              Address
            </TabsTrigger>
            <TabsTrigger value="gst">
              <FileText className="h-4 w-4 mr-2" />
              GST
            </TabsTrigger>
            <TabsTrigger value="custom">
              <Plus className="h-4 w-4 mr-2" />
              Custom
            </TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Acme Inc."
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  placeholder="acme.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={formData.industry || 'none'}
                  onValueChange={(value) => setFormData({ ...formData, industry: value === 'none' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Not specified</SelectItem>
                    {INDUSTRIES.map((ind) => (
                      <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyType">Company Type</Label>
                <Select
                  value={formData.companyType || 'none'}
                  onValueChange={(value) => setFormData({ ...formData, companyType: value === 'none' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Not specified</SelectItem>
                    {COMPANY_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lifecycleStage">Lifecycle Stage</Label>
                <Select
                  value={formData.lifecycleStage || 'none'}
                  onValueChange={(value) => setFormData({ ...formData, lifecycleStage: value === 'none' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Not specified</SelectItem>
                    {COMPANY_LIFECYCLE_STAGES.map((stage) => (
                      <SelectItem key={stage.value} value={stage.value}>{stage.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="employeeCount">Employee Count</Label>
                <Select
                  value={formData.employeeCount || 'none'}
                  onValueChange={(value) => setFormData({ ...formData, employeeCount: value === 'none' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Not specified</SelectItem>
                    {COMPANY_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="annualRevenue">Annual Revenue</Label>
                <Select
                  value={formData.annualRevenue || 'none'}
                  onValueChange={(value) => setFormData({ ...formData, annualRevenue: value === 'none' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select revenue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Not specified</SelectItem>
                    {REVENUE_RANGES.map((range) => (
                      <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="foundedYear">Founded Year</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="foundedYear"
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    value={formData.foundedYear}
                    onChange={(e) => setFormData({ ...formData, foundedYear: e.target.value })}
                    placeholder="2020"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the company..."
                rows={4}
              />
            </div>
          </TabsContent>

          {/* Contact Info Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="info@company.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 22 1234 5678"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fax">Fax</Label>
                <div className="relative">
                  <Printer className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fax"
                    value={formData.fax}
                    onChange={(e) => setFormData({ ...formData, fax: e.target.value })}
                    placeholder="+91 22 1234 5679"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-4 mt-4">
              <h4 className="font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Preferences
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) => setFormData({ ...formData, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredLanguage">Preferred Language</Label>
                  <Select
                    value={formData.preferredLanguage}
                    onValueChange={(value) => setFormData({ ...formData, preferredLanguage: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Social Profiles Tab */}
          <TabsContent value="social" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0A66C2]" />
                <Input
                  id="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/company/acme"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitterUrl">Twitter/X Profile</Label>
              <div className="relative">
                <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1DA1F2]" />
                <Input
                  id="twitterUrl"
                  value={formData.twitterUrl}
                  onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                  placeholder="https://twitter.com/acme"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebookUrl">Facebook Page</Label>
              <div className="relative">
                <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1877F2]" />
                <Input
                  id="facebookUrl"
                  value={formData.facebookUrl}
                  onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                  placeholder="https://facebook.com/acme"
                  className="pl-10"
                />
              </div>
            </div>
          </TabsContent>

          {/* Address Tab */}
          <TabsContent value="address" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter complete street address"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Mumbai"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select
                  value={formData.stateCode || 'none'}
                  onValueChange={(value) => value !== 'none' && handleStateChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select state</SelectItem>
                    {INDIAN_STATES.map((state) => (
                      <SelectItem key={state.code} value={state.code}>{state.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="postalCode">Pincode</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="400001"
                  maxLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="India"
                />
              </div>
            </div>
          </TabsContent>

          {/* GST Compliance Tab */}
          <TabsContent value="gst" className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
              <div className="space-y-0.5">
                <Label>GST Registered</Label>
                <p className="text-sm text-muted-foreground">
                  Is this company registered under GST?
                </p>
              </div>
              <Switch
                checked={formData.isGstRegistered}
                onCheckedChange={(checked) => setFormData({ ...formData, isGstRegistered: checked })}
              />
            </div>

            {formData.isGstRegistered && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="gstin">GSTIN</Label>
                  <Input
                    id="gstin"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                    placeholder="22AAAAA0000A1Z5"
                    maxLength={15}
                  />
                  <p className="text-xs text-muted-foreground">15-character GST Identification Number</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstRegistrationType">GST Registration Type</Label>
                  <Select
                    value={formData.gstRegistrationType || 'none'}
                    onValueChange={(value) => setFormData({ ...formData, gstRegistrationType: value === 'none' ? '' : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select registration type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Select type</SelectItem>
                      {GST_REGISTRATION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="pan">PAN</Label>
                <Input
                  id="pan"
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                  placeholder="AAAAA0000A"
                  maxLength={10}
                />
                <p className="text-xs text-muted-foreground">10-character Permanent Account Number</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="legalName">Legal/Registered Name</Label>
                <Input
                  id="legalName"
                  value={formData.legalName}
                  onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                  placeholder="Legal business name as per registration"
                />
              </div>
            </div>
          </TabsContent>

          {/* Custom Fields Tab */}
          <TabsContent value="custom" className="space-y-6">
            <div className="border rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Custom Fields
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Fill in values for custom fields defined in your CRM settings
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/settings/custom-fields">
                    Manage Fields
                  </Link>
                </Button>
              </div>

              {/* Loading state */}
              {customFieldsLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Loading custom fields...</span>
                </div>
              )}

              {/* Custom fields list */}
              {!customFieldsLoading && customFields.length > 0 && (
                <CustomFieldGroup
                  fields={customFields}
                  values={formData.customFields}
                  onChange={handleCustomFieldsChange}
                />
              )}

              {/* Empty state */}
              {!customFieldsLoading && customFields.length === 0 && (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">No custom fields defined</p>
                  <p className="text-xs mt-1 mb-4">
                    Create custom fields in settings to capture additional company information
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/settings/custom-fields">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Custom Fields
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href="/crm/companies">Cancel</Link>
        </Button>
        <Button onClick={handleCreate} disabled={createCompany.isPending}>
          {createCompany.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Company
        </Button>
      </div>
    </div>
  );
}
