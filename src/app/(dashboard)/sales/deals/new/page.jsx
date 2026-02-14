'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Building2,
  User,
  DollarSign,
  Calendar,
  Target,
  Plus,
  X,
} from 'lucide-react';
import { UnifiedLayout } from '@/components/layout/unified';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const stages = [
  'Qualification',
  'Discovery',
  'Proposal',
  'Negotiation',
  'Closed Won',
  'Closed Lost',
];

const priorities = ['Low', 'Medium', 'High'];

const mockProducts = [
  { id: 1, name: 'Enterprise Plan', price: 999 },
  { id: 2, name: 'Professional Plan', price: 499 },
  { id: 3, name: 'Premium Support', price: 25100 },
  { id: 4, name: 'Custom Integration', price: 15000 },
];

export default function NewDealPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    contact: '',
    value: '',
    stage: 'Qualification',
    probability: '30',
    closeDate: '',
    priority: 'Medium',
    description: '',
    nextStep: '',
  });

  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addProduct = (product) => {
    const existing = selectedProducts.find((p) => p.id === product.id);
    if (existing) {
      setSelectedProducts(
        selectedProducts.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p))
      );
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const updateProductQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeProduct(productId);
    } else {
      setSelectedProducts(
        selectedProducts.map((p) => (p.id === productId ? { ...p, quantity } : p))
      );
    }
  };

  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    console.log('Creating deal:', { ...formData, products: selectedProducts });
    // Redirect to deals list or the new deal detail page
    router.push('/sales/deals');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <UnifiedLayout hubId="sales" pageTitle="Create New Deal" fixedMenu={null}>
      <div className="p-6">
        <div className="space-y-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/sales/deals">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Create New Deal</h1>
                <p className="text-muted-foreground">Add a new deal to your pipeline</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/sales/deals">Cancel</Link>
              </Button>
              <Button onClick={handleSubmit}>
                <Save className="h-4 w-4 mr-2" />
                Create Deal
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the essential details about this deal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Deal Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Enterprise License - Acme Corp"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value">Deal Value *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="value"
                        type="number"
                        placeholder="0"
                        value={formData.value}
                        onChange={(e) => handleInputChange('value', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company *</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="company"
                        placeholder="Select or create company"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact">Primary Contact *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="contact"
                        placeholder="Select or create contact"
                        value={formData.contact}
                        onChange={(e) => handleInputChange('contact', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe this deal..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Deal Details */}
            <Card>
              <CardHeader>
                <CardTitle>Deal Details</CardTitle>
                <CardDescription>Configure the deal stage, timeline, and priority</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stage">Stage *</Label>
                    <Select
                      value={formData.stage}
                      onValueChange={(value) => handleInputChange('stage', value)}
                    >
                      <SelectTrigger id="stage">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {stages.map((stage) => (
                          <SelectItem key={stage} value={stage}>
                            {stage}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="probability">Win Probability (%)</Label>
                    <div className="relative">
                      <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="probability"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0-100"
                        value={formData.probability}
                        onChange={(e) => handleInputChange('probability', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => handleInputChange('priority', value)}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="closeDate">Expected Close Date *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="closeDate"
                        type="date"
                        value={formData.closeDate}
                        onChange={(e) => handleInputChange('closeDate', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nextStep">Next Step</Label>
                    <Input
                      id="nextStep"
                      placeholder="e.g., Schedule demo call"
                      value={formData.nextStep}
                      onChange={(e) => handleInputChange('nextStep', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products */}
            <Card>
              <CardHeader>
                <CardTitle>Products & Services</CardTitle>
                <CardDescription>Add products or services to this deal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product Selection */}
                <div>
                  <Label>Add Product</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {mockProducts.map((product) => (
                      <Button
                        key={product.id}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addProduct(product)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {product.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Selected Products */}
                {selectedProducts.length > 0 && (
                  <div className="space-y-3">
                    <Separator />
                    <Label>Selected Products</Label>
                    {selectedProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(product.price)} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="1"
                            value={product.quantity}
                            onChange={(e) =>
                              updateProductQuantity(product.id, parseInt(e.target.value))
                            }
                            className="w-20"
                          />
                          <div className="text-right min-w-[100px]">
                            <p className="font-bold">
                              {formatCurrency(product.price * product.quantity)}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeProduct(product.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex items-center justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-green-600">{formatCurrency(calculateTotal())}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline" asChild>
                <Link href="/sales/deals">Cancel</Link>
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Create Deal
              </Button>
            </div>
          </form>
        </div>
      </div>
    </UnifiedLayout>
  );
}
