'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  Search,
  MoreHorizontal,
  LayoutDashboard,
  Star,
  StarOff,
  Copy,
  Trash2,
  Edit,
  Share2,
  Lock,
  Globe,
  Users,
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  Target,
  DollarSign,
  Eye,
  Calendar,
  Clock,
  Loader2,
} from 'lucide-react';

// Mock data for dashboards
const mockDashboards = [
  {
    id: '1',
    name: 'Executive Overview',
    description: 'High-level KPIs and business metrics',
    widgets: 8,
    visibility: 'public',
    starred: true,
    updatedAt: '2024-01-20T10:00:00',
    createdBy: 'Admin User',
    views: 1250,
    icon: 'bar-chart',
  },
  {
    id: '2',
    name: 'Sales Performance',
    description: 'Track sales team performance and deal pipeline',
    widgets: 12,
    visibility: 'team',
    starred: true,
    updatedAt: '2024-01-19T15:30:00',
    createdBy: 'Sales Manager',
    views: 890,
    icon: 'trending-up',
  },
  {
    id: '3',
    name: 'Marketing Analytics',
    description: 'Campaign performance and lead generation metrics',
    widgets: 10,
    visibility: 'team',
    starred: false,
    updatedAt: '2024-01-18T09:00:00',
    createdBy: 'Marketing Lead',
    views: 456,
    icon: 'pie-chart',
  },
  {
    id: '4',
    name: 'Customer Health',
    description: 'Customer satisfaction and support metrics',
    widgets: 6,
    visibility: 'private',
    starred: false,
    updatedAt: '2024-01-17T14:00:00',
    createdBy: 'Support Lead',
    views: 234,
    icon: 'activity',
  },
  {
    id: '5',
    name: 'Revenue Tracking',
    description: 'MRR, ARR, and financial KPIs',
    widgets: 9,
    visibility: 'public',
    starred: false,
    updatedAt: '2024-01-16T11:00:00',
    createdBy: 'Finance Team',
    views: 678,
    icon: 'dollar',
  },
];

const iconMap = {
  'bar-chart': BarChart3,
  'trending-up': TrendingUp,
  'pie-chart': PieChart,
  'activity': Activity,
  'target': Target,
  'dollar': DollarSign,
};

const visibilityConfig = {
  public: { label: 'Public', icon: Globe, color: 'text-green-600' },
  team: { label: 'Team', icon: Users, color: 'text-blue-600' },
  private: { label: 'Private', icon: Lock, color: 'text-gray-600' },
};

function CreateDashboardDialog({ open, onOpenChange, onSubmit, editDashboard }) {
  const [formData, setFormData] = useState({
    name: editDashboard?.name || '',
    description: editDashboard?.description || '',
    visibility: editDashboard?.visibility || 'private',
    icon: editDashboard?.icon || 'bar-chart',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', description: '', visibility: 'private', icon: 'bar-chart' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editDashboard ? 'Edit Dashboard' : 'Create New Dashboard'}</DialogTitle>
          <DialogDescription>
            {editDashboard
              ? 'Update your dashboard settings'
              : 'Create a custom dashboard to track your key metrics'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Dashboard Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Sales Performance"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What does this dashboard track?"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Visibility</Label>
              <Select
                value={formData.visibility}
                onValueChange={(value) => setFormData({ ...formData, visibility: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => setFormData({ ...formData, icon: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar-chart">Bar Chart</SelectItem>
                  <SelectItem value="trending-up">Trending</SelectItem>
                  <SelectItem value="pie-chart">Pie Chart</SelectItem>
                  <SelectItem value="activity">Activity</SelectItem>
                  <SelectItem value="target">Target</SelectItem>
                  <SelectItem value="dollar">Revenue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{editDashboard ? 'Save Changes' : 'Create Dashboard'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function DashboardsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisibility, setFilterVisibility] = useState('all');
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDashboard, setEditDashboard] = useState(null);
  const [dashboards, setDashboards] = useState(mockDashboards);

  const filteredDashboards = dashboards.filter((dashboard) => {
    if (filterVisibility !== 'all' && dashboard.visibility !== filterVisibility) return false;
    if (showStarredOnly && !dashboard.starred) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        dashboard.name.toLowerCase().includes(query) ||
        dashboard.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleCreateDashboard = (formData) => {
    if (editDashboard) {
      setDashboards(dashboards.map((d) =>
        d.id === editDashboard.id ? { ...d, ...formData, updatedAt: new Date().toISOString() } : d
      ));
    } else {
      const newDashboard = {
        id: Date.now().toString(),
        ...formData,
        widgets: 0,
        starred: false,
        updatedAt: new Date().toISOString(),
        createdBy: 'Current User',
        views: 0,
      };
      setDashboards([newDashboard, ...dashboards]);
    }
    setCreateDialogOpen(false);
    setEditDashboard(null);
  };

  const handleToggleStar = (id) => {
    setDashboards(dashboards.map((d) =>
      d.id === id ? { ...d, starred: !d.starred } : d
    ));
  };

  const handleDuplicate = (dashboard) => {
    const duplicate = {
      ...dashboard,
      id: Date.now().toString(),
      name: `${dashboard.name} (Copy)`,
      starred: false,
      views: 0,
      updatedAt: new Date().toISOString(),
    };
    setDashboards([duplicate, ...dashboards]);
  };

  const handleDelete = (id) => {
    setDashboards(dashboards.filter((d) => d.id !== id));
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboards</h1>
          <p className="text-muted-foreground">Create and manage custom dashboards</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Dashboard
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search dashboards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterVisibility} onValueChange={setFilterVisibility}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dashboards</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="team">Team</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={showStarredOnly ? 'secondary' : 'outline'}
            onClick={() => setShowStarredOnly(!showStarredOnly)}
            className="gap-2"
          >
            <Star className={cn('h-4 w-4', showStarredOnly && 'fill-yellow-400 text-yellow-400')} />
            Starred
          </Button>
        </div>
      </Card>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDashboards.map((dashboard) => {
          const IconComponent = iconMap[dashboard.icon] || LayoutDashboard;
          const VisibilityIcon = visibilityConfig[dashboard.visibility].icon;

          return (
            <Card key={dashboard.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{dashboard.name}</h3>
                        <button
                          onClick={() => handleToggleStar(dashboard.id)}
                          className="text-muted-foreground hover:text-yellow-500"
                        >
                          <Star
                            className={cn(
                              'h-4 w-4',
                              dashboard.starred && 'fill-yellow-400 text-yellow-400'
                            )}
                          />
                        </button>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <VisibilityIcon className={cn('h-3 w-3', visibilityConfig[dashboard.visibility].color)} />
                        <span>{visibilityConfig[dashboard.visibility].label}</span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setEditDashboard(dashboard);
                          setCreateDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(dashboard)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(dashboard.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                  {dashboard.description}
                </p>

                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>{dashboard.widgets} widgets</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{dashboard.views}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
                  <span>By {dashboard.createdBy}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(dashboard.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredDashboards.length === 0 && (
        <Card className="p-12 text-center">
          <LayoutDashboard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No dashboards found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? 'Try adjusting your search or filters'
              : 'Create your first dashboard to start tracking metrics'}
          </p>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Dashboard
          </Button>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <CreateDashboardDialog
        open={createDialogOpen}
        onOpenChange={(open) => {
          setCreateDialogOpen(open);
          if (!open) setEditDashboard(null);
        }}
        onSubmit={handleCreateDashboard}
        editDashboard={editDashboard}
      />
    </div>
  );
}
