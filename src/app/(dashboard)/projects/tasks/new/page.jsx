'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  ListTodo,
  Calendar,
  User,
  Tag,
  Link as LinkIcon,
  Plus,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateTask, useProjects, useMilestones } from '@/hooks';
import { useToast } from '@/hooks/use-toast';
import { UnifiedLayout } from '@/components/layout/unified';

const statusConfig = {
  TODO: { label: 'To Do', color: 'bg-gray-500' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-500' },
  IN_REVIEW: { label: 'In Review', color: 'bg-purple-500' },
  BLOCKED: { label: 'Blocked', color: 'bg-red-500' },
  COMPLETED: { label: 'Completed', color: 'bg-green-500' },
  CANCELLED: { label: 'Cancelled', color: 'bg-gray-400' },
};

const priorityConfig = {
  LOW: { label: 'Low', color: 'bg-gray-400' },
  MEDIUM: { label: 'Medium', color: 'bg-blue-400' },
  HIGH: { label: 'High', color: 'bg-orange-400' },
  URGENT: { label: 'Urgent', color: 'bg-red-500' },
};

export default function NewTaskPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const createTask = useCreateTask();

  const projectIdFromUrl = searchParams.get('projectId');

  const { data: projectsData } = useProjects({ limit: 100 });
  const projects = projectsData?.projects || [];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    projectId: projectIdFromUrl || '',
    milestoneId: '',
    assigneeId: '',
    dueDate: '',
    startDate: '',
    estimatedHours: '',
    labels: [],
  });

  const [newLabel, setNewLabel] = useState('');
  const [errors, setErrors] = useState({});

  const selectedProject = projects.find((p) => p.id === formData.projectId);
  const { data: milestonesData } = useMilestones(formData.projectId);
  const milestones = milestonesData?.milestones || [];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (formData.startDate && formData.dueDate) {
      if (new Date(formData.startDate) > new Date(formData.dueDate)) {
        newErrors.dueDate = 'Due date must be after start date';
      }
    }

    if (formData.estimatedHours && parseFloat(formData.estimatedHours) < 0) {
      newErrors.estimatedHours = 'Estimated hours must be positive';
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
      const taskData = {
        ...formData,
        projectId: formData.projectId || undefined,
        milestoneId: formData.milestoneId || undefined,
        assigneeId: formData.assigneeId || undefined,
        dueDate: formData.dueDate || undefined,
        startDate: formData.startDate || undefined,
        estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : undefined,
      };

      const result = await createTask.mutateAsync(taskData);

      toast({
        title: 'Success',
        description: 'Task created successfully',
      });

      if (formData.projectId) {
        router.push(`/projects/${formData.projectId}/tasks`);
      } else {
        router.push(`/projects/tasks/${result.id}`);
      }
    } catch (err) {
      console.error('Failed to create task:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to create task',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    if (
      Object.values(formData).some(
        (val) => val !== '' && val !== 'TODO' && val !== 'MEDIUM' && val.length !== 0
      )
    ) {
      if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
        if (formData.projectId) {
          router.push(`/projects/${formData.projectId}/tasks`);
        } else {
          router.push('/projects/tasks');
        }
      }
    } else {
      if (formData.projectId) {
        router.push(`/projects/${formData.projectId}/tasks`);
      } else {
        router.push('/projects/tasks');
      }
    }
  };

  const addLabel = () => {
    if (newLabel.trim() && !formData.labels.includes(newLabel.trim())) {
      setFormData({
        ...formData,
        labels: [...formData.labels, newLabel.trim()],
      });
      setNewLabel('');
    }
  };

  const removeLabel = (label) => {
    setFormData({
      ...formData,
      labels: formData.labels.filter((l) => l !== label),
    });
  };

  return (
    <UnifiedLayout hubId="projects" pageTitle="New Task">
      <div className="h-full overflow-y-auto p-6">
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (formData.projectId) {
                    router.push(`/projects/${formData.projectId}/tasks`);
                  } else {
                    router.push('/projects/tasks');
                  }
                }}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Create New Task</h1>
                <p className="text-muted-foreground">Add a new task to track work and progress</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Basic Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ListTodo className="h-5 w-5" />
                  Task Details
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Task Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter a clear, descriptive task title"
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Provide detailed information about what needs to be done"
                      rows={5}
                    />
                    <p className="text-sm text-muted-foreground">
                      Add acceptance criteria, requirements, or any relevant details
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

              {/* Project & Assignment */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Project & Assignment
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="project">Project</Label>
                    <Select
                      value={formData.projectId}
                      onValueChange={(value) => {
                        setFormData({ ...formData, projectId: value, milestoneId: '' });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select project (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Project</SelectItem>
                        {projects.map((project) => (
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
                    {selectedProject && (
                      <p className="text-sm text-muted-foreground">
                        Project: {selectedProject.name}
                      </p>
                    )}
                  </div>

                  {milestones.length > 0 && formData.projectId && (
                    <div className="space-y-2">
                      <Label htmlFor="milestone">Milestone</Label>
                      <Select
                        value={formData.milestoneId}
                        onValueChange={(value) => setFormData({ ...formData, milestoneId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select milestone (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Milestone</SelectItem>
                          {milestones.map((milestone) => (
                            <SelectItem key={milestone.id} value={milestone.id}>
                              {milestone.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="assignee">Assignee</Label>
                    <Select
                      value={formData.assigneeId}
                      onValueChange={(value) => setFormData({ ...formData, assigneeId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Assign to someone (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {/* Add team members here */}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              {/* Timeline */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline & Estimation
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
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className={errors.dueDate ? 'border-red-500' : ''}
                      />
                      {errors.dueDate && <p className="text-sm text-red-500">{errors.dueDate}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedHours">Estimated Hours</Label>
                    <Input
                      id="estimatedHours"
                      type="number"
                      value={formData.estimatedHours}
                      onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                      placeholder="0"
                      min="0"
                      step="0.5"
                      className={errors.estimatedHours ? 'border-red-500' : ''}
                    />
                    {errors.estimatedHours && (
                      <p className="text-sm text-red-500">{errors.estimatedHours}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Estimate how long this task will take to complete
                    </p>
                  </div>
                </div>
              </Card>

              {/* Labels */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Labels
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      placeholder="Add a label"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addLabel();
                        }
                      }}
                    />
                    <Button type="button" onClick={addLabel} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {formData.labels.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.labels.map((label) => (
                        <Badge key={label} variant="secondary" className="pl-3 pr-1">
                          {label}
                          <button
                            type="button"
                            onClick={() => removeLabel(label)}
                            className="ml-2 hover:bg-muted rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              {/* Actions */}
              <div className="flex items-center justify-between gap-4 sticky bottom-0 bg-background p-4 border-t">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createTask.isPending}>
                  {createTask.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Task...
                    </>
                  ) : (
                    <>
                      <ListTodo className="h-4 w-4 mr-2" />
                      Create Task
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </UnifiedLayout>
  );
}
