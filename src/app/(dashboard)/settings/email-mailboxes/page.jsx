'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Mail,
  Plus,
  Loader2,
  MoreHorizontal,
  Trash2,
  Settings,
  Shield,
  Forward,
  Clock,
  Copy,
  Check,
  Eye,
  EyeOff,
  Key,
  ArrowRightLeft,
  Inbox,
  Globe,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useEmailDomains } from '@/hooks/use-email-domains';
import {
  useEmailMailboxes,
  useCreateMailbox,
  useUpdateMailbox,
  useDeleteMailbox,
  useSetCatchAll,
  useGenerateCredentials,
  useUpdateAutoResponder,
  useUpdateForwarding,
  useEmailAliases,
  useCreateAlias,
  useDeleteAlias,
  useEmailForwarders,
  useCreateForwarder,
  useDeleteForwarder,
} from '@/hooks/use-email-mailboxes';
import { useAuth } from '@/contexts/auth-context';

function MailboxStatusBadge({ status }) {
  const config = {
    ACTIVE: { color: 'bg-green-100 text-green-700', label: 'Active' },
    SUSPENDED: { color: 'bg-yellow-100 text-yellow-700', label: 'Suspended' },
    DISABLED: { color: 'bg-gray-100 text-gray-700', label: 'Disabled' },
  };
  const { color, label } = config[status] || config.ACTIVE;
  return <Badge className={cn('font-medium', color)}>{label}</Badge>;
}

function CopyButton({ value, className }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="ghost" size="icon" className={cn('h-8 w-8', className)} onClick={handleCopy}>
      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}

function CreateMailboxDialog({ isOpen, onClose, domains, onSuccess }) {
  const [formData, setFormData] = useState({
    domainId: '',
    localPart: '',
    displayName: '',
    password: '',
    quotaGB: 5,
  });
  const [showPassword, setShowPassword] = useState(false);
  const createMailbox = useCreateMailbox();
  const { toast } = useToast();

  const selectedDomain = domains.find((d) => d.id === formData.domainId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.domainId || !formData.localPart) {
      toast({
        title: 'Error',
        description: 'Domain and local part are required',
        variant: 'destructive',
      });
      return;
    }
    try {
      await createMailbox.mutateAsync(formData);
      toast({ title: 'Success', description: 'Mailbox created successfully' });
      onSuccess?.();
      handleClose();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create mailbox',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    setFormData({ domainId: '', localPart: '', displayName: '', password: '', quotaGB: 5 });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Create Mailbox
          </DialogTitle>
          <DialogDescription>Create a new email mailbox on your verified domain.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Domain</Label>
            <Select
              value={formData.domainId}
              onValueChange={(v) => setFormData({ ...formData, domainId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select domain..." />
              </SelectTrigger>
              <SelectContent>
                {domains
                  .filter((d) => d.status === 'VERIFIED')
                  .map((domain) => (
                    <SelectItem key={domain.id} value={domain.id}>
                      {domain.domain}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Email Address</Label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="username"
                value={formData.localPart}
                onChange={(e) => setFormData({ ...formData, localPart: e.target.value })}
                className="flex-1"
              />
              <span className="text-muted-foreground">@</span>
              <span className="text-muted-foreground">
                {selectedDomain?.domain || 'domain.com'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Display Name (Optional)</Label>
            <Input
              placeholder="John Doe"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Password (Optional)</Label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="IMAP/SMTP password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Password for accessing via IMAP/SMTP. You can generate one later.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Storage Quota (GB)</Label>
            <Select
              value={formData.quotaGB.toString()}
              onValueChange={(v) => setFormData({ ...formData, quotaGB: parseInt(v) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 GB</SelectItem>
                <SelectItem value="5">5 GB</SelectItem>
                <SelectItem value="10">10 GB</SelectItem>
                <SelectItem value="25">25 GB</SelectItem>
                <SelectItem value="50">50 GB</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={createMailbox.isPending} className="flex-1">
              {createMailbox.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Mailbox
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CredentialsDialog({ isOpen, onClose, mailbox }) {
  const [credentials, setCredentials] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const generateCredentials = useGenerateCredentials();
  const { toast } = useToast();

  const handleGenerate = async () => {
    try {
      const result = await generateCredentials.mutateAsync(mailbox.id);
      setCredentials(result);
      toast({ title: 'Success', description: 'New credentials generated' });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to generate credentials',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    setCredentials(null);
    setShowPassword(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Email Credentials
          </DialogTitle>
          <DialogDescription>IMAP/SMTP credentials for {mailbox?.email}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!credentials ? (
            <div className="text-center py-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Key className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-muted-foreground mb-4">
                Generate new IMAP/SMTP credentials for this mailbox.
                <br />
                <span className="text-orange-600 text-sm">
                  Warning: This will invalidate the previous password.
                </span>
              </p>
              <Button onClick={handleGenerate} disabled={generateCredentials.isPending}>
                {generateCredentials.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Generate Credentials
              </Button>
            </div>
          ) : (
            <>
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  Credentials generated! Save the password now - it cannot be retrieved again.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div className="p-3 rounded-lg border bg-card">
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <div className="flex items-center justify-between">
                    <code className="text-sm">{credentials.email}</code>
                    <CopyButton value={credentials.email} />
                  </div>
                </div>

                <div className="p-3 rounded-lg border bg-card">
                  <Label className="text-xs text-muted-foreground">Password</Label>
                  <div className="flex items-center justify-between">
                    <code className="text-sm">
                      {showPassword ? credentials.password : '••••••••••••••••'}
                    </code>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <CopyButton value={credentials.password} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border bg-card">
                    <Label className="text-xs text-muted-foreground">IMAP Server</Label>
                    <div className="flex items-center justify-between">
                      <code className="text-xs">
                        {credentials.imap?.host}:{credentials.imap?.port}
                      </code>
                      <CopyButton value={credentials.imap?.host} />
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border bg-card">
                    <Label className="text-xs text-muted-foreground">SMTP Server</Label>
                    <div className="flex items-center justify-between">
                      <code className="text-xs">
                        {credentials.smtp?.host}:{credentials.smtp?.port}
                      </code>
                      <CopyButton value={credentials.smtp?.host} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AutoResponderDialog({ isOpen, onClose, mailbox, onSuccess }) {
  const [formData, setFormData] = useState({
    enabled: mailbox?.autoResponder?.enabled || false,
    subject: mailbox?.autoResponder?.subject || '',
    message: mailbox?.autoResponder?.message || '',
    startAt: mailbox?.autoResponder?.startAt || '',
    endAt: mailbox?.autoResponder?.endAt || '',
  });
  const updateAutoResponder = useUpdateAutoResponder();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAutoResponder.mutateAsync({ mailboxId: mailbox.id, ...formData });
      toast({ title: 'Success', description: 'Auto-responder updated' });
      onSuccess?.();
      onClose();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to update',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Auto-Responder
          </DialogTitle>
          <DialogDescription>Set up an automatic reply for {mailbox?.email}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Enable Auto-Responder</Label>
            <Switch
              checked={formData.enabled}
              onCheckedChange={(v) => setFormData({ ...formData, enabled: v })}
            />
          </div>

          {formData.enabled && (
            <>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                  placeholder="Out of Office"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  placeholder="I am currently out of office..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Start Date (Optional)</Label>
                  <Input
                    type="datetime-local"
                    value={formData.startAt}
                    onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date (Optional)</Label>
                  <Input
                    type="datetime-local"
                    value={formData.endAt}
                    onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={updateAutoResponder.isPending} className="flex-1">
              {updateAutoResponder.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ForwardingDialog({ isOpen, onClose, mailbox, onSuccess }) {
  const [formData, setFormData] = useState({
    enabled: mailbox?.forwarding?.enabled || false,
    address: mailbox?.forwarding?.address || '',
    keepCopy: mailbox?.forwarding?.keepCopy || false,
  });
  const updateForwarding = useUpdateForwarding();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateForwarding.mutateAsync({ mailboxId: mailbox.id, ...formData });
      toast({ title: 'Success', description: 'Forwarding settings updated' });
      onSuccess?.();
      onClose();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to update',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Forward className="h-5 w-5" />
            Email Forwarding
          </DialogTitle>
          <DialogDescription>Forward emails from {mailbox?.email}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Enable Forwarding</Label>
            <Switch
              checked={formData.enabled}
              onCheckedChange={(v) => setFormData({ ...formData, enabled: v })}
            />
          </div>

          {formData.enabled && (
            <>
              <div className="space-y-2">
                <Label>Forward To</Label>
                <Input
                  type="email"
                  placeholder="external@email.com"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Keep Copy</Label>
                  <p className="text-xs text-muted-foreground">
                    Keep a copy of forwarded emails in this mailbox
                  </p>
                </div>
                <Switch
                  checked={formData.keepCopy}
                  onCheckedChange={(v) => setFormData({ ...formData, keepCopy: v })}
                />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={updateForwarding.isPending} className="flex-1">
              {updateForwarding.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CreateAliasDialog({ isOpen, onClose, domains, mailboxes, onSuccess }) {
  const [formData, setFormData] = useState({
    domainId: '',
    localPart: '',
    mailboxId: '',
  });
  const createAlias = useCreateAlias();
  const { toast } = useToast();

  const selectedDomain = domains.find((d) => d.id === formData.domainId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.domainId || !formData.localPart || !formData.mailboxId) {
      toast({ title: 'Error', description: 'All fields are required', variant: 'destructive' });
      return;
    }
    try {
      await createAlias.mutateAsync(formData);
      toast({ title: 'Success', description: 'Alias created successfully' });
      onSuccess?.();
      handleClose();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create alias',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    setFormData({ domainId: '', localPart: '', mailboxId: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Create Alias
          </DialogTitle>
          <DialogDescription>
            Create an email alias that delivers to an existing mailbox.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Domain</Label>
            <Select
              value={formData.domainId}
              onValueChange={(v) => setFormData({ ...formData, domainId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select domain..." />
              </SelectTrigger>
              <SelectContent>
                {domains
                  .filter((d) => d.status === 'VERIFIED')
                  .map((domain) => (
                    <SelectItem key={domain.id} value={domain.id}>
                      {domain.domain}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Alias Address</Label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="sales"
                value={formData.localPart}
                onChange={(e) => setFormData({ ...formData, localPart: e.target.value })}
                className="flex-1"
              />
              <span className="text-muted-foreground">@</span>
              <span className="text-muted-foreground">
                {selectedDomain?.domain || 'domain.com'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Deliver To</Label>
            <Select
              value={formData.mailboxId}
              onValueChange={(v) => setFormData({ ...formData, mailboxId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select mailbox..." />
              </SelectTrigger>
              <SelectContent>
                {mailboxes.map((mailbox) => (
                  <SelectItem key={mailbox.id} value={mailbox.id}>
                    {mailbox.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={createAlias.isPending} className="flex-1">
              {createAlias.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Alias
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CreateForwarderDialog({ isOpen, onClose, domains, onSuccess }) {
  const [formData, setFormData] = useState({
    domainId: '',
    localPart: '',
    forwardTo: '',
    keepCopy: false,
  });
  const createForwarder = useCreateForwarder();
  const { toast } = useToast();

  const selectedDomain = domains.find((d) => d.id === formData.domainId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.domainId || !formData.localPart || !formData.forwardTo) {
      toast({ title: 'Error', description: 'All fields are required', variant: 'destructive' });
      return;
    }
    try {
      const forwardToArray = formData.forwardTo
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean);
      await createForwarder.mutateAsync({
        ...formData,
        forwardTo: forwardToArray,
      });
      toast({ title: 'Success', description: 'Forwarder created successfully' });
      onSuccess?.();
      handleClose();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create forwarder',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    setFormData({ domainId: '', localPart: '', forwardTo: '', keepCopy: false });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Forward className="h-5 w-5" />
            Create Forwarder
          </DialogTitle>
          <DialogDescription>
            Forward emails to external addresses without a mailbox.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Domain</Label>
            <Select
              value={formData.domainId}
              onValueChange={(v) => setFormData({ ...formData, domainId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select domain..." />
              </SelectTrigger>
              <SelectContent>
                {domains
                  .filter((d) => d.status === 'VERIFIED')
                  .map((domain) => (
                    <SelectItem key={domain.id} value={domain.id}>
                      {domain.domain}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Email Address</Label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="info"
                value={formData.localPart}
                onChange={(e) => setFormData({ ...formData, localPart: e.target.value })}
                className="flex-1"
              />
              <span className="text-muted-foreground">@</span>
              <span className="text-muted-foreground">
                {selectedDomain?.domain || 'domain.com'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Forward To</Label>
            <Input
              placeholder="email1@example.com, email2@example.com"
              value={formData.forwardTo}
              onChange={(e) => setFormData({ ...formData, forwardTo: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">Separate multiple addresses with commas</p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={createForwarder.isPending} className="flex-1">
              {createForwarder.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Forwarder
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function EmailMailboxesPage() {
  const [activeTab, setActiveTab] = useState('mailboxes');
  const [showCreateMailbox, setShowCreateMailbox] = useState(false);
  const [showCreateAlias, setShowCreateAlias] = useState(false);
  const [showCreateForwarder, setShowCreateForwarder] = useState(false);
  const [selectedMailbox, setSelectedMailbox] = useState(null);
  const [dialogType, setDialogType] = useState(null); // 'credentials' | 'autoResponder' | 'forwarding'
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  const { data: domains = [], isLoading: loadingDomains } = useEmailDomains();
  const {
    data: mailboxData,
    isLoading: loadingMailboxes,
    refetch: refetchMailboxes,
  } = useEmailMailboxes();
  const { data: aliasData, isLoading: loadingAliases, refetch: refetchAliases } = useEmailAliases();
  const {
    data: forwarderData,
    isLoading: loadingForwarders,
    refetch: refetchForwarders,
  } = useEmailForwarders();

  const deleteMailbox = useDeleteMailbox();
  const setCatchAll = useSetCatchAll();
  const deleteAlias = useDeleteAlias();
  const deleteForwarder = useDeleteForwarder();

  const mailboxes = mailboxData?.mailboxes || [];
  const aliases = aliasData?.aliases || [];
  const forwarders = forwarderData?.forwarders || [];

  const verifiedDomains = domains.filter((d) => d.status === 'VERIFIED');

  const handleDeleteMailbox = async (id) => {
    if (!confirm('Are you sure you want to delete this mailbox? This action cannot be undone.'))
      return;
    try {
      await deleteMailbox.mutateAsync(id);
      toast({ title: 'Success', description: 'Mailbox deleted' });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete',
        variant: 'destructive',
      });
    }
  };

  const handleSetCatchAll = async (mailboxId, enabled) => {
    try {
      await setCatchAll.mutateAsync({ mailboxId, enabled });
      toast({
        title: 'Success',
        description: enabled ? 'Catch-all enabled' : 'Catch-all disabled',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to update',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAlias = async (id) => {
    if (!confirm('Delete this alias?')) return;
    try {
      await deleteAlias.mutateAsync(id);
      toast({ title: 'Success', description: 'Alias deleted' });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteForwarder = async (id) => {
    if (!confirm('Delete this forwarder?')) return;
    try {
      await deleteForwarder.mutateAsync(id);
      toast({ title: 'Success', description: 'Forwarder deleted' });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete',
        variant: 'destructive',
      });
    }
  };

  const openMailboxDialog = (mailbox, type) => {
    setSelectedMailbox(mailbox);
    setDialogType(type);
  };

  const closeMailboxDialog = () => {
    setSelectedMailbox(null);
    setDialogType(null);
  };

  if (!isAdmin) {
    return (
      <div className="flex-1 p-6">
        <Card className="border-dashed">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Admin Access Required</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Email mailbox management requires admin privileges.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verifiedDomains.length === 0) {
    return (
      <div className="flex-1 p-6">
        <Card className="border-dashed">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Globe className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Verified Domains</h2>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              You need to add and verify a custom domain before creating mailboxes.
            </p>
            <Button asChild>
              <a href="/settings/email">
                <Plus className="h-4 w-4 mr-2" />
                Add Domain
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Email Mailboxes</h1>
          <p className="text-muted-foreground">
            Manage mailboxes, aliases, and forwarders for your custom domains
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Inbox className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mailboxes.length}</p>
                <p className="text-sm text-muted-foreground">Mailboxes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2">
                <ArrowRightLeft className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{aliases.length}</p>
                <p className="text-sm text-muted-foreground">Aliases</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <Forward className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{forwarders.length}</p>
                <p className="text-sm text-muted-foreground">Forwarders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-100 p-2">
                <Globe className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{verifiedDomains.length}</p>
                <p className="text-sm text-muted-foreground">Domains</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="mailboxes" className="flex items-center gap-2">
              <Inbox className="h-4 w-4" />
              Mailboxes
            </TabsTrigger>
            <TabsTrigger value="aliases" className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4" />
              Aliases
            </TabsTrigger>
            <TabsTrigger value="forwarders" className="flex items-center gap-2">
              <Forward className="h-4 w-4" />
              Forwarders
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            {activeTab === 'mailboxes' && (
              <Button onClick={() => setShowCreateMailbox(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Mailbox
              </Button>
            )}
            {activeTab === 'aliases' && (
              <Button onClick={() => setShowCreateAlias(true)} disabled={mailboxes.length === 0}>
                <Plus className="h-4 w-4 mr-2" />
                Create Alias
              </Button>
            )}
            {activeTab === 'forwarders' && (
              <Button onClick={() => setShowCreateForwarder(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Forwarder
              </Button>
            )}
          </div>
        </div>

        {/* Mailboxes Tab */}
        <TabsContent value="mailboxes" className="space-y-4">
          {loadingMailboxes ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : mailboxes.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-12 pb-12 text-center">
                <Inbox className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No Mailboxes Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first mailbox to start receiving emails.
                </p>
                <Button onClick={() => setShowCreateMailbox(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Mailbox
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Display Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Storage</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mailboxes.map((mailbox) => (
                    <TableRow key={mailbox.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{mailbox.email}</span>
                          {mailbox.isCatchAll && (
                            <Badge variant="secondary" className="text-xs">
                              Catch-all
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{mailbox.displayName || '-'}</TableCell>
                      <TableCell>
                        <MailboxStatusBadge status={mailbox.status} />
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  'h-full',
                                  mailbox.usedPercent > 80
                                    ? 'bg-red-500'
                                    : mailbox.usedPercent > 50
                                      ? 'bg-yellow-500'
                                      : 'bg-green-500'
                                )}
                                style={{ width: `${mailbox.usedPercent || 0}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {mailbox.usedPercent || 0}%
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {mailbox.autoResponderEnabled && (
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              Auto
                            </Badge>
                          )}
                          {mailbox.forwardingEnabled && (
                            <Badge variant="outline" className="text-xs">
                              <Forward className="h-3 w-3 mr-1" />
                              Fwd
                            </Badge>
                          )}
                          {mailbox.aliasCount > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {mailbox.aliasCount} alias
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => openMailboxDialog(mailbox, 'credentials')}
                            >
                              <Key className="h-4 w-4 mr-2" />
                              Credentials
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openMailboxDialog(mailbox, 'autoResponder')}
                            >
                              <Clock className="h-4 w-4 mr-2" />
                              Auto-Responder
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openMailboxDialog(mailbox, 'forwarding')}
                            >
                              <Forward className="h-4 w-4 mr-2" />
                              Forwarding
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleSetCatchAll(mailbox.id, !mailbox.isCatchAll)}
                            >
                              <Inbox className="h-4 w-4 mr-2" />
                              {mailbox.isCatchAll ? 'Disable Catch-all' : 'Set as Catch-all'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteMailbox(mailbox.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        {/* Aliases Tab */}
        <TabsContent value="aliases" className="space-y-4">
          {loadingAliases ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : aliases.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-12 pb-12 text-center">
                <ArrowRightLeft className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No Aliases Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create aliases to route emails to existing mailboxes.
                </p>
                <Button onClick={() => setShowCreateAlias(true)} disabled={mailboxes.length === 0}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Alias
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alias</TableHead>
                    <TableHead>Delivers To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aliases.map((alias) => (
                    <TableRow key={alias.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{alias.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">
                          {alias.targetMailbox?.email || '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            alias.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }
                        >
                          {alias.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(alias.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteAlias(alias.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        {/* Forwarders Tab */}
        <TabsContent value="forwarders" className="space-y-4">
          {loadingForwarders ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : forwarders.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-12 pb-12 text-center">
                <Forward className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No Forwarders Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create forwarders to route emails to external addresses.
                </p>
                <Button onClick={() => setShowCreateForwarder(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Forwarder
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Forward To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forwarders.map((forwarder) => (
                    <TableRow key={forwarder.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Forward className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{forwarder.email}</span>
                          {forwarder.keepCopy && (
                            <Badge variant="outline" className="text-xs">
                              Keep Copy
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {forwarder.forwardTo?.map((email, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {email}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            forwarder.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }
                        >
                          {forwarder.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(forwarder.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteForwarder(forwarder.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CreateMailboxDialog
        isOpen={showCreateMailbox}
        onClose={() => setShowCreateMailbox(false)}
        domains={domains}
        onSuccess={() => refetchMailboxes()}
      />

      <CreateAliasDialog
        isOpen={showCreateAlias}
        onClose={() => setShowCreateAlias(false)}
        domains={domains}
        mailboxes={mailboxes}
        onSuccess={() => refetchAliases()}
      />

      <CreateForwarderDialog
        isOpen={showCreateForwarder}
        onClose={() => setShowCreateForwarder(false)}
        domains={domains}
        onSuccess={() => refetchForwarders()}
      />

      {selectedMailbox && dialogType === 'credentials' && (
        <CredentialsDialog isOpen={true} onClose={closeMailboxDialog} mailbox={selectedMailbox} />
      )}

      {selectedMailbox && dialogType === 'autoResponder' && (
        <AutoResponderDialog
          isOpen={true}
          onClose={closeMailboxDialog}
          mailbox={selectedMailbox}
          onSuccess={() => refetchMailboxes()}
        />
      )}

      {selectedMailbox && dialogType === 'forwarding' && (
        <ForwardingDialog
          isOpen={true}
          onClose={closeMailboxDialog}
          mailbox={selectedMailbox}
          onSuccess={() => refetchMailboxes()}
        />
      )}
    </div>
  );
}
