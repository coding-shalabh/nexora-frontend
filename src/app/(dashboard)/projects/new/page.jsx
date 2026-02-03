'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Calendar, DollarSign, Users, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateProject, useProjects } from '@/hooks';
import { useToast } from '@/hooks/use-toast';

const statusConfig = {
  PLANNING: { label: 'Planning', color: 'bg-gray-500' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-500' },
  ON_HOLD: { label: 'On Hold', color: 'bg-yellow-500' },
  COMPLETED: { label: 'Completed', color: 'bg-green-500' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-500' },
};

const priorityConfig = {
  LOW: { label: 'Low', color: 'bg-gray-400' },
  MEDIUM: { label: 'Medium', color: 'bg-blue-400' },
  HIGH: { label: 'High', color: 'bg-orange-400' },
  URGENT: { label: 'Urgent', color: 'bg-red-500' },
};

const colorPresets = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#f97316', // Orange
  '#eab308', // Yellow
  '#84cc16', // Lime
  '#22c55e', // Green
  '#14b8a6', // Teal
  '#06b6d4', // Cyan
  '#0ea5e9', // Sky
  '#3b82f6', // Blue
];

export default function NewProjectPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createProject = useCreateProject();
  const { data: projectsData } = useProjects({ limit: 100 });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'PLANNING',
    priority: 'MEDIUM',
    startDate: '',
    endDate: '',
    budget: '',
    currency: 'USD',
    color: '#6366f1',
    templateId: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (formData.budget && parseFloat(formData.budget) < 0) {
      newErrors.budget = 'Budget must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const projectData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        templateId: formData.templateId || undefined,
      };

      const result = await createProject.mutateAsync(projectData);

      toast({
        title: 'Success',
        description: 'Project created successfully',
      });

      router.push(`/projects/${result.id}`);
    } catch (err) {
      console.error('Failed to create project:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to create project',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    if (
      Object.values(formData).some(
        (val) =>
          val !== '' && val !== 'PLANNING' && val !== 'MEDIUM' && val !== 'USD' && val !== '#6366f1'
      )
    ) {
      if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
        router.push('/projects');
      }
    } else {
      router.push('/projects');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/projects')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create New Project</h1>
            <p className="text-muted-foreground">
              Set up a new project to track tasks and progress
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FolderKanban className="h-5 w-5" />
              Basic Information
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Project Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter project name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your project goals and objectives"
                  rows={4}
                />
                <p className="text-sm text-muted-foreground">
                  Provide a clear description of what this project aims to achieve
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusConfig).map(([value, config]) => (
                        <SelectItem key={value} value={value}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(priorityConfig).map(([value, config]) => (
                        <SelectItem key={value} value={value}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>

          {/* Timeline & Budget */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timeline & Budget
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className={errors.endDate ? 'border-red-500' : ''}
                  />
                  {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className={errors.budget ? 'border-red-500' : ''}
                  />
                  {errors.budget && <p className="text-sm text-red-500">{errors.budget}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="CAD">CAD ($)</SelectItem>
                      <SelectItem value="AUD">AUD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>

          {/* Appearance */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Appearance</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Project Color</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-20 h-12 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#6366f1"
                    className="flex-1"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {colorPresets.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className="w-8 h-8 rounded-md border-2 transition-all hover:scale-110"
                      style={{
                        backgroundColor: color,
                        borderColor: formData.color === color ? '#000' : 'transparent',
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Template (Optional) */}
          {projectsData?.projects && projectsData.projects.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Template (Optional)</h3>
              <div className="space-y-2">
                <Label htmlFor="template">Use existing project as template</Label>
                <Select
                  value={formData.templateId}
                  onValueChange={(value) => setFormData({ ...formData, templateId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Template</SelectItem>
                    {projectsData.projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: project.color }}
                          />
                          {project.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Copy structure and tasks from an existing project
                </p>
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-4 sticky bottom-0 bg-background p-4 border-t">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={createProject.isPending}>
              {createProject.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Project...
                </>
              ) : (
                <>
                  <FolderKanban className="h-4 w-4 mr-2" />
                  Create Project
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
