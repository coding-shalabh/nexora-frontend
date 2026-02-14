'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { UnifiedLayout } from '@/components/layout/unified';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const mockProducts = [
  { id: 1, name: 'Enterprise Plan', description: 'Unlimited users and features', price: 999 },
  { id: 2, name: 'Professional Plan', description: 'Up to 50 users', price: 499 },
  { id: 3, name: 'Premium Support', description: '24/7 premium support', price: 25100 },
  { id: 4, name: 'Custom Integration', description: 'Custom integration services', price: 15000 },
];

export default function NewQuotePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    contact: '',
    validUntil: '',
    notes: '',
    terms:
      'This quote is valid until the date specified above. Payment is due within 30 days of acceptance.',
  });

  const [items, setItems] = useState([]);

  const addItem = (product) => {
    const existing = items.find((i) => i.id === product.id);
    if (existing) {
      setItems(items.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)));
    } else {
      setItems([...items, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeItem(id);
    } else {
      setItems(items.map((i) => (i.id === id ? { ...i, quantity } : i)));
    }
  };

  const removeItem = (id) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating quote:', { ...formData, items });
    router.push('/sales/quotes');
  };

  return (
    <UnifiedLayout hubId="sales" pageTitle="Create Quote" fixedMenu={null}>
      <div className="p-6">
        <div className="space-y-6 max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/sales/quotes">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Create Quote</h1>
                <p className="text-muted-foreground">Build a new quote for your customer</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/sales/quotes">Cancel</Link>
              </Button>
              <Button onClick={handleSubmit}>
                <Save className="h-4 w-4 mr-2" />
                Create Quote
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Quote Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Enterprise License Quote"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validUntil">Valid Until *</Label>
                    <Input
                      id="validUntil"
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company *</Label>
                    <Input
                      id="company"
                      placeholder="Select company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact *</Label>
                    <Input
                      id="contact"
                      placeholder="Select contact"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Line Items</CardTitle>
                <CardDescription>Add products or services to this quote</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Add Product</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {mockProducts.map((product) => (
                      <Button
                        key={product.id}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addItem(product)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {product.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {items.length > 0 && (
                  <div className="space-y-3">
                    <Separator />
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatCurrency(item.price)} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                            className="w-20"
                          />
                          <div className="text-right min-w-[120px]">
                            <p className="font-bold">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-end">
                      <div className="w-80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Tax</span>
                          <span className="font-medium">$0.00</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold">Total</span>
                          <span className="text-2xl font-bold text-green-600">
                            {formatCurrency(calculateSubtotal())}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special notes for the customer..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terms">Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    placeholder="Payment terms and conditions..."
                    value={formData.terms}
                    onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline" asChild>
                <Link href="/sales/quotes">Cancel</Link>
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Create Quote
              </Button>
            </div>
          </form>
        </div>
      </div>
    </UnifiedLayout>
  );
}
