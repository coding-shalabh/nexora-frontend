'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Download,
  Upload,
  Package,
  Grid3x3,
  List,
  Edit,
  Trash2,
  Eye,
  Copy,
  Archive,
  Tags,
  DollarSign,
  Boxes,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Mock data
const mockProducts = [
  {
    id: 1,
    name: 'Premium CRM License',
    sku: 'CRM-PREM-001',
    category: 'Software',
    price: 99.99,
    cost: 45.00,
    stock: 'Unlimited',
    status: 'active',
    image: null,
    type: 'recurring',
    billingPeriod: 'monthly',
  },
  {
    id: 2,
    name: 'Professional Services - Hourly',
    sku: 'SERV-PROF-001',
    category: 'Services',
    price: 150.00,
    cost: 75.00,
    stock: 'N/A',
    status: 'active',
    image: null,
    type: 'one-time',
    billingPeriod: null,
  },
  {
    id: 3,
    name: 'Enterprise Support Package',
    sku: 'SUP-ENT-001',
    category: 'Support',
    price: 499.99,
    cost: 200.00,
    stock: 'Unlimited',
    status: 'active',
    image: null,
    type: 'recurring',
    billingPeriod: 'yearly',
  },
  {
    id: 4,
    name: 'API Access - 10K Calls/Month',
    sku: 'API-10K-001',
    category: 'Add-ons',
    price: 29.99,
    cost: 10.00,
    stock: 'Unlimited',
    status: 'active',
    image: null,
    type: 'recurring',
    billingPeriod: 'monthly',
  },
  {
    id: 5,
    name: 'Custom Integration Setup',
    sku: 'INT-CUST-001',
    category: 'Services',
    price: 1500.00,
    cost: 600.00,
    stock: 'N/A',
    status: 'draft',
    image: null,
    type: 'one-time',
    billingPeriod: null,
  },
];

const categories = ['All Categories', 'Software', 'Services', 'Support', 'Add-ons'];
const productTypes = ['All Types', 'One-time', 'Recurring'];
const statuses = ['All Status', 'Active', 'Draft', 'Archived'];

export default function ProductsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // list or grid
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Filter products
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
    const matchesType = selectedType === 'All Types' || product.type === selectedType.toLowerCase().replace('-', '');
    const matchesStatus = selectedStatus === 'All Status' || product.status === selectedStatus.toLowerCase();
    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    toast({
      title: 'Product deleted',
      description: `${productToDelete.name} has been deleted successfully.`,
    });
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleDuplicate = (product) => {
    toast({
      title: 'Product duplicated',
      description: `A copy of ${product.name} has been created.`,
    });
  };

  const handleExport = () => {
    toast({
      title: 'Exporting products',
      description: 'Your products are being exported to CSV.',
    });
  };

  const stats = [
    { label: 'Total Products', value: mockProducts.length, icon: Package, color: 'text-blue-600' },
    { label: 'Active Products', value: mockProducts.filter(p => p.status === 'active').length, icon: TrendingUp, color: 'text-green-600' },
    { label: 'Total Value', value: `$${mockProducts.reduce((sum, p) => sum + p.price, 0).toFixed(2)}`, icon: DollarSign, color: 'text-purple-600' },
    { label: 'Categories', value: [...new Set(mockProducts.map(p => p.category))].length, icon: Tags, color: 'text-orange-600' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog and pricing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => router.push('/commerce/products/new')} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={cn('h-5 w-5', stat.color)} />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {productTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products List/Grid */}
      {viewMode === 'list' ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Margin</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-12 w-12 text-muted-foreground" />
                      <p className="text-muted-foreground">No products found</p>
                      <Button onClick={() => router.push('/commerce/products/new')} className="gap-2 mt-2">
                        <Plus className="h-4 w-4" />
                        Add Product
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => {
                  const margin = ((product.price - product.cost) / product.price * 100).toFixed(1);
                  return (
                    <TableRow key={product.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            {product.billingPeriod && (
                              <p className="text-xs text-muted-foreground capitalize">
                                {product.billingPeriod}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {product.sku}
                        </Badge>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {product.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">${product.price.toFixed(2)}</TableCell>
                      <TableCell className="text-muted-foreground">${product.cost.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={parseFloat(margin) > 50 ? 'default' : 'secondary'}>
                          {margin}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            'capitalize',
                            product.status === 'active' && 'bg-green-100 text-green-700',
                            product.status === 'draft' && 'bg-yellow-100 text-yellow-700',
                            product.status === 'archived' && 'bg-gray-100 text-gray-700'
                          )}
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/commerce/products/${product.id}`)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/commerce/products/${product.id}/edit`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(product)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteProduct(product)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const margin = ((product.price - product.cost) / product.price * 100).toFixed(1);
            return (
              <Card key={product.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <Package className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/commerce/products/${product.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/commerce/products/${product.id}/edit`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(product)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeleteProduct(product)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {product.sku}
                      </Badge>
                      <Badge
                        className={cn(
                          'capitalize text-xs',
                          product.status === 'active' && 'bg-green-100 text-green-700',
                          product.status === 'draft' && 'bg-yellow-100 text-yellow-700'
                        )}
                      >
                        {product.status}
                      </Badge>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-baseline justify-between">
                        <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
                        <Badge variant={parseFloat(margin) > 50 ? 'default' : 'secondary'} className="text-xs">
                          {margin}% margin
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Cost: ${product.cost.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => router.push(`/commerce/products/${product.id}`)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => router.push(`/commerce/products/${product.id}/edit`)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
