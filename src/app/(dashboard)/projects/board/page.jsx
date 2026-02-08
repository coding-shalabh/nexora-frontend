'use client';

import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LayoutGrid,
  Plus,
  FolderKanban,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useProjects } from '@/hooks';

const columns = [
  { id: 'PLANNING', title: 'Planning', color: 'bg-gray-500' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-500' },
  { id: 'ON_HOLD', title: 'On Hold', color: 'bg-yellow-500' },
  { id: 'COMPLETED', title: 'Completed', color: 'bg-green-500' },
];

export default function ProjectsBoardPage() {
  const { data, isLoading } = useProjects({});
  const projects = data?.projects || [];

  const stats = [
    createStat('Total', projects.length.toString(), FolderKanban, 'blue'),
    createStat(
      'Planning',
      projects.filter((p) => p.status === 'PLANNING').length.toString(),
      Clock,
      'gray'
    ),
    createStat(
      'In Progress',
      projects.filter((p) => p.status === 'IN_PROGRESS').length.toString(),
      Loader2,
      'blue'
    ),
    createStat(
      'Completed',
      projects.filter((p) => p.status === 'COMPLETED').length.toString(),
      CheckCircle2,
      'green'
    ),
  ];

  return (
    <HubLayout
      hubId="projects"
      title="Project Board"
      description="Kanban view of all projects"
      stats={stats}
      showFixedMenu={false}
      actions={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      }
    >
      <div className="h-full overflow-x-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex gap-4 min-w-max">
            {columns.map((column) => {
              const columnProjects = projects.filter((p) => p.status === column.id);
              return (
                <div key={column.id} className="w-72 flex-shrink-0">
                  <div className="flex items-center gap-2 mb-3 px-2">
                    <div className={`h-3 w-3 rounded-full ${column.color}`} />
                    <h3 className="font-semibold text-sm">{column.title}</h3>
                    <Badge variant="secondary" className="ml-auto">
                      {columnProjects.length}
                    </Badge>
                  </div>
                  <div className="space-y-3 min-h-[200px] bg-muted/30 rounded-lg p-2">
                    {columnProjects.length === 0 ? (
                      <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                        No projects
                      </div>
                    ) : (
                      columnProjects.map((project) => (
                        <Card
                          key={project.id}
                          className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: project.color }}
                            />
                            <span className="font-medium text-sm truncate">{project.name}</span>
                          </div>
                          {project.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                              {project.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{project._count?.tasks || 0} tasks</span>
                            <span>{project.progress || 0}%</span>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </HubLayout>
  );
}
