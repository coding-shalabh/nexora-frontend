'use client';

import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ListTodo,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  User,
} from 'lucide-react';

const statusConfig = {
  TODO: { label: 'To Do', color: 'bg-gray-500' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-500' },
  IN_REVIEW: { label: 'In Review', color: 'bg-purple-500' },
  DONE: { label: 'Done', color: 'bg-green-500' },
};

const priorityConfig = {
  LOW: { label: 'Low', color: 'text-gray-500' },
  MEDIUM: { label: 'Medium', color: 'text-blue-500' },
  HIGH: { label: 'High', color: 'text-orange-500' },
  URGENT: { label: 'Urgent', color: 'text-red-500' },
};

// Mock tasks assigned to current user
const mockMyTasks = [
  {
    id: '1',
    title: 'Review project requirements',
    project: { name: 'Website Redesign', color: '#6366f1' },
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    dueDate: '2024-02-10',
  },
  {
    id: '2',
    title: 'Create wireframes',
    project: { name: 'Website Redesign', color: '#6366f1' },
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: '2024-02-15',
  },
  {
    id: '3',
    title: 'Set up development environment',
    project: { name: 'Mobile App', color: '#10b981' },
    status: 'DONE',
    priority: 'LOW',
    dueDate: '2024-02-05',
  },
];

export default function MyTasksPage() {
  const tasks = mockMyTasks;
  const isLoading = false;

  const stats = [
    createStat('My Tasks', tasks.length.toString(), ListTodo, 'blue'),
    createStat('To Do', tasks.filter((t) => t.status === 'TODO').length.toString(), Clock, 'gray'),
    createStat(
      'In Progress',
      tasks.filter((t) => t.status === 'IN_PROGRESS').length.toString(),
      Loader2,
      'blue'
    ),
    createStat(
      'Done',
      tasks.filter((t) => t.status === 'DONE').length.toString(),
      CheckCircle2,
      'green'
    ),
  ];

  return (
    <HubLayout
      hubId="projects"
      title="My Tasks"
      description="Tasks assigned to you across all projects"
      stats={stats}
      showFixedMenu={false}
      actions={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      }
    >
      <div className="h-full overflow-auto p-6 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : tasks.length === 0 ? (
          <Card className="p-12 text-center">
            <ListTodo className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No tasks assigned</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any tasks assigned to you yet.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <Card key={task.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <Checkbox checked={task.status === 'DONE'} className="mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`font-medium ${task.status === 'DONE' ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: task.project.color }}
                        />
                        {task.project.name}
                      </span>
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={statusConfig[task.status]?.color}>
                      {statusConfig[task.status]?.label}
                    </Badge>
                    <span className={`text-sm font-medium ${priorityConfig[task.priority]?.color}`}>
                      {priorityConfig[task.priority]?.label}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </HubLayout>
  );
}
