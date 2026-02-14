'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Plus,
  Eye,
  X,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  FileSignature,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ESignaturesPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    documentType: 'QUOTE',
    documentName: '',
    documentUrl: '',
    message: '',
    signers: [{ email: '', name: '', role: '' }],
  });

  useEffect(() => {
    fetchSignatureRequests();
  }, []);

  const fetchSignatureRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/e-signature/requests', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setRequests(data.data);
      }
    } catch (error) {
      toast.error('Failed to load signature requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async () => {
    if (!formData.documentName || !formData.documentUrl || formData.signers[0].email === '') {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setCreating(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/e-signature/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          documentType: formData.documentType,
          documentId: `temp_${Date.now()}`,
          documentName: formData.documentName,
          documentUrl: formData.documentUrl,
          message: formData.message,
          signers: formData.signers.filter((s) => s.email),
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Signature request created successfully');
        setShowCreateDialog(false);
        setFormData({
          documentType: 'QUOTE',
          documentName: '',
          documentUrl: '',
          message: '',
          signers: [{ email: '', name: '', role: '' }],
        });
        fetchSignatureRequests();
      } else {
        toast.error(data.error || 'Failed to create signature request');
      }
    } catch (error) {
      toast.error('Failed to create signature request');
    } finally {
      setCreating(false);
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (!confirm('Are you sure you want to cancel this signature request?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/e-signature/requests/${requestId}/cancel`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Signature request cancelled');
        fetchSignatureRequests();
      }
    } catch (error) {
      toast.error('Failed to cancel signature request');
    }
  };

  const addSigner = () => {
    setFormData({
      ...formData,
      signers: [...formData.signers, { email: '', name: '', role: '' }],
    });
  };

  const removeSigner = (index) => {
    setFormData({
      ...formData,
      signers: formData.signers.filter((_, i) => i !== index),
    });
  };

  const updateSigner = (index, field, value) => {
    const newSigners = [...formData.signers];
    newSigners[index][field] = value;
    setFormData({ ...formData, signers: newSigners });
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
      DECLINED: 'bg-red-100 text-red-800',
      EXPIRED: 'bg-red-100 text-red-800',
    };

    const icons = {
      PENDING: Clock,
      IN_PROGRESS: FileSignature,
      COMPLETED: CheckCircle2,
      CANCELLED: XCircle,
      DECLINED: XCircle,
      EXPIRED: XCircle,
    };

    const Icon = icons[status] || Clock;

    return (
      <Badge className={styles[status] || 'bg-gray-100 text-gray-800'}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">E-Signatures</h1>
          <p className="text-gray-500">Manage document signature requests</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Signature Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Signature Request</DialogTitle>
              <DialogDescription>Send a document for electronic signature</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="documentType">Document Type</Label>
                <Select
                  value={formData.documentType}
                  onValueChange={(value) => setFormData({ ...formData, documentType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="QUOTE">Quote</SelectItem>
                    <SelectItem value="CONTRACT">Contract</SelectItem>
                    <SelectItem value="PROPOSAL">Proposal</SelectItem>
                    <SelectItem value="INVOICE">Invoice</SelectItem>
                    <SelectItem value="NDA">NDA</SelectItem>
                    <SelectItem value="AGREEMENT">Agreement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentName">Document Name *</Label>
                <Input
                  id="documentName"
                  placeholder="e.g., Q-2024-001 - Website Development"
                  value={formData.documentName}
                  onChange={(e) => setFormData({ ...formData, documentName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentUrl">Document URL *</Label>
                <Input
                  id="documentUrl"
                  placeholder="https://example.com/document.pdf"
                  value={formData.documentUrl}
                  onChange={(e) => setFormData({ ...formData, documentUrl: e.target.value })}
                />
                <p className="text-xs text-gray-500">Upload your PDF and paste the URL here</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Please review and sign the attached document."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Signers *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addSigner}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add Signer
                  </Button>
                </div>

                {formData.signers.map((signer, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">Signer {index + 1}</p>
                        {formData.signers.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSigner(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Email *</Label>
                          <Input
                            placeholder="signer@example.com"
                            value={signer.email}
                            onChange={(e) => updateSigner(index, 'email', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Name *</Label>
                          <Input
                            placeholder="John Doe"
                            value={signer.name}
                            onChange={(e) => updateSigner(index, 'name', e.target.value)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label>Role (Optional)</Label>
                          <Input
                            placeholder="e.g., Client, Manager"
                            value={signer.role}
                            onChange={(e) => updateSigner(index, 'role', e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRequest} disabled={creating}>
                {creating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Request'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Requests</CardDescription>
            <CardTitle className="text-3xl">{requests.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">
              {requests.filter((r) => r.status === 'PENDING').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-3xl text-blue-600">
              {requests.filter((r) => r.status === 'IN_PROGRESS').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {requests.filter((r) => r.status === 'COMPLETED').length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Signature Requests</CardTitle>
          <CardDescription>All your document signature requests</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No signature requests yet</p>
              <Button variant="outline" className="mt-4" onClick={() => setShowCreateDialog(true)}>
                Create Your First Request
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Signers</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.documentName}</TableCell>
                    <TableCell>{request.documentType}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-500" />
                        {request.signers?.length || 0}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {request.status !== 'COMPLETED' && request.status !== 'CANCELLED' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelRequest(request.id)}
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Request Details Dialog */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Signature Request Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Document Name</p>
                  <p className="font-medium">{selectedRequest.documentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{selectedRequest.documentType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  {getStatusBadge(selectedRequest.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">
                    {new Date(selectedRequest.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedRequest.message && (
                <div>
                  <p className="text-sm text-gray-500">Message</p>
                  <p className="mt-1">{selectedRequest.message}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-2">Signers</p>
                <div className="space-y-2">
                  {selectedRequest.signers?.map((signer, index) => (
                    <Card key={signer.id}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{signer.name}</p>
                            <p className="text-sm text-gray-500">{signer.email}</p>
                            {signer.role && <p className="text-xs text-gray-400">{signer.role}</p>}
                          </div>
                          <div className="text-right">
                            {getStatusBadge(signer.status)}
                            {signer.signedAt && (
                              <p className="text-xs text-gray-500 mt-1">
                                Signed {new Date(signer.signedAt).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
