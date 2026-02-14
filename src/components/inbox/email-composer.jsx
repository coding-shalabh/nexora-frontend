'use client';

/**
 * Email Composer - Enhanced with contact autocomplete and shared accounts
 * Features: Rich text, attachments, tracking toggle, scheduling, contact autocomplete
 */

import { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  X,
  Minus,
  Maximize2,
  Minimize2,
  Send,
  Eye,
  MousePointer,
  Clock,
  ChevronDown,
  Trash2,
  Loader2,
  Paperclip,
  FileText,
  Image as ImageIcon,
  File,
  Plus,
  User,
  Users,
  Mail,
  Building2,
  Settings,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EmailRichEditor } from './email-rich-editor';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useSendEmail } from '@/hooks/use-emails';
import { useEmailAccounts, useAccessibleEmailAccounts } from '@/hooks/use-email-accounts';
import { useContacts } from '@/hooks/use-contacts';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Email address input with chips AND autocomplete dropdown
function EmailInputWithAutocomplete({
  value = [],
  onChange,
  placeholder,
  label,
  contacts = [],
  users = [],
  className,
}) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Filter suggestions based on input
  const suggestions = useMemo(() => {
    if (!inputValue || inputValue.length < 1) return [];

    const searchLower = inputValue.toLowerCase();
    const results = [];

    // Search contacts
    contacts.forEach((contact) => {
      if (
        contact.email &&
        (contact.email.toLowerCase().includes(searchLower) ||
          contact.firstName?.toLowerCase().includes(searchLower) ||
          contact.lastName?.toLowerCase().includes(searchLower) ||
          `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchLower))
      ) {
        if (!value.includes(contact.email)) {
          results.push({
            type: 'contact',
            email: contact.email,
            name: `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || contact.email,
            avatar: contact.avatarUrl,
            company: contact.company?.name,
          });
        }
      }
    });

    // Search users (team members)
    users.forEach((user) => {
      if (
        user.email &&
        (user.email.toLowerCase().includes(searchLower) ||
          user.firstName?.toLowerCase().includes(searchLower) ||
          user.lastName?.toLowerCase().includes(searchLower) ||
          user.displayName?.toLowerCase().includes(searchLower))
      ) {
        if (!value.includes(user.email)) {
          results.push({
            type: 'user',
            email: user.email,
            name:
              user.displayName ||
              `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
              user.email,
            avatar: user.avatarUrl,
          });
        }
      }
    });

    return results.slice(0, 8); // Limit to 8 suggestions
  }, [inputValue, contacts, users, value]);

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(0);
  }, [suggestions]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown' && suggestions.length > 0) {
      e.preventDefault();
      setShowSuggestions(true);
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp' && suggestions.length > 0) {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (suggestions.length > 0 && showSuggestions) {
        selectSuggestion(suggestions[selectedIndex]);
      } else {
        addEmail();
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeEmail(value.length - 1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const addEmail = () => {
    const email = inputValue.trim().replace(/,/g, '');
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      onChange([...value, email]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion) => {
    onChange([...value, suggestion.email]);
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeEmail = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn('relative flex items-start gap-2 py-1.5 border-b', className)}
    >
      <Label className="text-xs text-muted-foreground w-10 pt-1.5 shrink-0">{label}</Label>
      <div className="flex-1 flex flex-wrap items-center gap-1 min-h-[28px]">
        {value.map((email, index) => (
          <Badge key={index} variant="secondary" className="h-6 text-xs font-normal gap-1">
            {email}
            <X
              className="h-3 w-3 cursor-pointer hover:text-destructive"
              onClick={() => removeEmail(index)}
            />
          </Badge>
        ))}
        <input
          ref={inputRef}
          type="email"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(e.target.value.length > 0);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue && setShowSuggestions(true)}
          onBlur={() => setTimeout(addEmail, 200)}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] h-6 text-sm bg-transparent border-0 outline-none placeholder:text-muted-foreground"
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-10 right-0 top-full mt-1 z-50 bg-popover border rounded-lg shadow-lg overflow-hidden">
          <div className="max-h-[200px] overflow-y-auto py-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${suggestion.email}`}
                type="button"
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 text-left transition-colors',
                  index === selectedIndex ? 'bg-accent' : 'hover:bg-accent/50'
                )}
                onClick={() => selectSuggestion(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src={suggestion.avatar} />
                  <AvatarFallback className="text-xs">
                    {suggestion.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{suggestion.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{suggestion.email}</div>
                </div>
                {suggestion.type === 'contact' && (
                  <Badge variant="outline" className="text-[10px] shrink-0">
                    {suggestion.company || 'Contact'}
                  </Badge>
                )}
                {suggestion.type === 'user' && (
                  <Badge variant="secondary" className="text-[10px] shrink-0">
                    Team
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Legacy EmailInput for backward compatibility
function EmailInput({ value = [], onChange, placeholder, label }) {
  return (
    <EmailInputWithAutocomplete
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      label={label}
      contacts={[]}
      users={[]}
    />
  );
}

// Main composer component
export function EmailComposer({
  isOpen,
  onClose,
  defaultTo = [],
  defaultSubject = '',
  defaultContactId,
  defaultDealId,
  replyTo,
  inline = false, // New prop: render inline in content area instead of floating
}) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  // Form state
  const [to, setTo] = useState(defaultTo);
  const [cc, setCc] = useState([]);
  const [bcc, setBcc] = useState([]);
  const [subject, setSubject] = useState(defaultSubject);
  const [bodyHtml, setBodyHtml] = useState('');
  const [accountId, setAccountId] = useState('');
  const [trackOpens, setTrackOpens] = useState(true);
  const [trackClicks, setTrackClicks] = useState(true);
  const [scheduledAt, setScheduledAt] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const router = useRouter();

  // Hooks - Get all accessible email accounts (own + shared)
  const { data: ownAccounts = [], isLoading: ownLoading } = useEmailAccounts();
  const { data: accessibleData, isLoading: accessibleLoading } = useAccessibleEmailAccounts();
  const { user } = useAuth() || {};
  const sendEmail = useSendEmail();
  const { toast } = useToast();

  // Get contacts for autocomplete
  const { data: contactsData } = useContacts({ limit: 500 });
  const contacts = contactsData?.data || [];

  // Get team users for autocomplete
  const { data: usersData } = useQuery({
    queryKey: ['users', 'team'],
    queryFn: () => api.get('/settings/users'),
    staleTime: 5 * 60 * 1000,
  });
  const users = usersData?.data || [];

  // Categorize accounts: My Accounts vs Shared Accounts
  const { myAccounts, sharedAccounts } = useMemo(() => {
    const my = [];
    const shared = [];

    // Own accounts are always "my accounts"
    ownAccounts.forEach((acc) => {
      my.push({ ...acc, category: 'my' });
    });

    // From accessible, add those that are shared (not owned by current user)
    if (accessibleData?.data) {
      accessibleData.data.forEach((acc) => {
        // Check if it's not already in ownAccounts
        const isOwn = ownAccounts.some((own) => own.id === acc.id);
        if (!isOwn) {
          shared.push({ ...acc, category: 'shared' });
        }
      });
    }

    return { myAccounts: my, sharedAccounts: shared };
  }, [ownAccounts, accessibleData]);

  const allAccounts = [...myAccounts, ...sharedAccounts];
  const accountsLoading = ownLoading || accessibleLoading;

  // Set default account
  useEffect(() => {
    if (allAccounts.length > 0 && !accountId) {
      const defaultAccount = allAccounts.find((a) => a.isDefault) || allAccounts[0];
      setAccountId(defaultAccount.id);
    }
  }, [allAccounts, accountId]);

  // File attachment helpers
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_ATTACHMENTS = 10;

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check attachment limit
    if (attachments.length + files.length > MAX_ATTACHMENTS) {
      toast({
        title: 'Too many files',
        description: `Maximum ${MAX_ATTACHMENTS} attachments allowed`,
        variant: 'destructive',
      });
      return;
    }

    const newAttachments = [];
    for (const file of files) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: 'File too large',
          description: `${file.name} exceeds 10MB limit`,
          variant: 'destructive',
        });
        continue;
      }

      // Read file as base64
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result;
          const base64Data = result.split(',')[1]; // Remove data:type;base64, prefix
          resolve(base64Data);
        };
        reader.readAsDataURL(file);
      });

      newAttachments.push({
        id: crypto.randomUUID(),
        filename: file.name,
        content: base64,
        contentType: file.type || 'application/octet-stream',
        size: file.size,
      });
    }

    setAttachments((prev) => [...prev, ...newAttachments]);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (contentType) => {
    if (contentType.startsWith('image/')) return ImageIcon;
    if (contentType.includes('pdf') || contentType.includes('document')) return FileText;
    return File;
  };

  const handleSend = async () => {
    if (to.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one recipient',
        variant: 'destructive',
      });
      return;
    }
    if (!subject.trim()) {
      toast({ title: 'Error', description: 'Please enter a subject', variant: 'destructive' });
      return;
    }
    if (!accountId) {
      toast({
        title: 'Error',
        description: 'Please select an email account',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Prepare attachments (remove id field before sending)
      const emailAttachments = attachments.map(({ filename, content, contentType, size }) => ({
        filename,
        content,
        contentType,
        size,
      }));

      await sendEmail.mutateAsync({
        accountId,
        to,
        cc: cc.length > 0 ? cc : undefined,
        bcc: bcc.length > 0 ? bcc : undefined,
        subject,
        bodyHtml: bodyHtml || '<p></p>',
        trackOpens,
        trackClicks,
        scheduledAt: scheduledAt?.toISOString(),
        contactId: defaultContactId,
        dealId: defaultDealId,
        attachments: emailAttachments.length > 0 ? emailAttachments : undefined,
      });

      toast({ title: 'Success', description: scheduledAt ? 'Email scheduled!' : 'Email sent!' });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send email',
        variant: 'destructive',
      });
    }
  };

  const handleConnectEmail = () => {
    router.push('/settings/channels?tab=email');
    onClose();
  };

  if (!isOpen) return null;

  const selectedAccount = allAccounts.find((a) => a.id === accountId);

  // Inline mode: render in content area with white background
  if (inline) {
    return (
      <TooltipProvider>
        <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-slate-50 to-white rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">New Email</h2>
                {scheduledAt && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Scheduled for {format(scheduledAt, 'MMM d, yyyy h:mm a')}
                  </p>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Discard
            </Button>
          </div>

          {/* Email Form */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* From & Recipients */}
            <div className="px-6 py-2 space-y-0 border-b bg-white">
              {/* From - Enhanced with account categories */}
              <div className="flex items-center gap-3 py-2">
                <Label className="text-sm text-muted-foreground w-16 shrink-0">From</Label>
                <Select value={accountId} onValueChange={setAccountId}>
                  <SelectTrigger className="h-9 max-w-md">
                    <SelectValue placeholder="Select account">
                      {selectedAccount && (
                        <span className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {selectedAccount.email}
                          {selectedAccount.category === 'shared' && (
                            <Badge variant="outline" className="h-4 text-[9px]">
                              <Share2 className="h-2.5 w-2.5 mr-0.5" />
                              Shared
                            </Badge>
                          )}
                          {selectedAccount.isDefault && (
                            <Badge variant="secondary" className="h-4 text-[9px]">
                              Default
                            </Badge>
                          )}
                        </span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {/* My Accounts */}
                    {myAccounts.length > 0 && (
                      <SelectGroup>
                        <SelectLabel className="flex items-center gap-2 text-xs">
                          <User className="h-3.5 w-3.5" />
                          My Accounts
                        </SelectLabel>
                        {myAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            <span className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              {account.email}
                              {account.isDefault && (
                                <Badge variant="secondary" className="h-4 text-[9px]">
                                  Default
                                </Badge>
                              )}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )}

                    {/* Shared Accounts */}
                    {sharedAccounts.length > 0 && (
                      <>
                        <SelectSeparator />
                        <SelectGroup>
                          <SelectLabel className="flex items-center gap-2 text-xs">
                            <Users className="h-3.5 w-3.5" />
                            Shared with Me
                          </SelectLabel>
                          {sharedAccounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              <span className="flex items-center gap-2">
                                <Share2 className="h-4 w-4 text-blue-500" />
                                {account.email}
                                <Badge variant="outline" className="h-4 text-[9px]">
                                  Shared
                                </Badge>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </>
                    )}

                    {/* Connect New Account */}
                    <SelectSeparator />
                    <div className="p-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={(e) => {
                          e.preventDefault();
                          handleConnectEmail();
                        }}
                      >
                        <Plus className="h-3.5 w-3.5 mr-2" />
                        Connect Email Account
                      </Button>
                    </div>
                  </SelectContent>
                </Select>
              </div>

              {/* To - with autocomplete */}
              <div className="flex items-center gap-3 py-2 border-t">
                <Label className="text-sm text-muted-foreground w-16 shrink-0">To</Label>
                <div className="flex-1 relative">
                  <EmailInputWithAutocomplete
                    value={to}
                    onChange={setTo}
                    placeholder="Add recipients..."
                    label=""
                    contacts={contacts}
                    users={users}
                    className="border-0 py-0"
                  />
                </div>
                <div className="flex gap-1 shrink-0">
                  {!showCc && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setShowCc(true)}
                    >
                      Cc
                    </Button>
                  )}
                  {!showBcc && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setShowBcc(true)}
                    >
                      Bcc
                    </Button>
                  )}
                </div>
              </div>

              {/* Cc - with autocomplete */}
              {showCc && (
                <div className="flex items-center gap-3 py-2 border-t">
                  <Label className="text-sm text-muted-foreground w-16 shrink-0">Cc</Label>
                  <EmailInputWithAutocomplete
                    value={cc}
                    onChange={setCc}
                    placeholder="Add Cc..."
                    label=""
                    contacts={contacts}
                    users={users}
                    className="border-0 py-0 flex-1"
                  />
                </div>
              )}

              {/* Bcc - with autocomplete */}
              {showBcc && (
                <div className="flex items-center gap-3 py-2 border-t">
                  <Label className="text-sm text-muted-foreground w-16 shrink-0">Bcc</Label>
                  <EmailInputWithAutocomplete
                    value={bcc}
                    onChange={setBcc}
                    placeholder="Add Bcc..."
                    label=""
                    contacts={contacts}
                    users={users}
                    className="border-0 py-0 flex-1"
                  />
                </div>
              )}

              {/* Subject */}
              <div className="flex items-center gap-3 py-2 border-t">
                <Label className="text-sm text-muted-foreground w-16 shrink-0">Subject</Label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject"
                  className="flex-1 h-9 text-sm bg-transparent border-0 outline-none font-medium"
                />
              </div>
            </div>

            {/* Rich Text Editor */}
            <div className="flex-1 overflow-hidden border-b bg-white">
              <EmailRichEditor
                content={bodyHtml}
                onChange={setBodyHtml}
                placeholder="Write your message..."
                className="h-full"
                editorClassName="h-full px-6 py-4"
              />
            </div>

            {/* Attachments Display */}
            {attachments.length > 0 && (
              <div className="px-6 py-3 border-b bg-slate-50/50">
                <div className="flex flex-wrap gap-2">
                  {attachments.map((attachment) => {
                    const FileIcon = getFileIcon(attachment.contentType);
                    return (
                      <div
                        key={attachment.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border text-sm group"
                      >
                        <FileIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="truncate max-w-[180px]">{attachment.filename}</span>
                        <span className="text-muted-foreground text-xs">
                          ({formatFileSize(attachment.size)})
                        </span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(attachment.id)}
                          className="ml-1 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="*/*"
            />

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 rounded-b-2xl">
              <div className="flex items-center gap-3">
                {/* Send Button */}
                <div className="flex items-center">
                  <Button
                    onClick={handleSend}
                    disabled={sendEmail.isPending}
                    className="rounded-r-none"
                  >
                    {sendEmail.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    {scheduledAt ? 'Schedule Send' : 'Send Email'}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="default"
                        className="rounded-l-none border-l border-primary-foreground/20 px-2"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={handleSend}>
                        <Send className="h-4 w-4 mr-2" />
                        Send now
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowSchedule(true)}>
                        <Clock className="h-4 w-4 mr-2" />
                        Schedule send
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Schedule Popover */}
                <Popover open={showSchedule} onOpenChange={setShowSchedule}>
                  <PopoverTrigger asChild>
                    <span />
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={scheduledAt}
                      onSelect={(date) => {
                        setScheduledAt(date);
                        setShowSchedule(false);
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                    {scheduledAt && (
                      <div className="p-2 border-t">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => setScheduledAt(null)}
                        >
                          Clear schedule
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>

                {/* Attachment Button */}
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attach Files
                  {attachments.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {attachments.length}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Tracking toggles */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Track opens</span>
                  <Switch checked={trackOpens} onCheckedChange={setTrackOpens} />
                </div>
                <div className="flex items-center gap-2">
                  <MousePointer className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Track clicks</span>
                  <Switch checked={trackClicks} onCheckedChange={setTrackClicks} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    );
  }

  // Floating mode (original behavior with enhancements)
  return (
    <TooltipProvider>
      <div
        className={cn(
          'fixed bg-white border rounded-t-lg shadow-2xl z-50 flex flex-col transition-all duration-200',
          isMinimized
            ? 'bottom-0 right-4 w-64 h-10'
            : isMaximized
              ? 'inset-4'
              : 'bottom-0 right-4 w-[560px] h-[520px]'
        )}
      >
        {/* Header */}
        <div
          className={cn(
            'flex items-center justify-between px-3 h-10 border-b bg-gradient-to-r from-slate-100 to-slate-50 rounded-t-lg cursor-pointer',
            isMinimized && 'rounded-b-lg'
          )}
          onClick={() => isMinimized && setIsMinimized(false)}
        >
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium truncate">{subject || 'New Message'}</span>
            {scheduledAt && (
              <Badge variant="outline" className="h-5 text-[10px]">
                <Clock className="h-3 w-3 mr-1" />
                Scheduled
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(!isMinimized);
              }}
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                setIsMaximized(!isMaximized);
                setIsMinimized(false);
              }}
            >
              {isMaximized ? (
                <Minimize2 className="h-3.5 w-3.5" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-destructive/20 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Content (hidden when minimized) */}
        {!isMinimized && (
          <>
            {/* From & Recipients */}
            <div className="px-3 space-y-0 bg-white">
              {/* From - Enhanced */}
              <div className="flex items-center gap-2 py-1.5 border-b">
                <Label className="text-xs text-muted-foreground w-10 shrink-0">From</Label>
                <Select value={accountId} onValueChange={setAccountId}>
                  <SelectTrigger className="h-7 text-xs border-0 shadow-none">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* My Accounts */}
                    {myAccounts.length > 0 && (
                      <SelectGroup>
                        <SelectLabel className="flex items-center gap-1.5 text-[10px]">
                          <User className="h-3 w-3" />
                          My Accounts
                        </SelectLabel>
                        {myAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            <span className="flex items-center gap-2">
                              {account.email}
                              {account.isDefault && (
                                <Badge variant="outline" className="h-4 text-[9px]">
                                  Default
                                </Badge>
                              )}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )}

                    {/* Shared Accounts */}
                    {sharedAccounts.length > 0 && (
                      <>
                        <SelectSeparator />
                        <SelectGroup>
                          <SelectLabel className="flex items-center gap-1.5 text-[10px]">
                            <Share2 className="h-3 w-3" />
                            Shared
                          </SelectLabel>
                          {sharedAccounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              <span className="flex items-center gap-2">
                                {account.email}
                                <Badge variant="outline" className="h-4 text-[9px]">
                                  Shared
                                </Badge>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </>
                    )}

                    {/* Connect New */}
                    <SelectSeparator />
                    <div className="p-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs h-7"
                        onClick={(e) => {
                          e.preventDefault();
                          handleConnectEmail();
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1.5" />
                        Connect Account
                      </Button>
                    </div>
                  </SelectContent>
                </Select>
              </div>

              {/* To - with autocomplete */}
              <EmailInputWithAutocomplete
                label="To"
                value={to}
                onChange={setTo}
                placeholder="Recipients"
                contacts={contacts}
                users={users}
              />

              {/* Cc/Bcc toggle */}
              {!showCc && !showBcc && (
                <div className="flex gap-2 py-1 border-b">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 text-xs text-muted-foreground"
                    onClick={() => setShowCc(true)}
                  >
                    Cc
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 text-xs text-muted-foreground"
                    onClick={() => setShowBcc(true)}
                  >
                    Bcc
                  </Button>
                </div>
              )}

              {/* Cc */}
              {showCc && (
                <EmailInputWithAutocomplete
                  label="Cc"
                  value={cc}
                  onChange={setCc}
                  placeholder="Carbon copy"
                  contacts={contacts}
                  users={users}
                />
              )}

              {/* Bcc */}
              {showBcc && (
                <EmailInputWithAutocomplete
                  label="Bcc"
                  value={bcc}
                  onChange={setBcc}
                  placeholder="Blind carbon copy"
                  contacts={contacts}
                  users={users}
                />
              )}

              {/* Subject */}
              <div className="flex items-center gap-2 py-1.5 border-b">
                <Label className="text-xs text-muted-foreground w-10 shrink-0">Subject</Label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject"
                  className="flex-1 h-6 text-sm bg-transparent border-0 outline-none"
                />
              </div>
            </div>

            {/* Rich Text Editor with integrated toolbar */}
            <div className="flex-1 overflow-hidden bg-white">
              <EmailRichEditor
                content={bodyHtml}
                onChange={setBodyHtml}
                placeholder="Write your message..."
                className="h-full"
                editorClassName="h-full"
              />
            </div>

            {/* Attachments Display */}
            {attachments.length > 0 && (
              <div className="px-3 py-2 border-t bg-slate-50">
                <div className="flex flex-wrap gap-2">
                  {attachments.map((attachment) => {
                    const FileIcon = getFileIcon(attachment.contentType);
                    return (
                      <div
                        key={attachment.id}
                        className="flex items-center gap-1.5 px-2 py-1 rounded bg-white border text-xs group"
                      >
                        <FileIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate max-w-[120px]">{attachment.filename}</span>
                        <span className="text-muted-foreground">
                          ({formatFileSize(attachment.size)})
                        </span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(attachment.id)}
                          className="ml-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="*/*"
            />

            {/* Footer */}
            <div className="flex items-center justify-between px-3 py-2 border-t bg-slate-50">
              <div className="flex items-center gap-3">
                {/* Send Button */}
                <div className="flex items-center">
                  <Button
                    size="sm"
                    className="rounded-r-none"
                    onClick={handleSend}
                    disabled={sendEmail.isPending}
                  >
                    {sendEmail.isPending ? (
                      <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5 mr-1" />
                    )}
                    {scheduledAt ? 'Schedule' : 'Send'}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        className="rounded-l-none border-l border-primary-foreground/20 px-2"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={handleSend}>
                        <Send className="h-4 w-4 mr-2" />
                        Send now
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowSchedule(true)}>
                        <Clock className="h-4 w-4 mr-2" />
                        Schedule send
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Schedule Popover */}
                <Popover open={showSchedule} onOpenChange={setShowSchedule}>
                  <PopoverTrigger asChild>
                    <span />
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={scheduledAt}
                      onSelect={(date) => {
                        setScheduledAt(date);
                        setShowSchedule(false);
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                    {scheduledAt && (
                      <div className="p-2 border-t">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => setScheduledAt(null)}
                        >
                          Clear schedule
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>

                {/* Attachment Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-3.5 w-3.5 mr-1" />
                  Attach
                  {attachments.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-4 text-[10px] px-1">
                      {attachments.length}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Tracking toggles */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Track opens</span>
                  <Switch
                    checked={trackOpens}
                    onCheckedChange={setTrackOpens}
                    className="scale-75"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <MousePointer className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Track clicks</span>
                  <Switch
                    checked={trackClicks}
                    onCheckedChange={setTrackClicks}
                    className="scale-75"
                  />
                </div>
              </div>

              {/* Delete */}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={onClose}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </>
        )}
      </div>
    </TooltipProvider>
  );
}

export default EmailComposer;
