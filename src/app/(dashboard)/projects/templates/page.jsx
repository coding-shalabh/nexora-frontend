'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  MoreHorizontal,
  FolderKanban,
  CheckCircle2,
  Clock,
  Loader2,
  Copy,
  Edit,
  Trash2,
  Star,
  StarOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useProjects } from '@/hooks';

const templateCategories = {
  SOFTWARE: { label: 'Software Development', color: 'bg-blue-500' },
  MARKETING: { label: 'Marketing Campaign', color: 'bg-purple-500' },
  DESIGN: { label: 'Design Project', color: 'bg-pink-500' },
  CONSTRUCTION: { label: 'Construction', color: 'bg-orange-500' },
  EVENT: { label: 'Event Planning', color: 'bg-green-500' },
  GENERAL: { label: 'General', color: 'bg-gray-500' },
};

// Mock templates - replace with actual API call
const builtInTemplates = [
  {
    id: 'template-1',
    name: 'Software Development Project',
    description: 'Complete template for software projects with sprints, releases, and testing phases',
    category: 'SOFTWARE',
    tasksCount: 24,
    milestonesCount: 5,
    isBuiltIn: true,
    isFavorite: false,
  },
  {
    id: 'template-2',
    name: 'Marketing Campaign Launch',
    description: 'End-to-end marketing campaign with content creation, social media, and analytics',
    category: 'MARKETING',
    tasksCount: 18,
    milestonesCount: 4,
    isBuiltIn: true,
    isFavorite: true,
  },
  {
    id: 'template-3',
    name: 'Website Redesign',
    description: 'Complete website redesign workflow including research, design, development, and launch',
    category: 'DESIGN',
    tasksCount: 32,
    milestonesCount: 6,
    isBuiltIn: true,
    isFavorite: false,
  },
  {
    id: 'template-4',
    name: 'Product Launch',
    description: 'Product launch template with marketing, sales, and support preparation',
    category: 'MARKETING',
    tasksCount: 28,
    milestonesCount: 5,
    isBuiltIn: true,
    isFavorite: false,
  },
];

export default function ProjectTemplatesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [favorites, setFavorites] = useState(['template-2']);

  const { data: projectsData } = useProjects({ limit: 100 });
  const userTemplates = projectsData?.projects?.filter((p) => p.isTemplate) || [];

  const allTemplates = [...builtInTemplates, ...userTemplates];

  const filteredTemplates = allTemplates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const favoriteTemplates = filteredTemplates.filter((t) => favorites.includes(t.id));
  const otherTemplates = filteredTemplates.filter((t) => !favorites.includes(t.id));

  const toggleFavorite = (templateId) => {
    setFavorites((prev) =>
      prev.includes(templateId)
        ? prev.filter((id) => id !== templateId)
        : [...prev, templateId]
    );
  };

  const handleUseTemplate = (template) => {
    router.push(`/projects/new?template=${template.id}`);
  };

  const handleCreateFromProject = (project) => {
    router.push(`/projects/new?templateId=${project.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Project Templates</h1>
          <p className="text-muted-foreground">
            Start new projects faster with pre-built templates
          </p>
        </div>
        <Button onClick={() => router.push('/projects/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Blank Project
        </Button>
      </div>

      {/* Search & Filter */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-64 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('')}
            >
              All
            </Button>
            {Object.entries(templateCategories).map(([key, config]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(key)}
              >
                {config.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Favorites Section */}
      {favoriteTemplates.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            <h2 className="text-xl font-semibold">Favorite Templates</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isFavorite={true}
                onToggleFavorite={() => toggleFavorite(template.id)}
                onUse={() => handleUseTemplate(template)}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Templates Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          {favoriteTemplates.length > 0 ? 'All Templates' : 'Templates'}
        </h2>
        {otherTemplates.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No templates found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedCategory
                  ? 'Try adjusting your filters'
                  : 'Create your first custom template from an existing project'}
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isFavorite={favorites.includes(template.id)}
                onToggleFavorite={() => toggleFavorite(template.id)}
                onUse={() => handleUseTemplate(template)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Custom Template from Projects */}
      {userTemplates.length === 0 && projectsData?.projects?.length > 0 && (
        <Card className="p-6 bg-muted/50">
          <h3 className="text-lg font-semibold mb-4">
            Create Custom Template from Your Projects
          </h3>
          <p className="text-muted-foreground mb-4">
            Turn any of your existing projects into reusable templates
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {projectsData.projects.slice(0, 3).map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-background"
              >
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="font-medium truncate">{project.name}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCreateFromProject(project)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Use
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function TemplateCard({ template, isFavorite, onToggleFavorite, onUse }) {
  const category = templateCategories[template.category];

  return (
    <Card className="p-5 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold">{template.name}</h3>
            {template.isBuiltIn && (
              <Badge variant="secondary" className="text-xs">
                Built-in
              </Badge>
            )}
          </div>
          {category && (
            <Badge variant="outline" className={cn(category.color, 'text-white text-xs mb-2')}>
              {category.label}
            </Badge>
          )}
        </div>
        <button
          onClick={onToggleFavorite}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {isFavorite ? (
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          ) : (
            <StarOff className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {template.description}
      </p>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <CheckCircle2 className="h-4 w-4" />
          <span>{template.tasksCount} tasks</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{template.milestonesCount} milestones</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button className="flex-1" onClick={onUse}>
          <Plus className="h-4 w-4 mr-2" />
          Use Template
        </Button>
        {!template.isBuiltIn && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit Template
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </Card>
  );
}
