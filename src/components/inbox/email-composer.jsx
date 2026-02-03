'use client';

/**
 * Email Composer - Notion-style compact, user-friendly UI
 * Features: Rich text, attachments, tracking toggle, scheduling
 */

import { useState, useRef, useEffect } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { EmailRichEditor } from './email-rich-editor';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useSendEmail } from '@/hooks/use-emails';
import { useEmailAccounts } from '@/hooks/use-email-accounts';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Email address input with chips
function EmailInput({ value = [], onChange, placeholder, label }) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault();
      addEmail();
    }
    if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeEmail(value.length - 1);
    }
  };

  const addEmail = () => {
    const email = inputValue.trim().replace(/,/g, '');
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      onChange([...value, email]);
      setInputValue('');
    }
  };

  const removeEmail = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="flex items-start gap-2 py-1.5 border-b">
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
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addEmail}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] h-6 text-sm bg-transparent border-0 outline-none placeholder:text-muted-foreground"
        />
      </div>
    </div>
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

  // Hooks
  const { data: accounts = [], isLoading: accountsLoading } = useEmailAccounts();
  const sendEmail = useSendEmail();
  const { toast } = useToast();

  // Set default account
  useEffect(() => {
    if (accounts.length > 0 && !accountId) {
      const defaultAccount = accounts.find((a) => a.isDefault) || accounts[0];
      setAccountId(defaultAccount.id);
    }
  }, [accounts, accountId]);

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

  if (!isOpen) return null;

  const selectedAccount = accounts.find((a) => a.id === accountId);

  // Inline mode: render in content area like a proper email client
  if (inline) {
    return (
      <TooltipProvider>
        <div className="flex flex-col h-full bg-background">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">New Email</h2>
              {scheduledAt && (
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Scheduled for {format(scheduledAt, 'MMM d, yyyy')}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Discard
            </Button>
          </div>

          {/* Email Form */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* From & Recipients */}
            <div className="px-6 py-2 space-y-0 border-b">
              {/* From */}
              <div className="flex items-center gap-3 py-2">
                <Label className="text-sm text-muted-foreground w-16 shrink-0">From</Label>
                <Select value={accountId} onValueChange={setAccountId}>
                  <SelectTrigger className="h-9 max-w-md">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
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
                  </SelectContent>
                </Select>
              </div>

              {/* To */}
              <div className="flex items-center gap-3 py-2 border-t">
                <Label className="text-sm text-muted-foreground w-16 shrink-0">To</Label>
                <div className="flex-1 flex flex-wrap items-center gap-1 min-h-[36px]">
                  {to.map((email, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="h-7 text-sm font-normal gap-1"
                    >
                      {email}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => setTo(to.filter((_, i) => i !== index))}
                      />
                    </Badge>
                  ))}
                  <input
                    type="email"
                    placeholder={to.length === 0 ? 'Add recipients...' : ''}
                    className="flex-1 min-w-[200px] h-8 text-sm bg-transparent border-0 outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        const email = e.target.value.trim().replace(/,/g, '');
                        if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                          setTo([...to, email]);
                          e.target.value = '';
                        }
                      }
                    }}
                    onBlur={(e) => {
                      const email = e.target.value.trim().replace(/,/g, '');
                      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                        setTo([...to, email]);
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
                {!showCc && (
                  <Button variant="ghost" size="sm" onClick={() => setShowCc(true)}>
                    Cc
                  </Button>
                )}
                {!showBcc && (
                  <Button variant="ghost" size="sm" onClick={() => setShowBcc(true)}>
                    Bcc
                  </Button>
                )}
              </div>

              {/* Cc */}
              {showCc && (
                <div className="flex items-center gap-3 py-2 border-t">
                  <Label className="text-sm text-muted-foreground w-16 shrink-0">Cc</Label>
                  <div className="flex-1 flex flex-wrap items-center gap-1 min-h-[36px]">
                    {cc.map((email, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="h-7 text-sm font-normal gap-1"
                      >
                        {email}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => setCc(cc.filter((_, i) => i !== index))}
                        />
                      </Badge>
                    ))}
                    <input
                      type="email"
                      placeholder={cc.length === 0 ? 'Add Cc...' : ''}
                      className="flex-1 min-w-[200px] h-8 text-sm bg-transparent border-0 outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          const email = e.target.value.trim().replace(/,/g, '');
                          if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                            setCc([...cc, email]);
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Bcc */}
              {showBcc && (
                <div className="flex items-center gap-3 py-2 border-t">
                  <Label className="text-sm text-muted-foreground w-16 shrink-0">Bcc</Label>
                  <div className="flex-1 flex flex-wrap items-center gap-1 min-h-[36px]">
                    {bcc.map((email, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="h-7 text-sm font-normal gap-1"
                      >
                        {email}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => setBcc(bcc.filter((_, i) => i !== index))}
                        />
                      </Badge>
                    ))}
                    <input
                      type="email"
                      placeholder={bcc.length === 0 ? 'Add Bcc...' : ''}
                      className="flex-1 min-w-[200px] h-8 text-sm bg-transparent border-0 outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          const email = e.target.value.trim().replace(/,/g, '');
                          if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                            setBcc([...bcc, email]);
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                  </div>
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
            <div className="flex-1 overflow-hidden border-b">
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
              <div className="px-6 py-3 border-b bg-muted/10">
                <div className="flex flex-wrap gap-2">
                  {attachments.map((attachment) => {
                    const FileIcon = getFileIcon(attachment.contentType);
                    return (
                      <div
                        key={attachment.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border text-sm group"
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
            <div className="flex items-center justify-between px-6 py-4 bg-muted/20">
              <div className="flex items-center gap-3">
                {/* Send Button */}
                <div className="flex items-center">
                  <Button onClick={handleSend} disabled={sendEmail.isPending}>
                    {sendEmail.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    {scheduledAt ? 'Schedule Send' : 'Send Email'}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="ml-1 px-2">
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

  // Floating mode (original behavior)
  return (
    <TooltipProvider>
      <div
        className={cn(
          'fixed bg-background border rounded-t-lg shadow-2xl z-50 flex flex-col transition-all duration-200',
          isMinimized
            ? 'bottom-0 right-4 w-64 h-10'
            : isMaximized
              ? 'inset-4'
              : 'bottom-0 right-4 w-[560px] h-[480px]'
        )}
      >
        {/* Header */}
        <div
          className={cn(
            'flex items-center justify-between px-3 h-10 border-b bg-muted/30 rounded-t-lg cursor-pointer',
            isMinimized && 'rounded-b-lg'
          )}
          onClick={() => isMinimized && setIsMinimized(false)}
        >
          <div className="flex items-center gap-2">
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
            <div className="px-3 space-y-0">
              {/* From */}
              <div className="flex items-center gap-2 py-1.5 border-b">
                <Label className="text-xs text-muted-foreground w-10 shrink-0">From</Label>
                <Select value={accountId} onValueChange={setAccountId}>
                  <SelectTrigger className="h-7 text-xs border-0 shadow-none">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
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
                  </SelectContent>
                </Select>
              </div>

              {/* To */}
              <EmailInput label="To" value={to} onChange={setTo} placeholder="Recipients" />

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
                <EmailInput label="Cc" value={cc} onChange={setCc} placeholder="Carbon copy" />
              )}

              {/* Bcc */}
              {showBcc && (
                <EmailInput
                  label="Bcc"
                  value={bcc}
                  onChange={setBcc}
                  placeholder="Blind carbon copy"
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
            <div className="flex-1 overflow-hidden">
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
              <div className="px-3 py-2 border-t bg-muted/10">
                <div className="flex flex-wrap gap-2">
                  {attachments.map((attachment) => {
                    const FileIcon = getFileIcon(attachment.contentType);
                    return (
                      <div
                        key={attachment.id}
                        className="flex items-center gap-1.5 px-2 py-1 rounded bg-background border text-xs group"
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
            <div className="flex items-center justify-between px-3 py-2 border-t bg-muted/20">
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
                      <Button size="sm" className="rounded-l-none border-l px-2">
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
