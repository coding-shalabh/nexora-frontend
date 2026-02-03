'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Warehouse,
  Plus,
  Search,
  MapPin,
  Package,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// Mock warehouses data
const warehouses = [
  {
    id: 1,
    name: 'Main Warehouse',
    code: 'WH-001',
    location: 'Mumbai, Maharashtra',
    type: 'Primary',
    capacity: 10000,
    used: 7500,
    products: 456,
    manager: 'Rahul Sharma',
    status: 'active',
  },
  {
    id: 2,
    name: 'East Warehouse',
    code: 'WH-002',
    location: 'Kolkata, West Bengal',
    type: 'Regional',
    capacity: 5000,
    used: 2250,
    products: 234,
    manager: 'Priya Das',
    status: 'active',
  },
  {
    id: 3,
    name: 'West Warehouse',
    code: 'WH-003',
    location: 'Ahmedabad, Gujarat',
    type: 'Regional',
    capacity: 3000,
    used: 2640,
    products: 189,
    manager: 'Amit Patel',
    status: 'active',
  },
  {
    id: 4,
    name: 'Distribution Center',
    code: 'WH-004',
    location: 'Bangalore, Karnataka',
    type: 'Distribution',
    capacity: 8000,
    used: 2560,
    products: 312,
    manager: 'Deepa Rao',
    status: 'active',
  },
];

const stats = [
  { label: 'Total Warehouses', value: '4', color: 'bg-blue-100 text-blue-700' },
  { label: 'Total Capacity', value: '26,000', color: 'bg-green-100 text-green-700' },
  { label: 'Units Stored', value: '14,950', color: 'bg-purple-100 text-purple-700' },
  { label: 'Avg. Utilization', value: '57%', color: 'bg-orange-100 text-orange-700' },
];

export default function InventoryWarehousesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Warehouses</h1>
          <p className="text-muted-foreground">Manage your storage locations and capacity</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Warehouse
        </Button>
      </div>

      {/* Stats */}
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

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search warehouses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Warehouse Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {warehouses.map((warehouse, index) => {
          const usagePercent = Math.round((warehouse.used / warehouse.capacity) * 100);
          return (
            <motion.div
              key={warehouse.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                        <Warehouse className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{warehouse.name}</CardTitle>
                        <p className="text-xs text-muted-foreground font-mono">{warehouse.code}</p>
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
                          <Eye className="h-4 w-4 mr-2" /> View Details
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
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {warehouse.location}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span>Capacity Usage</span>
                    <span className="font-medium">{usagePercent}%</span>
                  </div>
                  <Progress
                    value={usagePercent}
                    className={cn('h-2', usagePercent > 80 && '[&>div]:bg-orange-500')}
                  />
                  <p className="text-xs text-muted-foreground">
                    {warehouse.used.toLocaleString()} / {warehouse.capacity.toLocaleString()} units
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>{warehouse.products} Products</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{warehouse.manager}</span>
                    </div>
                  </div>

                  <Badge variant="secondary">{warehouse.type}</Badge>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
