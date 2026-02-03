'use client';

import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  ArrowRight,
  FileDown,
  FileUp,
  Info,
  X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

// Contact fields configuration
const CONTACT_FIELDS = [
  // Required fields
  { key: 'firstName', label: 'First Name', required: true, type: 'text' },
  { key: 'lastName', label: 'Last Name', required: true, type: 'text' },
  // Basic fields
  { key: 'email', label: 'Email', required: false, type: 'email' },
  { key: 'phone', label: 'Phone', required: false, type: 'text' },
  { key: 'displayName', label: 'Display Name', required: false, type: 'text' },
  { key: 'salutation', label: 'Salutation', required: false, type: 'text' },
  { key: 'middleName', label: 'Middle Name', required: false, type: 'text' },
  { key: 'suffix', label: 'Suffix', required: false, type: 'text' },
  { key: 'preferredName', label: 'Preferred Name', required: false, type: 'text' },
  // Work fields
  { key: 'jobTitle', label: 'Job Title', required: false, type: 'text' },
  { key: 'department', label: 'Department', required: false, type: 'text' },
  // Additional contact
  { key: 'mobilePhone', label: 'Mobile Phone', required: false, type: 'text' },
  { key: 'homePhone', label: 'Home Phone', required: false, type: 'text' },
  { key: 'fax', label: 'Fax', required: false, type: 'text' },
  // Personal
  { key: 'dateOfBirth', label: 'Date of Birth', required: false, type: 'date' },
  { key: 'gender', label: 'Gender', required: false, type: 'text' },
  // Lead/Lifecycle
  { key: 'lifecycleStage', label: 'Lifecycle Stage', required: false, type: 'text' },
  { key: 'leadStatus', label: 'Lead Status', required: false, type: 'text' },
  { key: 'leadScore', label: 'Lead Score', required: false, type: 'number' },
  { key: 'source', label: 'Source', required: false, type: 'text' },
  { key: 'sourceDetails', label: 'Source Details', required: false, type: 'text' },
  // Social
  { key: 'linkedinUrl', label: 'LinkedIn URL', required: false, type: 'url' },
  { key: 'twitterUrl', label: 'Twitter URL', required: false, type: 'url' },
  { key: 'facebookUrl', label: 'Facebook URL', required: false, type: 'url' },
  { key: 'instagramUrl', label: 'Instagram URL', required: false, type: 'url' },
  // Billing Address
  { key: 'gstin', label: 'GSTIN', required: false, type: 'text' },
  { key: 'billingAddress', label: 'Billing Address', required: false, type: 'text' },
  { key: 'billingCity', label: 'Billing City', required: false, type: 'text' },
  { key: 'billingState', label: 'Billing State', required: false, type: 'text' },
  { key: 'billingPincode', label: 'Billing Pincode', required: false, type: 'text' },
  // Shipping Address
  { key: 'shippingAddress', label: 'Shipping Address', required: false, type: 'text' },
  { key: 'shippingCity', label: 'Shipping City', required: false, type: 'text' },
  { key: 'shippingState', label: 'Shipping State', required: false, type: 'text' },
  { key: 'shippingPincode', label: 'Shipping Pincode', required: false, type: 'text' },
  // Preferences
  { key: 'marketingConsent', label: 'Marketing Consent', required: false, type: 'boolean' },
  { key: 'emailOptOut', label: 'Email Opt Out', required: false, type: 'boolean' },
  { key: 'smsOptOut', label: 'SMS Opt Out', required: false, type: 'boolean' },
  { key: 'callOptOut', label: 'Call Opt Out', required: false, type: 'boolean' },
  { key: 'status', label: 'Status', required: false, type: 'text' },
];

const REQUIRED_FIELDS = CONTACT_FIELDS.filter(f => f.required).map(f => f.key);

export function ContactImportExportModal({
  open,
  onOpenChange,
  mode = 'import', // 'import' | 'export'
  selectedContacts = [],
  onImportComplete,
}) {
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  // Import state
  const [step, setStep] = useState(1); // 1: upload, 2: map, 3: validate, 4: import
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [fieldMapping, setFieldMapping] = useState({});
  const [validationResults, setValidationResults] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState(null);

  // Export state
  const [exporting, setExporting] = useState(false);
  const [exportFields, setExportFields] = useState(
    CONTACT_FIELDS.slice(0, 10).map(f => f.key) // Default to first 10 fields
  );

  // Reset state when modal closes
  const handleOpenChange = (open) => {
    if (!open) {
      setStep(1);
      setFile(null);
      setCsvData([]);
      setCsvHeaders([]);
      setFieldMapping({});
      setValidationResults(null);
      setImporting(false);
      setImportProgress(0);
      setImportResults(null);
    }
    onOpenChange(open);
  };

  // Download CSV template
  const handleDownloadTemplate = () => {
    const headers = CONTACT_FIELDS.map(f => f.label);
    const exampleRow = CONTACT_FIELDS.map(f => {
      if (f.key === 'firstName') return 'John';
      if (f.key === 'lastName') return 'Doe';
      if (f.key === 'email') return 'john.doe@example.com';
      if (f.key === 'phone') return '+91 98765 43210';
      if (f.key === 'jobTitle') return 'Marketing Manager';
      if (f.key === 'status') return 'ACTIVE';
      if (f.type === 'boolean') return 'false';
      if (f.type === 'number') return '0';
      if (f.type === 'date') return '2000-01-01';
      return '';
    });

    const csvContent = [
      headers.join(','),
      exampleRow.join(','),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contacts_import_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Template Downloaded',
      description: 'Fill in the template and upload to import contacts',
    });
  };

  // Parse CSV file
  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return { headers: [], data: [] };

    // Parse headers
    const headers = parseCSVLine(lines[0]);

    // Parse data rows
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      data.push(row);
    }

    return { headers, data };
  };

  // Parse a single CSV line (handles quoted values)
  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());

    return result;
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.endsWith('.csv')) {
      toast({
        title: 'Invalid File',
        description: 'Please upload a CSV file',
        variant: 'destructive',
      });
      return;
    }

    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      const { headers, data } = parseCSV(text);

      setCsvHeaders(headers);
      setCsvData(data);

      // Auto-map fields based on header names
      const autoMapping = {};
      headers.forEach(header => {
        const normalizedHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '');
        const matchedField = CONTACT_FIELDS.find(f => {
          const normalizedField = f.label.toLowerCase().replace(/[^a-z0-9]/g, '');
          const normalizedKey = f.key.toLowerCase();
          return normalizedField === normalizedHeader || normalizedKey === normalizedHeader;
        });
        if (matchedField) {
          autoMapping[header] = matchedField.key;
        }
      });
      setFieldMapping(autoMapping);

      setStep(2);
    };
    reader.readAsText(uploadedFile);
  };

  // Update field mapping
  const handleMappingChange = (csvHeader, contactField) => {
    setFieldMapping(prev => ({
      ...prev,
      [csvHeader]: contactField === 'skip' ? null : contactField,
    }));
  };

  // Validate data
  const handleValidate = () => {
    const errors = [];
    const warnings = [];
    const valid = [];

    csvData.forEach((row, index) => {
      const rowErrors = [];
      const rowWarnings = [];

      // Check required fields
      REQUIRED_FIELDS.forEach(reqField => {
        const csvHeader = Object.keys(fieldMapping).find(
          h => fieldMapping[h] === reqField
        );
        if (!csvHeader || !row[csvHeader]?.trim()) {
          rowErrors.push(`Missing required field: ${CONTACT_FIELDS.find(f => f.key === reqField)?.label}`);
        }
      });

      // Validate email format
      const emailHeader = Object.keys(fieldMapping).find(h => fieldMapping[h] === 'email');
      if (emailHeader && row[emailHeader]) {
        const email = row[emailHeader].trim();
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          rowWarnings.push('Invalid email format');
        }
      }

      // Validate phone format (basic check)
      const phoneHeader = Object.keys(fieldMapping).find(h => fieldMapping[h] === 'phone');
      if (phoneHeader && row[phoneHeader]) {
        const phone = row[phoneHeader].trim();
        if (phone && phone.replace(/[^0-9+]/g, '').length < 10) {
          rowWarnings.push('Phone number seems invalid');
        }
      }

      if (rowErrors.length > 0) {
        errors.push({ row: index + 2, errors: rowErrors, data: row });
      } else if (rowWarnings.length > 0) {
        warnings.push({ row: index + 2, warnings: rowWarnings, data: row });
      } else {
        valid.push({ row: index + 2, data: row });
      }
    });

    setValidationResults({ errors, warnings, valid });
    setStep(3);
  };

  // Import contacts
  const handleImport = async () => {
    if (!validationResults) return;

    setImporting(true);
    setImportProgress(0);

    const rowsToImport = [
      ...validationResults.valid,
      ...validationResults.warnings, // Include warnings too
    ];

    const results = { success: 0, failed: 0, errors: [] };
    const totalRows = rowsToImport.length;

    for (let i = 0; i < rowsToImport.length; i++) {
      const { row, data } = rowsToImport[i];

      // Map CSV data to contact fields
      const contactData = {};
      Object.entries(fieldMapping).forEach(([csvHeader, contactField]) => {
        if (contactField && data[csvHeader] !== undefined) {
          let value = data[csvHeader].trim();

          // Convert boolean strings
          if (CONTACT_FIELDS.find(f => f.key === contactField)?.type === 'boolean') {
            value = ['true', '1', 'yes'].includes(value.toLowerCase());
          }
          // Convert numbers
          if (CONTACT_FIELDS.find(f => f.key === contactField)?.type === 'number') {
            value = parseFloat(value) || 0;
          }

          contactData[contactField] = value;
        }
      });

      try {
        await api.post('/crm/contacts', contactData);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({ row, error: error.message || 'Failed to import' });
      }

      setImportProgress(Math.round(((i + 1) / totalRows) * 100));
    }

    setImportResults(results);
    setImporting(false);
    setStep(4);

    if (results.success > 0) {
      onImportComplete?.();
    }
  };

  // Export contacts
  const handleExport = async () => {
    setExporting(true);

    try {
      // Fetch contacts
      const response = await api.get('/crm/contacts', {
        params: {
          limit: 10000, // Get all contacts
          ids: selectedContacts.length > 0 ? selectedContacts.join(',') : undefined,
        },
      });

      const contacts = response.data || [];

      if (contacts.length === 0) {
        toast({
          title: 'No Contacts',
          description: 'No contacts found to export',
          variant: 'destructive',
        });
        setExporting(false);
        return;
      }

      // Build CSV content
      const headers = exportFields.map(key => {
        const field = CONTACT_FIELDS.find(f => f.key === key);
        return field?.label || key;
      });

      const rows = contacts.map(contact => {
        return exportFields.map(key => {
          let value = contact[key];
          if (value === null || value === undefined) value = '';
          if (typeof value === 'boolean') value = value.toString();
          if (typeof value === 'object') value = JSON.stringify(value);
          // Escape quotes and wrap in quotes if contains comma
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            value = `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        });
      });

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(',')),
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contacts_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Export Complete',
        description: `Successfully exported ${contacts.length} contacts`,
      });

      handleOpenChange(false);
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: error.message || 'Failed to export contacts',
        variant: 'destructive',
      });
    }

    setExporting(false);
  };

  // Toggle export field
  const toggleExportField = (key) => {
    setExportFields(prev =>
      prev.includes(key)
        ? prev.filter(f => f !== key)
        : [...prev, key]
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'import' ? (
              <>
                <Upload className="h-5 w-5" />
                Import Contacts
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                Export Contacts
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === 'import'
              ? 'Upload a CSV file to import contacts into your CRM'
              : selectedContacts.length > 0
                ? `Export ${selectedContacts.length} selected contact(s)`
                : 'Export all contacts to a CSV file'
            }
          </DialogDescription>
        </DialogHeader>

        {mode === 'import' ? (
          <div className="space-y-6">
            {/* Step Indicator */}
            <div className="flex items-center justify-between px-4">
              {['Upload', 'Map Fields', 'Validate', 'Import'].map((label, index) => (
                <div key={label} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step > index + 1
                      ? 'bg-primary border-primary text-primary-foreground'
                      : step === index + 1
                        ? 'border-primary text-primary'
                        : 'border-muted-foreground text-muted-foreground'
                  }`}>
                    {step > index + 1 ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <span className={`ml-2 text-sm ${
                    step >= index + 1 ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {label}
                  </span>
                  {index < 3 && (
                    <ArrowRight className="h-4 w-4 mx-4 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Upload */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">Upload CSV File</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload a CSV file with contact data. Max 10,000 rows.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center gap-4">
                    <Button onClick={() => fileInputRef.current?.click()}>
                      <FileUp className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                    <Button variant="outline" onClick={handleDownloadTemplate}>
                      <FileDown className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium flex items-center gap-2 mb-3">
                    <Info className="h-4 w-4" />
                    Required Fields
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {CONTACT_FIELDS.filter(f => f.required).map(field => (
                      <Badge key={field.key} variant="secondary">
                        {field.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Map Fields */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Map CSV Columns to Contact Fields</h3>
                    <p className="text-sm text-muted-foreground">
                      {csvData.length} rows found in {file?.name}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                    Choose Different File
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">CSV Column</TableHead>
                        <TableHead className="w-[40%]">Map To</TableHead>
                        <TableHead className="w-[20%]">Sample Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {csvHeaders.map(header => (
                        <TableRow key={header}>
                          <TableCell className="font-medium">{header}</TableCell>
                          <TableCell>
                            <Select
                              value={fieldMapping[header] || 'skip'}
                              onValueChange={(value) => handleMappingChange(header, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="skip">
                                  <span className="text-muted-foreground">-- Skip this column --</span>
                                </SelectItem>
                                {CONTACT_FIELDS.map(field => (
                                  <SelectItem key={field.key} value={field.key}>
                                    {field.label}
                                    {field.required && (
                                      <span className="text-destructive ml-1">*</span>
                                    )}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm truncate max-w-[150px]">
                            {csvData[0]?.[header] || '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={handleValidate}>
                    Validate Data
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Validate */}
            {step === 3 && validationResults && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-medium">Valid</span>
                    </div>
                    <p className="text-2xl font-bold text-green-700 mt-1">
                      {validationResults.valid.length}
                    </p>
                  </div>
                  <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-200">
                    <div className="flex items-center gap-2 text-yellow-700">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-medium">Warnings</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-700 mt-1">
                      {validationResults.warnings.length}
                    </p>
                  </div>
                  <div className="border rounded-lg p-4 bg-red-50 border-red-200">
                    <div className="flex items-center gap-2 text-red-700">
                      <XCircle className="h-5 w-5" />
                      <span className="font-medium">Errors</span>
                    </div>
                    <p className="text-2xl font-bold text-red-700 mt-1">
                      {validationResults.errors.length}
                    </p>
                  </div>
                </div>

                {validationResults.errors.length > 0 && (
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <h4 className="font-medium text-red-700 mb-2">
                      Rows with Errors (will be skipped)
                    </h4>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {validationResults.errors.slice(0, 10).map(({ row, errors }) => (
                        <div key={row} className="text-sm">
                          <span className="font-medium">Row {row}:</span>{' '}
                          <span className="text-red-600">{errors.join(', ')}</span>
                        </div>
                      ))}
                      {validationResults.errors.length > 10 && (
                        <p className="text-sm text-muted-foreground">
                          ... and {validationResults.errors.length - 10} more errors
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {validationResults.warnings.length > 0 && (
                  <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                    <h4 className="font-medium text-yellow-700 mb-2">
                      Rows with Warnings (will be imported)
                    </h4>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {validationResults.warnings.slice(0, 5).map(({ row, warnings }) => (
                        <div key={row} className="text-sm">
                          <span className="font-medium">Row {row}:</span>{' '}
                          <span className="text-yellow-600">{warnings.join(', ')}</span>
                        </div>
                      ))}
                      {validationResults.warnings.length > 5 && (
                        <p className="text-sm text-muted-foreground">
                          ... and {validationResults.warnings.length - 5} more warnings
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back to Mapping
                  </Button>
                  <Button
                    onClick={handleImport}
                    disabled={validationResults.valid.length + validationResults.warnings.length === 0}
                  >
                    Import {validationResults.valid.length + validationResults.warnings.length} Contacts
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Import Progress/Results */}
            {step === 4 && (
              <div className="space-y-6">
                {importing ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                    <h3 className="font-medium mb-2">Importing Contacts...</h3>
                    <Progress value={importProgress} className="w-64 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {importProgress}% complete
                    </p>
                  </div>
                ) : importResults && (
                  <div className="text-center py-8">
                    {importResults.success > 0 ? (
                      <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    ) : (
                      <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                    )}
                    <h3 className="font-medium text-xl mb-4">Import Complete</h3>

                    <div className="flex justify-center gap-8 mb-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-green-600">
                          {importResults.success}
                        </p>
                        <p className="text-sm text-muted-foreground">Imported</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-red-600">
                          {importResults.failed}
                        </p>
                        <p className="text-sm text-muted-foreground">Failed</p>
                      </div>
                    </div>

                    {importResults.errors.length > 0 && (
                      <div className="text-left border rounded-lg p-4 max-h-40 overflow-y-auto bg-red-50 mb-4">
                        <h4 className="font-medium text-red-700 mb-2">Failed Rows:</h4>
                        {importResults.errors.map(({ row, error }) => (
                          <div key={row} className="text-sm">
                            <span className="font-medium">Row {row}:</span>{' '}
                            <span className="text-red-600">{error}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <Button onClick={() => handleOpenChange(false)}>
                      Done
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          // Export Mode
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Select Fields to Export</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose which fields to include in the exported CSV file
              </p>

              <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto border rounded-lg p-4">
                {CONTACT_FIELDS.map(field => (
                  <label
                    key={field.key}
                    className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={exportFields.includes(field.key)}
                      onChange={() => toggleExportField(field.key)}
                      className="h-4 w-4 rounded"
                    />
                    <span className="text-sm">{field.label}</span>
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  {exportFields.length} fields selected
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExportFields(CONTACT_FIELDS.map(f => f.key))}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExportFields(REQUIRED_FIELDS)}
                  >
                    Required Only
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleExport} disabled={exporting || exportFields.length === 0}>
                {exporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
