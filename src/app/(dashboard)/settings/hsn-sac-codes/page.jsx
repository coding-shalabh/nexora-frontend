'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function HSNSACCodesPage() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    gstRate: 18,
    isService: false,
  });

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      const response = await fetch('/api/v1/gst/hsn', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setCodes(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch HSN codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const url = editingCode ? `/api/v1/gst/hsn/${editingCode.id}` : '/api/v1/gst/hsn';

      const method = editingCode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: 'success',
          text: editingCode
            ? 'HSN/SAC code updated successfully!'
            : 'HSN/SAC code created successfully!',
        });
        fetchCodes();
        handleCloseDialog();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save HSN/SAC code' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save HSN/SAC code' });
    }
  };

  const handleEdit = (code) => {
    setEditingCode(code);
    setFormData({
      code: code.code,
      description: code.description,
      gstRate: code.gstRate,
      isService: code.isService,
    });
    setShowDialog(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this HSN/SAC code?')) return;

    try {
      const response = await fetch(`/api/v1/gst/hsn/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'HSN/SAC code deleted successfully!' });
        fetchCodes();
      } else {
        setMessage({ type: 'error', text: 'Failed to delete HSN/SAC code' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete HSN/SAC code' });
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingCode(null);
    setFormData({
      code: '',
      description: '',
      gstRate: 18,
      isService: false,
    });
  };

  const filteredCodes = codes.filter(
    (code) =>
      code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">HSN/SAC Codes</h1>
          <p className="text-gray-600 mt-1">
            Manage Harmonized System of Nomenclature (HSN) and Service Accounting Codes (SAC)
          </p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Code
        </Button>
      </div>

      {message.text && (
        <Alert
          className={`mb-6 ${message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription
            className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}
          >
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search HSN/SAC codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Codes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            HSN/SAC Codes
          </CardTitle>
          <CardDescription>
            {filteredCodes.length} {filteredCodes.length === 1 ? 'code' : 'codes'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : filteredCodes.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No HSN/SAC codes</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'No codes match your search' : 'Get started by adding a new code'}
              </p>
              {!searchTerm && (
                <Button className="mt-4" onClick={() => setShowDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Code
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>GST Rate</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCodes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell className="font-mono font-medium">{code.code}</TableCell>
                    <TableCell>{code.description}</TableCell>
                    <TableCell>
                      <Badge variant={code.isService ? 'default' : 'secondary'}>
                        {code.isService ? 'Service (SAC)' : 'Goods (HSN)'}
                      </Badge>
                    </TableCell>
                    <TableCell>{code.gstRate}%</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(code)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(code.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCode ? 'Edit HSN/SAC Code' : 'Add HSN/SAC Code'}</DialogTitle>
            <DialogDescription>
              {editingCode
                ? 'Update the details of this HSN/SAC code'
                : 'Add a new HSN or SAC code for your products/services'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code">HSN/SAC Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="998314"
                  maxLength={8}
                  required
                  className="font-mono"
                />
                <p className="text-xs text-gray-500">4-8 digit code</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="IT Design & Development Services"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gstRate">GST Rate (%) *</Label>
                <Input
                  id="gstRate"
                  type="number"
                  min="0"
                  max="28"
                  step="0.01"
                  value={formData.gstRate}
                  onChange={(e) =>
                    setFormData({ ...formData, gstRate: parseFloat(e.target.value) })
                  }
                  required
                />
                <p className="text-xs text-gray-500">Common rates: 0%, 5%, 12%, 18%, 28%</p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isService"
                  checked={formData.isService}
                  onChange={(e) => setFormData({ ...formData, isService: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isService" className="cursor-pointer">
                  This is a Service (SAC) code
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">{editingCode ? 'Update' : 'Add'} Code</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
