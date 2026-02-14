'use client';

import { useState } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Download,
  Calendar,
  Building2,
  Eye,
  Mail,
  Phone,
  DollarSign,
  FileText,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { UnifiedLayout, createStat } from '@/components/layout/unified';
import { FixedMenuPanel } from '@/components/layout/fixed-menu-panel';

const jobs = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'Mumbai',
    type: 'Full-time',
    experience: '5-7 years',
    salary: '₹25-35 LPA',
    applicants: 45,
    shortlisted: 12,
    interviewed: 5,
    status: 'open',
    posted: '2026-01-15',
    deadline: '2026-02-15',
    description: 'We are looking for a Senior Software Engineer to join our Engineering team.',
    requirements: [
      '5+ years of experience in software development',
      'Proficiency in React, Node.js, and TypeScript',
      'Experience with cloud platforms (AWS/GCP)',
      'Strong problem-solving skills',
    ],
    hiringManager: 'Sarah Johnson',
    hiringManagerEmail: 'sarah.johnson@company.com',
  },
  {
    id: 2,
    title: 'Product Designer',
    department: 'Design',
    location: 'Bangalore',
    type: 'Full-time',
    experience: '3-5 years',
    salary: '₹18-25 LPA',
    applicants: 32,
    shortlisted: 8,
    interviewed: 3,
    status: 'open',
    posted: '2026-01-10',
    deadline: '2026-02-10',
    description: 'Join our Design team to create beautiful and functional user experiences.',
    requirements: [
      '3+ years of product design experience',
      'Proficiency in Figma and design systems',
      'Strong portfolio demonstrating UX skills',
      'Experience with user research',
    ],
    hiringManager: 'Emily Brown',
    hiringManagerEmail: 'emily.brown@company.com',
  },
  {
    id: 3,
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'Delhi',
    type: 'Full-time',
    experience: '4-6 years',
    salary: '₹20-28 LPA',
    applicants: 28,
    shortlisted: 10,
    interviewed: 4,
    status: 'interviewing',
    posted: '2026-01-05',
    deadline: '2026-01-31',
    description: 'Lead our marketing initiatives and drive brand growth.',
    requirements: [
      '4+ years of marketing experience',
      'Experience with digital marketing campaigns',
      'Strong analytical skills',
      'Team leadership experience',
    ],
    hiringManager: 'Michael Chen',
    hiringManagerEmail: 'michael.chen@company.com',
  },
  {
    id: 4,
    title: 'Data Analyst',
    department: 'Analytics',
    location: 'Remote',
    type: 'Full-time',
    experience: '2-4 years',
    salary: '₹12-18 LPA',
    applicants: 56,
    shortlisted: 15,
    interviewed: 6,
    status: 'open',
    posted: '2026-01-18',
    deadline: '2026-02-18',
    description: 'Analyze data to drive business decisions and insights.',
    requirements: [
      '2+ years of data analysis experience',
      'Proficiency in SQL and Python',
      'Experience with visualization tools',
      'Strong communication skills',
    ],
    hiringManager: 'Priya Sharma',
    hiringManagerEmail: 'priya.sharma@company.com',
  },
  {
    id: 5,
    title: 'Sales Executive',
    department: 'Sales',
    location: 'Chennai',
    type: 'Full-time',
    experience: '1-3 years',
    salary: '₹8-12 LPA',
    applicants: 0,
    shortlisted: 0,
    interviewed: 0,
    status: 'draft',
    posted: null,
    deadline: '2026-02-28',
    description: 'Drive sales and build client relationships.',
    requirements: [
      '1+ year of sales experience',
      'Excellent communication skills',
      'Target-oriented mindset',
      'B2B sales experience preferred',
    ],
    hiringManager: 'David Wilson',
    hiringManagerEmail: 'david.wilson@company.com',
  },
  {
    id: 6,
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Pune',
    type: 'Full-time',
    experience: '3-5 years',
    salary: '₹20-28 LPA',
    applicants: 23,
    shortlisted: 7,
    interviewed: 3,
    status: 'closed',
    posted: '2025-12-15',
    deadline: '2026-01-15',
    description: 'Build and maintain our cloud infrastructure.',
    requirements: [
      '3+ years of DevOps experience',
      'Experience with Docker and Kubernetes',
      'CI/CD pipeline expertise',
      'Cloud platform experience',
    ],
    hiringManager: 'Rahul Gupta',
    hiringManagerEmail: 'rahul.gupta@company.com',
  },
];

const statusConfig = {
  open: { label: 'Open', color: 'bg-green-100 text-green-700' },
  interviewing: { label: 'Interviewing', color: 'bg-purple-100 text-purple-700' },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-700' },
  draft: { label: 'Draft', color: 'bg-yellow-100 text-yellow-700' },
};

export default function RecruitmentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const layoutStats = [
    createStat(
      'Open',
      jobs.filter((j) => j.status === 'open').length.toString(),
      Briefcase,
      'blue'
    ),
    createStat(
      'Applicants',
      jobs.reduce((sum, j) => sum + j.applicants, 0).toString(),
      Users,
      'green'
    ),
    createStat('Interviews', '18', Clock, 'purple'),
    createStat('Offers', '5', TrendingUp, 'amber'),
  ];

  // FixedMenuPanel config - only filters
  const fixedMenuConfig = {
    filters: {
      quickFilters: [
        { id: 'all', label: 'All' },
        { id: 'open', label: 'Open' },
        { id: 'interviewing', label: 'Interviewing' },
        { id: 'draft', label: 'Draft' },
        { id: 'closed', label: 'Closed' },
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
      <Button size="sm" className="h-7 gap-1.5" onClick={() => console.log('Post New Job')}>
        <Plus className="h-3.5 w-3.5" />
        <span className="text-xs">Post Job</span>
      </Button>
    </>
  );

  // Job List Item
  const JobListItem = ({ job }) => {
    const isSelected = selectedJob?.id === job.id;
    const config = statusConfig[job.status];

    return (
      <div
        onClick={() => setSelectedJob(job)}
        className={cn(
          'p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50',
          isSelected && 'bg-primary/5 border-l-2 border-l-primary'
        )}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-medium text-sm truncate">{job.title}</h3>
          <Badge className={cn('text-xs shrink-0', config.color)}>{config.label}</Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-2">{job.department}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {job.applicants}
          </span>
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
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Job list */}
      {filteredJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Briefcase className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="font-medium">No jobs found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
        </div>
      ) : (
        filteredJobs.map((job) => <JobListItem key={job.id} job={job} />)
      )}
    </div>
  );

  // Right panel content
  const contentArea = selectedJob ? (
    <div className="h-full overflow-y-auto p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className={cn(statusConfig[selectedJob.status].color)}>
              {statusConfig[selectedJob.status].label}
            </Badge>
            <Badge variant="outline">{selectedJob.type}</Badge>
          </div>
          <h2 className="text-2xl font-bold mb-1">{selectedJob.title}</h2>
          <p className="text-muted-foreground">{selectedJob.department}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Eye className="h-4 w-4" />
            View Applicants
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="p-4 text-center">
            <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-xl font-bold">{selectedJob.applicants}</p>
            <p className="text-xs text-muted-foreground">Total Applicants</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <FileText className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-xl font-bold">{selectedJob.shortlisted}</p>
            <p className="text-xs text-muted-foreground">Shortlisted</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <Calendar className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-xl font-bold">{selectedJob.interviewed}</p>
            <p className="text-xs text-muted-foreground">Interviewed</p>
          </div>
        </Card>
      </div>

      {/* Job Details */}
      <Card className="mb-6">
        <div className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Job Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-medium">{selectedJob.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Experience</p>
                <p className="font-medium">{selectedJob.experience}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Salary Range</p>
                <p className="font-medium">{selectedJob.salary}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Deadline</p>
                <p className="font-medium">{selectedJob.deadline}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Description */}
      <Card className="mb-6">
        <div className="p-4">
          <h3 className="font-semibold mb-3">Description</h3>
          <p className="text-sm text-muted-foreground">{selectedJob.description}</p>
        </div>
      </Card>

      {/* Requirements */}
      <Card className="mb-6">
        <div className="p-4">
          <h3 className="font-semibold mb-3">Requirements</h3>
          <ul className="space-y-2">
            {selectedJob.requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* Hiring Manager */}
      <Card>
        <div className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <User className="h-4 w-4" />
            Hiring Manager
          </h3>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {selectedJob.hiringManager
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium">{selectedJob.hiringManager}</p>
              <p className="text-sm text-muted-foreground">{selectedJob.hiringManagerEmail}</p>
            </div>
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  ) : (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Job Selected</h3>
      <p className="text-muted-foreground">Select a job from the list to view details</p>
    </div>
  );

  return (
    <UnifiedLayout hubId="hr" pageTitle="Recruitment" stats={layoutStats} fixedMenu={null}>
      {contentArea}
    </UnifiedLayout>
  );
}
