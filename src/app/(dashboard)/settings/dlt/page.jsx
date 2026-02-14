'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UnifiedLayout } from '@/components/layout/unified';
import { cn } from '@/lib/utils';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Plus,
  Trash2,
  Edit,
  Copy,
  Check,
  X,
  AlertTriangle,
  Info,
  ExternalLink,
  Building2,
  FileText,
  Smartphone,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Download,
  Upload,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

// Mock DLT data
const dltConfig = {
  entityId: '1201159876543210',
  entityName: 'Acme Corporation Pvt Ltd',
  registeredOn: '2024-01-15',
  platform: 'Jio DLT',
  status: 'active',
};

const senderIds = [
  {
    id: '1',
    senderId: 'ACMECO',
    entityId: '1201159876543210',
    type: 'Transactional',
    status: 'approved',
    registeredOn: '2024-01-15',
    templatesCount: 8,
  },
  {
    id: '2',
    senderId: 'ACMEMK',
    entityId: '1201159876543210',
    type: 'Promotional',
    status: 'approved',
    registeredOn: '2024-01-20',
    templatesCount: 5,
  },
  {
    id: '3',
    senderId: 'ACMESV',
    entityId: '1201159876543210',
    type: 'Service Implicit',
    status: 'pending',
    registeredOn: '2024-02-01',
    templatesCount: 0,
  },
];

const dltTemplates = [
  {
    id: '1',
    templateId: '1207165432109876',
    name: 'OTP Verification',
    senderId: 'ACMECO',
    category: 'Transactional',
    content:
      'Your OTP for verification is {#var#}. Valid for {#var#} minutes. Do not share with anyone. - ACME',
    variables: ['{#var#}', '{#var#}'],
    status: 'approved',
    approvedOn: '2024-01-16',
  },
  {
    id: '2',
    templateId: '1207165432109877',
    name: 'Order Confirmation',
    senderId: 'ACMECO',
    category: 'Transactional',
    content:
      'Dear {#var#}, your order #{#var#} has been confirmed. Track at {#var#}. Thank you for shopping with ACME.',
    variables: ['{#var#}', '{#var#}', '{#var#}'],
    status: 'approved',
    approvedOn: '2024-01-17',
  },
  {
    id: '3',
    templateId: '1207165432109878',
    name: 'Payment Reminder',
    senderId: 'ACMECO',
    category: 'Transactional',
    content:
      'Dear {#var#}, your payment of Rs.{#var#} for invoice {#var#} is due on {#var#}. Pay now: {#var#}',
    variables: ['{#var#}', '{#var#}', '{#var#}', '{#var#}', '{#var#}'],
    status: 'approved',
    approvedOn: '2024-01-18',
  },
  {
    id: '4',
    templateId: '1207165432109879',
    name: 'Promotional Offer',
    senderId: 'ACMEMK',
    category: 'Promotional',
    content:
      'ACME Sale! Get {#var#}% off on all products. Use code {#var#}. Shop now: {#var#}. T&C apply.',
    variables: ['{#var#}', '{#var#}', '{#var#}'],
    status: 'approved',
    approvedOn: '2024-01-25',
  },
  {
    id: '5',
    templateId: '1207165432109880',
    name: 'Appointment Reminder',
    senderId: 'ACMESV',
    category: 'Service Implicit',
    content:
      'Reminder: Your appointment with {#var#} is scheduled for {#var#} at {#var#}. Reply YES to confirm.',
    variables: ['{#var#}', '{#var#}', '{#var#}'],
    status: 'pending',
    submittedOn: '2024-02-01',
  },
];

const dltPlatforms = [
  { name: 'Jio DLT', url: 'https://trueconnect.jio.com' },
  { name: 'Vodafone DLT', url: 'https://www.vilpower.in' },
  { name: 'Airtel DLT', url: 'https://www.airtel.in/business/commercial-communication' },
  { name: 'BSNL DLT', url: 'https://www.ucc-bsnl.co.in' },
  { name: 'Videocon DLT', url: 'https://smartping.live' },
];

function StatusBadge({ status }) {
  const config = {
    approved: {
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-100',
      label: 'Approved',
    },
    pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending' },
    rejected: { icon: X, color: 'text-red-600', bg: 'bg-red-100', label: 'Rejected' },
    active: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100', label: 'Active' },
  };

  const { icon: Icon, color, bg, label } = config[status] || config.pending;

  return (
    <span className={cn('flex items-center gap-1 text-xs px-2 py-1 rounded-full', bg, color)}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

function AddSenderIdModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    senderId: '',
    type: 'Transactional',
    description: '',
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <Card className="w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Add Sender ID</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Sender ID (Header)</Label>
            <Input
              placeholder="e.g., ACMECO"
              value={formData.senderId}
              onChange={(e) => setFormData({ ...formData, senderId: e.target.value.toUpperCase() })}
              maxLength={6}
            />
            <p className="text-xs text-muted-foreground">
              6 characters alphanumeric. Must be registered on your DLT platform.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Message Type</Label>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="Transactional">Transactional</option>
              <option value="Promotional">Promotional</option>
              <option value="Service Implicit">Service Implicit</option>
              <option value="Service Explicit">Service Explicit</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Description (Optional)</Label>
            <Input
              placeholder="e.g., Used for OTP and alerts"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="p-3 rounded-lg bg-yellow-50 text-yellow-700 text-sm">
            <p className="font-medium flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" /> Important
            </p>
            <p className="text-xs mt-1">
              Ensure this Sender ID is already approved on your DLT platform before adding here.
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={() => {
                onAdd(formData);
                onClose();
              }}
              className="flex-1"
            >
              Add Sender ID
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function AddTemplateModal({ isOpen, onClose, onAdd, senderIds }) {
  const [formData, setFormData] = useState({
    templateId: '',
    name: '',
    senderId: senderIds[0]?.senderId || '',
    category: 'Transactional',
    content: '',
  });

  if (!isOpen) return null;

  const variableCount = (formData.content.match(/\{#var#\}/g) || []).length;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <Card className="w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Add DLT Template</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>DLT Template ID</Label>
              <Input
                placeholder="1207165432109876"
                value={formData.templateId}
                onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Template Name</Label>
              <Input
                placeholder="e.g., OTP Verification"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Sender ID</Label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.senderId}
                onChange={(e) => setFormData({ ...formData, senderId: e.target.value })}
              >
                {senderIds.map((s) => (
                  <option key={s.id} value={s.senderId}>
                    {s.senderId}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Transactional">Transactional</option>
                <option value="Promotional">Promotional</option>
                <option value="Service Implicit">Service Implicit</option>
                <option value="Service Explicit">Service Explicit</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Template Content</Label>
            <Textarea
              placeholder="Your OTP is {#var#}. Valid for {#var#} minutes."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Use {'{#var#}'} for variables</span>
              <span>{variableCount} variable(s) detected</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 text-blue-700 text-sm">
            <p className="font-medium flex items-center gap-1">
              <Info className="h-4 w-4" /> Template must match exactly
            </p>
            <p className="text-xs mt-1">
              The content must match your DLT-approved template exactly, including spaces and
              punctuation.
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={() => {
                onAdd(formData);
                onClose();
              }}
              className="flex-1"
            >
              Add Template
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function DLTCompliancePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddSenderId, setShowAddSenderId] = useState(false);
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [senderIdsList, setSenderIdsList] = useState(senderIds);
  const [templatesList, setTemplatesList] = useState(dltTemplates);

  const filteredTemplates = templatesList.filter((t) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(query) ||
      t.templateId.includes(query) ||
      t.content.toLowerCase().includes(query) ||
      t.senderId.toLowerCase().includes(query)
    );
  });

  const stats = {
    totalSenderIds: senderIdsList.length,
    approvedSenderIds: senderIdsList.filter((s) => s.status === 'approved').length,
    totalTemplates: templatesList.length,
    approvedTemplates: templatesList.filter((t) => t.status === 'approved').length,
    pendingTemplates: templatesList.filter((t) => t.status === 'pending').length,
  };

  return (
    <UnifiedLayout hubId="settings" pageTitle="DLT Compliance" fixedMenu={null}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              DLT Compliance
            </h1>
            <p className="text-muted-foreground">Manage DLT registration for India SMS delivery</p>
          </div>
          <Button variant="outline" asChild>
            <a href="https://trueconnect.jio.com" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" /> Open DLT Portal
            </a>
          </Button>
        </div>

        {/* Info Banner */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">What is DLT?</h3>
              <p className="text-sm text-blue-700 mt-1">
                DLT (Distributed Ledger Technology) registration is mandatory for sending SMS in
                India. You must register your business, sender IDs, and message templates with a
                TRAI-approved DLT platform.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {dltPlatforms.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                  >
                    {platform.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b">
          {[
            { id: 'overview', label: 'Overview', icon: Shield },
            { id: 'senderids', label: 'Sender IDs', icon: Smartphone },
            { id: 'templates', label: 'Templates', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Entity Info */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Entity Registration</h3>
                    <p className="text-sm text-muted-foreground">Your DLT entity details</p>
                  </div>
                </div>
                <StatusBadge status={dltConfig.status} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Entity ID (PE ID)</p>
                  <p className="font-mono font-medium flex items-center gap-2">
                    {dltConfig.entityId}
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Entity Name</p>
                  <p className="font-medium">{dltConfig.entityName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">DLT Platform</p>
                  <p className="font-medium">{dltConfig.platform}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Registered On</p>
                  <p className="font-medium">{dltConfig.registeredOn}</p>
                </div>
              </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalSenderIds}</p>
                    <p className="text-xs text-muted-foreground">Sender IDs</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.approvedSenderIds}</p>
                    <p className="text-xs text-muted-foreground">Approved IDs</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalTemplates}</p>
                    <p className="text-xs text-muted-foreground">Templates</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.pendingTemplates}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-4">
              <h3 className="font-medium mb-3">Quick Actions</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveTab('senderids');
                    setShowAddSenderId(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Sender ID
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveTab('templates');
                    setShowAddTemplate(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Template
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-1" /> Import Templates
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" /> Export All
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Sender IDs Tab */}
        {activeTab === 'senderids' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {senderIdsList.length} sender ID(s) registered
              </p>
              <Button onClick={() => setShowAddSenderId(true)}>
                <Plus className="h-4 w-4 mr-2" /> Add Sender ID
              </Button>
            </div>

            <div className="grid gap-4">
              {senderIdsList.map((sender, index) => (
                <motion.div
                  key={sender.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                          <span className="font-mono font-bold text-purple-600">
                            {sender.senderId.slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold font-mono">{sender.senderId}</h3>
                            <StatusBadge status={sender.status} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {sender.type} • {sender.templatesCount} templates
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={() => setShowAddTemplate(true)}>
                <Plus className="h-4 w-4 mr-2" /> Add Template
              </Button>
            </div>

            <div className="space-y-3">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{template.name}</h3>
                          <StatusBadge status={template.status} />
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="font-mono bg-muted px-1.5 py-0.5 rounded">
                            {template.templateId}
                          </span>
                          <span>Sender: {template.senderId}</span>
                          <span>{template.category}</span>
                          <span>{template.variables.length} variable(s)</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 font-mono text-sm">
                      {template.content}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {template.status === 'approved'
                        ? `Approved on ${template.approvedOn}`
                        : `Submitted on ${template.submittedOn}`}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <Card className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="font-medium mb-2">No templates found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add your DLT-approved templates to use them for SMS
                </p>
                <Button onClick={() => setShowAddTemplate(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Template
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* Modals */}
        <AddSenderIdModal
          isOpen={showAddSenderId}
          onClose={() => setShowAddSenderId(false)}
          onAdd={(data) => {
            setSenderIdsList((prev) => [
              ...prev,
              {
                id: `${Date.now()}`,
                senderId: data.senderId,
                entityId: dltConfig.entityId,
                type: data.type,
                status: 'pending',
                registeredOn: new Date().toISOString().split('T')[0],
                templatesCount: 0,
              },
            ]);
          }}
        />

        <AddTemplateModal
          isOpen={showAddTemplate}
          onClose={() => setShowAddTemplate(false)}
          senderIds={senderIdsList}
          onAdd={(data) => {
            setTemplatesList((prev) => [
              ...prev,
              {
                id: `${Date.now()}`,
                templateId: data.templateId,
                name: data.name,
                senderId: data.senderId,
                category: data.category,
                content: data.content,
                variables: data.content.match(/\{#var#\}/g) || [],
                status: 'pending',
                submittedOn: new Date().toISOString().split('T')[0],
              },
            ]);
          }}
        />
      </div>
    </UnifiedLayout>
  );
}
