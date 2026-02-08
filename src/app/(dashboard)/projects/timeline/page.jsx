'use client';

import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Plus,
  FolderKanban,
  Clock,
  CheckCircle2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useProjects } from '@/hooks';
import { useState } from 'react';

export default function ProjectsTimelinePage() {
  const { data, isLoading } = useProjects({});
  const projects = data?.projects || [];
  const [viewMonth, setViewMonth] = useState(new Date());

  const stats = [
    createStat('Total', projects.length.toString(), FolderKanban, 'blue'),
    createStat(
      'Active',
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
    createStat(
      'This Month',
      projects
        .filter((p) => {
          if (!p.endDate) return false;
          const end = new Date(p.endDate);
          return (
            end.getMonth() === viewMonth.getMonth() && end.getFullYear() === viewMonth.getFullYear()
          );
        })
        .length.toString(),
      Calendar,
      'purple'
    ),
  ];

  const monthName = viewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <HubLayout
      hubId="projects"
      title="Timeline"
      description="Gantt-style project timeline view"
      stats={stats}
      showFixedMenu={false}
      actions={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      }
    >
      <div className="h-full overflow-auto p-6 space-y-6">
        {/* Month Navigation */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1))
              }
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <h3 className="text-lg font-semibold">{monthName}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1))
              }
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : projects.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-4">
              Create projects to see them on the timeline.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="space-y-4">
              {projects.map((project) => {
                const startDate = project.startDate ? new Date(project.startDate) : null;
                const endDate = project.endDate ? new Date(project.endDate) : null;

                return (
                  <div
                    key={project.id}
                    className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="w-48 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="font-medium truncate">{project.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {startDate ? startDate.toLocaleDateString() : 'No start'} -{' '}
                        {endDate ? endDate.toLocaleDateString() : 'No end'}
                      </div>
                    </div>
                    <div className="flex-1 h-8 bg-muted rounded-full relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 rounded-full"
                        style={{
                          backgroundColor: project.color || '#6366f1',
                          width: `${project.progress || 0}%`,
                          left: 0,
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                        {project.progress || 0}%
                      </div>
                    </div>
                    <Badge variant="secondary" className="flex-shrink-0">
                      {project.status?.replace('_', ' ')}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </HubLayout>
  );
}
