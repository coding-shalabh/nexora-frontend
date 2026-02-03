'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Package,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  AlertTriangle,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock products data
const products = [
  {
    id: 1,
    sku: 'WGT-001',
    name: 'Widget Pro',
    category: 'Electronics',
    stock: 150,
    reorderLevel: 50,
    price: 29.99,
    status: 'in-stock',
  },
  {
    id: 2,
    sku: 'GDG-042',
    name: 'Gadget Plus',
    category: 'Electronics',
    stock: 8,
    reorderLevel: 25,
    price: 49.99,
    status: 'low-stock',
  },
  {
    id: 3,
    sku: 'CMP-108',
    name: 'Component X',
    category: 'Parts',
    stock: 3,
    reorderLevel: 15,
    price: 12.5,
    status: 'critical',
  },
  {
    id: 4,
    sku: 'PRT-200',
    name: 'Part Y-200',
    category: 'Parts',
    stock: 200,
    reorderLevel: 30,
    price: 8.75,
    status: 'in-stock',
  },
  {
    id: 5,
    sku: 'ACC-050',
    name: 'Accessory Bundle',
    category: 'Accessories',
    stock: 0,
    reorderLevel: 20,
    price: 24.99,
    status: 'out-of-stock',
  },
];

const stats = [
  { label: 'Total Products', value: '1,247', color: 'bg-blue-100 text-blue-700' },
  { label: 'In Stock', value: '1,089', color: 'bg-green-100 text-green-700' },
  { label: 'Low Stock', value: '112', color: 'bg-orange-100 text-orange-700' },
  { label: 'Out of Stock', value: '46', color: 'bg-red-100 text-red-700' },
];

const getStatusBadge = (status) => {
  const styles = {
    'in-stock': 'bg-green-100 text-green-700',
    'low-stock': 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700',
    'out-of-stock': 'bg-gray-100 text-gray-700',
  };
  const labels = {
    'in-stock': 'In Stock',
    'low-stock': 'Low Stock',
    critical: 'Critical',
    'out-of-stock': 'Out of Stock',
  };
  return <Badge className={styles[status]}>{labels[status]}</Badge>;
};

export default function InventoryProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog and inventory</p>
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
          <Link href="/inventory/products/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
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

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name or SKU..."
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

      {/* Products Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Package className="h-4 w-4" />
            Product List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        product.stock <= product.reorderLevel ? 'text-orange-600 font-medium' : ''
                      }
                    >
                      {product.stock}
                    </span>
                    {product.stock <= product.reorderLevel && (
                      <AlertTriangle className="inline h-4 w-4 ml-1 text-orange-500" />
                    )}
                  </TableCell>
                  <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell className="text-right">
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
                        <DropdownMenuItem>
                          <BarChart3 className="h-4 w-4 mr-2" /> Stock History
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
