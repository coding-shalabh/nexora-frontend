'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  MapPin,
  Clock,
  Users,
  Eye,
  Edit,
  MoreHorizontal,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const jobs = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'Mumbai',
    type: 'Full-time',
    applicants: 45,
    status: 'open',
    posted: '5 days ago',
  },
  {
    id: 2,
    title: 'Product Designer',
    department: 'Design',
    location: 'Bangalore',
    type: 'Full-time',
    applicants: 32,
    status: 'open',
    posted: '1 week ago',
  },
  {
    id: 3,
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'Delhi',
    type: 'Full-time',
    applicants: 28,
    status: 'interviewing',
    posted: '2 weeks ago',
  },
  {
    id: 4,
    title: 'Data Analyst',
    department: 'Analytics',
    location: 'Remote',
    type: 'Full-time',
    applicants: 56,
    status: 'open',
    posted: '3 days ago',
  },
  {
    id: 5,
    title: 'Sales Executive',
    department: 'Sales',
    location: 'Chennai',
    type: 'Full-time',
    applicants: 0,
    status: 'draft',
    posted: 'Not published',
  },
  {
    id: 6,
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Pune',
    type: 'Full-time',
    applicants: 23,
    status: 'closed',
    posted: '1 month ago',
  },
];

const stats = [
  { label: 'Open Positions', value: '12', color: 'bg-blue-100 text-blue-700' },
  { label: 'Total Applicants', value: '234', color: 'bg-green-100 text-green-700' },
  { label: 'Interviews Scheduled', value: '18', color: 'bg-purple-100 text-purple-700' },
  { label: 'Offers Extended', value: '5', color: 'bg-orange-100 text-orange-700' },
];

const getStatusBadge = (status) => {
  const styles = {
    open: 'bg-green-100 text-green-700',
    interviewing: 'bg-purple-100 text-purple-700',
    closed: 'bg-gray-100 text-gray-700',
    draft: 'bg-yellow-100 text-yellow-700',
  };
  return (
    <Badge className={styles[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  );
};

export default function RecruitmentPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Recruitment</h1>
          <p className="text-muted-foreground">Manage job postings and candidates</p>
        </div>
        <Link href="/hr/recruitment/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Post New Job
          </Button>
        </Link>
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
                <p className="text-2xl font-bold">{stat.value}</p>
                <Badge className={stat.color}>{stat.label}</Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.department}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(job.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" /> View Applicants
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" /> Edit Job
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {job.type}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {job.applicants} applicants
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {job.posted}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
