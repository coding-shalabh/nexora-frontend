'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, FileText, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function SigningPage() {
  const params = useParams();
  const router = useRouter();
  const sigCanvas = useRef(null);

  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [request, setRequest] = useState(null);
  const [signer, setSigner] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    fetchSignatureRequest();
  }, []);

  const fetchSignatureRequest = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/e-signature/sign/${params.requestId}/${params.token}`);
      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Invalid or expired signature link');
        return;
      }

      setRequest(data.data.request);
      setSigner(data.data.signer);
    } catch (err) {
      setError('Failed to load signature request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    sigCanvas.current?.clear();
    setIsEmpty(true);
  };

  const handleSign = async () => {
    if (sigCanvas.current?.isEmpty()) {
      setError('Please draw your signature before submitting');
      return;
    }

    try {
      setSigning(true);
      setError(null);

      const signatureData = sigCanvas.current.toDataURL('image/png');

      const response = await fetch(`/api/v1/e-signature/sign/${params.requestId}/${params.token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ signatureData }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to submit signature');
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError('Failed to submit signature. Please try again.');
    } finally {
      setSigning(false);
    }
  };

  const handleDecline = async () => {
    if (!confirm('Are you sure you want to decline signing this document?')) {
      return;
    }

    try {
      const response = await fetch(
        `/api/v1/e-signature/sign/${params.requestId}/${params.token}/decline`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reason: 'Declined by signer' }),
        }
      );

      const data = await response.json();

      if (data.success) {
        router.push('/');
      }
    } catch (err) {
      setError('Failed to decline signature. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <p className="text-gray-600">Loading signature request...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <XCircle className="h-6 w-6 text-red-600" />
              <CardTitle>Invalid Link</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{error}</p>
            <Button onClick={() => router.push('/')} className="mt-4">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <CardTitle>Document Signed Successfully</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Your signature has been submitted successfully. You will receive a confirmation email
              shortly.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Document: {request?.documentName}</p>
              <p className="text-sm text-gray-500">Signer: {signer?.name}</p>
              <p className="text-sm text-gray-500">Email: {signer?.email}</p>
            </div>
            <Button onClick={() => router.push('/')} className="mt-6 w-full">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (signer?.status === 'SIGNED') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-6 w-6 text-blue-600" />
              <CardTitle>Already Signed</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              You have already signed this document on {new Date(signer.signedAt).toLocaleString()}.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <CardTitle className="text-2xl">Sign Document</CardTitle>
                <CardDescription>{request?.documentName}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Your Name</p>
                <p className="font-medium">{signer?.name}</p>
              </div>
              <div>
                <p className="text-gray-500">Your Email</p>
                <p className="font-medium">{signer?.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Role</p>
                <p className="font-medium">{signer?.role || 'Signer'}</p>
              </div>
              <div>
                <p className="text-gray-500">Expires</p>
                <p className="font-medium">
                  {request?.expiresAt
                    ? new Date(request.expiresAt).toLocaleDateString()
                    : 'No expiry'}
                </p>
              </div>
            </div>
            {request?.message && (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{request.message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Document Preview */}
        {request?.documentUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Document Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden bg-white">
                <iframe
                  src={request.documentUrl}
                  className="w-full h-[500px]"
                  title="Document Preview"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Please review the document carefully before signing.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Signature Pad */}
        <Card>
          <CardHeader>
            <CardTitle>Your Signature</CardTitle>
            <CardDescription>
              Draw your signature in the box below using your mouse or touchscreen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white">
              <SignatureCanvas
                ref={sigCanvas}
                canvasProps={{
                  className: 'w-full h-48 rounded-lg',
                }}
                onEnd={() => setIsEmpty(false)}
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={handleClear} disabled={signing}>
                Clear Signature
              </Button>
            </div>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={handleDecline} disabled={signing}>
                Decline to Sign
              </Button>
              <Button
                onClick={handleSign}
                disabled={signing || isEmpty}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {signing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Sign Document'
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              By signing this document, you agree that your electronic signature is legally binding
              and equivalent to a handwritten signature.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
