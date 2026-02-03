'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

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
  },
];

const stats = [
  { label: 'Active Courses', value: '12', icon: BookOpen, color: 'text-blue-600' },
  { label: 'Total Enrolled', value: '456', icon: Users, color: 'text-green-600' },
  { label: 'Completed', value: '234', icon: CheckCircle, color: 'text-purple-600' },
  { label: 'Certifications', value: '89', icon: Award, color: 'text-orange-600' },
];

const getStatusBadge = (status) => {
  const styles = {
    active: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    mandatory: 'bg-red-100 text-red-700',
    upcoming: 'bg-yellow-100 text-yellow-700',
  };
  const labels = {
    active: 'Active',
    completed: 'Completed',
    mandatory: 'Mandatory',
    upcoming: 'Upcoming',
  };
  return <Badge className={styles[status]}>{labels[status]}</Badge>;
};

const getCategoryColor = (category) => {
  const colors = {
    Management: 'bg-purple-100 text-purple-700',
    Technical: 'bg-blue-100 text-blue-700',
    'Soft Skills': 'bg-green-100 text-green-700',
    Compliance: 'bg-red-100 text-red-700',
  };
  return colors[category] || 'bg-gray-100 text-gray-700';
};

export default function TrainingPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Training</h1>
          <p className="text-muted-foreground">Manage learning and development programs</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Course
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <stat.icon className={cn('h-5 w-5', stat.color)} />
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <Badge className={getCategoryColor(course.category)}>{course.category}</Badge>
                  {getStatusBadge(course.status)}
                </div>
                <h3 className="font-medium mb-1">{course.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">by {course.instructor}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {course.enrolled} enrolled
                  </div>
                </div>
                {course.enrolled > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Completion</span>
                      <span>{Math.round((course.completed / course.enrolled) * 100)}%</span>
                    </div>
                    <Progress value={(course.completed / course.enrolled) * 100} className="h-2" />
                  </div>
                )}
                {course.status === 'upcoming' && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Starting Soon
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
