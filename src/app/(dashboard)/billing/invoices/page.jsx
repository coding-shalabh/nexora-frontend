'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  FileText,
  Send,
  Download,
  Eye,
  CreditCard,
  AlertCircle,
  X,
  Trash2,
  IndianRupee,
  Building2,
  Loader2,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useBilling, formatCurrency, indianStates, gstRates } from '@/hooks/use-billing';

const statusConfig = {
  DRAFT: { label: 'Draft', color: 'bg-gray-100 text-gray-700' },
  SENT: { label: 'Sent', color: 'bg-blue-100 text-blue-700' },
  VIEWED: { label: 'Viewed', color: 'bg-purple-100 text-purple-700' },
  PAID: { label: 'Paid', color: 'bg-green-100 text-green-700' },
  PARTIAL: { label: 'Partial', color: 'bg-yellow-100 text-yellow-700' },
  OVERDUE: { label: 'Overdue', color: 'bg-red-100 text-red-700' },
  CANCELLED: { label: 'Cancelled', color: 'bg-gray-100 text-gray-500' },
  VOID: { label: 'Void', color: 'bg-gray-100 text-gray-500' },
};

const invoiceTypes = [
  { value: 'TAX_INVOICE', label: 'Tax Invoice' },
  { value: 'BILL_OF_SUPPLY', label: 'Bill of Supply' },
  { value: 'CREDIT_NOTE', label: 'Credit Note' },
  { value: 'DEBIT_NOTE', label: 'Debit Note' },
  { value: 'EXPORT_INVOICE', label: 'Export Invoice' },
];

const supplyTypes = [
  { value: 'B2B', label: 'B2B (Business)' },
  { value: 'B2C_LARGE', label: 'B2C Large (>2.5L)' },
  { value: 'B2C_SMALL', label: 'B2C Small' },
  { value: 'SEZ_WITH_PAY', label: 'SEZ with Tax' },
  { value: 'SEZ_WITHOUT_PAY', label: 'SEZ without Tax' },
  { value: 'EXPORT_WITH_PAY', label: 'Export with IGST' },
  { value: 'EXPORT_WITHOUT_PAY', label: 'Export (LUT)' },
];

export default function InvoicesPage() {
  const { invoices, loading, error, fetchInvoices, createInvoice, sendInvoice, deleteInvoice } = useBilling();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [creating, setCreating] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    isGstInvoice: true,
    invoiceType: 'TAX_INVOICE',
    supplyType: 'B2B',
    buyerGstin: '',
    buyerLegalName: '',
    buyerAddress: '',
    buyerStateCode: '',
    placeOfSupply: '',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [{ description: '', quantity: 1, unitPrice: 0, hsnCode: '', unit: 'NOS', gstRate: 18 }],
    notes: '',
    transporterName: '',
    vehicleNumber: '',
  });

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const filteredInvoices = invoices.filter((invoice) => {
    if (statusFilter !== 'all' && invoice.status !== statusFilter.toUpperCase()) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        invoice.invoiceNumber?.toLowerCase().includes(query) ||
        invoice.buyerLegalName?.toLowerCase().includes(query) ||
        invoice.contact?.firstName?.toLowerCase().includes(query) ||
        invoice.contact?.lastName?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const totalAmount = invoices.reduce((sum, i) => sum + Number(i.totalAmount || 0), 0);
  const paidAmount = invoices.reduce((sum, i) => sum + Number(i.paidAmount || 0), 0);
  const overdueAmount = invoices
    .filter((i) => i.status === 'OVERDUE')
    .reduce((sum, i) => sum + (Number(i.totalAmount || 0) - Number(i.paidAmount || 0)), 0);

  const addLineItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unitPrice: 0, hsnCode: '', unit: 'NOS', gstRate: 18 }],
    });
  };

  const removeLineItem = (index) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((_, i) => i !== index),
      });
    }
  };

  const updateLineItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;

    const isInterState = formData.placeOfSupply && formData.buyerStateCode !== formData.placeOfSupply;

    formData.items.forEach((item) => {
      const taxableValue = item.quantity * item.unitPrice;
      subtotal += taxableValue;

      if (formData.isGstInvoice && item.gstRate > 0) {
        if (isInterState) {
          totalIgst += taxableValue * (item.gstRate / 100);
        } else {
          totalCgst += taxableValue * (item.gstRate / 200);
          totalSgst += taxableValue * (item.gstRate / 200);
        }
      }
    });

    const totalTax = totalCgst + totalSgst + totalIgst;
    return { subtotal, totalCgst, totalSgst, totalIgst, totalTax, total: subtotal + totalTax };
  };

  const handleCreateInvoice = async () => {
    setCreating(true);
    try {
      const invoiceData = {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString(),
        items: formData.items.map((item) => ({
          ...item,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          gstRate: Number(item.gstRate),
        })),
      };
      await createInvoice(invoiceData);
      setShowCreateModal(false);
      setFormData({
        isGstInvoice: true,
        invoiceType: 'TAX_INVOICE',
        supplyType: 'B2B',
        buyerGstin: '',
        buyerLegalName: '',
        buyerAddress: '',
        buyerStateCode: '',
        placeOfSupply: '',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [{ description: '', quantity: 1, unitPrice: 0, hsnCode: '', unit: 'NOS', gstRate: 18 }],
        notes: '',
        transporterName: '',
        vehicleNumber: '',
      });
    } catch (err) {
      console.error('Failed to create invoice:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleSendInvoice = async (id) => {
    try {
      await sendInvoice(id);
    } catch (err) {
      console.error('Failed to send invoice:', err);
    }
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">Manage GST compliant billing and payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fetchInvoices()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create GST Invoice
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Invoiced</div>
          <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Paid</div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(paidAmount)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Outstanding</div>
          <div className="text-2xl font-bold">{formatCurrency(totalAmount - paidAmount)}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">Overdue</div>
            {overdueAmount > 0 && <AlertCircle className="h-4 w-4 text-destructive" />}
          </div>
          <div className="text-2xl font-bold text-destructive">{formatCurrency(overdueAmount)}</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-1 border rounded-lg p-1 overflow-x-auto">
            <Button
              variant={statusFilter === 'all' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              All
            </Button>
            {['draft', 'sent', 'paid', 'partial', 'overdue'].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter(status)}
              >
                {statusConfig[status.toUpperCase()]?.label || status}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="p-4 border-destructive bg-destructive/10">
          <p className="text-destructive">{error}</p>
        </Card>
      )}

      {/* Invoices Table */}
      {!loading && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Invoice</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">GST</th>
                  <th className="p-4 text-right text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="p-4 text-right text-sm font-medium text-muted-foreground">Tax</th>
                  <th className="p-4 text-right text-sm font-medium text-muted-foreground">Total</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Due Date</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-muted-foreground">
                      No invoices found. Create your first invoice!
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-10 w-10 rounded-lg flex items-center justify-center",
                            invoice.isGstInvoice ? "bg-orange-100" : "bg-primary/10"
                          )}>
                            {invoice.isGstInvoice ? (
                              <IndianRupee className="h-5 w-5 text-orange-600" />
                            ) : (
                              <FileText className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div>
                            <span className="font-mono text-sm">{invoice.invoiceNumber}</span>
                            <div className="text-xs text-muted-foreground">
                              {new Date(invoice.createdAt).toLocaleDateString('en-IN')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">
                            {invoice.buyerLegalName || invoice.contact?.firstName || 'N/A'}
                          </div>
                          {invoice.buyerGstin && (
                            <div className="text-xs text-muted-foreground font-mono">
                              GSTIN: {invoice.buyerGstin}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={cn('text-xs px-2 py-1 rounded-full', statusConfig[invoice.status]?.color)}>
                          {statusConfig[invoice.status]?.label || invoice.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {invoice.isGstInvoice ? (
                          <div className="text-xs">
                            {invoice.isInterState ? (
                              <span className="text-blue-600">IGST</span>
                            ) : (
                              <span className="text-green-600">CGST+SGST</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">Non-GST</span>
                        )}
                      </td>
                      <td className="p-4 text-right font-medium">
                        {formatCurrency(Number(invoice.taxableAmount || invoice.subtotal || 0), invoice.currency)}
                      </td>
                      <td className="p-4 text-right text-sm text-muted-foreground">
                        {formatCurrency(Number(invoice.taxAmount || 0), invoice.currency)}
                      </td>
                      <td className="p-4 text-right font-bold">
                        {formatCurrency(Number(invoice.totalAmount || 0), invoice.currency)}
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          'text-sm',
                          invoice.status === 'OVERDUE' && 'text-destructive'
                        )}>
                          {new Date(invoice.dueDate).toLocaleDateString('en-IN')}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewInvoice(invoice)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {invoice.status === 'DRAFT' && (
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleSendInvoice(invoice.id)}>
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Create GST Invoice</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowCreateModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Invoice Type */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Invoice Type</Label>
                    <select
                      className="w-full border rounded-md p-2 mt-1"
                      value={formData.invoiceType}
                      onChange={(e) => setFormData({ ...formData, invoiceType: e.target.value })}
                    >
                      {invoiceTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Supply Type</Label>
                    <select
                      className="w-full border rounded-md p-2 mt-1"
                      value={formData.supplyType}
                      onChange={(e) => setFormData({ ...formData, supplyType: e.target.value })}
                    >
                      {supplyTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* Buyer Information */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Buyer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>GSTIN</Label>
                      <Input
                        placeholder="e.g., 29AABCU9603R1ZM"
                        value={formData.buyerGstin}
                        onChange={(e) => setFormData({ ...formData, buyerGstin: e.target.value.toUpperCase() })}
                        maxLength={15}
                      />
                    </div>
                    <div>
                      <Label>Legal Name</Label>
                      <Input
                        placeholder="Company Legal Name"
                        value={formData.buyerLegalName}
                        onChange={(e) => setFormData({ ...formData, buyerLegalName: e.target.value })}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Address</Label>
                      <Input
                        placeholder="Full Address"
                        value={formData.buyerAddress}
                        onChange={(e) => setFormData({ ...formData, buyerAddress: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>State</Label>
                      <select
                        className="w-full border rounded-md p-2"
                        value={formData.buyerStateCode}
                        onChange={(e) => setFormData({
                          ...formData,
                          buyerStateCode: e.target.value,
                          placeOfSupply: e.target.value // Auto-set place of supply
                        })}
                      >
                        <option value="">Select State</option>
                        {indianStates.map((state) => (
                          <option key={state.code} value={state.code}>
                            {state.code} - {state.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Place of Supply</Label>
                      <select
                        className="w-full border rounded-md p-2"
                        value={formData.placeOfSupply}
                        onChange={(e) => setFormData({ ...formData, placeOfSupply: e.target.value })}
                      >
                        <option value="">Select Place</option>
                        {indianStates.map((state) => (
                          <option key={state.code} value={state.code}>
                            {state.code} - {state.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Line Items */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Line Items</h3>
                    <Button variant="outline" size="sm" onClick={addLineItem}>
                      <Plus className="h-4 w-4 mr-1" /> Add Item
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {formData.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-3">
                          <Label className="text-xs">Description</Label>
                          <Input
                            placeholder="Item description"
                            value={item.description}
                            onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">HSN/SAC Code</Label>
                          <Input
                            placeholder="998314"
                            value={item.hsnCode}
                            onChange={(e) => updateLineItem(index, 'hsnCode', e.target.value)}
                          />
                        </div>
                        <div className="col-span-1">
                          <Label className="text-xs">Qty</Label>
                          <Input
                            type="number"
                            min="0.001"
                            step="0.001"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                          />
                        </div>
                        <div className="col-span-1">
                          <Label className="text-xs">Unit</Label>
                          <Input
                            placeholder="NOS"
                            value={item.unit}
                            onChange={(e) => updateLineItem(index, 'unit', e.target.value)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">Unit Price</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateLineItem(index, 'unitPrice', e.target.value)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">GST Rate</Label>
                          <select
                            className="w-full border rounded-md p-2 h-10"
                            value={item.gstRate}
                            onChange={(e) => updateLineItem(index, 'gstRate', Number(e.target.value))}
                          >
                            {gstRates.map((rate) => (
                              <option key={rate.rate} value={rate.rate}>{rate.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10"
                            onClick={() => removeLineItem(index)}
                            disabled={formData.items.length === 1}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="border rounded-lg p-4 bg-muted/50">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Taxable Amount:</span>
                      <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
                    </div>
                    {formData.isGstInvoice && (
                      <>
                        {formData.placeOfSupply && formData.buyerStateCode !== formData.placeOfSupply ? (
                          <div className="flex justify-between text-blue-600">
                            <span>IGST ({formData.items[0]?.gstRate || 0}%):</span>
                            <span className="font-medium">{formatCurrency(totals.totalIgst)}</span>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between text-green-600">
                              <span>CGST ({(formData.items[0]?.gstRate || 0) / 2}%):</span>
                              <span className="font-medium">{formatCurrency(totals.totalCgst)}</span>
                            </div>
                            <div className="flex justify-between text-green-600">
                              <span>SGST ({(formData.items[0]?.gstRate || 0) / 2}%):</span>
                              <span className="font-medium">{formatCurrency(totals.totalSgst)}</span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between border-t pt-2">
                          <span>Total Tax:</span>
                          <span className="font-medium">{formatCurrency(totals.totalTax)}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between border-t pt-2 text-lg font-bold">
                      <span>Grand Total:</span>
                      <span>{formatCurrency(totals.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <Label>Notes</Label>
                  <textarea
                    className="w-full border rounded-md p-2 mt-1"
                    rows={3}
                    placeholder="Additional notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateInvoice} disabled={creating}>
                    {creating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Create Invoice
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* View Invoice Modal */}
      {showViewModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">{selectedInvoice.invoiceNumber}</h2>
                  <p className="text-muted-foreground">
                    {selectedInvoice.isGstInvoice ? 'GST Tax Invoice' : 'Invoice'}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowViewModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Seller & Buyer Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">SELLER</h4>
                    <p className="font-medium">{selectedInvoice.sellerLegalName || 'Your Company'}</p>
                    {selectedInvoice.sellerGstin && <p className="text-sm">GSTIN: {selectedInvoice.sellerGstin}</p>}
                    <p className="text-sm text-muted-foreground">{selectedInvoice.sellerAddress}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">BUYER</h4>
                    <p className="font-medium">{selectedInvoice.buyerLegalName || selectedInvoice.contact?.firstName || 'N/A'}</p>
                    {selectedInvoice.buyerGstin && <p className="text-sm">GSTIN: {selectedInvoice.buyerGstin}</p>}
                    <p className="text-sm text-muted-foreground">{selectedInvoice.buyerAddress}</p>
                  </div>
                </div>

                {/* Line Items */}
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-3 text-left">Description</th>
                        <th className="p-3 text-left">HSN/SAC</th>
                        <th className="p-3 text-right">Qty</th>
                        <th className="p-3 text-right">Rate</th>
                        <th className="p-3 text-right">Taxable</th>
                        {selectedInvoice.isInterState ? (
                          <th className="p-3 text-right">IGST</th>
                        ) : (
                          <>
                            <th className="p-3 text-right">CGST</th>
                            <th className="p-3 text-right">SGST</th>
                          </>
                        )}
                        <th className="p-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.lineItems?.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="p-3">{item.description}</td>
                          <td className="p-3">{item.hsnCode || item.sacCode || '-'}</td>
                          <td className="p-3 text-right">{item.quantity} {item.unit}</td>
                          <td className="p-3 text-right">{formatCurrency(Number(item.unitPrice), selectedInvoice.currency)}</td>
                          <td className="p-3 text-right">{formatCurrency(Number(item.taxableValue), selectedInvoice.currency)}</td>
                          {selectedInvoice.isInterState ? (
                            <td className="p-3 text-right">{formatCurrency(Number(item.igstAmount), selectedInvoice.currency)}</td>
                          ) : (
                            <>
                              <td className="p-3 text-right">{formatCurrency(Number(item.cgstAmount), selectedInvoice.currency)}</td>
                              <td className="p-3 text-right">{formatCurrency(Number(item.sgstAmount), selectedInvoice.currency)}</td>
                            </>
                          )}
                          <td className="p-3 text-right font-medium">{formatCurrency(Number(item.totalPrice), selectedInvoice.currency)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-72 space-y-2">
                    <div className="flex justify-between">
                      <span>Taxable Amount:</span>
                      <span>{formatCurrency(Number(selectedInvoice.taxableAmount || selectedInvoice.subtotal), selectedInvoice.currency)}</span>
                    </div>
                    {selectedInvoice.isGstInvoice && (
                      <>
                        {selectedInvoice.isInterState ? (
                          <div className="flex justify-between text-blue-600">
                            <span>IGST:</span>
                            <span>{formatCurrency(Number(selectedInvoice.igstAmount), selectedInvoice.currency)}</span>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between text-green-600">
                              <span>CGST:</span>
                              <span>{formatCurrency(Number(selectedInvoice.cgstAmount), selectedInvoice.currency)}</span>
                            </div>
                            <div className="flex justify-between text-green-600">
                              <span>SGST:</span>
                              <span>{formatCurrency(Number(selectedInvoice.sgstAmount), selectedInvoice.currency)}</span>
                            </div>
                          </>
                        )}
                      </>
                    )}
                    <div className="flex justify-between border-t pt-2 font-bold text-lg">
                      <span>Total:</span>
                      <span>{formatCurrency(Number(selectedInvoice.totalAmount), selectedInvoice.currency)}</span>
                    </div>
                    {Number(selectedInvoice.paidAmount) > 0 && (
                      <>
                        <div className="flex justify-between text-green-600">
                          <span>Paid:</span>
                          <span>{formatCurrency(Number(selectedInvoice.paidAmount), selectedInvoice.currency)}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Balance:</span>
                          <span>{formatCurrency(Number(selectedInvoice.balanceDue), selectedInvoice.currency)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
