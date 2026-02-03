'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Cake,
  Briefcase,
  Target,
  Globe,
  FileText,
  Shield,
  Phone,
  Smartphone,
  Home,
  Printer,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  MapPin,
  Copy,
  CheckCircle2,
  BellOff,
  MailX,
  MessageSquare,
  PhoneOff,
  Calendar,
  Loader2,
  Save,
  Plus,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useCreateContact } from '@/hooks/use-contacts';
import { useCompanies } from '@/hooks/use-companies';
import { useCustomFields } from '@/hooks/use-custom-fields';
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
  { code: '28', name: 'Andhra Pradesh (Old)' },
  { code: '29', name: 'Karnataka' },
  { code: '30', name: 'Goa' },
  { code: '31', name: 'Lakshadweep' },
  { code: '32', name: 'Kerala' },
  { code: '33', name: 'Tamil Nadu' },
  { code: '34', name: 'Puducherry' },
  { code: '35', name: 'Andaman & Nicobar Islands' },
  { code: '36', name: 'Telangana' },
  { code: '37', name: 'Andhra Pradesh' },
  { code: '38', name: 'Ladakh' },
];

const CONTACT_SOURCES = [
  { value: 'WEBSITE', label: 'Website' },
  { value: 'REFERRAL', label: 'Referral' },
  { value: 'SOCIAL_MEDIA', label: 'Social Media' },
  { value: 'LINKEDIN', label: 'LinkedIn' },
  { value: 'FACEBOOK', label: 'Facebook' },
  { value: 'INSTAGRAM', label: 'Instagram' },
  { value: 'TWITTER', label: 'Twitter' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'EMAIL_CAMPAIGN', label: 'Email Campaign' },
  { value: 'COLD_CALL', label: 'Cold Call' },
  { value: 'TRADE_SHOW', label: 'Trade Show' },
  { value: 'CONFERENCE', label: 'Conference' },
  { value: 'ADVERTISEMENT', label: 'Advertisement' },
  { value: 'GOOGLE_ADS', label: 'Google Ads' },
  { value: 'PARTNER', label: 'Partner' },
  { value: 'DIRECT', label: 'Direct' },
  { value: 'OTHER', label: 'Other' },
];

const CONTACT_STATUSES = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'BLOCKED', label: 'Blocked' },
];

const LIFECYCLE_STAGES = [
  { value: 'SUBSCRIBER', label: 'Subscriber' },
  { value: 'LEAD', label: 'Lead' },
  { value: 'MQL', label: 'Marketing Qualified Lead' },
  { value: 'SQL', label: 'Sales Qualified Lead' },
  { value: 'OPPORTUNITY', label: 'Opportunity' },
  { value: 'CUSTOMER', label: 'Customer' },
  { value: 'EVANGELIST', label: 'Evangelist' },
  { value: 'OTHER', label: 'Other' },
];

const LEAD_STATUSES = [
  { value: 'NEW', label: 'New' },
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'OPEN_DEAL', label: 'Open Deal' },
  { value: 'UNQUALIFIED', label: 'Unqualified' },
  { value: 'ATTEMPTED_TO_CONTACT', label: 'Attempted to Contact' },
  { value: 'CONNECTED', label: 'Connected' },
  { value: 'BAD_TIMING', label: 'Bad Timing' },
];

const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

const SALUTATIONS = [
  { value: 'Mr.', label: 'Mr.' },
  { value: 'Mrs.', label: 'Mrs.' },
  { value: 'Ms.', label: 'Ms.' },
  { value: 'Dr.', label: 'Dr.' },
  { value: 'Prof.', label: 'Prof.' },
];

const SUFFIXES = [
  { value: 'Jr.', label: 'Jr.' },
  { value: 'Sr.', label: 'Sr.' },
  { value: 'II', label: 'II' },
  { value: 'III', label: 'III' },
  { value: 'PhD', label: 'PhD' },
  { value: 'MD', label: 'MD' },
  { value: 'Esq.', label: 'Esq.' },
];

const PERSONA_TYPES = [
  { value: 'DECISION_MAKER', label: 'Decision Maker' },
  { value: 'INFLUENCER', label: 'Influencer' },
  { value: 'USER', label: 'User' },
  { value: 'GATEKEEPER', label: 'Gatekeeper' },
  { value: 'CHAMPION', label: 'Champion' },
];

const BUYING_ROLES = [
  { value: 'CHAMPION', label: 'Champion' },
  { value: 'BUDGET_HOLDER', label: 'Budget Holder' },
  { value: 'END_USER', label: 'End User' },
  { value: 'EVALUATOR', label: 'Evaluator' },
  { value: 'BLOCKER', label: 'Blocker' },
];

const LEAD_RATINGS = [
  { value: 'HOT', label: 'Hot', color: 'text-red-500', bgColor: 'bg-red-100' },
  { value: 'WARM', label: 'Warm', color: 'text-orange-500', bgColor: 'bg-orange-100' },
  { value: 'COLD', label: 'Cold', color: 'text-blue-500', bgColor: 'bg-blue-100' },
];

const LEAD_PRIORITIES = [
  { value: 'HIGH', label: 'High', color: 'text-red-600' },
  { value: 'MEDIUM', label: 'Medium', color: 'text-yellow-600' },
  { value: 'LOW', label: 'Low', color: 'text-green-600' },
];

const INDUSTRIES = [
  { value: 'TECHNOLOGY', label: 'Technology' },
  { value: 'HEALTHCARE', label: 'Healthcare' },
  { value: 'FINANCE', label: 'Finance & Banking' },
  { value: 'MANUFACTURING', label: 'Manufacturing' },
  { value: 'RETAIL', label: 'Retail & E-commerce' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'REAL_ESTATE', label: 'Real Estate' },
  { value: 'HOSPITALITY', label: 'Hospitality & Tourism' },
  { value: 'MEDIA', label: 'Media & Entertainment' },
  { value: 'TELECOMMUNICATIONS', label: 'Telecommunications' },
  { value: 'AUTOMOTIVE', label: 'Automotive' },
  { value: 'CONSTRUCTION', label: 'Construction' },
  { value: 'AGRICULTURE', label: 'Agriculture' },
  { value: 'ENERGY', label: 'Energy & Utilities' },
  { value: 'GOVERNMENT', label: 'Government' },
  { value: 'NONPROFIT', label: 'Non-Profit' },
  { value: 'CONSULTING', label: 'Consulting & Professional Services' },
  { value: 'LOGISTICS', label: 'Logistics & Transportation' },
  { value: 'OTHER', label: 'Other' },
];

const emptyContact = {
  // Basic Info
  salutation: '',
  firstName: '',
  middleName: '',
  lastName: '',
  suffix: '',
  preferredName: '',
  displayName: '',
  email: '',
  phone: '',
  additionalEmails: [],
  additionalPhones: [],
  dateOfBirth: '',
  gender: '',
  companyId: '',
  jobTitle: '',
  department: '',
  mobilePhone: '',
  homePhone: '',
  fax: '',
  // Lifecycle & Lead
  lifecycleStage: '',
  leadStatus: '',
  leadScore: 0,
  personaType: '',
  buyingRole: '',
  isQualified: false,
  qualifiedDate: '',
  disqualificationReason: '',
  // NEW: Rating & Priority
  rating: '',
  priority: '',
  likelihoodToClose: 0,
  expectedRevenue: '',
  // NEW: Engagement Tracking
  followUpDate: '',
  nextActivityDate: '',
  nextActivityType: '',
  // NEW: Attribution & Campaigns
  referredBy: '',
  campaign: '',
  territory: '',
  segment: '',
  // NEW: Target Account (ABM)
  isTargetAccount: false,
  // Social
  linkedinUrl: '',
  twitterUrl: '',
  facebookUrl: '',
  instagramUrl: '',
  marketingConsent: false,
  whatsappConsent: false,
  emailOptOut: false,
  smsOptOut: false,
  callOptOut: false,
  status: 'ACTIVE',
  source: '',
  sourceDetails: '',
  gstin: '',
  billingAddress: '',
  billingCity: '',
  billingState: '',
  billingStateCode: '',
  billingPincode: '',
  shippingAddress: '',
  shippingCity: '',
  shippingState: '',
  shippingStateCode: '',
  shippingPincode: '',
  customFields: {},
};

export default function NewContactPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState(emptyContact);
  const [activeTab, setActiveTab] = useState('basic');

  const { data: companiesData } = useCompanies({ limit: 100 });
  const companies = companiesData?.data || [];

  // Fetch global custom fields for contacts
  const { data: customFieldsData, isLoading: customFieldsLoading } = useCustomFields('CONTACT');
  const customFields = customFieldsData?.data || [];

  const createContact = useCreateContact();

  const copyBillingToShipping = () => {
    setFormData({
      ...formData,
      shippingAddress: formData.billingAddress,
      shippingCity: formData.billingCity,
      shippingState: formData.billingState,
      shippingStateCode: formData.billingStateCode,
      shippingPincode: formData.billingPincode,
    });
  };

  const handleBillingStateChange = (stateCode) => {
    const state = INDIAN_STATES.find(s => s.code === stateCode);
    setFormData({
      ...formData,
      billingStateCode: stateCode,
      billingState: state?.name || '',
    });
  };

  const handleShippingStateChange = (stateCode) => {
    const state = INDIAN_STATES.find(s => s.code === stateCode);
    setFormData({
      ...formData,
      shippingStateCode: stateCode,
      shippingState: state?.name || '',
    });
  };

  // Update custom field value
  const handleCustomFieldChange = (apiName, value) => {
    setFormData({
      ...formData,
      customFields: {
        ...formData.customFields,
        [apiName]: value,
      },
    });
  };

  // Render custom field input based on type
  const renderCustomFieldInput = (field) => {
    const value = formData.customFields[field.apiName] || '';
    const commonProps = {
      id: field.apiName,
      placeholder: field.placeholder || `Enter ${field.name.toLowerCase()}`,
    };

    switch (field.fieldType) {
      case 'TEXTAREA':
        return (
          <Textarea
            {...commonProps}
            value={value}
            onChange={(e) => handleCustomFieldChange(field.apiName, e.target.value)}
            rows={3}
          />
        );
      case 'NUMBER':
      case 'CURRENCY':
        return (
          <Input
            {...commonProps}
            type="number"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.apiName, e.target.value)}
          />
        );
      case 'DATE':
        return (
          <Input
            {...commonProps}
            type="date"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.apiName, e.target.value)}
          />
        );
      case 'DATETIME':
        return (
          <Input
            {...commonProps}
            type="datetime-local"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.apiName, e.target.value)}
          />
        );
      case 'EMAIL':
        return (
          <Input
            {...commonProps}
            type="email"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.apiName, e.target.value)}
          />
        );
      case 'PHONE':
        return (
          <Input
            {...commonProps}
            type="tel"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.apiName, e.target.value)}
          />
        );
      case 'URL':
        return (
          <Input
            {...commonProps}
            type="url"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.apiName, e.target.value)}
          />
        );
      case 'BOOLEAN':
        return (
          <Switch
            checked={value === true || value === 'true'}
            onCheckedChange={(checked) => handleCustomFieldChange(field.apiName, checked)}
          />
        );
      case 'SELECT':
        return (
          <Select
            value={value || 'none'}
            onValueChange={(v) => handleCustomFieldChange(field.apiName, v === 'none' ? '' : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || 'Select option'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select...</SelectItem>
              {(field.options || []).map((opt) => (
                <SelectItem key={opt.value || opt} value={opt.value || opt}>
                  {opt.label || opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'MULTISELECT':
        const selectedValues = Array.isArray(value) ? value : (value ? [value] : []);
        return (
          <div className="space-y-2">
            {(field.options || []).map((opt) => {
              const optValue = opt.value || opt;
              const optLabel = opt.label || opt;
              const isSelected = selectedValues.includes(optValue);
              return (
                <label key={optValue} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...selectedValues, optValue]
                        : selectedValues.filter((v) => v !== optValue);
                      handleCustomFieldChange(field.apiName, newValue);
                    }}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className="text-sm">{optLabel}</span>
                </label>
              );
            })}
          </div>
        );
      case 'TEXT':
      default:
        return (
          <Input
            {...commonProps}
            type="text"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.apiName, e.target.value)}
          />
        );
    }
  };

  const handleCreate = async () => {
    if (!formData.firstName || !formData.lastName) {
      toast({
        title: 'Validation Error',
        description: 'First name and last name are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      const result = await createContact.mutateAsync(formData);
      toast({
        title: 'Contact Created',
        description: 'The contact has been created successfully',
      });
      router.push(`/crm/contacts/${result.data.id}`);
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create contact',
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
            <Link href="/crm/contacts">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Add New Contact</h1>
            <p className="text-muted-foreground">Create a new contact in your CRM</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/crm/contacts">Cancel</Link>
          </Button>
          <Button onClick={handleCreate} disabled={createContact.isPending}>
            {createContact.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Contact
          </Button>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 mb-6">
            <TabsTrigger value="basic">
              <User className="h-4 w-4 mr-2" />
              Basic
            </TabsTrigger>
            <TabsTrigger value="personal">
              <Cake className="h-4 w-4 mr-2" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="work">
              <Briefcase className="h-4 w-4 mr-2" />
              Work
            </TabsTrigger>
            <TabsTrigger value="lead">
              <Target className="h-4 w-4 mr-2" />
              Lead
            </TabsTrigger>
            <TabsTrigger value="social">
              <Globe className="h-4 w-4 mr-2" />
              Social
            </TabsTrigger>
            <TabsTrigger value="billing">
              <FileText className="h-4 w-4 mr-2" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <Shield className="h-4 w-4 mr-2" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="custom">
              <Plus className="h-4 w-4 mr-2" />
              Custom
            </TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-6 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salutation">Salutation</Label>
                <Select
                  value={formData.salutation || 'none'}
                  onValueChange={(value) => setFormData({ ...formData, salutation: value === 'none' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="--" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">--</SelectItem>
                    {SALUTATIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  value={formData.middleName}
                  onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                  placeholder="M."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="suffix">Suffix</Label>
                <Select
                  value={formData.suffix || 'none'}
                  onValueChange={(value) => setFormData({ ...formData, suffix: value === 'none' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="--" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">--</SelectItem>
                    {SUFFIXES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="preferredName">Preferred Name / Nickname</Label>
                <Input
                  id="preferredName"
                  value={formData.preferredName}
                  onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
                  placeholder="How they like to be called (optional)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="How this contact should be displayed (optional)"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Primary Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Primary Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="source">Lead Source</Label>
                <Select
                  value={formData.source || 'none'}
                  onValueChange={(value) => setFormData({ ...formData, source: value === 'none' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Source</SelectItem>
                    {CONTACT_SOURCES.map((src) => (
                      <SelectItem key={src.value} value={src.value}>
                        {src.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTACT_STATUSES.map((st) => (
                      <SelectItem key={st.value} value={st.value}>
                        {st.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sourceDetails">Source Details</Label>
              <Textarea
                id="sourceDetails"
                value={formData.sourceDetails}
                onChange={(e) => setFormData({ ...formData, sourceDetails: e.target.value })}
                placeholder="Additional details about how this contact was acquired..."
                rows={3}
              />
            </div>
          </TabsContent>

          {/* Personal Info Tab */}
          <TabsContent value="personal" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender || 'none'}
                  onValueChange={(value) => setFormData({ ...formData, gender: value === 'none' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Not specified</SelectItem>
                    {GENDERS.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="border rounded-lg p-4 space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Additional Phone Numbers
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mobilePhone">Mobile Phone</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="mobilePhone"
                      value={formData.mobilePhone}
                      onChange={(e) => setFormData({ ...formData, mobilePhone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="homePhone">Home Phone</Label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="homePhone"
                      value={formData.homePhone}
                      onChange={(e) => setFormData({ ...formData, homePhone: e.target.value })}
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
            </div>
          </TabsContent>

          {/* Work Tab */}
          <TabsContent value="work" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="companyId">Company</Label>
              <Select
                value={formData.companyId || 'none'}
                onValueChange={(value) => setFormData({ ...formData, companyId: value === 'none' ? '' : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Company</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  placeholder="e.g., Marketing Manager, CEO, Developer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g., Sales, Engineering, Marketing"
                />
              </div>
            </div>
          </TabsContent>

          {/* Lead Qualification Tab */}
          <TabsContent value="lead" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
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
                    <SelectItem value="none">Not Set</SelectItem>
                    {LIFECYCLE_STAGES.map((stage) => (
                      <SelectItem key={stage.value} value={stage.value}>
                        {stage.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="leadStatus">Lead Status</Label>
                <Select
                  value={formData.leadStatus || 'none'}
                  onValueChange={(value) => setFormData({ ...formData, leadStatus: value === 'none' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Not Set</SelectItem>
                    {LEAD_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadScore">Lead Score (0-100)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="leadScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.leadScore}
                  onChange={(e) => setFormData({ ...formData, leadScore: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                  className="w-24"
                />
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all",
                      formData.leadScore >= 80 ? "bg-green-500" :
                      formData.leadScore >= 60 ? "bg-yellow-500" :
                      formData.leadScore >= 40 ? "bg-orange-500" : "bg-red-500"
                    )}
                    style={{ width: `${formData.leadScore}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">{formData.leadScore}%</span>
              </div>
            </div>

            {/* Rating & Priority */}
            <div className="border rounded-lg p-4 space-y-4">
              <h4 className="font-medium">Rating & Priority</h4>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="rating">Lead Rating</Label>
                  <Select
                    value={formData.rating || 'none'}
                    onValueChange={(value) => setFormData({ ...formData, rating: value === 'none' ? '' : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not Set</SelectItem>
                      {LEAD_RATINGS.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          <span className={r.color}>{r.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Hot, Warm, or Cold lead</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority || 'none'}
                    onValueChange={(value) => setFormData({ ...formData, priority: value === 'none' ? '' : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not Set</SelectItem>
                      {LEAD_PRIORITIES.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          <span className={p.color}>{p.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Sales urgency level</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="likelihoodToClose">Likelihood to Close (%)</Label>
                  <Input
                    id="likelihoodToClose"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.likelihoodToClose}
                    onChange={(e) => setFormData({ ...formData, likelihoodToClose: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                    placeholder="0-100"
                  />
                  <p className="text-xs text-muted-foreground">Win probability</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="expectedRevenue">Expected Revenue</Label>
                  <Input
                    id="expectedRevenue"
                    type="number"
                    value={formData.expectedRevenue}
                    onChange={(e) => setFormData({ ...formData, expectedRevenue: e.target.value })}
                    placeholder="Potential deal value"
                  />
                  <p className="text-xs text-muted-foreground">Estimated deal amount</p>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30 h-fit mt-7">
                  <div className="space-y-0.5">
                    <Label>Target Account (ABM)</Label>
                    <p className="text-xs text-muted-foreground">Mark as strategic account</p>
                  </div>
                  <Switch
                    checked={formData.isTargetAccount}
                    onCheckedChange={(checked) => setFormData({ ...formData, isTargetAccount: checked })}
                  />
                </div>
              </div>
            </div>

            {/* Follow-up & Engagement */}
            <div className="border rounded-lg p-4 space-y-4">
              <h4 className="font-medium">Follow-up & Engagement</h4>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="followUpDate">Follow-up Date</Label>
                  <Input
                    id="followUpDate"
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">When to follow up</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextActivityDate">Next Activity Date</Label>
                  <Input
                    id="nextActivityDate"
                    type="date"
                    value={formData.nextActivityDate}
                    onChange={(e) => setFormData({ ...formData, nextActivityDate: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">Scheduled activity</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextActivityType">Activity Type</Label>
                  <Select
                    value={formData.nextActivityType || 'none'}
                    onValueChange={(value) => setFormData({ ...formData, nextActivityType: value === 'none' ? '' : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not Set</SelectItem>
                      <SelectItem value="CALL">Call</SelectItem>
                      <SelectItem value="EMAIL">Email</SelectItem>
                      <SelectItem value="MEETING">Meeting</SelectItem>
                      <SelectItem value="DEMO">Demo</SelectItem>
                      <SelectItem value="TASK">Task</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Type of next activity</p>
                </div>
              </div>
            </div>

            {/* Attribution & Territory */}
            <div className="border rounded-lg p-4 space-y-4">
              <h4 className="font-medium">Attribution & Territory</h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="referredBy">Referred By</Label>
                  <Input
                    id="referredBy"
                    value={formData.referredBy}
                    onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                    placeholder="Referral contact or partner"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign">Campaign</Label>
                  <Input
                    id="campaign"
                    value={formData.campaign}
                    onChange={(e) => setFormData({ ...formData, campaign: e.target.value })}
                    placeholder="Marketing campaign name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="territory">Territory</Label>
                  <Input
                    id="territory"
                    value={formData.territory}
                    onChange={(e) => setFormData({ ...formData, territory: e.target.value })}
                    placeholder="Geographic territory"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="segment">Market Segment</Label>
                  <Input
                    id="segment"
                    value={formData.segment}
                    onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                    placeholder="e.g., Enterprise, SMB, Startup"
                  />
                </div>
              </div>
            </div>

            {/* Persona & Buying Role */}
            <div className="border rounded-lg p-4 space-y-4">
              <h4 className="font-medium">Buying Committee Role</h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="personaType">Persona Type</Label>
                  <Select
                    value={formData.personaType || 'none'}
                    onValueChange={(value) => setFormData({ ...formData, personaType: value === 'none' ? '' : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select persona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not Set</SelectItem>
                      {PERSONA_TYPES.map((p) => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Who they are in the buying process</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyingRole">Buying Role</Label>
                  <Select
                    value={formData.buyingRole || 'none'}
                    onValueChange={(value) => setFormData({ ...formData, buyingRole: value === 'none' ? '' : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not Set</SelectItem>
                      {BUYING_ROLES.map((r) => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Their influence on the deal</p>
                </div>
              </div>
            </div>

            {/* Qualification Status */}
            <div className="border rounded-lg p-4 space-y-4">
              <h4 className="font-medium">Qualification Status</h4>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <div className="space-y-0.5">
                  <Label>Is Qualified</Label>
                  <p className="text-xs text-muted-foreground">Mark this lead as qualified for sales</p>
                </div>
                <Switch
                  checked={formData.isQualified}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    isQualified: checked,
                    qualifiedDate: checked ? new Date().toISOString().split('T')[0] : ''
                  })}
                />
              </div>
              {formData.isQualified && (
                <div className="space-y-2">
                  <Label htmlFor="qualifiedDate">Qualified Date</Label>
                  <Input
                    id="qualifiedDate"
                    type="date"
                    value={formData.qualifiedDate}
                    onChange={(e) => setFormData({ ...formData, qualifiedDate: e.target.value })}
                  />
                </div>
              )}
              {!formData.isQualified && formData.leadStatus === 'UNQUALIFIED' && (
                <div className="space-y-2">
                  <Label htmlFor="disqualificationReason">Disqualification Reason</Label>
                  <Textarea
                    id="disqualificationReason"
                    value={formData.disqualificationReason}
                    onChange={(e) => setFormData({ ...formData, disqualificationReason: e.target.value })}
                    placeholder="Why was this lead disqualified?"
                    rows={3}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          {/* Social Tab */}
          <TabsContent value="social" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0A66C2]" />
                  <Input
                    id="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
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
                    placeholder="https://twitter.com/username"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebookUrl">Facebook Profile</Label>
                <div className="relative">
                  <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1877F2]" />
                  <Input
                    id="facebookUrl"
                    value={formData.facebookUrl}
                    onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                    placeholder="https://facebook.com/username"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagramUrl">Instagram Profile</Label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#E4405F]" />
                  <Input
                    id="instagramUrl"
                    value={formData.instagramUrl}
                    onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                    placeholder="https://instagram.com/username"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="gstin">GSTIN (for B2B)</Label>
              <Input
                id="gstin"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                placeholder="22AAAAA0000A1Z5"
                maxLength={15}
              />
            </div>

            <div className="border rounded-lg p-4 space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Billing Address
              </h4>
              <div className="space-y-2">
                <Label htmlFor="billingAddress">Street Address</Label>
                <Textarea
                  id="billingAddress"
                  value={formData.billingAddress}
                  onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                  placeholder="Enter complete street address"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="billingCity">City</Label>
                  <Input
                    id="billingCity"
                    value={formData.billingCity}
                    onChange={(e) => setFormData({ ...formData, billingCity: e.target.value })}
                    placeholder="Mumbai"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingState">State</Label>
                  <Select
                    value={formData.billingStateCode || 'none'}
                    onValueChange={(value) => value !== 'none' && handleBillingStateChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Select state</SelectItem>
                      {INDIAN_STATES.map((state) => (
                        <SelectItem key={state.code} value={state.code}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingPincode">Pincode</Label>
                <Input
                  id="billingPincode"
                  value={formData.billingPincode}
                  onChange={(e) => setFormData({ ...formData, billingPincode: e.target.value })}
                  placeholder="400001"
                  maxLength={6}
                />
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Shipping Address
                </h4>
                <Button type="button" variant="outline" size="sm" onClick={copyBillingToShipping}>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy from Billing
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shippingAddress">Street Address</Label>
                <Textarea
                  id="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  placeholder="Enter complete street address"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingCity">City</Label>
                  <Input
                    id="shippingCity"
                    value={formData.shippingCity}
                    onChange={(e) => setFormData({ ...formData, shippingCity: e.target.value })}
                    placeholder="Mumbai"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingState">State</Label>
                  <Select
                    value={formData.shippingStateCode || 'none'}
                    onValueChange={(value) => value !== 'none' && handleShippingStateChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Select state</SelectItem>
                      {INDIAN_STATES.map((state) => (
                        <SelectItem key={state.code} value={state.code}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shippingPincode">Pincode</Label>
                <Input
                  id="shippingPincode"
                  value={formData.shippingPincode}
                  onChange={(e) => setFormData({ ...formData, shippingPincode: e.target.value })}
                  placeholder="400001"
                  maxLength={6}
                />
              </div>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="border rounded-lg p-4 space-y-4">
              <h4 className="font-medium flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                Consent Settings
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50/50">
                  <div className="space-y-0.5">
                    <Label>Marketing Consent</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow sending marketing emails and promotional content
                    </p>
                  </div>
                  <Switch
                    checked={formData.marketingConsent}
                    onCheckedChange={(checked) => setFormData({ ...formData, marketingConsent: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50/50">
                  <div className="space-y-0.5">
                    <Label>WhatsApp Consent</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow sending messages via WhatsApp Business
                    </p>
                  </div>
                  <Switch
                    checked={formData.whatsappConsent}
                    onCheckedChange={(checked) => setFormData({ ...formData, whatsappConsent: checked })}
                  />
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-4">
              <h4 className="font-medium flex items-center gap-2 text-red-700">
                <BellOff className="h-4 w-4" />
                Opt-Out Preferences
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50/50">
                  <div className="flex items-center gap-2">
                    <MailX className="h-4 w-4 text-red-600" />
                    <div className="space-y-0.5">
                      <Label>Email Opt-Out</Label>
                      <p className="text-xs text-muted-foreground">
                        Do not send any emails to this contact
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.emailOptOut}
                    onCheckedChange={(checked) => setFormData({ ...formData, emailOptOut: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50/50">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-red-600" />
                    <div className="space-y-0.5">
                      <Label>SMS Opt-Out</Label>
                      <p className="text-xs text-muted-foreground">
                        Do not send SMS messages to this contact
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.smsOptOut}
                    onCheckedChange={(checked) => setFormData({ ...formData, smsOptOut: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50/50">
                  <div className="flex items-center gap-2">
                    <PhoneOff className="h-4 w-4 text-red-600" />
                    <div className="space-y-0.5">
                      <Label>Call Opt-Out</Label>
                      <p className="text-xs text-muted-foreground">
                        Do not make calls to this contact
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.callOptOut}
                    onCheckedChange={(checked) => setFormData({ ...formData, callOptOut: checked })}
                  />
                </div>
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
                <div className="space-y-4">
                  {customFields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={field.apiName}>
                          {field.name}
                          {field.isRequired && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        {field.description && (
                          <span className="text-xs text-muted-foreground">
                            ({field.description})
                          </span>
                        )}
                      </div>
                      {field.fieldType === 'BOOLEAN' ? (
                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
                          {renderCustomFieldInput(field)}
                          <span className="text-sm text-muted-foreground">
                            {formData.customFields[field.apiName] ? 'Yes' : 'No'}
                          </span>
                        </div>
                      ) : (
                        renderCustomFieldInput(field)
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!customFieldsLoading && customFields.length === 0 && (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">No custom fields defined</p>
                  <p className="text-xs mt-1 mb-4">
                    Create custom fields in settings to capture additional contact information
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
          <Link href="/crm/contacts">Cancel</Link>
        </Button>
        <Button onClick={handleCreate} disabled={createContact.isPending}>
          {createContact.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Contact
        </Button>
      </div>
    </div>
  );
}
