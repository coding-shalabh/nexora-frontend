'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const employees = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'Product Designer',
    department: 'Design',
    status: 'active',
    avatar: 'SJ',
    location: 'Mumbai',
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael@company.com',
    role: 'Software Engineer',
    department: 'Engineering',
    status: 'active',
    avatar: 'MC',
    location: 'Bangalore',
  },
  {
    id: 3,
    name: 'Emily Brown',
    email: 'emily@company.com',
    role: 'Marketing Manager',
    department: 'Marketing',
    status: 'active',
    avatar: 'EB',
    location: 'Delhi',
  },
  {
    id: 4,
    name: 'David Wilson',
    email: 'david@company.com',
    role: 'Sales Executive',
    department: 'Sales',
    status: 'on-leave',
    avatar: 'DW',
    location: 'Chennai',
  },
  {
    id: 5,
    name: 'Priya Sharma',
    email: 'priya@company.com',
    role: 'HR Manager',
    department: 'Human Resources',
    status: 'active',
    avatar: 'PS',
    location: 'Mumbai',
  },
  {
    id: 6,
    name: 'Rahul Gupta',
    email: 'rahul@company.com',
    role: 'DevOps Engineer',
    department: 'Engineering',
    status: 'active',
    avatar: 'RG',
    location: 'Pune',
  },
];

const stats = [
  { label: 'Total Employees', value: '156', color: 'bg-blue-100 text-blue-700' },
  { label: 'Active', value: '148', color: 'bg-green-100 text-green-700' },
  { label: 'On Leave', value: '8', color: 'bg-orange-100 text-orange-700' },
  { label: 'New This Month', value: '5', color: 'bg-purple-100 text-purple-700' },
];

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Employees</h1>
          <p className="text-muted-foreground">Manage your team members</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Link href="/hr/employees/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Employee
            </Button>
          </Link>
        </div>
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
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="hr">Human Resources</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((employee, index) => (
          <motion.div
            key={employee.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{employee.avatar}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{employee.name}</h3>
                      <p className="text-sm text-muted-foreground">{employee.role}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" /> View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {employee.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {employee.location}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Badge variant="secondary">{employee.department}</Badge>
                  <Badge
                    className={cn(
                      employee.status === 'active' && 'bg-green-100 text-green-700',
                      employee.status === 'on-leave' && 'bg-orange-100 text-orange-700'
                    )}
                  >
                    {employee.status === 'active' ? 'Active' : 'On Leave'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
