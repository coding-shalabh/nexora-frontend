'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { UnifiedLayout } from '@/components/layout/unified';
import {
  ArrowLeft,
  Save,
  Plus,
  X,
  User,
  Calendar,
  FileText,
  DollarSign,
  Trash2,
  MapPin,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
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
  TableFooter,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

// Normalize API invoice data to form-friendly shape
function normalizeApiInvoice(inv) {
  const contactName = inv.contact
    ? `${inv.contact.firstName || ''} ${inv.contact.lastName || ''}`.trim()
    : inv.buyerLegalName || inv.buyerTradeName || '';
  return {
    id: inv.invoiceNumber || inv.id,
    _id: inv.id,
    customer: contactName,
    customerAddress: inv.buyerAddress || '',
    customerGSTIN: inv.buyerGstin || '',
    customerEmail: inv.contact?.email || '',
    status: (inv.status || 'draft').toLowerCase(),
    issueDate: inv.issueDate ? inv.issueDate.split('T')[0] : '',
    dueDate: inv.dueDate ? inv.dueDate.split('T')[0] : '',
    placeOfSupply: inv.placeOfSupplyName || inv.placeOfSupply || '',
    lineItems: (inv.lines || []).map((l) => ({
      description: l.description,
      hsn: l.hsnCode || l.sacCode || '',
      qty: Number(l.quantity) || 1,
      rate: Number(l.unitPrice) || 0,
      taxRate: Number(l.taxRate) || 0,
    })),
    notes: inv.notes || '',
    terms: inv.terms || '',
  };
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-700',
  sent: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
};

export default function EditInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [invoice, setInvoice] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const [formData, setFormData] = useState({
    customer: '',
    customerAddress: '',
    customerGSTIN: '',
    customerEmail: '',
    issueDate: '',
    dueDate: '',
    paymentTerms: '',
    placeOfSupply: '',
    status: 'draft',
    items: [],
    notes: '',
    terms: '',
  });

  // Fetch invoice from API
  useEffect(() => {
    setIsLoading(true);
    api
      .get(`/billing/invoices/${params.invoiceId}`)
      .then((res) => {
        const raw = res.data?.data || res.data;
        if (raw) {
          const inv = normalizeApiInvoice(raw);
          setInvoice(inv);
          setFormData({
            customer: inv.customer,
            customerAddress: inv.customerAddress || '',
            customerGSTIN: inv.customerGSTIN || '',
            customerEmail: inv.customerEmail || '',
            issueDate: inv.issueDate,
            dueDate: inv.dueDate,
            paymentTerms: '',
            placeOfSupply: inv.placeOfSupply || '',
            status: inv.status,
            items: (inv.lineItems || []).map((item, i) => ({
              ...item,
              id: i + 1,
              amount: item.qty * item.rate,
            })),
            notes: inv.notes || '',
            terms: inv.terms || '',
          });
        } else {
          setNotFound(true);
        }
      })
      .catch(() => {
        setNotFound(true);
      })
      .finally(() => setIsLoading(false));
  }, [params.invoiceId]);

  const [newItem, setNewItem] = useState({
    description: '',
    hsn: '',
    qty: 1,
    rate: 0,
    taxRate: 18,
  });

  const addItem = () => {
    if (newItem.description && newItem.rate > 0) {
      const amount = newItem.qty * newItem.rate;
      setFormData((prev) => ({
        ...prev,
        items: [...prev.items, { ...newItem, id: Date.now(), amount }],
      }));
      setNewItem({ description: '', hsn: '', qty: 1, rate: 0, taxRate: 18 });
    }
  };

  const removeItem = (id) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const subtotal = formData.items.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const taxAmount = formData.items.reduce(
    (sum, item) => sum + (item.qty * item.rate * item.taxRate) / 100,
    0
  );
  const total = subtotal + taxAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    if (!formData.customer || formData.items.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in customer details and add at least one item.',
        variant: 'destructive',
      });
      setIsSaving(false);
      return;
    }

    try {
      const payload = {
        items: formData.items.map((item) => ({
          description: item.description,
          quantity: item.qty,
          unitPrice: item.rate,
          discount: 0,
        })),
        notes: formData.notes || undefined,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
      };

      await api.patch(`/billing/invoices/${params.invoiceId}`, payload);
      toast({
        title: 'Invoice updated',
        description: `${invoice?.id || params.invoiceId} has been updated successfully.`,
      });
      router.push('/commerce/invoices');
    } catch (err) {
      toast({
        title: 'Update failed',
        description: err.response?.data?.message || 'Could not update invoice. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <UnifiedLayout hubId="commerce" pageTitle="Loading..." fixedMenu={null}>
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-muted-foreground">Loading invoice...</p>
        </div>
      </UnifiedLayout>
    );
  }

  if (notFound || !invoice) {
    return (
      <UnifiedLayout hubId="commerce" pageTitle="Invoice Not Found" fixedMenu={null}>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <FileText className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Invoice not found</h2>
          <p className="text-muted-foreground">The invoice {params.invoiceId} does not exist.</p>
          <Button variant="outline" onClick={() => router.push('/commerce/invoices')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Invoices
          </Button>
        </div>
      </UnifiedLayout>
    );
  }

  return (
    <UnifiedLayout hubId="commerce" pageTitle={`Edit ${params.invoiceId}`} fixedMenu={null}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">Edit {params.invoiceId}</h1>
                <Badge className={statusColors[formData.status]}>{formData.status}</Badge>
              </div>
              <p className="text-muted-foreground">Modify invoice details and line items</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving} className="gap-2">
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer & Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer & Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      Customer Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.customer}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, customer: e.target.value }))
                      }
                      placeholder="Customer name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Customer Email</Label>
                    <Input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, customerEmail: e.target.value }))
                      }
                      placeholder="billing@company.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Customer Address</Label>
                  <Input
                    value={formData.customerAddress}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, customerAddress: e.target.value }))
                    }
                    placeholder="Full address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Customer GSTIN</Label>
                    <Input
                      value={formData.customerGSTIN}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, customerGSTIN: e.target.value }))
                      }
                      placeholder="e.g. 29AABCA1234F1ZP"
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Place of Supply</Label>
                    <Input
                      value={formData.placeOfSupply}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, placeOfSupply: e.target.value }))
                      }
                      placeholder="e.g. Karnataka (29)"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Issue Date</Label>
                    <Input
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, issueDate: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Terms</Label>
                    <Select
                      value={formData.paymentTerms}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, paymentTerms: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                        <SelectItem value="Net 15">Net 15</SelectItem>
                        <SelectItem value="Net 30">Net 30</SelectItem>
                        <SelectItem value="Net 45">Net 45</SelectItem>
                        <SelectItem value="Net 60">Net 60</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Line Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Line Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Item Form */}
                <div className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-4 space-y-1">
                    <Label className="text-xs text-muted-foreground">Description</Label>
                    <Input
                      placeholder="Item description"
                      value={newItem.description}
                      onChange={(e) =>
                        setNewItem((prev) => ({ ...prev, description: e.target.value }))
                      }
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs text-muted-foreground">HSN/SAC</Label>
                    <Input
                      placeholder="998314"
                      value={newItem.hsn}
                      onChange={(e) => setNewItem((prev) => ({ ...prev, hsn: e.target.value }))}
                    />
                  </div>
                  <div className="col-span-1 space-y-1">
                    <Label className="text-xs text-muted-foreground">Qty</Label>
                    <Input
                      type="number"
                      value={newItem.qty}
                      onChange={(e) =>
                        setNewItem((prev) => ({ ...prev, qty: parseInt(e.target.value) || 1 }))
                      }
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs text-muted-foreground">Rate</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newItem.rate}
                      onChange={(e) =>
                        setNewItem((prev) => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))
                      }
                    />
                  </div>
                  <div className="col-span-1 space-y-1">
                    <Label className="text-xs text-muted-foreground">Tax %</Label>
                    <Input
                      type="number"
                      value={newItem.taxRate}
                      onChange={(e) =>
                        setNewItem((prev) => ({
                          ...prev,
                          taxRate: parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Button type="button" onClick={addItem} className="w-full gap-2">
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>

                {/* Items Table */}
                {formData.items.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-center w-[80px]">HSN</TableHead>
                        <TableHead className="text-center w-[50px]">Qty</TableHead>
                        <TableHead className="text-right w-[80px]">Rate</TableHead>
                        <TableHead className="text-center w-[60px]">Tax %</TableHead>
                        <TableHead className="text-right w-[90px]">Amount</TableHead>
                        <TableHead className="w-[40px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.items.map((item) => {
                        const lineAmt = item.qty * item.rate;
                        const lineTax = (lineAmt * item.taxRate) / 100;
                        return (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.description}</TableCell>
                            <TableCell className="text-center font-mono text-xs">
                              {item.hsn || '—'}
                            </TableCell>
                            <TableCell className="text-center">{item.qty}</TableCell>
                            <TableCell className="text-right">${item.rate.toFixed(2)}</TableCell>
                            <TableCell className="text-center">{item.taxRate}%</TableCell>
                            <TableCell className="text-right font-medium">
                              ${(lineAmt + lineTax).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5 text-red-600" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={5} className="text-right">
                          Subtotal
                        </TableCell>
                        <TableCell className="text-right">${subtotal.toFixed(2)}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={5} className="text-right">
                          Tax (GST)
                        </TableCell>
                        <TableCell className="text-right">${taxAmount.toFixed(2)}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={5} className="text-right font-bold text-lg">
                          Total
                        </TableCell>
                        <TableCell className="text-right font-bold text-lg">
                          ${total.toFixed(2)}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Notes and Terms */}
            <Card>
              <CardHeader>
                <CardTitle>Notes & Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes for the customer..."
                    value={formData.notes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terms">Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    placeholder="Payment terms..."
                    value={formData.terms}
                    onChange={(e) => setFormData((prev) => ({ ...prev, terms: e.target.value }))}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Invoice Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Invoice Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium">{formData.items.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (GST)</span>
                  <span className="font-medium">${taxAmount.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-medium">{formData.customer || 'No customer'}</p>
                {formData.customerAddress && (
                  <p className="text-muted-foreground">{formData.customerAddress}</p>
                )}
                {formData.customerEmail && (
                  <p className="text-muted-foreground">{formData.customerEmail}</p>
                )}
                {formData.customerGSTIN && (
                  <Badge variant="outline" className="font-mono text-xs">
                    GSTIN: {formData.customerGSTIN}
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </UnifiedLayout>
  );
}
