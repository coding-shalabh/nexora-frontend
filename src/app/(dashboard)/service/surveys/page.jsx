'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus,
  Star,
  MessageSquare,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Users,
  TrendingUp,
  Copy,
  Send,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UnifiedLayout, createStat } from '@/components/layout/unified';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  useSurveys,
  useSurveyStats,
  useDeleteSurvey,
  useDuplicateSurvey,
} from '@/hooks/use-surveys';

const surveyTypes = {
  CSAT: { label: 'CSAT', color: 'bg-blue-100 text-blue-700', icon: Star },
  NPS: { label: 'NPS', color: 'bg-purple-100 text-purple-700', icon: TrendingUp },
  CES: { label: 'CES', color: 'bg-green-100 text-green-700', icon: BarChart3 },
  CUSTOM: { label: 'Custom', color: 'bg-gray-100 text-gray-700', icon: MessageSquare },
};

export default function SurveysPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: surveysData, isLoading } = useSurveys({ search: searchQuery });
  const { data: stats } = useSurveyStats();
  const deleteSurvey = useDeleteSurvey();
  const duplicateSurvey = useDuplicateSurvey();

  const surveys = surveysData?.surveys || [];

  const layoutStats = useMemo(
    () => [
      createStat('Surveys', stats?.total || 0, MessageSquare, 'blue'),
      createStat('Active', stats?.active || 0, TrendingUp, 'green'),
      createStat('Responses', stats?.totalResponses || 0, Users, 'purple'),
      createStat(
        'Avg Score',
        stats?.avgScore ? stats.avgScore.toFixed(1) : '0',
        BarChart3,
        'orange'
      ),
    ],
    [stats]
  );

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleDelete = (surveyId) => {
    if (confirm('Are you sure you want to delete this survey?')) {
      deleteSurvey.mutate(surveyId);
    }
  };

  const handleDuplicate = (surveyId) => {
    duplicateSurvey.mutate(surveyId);
  };

  const actionButtons = (
    <Link href="/service/surveys/new">
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Create Survey
      </Button>
    </Link>
  );

  const mainContent = isLoading ? (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  ) : surveys.length === 0 ? (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No surveys yet</h3>
      <p className="text-muted-foreground mb-4">
        Create your first survey to start collecting feedback
      </p>
      <Link href="/service/surveys/new">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Survey
        </Button>
      </Link>
    </div>
  ) : (
    <div className="space-y-3">
      {surveys.map((survey) => {
        const typeConfig = surveyTypes[survey.type] || surveyTypes.CUSTOM;
        const TypeIcon = typeConfig.icon;
        const responseRate =
          survey.responseCount > 0
            ? Math.min(100, Math.round((survey.responseCount / 100) * 100))
            : 0;

        return (
          <Card key={survey.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={cn('p-3 rounded-lg', typeConfig.color)}>
                  <TypeIcon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Link href={`/service/surveys/${survey.id}`}>
                        <h3 className="font-semibold text-lg hover:text-primary mb-1">
                          {survey.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Badge className={typeConfig.color}>{typeConfig.label}</Badge>
                        <Badge variant={survey.status === 'ACTIVE' ? 'default' : 'secondary'}>
                          {survey.status.toLowerCase()}
                        </Badge>
                        <span>Created {new Date(survey.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/service/surveys/${survey.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Results
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/service/surveys/${survey.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Survey
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(survey.id)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Send className="h-4 w-4 mr-2" />
                          Send Survey
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(survey.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Responses</div>
                      <div className="text-2xl font-bold">{survey.responseCount}</div>
                      {survey.questionCount > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {survey.questionCount} questions
                        </div>
                      )}
                    </div>
                    {survey.avgScore > 0 && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {survey.type === 'NPS' ? 'Average Score' : 'Average Rating'}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-2xl font-bold">{survey.avgScore.toFixed(1)}</div>
                          {survey.type !== 'NPS' && (
                            <div className="flex items-center text-yellow-500">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    'h-4 w-4',
                                    i < Math.floor(survey.avgScore) ? 'fill-current' : ''
                                  )}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Response Rate</div>
                      <Progress value={responseRate} className="h-2" />
                      <div className="text-xs text-muted-foreground mt-1">
                        {responseRate}% completion
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  return (
    <UnifiedLayout
      hubId="service"
      pageTitle="Customer Surveys"
      stats={layoutStats}
      actions={[]}
      fixedMenu={null}
    >
      {mainContent}
    </UnifiedLayout>
  );
}
