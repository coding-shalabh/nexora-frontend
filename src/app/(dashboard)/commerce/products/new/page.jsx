'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UnifiedLayout } from '@/components/layout/unified';
import {
  ArrowLeft,
  Save,
  Package,
  DollarSign,
  FileText,
  Tag,
  Image as ImageIcon,
  Plus,
  X,
  Percent,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const categories = ['Software', 'Services', 'Support', 'Add-ons', 'Hardware', 'Training'];
const units = ['license', 'hour', 'piece', 'month', 'year', 'user', 'seat'];
const currencies = ['USD', 'EUR', 'GBP', 'INR'];

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category: '',
    price: '',
    cost: '',
    currency: 'USD',
    stock: 'Unlimited',
    type: 'one-time',
    billingPeriod: '',
    unit: 'piece',
    taxable: true,
    taxRate: '18',
    status: 'draft',
    tags: [],
  });

  const [newTag, setNewTag] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((tag) => tag !== tagToRemove) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Validation
    if (!formData.name || !formData.sku || !formData.price || !formData.category) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      setIsSaving(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Product created',
        description: `${formData.name} has been created successfully.`,
      });
      router.push('/commerce/products');
      setIsSaving(false);
    }, 1000);
  };

  const margin =
    formData.price && formData.cost
      ? (
          ((parseFloat(formData.price) - parseFloat(formData.cost)) / parseFloat(formData.price)) *
          100
        ).toFixed(1)
      : '0';

  return (
    <UnifiedLayout hubId="commerce" pageTitle="Create Product" fixedMenu={null}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Create Product</h1>
              <p className="text-muted-foreground">Add a new product to your catalog</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving} className="gap-2">
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Product Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Premium CRM License"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">
                      SKU <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="sku"
                      placeholder="CRM-PREM-001"
                      value={formData.sku}
                      onChange={(e) => handleChange('sku', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter product description..."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select
                      value={formData.unit}
                      onValueChange={(value) => handleChange('unit', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Price <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="99.99"
                      value={formData.price}
                      onChange={(e) => handleChange('price', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost</Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      placeholder="45.00"
                      value={formData.cost}
                      onChange={(e) => handleChange('cost', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => handleChange('currency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.price && formData.cost && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Profit Margin</span>
                      <Badge
                        variant={parseFloat(margin) > 50 ? 'default' : 'secondary'}
                        className="text-lg"
                      >
                        {margin}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Profit: $
                      {formData.price && formData.cost
                        ? (parseFloat(formData.price) - parseFloat(formData.cost)).toFixed(2)
                        : '0.00'}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="taxable">Taxable Product</Label>
                    <p className="text-xs text-muted-foreground">Apply tax to this product</p>
                  </div>
                  <Switch
                    id="taxable"
                    checked={formData.taxable}
                    onCheckedChange={(checked) => handleChange('taxable', checked)}
                  />
                </div>

                {formData.taxable && (
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      step="0.01"
                      placeholder="18"
                      value={formData.taxRate}
                      onChange={(e) => handleChange('taxRate', e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Product Type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Product Type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one-time">One-time</SelectItem>
                      <SelectItem value="recurring">Recurring</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.type === 'recurring' && (
                  <div className="space-y-2">
                    <Label htmlFor="billingPeriod">Billing Period</Label>
                    <Select
                      value={formData.billingPeriod}
                      onValueChange={(value) => handleChange('billingPeriod', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select billing period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Product Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    placeholder="Unlimited or enter quantity"
                    value={formData.stock}
                    onChange={(e) => handleChange('stock', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {tag}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Image */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Product Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload image</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </UnifiedLayout>
  );
}
