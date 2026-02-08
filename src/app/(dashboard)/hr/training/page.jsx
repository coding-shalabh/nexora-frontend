'use client';

import { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  BookOpen,
  Users,
  Clock,
  Award,
  Play,
  CheckCircle,
  Calendar,
  User,
  BarChart3,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { HubLayout, createStat } from '@/components/layout/hub-layout';
import { FixedMenuPanel } from '@/components/layout/fixed-menu-panel';

const courses = [
  {
    id: 1,
    title: 'Leadership Fundamentals',
    category: 'Management',
    duration: '4 hours',
    enrolled: 45,
    completed: 32,
    status: 'active',
    instructor: 'John Smith',
    description:
      'Learn the fundamentals of leadership including communication, delegation, and team management.',
    modules: [
      { name: 'Introduction to Leadership', duration: '30 min', completed: true },
      { name: 'Communication Skills', duration: '45 min', completed: true },
      { name: 'Delegation Techniques', duration: '1 hour', completed: true },
      { name: 'Team Building', duration: '1 hour', completed: false },
      { name: 'Final Assessment', duration: '45 min', completed: false },
    ],
  },
  {
    id: 2,
    title: 'Advanced Excel for Business',
    category: 'Technical',
    duration: '6 hours',
    enrolled: 78,
    completed: 65,
    status: 'active',
    instructor: 'Emily Brown',
    description: 'Master advanced Excel functions, pivot tables, macros, and data visualization.',
    modules: [
      { name: 'Advanced Formulas', duration: '1 hour', completed: true },
      { name: 'Pivot Tables', duration: '1.5 hours', completed: true },
      { name: 'Data Visualization', duration: '1 hour', completed: false },
      { name: 'Macros & VBA', duration: '2 hours', completed: false },
      { name: 'Certification Exam', duration: '30 min', completed: false },
    ],
  },
  {
    id: 3,
    title: 'Effective Communication',
    category: 'Soft Skills',
    duration: '3 hours',
    enrolled: 120,
    completed: 98,
    status: 'completed',
    instructor: 'Sarah Johnson',
    description: 'Enhance your verbal and written communication skills for professional success.',
    modules: [
      { name: 'Verbal Communication', duration: '45 min', completed: true },
      { name: 'Written Communication', duration: '45 min', completed: true },
      { name: 'Presentation Skills', duration: '1 hour', completed: true },
      { name: 'Final Assessment', duration: '30 min', completed: true },
    ],
  },
  {
    id: 4,
    title: 'Project Management Basics',
    category: 'Management',
    duration: '8 hours',
    enrolled: 56,
    completed: 12,
    status: 'active',
    instructor: 'Michael Chen',
    description: 'Learn project planning, execution, monitoring, and agile methodologies.',
    modules: [
      { name: 'Project Planning', duration: '2 hours', completed: true },
      { name: 'Resource Management', duration: '1.5 hours', completed: false },
      { name: 'Risk Management', duration: '1.5 hours', completed: false },
      { name: 'Agile Methodology', duration: '2 hours', completed: false },
      { name: 'Final Project', duration: '1 hour', completed: false },
    ],
  },
  {
    id: 5,
    title: 'Cybersecurity Awareness',
    category: 'Compliance',
    duration: '2 hours',
    enrolled: 156,
    completed: 145,
    status: 'mandatory',
    instructor: 'David Wilson',
    description: 'Essential cybersecurity practices to protect company data and assets.',
    modules: [
      { name: 'Password Security', duration: '20 min', completed: true },
      { name: 'Phishing Awareness', duration: '30 min', completed: true },
      { name: 'Data Protection', duration: '40 min', completed: true },
      { name: 'Assessment', duration: '30 min', completed: true },
    ],
  },
  {
    id: 6,
    title: 'Customer Service Excellence',
    category: 'Soft Skills',
    duration: '4 hours',
    enrolled: 0,
    completed: 0,
    status: 'upcoming',
    instructor: 'Priya Sharma',
    description: 'Master customer service skills to deliver exceptional experiences.',
    modules: [
      { name: 'Customer Psychology', duration: '1 hour', completed: false },
      { name: 'Communication Techniques', duration: '1 hour', completed: false },
      { name: 'Problem Resolution', duration: '1 hour', completed: false },
      { name: 'Assessment', duration: '1 hour', completed: false },
    ],
  },
];

const statusConfig = {
  active: { label: 'Active', color: 'bg-green-100 text-green-700' },
  completed: { label: 'Completed', color: 'bg-blue-100 text-blue-700' },
  mandatory: { label: 'Mandatory', color: 'bg-red-100 text-red-700' },
  upcoming: { label: 'Upcoming', color: 'bg-yellow-100 text-yellow-700' },
};

const categoryColors = {
  Management: 'bg-purple-100 text-purple-700',
  Technical: 'bg-blue-100 text-blue-700',
  'Soft Skills': 'bg-green-100 text-green-700',
  Compliance: 'bg-red-100 text-red-700',
};

export default function TrainingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const layoutStats = [
    createStat('Active', '12', BookOpen, 'blue'),
    createStat('Enrolled', '456', Users, 'green'),
    createStat('Completed', '234', CheckCircle, 'purple'),
    createStat('Certificates', '89', Award, 'amber'),
  ];

  // FixedMenuPanel config - only filters
  const fixedMenuConfig = {
    filters: {
      quickFilters: [
        { id: 'all', label: 'All' },
        { id: 'active', label: 'Active' },
        { id: 'mandatory', label: 'Mandatory' },
        { id: 'completed', label: 'Completed' },
        { id: 'upcoming', label: 'Upcoming' },
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
        onClick={() => console.log('Export')}
      >
        <Download className="h-3.5 w-3.5" />
        <span className="text-xs">Export</span>
      </Button>
      <Button size="sm" className="h-7 gap-1.5" onClick={() => console.log('Create Course')}>
        <Plus className="h-3.5 w-3.5" />
        <span className="text-xs">Create Course</span>
      </Button>
    </>
  );

  // Course List Item
  const CourseListItem = ({ course }) => {
    const isSelected = selectedCourse?.id === course.id;
    const completion =
      course.enrolled > 0 ? Math.round((course.completed / course.enrolled) * 100) : 0;

    return (
      <div
        onClick={() => setSelectedCourse(course)}
        className={cn(
          'p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50',
          isSelected && 'bg-primary/5 border-l-2 border-l-primary'
        )}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge className={cn('text-xs', categoryColors[course.category])}>
            {course.category}
          </Badge>
          <Badge className={cn('text-xs', statusConfig[course.status].color)}>
            {statusConfig[course.status].label}
          </Badge>
        </div>
        <h3 className="font-medium text-sm mb-1">{course.title}</h3>
        <p className="text-xs text-muted-foreground mb-2">by {course.instructor}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {course.enrolled}
          </span>
          {course.enrolled > 0 && <span className="text-green-600">{completion}% done</span>}
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
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Course list */}
      {filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <BookOpen className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="font-medium">No courses found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
        </div>
      ) : (
        filteredCourses.map((course) => <CourseListItem key={course.id} course={course} />)
      )}
    </div>
  );

  // Right panel content
  const contentArea = selectedCourse ? (
    <div className="h-full overflow-y-auto p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className={cn(categoryColors[selectedCourse.category])}>
              {selectedCourse.category}
            </Badge>
            <Badge className={cn(statusConfig[selectedCourse.status].color)}>
              {statusConfig[selectedCourse.status].label}
            </Badge>
          </div>
          <h2 className="text-2xl font-bold mb-1">{selectedCourse.title}</h2>
          <p className="text-muted-foreground">by {selectedCourse.instructor}</p>
        </div>
        {selectedCourse.status !== 'upcoming' && (
          <Button className="gap-2">
            <Play className="h-4 w-4" />
            Continue
          </Button>
        )}
      </div>

      {/* Description */}
      <Card className="mb-6">
        <div className="p-4">
          <p className="text-sm text-muted-foreground">{selectedCourse.description}</p>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="p-4 text-center">
            <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-xl font-bold">{selectedCourse.duration}</p>
            <p className="text-xs text-muted-foreground">Duration</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-xl font-bold">{selectedCourse.enrolled}</p>
            <p className="text-xs text-muted-foreground">Enrolled</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <CheckCircle className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-xl font-bold">{selectedCourse.completed}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
        </Card>
      </div>

      {/* Progress */}
      {selectedCourse.enrolled > 0 && (
        <Card className="mb-6">
          <div className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Completion Rate
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span className="font-medium">
                  {Math.round((selectedCourse.completed / selectedCourse.enrolled) * 100)}%
                </span>
              </div>
              <Progress
                value={(selectedCourse.completed / selectedCourse.enrolled) * 100}
                className="h-3"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Modules */}
      <Card>
        <div className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Course Modules
          </h3>
          <div className="space-y-3">
            {selectedCourse.modules.map((module, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border',
                  module.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                )}
              >
                <div
                  className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium',
                    module.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                  )}
                >
                  {module.completed ? <CheckCircle className="h-4 w-4" /> : index + 1}
                </div>
                <div className="flex-1">
                  <p className={cn('font-medium text-sm', module.completed && 'text-green-700')}>
                    {module.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{module.duration}</p>
                </div>
                {!module.completed && selectedCourse.status !== 'upcoming' && (
                  <Button size="sm" variant="ghost">
                    <Play className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  ) : (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Course Selected</h3>
      <p className="text-muted-foreground">Select a course from the list to view details</p>
    </div>
  );

  return (
    <HubLayout
      hubId="hr"
      showTopBar={false}
      showSidebar={false}
      title="Training"
      description="Manage learning and development programs"
      stats={layoutStats}
      actions={topBarActions}
      showFixedMenu={true}
      fixedMenuFilters={
        <FixedMenuPanel
          config={fixedMenuConfig}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
          onAction={handleAction}
          className="p-4"
        />
      }
      fixedMenuList={fixedMenuListContent}
    >
      {contentArea}
    </HubLayout>
  );
}
