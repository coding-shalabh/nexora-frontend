'use client';

import { useState } from 'react';
import {
  Download,
  FileText,
  FileSpreadsheet,
  Filter,
  CheckCircle2,
  User,
  Building2,
  Calendar,
  Tag,
  Loader2,
  ChevronRight,
  ChevronDown,
  Info,
  Settings2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const EXPORT_FORMATS = [
  {
    value: 'csv',
    label: 'CSV',
    description: 'Comma-separated values - Compatible with Excel, Google Sheets',
    icon: FileSpreadsheet,
  },
  {
    value: 'xlsx',
    label: 'Excel (XLSX)',
    description: 'Microsoft Excel format with formatting',
    icon: FileText,
  },
  {
    value: 'json',
    label: 'JSON',
    description: 'JavaScript Object Notation - For developers',
    icon: FileText,
  },
];

const CONTACT_FIELDS = [
  { value: 'firstName', label: 'First Name', category: 'Basic', default: true },
  { value: 'lastName', label: 'Last Name', category: 'Basic', default: true },
  { value: 'email', label: 'Email', category: 'Basic', default: true },
  { value: 'phone', label: 'Phone', category: 'Basic', default: true },
  { value: 'mobilePhone', label: 'Mobile Phone', category: 'Basic', default: false },
  { value: 'jobTitle', label: 'Job Title', category: 'Work', default: true },
  { value: 'department', label: 'Department', category: 'Work', default: false },
  { value: 'company', label: 'Company', category: 'Work', default: true },
  { value: 'lifecycleStage', label: 'Lifecycle Stage', category: 'Lead', default: true },
  { value: 'leadStatus', label: 'Lead Status', category: 'Lead', default: false },
  { value: 'leadScore', label: 'Lead Score', category: 'Lead', default: false },
  { value: 'address', label: 'Address', category: 'Address', default: false },
  { value: 'city', label: 'City', category: 'Address', default: false },
  { value: 'state', label: 'State', category: 'Address', default: false },
  { value: 'postalCode', label: 'Postal Code', category: 'Address', default: false },
  { value: 'country', label: 'Country', category: 'Address', default: false },
  { value: 'tags', label: 'Tags', category: 'Organization', default: true },
  { value: 'createdAt', label: 'Created Date', category: 'System', default: false },
  { value: 'updatedAt', label: 'Last Modified', category: 'System', default: false },
];

const COMPANY_FIELDS = [
  { value: 'name', label: 'Company Name', category: 'Basic', default: true },
  { value: 'domain', label: 'Domain', category: 'Basic', default: true },
  { value: 'industry', label: 'Industry', category: 'Basic', default: true },
  { value: 'description', label: 'Description', category: 'Basic', default: false },
  { value: 'employeeCount', label: 'Employee Count', category: 'Details', default: true },
  { value: 'annualRevenue', label: 'Annual Revenue', category: 'Details', default: true },
  { value: 'foundedYear', label: 'Founded Year', category: 'Details', default: false },
  { value: 'companyType', label: 'Company Type', category: 'Classification', default: true },
  { value: 'lifecycleStage', label: 'Lifecycle Stage', category: 'Classification', default: false },
  { value: 'phone', label: 'Phone', category: 'Contact', default: true },
  { value: 'email', label: 'Email', category: 'Contact', default: true },
  { value: 'address', label: 'Address', category: 'Address', default: false },
  { value: 'city', label: 'City', category: 'Address', default: false },
  { value: 'state', label: 'State', category: 'Address', default: false },
  { value: 'postalCode', label: 'Postal Code', category: 'Address', default: false },
  { value: 'country', label: 'Country', category: 'Address', default: false },
  { value: 'tags', label: 'Tags', category: 'Organization', default: true },
  { value: 'createdAt', label: 'Created Date', category: 'System', default: false },
  { value: 'updatedAt', label: 'Last Modified', category: 'System', default: false },
];

const DATE_RANGES = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'last30days', label: 'Last 30 Days' },
  { value: 'last90days', label: 'Last 90 Days' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'thisYear', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' },
];

export default function ExportPage() {
  const { toast } = useToast();
  const [exportType, setExportType] = useState('contacts');
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('all');
  const [selectedFields, setSelectedFields] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState(['Basic']);
  const [exporting, setExporting] = useState(false);
  const [includeCustomFields, setIncludeCustomFields] = useState(true);

  const fields = exportType === 'contacts' ? CONTACT_FIELDS : COMPANY_FIELDS;
  const categories = [...new Set(fields.map(f => f.category))];

  // Initialize selected fields with defaults
  useState(() => {
    const defaultFields = fields.filter(f => f.default).map(f => f.value);
    setSelectedFields(defaultFields);
  }, [exportType]);

  const handleFieldToggle = (fieldValue) => {
    setSelectedFields(prev =>
      prev.includes(fieldValue)
        ? prev.filter(v => v !== fieldValue)
        : [...prev, fieldValue]
    );
  };

  const handleSelectAll = () => {
    setSelectedFields(fields.map(f => f.value));
  };

  const handleSelectNone = () => {
    setSelectedFields([]);
  };

  const handleSelectDefaults = () => {
    setSelectedFields(fields.filter(f => f.default).map(f => f.value));
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleExport = async () => {
    if (selectedFields.length === 0) {
      toast({
        title: 'No Fields Selected',
        description: 'Please select at least one field to export',
        variant: 'destructive',
      });
      return;
    }

    setExporting(true);

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In real implementation, this would call an API endpoint
      // and download the generated file

      const fileName = `${exportType}_export_${new Date().toISOString().split('T')[0]}.${exportFormat}`;

      toast({
        title: 'Export Complete',
        description: `Your data has been exported to ${fileName}`,
      });

      // Simulate file download
      // In production, you would receive the file from the API
      const blob = new Blob(['Sample export data'], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      toast({
        title: 'Export Failed',
        description: err.message || 'An error occurred during export',
        variant: 'destructive',
      });
    } finally {
      setExporting(false);
    }
  };

  const selectedFormat = EXPORT_FORMATS.find(f => f.value === exportFormat);
  const FormatIcon = selectedFormat?.icon || FileText;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Export Data</h1>
          <p className="text-muted-foreground">
            Export your CRM data in various formats
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Export Type Selection */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">What do you want to export?</h3>
            <Tabs value={exportType} onValueChange={setExportType} className="w-full">
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
          </Card>

          {/* Export Format */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Select Export Format</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {EXPORT_FORMATS.map((format) => {
                const Icon = format.icon;
                const isSelected = exportFormat === format.value;
                return (
                  <button
                    key={format.value}
                    onClick={() => setExportFormat(format.value)}
                    className={cn(
                      'p-4 border-2 rounded-lg text-left transition-all hover:border-primary/50',
                      isSelected ? 'border-primary bg-primary/5' : 'border-border'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0',
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold">{format.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format.description}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Field Selection */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Select Fields to Export</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleSelectDefaults}>
                  Defaults
                </Button>
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  All
                </Button>
                <Button variant="outline" size="sm" onClick={handleSelectNone}>
                  None
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {categories.map((category) => {
                const categoryFields = fields.filter(f => f.category === category);
                const selectedInCategory = categoryFields.filter(f =>
                  selectedFields.includes(f.value)
                ).length;
                const isExpanded = expandedCategories.includes(category);

                return (
                  <div key={category} className="border rounded-lg">
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <span className="font-medium">{category}</span>
                        <Badge variant="secondary" className="text-xs">
                          {selectedInCategory} / {categoryFields.length}
                        </Badge>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-3 pb-3 space-y-2">
                        {categoryFields.map((field) => (
                          <div
                            key={field.value}
                            className="flex items-center gap-2 p-2 hover:bg-muted/30 rounded"
                          >
                            <Checkbox
                              id={field.value}
                              checked={selectedFields.includes(field.value)}
                              onCheckedChange={() => handleFieldToggle(field.value)}
                            />
                            <Label
                              htmlFor={field.value}
                              className="flex-1 cursor-pointer font-normal"
                            >
                              {field.label}
                            </Label>
                            {field.default && (
                              <Badge variant="outline" className="text-xs">
                                Default
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="includeCustomFields" className="font-normal cursor-pointer">
                      Include Custom Fields
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Export all custom fields defined in your CRM
                    </p>
                  </div>
                </div>
                <Checkbox
                  id="includeCustomFields"
                  checked={includeCustomFields}
                  onCheckedChange={setIncludeCustomFields}
                />
              </div>
            </div>
          </Card>

          {/* Filters */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dateRange">Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger id="dateRange">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DATE_RANGES.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>

        {/* Export Summary & Action */}
        <div className="space-y-6">
          <Card className="p-6 sticky top-6">
            <h3 className="text-lg font-semibold mb-4">Export Summary</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                {exportType === 'contacts' ? (
                  <User className="h-5 w-5 text-primary" />
                ) : (
                  <Building2 className="h-5 w-5 text-primary" />
                )}
                <div>
                  <p className="text-sm font-medium capitalize">{exportType}</p>
                  <p className="text-xs text-muted-foreground">Export Type</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <FormatIcon className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{selectedFormat?.label}</p>
                  <p className="text-xs text-muted-foreground">File Format</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{selectedFields.length} Fields</p>
                  <p className="text-xs text-muted-foreground">Selected for Export</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">
                    {DATE_RANGES.find(r => r.value === dateRange)?.label}
                  </p>
                  <p className="text-xs text-muted-foreground">Date Range</p>
                </div>
              </div>
            </div>

            <Button
              className="w-full mt-6"
              size="lg"
              onClick={handleExport}
              disabled={exporting || selectedFields.length === 0}
            >
              {exporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </>
              )}
            </Button>

            <Card className="p-3 bg-blue-50/50 border-blue-200 mt-4">
              <div className="flex gap-2">
                <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-blue-900">
                    Export respects your CRM permissions. You'll only export data you have access to.
                  </p>
                </div>
              </div>
            </Card>
          </Card>
        </div>
      </div>
    </div>
  );
}
