'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Loader2, Building2, FileText, MapPin } from 'lucide-react';

export default function GSTConfigurationPage() {
  const [config, setConfig] = useState({
    gstin: '',
    legalName: '',
    tradeName: '',
    pan: '',
    stateCode: '',
    stateName: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
    },
    registrationType: 'REGULAR',
    cin: '',
  });

  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [gstinValidation, setGstinValidation] = useState(null);

  useEffect(() => {
    fetchConfig();
    fetchStates();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/v1/gst/config', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const data = await response.json();

      if (data.success && data.data.isConfigured) {
        // Parse address if it's a JSON string
        const parsedAddress =
          typeof data.data.address === 'string'
            ? JSON.parse(data.data.address)
            : data.data.address || config.address;

        setConfig({
          ...data.data,
          address: parsedAddress,
        });
      }
    } catch (error) {
      console.error('Failed to fetch GST config:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStates = async () => {
    try {
      const response = await fetch('/api/v1/gst/states', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setStates(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch states:', error);
    }
  };

  const validateGSTIN = async () => {
    if (!config.gstin || config.gstin.length !== 15) {
      setMessage({ type: 'error', text: 'GSTIN must be 15 characters' });
      return;
    }

    setValidating(true);
    try {
      const response = await fetch(`/api/v1/gst/validate-gstin/${config.gstin}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const data = await response.json();

      if (data.success && data.data.valid) {
        setGstinValidation(data.data);
        setMessage({ type: 'success', text: 'GSTIN is valid!' });

        // Auto-fill PAN and state from GSTIN
        setConfig((prev) => ({
          ...prev,
          pan: data.data.panNumber,
          stateCode: data.data.stateCode,
        }));
      } else {
        setMessage({ type: 'error', text: 'Invalid GSTIN' });
        setGstinValidation(null);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to validate GSTIN' });
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/v1/gst/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(config),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'GST configuration saved successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save configuration' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save configuration' });
    } finally {
      setSaving(false);
    }
  };

  const handleStateChange = (stateCode) => {
    const selectedState = states.find((s) => s.code === stateCode);
    if (selectedState) {
      setConfig((prev) => ({
        ...prev,
        stateCode: stateCode,
        stateName: selectedState.name,
        address: {
          ...prev.address,
          state: selectedState.name,
        },
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">GST Configuration</h1>
        <p className="text-gray-600 mt-1">
          Configure your GST/Tax settings for Indian market compliance
        </p>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* GSTIN & Validation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              GST Identification
            </CardTitle>
            <CardDescription>Your GSTIN and PAN details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gstin">GSTIN *</Label>
                <div className="flex gap-2">
                  <Input
                    id="gstin"
                    value={config.gstin}
                    onChange={(e) => setConfig({ ...config, gstin: e.target.value.toUpperCase() })}
                    placeholder="29AABCT1234E1Z5"
                    maxLength={15}
                    required
                    className="font-mono"
                  />
                  <Button
                    type="button"
                    onClick={validateGSTIN}
                    disabled={validating || config.gstin.length !== 15}
                    variant="outline"
                  >
                    {validating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Validate'}
                  </Button>
                </div>
                {gstinValidation && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Valid GSTIN (State: {gstinValidation.stateCode})
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pan">PAN Number *</Label>
                <Input
                  id="pan"
                  value={config.pan}
                  onChange={(e) => setConfig({ ...config, pan: e.target.value.toUpperCase() })}
                  placeholder="AABCT1234E"
                  maxLength={10}
                  required
                  className="font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrationType">Registration Type</Label>
              <Select
                value={config.registrationType}
                onValueChange={(value) => setConfig({ ...config, registrationType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REGULAR">Regular</SelectItem>
                  <SelectItem value="COMPOSITION">Composition</SelectItem>
                  <SelectItem value="CASUAL">Casual Taxable Person</SelectItem>
                  <SelectItem value="SEZ">SEZ Developer/Unit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Business Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Business Details
            </CardTitle>
            <CardDescription>Legal and trade names</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="legalName">Legal Name *</Label>
                <Input
                  id="legalName"
                  value={config.legalName}
                  onChange={(e) => setConfig({ ...config, legalName: e.target.value })}
                  placeholder="Helix Code Private Limited"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tradeName">Trade Name</Label>
                <Input
                  id="tradeName"
                  value={config.tradeName}
                  onChange={(e) => setConfig({ ...config, tradeName: e.target.value })}
                  placeholder="Helix Code"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cin">CIN (Corporate Identification Number)</Label>
              <Input
                id="cin"
                value={config.cin}
                onChange={(e) => setConfig({ ...config, cin: e.target.value.toUpperCase() })}
                placeholder="U72900KA2020PTC123456"
                className="font-mono"
              />
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Registered Address
            </CardTitle>
            <CardDescription>Business registered address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                value={config.address.street}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    address: { ...config.address, street: e.target.value },
                  })
                }
                placeholder="123 MG Road"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={config.address.city}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      address: { ...config.address, city: e.target.value },
                    })
                  }
                  placeholder="Bengaluru"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Select value={config.stateCode} onValueChange={handleStateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {states.map((state) => (
                      <SelectItem key={state.code} value={state.code}>
                        {state.name} ({state.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={config.address.pincode}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      address: { ...config.address, pincode: e.target.value },
                    })
                  }
                  placeholder="560001"
                  maxLength={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={config.address.country}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Configuration'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
