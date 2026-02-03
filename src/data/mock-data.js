/**
 * Mock Data for Frontend Development
 *
 * This file contains mock data that matches the exact backend Prisma schema.
 * When ready for production, replace the imports with actual API calls.
 *
 * Usage:
 *   import { mockData, getConversations, getMessages } from '@/data/mock-data'
 *
 * Later replace with:
 *   import { getConversations, getMessages } from '@/services/api'
 */

// Import full Contact schema from contacts.js
import {
  contacts as fullContacts,
  contactStats,
  getContacts as getContactsFromModule,
  getContactById,
  getContactByPhone,
  getContactByEmail,
  ContactStatus,
  LifecycleStage,
  LeadStatusType,
  LeadRating,
  LeadPriority,
  ContactSource,
  PersonaType,
  BuyingRole,
} from './contacts'

// Re-export contact enums and functions
export {
  ContactStatus,
  LifecycleStage,
  LeadStatusType,
  LeadRating,
  LeadPriority,
  ContactSource,
  PersonaType,
  BuyingRole,
  contactStats,
  getContactById,
  getContactByPhone,
  getContactByEmail,
}

// ==================== TENANT DATA ====================
// This represents a test customer using Nexora CRM
export const currentTenant = {
  id: 'tenant-1',
  name: 'Helix Code Inc.',
  slug: 'helix-code',
  domain: '72orionx.com',
  status: 'ACTIVE',
  settings: {
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    currency: 'INR',
  },
  createdAt: '2024-01-01T00:00:00Z',
}

// ==================== USERS ====================
// Users within the test customer tenant (Helix Code Inc.)
export const users = [
  {
    id: 'user-1',
    tenantId: 'tenant-1',
    email: 'hello@72orionx.com',
    phone: '+91 9876543210',
    firstName: 'Helix',
    lastName: 'Admin',
    displayName: 'Helix Admin',
    avatarUrl: null,
    emailVerified: true,
    phoneVerified: true,
    mfaEnabled: false,
    settings: {
      notifications: { email: true, push: true, sms: false },
      theme: 'light',
    },
    status: 'ACTIVE',
    lastLoginAt: '2024-12-27T08:00:00Z',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-12-27T08:00:00Z',
  },
  {
    id: 'user-2',
    tenantId: 'tenant-1',
    email: 'april@72orionx.com',
    phone: '+91 9876543211',
    firstName: 'April',
    lastName: 'Manager',
    displayName: 'April Manager',
    avatarUrl: null,
    emailVerified: true,
    phoneVerified: false,
    mfaEnabled: false,
    settings: { theme: 'light' },
    status: 'ACTIVE',
    lastLoginAt: '2024-12-27T07:30:00Z',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-12-27T07:30:00Z',
  },
  {
    id: 'user-3',
    tenantId: 'tenant-1',
    email: 'support@72orionx.com',
    phone: '+91 9876543212',
    firstName: 'Support',
    lastName: 'Agent',
    displayName: 'Support Agent',
    avatarUrl: null,
    emailVerified: true,
    phoneVerified: false,
    mfaEnabled: false,
    settings: { theme: 'dark' },
    status: 'ACTIVE',
    lastLoginAt: '2024-12-26T18:00:00Z',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-12-26T18:00:00Z',
  },
]

// ==================== CONTACTS ====================
// Use full contacts from contacts.js (complete Prisma schema)
export const contacts = fullContacts

// ==================== COMPANIES ====================
export const companies = [
  {
    id: 'company-1',
    tenantId: 'tenant-1',
    name: 'TechCorp Inc.',
    domain: 'techcorp.com',
    industry: 'Technology',
    size: '100-500',
    revenue: 5000000,
    website: 'https://techcorp.com',
    phone: '+1 555-1000',
    address: {
      street: '123 Tech Blvd',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'USA',
    },
    status: 'ACTIVE',
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2024-12-27T08:30:00Z',
  },
  {
    id: 'company-2',
    tenantId: 'tenant-1',
    name: 'Startup.io',
    domain: 'startup.io',
    industry: 'SaaS',
    size: '10-50',
    website: 'https://startup.io',
    status: 'ACTIVE',
    createdAt: '2024-12-22T14:30:00Z',
    updatedAt: '2024-12-27T07:15:00Z',
  },
  {
    id: 'company-3',
    tenantId: 'tenant-1',
    name: 'Design Studio Co.',
    domain: 'designstudio.com',
    industry: 'Design',
    size: '10-50',
    website: 'https://designstudio.com',
    status: 'ACTIVE',
    createdAt: '2024-12-25T09:00:00Z',
    updatedAt: '2024-12-27T06:45:00Z',
  },
  {
    id: 'company-4',
    tenantId: 'tenant-1',
    name: 'Global Tech Ltd.',
    domain: 'globaltech.com',
    industry: 'Technology',
    size: '500-1000',
    revenue: 25000000,
    website: 'https://globaltech.com',
    phone: '+1 555-2000',
    address: {
      street: '100 Global Way',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
      country: 'USA',
    },
    status: 'ACTIVE',
    createdAt: '2024-10-15T11:00:00Z',
    updatedAt: '2024-12-26T16:20:00Z',
  },
  {
    id: 'company-5',
    tenantId: 'tenant-1',
    name: 'Innovate Co.',
    domain: 'innovate.co',
    industry: 'Consulting',
    size: '50-100',
    revenue: 8000000,
    website: 'https://innovate.co',
    phone: '+1 555-3000',
    address: {
      street: '200 Innovation Dr',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      country: 'USA',
    },
    status: 'ACTIVE',
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2024-12-27T09:00:00Z',
  },
  {
    id: 'company-6',
    tenantId: 'tenant-1',
    name: 'Enterprise Corp.',
    domain: 'enterprise.com',
    industry: 'Manufacturing',
    size: '1000+',
    revenue: 100000000,
    website: 'https://enterprise.com',
    phone: '+1 555-4000',
    status: 'ACTIVE',
    createdAt: '2024-12-20T10:00:00Z',
    updatedAt: '2024-12-27T10:00:00Z',
  },
  {
    id: 'company-7',
    tenantId: 'tenant-1',
    name: 'Agency Co.',
    domain: 'agency.co',
    industry: 'Marketing',
    size: '50-100',
    website: 'https://agency.co',
    phone: '+1 555-5000',
    status: 'ACTIVE',
    createdAt: '2024-12-15T10:00:00Z',
    updatedAt: '2024-12-27T08:00:00Z',
  },
]

// ==================== CHANNELS ====================
// Connected channels for the test customer (configurable after registration)
export const channels = [
  {
    id: 'channel-wa-1',
    tenantId: 'tenant-1',
    type: 'WHATSAPP',
    name: 'Business WhatsApp',
    providerAccountId: 'wa_acc_123',
    status: 'ACTIVE',
    config: {
      phoneNumber: '+91 9876543210',
      businessName: 'Helix Code Support',
    },
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'channel-email-1',
    tenantId: 'tenant-1',
    type: 'EMAIL',
    name: 'Support Email',
    status: 'ACTIVE',
    config: {
      email: 'hello@72orionx.com',
      smtpHost: 'smtp.hostinger.com',
    },
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'channel-sms-1',
    tenantId: 'tenant-1',
    type: 'SMS',
    name: 'SMS Channel',
    status: 'ACTIVE',
    config: {
      phoneNumber: '+91 9876543210',
    },
    createdAt: '2024-01-01T00:00:00Z',
  },
]

// ==================== CONVERSATIONS ====================
export const conversations = [
  {
    id: 'conv-1',
    tenantId: 'tenant-1',
    channelId: 'channel-wa-1',
    channelType: 'WHATSAPP',
    externalId: 'wa_conv_123',
    contactId: 'contact-1',
    contactPhone: '+1 555-0123',
    contactName: 'Sarah Johnson',
    contactEmail: 'sarah.johnson@techcorp.com',
    companyName: 'TechCorp Inc.',
    status: 'OPEN',
    priority: 'HIGH',
    assignedToId: 'user-1',
    assignedAt: '2024-12-20T10:00:00Z',
    lastCustomerMessageAt: '2024-12-27T08:30:00Z',
    windowExpiresAt: '2024-12-28T08:30:00Z',
    firstResponseAt: '2024-12-20T10:05:00Z',
    lastMessagePreview: 'Hi, I wanted to follow up on our conversation about the enterprise plan.',
    unreadCount: 3,
    messageCount: 12,
    tags: ['vip', 'enterprise'],
    createdAt: '2024-12-20T10:00:00Z',
    updatedAt: '2024-12-27T08:30:00Z',
    closedAt: null,
  },
  {
    id: 'conv-2',
    tenantId: 'tenant-1',
    channelId: 'channel-email-1',
    channelType: 'EMAIL',
    contactId: 'contact-2',
    contactPhone: '+1 555-0456',
    contactName: 'Michael Chen',
    contactEmail: 'm.chen@startup.io',
    companyName: 'Startup.io',
    status: 'PENDING',
    priority: 'MEDIUM',
    subject: 'Re: Product Demo Request',
    assignedToId: 'user-1',
    assignedAt: '2024-12-22T14:45:00Z',
    lastCustomerMessageAt: '2024-12-27T07:15:00Z',
    lastMessagePreview: 'Thanks for the demo yesterday. We have a few more questions about integrations.',
    unreadCount: 1,
    messageCount: 8,
    tags: ['demo', 'prospect'],
    createdAt: '2024-12-22T14:30:00Z',
    updatedAt: '2024-12-27T07:15:00Z',
  },
  {
    id: 'conv-3',
    tenantId: 'tenant-1',
    channelId: 'channel-sms-1',
    channelType: 'SMS',
    contactId: 'contact-3',
    contactPhone: '+1 555-0789',
    contactName: 'Emily Rodriguez',
    contactEmail: 'emily.r@designstudio.com',
    companyName: 'Design Studio Co.',
    status: 'OPEN',
    priority: 'LOW',
    assignedToId: 'user-2',
    lastCustomerMessageAt: '2024-12-27T06:45:00Z',
    lastMessagePreview: 'Got it, will review and get back to you soon!',
    unreadCount: 0,
    messageCount: 5,
    tags: ['follow-up'],
    createdAt: '2024-12-25T09:00:00Z',
    updatedAt: '2024-12-27T06:45:00Z',
  },
  {
    id: 'conv-4',
    tenantId: 'tenant-1',
    channelId: 'channel-wa-1',
    channelType: 'WHATSAPP',
    contactId: 'contact-4',
    contactPhone: '+1 555-0321',
    contactName: 'David Kim',
    contactEmail: 'david@globaltech.com',
    companyName: 'Global Tech Ltd.',
    status: 'RESOLVED',
    priority: 'MEDIUM',
    assignedToId: 'user-1',
    lastMessagePreview: 'Perfect, the issue has been resolved. Thank you for your help!',
    unreadCount: 0,
    messageCount: 15,
    tags: ['support', 'resolved'],
    createdAt: '2024-12-18T11:00:00Z',
    updatedAt: '2024-12-26T16:20:00Z',
    closedAt: '2024-12-26T16:20:00Z',
  },
  {
    id: 'conv-5',
    tenantId: 'tenant-1',
    channelId: 'channel-email-1',
    channelType: 'EMAIL',
    contactId: 'contact-5',
    contactPhone: '+1 555-0654',
    contactName: 'Lisa Thompson',
    contactEmail: 'lisa.t@innovate.co',
    companyName: 'Innovate Co.',
    status: 'OPEN',
    priority: 'HIGH',
    subject: 'Urgent: Billing Issue',
    assignedToId: null,
    lastCustomerMessageAt: '2024-12-27T09:00:00Z',
    lastMessagePreview: 'I noticed an incorrect charge on our last invoice. Can you please look into this?',
    unreadCount: 2,
    messageCount: 3,
    tags: ['billing', 'urgent'],
    createdAt: '2024-12-27T08:45:00Z',
    updatedAt: '2024-12-27T09:00:00Z',
  },
]

// ==================== MESSAGES (MessageEvent schema) ====================
export const messages = {
  'conv-1': [
    {
      id: 'msg-1-1',
      tenantId: 'tenant-1',
      threadId: 'conv-1',
      channelAccountId: 'channel-wa-1',
      channel: 'WHATSAPP',
      direction: 'INBOUND',
      providerMessageId: 'wa_msg_001',
      contentType: 'TEXT',
      textContent: "Hi there! I'm interested in learning more about your enterprise plan.",
      status: 'READ',
      sentAt: '2024-12-20T10:00:00Z',
      deliveredAt: '2024-12-20T10:00:05Z',
      readAt: '2024-12-20T10:01:00Z',
      senderName: 'Sarah Johnson',
      createdAt: '2024-12-20T10:00:00Z',
    },
    {
      id: 'msg-1-2',
      tenantId: 'tenant-1',
      threadId: 'conv-1',
      channelAccountId: 'channel-wa-1',
      channel: 'WHATSAPP',
      direction: 'OUTBOUND',
      providerMessageId: 'wa_msg_002',
      contentType: 'TEXT',
      textContent: "Hello Sarah! Thank you for reaching out. I'd be happy to tell you about our enterprise features. What specific aspects are you most interested in?",
      status: 'READ',
      sentAt: '2024-12-20T10:05:00Z',
      deliveredAt: '2024-12-20T10:05:02Z',
      readAt: '2024-12-20T10:06:00Z',
      senderName: 'John Doe',
      createdAt: '2024-12-20T10:05:00Z',
    },
    {
      id: 'msg-1-3',
      tenantId: 'tenant-1',
      threadId: 'conv-1',
      channelAccountId: 'channel-wa-1',
      channel: 'WHATSAPP',
      direction: 'INBOUND',
      contentType: 'TEXT',
      textContent: "We're mainly interested in the multi-tenant capabilities and API access. How many users can we add?",
      status: 'READ',
      sentAt: '2024-12-20T10:10:00Z',
      readAt: '2024-12-20T10:11:00Z',
      senderName: 'Sarah Johnson',
      createdAt: '2024-12-20T10:10:00Z',
    },
    {
      id: 'msg-1-4',
      tenantId: 'tenant-1',
      threadId: 'conv-1',
      channelAccountId: 'channel-wa-1',
      channel: 'WHATSAPP',
      direction: 'OUTBOUND',
      contentType: 'TEXT',
      textContent: 'Great questions! Our enterprise plan supports unlimited users with role-based access control. The API access includes full REST API with 10,000 requests per minute.',
      status: 'READ',
      sentAt: '2024-12-20T10:15:00Z',
      deliveredAt: '2024-12-20T10:15:02Z',
      readAt: '2024-12-20T10:16:00Z',
      senderName: 'John Doe',
      createdAt: '2024-12-20T10:15:00Z',
    },
    {
      id: 'msg-1-5',
      tenantId: 'tenant-1',
      threadId: 'conv-1',
      channelAccountId: 'channel-wa-1',
      channel: 'WHATSAPP',
      direction: 'INBOUND',
      contentType: 'TEXT',
      textContent: 'Hi, I wanted to follow up on our conversation about the enterprise plan.',
      status: 'DELIVERED',
      sentAt: '2024-12-27T08:30:00Z',
      deliveredAt: '2024-12-27T08:30:02Z',
      senderName: 'Sarah Johnson',
      createdAt: '2024-12-27T08:30:00Z',
    },
  ],
  'conv-2': [
    {
      id: 'msg-2-1',
      tenantId: 'tenant-1',
      threadId: 'conv-2',
      channelAccountId: 'channel-email-1',
      channel: 'EMAIL',
      direction: 'INBOUND',
      contentType: 'TEXT',
      subject: 'Product Demo Request',
      textContent: "Hello, I'd like to schedule a product demo for our team.",
      emailFrom: 'm.chen@startup.io',
      emailTo: ['support@nexora.com'],
      status: 'READ',
      sentAt: '2024-12-22T14:30:00Z',
      senderName: 'Michael Chen',
      createdAt: '2024-12-22T14:30:00Z',
    },
    {
      id: 'msg-2-2',
      tenantId: 'tenant-1',
      threadId: 'conv-2',
      channelAccountId: 'channel-email-1',
      channel: 'EMAIL',
      direction: 'OUTBOUND',
      contentType: 'TEXT',
      subject: 'Re: Product Demo Request',
      textContent: "Hi Michael! I'd be happy to arrange a demo. What time works best for you?",
      emailFrom: 'john@nexora.com',
      emailTo: ['m.chen@startup.io'],
      status: 'READ',
      sentAt: '2024-12-22T14:45:00Z',
      senderName: 'John Doe',
      createdAt: '2024-12-22T14:45:00Z',
    },
    {
      id: 'msg-2-3',
      tenantId: 'tenant-1',
      threadId: 'conv-2',
      channelAccountId: 'channel-email-1',
      channel: 'EMAIL',
      direction: 'INBOUND',
      contentType: 'TEXT',
      subject: 'Re: Product Demo Request',
      textContent: 'Thanks for the demo yesterday. We have a few more questions about integrations.',
      emailFrom: 'm.chen@startup.io',
      emailTo: ['support@nexora.com'],
      status: 'DELIVERED',
      sentAt: '2024-12-27T07:15:00Z',
      senderName: 'Michael Chen',
      createdAt: '2024-12-27T07:15:00Z',
    },
  ],
  'conv-3': [
    {
      id: 'msg-3-1',
      tenantId: 'tenant-1',
      threadId: 'conv-3',
      channelAccountId: 'channel-sms-1',
      channel: 'SMS',
      direction: 'OUTBOUND',
      contentType: 'TEXT',
      textContent: 'Hey, just checking in about the proposal I sent over.',
      status: 'READ',
      sentAt: '2024-12-25T09:00:00Z',
      senderName: 'John Doe',
      createdAt: '2024-12-25T09:00:00Z',
    },
    {
      id: 'msg-3-2',
      tenantId: 'tenant-1',
      threadId: 'conv-3',
      channelAccountId: 'channel-sms-1',
      channel: 'SMS',
      direction: 'INBOUND',
      contentType: 'TEXT',
      textContent: 'Got it, will review and get back to you soon!',
      status: 'READ',
      sentAt: '2024-12-27T06:45:00Z',
      senderName: 'Emily Rodriguez',
      createdAt: '2024-12-27T06:45:00Z',
    },
  ],
}

// ==================== TAGS ====================
export const tags = [
  { id: 'tag-1', tenantId: 'tenant-1', name: 'vip', color: '#FFD700', entityType: 'CONTACT' },
  { id: 'tag-2', tenantId: 'tenant-1', name: 'enterprise', color: '#8B5CF6', entityType: 'CONTACT' },
  { id: 'tag-3', tenantId: 'tenant-1', name: 'demo', color: '#3B82F6', entityType: 'CONTACT' },
  { id: 'tag-4', tenantId: 'tenant-1', name: 'prospect', color: '#10B981', entityType: 'CONTACT' },
  { id: 'tag-5', tenantId: 'tenant-1', name: 'follow-up', color: '#F59E0B', entityType: 'CONVERSATION' },
  { id: 'tag-6', tenantId: 'tenant-1', name: 'support', color: '#EF4444', entityType: 'CONVERSATION' },
  { id: 'tag-7', tenantId: 'tenant-1', name: 'resolved', color: '#6B7280', entityType: 'CONVERSATION' },
  { id: 'tag-8', tenantId: 'tenant-1', name: 'billing', color: '#EC4899', entityType: 'CONVERSATION' },
  { id: 'tag-9', tenantId: 'tenant-1', name: 'urgent', color: '#DC2626', entityType: 'CONVERSATION' },
]

// ==================== ACTIVITIES ====================
export const activities = [
  {
    id: 'activity-1',
    tenantId: 'tenant-1',
    type: 'EMAIL',
    subject: 'Follow-up proposal sent',
    description: 'Sent enterprise pricing proposal to Sarah Johnson',
    contactId: 'contact-1',
    companyId: 'company-1',
    dealId: 'deal-1',
    assignedToId: 'user-1',
    createdById: 'user-1',
    completedAt: '2024-12-26T10:00:00Z',
    createdAt: '2024-12-26T10:00:00Z',
    updatedAt: '2024-12-26T10:00:00Z',
  },
  {
    id: 'activity-2',
    tenantId: 'tenant-1',
    type: 'CALL',
    subject: 'Discovery call',
    description: '15 min discovery call with Michael Chen',
    contactId: 'contact-2',
    companyId: 'company-2',
    callDuration: 900,
    callOutcome: 'CONNECTED',
    assignedToId: 'user-1',
    createdById: 'user-1',
    completedAt: '2024-12-25T14:15:00Z',
    createdAt: '2024-12-25T14:00:00Z',
    updatedAt: '2024-12-25T14:15:00Z',
  },
  {
    id: 'activity-3',
    tenantId: 'tenant-1',
    type: 'MEETING',
    subject: 'Product demo',
    description: 'Product demo for Startup.io team',
    contactId: 'contact-2',
    companyId: 'company-2',
    meetingUrl: 'https://meet.nexora.com/demo-123',
    meetingLocation: null,
    attendees: ['m.chen@startup.io', 'john@nexora.com'],
    assignedToId: 'user-1',
    createdById: 'user-1',
    completedAt: '2024-12-26T16:00:00Z',
    createdAt: '2024-12-26T15:00:00Z',
    updatedAt: '2024-12-26T16:00:00Z',
  },
  {
    id: 'activity-4',
    tenantId: 'tenant-1',
    type: 'NOTE',
    subject: 'Customer preference noted',
    description: 'Customer prefers email communication over phone calls',
    contactId: 'contact-1',
    createdById: 'user-2',
    createdAt: '2024-12-25T10:00:00Z',
    updatedAt: '2024-12-25T10:00:00Z',
  },
]

// ==================== DEALS ====================
export const deals = [
  {
    id: 'deal-1',
    tenantId: 'tenant-1',
    title: 'TechCorp Enterprise Deal',
    contactId: 'contact-1',
    companyId: 'company-1',
    pipelineId: 'pipeline-1',
    stageId: 'stage-4',
    value: 50000,
    currency: 'USD',
    probability: 75,
    expectedCloseDate: '2025-01-15',
    ownerId: 'user-1',
    status: 'OPEN',
    lostReason: null,
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-27T08:30:00Z',
  },
  {
    id: 'deal-2',
    tenantId: 'tenant-1',
    title: 'Startup.io Professional',
    contactId: 'contact-2',
    companyId: 'company-2',
    pipelineId: 'pipeline-1',
    stageId: 'stage-3',
    value: 15000,
    currency: 'USD',
    probability: 50,
    expectedCloseDate: '2025-01-30',
    ownerId: 'user-1',
    status: 'OPEN',
    createdAt: '2024-12-22T14:30:00Z',
    updatedAt: '2024-12-27T07:15:00Z',
  },
]

// ==================== PIPELINES ====================
export const pipelines = [
  {
    id: 'pipeline-1',
    tenantId: 'tenant-1',
    name: 'Sales Pipeline',
    isDefault: true,
    stages: [
      { id: 'stage-1', name: 'Lead', order: 1, color: '#6B7280', probability: 10 },
      { id: 'stage-2', name: 'Qualified', order: 2, color: '#3B82F6', probability: 25 },
      { id: 'stage-3', name: 'Demo', order: 3, color: '#8B5CF6', probability: 40 },
      { id: 'stage-4', name: 'Proposal', order: 4, color: '#F59E0B', probability: 60 },
      { id: 'stage-5', name: 'Negotiation', order: 5, color: '#EF4444', probability: 80 },
      { id: 'stage-6', name: 'Closed Won', order: 6, color: '#10B981', probability: 100 },
      { id: 'stage-7', name: 'Closed Lost', order: 7, color: '#DC2626', probability: 0 },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

// ==================== EMAIL ACCOUNTS ====================
// Connected email accounts for unified inbox
export const emailAccounts = [
  {
    id: 'email-acc-1',
    tenantId: 'tenant-1',
    userId: 'user-1',
    email: 'john@nexora.com',
    displayName: 'John Doe',
    provider: 'GMAIL',
    authType: 'oauth',
    status: 'ACTIVE',
    isDefault: true,
    syncEnabled: true,
    lastSyncAt: '2024-12-27T08:00:00Z',
    syncFolders: ['INBOX', 'SENT', 'DRAFTS'],
    signature: 'Best regards,\nJohn Doe\nSales Manager',
    stats: {
      sent: 156,
      received: 432,
      unread: 12,
    },
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2024-12-27T08:00:00Z',
  },
  {
    id: 'email-acc-2',
    tenantId: 'tenant-1',
    userId: 'user-1',
    email: 'john.doe@outlook.com',
    displayName: 'John (Personal)',
    provider: 'OUTLOOK',
    authType: 'oauth',
    status: 'ACTIVE',
    isDefault: false,
    syncEnabled: true,
    lastSyncAt: '2024-12-27T07:45:00Z',
    syncFolders: ['INBOX', 'SENT'],
    stats: {
      sent: 45,
      received: 128,
      unread: 3,
    },
    createdAt: '2024-09-20T14:00:00Z',
    updatedAt: '2024-12-27T07:45:00Z',
  },
]

// Available email providers for connection
export const emailProviders = [
  {
    id: 'google',
    name: 'Google',
    description: 'Gmail and Google Workspace',
    icon: 'gmail',
    color: '#EA4335',
    authType: 'oauth',
    domains: ['gmail.com', 'googlemail.com'],
    popular: true,
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    description: 'Outlook, Hotmail, Office 365',
    icon: 'outlook',
    color: '#0078D4',
    authType: 'oauth',
    domains: ['outlook.com', 'hotmail.com', 'live.com'],
    popular: true,
  },
  {
    id: 'yahoo',
    name: 'Yahoo',
    description: 'Yahoo Mail',
    icon: 'yahoo',
    color: '#6001D2',
    authType: 'password',
    requiresAppPassword: true,
    domains: ['yahoo.com', 'ymail.com'],
    popular: true,
  },
  {
    id: 'zoho',
    name: 'Zoho',
    description: 'Zoho Mail',
    icon: 'zoho',
    color: '#F9B21D',
    authType: 'password',
    requiresAppPassword: true,
    domains: ['zoho.com', 'zohomail.com'],
  },
  {
    id: 'icloud',
    name: 'iCloud',
    description: 'Apple iCloud Mail',
    icon: 'apple',
    color: '#000000',
    authType: 'password',
    requiresAppPassword: true,
    domains: ['icloud.com', 'me.com', 'mac.com'],
  },
  {
    id: 'other',
    name: 'Other Email',
    description: 'Any other email provider (IMAP/SMTP)',
    icon: 'mail',
    color: '#6B7280',
    authType: 'password',
    domains: [],
  },
]

// ==================== TEMPLATES ====================
export const templates = [
  {
    id: 'tpl-1',
    tenantId: 'tenant-1',
    channelId: 'channel-wa-1',
    name: 'welcome_message',
    externalId: 'wa_tpl_welcome',
    category: 'MARKETING',
    language: 'en',
    headerType: 'TEXT',
    headerContent: 'Welcome to Nexora!',
    bodyContent: 'Hello {{1}}! Welcome to Nexora. We are excited to have you on board. How can we help you today?',
    footerContent: 'Reply STOP to opt out',
    variables: ['name'],
    status: 'APPROVED',
    sentCount: 150,
    deliveredCount: 145,
    readCount: 120,
    createdAt: '2024-01-15T00:00:00Z',
    approvedAt: '2024-01-16T00:00:00Z',
  },
  {
    id: 'tpl-2',
    tenantId: 'tenant-1',
    channelId: 'channel-wa-1',
    name: 'order_confirmation',
    externalId: 'wa_tpl_order',
    category: 'UTILITY',
    language: 'en',
    bodyContent: 'Hi {{1}}, your order #{{2}} has been confirmed. Expected delivery: {{3}}. Track at {{4}}',
    variables: ['name', 'orderNumber', 'deliveryDate', 'trackingUrl'],
    status: 'APPROVED',
    sentCount: 500,
    deliveredCount: 495,
    readCount: 480,
    createdAt: '2024-02-01T00:00:00Z',
    approvedAt: '2024-02-02T00:00:00Z',
  },
]

// ==================== SIGNATURES ====================
export const signatures = {
  email: [
    { id: 'sig-e-1', name: 'Default', content: '\n\nBest regards,\nJohn Doe\nSales Manager\nNexora Inc.' },
    { id: 'sig-e-2', name: 'Formal', content: '\n\nSincerely,\nJohn Doe\nSales Manager | Nexora Inc.\nPhone: +1 234 567 890\nEmail: john@nexora.com' },
    { id: 'sig-e-3', name: 'Casual', content: '\n\nCheers,\nJohn' },
    { id: 'sig-e-4', name: 'No Signature', content: '' },
  ],
  whatsapp: [
    { id: 'sig-w-1', name: 'Default', content: '\n- John, Nexora' },
    { id: 'sig-w-2', name: 'Professional', content: '\n\nJohn Doe | Sales Manager\nNexora Inc. | +1 234 567 890' },
    { id: 'sig-w-3', name: 'Simple', content: '\n- John' },
    { id: 'sig-w-4', name: 'No Signature', content: '' },
  ],
  sms: [
    { id: 'sig-s-1', name: 'Default', content: '\n- John, Nexora' },
    { id: 'sig-s-2', name: 'Simple', content: '\n- John' },
    { id: 'sig-s-3', name: 'No Signature', content: '' },
  ],
}

// ==================== CANNED RESPONSES ====================
export const cannedResponses = [
  { id: 'canned-1', tenantId: 'tenant-1', title: 'Greeting', shortcut: '/hello', content: 'Hello! Thank you for reaching out. How can I assist you today?', category: 'general' },
  { id: 'canned-2', tenantId: 'tenant-1', title: 'Demo Schedule', shortcut: '/demo', content: "I'd be happy to schedule a demo for you. Our available slots this week are:\n- Tuesday 2:00 PM\n- Wednesday 10:00 AM\n- Thursday 3:00 PM\n\nWhich time works best for you?", category: 'sales' },
  { id: 'canned-3', tenantId: 'tenant-1', title: 'Follow Up', shortcut: '/followup', content: "Hi! Just checking in to see if you had any questions about our previous conversation. I'm here to help!", category: 'sales' },
  { id: 'canned-4', tenantId: 'tenant-1', title: 'Thank You', shortcut: '/thanks', content: 'Thank you for your time today! If you have any other questions, feel free to reach out anytime.', category: 'general' },
  { id: 'canned-5', tenantId: 'tenant-1', title: 'Pricing Info', shortcut: '/pricing', content: 'Our pricing plans start at $29/month for Starter, $79/month for Professional, and custom pricing for Enterprise. Would you like me to send you a detailed comparison?', category: 'sales' },
]

// ==================== DASHBOARD STATS ====================
export const dashboardStats = {
  inbox: {
    totalConversations: 156,
    openConversations: 24,
    pendingConversations: 12,
    resolvedToday: 18,
    avgResponseTime: '2m 30s',
    avgResponseTimeSeconds: 150,
    channelBreakdown: {
      whatsapp: { count: 45, percentage: 45 },
      email: { count: 35, percentage: 35 },
      sms: { count: 15, percentage: 15 },
      voice: { count: 5, percentage: 5 },
    },
  },
  contacts: {
    total: 1250,
    newThisMonth: 85,
    newThisWeek: 23,
    activeLeads: 320,
    qualifiedLeads: 145,
    customers: 280,
  },
  deals: {
    total: 45,
    totalValue: 485000,
    openDeals: 28,
    openValue: 325000,
    closedThisMonth: 8,
    closedValue: 45000,
    avgDealSize: 11000,
    winRate: 65,
  },
  activities: {
    completedToday: 12,
    overdueCount: 3,
    upcomingCount: 8,
  },
  revenue: {
    thisMonth: 45000,
    lastMonth: 38000,
    growthPercent: 18.4,
    mrr: 125000,
    arr: 1500000,
  },
}

// ==================== API SIMULATION FUNCTIONS ====================
// These functions simulate API responses. Replace with actual API calls later.

export const getConversations = async (params = {}) => {
  await simulateDelay()
  let result = [...conversations]

  if (params.status) {
    result = result.filter(c => c.status === params.status)
  }
  if (params.channelType) {
    result = result.filter(c => c.channelType === params.channelType)
  }
  if (params.assignedToId) {
    result = result.filter(c => c.assignedToId === params.assignedToId)
  }
  if (params.search) {
    const search = params.search.toLowerCase()
    result = result.filter(c =>
      c.contactName?.toLowerCase().includes(search) ||
      c.lastMessagePreview?.toLowerCase().includes(search)
    )
  }

  return { success: true, data: result }
}

export const getMessages = async (conversationId) => {
  await simulateDelay()
  const convMessages = messages[conversationId] || []
  // Transform to match expected format
  return convMessages.map(msg => ({
    ...msg,
    content: msg.textContent,
    direction: msg.direction.toLowerCase(),
    status: msg.status.toLowerCase(),
  }))
}

// Use the full getContacts from contacts.js with all filtering capabilities
export const getContacts = getContactsFromModule

export const getDeals = async (params = {}) => {
  await simulateDelay()
  return { success: true, data: deals }
}

export const getActivities = async (params = {}) => {
  await simulateDelay()
  return { success: true, data: activities }
}

export const getDashboardStats = async () => {
  await simulateDelay()
  return { success: true, data: dashboardStats }
}

export const getCurrentUser = async () => {
  await simulateDelay(100)
  return { success: true, data: users[0] }
}

// ==================== CONVERSATION + CONTACT HELPERS ====================

// Get the full contact object for a conversation
export const getContactForConversation = async (conversationId) => {
  await simulateDelay(100)
  const conversation = conversations.find(c => c.id === conversationId)
  if (!conversation?.contactId) {
    return { success: false, data: null }
  }
  const contact = fullContacts.find(c => c.id === conversation.contactId)
  return { success: true, data: contact || null }
}

// Get contact by ID with full details
export const getFullContactById = async (contactId) => {
  await simulateDelay(100)
  const contact = fullContacts.find(c => c.id === contactId)
  if (!contact) {
    return { success: false, error: 'Contact not found' }
  }
  // Include company data
  const company = contact.companyId ? companies.find(c => c.id === contact.companyId) : null
  // Include owner data
  const owner = contact.ownerId ? users.find(u => u.id === contact.ownerId) : null
  return {
    success: true,
    data: {
      ...contact,
      company,
      owner,
    }
  }
}

// Get company by ID
export const getCompanyById = async (companyId) => {
  await simulateDelay(100)
  const company = companies.find(c => c.id === companyId)
  return { success: true, data: company || null }
}

// Get user by ID
export const getUserById = async (userId) => {
  await simulateDelay(100)
  const user = users.find(u => u.id === userId)
  return { success: true, data: user || null }
}

// Get all conversations for a contact
export const getConversationsForContact = async (contactId) => {
  await simulateDelay()
  const result = conversations.filter(c => c.contactId === contactId)
  return { success: true, data: result }
}

// Get all deals for a contact
export const getDealsForContact = async (contactId) => {
  await simulateDelay()
  const result = deals.filter(d => d.contactId === contactId)
  return { success: true, data: result }
}

// Get all activities for a contact
export const getActivitiesForContact = async (contactId) => {
  await simulateDelay()
  const result = activities.filter(a => a.contactId === contactId)
  return { success: true, data: result }
}

// Helper function to simulate network delay
const simulateDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// ==================== EMAIL ACCOUNT FUNCTIONS ====================

export const getEmailAccounts = async () => {
  await simulateDelay()
  return { success: true, data: emailAccounts }
}

export const getEmailProviders = async () => {
  await simulateDelay(100)
  return { success: true, data: emailProviders }
}

export const connectEmailOAuth = async (provider, token) => {
  await simulateDelay(1500) // Simulate OAuth flow
  const newAccount = {
    id: `email-acc-${Date.now()}`,
    tenantId: 'tenant-1',
    userId: 'user-1',
    email: `user@${provider.toLowerCase()}.com`,
    displayName: 'New Account',
    provider: provider.toUpperCase(),
    authType: 'oauth',
    status: 'ACTIVE',
    isDefault: emailAccounts.length === 0,
    syncEnabled: true,
    lastSyncAt: new Date().toISOString(),
    syncFolders: ['INBOX', 'SENT'],
    stats: { sent: 0, received: 0, unread: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  emailAccounts.push(newAccount)
  return { success: true, data: newAccount }
}

export const connectEmailIMAP = async (data) => {
  await simulateDelay(2000) // Simulate connection test
  const newAccount = {
    id: `email-acc-${Date.now()}`,
    tenantId: 'tenant-1',
    userId: 'user-1',
    email: data.email,
    displayName: data.displayName || data.email.split('@')[0],
    provider: 'IMAP',
    authType: 'password',
    status: 'ACTIVE',
    isDefault: emailAccounts.length === 0,
    syncEnabled: true,
    lastSyncAt: new Date().toISOString(),
    syncFolders: ['INBOX', 'SENT'],
    stats: { sent: 0, received: 0, unread: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  emailAccounts.push(newAccount)
  return { success: true, data: newAccount }
}

export const disconnectEmailAccount = async (accountId) => {
  await simulateDelay()
  const index = emailAccounts.findIndex(a => a.id === accountId)
  if (index > -1) {
    emailAccounts.splice(index, 1)
  }
  return { success: true }
}

export const updateEmailAccount = async (accountId, updates) => {
  await simulateDelay()
  const account = emailAccounts.find(a => a.id === accountId)
  if (account) {
    Object.assign(account, updates)
  }
  return { success: true, data: account }
}

export const syncEmailAccount = async (accountId) => {
  await simulateDelay(2000)
  const account = emailAccounts.find(a => a.id === accountId)
  if (account) {
    account.lastSyncAt = new Date().toISOString()
    account.stats.received += Math.floor(Math.random() * 5)
  }
  return { success: true, data: account }
}

// Export all data as a single object for convenience
export const mockData = {
  tenant: currentTenant,
  users,
  contacts,
  companies,
  channels,
  conversations,
  messages,
  tags,
  activities,
  deals,
  pipelines,
  templates,
  signatures,
  cannedResponses,
  dashboardStats,
  emailAccounts,
  emailProviders,
}

export default mockData
