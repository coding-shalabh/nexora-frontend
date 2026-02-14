'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Upload, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export function FilePicker({ value, onChange, label = 'Document' }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCustomUrl, setShowCustomUrl] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/files?fileType=pdf', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setFiles(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (fileId) => {
    const file = files.find((f) => f.id === fileId);
    if (file) {
      onChange(file.url || file.path);
    }
  };

  const handleCustomUrl = () => {
    if (customUrl) {
      onChange(customUrl);
      setShowCustomUrl(false);
      setCustomUrl('');
      toast.success('Custom URL added');
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex items-center justify-center p-4 border rounded-lg">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          <span className="ml-2 text-sm text-gray-500">Loading files...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {!showCustomUrl ? (
        <>
          <Select onValueChange={handleFileSelect} value={value}>
            <SelectTrigger>
              <SelectValue placeholder="Select a file from library" />
            </SelectTrigger>
            <SelectContent>
              {files.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  No PDF files found. Upload files first.
                </div>
              ) : (
                files.map((file) => (
                  <SelectItem key={file.id} value={file.id}>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-red-600" />
                      {file.name}
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowCustomUrl(true)}
              className="w-full"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Use Custom URL
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.open('/files', '_blank')}
              className="w-full"
            >
              <Upload className="h-3 w-3 mr-1" />
              Upload New File
            </Button>
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <Input
            placeholder="https://example.com/document.pdf"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setShowCustomUrl(false);
                setCustomUrl('');
              }}
            >
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleCustomUrl}>
              Add URL
            </Button>
          </div>
        </div>
      )}

      {value && (
        <div className="text-xs text-gray-500 mt-1">
          <span className="font-medium">Selected:</span> {value}
        </div>
      )}
    </div>
  );
}
