'use client';

import { useState, useEffect, useRef } from 'react';
import {
  FileSignature,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  Save,
  X,
  Star,
  StarOff,
  MoreVertical,
  Loader2,
  AlertCircle,
  Mail,
  MessageSquare,
  Eye,
  EyeOff,
  Image,
  Link,
  Type,
  Upload,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Phone,
  MapPin,
  ExternalLink,
  Info,
  Smartphone,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Signature types with channel compatibility
const SIGNATURE_TYPES = [
  {
    id: 'text',
    name: 'Text Only',
    description: 'Simple text signature',
    icon: Type,
    channels: ['email', 'whatsapp', 'sms'],
  },
  {
    id: 'with_links',
    name: 'With Links',
    description: 'Text with clickable links',
    icon: Link,
    channels: ['email', 'whatsapp', 'sms'],
  },
  {
    id: 'with_logo',
    name: 'With Logo',
    description: 'Rich signature with logo image',
    icon: Image,
    channels: ['email'], // Logo only available in email
  },
];

// Social/Link types
const LINK_TYPES = [
  { id: 'website', label: 'Website', icon: Globe, placeholder: 'https://yourcompany.com' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/yourprofile' },
  { id: 'twitter', label: 'Twitter/X', icon: Twitter, placeholder: 'https://twitter.com/yourhandle' },
  { id: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/yourpage' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/yourhandle' },
  { id: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/@yourchannel' },
];

// Query keys
const signatureKeys = {
  all: ['signatures'],
  list: () => [...signatureKeys.all, 'list'],
  detail: (id) => [...signatureKeys.all, 'detail', id],
};

// Fetch signatures
function useSignatures() {
  return useQuery({
    queryKey: signatureKeys.list(),
    queryFn: async () => {
      const response = await api.get('/settings/signatures');
      return response.data || [];
    },
  });
}

// Create signature
function useCreateSignature() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/settings/signatures', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: signatureKeys.list() });
      toast({ title: 'Success', description: 'Signature created successfully' });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create signature',
        variant: 'destructive',
      });
    },
  });
}

// Update signature
function useUpdateSignature() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.patch(`/settings/signatures/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: signatureKeys.list() });
      toast({ title: 'Success', description: 'Signature updated successfully' });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update signature',
        variant: 'destructive',
      });
    },
  });
}

// Delete signature
function useDeleteSignature() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/settings/signatures/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: signatureKeys.list() });
      toast({ title: 'Success', description: 'Signature deleted successfully' });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete signature',
        variant: 'destructive',
      });
    },
  });
}

// Set default signature
function useSetDefaultSignature() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, channel }) => {
      const response = await api.patch(`/settings/signatures/${id}/default`, { channel });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: signatureKeys.list() });
      toast({ title: 'Success', description: 'Default signature updated' });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to set default signature',
        variant: 'destructive',
      });
    },
  });
}

// Channel compatibility badge
function ChannelBadge({ channel, available }) {
  const icons = {
    email: Mail,
    whatsapp: MessageSquare,
    sms: Smartphone,
  };
  const Icon = icons[channel];
  const labels = { email: 'Email', whatsapp: 'WhatsApp', sms: 'SMS' };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-md text-xs',
              available
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-gray-50 text-gray-400 border border-gray-200'
            )}
          >
            <Icon className="h-3 w-3" />
            {labels[channel]}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {available ? `Available in ${labels[channel]}` : `Not available in ${labels[channel]}`}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Signature editor dialog
function SignatureDialog({ open, onOpenChange, signature, mode = 'create' }) {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [signatureType, setSignatureType] = useState('text');
  const [isActive, setIsActive] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  // Logo state
  const [logoUrl, setLogoUrl] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const fileInputRef = useRef(null);

  // Links state
  const [links, setLinks] = useState({
    website: '',
    linkedin: '',
    twitter: '',
    facebook: '',
    instagram: '',
    youtube: '',
  });

  const createSignature = useCreateSignature();
  const updateSignature = useUpdateSignature();

  const isLoading = createSignature.isPending || updateSignature.isPending;

  // Get current signature type config
  const currentTypeConfig = SIGNATURE_TYPES.find(t => t.id === signatureType);
  const availableChannels = currentTypeConfig?.channels || [];

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && signature) {
        setName(signature.name);
        setContent(signature.content);
        setSignatureType(signature.signatureType || 'text');
        setIsActive(signature.isActive);
        setLogoUrl(signature.logoUrl || '');
        setLogoPreview(signature.logoUrl || '');
        setLinks(signature.links || {
          website: '',
          linkedin: '',
          twitter: '',
          facebook: '',
          instagram: '',
          youtube: '',
        });
      } else {
        setName('');
        setContent('');
        setSignatureType('text');
        setIsActive(true);
        setLogoUrl('');
        setLogoPreview('');
        setLogoFile(null);
        setLinks({
          website: '',
          linkedin: '',
          twitter: '',
          facebook: '',
          instagram: '',
          youtube: '',
        });
      }
      setShowPreview(false);
    }
  }, [open, mode, signature]);

  // Handle logo file selection
  const handleLogoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    setLogoUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLinkChange = (linkId, value) => {
    setLinks(prev => ({ ...prev, [linkId]: value }));
  };

  const handleSave = () => {
    // Determine channel based on signature type
    let channel = 'all';
    if (signatureType === 'with_logo') {
      channel = 'email'; // Logo signatures are email only
    }

    const data = {
      name,
      content,
      channel,
      signatureType,
      isActive,
      logoUrl: logoPreview || logoUrl,
      links: Object.fromEntries(
        Object.entries(links).filter(([_, value]) => value.trim())
      ),
    };

    if (mode === 'edit') {
      updateSignature.mutate(
        { id: signature.id, data },
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      createSignature.mutate(data, { onSuccess: () => onOpenChange(false) });
    }
  };

  // Available variables
  const variables = [
    { name: '{{name}}', description: 'Your full name' },
    { name: '{{firstName}}', description: 'Your first name' },
    { name: '{{email}}', description: 'Your email address' },
    { name: '{{phone}}', description: 'Your phone number' },
    { name: '{{title}}', description: 'Your job title' },
    { name: '{{company}}', description: 'Company name' },
  ];

  const insertVariable = (variable) => {
    setContent((prev) => prev + variable);
  };

  // Preview with replaced variables (mock data)
  const previewContent = content
    .replace(/\{\{name\}\}/g, 'John Doe')
    .replace(/\{\{firstName\}\}/g, 'John')
    .replace(/\{\{email\}\}/g, 'john.doe@company.com')
    .replace(/\{\{phone\}\}/g, '+91 98765 43210')
    .replace(/\{\{title\}\}/g, 'Sales Manager')
    .replace(/\{\{company\}\}/g, 'Acme Corp');

  // Get active links for preview
  const activeLinks = Object.entries(links).filter(([_, value]) => value.trim());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Edit Signature' : 'Create Signature'}</DialogTitle>
          <DialogDescription>
            Create a signature to use in your emails and messages.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Signature Name */}
          <div className="space-y-2">
            <Label>Signature Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Professional, Casual, With Branding"
            />
          </div>

          {/* Signature Type Selection */}
          <div className="space-y-3">
            <Label>Signature Type</Label>
            <div className="grid grid-cols-3 gap-3">
              {SIGNATURE_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSignatureType(type.id)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                      signatureType === type.id
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-muted-foreground/30'
                    )}
                  >
                    <Icon className={cn(
                      'h-6 w-6',
                      signatureType === type.id ? 'text-primary' : 'text-muted-foreground'
                    )} />
                    <span className="text-sm font-medium">{type.name}</span>
                    <span className="text-xs text-muted-foreground text-center">{type.description}</span>
                  </button>
                );
              })}
            </div>

            {/* Channel Compatibility */}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-muted-foreground">Available in:</span>
              <div className="flex gap-1.5">
                <ChannelBadge channel="email" available={availableChannels.includes('email')} />
                <ChannelBadge channel="whatsapp" available={availableChannels.includes('whatsapp')} />
                <ChannelBadge channel="sms" available={availableChannels.includes('sms')} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Logo Upload (only for with_logo type) */}
          {signatureType === 'with_logo' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Logo Image</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Upload your company logo (PNG, JPG, max 2MB)
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  <Mail className="h-3 w-3 mr-1" />
                  Email Only
                </Badge>
              </div>

              <div className="flex items-start gap-4">
                {logoPreview ? (
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-lg border bg-white flex items-center justify-center overflow-hidden">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-1 hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Upload</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif"
                  onChange={handleLogoSelect}
                  className="hidden"
                />

                <div className="flex-1 space-y-2">
                  <Label className="text-xs">Or enter logo URL</Label>
                  <Input
                    value={logoUrl}
                    onChange={(e) => {
                      setLogoUrl(e.target.value);
                      setLogoPreview(e.target.value);
                    }}
                    placeholder="https://example.com/logo.png"
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Links Section (for with_links and with_logo types) */}
          {(signatureType === 'with_links' || signatureType === 'with_logo') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Links & Social Media</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Add links to include in your signature
                  </p>
                </div>
                {signatureType === 'with_links' && (
                  <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                    <Check className="h-3 w-3 mr-1" />
                    All Channels
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {LINK_TYPES.map((linkType) => {
                  const Icon = linkType.icon;
                  return (
                    <div key={linkType.id} className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        value={links[linkType.id] || ''}
                        onChange={(e) => handleLinkChange(linkType.id, e.target.value)}
                        placeholder={linkType.placeholder}
                        className="text-sm"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <Separator />

          {/* Signature Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Signature Text</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Edit
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </>
                )}
              </Button>
            </div>

            {showPreview ? (
              <div className="min-h-[150px] p-4 rounded-md border bg-white">
                {/* Logo in preview */}
                {signatureType === 'with_logo' && logoPreview && (
                  <div className="mb-3">
                    <img
                      src={logoPreview}
                      alt="Logo"
                      className="h-12 object-contain"
                    />
                  </div>
                )}

                {/* Text content */}
                <div className="whitespace-pre-wrap text-sm">
                  {previewContent || (
                    <span className="text-muted-foreground italic">No content yet</span>
                  )}
                </div>

                {/* Links in preview */}
                {activeLinks.length > 0 && (
                  <div className="mt-3 pt-3 border-t flex flex-wrap gap-3">
                    {activeLinks.map(([key, value]) => {
                      const linkType = LINK_TYPES.find(l => l.id === key);
                      const Icon = linkType?.icon || Globe;
                      return (
                        <a
                          key={key}
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {linkType?.label || key}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`Best regards,
{{name}}
{{title}} | {{company}}
{{email}} | {{phone}}`}
                className="min-h-[120px] font-mono text-sm"
              />
            )}
          </div>

          {/* Variables */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Insert Variables</Label>
            <div className="flex flex-wrap gap-1.5">
              {variables.map((v) => (
                <TooltipProvider key={v.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs font-mono"
                        onClick={() => insertVariable(v.name)}
                      >
                        {v.name}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{v.description}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>

          <Separator />

          {/* Active Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Active</p>
              <p className="text-xs text-muted-foreground">Enable this signature for use</p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !name.trim() || !content.trim()}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'edit' ? 'Save Changes' : 'Create Signature'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Signature card component
function SignatureCard({ signature, onEdit, onDelete, onSetDefault }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(signature.content);
    setCopied(true);
    toast({ title: 'Copied', description: 'Signature copied to clipboard' });
    setTimeout(() => setCopied(false), 2000);
  };

  const channelIcons = {
    all: null,
    email: Mail,
    whatsapp: MessageSquare,
  };

  const ChannelIcon = channelIcons[signature.channel];

  // Get signature type config
  const typeConfig = SIGNATURE_TYPES.find(t => t.id === signature.signatureType) || SIGNATURE_TYPES[0];
  const TypeIcon = typeConfig.icon;

  // Get links
  const signatureLinks = signature.links || {};
  const activeLinks = Object.entries(signatureLinks).filter(([_, value]) => value);

  return (
    <Card className={cn(!signature.isActive && 'opacity-60')}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{signature.name}</CardTitle>
            {signature.isDefault && (
              <Badge variant="secondary" className="h-5">
                <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                Default
              </Badge>
            )}
            {!signature.isActive && <Badge variant="outline">Inactive</Badge>}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(signature)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </DropdownMenuItem>
              {!signature.isDefault && (
                <DropdownMenuItem onClick={() => onSetDefault(signature)}>
                  <Star className="h-4 w-4 mr-2" />
                  Set as Default
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(signature)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <TypeIcon className="h-3.5 w-3.5" />
            <span>{typeConfig.name}</span>
          </div>
          <span className="text-muted-foreground/50">•</span>
          <div className="flex items-center gap-1.5">
            {ChannelIcon && <ChannelIcon className="h-3.5 w-3.5" />}
            {signature.channel === 'all'
              ? 'All channels'
              : signature.channel === 'email'
                ? 'Email only'
                : 'WhatsApp only'}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Logo preview */}
        {signature.signatureType === 'with_logo' && signature.logoUrl && (
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded border bg-white flex items-center justify-center overflow-hidden">
              <img
                src={signature.logoUrl}
                alt="Logo"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <span className="text-xs text-muted-foreground">Logo attached</span>
          </div>
        )}

        {/* Signature content */}
        <div className="p-3 rounded-md bg-muted/50 text-sm whitespace-pre-wrap max-h-32 overflow-hidden text-muted-foreground">
          {signature.content}
        </div>

        {/* Links preview */}
        {activeLinks.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeLinks.slice(0, 4).map(([key, value]) => {
              const linkType = LINK_TYPES.find(l => l.id === key);
              const Icon = linkType?.icon || Globe;
              return (
                <TooltipProvider key={key}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-7 w-7 rounded-md bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
                      >
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>{linkType?.label || key}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
            {activeLinks.length > 4 && (
              <div className="h-7 px-2 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
                +{activeLinks.length - 4} more
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function SignaturesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedSignature, setSelectedSignature] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [signatureToDelete, setSignatureToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const { data: signatures = [], isLoading, isError } = useSignatures();
  const deleteSignature = useDeleteSignature();
  const setDefaultSignature = useSetDefaultSignature();

  const handleCreate = () => {
    setDialogMode('create');
    setSelectedSignature(null);
    setDialogOpen(true);
  };

  const handleEdit = (signature) => {
    setDialogMode('edit');
    setSelectedSignature(signature);
    setDialogOpen(true);
  };

  const handleDelete = (signature) => {
    setSignatureToDelete(signature);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (signatureToDelete) {
      deleteSignature.mutate(signatureToDelete.id);
    }
    setDeleteDialogOpen(false);
    setSignatureToDelete(null);
  };

  const handleSetDefault = (signature) => {
    setDefaultSignature.mutate({ id: signature.id, channel: signature.channel });
  };

  // Filter signatures by channel and type compatibility
  const filteredSignatures = signatures.filter((sig) => {
    if (activeTab === 'all') return true;

    // Check channel match
    if (sig.channel === activeTab) return true;
    if (sig.channel === 'all') {
      // For 'all' channel signatures, check type compatibility
      const typeConfig = SIGNATURE_TYPES.find(t => t.id === sig.signatureType);
      return typeConfig?.channels.includes(activeTab);
    }
    return false;
  });

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Signatures</h1>
          <p className="text-muted-foreground">
            Create and manage your email and message signatures
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Signature
        </Button>
      </div>

      {/* Channel Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            All
            <Badge variant="secondary" className="h-5 px-1.5">
              {signatures.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="sms" className="gap-2">
            <Smartphone className="h-4 w-4" />
            SMS
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p>Failed to load signatures</p>
            </div>
          ) : filteredSignatures.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-48 text-center">
                <FileSignature className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium">No Signatures Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first signature to use in emails and messages
                </p>
                <Button onClick={handleCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Signature
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredSignatures.map((signature) => (
                <SignatureCard
                  key={signature.id}
                  signature={signature}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onSetDefault={handleSetDefault}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            Signature Types & Channel Compatibility
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-3 rounded-lg bg-muted/50 space-y-2">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">Text Only</span>
              </div>
              <p className="text-xs">Simple text signature. Works on all channels: Email, WhatsApp, and SMS.</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 space-y-2">
              <div className="flex items-center gap-2">
                <Link className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">With Links</span>
              </div>
              <p className="text-xs">Text with clickable social/website links. Works on all channels.</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 space-y-2">
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">With Logo</span>
              </div>
              <p className="text-xs">Rich signature with company logo. <strong>Email only</strong> - logos don't work in WhatsApp/SMS.</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <p>
              <strong>Variables:</strong> Use {`{{name}}`}, {`{{company}}`}, {`{{phone}}`}, etc. to automatically insert your details.
            </p>
            <p>
              <strong>Tip:</strong> Create separate signatures for formal emails (with logo) and quick WhatsApp replies (text only).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Signature Editor Dialog */}
      <SignatureDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        signature={selectedSignature}
        mode={dialogMode}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Signature</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{signatureToDelete?.name}"? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
