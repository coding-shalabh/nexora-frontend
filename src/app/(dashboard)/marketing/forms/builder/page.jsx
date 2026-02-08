'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  GripVertical,
  Type,
  Mail,
  Phone,
  Calendar,
  CheckSquare,
  List,
  MessageSquare,
  Hash,
  Link as LinkIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const fieldTypes = [
  { id: 'text', label: 'Text Input', icon: Type, description: 'Single line text' },
  { id: 'email', label: 'Email', icon: Mail, description: 'Email address' },
  { id: 'phone', label: 'Phone', icon: Phone, description: 'Phone number' },
  { id: 'number', label: 'Number', icon: Hash, description: 'Numeric input' },
  { id: 'textarea', label: 'Text Area', icon: MessageSquare, description: 'Multi-line text' },
  { id: 'select', label: 'Dropdown', icon: List, description: 'Select from options' },
  { id: 'checkbox', label: 'Checkbox', icon: CheckSquare, description: 'Yes/No option' },
  { id: 'date', label: 'Date', icon: Calendar, description: 'Date picker' },
  { id: 'url', label: 'URL', icon: LinkIcon, description: 'Website URL' },
];

// Form validation schema
const formSchema = z.object({
  formName: z
    .string()
    .min(1, 'Form name is required')
    .max(100, 'Form name must be less than 100 characters'),
  formDescription: z.string().max(500, 'Description must be less than 500 characters').optional(),
  fields: z
    .array(
      z.object({
        id: z.string(),
        type: z.string(),
        label: z.string().min(1, 'Field label is required'),
        name: z.string().min(1, 'Field name is required'),
        placeholder: z.string().optional(),
        required: z.boolean(),
      })
    )
    .min(1, 'At least one field is required'),
});

export default function FormBuilderPage() {
  const router = useRouter();
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [fields, setFields] = useState([
    {
      id: 'field-1',
      type: 'text',
      label: 'Full Name',
      name: 'name',
      placeholder: 'Enter your name',
      required: true,
    },
    {
      id: 'field-2',
      type: 'email',
      label: 'Email Address',
      name: 'email',
      placeholder: 'your@email.com',
      required: true,
    },
  ]);
  const [selectedField, setSelectedField] = useState(null);
  const [activeTab, setActiveTab] = useState('builder');

  const addField = (fieldType) => {
    const newField = {
      id: `field-${Date.now()}`,
      type: fieldType.id,
      label: fieldType.label,
      name: fieldType.id + '_' + Date.now(),
      placeholder: '',
      required: false,
    };
    setFields([...fields, newField]);
    setSelectedField(newField.id);
  };

  const removeField = (fieldId) => {
    setFields(fields.filter((f) => f.id !== fieldId));
    if (selectedField === fieldId) {
      setSelectedField(null);
    }
  };

  const updateField = (fieldId, updates) => {
    setFields(fields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f)));
  };

  const handleSave = () => {
    // Validate form data
    const result = formSchema.safeParse({
      formName,
      formDescription,
      fields,
    });

    if (!result.success) {
      const firstError = result.error.errors[0];
      alert(`Validation Error: ${firstError.message}`);
      return;
    }

    console.log('Saving form:', result.data);
    // TODO: Implement API call to save form
    alert('Form saved! (Mock - not persisted)');
    router.push('/marketing/forms');
  };

  const selectedFieldData = fields.find((f) => f.id === selectedField);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/marketing/forms">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold">Form Builder</h1>
              <p className="text-sm text-muted-foreground">Create a new lead capture form</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setActiveTab('preview')}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Form
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
            <TabsTrigger value="builder" className="rounded-none">
              Builder
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-none">
              Settings
            </TabsTrigger>
            <TabsTrigger value="preview" className="rounded-none">
              Preview
            </TabsTrigger>
          </TabsList>

          {/* Builder Tab */}
          <TabsContent value="builder" className="flex-1 flex mt-0">
            {/* Field Types Sidebar */}
            <div className="w-64 border-r bg-card p-4 overflow-y-auto">
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Field Types</h3>
                <p className="text-xs text-muted-foreground">Click to add fields to your form</p>
              </div>
              <div className="space-y-2">
                {fieldTypes.map((fieldType) => {
                  const Icon = fieldType.icon;
                  return (
                    <button
                      key={fieldType.id}
                      onClick={() => addField(fieldType)}
                      className="w-full flex items-start gap-3 p-3 rounded-lg border hover:bg-accent hover:border-primary transition-colors text-left"
                    >
                      <Icon className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{fieldType.label}</div>
                        <div className="text-xs text-muted-foreground">{fieldType.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-2xl mx-auto">
                <Card className="mb-6">
                  <CardHeader>
                    <Input
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Form Name"
                      className="text-2xl font-bold border-none px-0 focus-visible:ring-0"
                    />
                    <Textarea
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Form description (optional)"
                      className="text-sm border-none px-0 focus-visible:ring-0 resize-none"
                      rows={2}
                    />
                  </CardHeader>
                </Card>

                {fields.length === 0 ? (
                  <Card className="p-12 text-center">
                    <div className="text-muted-foreground">
                      <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">No fields yet</p>
                      <p className="text-xs mt-1">Click a field type on the left to add it</p>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {fields.map((field) => {
                      const isSelected = selectedField === field.id;
                      return (
                        <Card
                          key={field.id}
                          className={`cursor-pointer transition-all ${
                            isSelected ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => setSelectedField(field.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <GripVertical className="h-5 w-5 text-muted-foreground mt-2" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Label className="font-medium">
                                    {field.label}
                                    {field.required && (
                                      <span className="text-destructive ml-1">*</span>
                                    )}
                                  </Label>
                                  <Badge variant="secondary" className="text-xs">
                                    {field.type}
                                  </Badge>
                                </div>
                                {field.type === 'textarea' ? (
                                  <Textarea placeholder={field.placeholder || 'Enter text...'} />
                                ) : field.type === 'select' ? (
                                  <Select>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select an option..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="option1">Option 1</SelectItem>
                                      <SelectItem value="option2">Option 2</SelectItem>
                                    </SelectContent>
                                  </Select>
                                ) : field.type === 'checkbox' ? (
                                  <div className="flex items-center gap-2">
                                    <input type="checkbox" className="h-4 w-4" />
                                    <span className="text-sm">
                                      {field.placeholder || 'Checkbox label'}
                                    </span>
                                  </div>
                                ) : (
                                  <Input
                                    type={field.type}
                                    placeholder={field.placeholder || `Enter ${field.type}...`}
                                  />
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeField(field.id);
                                }}
                                aria-label="Delete field"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Properties Panel */}
            <div className="w-80 border-l bg-card p-4 overflow-y-auto">
              {selectedFieldData ? (
                <div>
                  <h3 className="font-semibold mb-4">Field Properties</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Field Label</Label>
                      <Input
                        value={selectedFieldData.label}
                        onChange={(e) => updateField(selectedField, { label: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Field Name (ID)</Label>
                      <Input
                        value={selectedFieldData.name}
                        onChange={(e) => updateField(selectedField, { name: e.target.value })}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Used in form submission data
                      </p>
                    </div>
                    <div>
                      <Label>Placeholder</Label>
                      <Input
                        value={selectedFieldData.placeholder}
                        onChange={(e) =>
                          updateField(selectedField, { placeholder: e.target.value })
                        }
                        className="mt-1"
                        placeholder="Enter placeholder text..."
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Required Field</Label>
                      <Switch
                        checked={selectedFieldData.required}
                        onCheckedChange={(checked) =>
                          updateField(selectedField, { required: checked })
                        }
                      />
                    </div>
                    <div className="pt-4 border-t">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => removeField(selectedField)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Field
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <p className="text-sm">Select a field to edit its properties</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Form Settings</CardTitle>
                  <CardDescription>Configure form behavior and notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Success Message</Label>
                    <Textarea
                      placeholder="Thank you for your submission!"
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Redirect URL (Optional)</Label>
                    <Input placeholder="https://example.com/thank-you" className="mt-1" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Redirect users after successful submission
                    </p>
                  </div>
                  <div>
                    <Label>Notification Email</Label>
                    <Input type="email" placeholder="admin@example.com" className="mt-1" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Receive notifications when form is submitted
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable reCAPTCHA</Label>
                      <p className="text-xs text-muted-foreground">Prevent spam submissions</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="flex-1 p-6 overflow-y-auto bg-muted">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>{formName || 'Untitled Form'}</CardTitle>
                  {formDescription && <CardDescription>{formDescription}</CardDescription>}
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((field) => (
                    <div key={field.id}>
                      <Label>
                        {field.label}
                        {field.required && <span className="text-destructive ml-1">*</span>}
                      </Label>
                      {field.type === 'textarea' ? (
                        <Textarea placeholder={field.placeholder} className="mt-1" rows={4} />
                      ) : field.type === 'select' ? (
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder={field.placeholder || 'Select...'} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="option1">Option 1</SelectItem>
                            <SelectItem value="option2">Option 2</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : field.type === 'checkbox' ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input type="checkbox" className="h-4 w-4" />
                          <span className="text-sm">{field.placeholder}</span>
                        </div>
                      ) : (
                        <Input type={field.type} placeholder={field.placeholder} className="mt-1" />
                      )}
                    </div>
                  ))}
                  <Button className="w-full mt-6">Submit</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
