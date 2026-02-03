'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

/**
 * Renders a custom field based on its type
 */
export function CustomFieldRenderer({
  field,
  value,
  onChange,
  error,
  disabled = false,
  showLabel = true,
}) {
  const handleChange = (newValue) => {
    onChange?.(field.apiName, newValue);
  };

  const renderLabel = () => {
    if (!showLabel) return null;
    return (
      <Label htmlFor={field.apiName} className="text-sm font-medium">
        {field.name}
        {field.isRequired && <span className="text-red-500 ml-1">*</span>}
      </Label>
    );
  };

  const renderDescription = () => {
    if (!field.description) return null;
    return (
      <p className="text-xs text-muted-foreground mt-0.5">{field.description}</p>
    );
  };

  const renderError = () => {
    if (!error) return null;
    return <p className="text-xs text-red-500 mt-1">{error}</p>;
  };

  switch (field.fieldType) {
    case 'TEXT':
      return (
        <div className="space-y-1.5">
          {renderLabel()}
          <Input
            id={field.apiName}
            type="text"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}`}
            disabled={disabled}
            className={cn(error && 'border-red-500')}
          />
          {renderDescription()}
          {renderError()}
        </div>
      );

    case 'TEXTAREA':
      return (
        <div className="space-y-1.5">
          {renderLabel()}
          <Textarea
            id={field.apiName}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}`}
            disabled={disabled}
            rows={3}
            className={cn(error && 'border-red-500')}
          />
          {renderDescription()}
          {renderError()}
        </div>
      );

    case 'NUMBER':
      return (
        <div className="space-y-1.5">
          {renderLabel()}
          <Input
            id={field.apiName}
            type="number"
            value={value ?? ''}
            onChange={(e) => handleChange(e.target.value ? Number(e.target.value) : null)}
            placeholder={field.placeholder || '0'}
            disabled={disabled}
            className={cn(error && 'border-red-500')}
          />
          {renderDescription()}
          {renderError()}
        </div>
      );

    case 'CURRENCY':
      return (
        <div className="space-y-1.5">
          {renderLabel()}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              id={field.apiName}
              type="number"
              step="0.01"
              value={value ?? ''}
              onChange={(e) => handleChange(e.target.value ? Number(e.target.value) : null)}
              placeholder={field.placeholder || '0.00'}
              disabled={disabled}
              className={cn('pl-7', error && 'border-red-500')}
            />
          </div>
          {renderDescription()}
          {renderError()}
        </div>
      );

    case 'DATE':
      return (
        <div className="space-y-1.5">
          {renderLabel()}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id={field.apiName}
                variant="outline"
                disabled={disabled}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !value && 'text-muted-foreground',
                  error && 'border-red-500'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), 'PPP') : field.placeholder || 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => handleChange(date ? date.toISOString() : null)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {renderDescription()}
          {renderError()}
        </div>
      );

    case 'DATETIME':
      return (
        <div className="space-y-1.5">
          {renderLabel()}
          <Input
            id={field.apiName}
            type="datetime-local"
            value={value ? format(new Date(value), "yyyy-MM-dd'T'HH:mm") : ''}
            onChange={(e) => handleChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
            disabled={disabled}
            className={cn(error && 'border-red-500')}
          />
          {renderDescription()}
          {renderError()}
        </div>
      );

    case 'BOOLEAN':
      return (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Switch
              id={field.apiName}
              checked={value === true}
              onCheckedChange={(checked) => handleChange(checked)}
              disabled={disabled}
            />
            <Label htmlFor={field.apiName} className="text-sm font-medium cursor-pointer">
              {field.name}
              {field.isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
          </div>
          {renderDescription()}
          {renderError()}
        </div>
      );

    case 'SELECT':
      return (
        <div className="space-y-1.5">
          {renderLabel()}
          <Select
            value={value || ''}
            onValueChange={(v) => handleChange(v)}
            disabled={disabled}
          >
            <SelectTrigger className={cn(error && 'border-red-500')}>
              <SelectValue placeholder={field.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {(field.options || []).map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {renderDescription()}
          {renderError()}
        </div>
      );

    case 'MULTISELECT':
      const selectedValues = Array.isArray(value) ? value : [];
      return (
        <div className="space-y-1.5">
          {renderLabel()}
          <div className={cn(
            'border rounded-md p-2 min-h-[38px]',
            error && 'border-red-500'
          )}>
            {selectedValues.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedValues.map((v) => (
                  <Badge key={v} variant="secondary" className="gap-1">
                    {v}
                    <button
                      type="button"
                      onClick={() => handleChange(selectedValues.filter((sv) => sv !== v))}
                      disabled={disabled}
                      className="hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <div className="space-y-1">
              {(field.options || [])
                .filter((option) => !selectedValues.includes(option))
                .map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <Checkbox
                      id={`${field.apiName}-${option}`}
                      checked={false}
                      onCheckedChange={() => handleChange([...selectedValues, option])}
                      disabled={disabled}
                    />
                    <Label
                      htmlFor={`${field.apiName}-${option}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
            </div>
          </div>
          {renderDescription()}
          {renderError()}
        </div>
      );

    case 'EMAIL':
      return (
        <div className="space-y-1.5">
          {renderLabel()}
          <Input
            id={field.apiName}
            type="email"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder || 'email@example.com'}
            disabled={disabled}
            className={cn(error && 'border-red-500')}
          />
          {renderDescription()}
          {renderError()}
        </div>
      );

    case 'PHONE':
      return (
        <div className="space-y-1.5">
          {renderLabel()}
          <Input
            id={field.apiName}
            type="tel"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder || '+1 (555) 000-0000'}
            disabled={disabled}
            className={cn(error && 'border-red-500')}
          />
          {renderDescription()}
          {renderError()}
        </div>
      );

    case 'URL':
      return (
        <div className="space-y-1.5">
          {renderLabel()}
          <Input
            id={field.apiName}
            type="url"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder || 'https://example.com'}
            disabled={disabled}
            className={cn(error && 'border-red-500')}
          />
          {renderDescription()}
          {renderError()}
        </div>
      );

    default:
      return (
        <div className="space-y-1.5">
          {renderLabel()}
          <Input
            id={field.apiName}
            type="text"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            className={cn(error && 'border-red-500')}
          />
          {renderDescription()}
          {renderError()}
        </div>
      );
  }
}

/**
 * Renders a group of custom fields
 */
export function CustomFieldGroup({
  fields = [],
  values = {},
  onChange,
  errors = {},
  disabled = false,
  columns = 2,
}) {
  const handleFieldChange = (apiName, value) => {
    onChange?.({
      ...values,
      [apiName]: value,
    });
  };

  if (fields.length === 0) {
    return null;
  }

  return (
    <div className={cn(
      'grid gap-4',
      columns === 1 && 'grid-cols-1',
      columns === 2 && 'grid-cols-1 md:grid-cols-2',
      columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    )}>
      {fields.map((field) => (
        <CustomFieldRenderer
          key={field.id}
          field={field}
          value={values[field.apiName]}
          onChange={handleFieldChange}
          error={errors[field.apiName]}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

/**
 * Display-only view for custom field values
 */
export function CustomFieldDisplay({ field, value }) {
  const formatValue = () => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-muted-foreground">Not set</span>;
    }

    switch (field.fieldType) {
      case 'BOOLEAN':
        return value ? 'Yes' : 'No';

      case 'DATE':
        return format(new Date(value), 'PPP');

      case 'DATETIME':
        return format(new Date(value), 'PPP p');

      case 'CURRENCY':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value);

      case 'MULTISELECT':
        if (!Array.isArray(value) || value.length === 0) {
          return <span className="text-muted-foreground">None selected</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {value.map((v) => (
              <Badge key={v} variant="secondary" className="text-xs">
                {v}
              </Badge>
            ))}
          </div>
        );

      case 'URL':
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {value}
          </a>
        );

      case 'EMAIL':
        return (
          <a href={`mailto:${value}`} className="text-primary hover:underline">
            {value}
          </a>
        );

      case 'PHONE':
        return (
          <a href={`tel:${value}`} className="text-primary hover:underline">
            {value}
          </a>
        );

      default:
        return String(value);
    }
  };

  return (
    <div>
      <dt className="text-sm text-muted-foreground">{field.name}</dt>
      <dd className="text-sm font-medium mt-0.5">{formatValue()}</dd>
    </div>
  );
}

/**
 * Validate custom field values
 */
export function validateCustomFields(fields, values) {
  const errors = {};

  for (const field of fields) {
    const value = values[field.apiName];

    // Required field validation
    if (field.isRequired) {
      if (value === null || value === undefined || value === '') {
        errors[field.apiName] = `${field.name} is required`;
        continue;
      }
      if (field.fieldType === 'MULTISELECT' && (!Array.isArray(value) || value.length === 0)) {
        errors[field.apiName] = `${field.name} is required`;
        continue;
      }
    }

    // Skip validation if empty and not required
    if (value === null || value === undefined || value === '') {
      continue;
    }

    // Type-specific validation
    switch (field.fieldType) {
      case 'EMAIL':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors[field.apiName] = 'Invalid email address';
        }
        break;

      case 'URL':
        try {
          new URL(value);
        } catch {
          errors[field.apiName] = 'Invalid URL';
        }
        break;

      case 'PHONE':
        if (!/^[+\d\s()-]+$/.test(value)) {
          errors[field.apiName] = 'Invalid phone number';
        }
        break;

      case 'NUMBER':
      case 'CURRENCY':
        if (typeof value !== 'number' || isNaN(value)) {
          errors[field.apiName] = 'Must be a valid number';
        }
        break;
    }
  }

  return errors;
}
