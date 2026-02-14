'use client';

import { useState } from 'react';
import {
  Target,
  TrendingUp,
  Star,
  Users,
  Award,
  BarChart3,
  Calendar,
  ChevronRight,
  Search,
  Plus,
  Mail,
  Phone,
  Briefcase,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { UnifiedLayout, createStat } from '@/components/layout/unified';
import { FixedMenuPanel } from '@/components/layout/fixed-menu-panel';

const employees = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'SJ',
    email: 'sarah.johnson@company.com',
    phone: '+91 98765 43210',
    role: 'Product Designer',
    department: 'Design',
    score: 92,
    goals: { completed: 8, total: 10 },
    rating: 5,
    trend: 'up',
    lastReview: 'Dec 15, 2025',
    nextReview: 'Mar 15, 2026',
    strengths: ['Creative thinking', 'User empathy', 'Prototyping'],
    improvements: ['Documentation', 'Time management'],
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'MC',
    email: 'michael.chen@company.com',
    phone: '+91 98765 43211',
    role: 'Software Engineer',
    department: 'Engineering',
    score: 88,
    goals: { completed: 7, total: 8 },
    rating: 4,
    trend: 'up',
    lastReview: 'Nov 20, 2025',
    nextReview: 'Feb 20, 2026',
    strengths: ['Problem solving', 'Code quality', 'Team collaboration'],
    improvements: ['Communication', 'Mentoring juniors'],
  },
  {
    id: 3,
    name: 'Emily Brown',
    avatar: 'EB',
    email: 'emily.brown@company.com',
    phone: '+91 98765 43212',
    role: 'Marketing Manager',
    department: 'Marketing',
    score: 75,
    goals: { completed: 5, total: 8 },
    rating: 3,
    trend: 'stable',
    lastReview: 'Oct 10, 2025',
    nextReview: 'Jan 10, 2026',
    strengths: ['Campaign strategy', 'Analytics'],
    improvements: ['Budget management', 'Team leadership'],
  },
  {
    id: 4,
    name: 'David Wilson',
    avatar: 'DW',
    email: 'david.wilson@company.com',
    phone: '+91 98765 43213',
    role: 'Sales Executive',
    department: 'Sales',
    score: 95,
    goals: { completed: 12, total: 12 },
    rating: 5,
    trend: 'up',
    lastReview: 'Dec 1, 2025',
    nextReview: 'Mar 1, 2026',
    strengths: ['Client relationships', 'Negotiation', 'Target achievement'],
    improvements: ['CRM documentation'],
  },
  {
    id: 5,
    name: 'Priya Sharma',
    avatar: 'PS',
    email: 'priya.sharma@company.com',
    phone: '+91 98765 43214',
    role: 'HR Manager',
    department: 'HR',
    score: 82,
    goals: { completed: 6, total: 8 },
    rating: 4,
    trend: 'down',
    lastReview: 'Sep 15, 2025',
    nextReview: 'Dec 15, 2025',
    strengths: ['Employee relations', 'Policy development'],
    improvements: ['Data analysis', 'Process automation'],
  },
];

const getScoreColor = (score) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 75) return 'text-blue-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const getScoreBg = (score) => {
  if (score >= 90) return 'bg-green-100';
  if (score >= 75) return 'bg-blue-100';
  if (score >= 60) return 'bg-yellow-100';
  return 'bg-red-100';
};

export default function PerformancePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesScore =
      scoreFilter === 'all' ||
      (scoreFilter === 'top' && emp.score >= 90) ||
      (scoreFilter === 'good' && emp.score >= 75 && emp.score < 90) ||
      (scoreFilter === 'needs-improvement' && emp.score < 75);
    return matchesSearch && matchesScore;
  });

  // Stats
  const layoutStats = [
    createStat('Avg Score', '86%', BarChart3, 'blue'),
    createStat('Goals Done', '234', Target, 'green'),
    createStat('Top Performers', '28', Award, 'purple'),
    createStat('Reviews Due', '15', Calendar, 'amber'),
  ];

  // FixedMenuPanel config - only filters
  const fixedMenuConfig = {
    filters: {
      quickFilters: [
        { id: 'all', label: 'All' },
        { id: 'top', label: 'Top (90+)' },
        { id: 'good', label: 'Good (75-90)' },
        { id: 'needs-improvement', label: 'Needs Work' },
      ],
    },
  };

  const handleAction = (actionId) => {
    console.log('Action:', actionId);
  };

  // Actions for the stats bar (top bar)
  const topBarActions = (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1.5"
        onClick={() => console.log('Q1 2026')}
      >
        <Calendar className="h-3.5 w-3.5" />
        <span className="text-xs">Q1 2026</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1.5"
        onClick={() => console.log('Export')}
      >
        <Download className="h-3.5 w-3.5" />
        <span className="text-xs">Export</span>
      </Button>
      <Button size="sm" className="h-7 gap-1.5" onClick={() => console.log('Start Review')}>
        <Target className="h-3.5 w-3.5" />
        <span className="text-xs">Start Review</span>
      </Button>
    </>
  );

  // Employee List Item
  const EmployeeListItem = ({ employee }) => {
    const isSelected = selectedEmployee?.id === employee.id;

    return (
      <div
        onClick={() => setSelectedEmployee(employee)}
        className={cn(
          'p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50',
          isSelected && 'bg-primary/5 border-l-2 border-l-primary'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-medium text-primary">{employee.avatar}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-medium text-sm truncate">{employee.name}</h3>
              <div className={cn('text-sm font-bold', getScoreColor(employee.score))}>
                {employee.score}%
              </div>
            </div>
            <p className="text-xs text-muted-foreground truncate">{employee.role}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-3 w-3',
                      i < employee.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
              {employee.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Middle panel list
  const fixedMenuListContent = (
    <div>
      {/* Search */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Employee list */}
      {filteredEmployees.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Users className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="font-medium">No employees found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
        </div>
      ) : (
        filteredEmployees.map((employee) => (
          <EmployeeListItem key={employee.id} employee={employee} />
        ))
      )}
    </div>
  );

  // Right panel content
  const contentArea = selectedEmployee ? (
    <div className="h-full overflow-y-auto p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="text-xl font-medium text-primary">{selectedEmployee.avatar}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{selectedEmployee.name}</h2>
            <p className="text-muted-foreground">
              {selectedEmployee.role} • {selectedEmployee.department}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedEmployee.trend === 'up' && (
            <Badge className="bg-green-100 text-green-700">
              <TrendingUp className="h-3 w-3 mr-1" />
              Improving
            </Badge>
          )}
        </div>
      </div>

      {/* Performance Score Card */}
      <Card className="mb-6">
        <div className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Performance Overview
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className={cn('text-center p-4 rounded-lg', getScoreBg(selectedEmployee.score))}>
              <p className={cn('text-3xl font-bold', getScoreColor(selectedEmployee.score))}>
                {selectedEmployee.score}%
              </p>
              <p className="text-sm text-muted-foreground">Overall Score</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-700">
                {selectedEmployee.goals.completed}/{selectedEmployee.goals.total}
              </p>
              <p className="text-sm text-purple-600">Goals Completed</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="flex items-center justify-center gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-5 w-5',
                      i < selectedEmployee.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
              <p className="text-sm text-amber-600">Rating</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Goals Progress */}
      <Card className="mb-6">
        <div className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Goals Progress
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Completed</span>
              <span className="font-medium">
                {selectedEmployee.goals.completed} of {selectedEmployee.goals.total}
              </span>
            </div>
            <Progress
              value={(selectedEmployee.goals.completed / selectedEmployee.goals.total) * 100}
              className="h-3"
            />
          </div>
        </div>
      </Card>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <div className="p-4">
            <h3 className="font-semibold mb-3 text-green-700">Strengths</h3>
            <div className="space-y-2">
              {selectedEmployee.strengths.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="font-semibold mb-3 text-amber-700">Areas to Improve</h3>
            <div className="space-y-2">
              {selectedEmployee.improvements.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Contact Info */}
      <Card>
        <div className="p-4">
          <h3 className="font-semibold mb-4">Contact & Review Info</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{selectedEmployee.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Last Review</p>
                <p className="text-sm font-medium">{selectedEmployee.lastReview}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium">{selectedEmployee.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Next Review</p>
                <p className="text-sm font-medium">{selectedEmployee.nextReview}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  ) : (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <Award className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Employee Selected</h3>
      <p className="text-muted-foreground">
        Select an employee from the list to view performance details
      </p>
    </div>
  );

  return (
    <UnifiedLayout hubId="hr" pageTitle="Performance" stats={layoutStats} fixedMenu={null}>
      {contentArea}
    </UnifiedLayout>
  );
}
