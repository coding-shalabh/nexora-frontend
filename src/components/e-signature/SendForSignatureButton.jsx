'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { Card, CardContent } from '@/components/ui/card';
import { FileSignature, Plus, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function SendForSignatureButton({ document, documentType = 'QUOTE', onSuccess }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    message: '',
    signers: [{ email: '', name: '', role: 'Client' }],
  });

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

  const handleSubmit = async () => {
    // Validate
    if (!formData.signers[0].email || !formData.signers[0].name) {
      toast.error('Please provide at least one signer with email and name');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch('/api/v1/e-signature/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          documentType,
          documentId: document.id,
          documentName: document.name || document.quoteNumber || document.number || 'Document',
          documentUrl: document.pdfUrl || document.documentUrl,
          message: formData.message,
          signers: formData.signers.filter((s) => s.email && s.name),
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Signature request sent successfully!');
        setOpen(false);
        setFormData({
          message: '',
          signers: [{ email: '', name: '', role: 'Client' }],
        });
        onSuccess?.(data.data);
      } else {
        toast.error(data.error || 'Failed to send signature request');
      }
    } catch (error) {
      toast.error('Failed to send signature request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileSignature className="h-4 w-4" />
          Send for Signature
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send for Signature</DialogTitle>
          <DialogDescription>
            Send this {documentType.toLowerCase()} for electronic signature
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Document Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900">
              {document.name || document.quoteNumber || document.number || 'Document'}
            </p>
            <p className="text-xs text-blue-700 mt-1">Type: {documentType}</p>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Please review and sign this document."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
            />
          </div>

          {/* Signers */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Signers</Label>
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
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send for Signature'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
