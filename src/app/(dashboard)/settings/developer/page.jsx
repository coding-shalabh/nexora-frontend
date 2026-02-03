'use client';

import { useState, useEffect } from 'react';
import {
  Code2,
  Plus,
  Copy,
  Eye,
  EyeOff,
  MoreHorizontal,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Activity,
  ExternalLink,
  Download,
  Settings,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.nexoraos.pro/api/v1';

export default function DeveloperSettingsPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('tracking');
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateScript, setShowCreateScript] = useState(false);
  const [showNewScript, setShowNewScript] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedScript, setSelectedScript] = useState(null);
  const [newScriptData, setNewScriptData] = useState({ name: '', domain: '' });
  const [newApiKey, setNewApiKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState({});
  const [creating, setCreating] = useState(false);

  // Fetch tracking scripts
  const fetchScripts = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/tracking/scripts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setScripts(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching scripts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScripts();
  }, [token]);

  const handleCreateScript = async () => {
    if (!newScriptData.name || !newScriptData.domain) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setCreating(true);
      const res = await fetch(`${API_BASE}/tracking/scripts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newScriptData),
      });
      const data = await res.json();

      if (data.success) {
        setNewApiKey(data.data.apiKey);
        setShowCreateScript(false);
        setShowNewScript(true);
        setNewScriptData({ name: '', domain: '' });
        fetchScripts();
        toast.success('Tracking script created!');
      } else {
        toast.error(data.error?.message || 'Failed to create script');
      }
    } catch (error) {
      toast.error('Failed to create script');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteScript = async () => {
    if (!selectedScript) return;

    try {
      const res = await fetch(`${API_BASE}/tracking/scripts/${selectedScript.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Script deleted');
        setShowDeleteConfirm(false);
        setSelectedScript(null);
        fetchScripts();
      } else {
        toast.error('Failed to delete script');
      }
    } catch (error) {
      toast.error('Failed to delete script');
    }
  };

  const handleToggleScript = async (script) => {
    try {
      const res = await fetch(`${API_BASE}/tracking/scripts/${script.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !script.isActive }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(script.isActive ? 'Script disabled' : 'Script enabled');
        fetchScripts();
      }
    } catch (error) {
      toast.error('Failed to update script');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleKeyVisibility = (id) => {
    setVisibleKeys({ ...visibleKeys, [id]: !visibleKeys[id] });
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const generateEmbedCode = (apiKey, domain) => {
    return `<!-- Helix Tracker - Add before </body> tag -->
<script>
  (function() {
    var s = document.createElement('script');
    s.src = 'https://cdn.nexoraos.pro/helix-tracker.js';
    s.async = true;
    s.dataset.apiKey = '${apiKey}';
    s.dataset.domain = '${domain}';
    document.body.appendChild(s);
  })();
</script>`;
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Developer Settings</h1>
          <p className="text-muted-foreground">Manage tracking scripts and developer tools</p>
        </div>
        <Button
          onClick={() => {
            setNewScriptData({ name: '', domain: '' });
            setShowCreateScript(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Tracking Script
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Code2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{scripts.length}</p>
                <p className="text-sm text-muted-foreground">Total Scripts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{scripts.filter((s) => s.isActive).length}</p>
                <p className="text-sm text-muted-foreground">Active Scripts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2">
                <Globe className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{new Set(scripts.map((s) => s.domain)).size}</p>
                <p className="text-sm text-muted-foreground">Domains</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-100 p-2">
                <Eye className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {scripts.reduce((sum, s) => sum + (s._count?.pageViews || 0), 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Page Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tracking">Tracking Scripts</TabsTrigger>
          <TabsTrigger value="installation">Installation Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="tracking" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : scripts.length === 0 ? (
                <div className="text-center py-10">
                  <Code2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No tracking scripts yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first tracking script to start collecting analytics
                  </p>
                  <Button onClick={() => setShowCreateScript(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Script
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Domain</TableHead>
                      <TableHead>API Key</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scripts.map((script) => (
                      <TableRow key={script.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{script.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {script._count?.sessions || 0} sessions
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{script.domain}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-sm bg-muted px-2 py-1 rounded">
                              {visibleKeys[script.id]
                                ? script.apiKey
                                : `${script.apiKey?.substring(0, 8)}${'•'.repeat(12)}`}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => toggleKeyVisibility(script.id)}
                            >
                              {visibleKeys[script.id] ? (
                                <EyeOff className="h-3 w-3" />
                              ) : (
                                <Eye className="h-3 w-3" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(script.apiKey)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={script.isActive}
                              onCheckedChange={() => handleToggleScript(script)}
                            />
                            <Badge
                              className={
                                script.isActive
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }
                            >
                              {script.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatTimeAgo(script.createdAt)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  copyToClipboard(generateEmbedCode(script.apiKey, script.domain))
                                }
                              >
                                <Code2 className="mr-2 h-4 w-4" />
                                Copy Embed Code
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => copyToClipboard(script.apiKey)}>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy API Key
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedScript(script);
                                  setShowDeleteConfirm(true);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Script
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="installation" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Installation Guide
              </CardTitle>
              <CardDescription>
                Learn how to install the tracking script on your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4">
                <h4 className="font-medium mb-2">Step 1: Create a Tracking Script</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Click "Create Tracking Script" and enter your website domain. You'll receive a
                  unique API key.
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <h4 className="font-medium mb-2">Step 2: Add the Script to Your Website</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Copy and paste this code before the closing &lt;/body&gt; tag:
                </p>
                <pre className="text-sm bg-muted p-4 rounded overflow-x-auto">
                  {`<!-- Helix Tracker -->
<script>
  (function() {
    var s = document.createElement('script');
    s.src = 'https://cdn.nexoraos.pro/helix-tracker.js';
    s.async = true;
    s.dataset.apiKey = 'YOUR_API_KEY';
    s.dataset.domain = 'your-domain.com';
    document.body.appendChild(s);
  })();
</script>`}
                </pre>
              </div>

              <div className="rounded-lg border p-4">
                <h4 className="font-medium mb-2">Step 3: For Next.js / React</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Add to your layout.jsx or _app.jsx:
                </p>
                <pre className="text-sm bg-muted p-4 rounded overflow-x-auto">
                  {`import Script from 'next/script'

// In your layout component:
<Script src="/helix-tracker.js" strategy="afterInteractive" />`}
                </pre>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">What's Tracked</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>* Page views & unique visitors</li>
                    <li>* Session duration & scroll depth</li>
                    <li>* Button & link clicks</li>
                    <li>* Form submissions</li>
                    <li>* Custom events</li>
                    <li>* UTM parameters</li>
                  </ul>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">JavaScript API</h4>
                  <pre className="text-sm bg-muted p-3 rounded">
                    {`// Identify user
HelixTracker.identify('email@example.com', {
  name: 'John Doe',
  plan: 'pro'
});

// Track custom event
HelixTracker.track('button_clicked', {
  button: 'signup',
  page: '/pricing'
});`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Script Dialog */}
      <Dialog open={showCreateScript} onOpenChange={setShowCreateScript}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Tracking Script</DialogTitle>
            <DialogDescription>Create a new tracking script for your website</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="script-name">Script Name</Label>
              <Input
                id="script-name"
                placeholder="e.g., Main Website"
                value={newScriptData.name}
                onChange={(e) => setNewScriptData({ ...newScriptData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                placeholder="e.g., example.com"
                value={newScriptData.domain}
                onChange={(e) => setNewScriptData({ ...newScriptData, domain: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Enter without https:// (e.g., mysite.com)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateScript(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateScript} disabled={creating}>
              {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Script
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Script Created Dialog */}
      <Dialog open={showNewScript} onOpenChange={setShowNewScript}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Tracking Script Created
            </DialogTitle>
            <DialogDescription>
              Copy your API key now. You won't be able to see the full key again!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <p className="text-sm text-yellow-800">
                  Make sure to copy your API key now. For security reasons, we won't show it again.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Your API Key</Label>
              <div className="flex gap-2">
                <Input value={newApiKey} readOnly className="font-mono text-sm" />
                <Button variant="outline" onClick={() => copyToClipboard(newApiKey)}>
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Embed Code</Label>
              <Textarea
                readOnly
                className="font-mono text-xs h-32"
                value={generateEmbedCode(newApiKey, newScriptData.domain || 'your-domain.com')}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  copyToClipboard(
                    generateEmbedCode(newApiKey, newScriptData.domain || 'your-domain.com')
                  )
                }
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Embed Code
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowNewScript(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tracking Script?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the tracking script "{selectedScript?.name}" and all
              associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteScript}>
              Delete Script
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
