'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  Code,
  Globe,
  Plus,
  Copy,
  Check,
  RefreshCw,
  Settings,
  Trash2,
  Key,
  Loader2,
  ExternalLink,
  Eye,
  MousePointer,
  FileText,
  Radio,
  AlertTriangle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function generateEmbedCode(apiKey, domain) {
  return `<!-- Nexora Analytics -->
<script>
(function(n,e,x,o,r,a){n.NexoraAnalytics=n.NexoraAnalytics||function(){
(n.NexoraAnalytics.q=n.NexoraAnalytics.q||[]).push(arguments)};
a=e.createElement('script');a.async=1;a.src=x;
r=e.getElementsByTagName('script')[0];r.parentNode.insertBefore(a,r);
})(window,document,'${typeof window !== 'undefined' ? window.location.origin : ''}/sdk/nexora-analytics.min.js');

NexoraAnalytics('init', '${apiKey}', {
  trackPageViews: true,
  trackForms: true,
  trackClicks: false,
  respectDNT: true
});
</script>
<!-- End Nexora Analytics -->`;
}

function TrackingScriptCard({ script, onCopyCode, onRegenerate, onDelete, onUpdate }) {
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const code = generateEmbedCode(script.apiKey, script.domain);
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopyCode?.();
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Globe className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{script.name}</h3>
              <Badge variant={script.isActive ? 'default' : 'secondary'}>
                {script.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{script.domain}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
            {copied ? 'Copied!' : 'Copy Code'}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* API Key */}
      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">API Key</p>
            <p className="font-mono text-sm">{script.apiKey}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRegenerate(script.id)}
            className="text-orange-500 hover:text-orange-600"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Regenerate
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <>
          <Separator className="my-4" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Active Status</p>
                <p className="text-sm text-muted-foreground">
                  Enable or disable tracking for this script
                </p>
              </div>
              <Switch
                checked={script.isActive}
                onCheckedChange={(checked) => onUpdate(script.id, { isActive: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-500">Delete Script</p>
                <p className="text-sm text-muted-foreground">
                  Permanently remove this tracking script
                </p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => onDelete(script.id)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Quick Stats */}
      <Separator className="my-4" />
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center">
          <Eye className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
          <p className="text-lg font-bold">{script.pageViewCount || 0}</p>
          <p className="text-xs text-muted-foreground">Page Views</p>
        </div>
        <div className="text-center">
          <Radio className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
          <p className="text-lg font-bold">{script.sessionCount || 0}</p>
          <p className="text-xs text-muted-foreground">Sessions</p>
        </div>
        <div className="text-center">
          <MousePointer className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
          <p className="text-lg font-bold">{script.eventCount || 0}</p>
          <p className="text-xs text-muted-foreground">Events</p>
        </div>
        <div className="text-center">
          <FileText className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
          <p className="text-lg font-bold">{script.formCount || 0}</p>
          <p className="text-xs text-muted-foreground">Forms</p>
        </div>
      </div>
    </Card>
  );
}

function CreateScriptDialog({ open, onOpenChange, onCreate }) {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!name || !domain) return;

    setIsCreating(true);
    try {
      await onCreate({ name, domain });
      setName('');
      setDomain('');
      onOpenChange(false);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Tracking Script</DialogTitle>
          <DialogDescription>
            Create a new tracking script to monitor visitor activity on your website.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Script Name</Label>
            <Input
              id="name"
              placeholder="My Website"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="domain">Website Domain</Label>
            <Input
              id="domain"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter the domain without http:// or https://
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name || !domain || isCreating}>
            {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Create Script
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function TrackingScriptsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['tracking-scripts'],
    queryFn: () => api.get('/tracking/scripts'),
  });

  const scripts = data?.data || [];

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/tracking/scripts', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracking-scripts'] });
      toast({
        title: 'Script created',
        description: 'Your tracking script has been created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to create script',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/tracking/scripts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracking-scripts'] });
      toast({
        title: 'Script updated',
        description: 'Your tracking script has been updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to update script',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/tracking/scripts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracking-scripts'] });
      toast({
        title: 'Script deleted',
        description: 'Your tracking script has been removed.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete script',
        variant: 'destructive',
      });
    },
  });

  const regenerateMutation = useMutation({
    mutationFn: (id) => api.post(`/tracking/scripts/${id}/regenerate-key`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracking-scripts'] });
      toast({
        title: 'API key regenerated',
        description:
          'Your tracking script has a new API key. Update your website with the new embed code.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to regenerate API key',
        variant: 'destructive',
      });
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tracking Scripts</h1>
          <p className="text-muted-foreground">Manage tracking scripts for your websites</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Script
          </Button>
        </div>
      </div>

      {/* How it works */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Code className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <p className="font-medium text-blue-800 dark:text-blue-200">How it works</p>
            <ol className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1 list-decimal list-inside">
              <li>Create a tracking script for each website you want to track</li>
              <li>
                Copy the embed code and paste it in your website's HTML (before &lt;/head&gt;)
              </li>
              <li>Visitor data will start appearing in your analytics dashboard</li>
            </ol>
          </div>
        </div>
      </Card>

      {/* Scripts List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : scripts.length === 0 ? (
        <Card className="p-12 text-center">
          <Globe className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No tracking scripts yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first tracking script to start monitoring visitor activity on your website.
          </p>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Script
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {scripts.map((script) => (
            <TrackingScriptCard
              key={script.id}
              script={script}
              onCopyCode={() => {
                toast({
                  title: 'Code copied!',
                  description: 'Paste this code in your website HTML before </head>',
                });
              }}
              onRegenerate={(id) => regenerateMutation.mutate(id)}
              onDelete={(id) => setDeleteId(id)}
              onUpdate={(id, data) => updateMutation.mutate({ id, data })}
            />
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <CreateScriptDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreate={(data) => createMutation.mutateAsync(data)}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Tracking Script?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this tracking script and stop collecting data from the
              associated website. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                deleteMutation.mutate(deleteId);
                setDeleteId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
