'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  Upload,
  Download,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  X,
  Loader2,
  RefreshCw,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

// Entity configurations for different apps
const entityConfigs = {
  contacts: {
    label: 'Contacts',
    app: 'CRM',
    endpoint: '/crm/contacts',
    fields: [
      { key: 'firstName', label: 'First Name', required: false },
      { key: 'lastName', label: 'Last Name', required: false },
      { key: 'email', label: 'Email', required: true },
      { key: 'phone', label: 'Phone', required: false },
      { key: 'displayName', label: 'Display Name', required: false },
      { key: 'jobTitle', label: 'Job Title', required: false },
      { key: 'department', label: 'Department', required: false },
      { key: 'lifecycleStage', label: 'Lifecycle Stage', required: false },
      { key: 'leadStatus', label: 'Lead Status', required: false },
      { key: 'source', label: 'Source', required: false },
      { key: 'website', label: 'Website', required: false },
      { key: 'linkedinUrl', label: 'LinkedIn', required: false },
      { key: 'city', label: 'City', required: false },
      { key: 'state', label: 'State', required: false },
      { key: 'country', label: 'Country', required: false },
    ],
  },
  companies: {
    label: 'Companies',
    app: 'CRM',
    endpoint: '/crm/companies',
    fields: [
      { key: 'name', label: 'Company Name', required: true },
      { key: 'domain', label: 'Domain', required: false },
      { key: 'industry', label: 'Industry', required: false },
      { key: 'description', label: 'Description', required: false },
      { key: 'phone', label: 'Phone', required: false },
      { key: 'website', label: 'Website', required: false },
      { key: 'employeeCount', label: 'Employee Count', required: false },
      { key: 'annualRevenue', label: 'Annual Revenue', required: false },
      { key: 'city', label: 'City', required: false },
      { key: 'state', label: 'State', required: false },
      { key: 'country', label: 'Country', required: false },
      { key: 'linkedinUrl', label: 'LinkedIn', required: false },
    ],
  },
  deals: {
    label: 'Deals',
    app: 'Pipeline',
    endpoint: '/crm/deals',
    fields: [
      { key: 'name', label: 'Deal Name', required: true },
      { key: 'value', label: 'Deal Value', required: false },
      { key: 'currency', label: 'Currency', required: false },
      { key: 'stage', label: 'Stage', required: false },
      { key: 'probability', label: 'Probability', required: false },
      { key: 'expectedCloseDate', label: 'Expected Close Date', required: false },
      { key: 'contactEmail', label: 'Contact Email', required: false },
      { key: 'companyName', label: 'Company Name', required: false },
      { key: 'source', label: 'Source', required: false },
      { key: 'description', label: 'Description', required: false },
    ],
  },
  leads: {
    label: 'Leads',
    app: 'CRM',
    endpoint: '/crm/leads',
    fields: [
      { key: 'firstName', label: 'First Name', required: false },
      { key: 'lastName', label: 'Last Name', required: false },
      { key: 'email', label: 'Email', required: true },
      { key: 'phone', label: 'Phone', required: false },
      { key: 'companyName', label: 'Company Name', required: false },
      { key: 'jobTitle', label: 'Job Title', required: false },
      { key: 'source', label: 'Source', required: false },
      { key: 'status', label: 'Status', required: false },
      { key: 'rating', label: 'Rating', required: false },
      { key: 'industry', label: 'Industry', required: false },
    ],
  },
  tickets: {
    label: 'Tickets',
    app: 'Support',
    endpoint: '/support/tickets',
    fields: [
      { key: 'subject', label: 'Subject', required: true },
      { key: 'description', label: 'Description', required: false },
      { key: 'priority', label: 'Priority', required: false },
      { key: 'status', label: 'Status', required: false },
      { key: 'contactEmail', label: 'Contact Email', required: false },
      { key: 'category', label: 'Category', required: false },
    ],
  },
  activities: {
    label: 'Activities',
    app: 'CRM',
    endpoint: '/crm/activities',
    fields: [
      { key: 'type', label: 'Type', required: true },
      { key: 'title', label: 'Title', required: true },
      { key: 'description', label: 'Description', required: false },
      { key: 'dueAt', label: 'Due Date', required: false },
      { key: 'contactEmail', label: 'Contact Email', required: false },
      { key: 'priority', label: 'Priority', required: false },
    ],
  },
};

function parseCSV(text) {
  const lines = text.split('\n').filter((line) => line.trim());
  if (lines.length === 0) return { headers: [], data: [] };

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].match(/(".*?"|[^,]+)/g) || [];
    const row = {};
    headers.forEach((header, index) => {
      let value = values[index]?.trim() || '';
      value = value.replace(/^"|"$/g, '').replace(/""/g, '"');
      row[header] = value;
    });
    data.push(row);
  }

  return { headers, data };
}

function generateCSV(headers, data) {
  const headerRow = headers.map((h) => `"${h}"`).join(',');
  const dataRows = data.map((row) =>
    headers
      .map((h) => {
        const val = row[h] ?? '';
        const strVal = String(val).replace(/"/g, '""');
        return `"${strVal}"`;
      })
      .join(',')
  );
  return [headerRow, ...dataRows].join('\n');
}

export function GlobalImportExportModal({ open, onOpenChange }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('import');
  const [entityType, setEntityType] = useState('contacts');

  // Import state
  const [importStep, setImportStep] = useState(0); // 0: upload, 1: map, 2: validate, 3: importing
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState({ headers: [], data: [] });
  const [fieldMapping, setFieldMapping] = useState({});
  const [validationResults, setValidationResults] = useState({ valid: [], invalid: [] });
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);

  // Export state
  const [selectedExportFields, setSelectedExportFields] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  const currentConfig = entityConfigs[entityType];

  // Reset state when entity type changes
  const handleEntityChange = (value) => {
    setEntityType(value);
    setImportStep(0);
    setFile(null);
    setParsedData({ headers: [], data: [] });
    setFieldMapping({});
    setValidationResults({ valid: [], invalid: [] });
    const config = entityConfigs[value];
    setSelectedExportFields(config.fields.map((f) => f.key));
  };

  // Handle file upload
  const handleFileUpload = useCallback(
    (e) => {
      const uploadedFile = e.target.files?.[0];
      if (!uploadedFile) return;

      setFile(uploadedFile);
      const reader = new FileReader();

      reader.onload = (event) => {
        const text = event.target?.result;
        const { headers, data } = parseCSV(text);
        setParsedData({ headers, data });

        // Auto-map fields
        const mapping = {};
        currentConfig.fields.forEach((field) => {
          const matchingHeader = headers.find(
            (h) =>
              h.toLowerCase() === field.key.toLowerCase() ||
              h.toLowerCase() === field.label.toLowerCase() ||
              h.toLowerCase().replace(/[^a-z0-9]/g, '') ===
                field.key.toLowerCase().replace(/[^a-z0-9]/g, '')
          );
          if (matchingHeader) {
            mapping[field.key] = matchingHeader;
          }
        });
        setFieldMapping(mapping);
        setImportStep(1);
      };

      reader.readAsText(uploadedFile);
    },
    [currentConfig]
  );

  // Validate data
  const validateData = useCallback(() => {
    const valid = [];
    const invalid = [];

    parsedData.data.forEach((row, index) => {
      const mappedRow = {};
      const errors = [];

      // Map fields
      Object.entries(fieldMapping).forEach(([fieldKey, csvHeader]) => {
        if (csvHeader && row[csvHeader] !== undefined) {
          mappedRow[fieldKey] = row[csvHeader];
        }
      });

      // Check required fields
      currentConfig.fields.forEach((field) => {
        if (field.required && !mappedRow[field.key]) {
          errors.push(`${field.label} is required`);
        }
      });

      if (errors.length > 0) {
        invalid.push({ row: index + 1, data: mappedRow, errors });
      } else {
        valid.push({ row: index + 1, data: mappedRow });
      }
    });

    setValidationResults({ valid, invalid });
    setImportStep(2);
  }, [parsedData, fieldMapping, currentConfig]);

  // Import data
  const handleImport = useCallback(async () => {
    if (validationResults.valid.length === 0) {
      toast({
        title: 'No Valid Records',
        description: 'There are no valid records to import',
        variant: 'destructive',
      });
      return;
    }

    setIsImporting(true);
    setImportStep(3);
    setImportProgress(0);

    try {
      const total = validationResults.valid.length;
      let imported = 0;
      let failed = 0;

      for (const item of validationResults.valid) {
        try {
          await api.post(currentConfig.endpoint, item.data);
          imported++;
        } catch (err) {
          failed++;
        }
        setImportProgress(Math.round(((imported + failed) / total) * 100));
      }

      toast({
        title: 'Import Complete',
        description: `Successfully imported ${imported} ${currentConfig.label.toLowerCase()}. ${failed > 0 ? `${failed} failed.` : ''}`,
      });

      // Reset after import
      setImportStep(0);
      setFile(null);
      setParsedData({ headers: [], data: [] });
      onOpenChange(false);
    } catch (err) {
      toast({
        title: 'Import Failed',
        description: err.message || 'Failed to import data',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  }, [validationResults, currentConfig, toast, onOpenChange]);

  // Download template
  const handleDownloadTemplate = useCallback(() => {
    const headers = currentConfig.fields.map((f) => f.label);
    const sampleRow = currentConfig.fields.reduce((acc, f) => {
      acc[f.label] = f.key === 'email' ? 'example@email.com' : '';
      return acc;
    }, {});
    const csv = generateCSV(headers, [sampleRow]);

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${entityType}_template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [entityType, currentConfig]);

  // Export data
  const handleExport = useCallback(async () => {
    if (selectedExportFields.length === 0) {
      toast({
        title: 'No Fields Selected',
        description: 'Please select at least one field to export',
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);

    try {
      const response = await api.get(currentConfig.endpoint, {
        params: { limit: 10000 },
      });

      const items = response.data || [];
      if (items.length === 0) {
        toast({
          title: 'No Data',
          description: `No ${currentConfig.label.toLowerCase()} to export`,
          variant: 'destructive',
        });
        return;
      }

      const headers = selectedExportFields.map((key) => {
        const field = currentConfig.fields.find((f) => f.key === key);
        return field?.label || key;
      });

      const data = items.map((item) => {
        const row = {};
        selectedExportFields.forEach((key) => {
          const field = currentConfig.fields.find((f) => f.key === key);
          row[field?.label || key] = item[key] ?? '';
        });
        return row;
      });

      const csv = generateCSV(headers, data);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${entityType}_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'Export Complete',
        description: `Exported ${items.length} ${currentConfig.label.toLowerCase()}`,
      });
    } catch (err) {
      toast({
        title: 'Export Failed',
        description: err.message || 'Failed to export data',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  }, [selectedExportFields, currentConfig, entityType, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import & Export Data</DialogTitle>
          <DialogDescription>
            Import or export data from your CRM. Supports CSV files.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Entity Type Selector */}
          <div className="flex items-center gap-4">
            <Label>Data Type:</Label>
            <Select value={entityType} onValueChange={handleEntityChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(entityConfigs).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <span className="flex items-center gap-2">
                      {config.label}
                      <Badge variant="outline" className="text-xs">
                        {config.app}
                      </Badge>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="import">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </TabsTrigger>
              <TabsTrigger value="export">
                <Download className="h-4 w-4 mr-2" />
                Export
              </TabsTrigger>
            </TabsList>

            <TabsContent value="import" className="space-y-4 mt-4">
              {/* Import Steps */}
              <div className="flex items-center gap-2 mb-4">
                {['Upload', 'Map Fields', 'Validate', 'Import'].map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <div
                      className={cn(
                        'h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium',
                        i <= importStep ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {i + 1}
                    </div>
                    <span className={cn('text-sm', i <= importStep ? 'text-primary' : 'text-muted-foreground')}>
                      {step}
                    </span>
                    {i < 3 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                  </div>
                ))}
              </div>

              {/* Step 0: Upload */}
              {importStep === 0 && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-2">Upload CSV File</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload a CSV file with {currentConfig.label.toLowerCase()} data
                    </p>
                    <div className="flex justify-center gap-2">
                      <Label
                        htmlFor="csv-upload"
                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                      >
                        <Upload className="h-4 w-4" />
                        Choose File
                      </Label>
                      <Input
                        id="csv-upload"
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <Button variant="outline" onClick={handleDownloadTemplate}>
                        <Download className="h-4 w-4 mr-2" />
                        Download Template
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Map Fields */}
              {importStep === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Found {parsedData.data.length} records. Map CSV columns to {currentConfig.label.toLowerCase()} fields:
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setImportStep(0)}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Re-upload
                    </Button>
                  </div>

                  <div className="max-h-[300px] overflow-y-auto space-y-2 border rounded-lg p-4">
                    {currentConfig.fields.map((field) => (
                      <div key={field.key} className="flex items-center gap-4">
                        <div className="w-1/3">
                          <span className="text-sm font-medium">
                            {field.label}
                            {field.required && <span className="text-destructive ml-1">*</span>}
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <Select
                          value={fieldMapping[field.key] || 'none'}
                          onValueChange={(v) =>
                            setFieldMapping({
                              ...fieldMapping,
                              [field.key]: v === 'none' ? undefined : v,
                            })
                          }
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select column" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Don&apos;t import</SelectItem>
                            {parsedData.headers.map((h) => (
                              <SelectItem key={h} value={h}>
                                {h}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>

                  <Button onClick={validateData} className="w-full">
                    Validate Data
                  </Button>
                </div>
              )}

              {/* Step 2: Validate */}
              {importStep === 2 && (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-800">Valid Records</span>
                      </div>
                      <p className="text-2xl font-bold text-green-800">{validationResults.valid.length}</p>
                    </div>
                    <div className="flex-1 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <span className="font-medium text-red-800">Invalid Records</span>
                      </div>
                      <p className="text-2xl font-bold text-red-800">{validationResults.invalid.length}</p>
                    </div>
                  </div>

                  {validationResults.invalid.length > 0 && (
                    <div className="border rounded-lg p-4 max-h-[200px] overflow-y-auto">
                      <p className="text-sm font-medium mb-2">Validation Errors:</p>
                      {validationResults.invalid.slice(0, 10).map((item) => (
                        <div key={item.row} className="text-sm text-destructive mb-1">
                          Row {item.row}: {item.errors.join(', ')}
                        </div>
                      ))}
                      {validationResults.invalid.length > 10 && (
                        <p className="text-sm text-muted-foreground">
                          ...and {validationResults.invalid.length - 10} more errors
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setImportStep(1)} className="flex-1">
                      Back to Mapping
                    </Button>
                    <Button
                      onClick={handleImport}
                      disabled={validationResults.valid.length === 0}
                      className="flex-1"
                    >
                      Import {validationResults.valid.length} Records
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Importing */}
              {importStep === 3 && (
                <div className="space-y-4 text-center">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                  <p className="text-lg font-medium">Importing {currentConfig.label}...</p>
                  <Progress value={importProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground">{importProgress}% complete</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="export" className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground">
                Select which fields to include in the export:
              </p>

              <div className="flex items-center justify-between mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedExportFields(currentConfig.fields.map((f) => f.key))}
                >
                  Select All
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedExportFields([])}>
                  Clear All
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto border rounded-lg p-4">
                {currentConfig.fields.map((field) => (
                  <label key={field.key} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={selectedExportFields.includes(field.key)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedExportFields([...selectedExportFields, field.key]);
                        } else {
                          setSelectedExportFields(selectedExportFields.filter((k) => k !== field.key));
                        }
                      }}
                    />
                    <span className="text-sm">{field.label}</span>
                  </label>
                ))}
              </div>

              <Button onClick={handleExport} disabled={isExporting} className="w-full">
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export {currentConfig.label}
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
