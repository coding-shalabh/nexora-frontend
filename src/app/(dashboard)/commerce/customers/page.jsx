'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  ShoppingCart,
  DollarSign,
  Package,
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Tag,
  Eye,
  Edit,
  Trash2,
  Star,
  TrendingUp,
  Calendar,
  CreditCard,
  Loader2,
  UserPlus,
  Users,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  useContacts,
  useContact,
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
} from '@/hooks/use-contacts';
import { useToast } from '@/hooks/use-toast';
import { UnifiedLayout, createStat } from '@/components/layout/unified';
import { FixedMenuPanel } from '@/components/layout/fixed-menu-panel';

const lifecycleStages = [
  { value: 'LEAD', label: 'Lead' },
  { value: 'QUALIFIED_LEAD', label: 'Qualified Lead' },
  { value: 'OPPORTUNITY', label: 'Opportunity' },
  { value: 'CUSTOMER', label: 'Customer' },
  { value: 'EVANGELIST', label: 'Evangelist' },
  { value: 'OTHER', label: 'Other' },
];

const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'ARCHIVED', label: 'Archived' },
];

function formatCurrency(amount) {
  if (!amount) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export default function CustomersPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [lifecycleFilter, setLifecycleFilter] = useState('CUSTOMER');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    lifecycleStage: 'CUSTOMER',
    status: 'ACTIVE',
    tags: [],
  });

  // Queries
  const { data: contactsResponse, isLoading } = useContacts({
    lifecycleStage: lifecycleFilter !== 'all' ? lifecycleFilter : undefined,
    search: searchQuery || undefined,
  });
  const { data: customerDetails, refetch: refetchCustomerDetails } = useContact(
    selectedCustomer?.id
  );

  const contacts = contactsResponse?.data || [];
  const customers = contacts.filter(
    (contact) => contact.lifecycleStage === 'CUSTOMER' || lifecycleFilter === 'all'
  );

  // Mutations
  const createContactMutation = useCreateContact();
  const updateContactMutation = useUpdateContact();
  const deleteContactMutation = useDeleteContact();

  // Stats calculations
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === 'ACTIVE').length;
  const totalRevenue = customers.reduce((sum, c) => sum + (c.totalRevenue || 0), 0);
  const avgOrderValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      jobTitle: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      lifecycleStage: 'CUSTOMER',
      status: 'ACTIVE',
      tags: [],
    });
  };

  const handleCreate = async () => {
    if (!formData.firstName || !formData.email) {
      toast({
        title: 'Error',
        description: 'First name and email are required',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createContactMutation.mutateAsync({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
        jobTitle: formData.jobTitle || undefined,
        address: formData.address || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        country: formData.country || undefined,
        postalCode: formData.postalCode || undefined,
        lifecycleStage: formData.lifecycleStage,
        status: formData.status,
        tags: formData.tags,
      });
      toast({
        title: 'Success',
        description: 'Customer created successfully',
      });
      setIsCreateOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create customer',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedCustomer) return;

    setIsSubmitting(true);
    try {
      await updateContactMutation.mutateAsync({
        id: selectedCustomer.id,
        data: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          jobTitle: formData.jobTitle,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode,
          lifecycleStage: formData.lifecycleStage,
          status: formData.status,
        },
      });
      toast({
        title: 'Success',
        description: 'Customer updated successfully',
      });
      setIsEditOpen(false);
      refetchCustomerDetails();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update customer',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (customer) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
      await deleteContactMutation.mutateAsync(customer.id);
      toast({
        title: 'Success',
        description: 'Customer deleted successfully',
      });
      if (selectedCustomer?.id === customer.id) {
        setSelectedCustomer(null);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete customer',
        variant: 'destructive',
      });
    }
  };

  const handleView = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      email: customer.email || '',
      phone: customer.phone || '',
      company: customer.company || '',
      jobTitle: customer.jobTitle || '',
      address: customer.address || '',
      city: customer.city || '',
      state: customer.state || '',
      country: customer.country || '',
      postalCode: customer.postalCode || '',
      lifecycleStage: customer.lifecycleStage || 'CUSTOMER',
      status: customer.status || 'ACTIVE',
      tags: customer.tags || [],
    });
    setIsEditOpen(true);
  };

  const customerDetail = customerDetails?.data;

  // Stats configuration for HubLayout
  const stats = [
    createStat('Total Customers', totalCustomers, Users, 'primary'),
    createStat('Active', activeCustomers, Activity, 'green'),
    createStat('Total Revenue', formatCurrency(totalRevenue), DollarSign, 'blue'),
    createStat('Avg Order Value', formatCurrency(avgOrderValue), TrendingUp, 'purple'),
  ];

  // FixedMenuPanel configuration
  const fixedMenuConfig = {
    primaryActions: [{ id: 'create', label: 'Add Customer', icon: Plus, variant: 'default' }],
    filters: {
      quickFilters: [
        { id: 'CUSTOMER', label: 'Customers' },
        { id: 'EVANGELIST', label: 'Evangelists' },
        { id: 'all', label: 'All' },
      ],
    },
  };

  // Empty state component
  const EmptyState = () => (
    <div className="p-12 text-center">
      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No customers found</h3>
      <p className="text-muted-foreground mb-4">
        {searchQuery || lifecycleFilter !== 'CUSTOMER'
          ? 'Try adjusting your filters'
          : 'Add your first customer to get started'}
      </p>
      {!searchQuery && lifecycleFilter === 'CUSTOMER' && (
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      )}
    </div>
  );

  // Customer card component
  const CustomerCard = ({ customer }) => {
    const isActive = customer.status === 'ACTIVE';
    const revenue = customer.totalRevenue || 0;
    const orders = customer.totalOrders || 0;

    return (
      <Card
        className={cn(
          'p-4 hover:shadow-md transition-shadow cursor-pointer',
          !isActive && 'opacity-60'
        )}
        onClick={() => handleView(customer)}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold text-lg',
              isActive ? 'bg-gradient-to-br from-blue-500 to-purple-500' : 'bg-gray-400'
            )}
          >
            {customer.firstName?.[0]}
            {customer.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">
                    {customer.firstName} {customer.lastName}
                  </h3>
                  {customer.isVip && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                </div>
                {customer.company && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Building2 className="h-3 w-3" />
                    {customer.company}
                  </p>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(customer);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(customer);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Customer
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(customer);
                    }}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm flex-wrap">
              {customer.email && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  {customer.email}
                </span>
              )}
              {customer.phone && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  {customer.phone}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-medium">{formatCurrency(revenue)}</span>
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Package className="h-4 w-4" />
                {orders} order{orders !== 1 ? 's' : ''}
              </span>
              <span className="ml-auto text-muted-foreground">
                {formatTimeAgo(customer.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <>
      <UnifiedLayout hubId="commerce" pageTitle="Customers" stats={stats} fixedMenu={null}>
        <div className="flex h-full">
          {/* Fixed Menu Panel */}
          <div className="w-80 border-r border-gray-200 flex flex-col">
            <FixedMenuPanel
              config={fixedMenuConfig}
              activeFilter={lifecycleFilter}
              onFilterChange={setLifecycleFilter}
              onAction={(id) => id === 'create' && setIsCreateOpen(true)}
              className="p-4"
            />
            <div className="flex-1 overflow-auto">
              <div className="space-y-2 p-4">
                {/* Search Bar */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search customers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Customers List */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : customers.length === 0 ? (
                  <EmptyState />
                ) : (
                  customers.map((customer) => (
                    <CustomerCard key={customer.id} customer={customer} />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto">
            {/* Customer Detail View in Content Area */}
            {selectedCustomer && customerDetail && (
              <div className="h-full overflow-y-auto p-6">
                {/* Customer Header */}
                <div className="mb-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-3xl">
                      {customerDetail.firstName?.[0]}
                      {customerDetail.lastName?.[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-2xl font-bold">
                          {customerDetail.firstName} {customerDetail.lastName}
                        </h2>
                        {customerDetail.isVip && (
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      {customerDetail.company && (
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {customerDetail.company}
                          {customerDetail.jobTitle && ` • ${customerDetail.jobTitle}`}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          className={cn(
                            customerDetail.status === 'ACTIVE' && 'bg-green-100 text-green-700',
                            customerDetail.status === 'INACTIVE' && 'bg-yellow-100 text-yellow-700',
                            customerDetail.status === 'ARCHIVED' && 'bg-gray-100 text-gray-700'
                          )}
                        >
                          {customerDetail.status}
                        </Badge>
                        <Badge variant="outline">{customerDetail.lifecycleStage}</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Revenue</p>
                          <p className="text-xl font-bold">
                            {formatCurrency(customerDetail.totalRevenue || 0)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Orders</p>
                          <p className="text-xl font-bold">{customerDetail.totalOrders || 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Avg Order</p>
                          <p className="text-xl font-bold">
                            {formatCurrency(
                              customerDetail.totalOrders > 0
                                ? customerDetail.totalRevenue / customerDetail.totalOrders
                                : 0
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Customer Since</p>
                          <p className="text-sm font-medium">
                            {formatDate(customerDetail.createdAt)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Information */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-base">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {customerDetail.email && (
                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-sm text-muted-foreground flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email
                          </span>
                          <span className="font-medium">{customerDetail.email}</span>
                        </div>
                      )}
                      {customerDetail.phone && (
                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-sm text-muted-foreground flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Phone
                          </span>
                          <span className="font-medium">{customerDetail.phone}</span>
                        </div>
                      )}
                      {(customerDetail.address ||
                        customerDetail.city ||
                        customerDetail.state ||
                        customerDetail.country) && (
                        <div className="flex items-start justify-between py-2 border-b">
                          <span className="text-sm text-muted-foreground flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Address
                          </span>
                          <div className="text-right">
                            {customerDetail.address && (
                              <p className="font-medium">{customerDetail.address}</p>
                            )}
                            <p className="text-sm text-muted-foreground">
                              {[customerDetail.city, customerDetail.state, customerDetail.country]
                                .filter(Boolean)
                                .join(', ')}
                              {customerDetail.postalCode && ` ${customerDetail.postalCode}`}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button className="flex-1" onClick={() => handleEdit(customerDetail)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Customer
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    View Orders
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </UnifiedLayout>

      {/* Create Customer Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Acme Corp"
                />
              </div>
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  placeholder="CEO"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Main St"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="New York"
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="NY"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Country</Label>
                <Input
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="United States"
                />
              </div>
              <div className="space-y-2">
                <Label>Postal Code</Label>
                <Input
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="10001"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Lifecycle Stage</Label>
                <Select
                  value={formData.lifecycleStage}
                  onValueChange={(value) => setFormData({ ...formData, lifecycleStage: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {lifecycleStages.map((stage) => (
                      <SelectItem key={stage.value} value={stage.value}>
                        {stage.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Add Customer'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Country</Label>
                <Input
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Postal Code</Label>
                <Input
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Lifecycle Stage</Label>
                <Select
                  value={formData.lifecycleStage}
                  onValueChange={(value) => setFormData({ ...formData, lifecycleStage: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {lifecycleStages.map((stage) => (
                      <SelectItem key={stage.value} value={stage.value}>
                        {stage.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
