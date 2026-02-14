'use client';

import { useState, useRef } from 'react';
import {
  Upload,
  Download,
  FileText,
  CheckCircle2,
  AlertCircle,
  User,
  Building2,
  ArrowRight,
  X,
  Loader2,
  FileSpreadsheet,
  Info,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { UnifiedLayout, createStat, createAction } from '@/components/layout/unified';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const IMPORT_STEPS = [
  { id: 1, name: 'Upload File', description: 'Select CSV file to import' },
  { id: 2, name: 'Map Fields', description: 'Match columns to CRM fields' },
  { id: 3, name: 'Review', description: 'Verify import settings' },
  { id: 4, name: 'Import', description: 'Import data into CRM' },
];

// Sample CSV templates
const CONTACT_TEMPLATE_FIELDS = [
  'First Name',
  'Last Name',
  'Email',
  'Phone',
  'Company',
  'Job Title',
  'Address',
  'City',
  'State',
  'Postal Code',
  'Country',
  'Tags',
];

const COMPANY_TEMPLATE_FIELDS = [
  'Company Name',
  'Domain',
  'Industry',
  'Employee Count',
  'Annual Revenue',
  'Phone',
  'Email',
  'Address',
  'City',
  'State',
  'Postal Code',
  'Tags',
];

// CRM field mapping options
const CONTACT_FIELDS = [
  { value: 'firstName', label: 'First Name', required: true },
  { value: 'lastName', label: 'Last Name', required: true },
  { value: 'email', label: 'Email', required: false },
  { value: 'phone', label: 'Phone', required: false },
  { value: 'companyName', label: 'Company', required: false },
  { value: 'jobTitle', label: 'Job Title', required: false },
  { value: 'department', label: 'Department', required: false },
  { value: 'address', label: 'Address', required: false },
  { value: 'city', label: 'City', required: false },
  { value: 'state', label: 'State', required: false },
  { value: 'postalCode', label: 'Postal Code', required: false },
  { value: 'country', label: 'Country', required: false },
  { value: 'tags', label: 'Tags', required: false },
];

const COMPANY_FIELDS = [
  { value: 'name', label: 'Company Name', required: true },
  { value: 'domain', label: 'Domain', required: false },
  { value: 'industry', label: 'Industry', required: false },
  { value: 'employeeCount', label: 'Employee Count', required: false },
  { value: 'annualRevenue', label: 'Annual Revenue', required: false },
  { value: 'phone', label: 'Phone', required: false },
  { value: 'email', label: 'Email', required: false },
  { value: 'address', label: 'Address', required: false },
  { value: 'city', label: 'City', required: false },
  { value: 'state', label: 'State', required: false },
  { value: 'postalCode', label: 'Postal Code', required: false },
  { value: 'country', label: 'Country', required: false },
  { value: 'tags', label: 'Tags', required: false },
];

export default function ImportPage() {
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [importType, setImportType] = useState('contacts');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [fieldMapping, setFieldMapping] = useState({});
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: 'Invalid File',
        description: 'Please select a CSV file',
        variant: 'destructive',
      });
      return;
    }

    setUploadedFile(file);
    parseCSV(file);
  };

  const parseCSV = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== 'string') return;

      const lines = text.split('\n').filter((line) => line.trim());
      if (lines.length === 0) {
        toast({
          title: 'Empty File',
          description: 'The CSV file is empty',
          variant: 'destructive',
        });
        return;
      }

      // Parse headers
      const headers = lines[0].split(',').map((h) => h.trim().replace(/['"]/g, ''));
      setCsvHeaders(headers);

      // Parse data rows (limit to first 100 for preview)
      const data = lines.slice(1, 101).map((line) => {
        const values = line.split(',').map((v) => v.trim().replace(/['"]/g, ''));
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });

      setCsvData(data);

      // Auto-map fields based on header names
      autoMapFields(headers);

      setCurrentStep(2);
    };

    reader.onerror = () => {
      toast({
        title: 'File Read Error',
        description: 'Failed to read the CSV file',
        variant: 'destructive',
      });
    };

    reader.readAsText(file);
  };

  const autoMapFields = (headers) => {
    const mapping = {};
    const fields = importType === 'contacts' ? CONTACT_FIELDS : COMPANY_FIELDS;

    headers.forEach((header) => {
      const normalizedHeader = header.toLowerCase().replace(/\s+/g, '');

      // Try to find matching field
      const matchedField = fields.find((field) => {
        const normalizedFieldLabel = field.label.toLowerCase().replace(/\s+/g, '');
        return (
          normalizedHeader.includes(normalizedFieldLabel) ||
          normalizedFieldLabel.includes(normalizedHeader)
        );
      });

      if (matchedField) {
        mapping[header] = matchedField.value;
      }
    });

    setFieldMapping(mapping);
  };

  const handleFieldMapping = (csvColumn, crmField) => {
    setFieldMapping((prev) => ({
      ...prev,
      [csvColumn]: crmField === 'skip' ? null : crmField,
    }));
  };

  const downloadTemplate = () => {
    const fields = importType === 'contacts' ? CONTACT_TEMPLATE_FIELDS : COMPANY_TEMPLATE_FIELDS;
    const csv = fields.join(',') + '\n';

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${importType}_template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Template Downloaded',
      description: `CSV template for ${importType} has been downloaded`,
    });
  };

  const validateMapping = () => {
    const fields = importType === 'contacts' ? CONTACT_FIELDS : COMPANY_FIELDS;
    const requiredFields = fields.filter((f) => f.required);
    const mappedValues = Object.values(fieldMapping).filter(Boolean);

    const missingRequired = requiredFields.filter((field) => !mappedValues.includes(field.value));

    if (missingRequired.length > 0) {
      toast({
        title: 'Missing Required Fields',
        description: `Please map: ${missingRequired.map((f) => f.label).join(', ')}`,
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleProceedToReview = () => {
    if (validateMapping()) {
      setCurrentStep(3);
    }
  };

  const handleStartImport = async () => {
    setCurrentStep(4);
    setImporting(true);
    setImportProgress(0);

    try {
      // Simulate import process
      // In real implementation, this would call an API endpoint
      for (let i = 0; i <= 100; i += 10) {
        setImportProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      const successCount = csvData.length;
      setImportResult({
        success: true,
        imported: successCount,
        failed: 0,
        duplicates: 0,
      });

      toast({
        title: 'Import Complete',
        description: `Successfully imported ${successCount} ${importType}`,
      });
    } catch (err) {
      setImportResult({
        success: false,
        error: err.message || 'Import failed',
      });

      toast({
        title: 'Import Failed',
        description: err.message || 'An error occurred during import',
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setUploadedFile(null);
    setCsvData([]);
    setCsvHeaders([]);
    setFieldMapping({});
    setImportProgress(0);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const fields = importType === 'contacts' ? CONTACT_FIELDS : COMPANY_FIELDS;
  const mappedFieldsCount = Object.values(fieldMapping).filter(Boolean).length;
  const requiredFieldsMapped = fields
    .filter((f) => f.required)
    .every((field) => Object.values(fieldMapping).includes(field.value));

  // Layout configuration
  const layoutStats = [
    createStat('Step', `${currentStep}/4`, Upload, 'blue'),
    createStat(
      'Type',
      importType === 'contacts' ? 'Contacts' : 'Companies',
      importType === 'contacts' ? User : Building2,
      'green'
    ),
  ];

  const layoutActions = [createAction('Download Template', Download, downloadTemplate)];

  return (
    <UnifiedLayout
      hubId="crm"
      pageTitle="Import Data"
      stats={layoutStats}
      actions={layoutActions}
      fixedMenu={null}
    >
      <div className="h-full overflow-auto p-6 space-y-6">
        {/* Import Type Selection */}
        <Tabs value={importType} onValueChange={setImportType} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="contacts">
              <User className="h-4 w-4 mr-2" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="companies">
              <Building2 className="h-4 w-4 mr-2" />
              Companies
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Progress Steps */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-8">
            {IMPORT_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'h-10 w-10 rounded-full flex items-center justify-center font-semibold',
                      currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : currentStep === step.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {currentStep > step.id ? <CheckCircle2 className="h-5 w-5" /> : step.id}
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-sm font-medium">{step.name}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {index < IMPORT_STEPS.length - 1 && (
                  <div
                    className={cn(
                      'flex-1 h-0.5 mx-4',
                      currentStep > step.id ? 'bg-green-500' : 'bg-muted'
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Upload File */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div
                className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload CSV File</h3>
                <p className="text-muted-foreground mb-4">
                  Click to browse or drag and drop your CSV file here
                </p>
                <p className="text-sm text-muted-foreground">Maximum file size: 10MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              <Card className="p-4 bg-blue-50/50 border-blue-200">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-blue-900">CSV File Requirements</p>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                      <li>File must be in CSV format (.csv)</li>
                      <li>First row should contain column headers</li>
                      <li>Use comma (,) as the delimiter</li>
                      <li>Maximum 10,000 rows per import</li>
                      <li>Download the template to ensure correct format</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Step 2: Map Fields */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Map CSV Columns to CRM Fields</h3>
                  <p className="text-sm text-muted-foreground">
                    Match your CSV columns to the corresponding CRM fields
                  </p>
                </div>
                <Badge variant={requiredFieldsMapped ? 'default' : 'destructive'}>
                  {mappedFieldsCount} of {csvHeaders.length} columns mapped
                </Badge>
              </div>

              <div className="space-y-3">
                {csvHeaders.map((header, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{header}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Example: {csvData[0]?.[header] || 'N/A'}
                      </p>
                    </div>

                    <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />

                    <div className="w-64">
                      <Select
                        value={fieldMapping[header] || 'skip'}
                        onValueChange={(value) => handleFieldMapping(header, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="skip">
                            <span className="text-muted-foreground">Skip this column</span>
                          </SelectItem>
                          {fields.map((field) => (
                            <SelectItem key={field.value} value={field.value}>
                              {field.label}
                              {field.required && <span className="text-destructive ml-1">*</span>}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <Button variant="outline" onClick={handleReset}>
                  Start Over
                </Button>
                <Button onClick={handleProceedToReview} disabled={!requiredFieldsMapped}>
                  Continue to Review
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Review Import Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Verify your import configuration before proceeding
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Card className="p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    File Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">File Name:</span>
                      <span className="font-medium">{uploadedFile?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Import Type:</span>
                      <Badge variant="outline" className="capitalize">
                        {importType}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Rows:</span>
                      <span className="font-medium">{csvData.length}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Field Mapping
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mapped Fields:</span>
                      <span className="font-medium">{mappedFieldsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Skipped Columns:</span>
                      <span className="font-medium">{csvHeaders.length - mappedFieldsCount}</span>
                    </div>
                  </div>
                </Card>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  {showAdvanced ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  View Field Mapping Details
                </button>

                {showAdvanced && (
                  <div className="mt-4 p-4 border rounded-lg bg-muted/30">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {Object.entries(fieldMapping)
                        .filter(([_, value]) => value)
                        .map(([csvColumn, crmField]) => {
                          const field = fields.find((f) => f.value === crmField);
                          return (
                            <div
                              key={csvColumn}
                              className="flex items-center justify-between p-2 bg-background rounded"
                            >
                              <span className="text-muted-foreground">{csvColumn}</span>
                              <ArrowRight className="h-3 w-3 mx-2 text-muted-foreground" />
                              <span className="font-medium">{field?.label}</span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Back to Mapping
                </Button>
                <Button onClick={handleStartImport}>
                  Start Import
                  <Upload className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Import */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {importing ? (
                <div className="text-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Importing {importType}...</h3>
                  <p className="text-muted-foreground mb-6">
                    Please wait while we import your data
                  </p>
                  <div className="max-w-md mx-auto">
                    <Progress value={importProgress} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2">{importProgress}% complete</p>
                  </div>
                </div>
              ) : importResult ? (
                <div className="text-center py-12">
                  {importResult.success ? (
                    <>
                      <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Import Completed Successfully</h3>
                      <p className="text-muted-foreground mb-6">
                        Your data has been imported into the CRM
                      </p>

                      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-6">
                        <Card className="p-4">
                          <p className="text-2xl font-bold text-green-600">
                            {importResult.imported}
                          </p>
                          <p className="text-xs text-muted-foreground">Imported</p>
                        </Card>
                        <Card className="p-4">
                          <p className="text-2xl font-bold text-yellow-600">
                            {importResult.duplicates}
                          </p>
                          <p className="text-xs text-muted-foreground">Duplicates</p>
                        </Card>
                        <Card className="p-4">
                          <p className="text-2xl font-bold text-red-600">{importResult.failed}</p>
                          <p className="text-xs text-muted-foreground">Failed</p>
                        </Card>
                      </div>

                      <div className="flex gap-3 justify-center">
                        <Button variant="outline" onClick={handleReset}>
                          Import More Data
                        </Button>
                        <Button onClick={() => (window.location.href = `/crm/${importType}`)}>
                          View {importType === 'contacts' ? 'Contacts' : 'Companies'}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="h-8 w-8 text-red-600" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Import Failed</h3>
                      <p className="text-muted-foreground mb-6">
                        {importResult.error || 'An error occurred during import'}
                      </p>
                      <div className="flex gap-3 justify-center">
                        <Button variant="outline" onClick={handleReset}>
                          Start Over
                        </Button>
                        <Button onClick={() => setCurrentStep(3)}>Try Again</Button>
                      </div>
                    </>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </Card>
      </div>
    </UnifiedLayout>
  );
}
