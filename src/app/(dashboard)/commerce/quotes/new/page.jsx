'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2, User, Calendar, FileText, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

export default function NewQuotePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    customer: '',
    createdDate: new Date().toISOString().split('T')[0],
    validUntil: '',
    items: [],
    tax: 18,
    discount: 0,
    notes: '',
    terms: 'Quote valid for 30 days. Payment terms: Net 15 days.',
  });

  const [newItem, setNewItem] = useState({
    description: '',
    quantity: 1,
    rate: 0,
  });

  const addItem = () => {
    if (newItem.description && newItem.rate > 0) {
      const amount = newItem.quantity * newItem.rate;
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, { ...newItem, id: Date.now(), amount }],
      }));
      setNewItem({ description: '', quantity: 1, rate: 0 });
    }
  };

  const removeItem = (id) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
  };

  const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = (subtotal * formData.tax) / 100;
  const total = subtotal + taxAmount - formData.discount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    if (!formData.customer || formData.items.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select a customer and add at least one item.',
        variant: 'destructive',
      });
      setIsSaving(false);
      return;
    }

    setTimeout(() => {
      toast({
        title: 'Quote created',
        description: 'Quote has been created successfully.',
      });
      router.push('/commerce/quotes');
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create Quote</h1>
            <p className="text-muted-foreground">Build a new sales quote</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSaving} className="gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Quote'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer & Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer <span className="text-red-500">*</span></Label>
                <Select value={formData.customer} onValueChange={(value) => setFormData(prev => ({ ...prev, customer: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acme">Acme Corporation</SelectItem>
                    <SelectItem value="tech">Tech Solutions Inc</SelectItem>
                    <SelectItem value="design">Design Studio LLC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="createdDate">Created Date</Label>
                  <Input
                    id="createdDate"
                    type="date"
                    value={formData.createdDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, createdDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Line Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-12 gap-2">
                <Input
                  placeholder="Description"
                  value={newItem.description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  className="col-span-5"
                />
                <Input
                  type="number"
                  placeholder="Qty"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  className="col-span-2"
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Rate"
                  value={newItem.rate}
                  onChange={(e) => setNewItem(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                  className="col-span-3"
                />
                <Button type="button" onClick={addItem} className="col-span-2 gap-2">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>

              {formData.items.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.rate.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">${item.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3} className="text-right">Subtotal</TableCell>
                      <TableCell className="text-right">${subtotal.toFixed(2)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3} className="text-right">Tax ({formData.tax}%)</TableCell>
                      <TableCell className="text-right">${taxAmount.toFixed(2)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    {formData.discount > 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-right text-green-600">Discount</TableCell>
                        <TableCell className="text-right text-green-600">-${formData.discount.toFixed(2)}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-bold text-lg">Total</TableCell>
                      <TableCell className="text-right font-bold text-lg">${total.toFixed(2)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes & Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  placeholder="Payment terms..."
                  value={formData.terms}
                  onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Tax & Discount
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tax">Tax Rate (%)</Label>
                <Input
                  id="tax"
                  type="number"
                  step="0.01"
                  value={formData.tax}
                  onChange={(e) => setFormData(prev => ({ ...prev, tax: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount ($)</Label>
                <Input
                  id="discount"
                  type="number"
                  step="0.01"
                  value={formData.discount}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quote Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">${taxAmount.toFixed(2)}</span>
              </div>
              {formData.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="font-medium text-green-600">-${formData.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
