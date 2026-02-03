/**
 * Contacts Mock Data
 *
 * This file contains mock data that EXACTLY matches the Prisma Contact schema.
 * When ready for production, replace imports with actual API calls.
 *
 * Schema Reference: packages/database/prisma/schema.prisma - Contact model
 */

// ==================== ENUMS (Match Prisma exactly) ====================

export const ContactStatus = {
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
  DELETED: 'DELETED',
}

export const LifecycleStage = {
  SUBSCRIBER: 'SUBSCRIBER',
  LEAD: 'LEAD',
  MQL: 'MQL',           // Marketing Qualified Lead
  SQL: 'SQL',           // Sales Qualified Lead
  OPPORTUNITY: 'OPPORTUNITY',
  CUSTOMER: 'CUSTOMER',
  EVANGELIST: 'EVANGELIST',
  OTHER: 'OTHER',
}

export const LeadStatusType = {
  NEW: 'NEW',
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  OPEN_DEAL: 'OPEN_DEAL',
  UNQUALIFIED: 'UNQUALIFIED',
  ATTEMPTED_TO_CONTACT: 'ATTEMPTED_TO_CONTACT',
  CONNECTED: 'CONNECTED',
  BAD_TIMING: 'BAD_TIMING',
}

export const LeadRating = {
  HOT: 'HOT',
  WARM: 'WARM',
  COLD: 'COLD',
}

export const LeadPriority = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
}

export const ContactSource = {
  WEBSITE: 'WEBSITE',
  REFERRAL: 'REFERRAL',
  LINKEDIN: 'LINKEDIN',
  TRADE_SHOW: 'TRADE_SHOW',
  COLD_CALL: 'COLD_CALL',
  ADVERTISEMENT: 'ADVERTISEMENT',
  PARTNER: 'PARTNER',
  ORGANIC: 'ORGANIC',
  SOCIAL_MEDIA: 'SOCIAL_MEDIA',
  EMAIL_CAMPAIGN: 'EMAIL_CAMPAIGN',
  WEBINAR: 'WEBINAR',
  OTHER: 'OTHER',
}

export const PersonaType = {
  DECISION_MAKER: 'Decision Maker',
  INFLUENCER: 'Influencer',
  USER: 'User',
  GATEKEEPER: 'Gatekeeper',
  CHAMPION: 'Champion',
  EXECUTIVE_SPONSOR: 'Executive Sponsor',
}

export const BuyingRole = {
  CHAMPION: 'Champion',
  BUDGET_HOLDER: 'Budget Holder',
  END_USER: 'End User',
  TECHNICAL_BUYER: 'Technical Buyer',
  ECONOMIC_BUYER: 'Economic Buyer',
  BLOCKER: 'Blocker',
}

// ==================== CONTACTS DATA (Match Prisma schema exactly) ====================

export const contacts = [
  {
    // ========== CORE FIELDS ==========
    id: 'contact-1',
    tenantId: 'tenant-1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    displayName: 'Sarah Johnson',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 555-0123',
    additionalEmails: ['s.johnson@gmail.com'],
    additionalPhones: ['+1 555-0124'],
    companyId: 'company-1',
    jobTitle: 'VP of Operations',
    linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
    twitterUrl: 'https://twitter.com/sarahj',
    marketingConsent: true,
    whatsappConsent: true,
    consentUpdatedAt: '2024-06-15T10:00:00Z',
    source: 'WEBSITE',
    sourceDetails: { campaign: 'enterprise-landing', utmSource: 'google', utmMedium: 'cpc' },
    ownerId: 'user-1',
    status: 'ACTIVE',
    customFields: {
      industry: 'Technology',
      companySize: '100-500',
      preferredContact: 'email',
      timezone: 'America/New_York',
    },
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2024-12-27T08:30:00Z',
    lastActivityAt: '2024-12-27T08:30:00Z',

    // ========== LIFECYCLE & LEAD FIELDS ==========
    lifecycleStage: 'OPPORTUNITY',
    leadStatus: 'OPEN_DEAL',
    leadScore: 85,
    leadScoreUpdatedAt: '2024-12-26T10:00:00Z',
    becameLeadAt: '2024-06-15T10:00:00Z',
    becameMqlAt: '2024-07-01T10:00:00Z',
    becameSqlAt: '2024-08-15T10:00:00Z',
    becameOpportunityAt: '2024-10-01T10:00:00Z',
    becameCustomerAt: null,
    contactUnworked: false,
    personaType: 'Decision Maker',
    buyingRole: 'Budget Holder',
    isQualified: true,
    qualifiedDate: '2024-08-15T10:00:00Z',
    disqualificationReason: null,

    // ========== LEAD RATING & PRIORITY ==========
    rating: 'HOT',
    priority: 'HIGH',
    likelihoodToClose: 75,
    expectedRevenue: 50000,

    // ========== ENGAGEMENT TRACKING ==========
    firstOutreachDate: '2024-06-16T09:00:00Z',
    lastContactedDate: '2024-12-26T10:00:00Z',
    lastEngagementDate: '2024-12-27T08:30:00Z',
    lastEngagementType: 'WhatsApp',
    leadResponseTime: 3600000, // 1 hour in ms
    emailCount: 15,
    callCount: 8,
    meetingCount: 4,
    outreachCount: 27,
    nextActivityDate: '2024-12-30T14:00:00Z',
    nextActivityType: 'Meeting',
    followUpDate: '2024-12-28T10:00:00Z',

    // ========== ATTRIBUTION & CAMPAIGNS ==========
    referredBy: null,
    campaign: 'Q4 Enterprise Push',
    medium: 'cpc',
    adCampaign: 'Google Ads - Enterprise',
    territory: 'West Coast',
    segment: 'Enterprise',

    // ========== SEQUENCE & AUTOMATION ==========
    inSequence: false,
    sequenceName: null,
    workflowStatus: 'Active Deal',

    // ========== TARGET ACCOUNT (ABM) ==========
    isTargetAccount: true,

    // ========== PERSONAL INFORMATION ==========
    salutation: 'Ms.',
    middleName: null,
    suffix: null,
    preferredName: 'Sarah',
    dateOfBirth: '1985-03-15',
    gender: 'Female',

    // ========== WORK INFORMATION ==========
    department: 'Operations',
    reportsToId: null,
    assistantName: 'Mike Chen',
    assistantPhone: '+1 555-0125',
    assistantEmail: 'mike.chen@techcorp.com',

    // ========== ADDITIONAL PHONE NUMBERS ==========
    mobilePhone: '+1 555-0126',
    homePhone: null,
    fax: null,
    otherPhone: null,

    // ========== ANALYTICS & TRACKING ==========
    originalSource: 'Google Ads',
    firstConversionDate: '2024-06-15T10:00:00Z',
    lastConversionDate: '2024-08-01T14:00:00Z',
    numberOfConversions: 3,
    pageViews: 45,
    lastPageSeen: '/pricing',
    firstPageSeen: '/enterprise',
    numberOfTimesContacted: 27,
    daysToClose: null,

    // ========== COMMUNICATION PREFERENCES ==========
    doNotCall: false,
    emailOptOut: false,
    preferredLanguage: 'en',
    preferredContactMethod: 'Email',

    // ========== ADDITIONAL SOCIAL PROFILES ==========
    facebookUrl: null,
    instagramUrl: null,
    websiteUrl: 'https://techcorp.com',

    // ========== BILLING (GST) ==========
    gstin: null,
    billingAddress: '123 Tech Blvd',
    billingCity: 'San Francisco',
    billingState: 'California',
    billingStateCode: 'CA',
    billingPincode: '94102',
    shippingAddress: null,
    shippingCity: null,
    shippingState: null,
    shippingStateCode: null,
    shippingPincode: null,

    // ========== RELATIONS (IDs for reference) ==========
    tags: ['vip', 'enterprise', 'high-value'],
    dealIds: ['deal-1'],
    activityIds: ['activity-1', 'activity-4'],
    conversationIds: ['conv-1'],
  },

  {
    id: 'contact-2',
    tenantId: 'tenant-1',
    firstName: 'Michael',
    lastName: 'Chen',
    displayName: 'Michael Chen',
    email: 'm.chen@startup.io',
    phone: '+1 555-0456',
    additionalEmails: [],
    additionalPhones: [],
    companyId: 'company-2',
    jobTitle: 'CTO',
    linkedinUrl: 'https://linkedin.com/in/michaelchen',
    twitterUrl: null,
    marketingConsent: true,
    whatsappConsent: false,
    consentUpdatedAt: '2024-12-22T14:30:00Z',
    source: 'REFERRAL',
    sourceDetails: { referrer: 'contact-1', referrerName: 'Sarah Johnson' },
    ownerId: 'user-1',
    status: 'ACTIVE',
    customFields: {
      industry: 'SaaS',
      companySize: '10-50',
      techStack: ['React', 'Node.js', 'PostgreSQL'],
    },
    createdAt: '2024-12-22T14:30:00Z',
    updatedAt: '2024-12-27T07:15:00Z',
    lastActivityAt: '2024-12-27T07:15:00Z',

    lifecycleStage: 'SQL',
    leadStatus: 'IN_PROGRESS',
    leadScore: 72,
    leadScoreUpdatedAt: '2024-12-26T09:00:00Z',
    becameLeadAt: '2024-12-22T14:30:00Z',
    becameMqlAt: '2024-12-23T10:00:00Z',
    becameSqlAt: '2024-12-25T11:00:00Z',
    becameOpportunityAt: null,
    becameCustomerAt: null,
    contactUnworked: false,
    personaType: 'Technical Buyer',
    buyingRole: 'Technical Buyer',
    isQualified: true,
    qualifiedDate: '2024-12-25T11:00:00Z',
    disqualificationReason: null,

    rating: 'WARM',
    priority: 'MEDIUM',
    likelihoodToClose: 50,
    expectedRevenue: 15000,

    firstOutreachDate: '2024-12-22T15:00:00Z',
    lastContactedDate: '2024-12-26T15:00:00Z',
    lastEngagementDate: '2024-12-27T07:15:00Z',
    lastEngagementType: 'Email',
    leadResponseTime: 1800000, // 30 mins
    emailCount: 5,
    callCount: 2,
    meetingCount: 1,
    outreachCount: 8,
    nextActivityDate: '2024-12-28T10:00:00Z',
    nextActivityType: 'Call',
    followUpDate: '2024-12-28T10:00:00Z',

    referredBy: 'contact-1',
    campaign: 'Referral Program',
    medium: 'referral',
    adCampaign: null,
    territory: 'West Coast',
    segment: 'SMB',

    inSequence: true,
    sequenceName: 'New Lead Nurture',
    workflowStatus: 'In Sequence',

    isTargetAccount: false,

    salutation: 'Mr.',
    middleName: null,
    suffix: null,
    preferredName: 'Mike',
    dateOfBirth: null,
    gender: 'Male',

    department: 'Engineering',
    reportsToId: null,
    assistantName: null,
    assistantPhone: null,
    assistantEmail: null,

    mobilePhone: '+1 555-0457',
    homePhone: null,
    fax: null,
    otherPhone: null,

    originalSource: 'Referral',
    firstConversionDate: '2024-12-22T14:30:00Z',
    lastConversionDate: '2024-12-22T14:30:00Z',
    numberOfConversions: 1,
    pageViews: 12,
    lastPageSeen: '/features',
    firstPageSeen: '/pricing',
    numberOfTimesContacted: 8,
    daysToClose: null,

    doNotCall: false,
    emailOptOut: false,
    preferredLanguage: 'en',
    preferredContactMethod: 'Email',

    facebookUrl: null,
    instagramUrl: null,
    websiteUrl: 'https://startup.io',

    gstin: null,
    billingAddress: '456 Startup Ave',
    billingCity: 'Palo Alto',
    billingState: 'California',
    billingStateCode: 'CA',
    billingPincode: '94301',
    shippingAddress: null,
    shippingCity: null,
    shippingState: null,
    shippingStateCode: null,
    shippingPincode: null,

    tags: ['demo', 'prospect', 'referral'],
    dealIds: ['deal-2'],
    activityIds: ['activity-2', 'activity-3'],
    conversationIds: ['conv-2'],
  },

  {
    id: 'contact-3',
    tenantId: 'tenant-1',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    displayName: 'Emily Rodriguez',
    email: 'emily.r@designstudio.com',
    phone: '+1 555-0789',
    additionalEmails: ['emily.rodriguez@gmail.com'],
    additionalPhones: [],
    companyId: 'company-3',
    jobTitle: 'Creative Director',
    linkedinUrl: 'https://linkedin.com/in/emilyrodriguez',
    twitterUrl: 'https://twitter.com/emilydesigns',
    marketingConsent: true,
    whatsappConsent: true,
    consentUpdatedAt: '2024-12-25T09:00:00Z',
    source: 'LINKEDIN',
    sourceDetails: { linkedinCampaign: 'Design Leaders 2024' },
    ownerId: 'user-2',
    status: 'ACTIVE',
    customFields: {
      industry: 'Design',
      companySize: '10-50',
      specialization: 'Brand Design',
    },
    createdAt: '2024-12-25T09:00:00Z',
    updatedAt: '2024-12-27T06:45:00Z',
    lastActivityAt: '2024-12-27T06:45:00Z',

    lifecycleStage: 'LEAD',
    leadStatus: 'OPEN',
    leadScore: 45,
    leadScoreUpdatedAt: '2024-12-26T08:00:00Z',
    becameLeadAt: '2024-12-25T09:00:00Z',
    becameMqlAt: null,
    becameSqlAt: null,
    becameOpportunityAt: null,
    becameCustomerAt: null,
    contactUnworked: false,
    personaType: 'Influencer',
    buyingRole: 'End User',
    isQualified: false,
    qualifiedDate: null,
    disqualificationReason: null,

    rating: 'COLD',
    priority: 'LOW',
    likelihoodToClose: 20,
    expectedRevenue: 5000,

    firstOutreachDate: '2024-12-25T10:00:00Z',
    lastContactedDate: '2024-12-25T10:00:00Z',
    lastEngagementDate: '2024-12-27T06:45:00Z',
    lastEngagementType: 'SMS',
    leadResponseTime: 7200000, // 2 hours
    emailCount: 1,
    callCount: 0,
    meetingCount: 0,
    outreachCount: 2,
    nextActivityDate: null,
    nextActivityType: null,
    followUpDate: '2024-12-30T10:00:00Z',

    referredBy: null,
    campaign: 'LinkedIn Outreach',
    medium: 'social',
    adCampaign: null,
    territory: 'East Coast',
    segment: 'SMB',

    inSequence: true,
    sequenceName: 'Cold Lead Nurture',
    workflowStatus: 'In Sequence',

    isTargetAccount: false,

    salutation: 'Ms.',
    middleName: 'Grace',
    suffix: null,
    preferredName: 'Emily',
    dateOfBirth: '1990-07-22',
    gender: 'Female',

    department: 'Creative',
    reportsToId: null,
    assistantName: null,
    assistantPhone: null,
    assistantEmail: null,

    mobilePhone: '+1 555-0790',
    homePhone: null,
    fax: null,
    otherPhone: null,

    originalSource: 'LinkedIn',
    firstConversionDate: '2024-12-25T09:00:00Z',
    lastConversionDate: '2024-12-25T09:00:00Z',
    numberOfConversions: 1,
    pageViews: 5,
    lastPageSeen: '/about',
    firstPageSeen: '/home',
    numberOfTimesContacted: 2,
    daysToClose: null,

    doNotCall: false,
    emailOptOut: false,
    preferredLanguage: 'en',
    preferredContactMethod: 'SMS',

    facebookUrl: 'https://facebook.com/emilyrodriguez',
    instagramUrl: 'https://instagram.com/emilydesigns',
    websiteUrl: 'https://emilyrodriguez.design',

    gstin: null,
    billingAddress: '789 Creative Lane',
    billingCity: 'New York',
    billingState: 'New York',
    billingStateCode: 'NY',
    billingPincode: '10001',
    shippingAddress: null,
    shippingCity: null,
    shippingState: null,
    shippingStateCode: null,
    shippingPincode: null,

    tags: ['follow-up', 'design', 'creative'],
    dealIds: [],
    activityIds: [],
    conversationIds: ['conv-3'],
  },

  {
    id: 'contact-4',
    tenantId: 'tenant-1',
    firstName: 'David',
    lastName: 'Kim',
    displayName: 'David Kim',
    email: 'david@globaltech.com',
    phone: '+1 555-0321',
    additionalEmails: ['d.kim@gmail.com'],
    additionalPhones: [],
    companyId: 'company-4',
    jobTitle: 'IT Director',
    linkedinUrl: 'https://linkedin.com/in/davidkim',
    twitterUrl: null,
    marketingConsent: true,
    whatsappConsent: true,
    consentUpdatedAt: '2024-12-01T10:00:00Z',
    source: 'TRADE_SHOW',
    sourceDetails: { event: 'TechConnect 2024', booth: 'A15' },
    ownerId: 'user-1',
    status: 'ACTIVE',
    customFields: {
      industry: 'Technology',
      companySize: '500-1000',
      itBudget: '$500K+',
    },
    createdAt: '2024-10-15T11:00:00Z',
    updatedAt: '2024-12-26T16:20:00Z',
    lastActivityAt: '2024-12-26T16:20:00Z',

    lifecycleStage: 'CUSTOMER',
    leadStatus: null,
    leadScore: 68,
    leadScoreUpdatedAt: '2024-12-01T10:00:00Z',
    becameLeadAt: '2024-10-15T11:00:00Z',
    becameMqlAt: '2024-10-20T10:00:00Z',
    becameSqlAt: '2024-11-01T10:00:00Z',
    becameOpportunityAt: '2024-11-15T10:00:00Z',
    becameCustomerAt: '2024-12-01T10:00:00Z',
    contactUnworked: false,
    personaType: 'Decision Maker',
    buyingRole: 'Budget Holder',
    isQualified: true,
    qualifiedDate: '2024-11-01T10:00:00Z',
    disqualificationReason: null,

    rating: 'HOT',
    priority: 'MEDIUM',
    likelihoodToClose: 100,
    expectedRevenue: 12000,

    firstOutreachDate: '2024-10-15T12:00:00Z',
    lastContactedDate: '2024-12-26T16:00:00Z',
    lastEngagementDate: '2024-12-26T16:20:00Z',
    lastEngagementType: 'WhatsApp',
    leadResponseTime: 1800000,
    emailCount: 20,
    callCount: 10,
    meetingCount: 5,
    outreachCount: 35,
    nextActivityDate: null,
    nextActivityType: null,
    followUpDate: null,

    referredBy: null,
    campaign: 'TechConnect 2024',
    medium: 'event',
    adCampaign: null,
    territory: 'West Coast',
    segment: 'Mid-Market',

    inSequence: false,
    sequenceName: null,
    workflowStatus: 'Customer',

    isTargetAccount: false,

    salutation: 'Mr.',
    middleName: 'Sung',
    suffix: null,
    preferredName: 'David',
    dateOfBirth: '1982-11-10',
    gender: 'Male',

    department: 'IT',
    reportsToId: null,
    assistantName: 'Lisa Park',
    assistantPhone: '+1 555-0322',
    assistantEmail: 'lisa.park@globaltech.com',

    mobilePhone: '+1 555-0323',
    homePhone: null,
    fax: '+1 555-0324',
    otherPhone: null,

    originalSource: 'Trade Show',
    firstConversionDate: '2024-10-15T11:00:00Z',
    lastConversionDate: '2024-11-15T14:00:00Z',
    numberOfConversions: 4,
    pageViews: 80,
    lastPageSeen: '/support',
    firstPageSeen: '/demo',
    numberOfTimesContacted: 35,
    daysToClose: 47,

    doNotCall: false,
    emailOptOut: false,
    preferredLanguage: 'en',
    preferredContactMethod: 'WhatsApp',

    facebookUrl: null,
    instagramUrl: null,
    websiteUrl: 'https://globaltech.com',

    gstin: null,
    billingAddress: '100 Global Way',
    billingCity: 'Seattle',
    billingState: 'Washington',
    billingStateCode: 'WA',
    billingPincode: '98101',
    shippingAddress: '100 Global Way',
    shippingCity: 'Seattle',
    shippingState: 'Washington',
    shippingStateCode: 'WA',
    shippingPincode: '98101',

    tags: ['customer', 'support-priority', 'renewal-due'],
    dealIds: [],
    activityIds: [],
    conversationIds: ['conv-4'],
  },

  {
    id: 'contact-5',
    tenantId: 'tenant-1',
    firstName: 'Lisa',
    lastName: 'Thompson',
    displayName: 'Lisa Thompson',
    email: 'lisa.t@innovate.co',
    phone: '+1 555-0654',
    additionalEmails: [],
    additionalPhones: [],
    companyId: 'company-5',
    jobTitle: 'Finance Manager',
    linkedinUrl: null,
    twitterUrl: null,
    marketingConsent: true,
    whatsappConsent: false,
    consentUpdatedAt: '2024-06-01T10:00:00Z',
    source: 'WEBSITE',
    sourceDetails: { page: '/pricing', cta: 'contact-sales' },
    ownerId: null, // Unassigned
    status: 'ACTIVE',
    customFields: {
      industry: 'Consulting',
      companySize: '50-100',
      budgetRange: '$10K-$50K',
    },
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2024-12-27T09:00:00Z',
    lastActivityAt: '2024-12-27T09:00:00Z',

    lifecycleStage: 'CUSTOMER',
    leadStatus: null,
    leadScore: 55,
    leadScoreUpdatedAt: '2024-12-27T08:00:00Z',
    becameLeadAt: '2024-06-01T10:00:00Z',
    becameMqlAt: '2024-06-15T10:00:00Z',
    becameSqlAt: '2024-07-01T10:00:00Z',
    becameOpportunityAt: '2024-07-15T10:00:00Z',
    becameCustomerAt: '2024-08-01T10:00:00Z',
    contactUnworked: false,
    personaType: 'User',
    buyingRole: 'End User',
    isQualified: true,
    qualifiedDate: '2024-07-01T10:00:00Z',
    disqualificationReason: null,

    rating: 'WARM',
    priority: 'HIGH', // Billing issue = high priority
    likelihoodToClose: 100,
    expectedRevenue: 8500,

    firstOutreachDate: '2024-06-02T09:00:00Z',
    lastContactedDate: '2024-12-20T10:00:00Z',
    lastEngagementDate: '2024-12-27T09:00:00Z',
    lastEngagementType: 'Email',
    leadResponseTime: 3600000,
    emailCount: 25,
    callCount: 5,
    meetingCount: 2,
    outreachCount: 32,
    nextActivityDate: '2024-12-27T14:00:00Z',
    nextActivityType: 'Call',
    followUpDate: '2024-12-27T14:00:00Z',

    referredBy: null,
    campaign: 'Organic',
    medium: 'organic',
    adCampaign: null,
    territory: 'Central',
    segment: 'SMB',

    inSequence: false,
    sequenceName: null,
    workflowStatus: 'Support Ticket Open',

    isTargetAccount: false,

    salutation: 'Ms.',
    middleName: 'Marie',
    suffix: null,
    preferredName: 'Lisa',
    dateOfBirth: '1988-04-18',
    gender: 'Female',

    department: 'Finance',
    reportsToId: null,
    assistantName: null,
    assistantPhone: null,
    assistantEmail: null,

    mobilePhone: '+1 555-0655',
    homePhone: null,
    fax: null,
    otherPhone: null,

    originalSource: 'Organic Search',
    firstConversionDate: '2024-06-01T10:00:00Z',
    lastConversionDate: '2024-07-15T11:00:00Z',
    numberOfConversions: 2,
    pageViews: 35,
    lastPageSeen: '/billing',
    firstPageSeen: '/pricing',
    numberOfTimesContacted: 32,
    daysToClose: 61,

    doNotCall: false,
    emailOptOut: false,
    preferredLanguage: 'en',
    preferredContactMethod: 'Email',

    facebookUrl: null,
    instagramUrl: null,
    websiteUrl: 'https://innovate.co',

    gstin: null,
    billingAddress: '200 Innovation Dr',
    billingCity: 'Austin',
    billingState: 'Texas',
    billingStateCode: 'TX',
    billingPincode: '78701',
    shippingAddress: null,
    shippingCity: null,
    shippingState: null,
    shippingStateCode: null,
    shippingPincode: null,

    tags: ['customer', 'billing', 'urgent'],
    dealIds: [],
    activityIds: [],
    conversationIds: ['conv-5'],
  },

  // Additional contacts for variety
  {
    id: 'contact-6',
    tenantId: 'tenant-1',
    firstName: 'James',
    lastName: 'Wilson',
    displayName: 'James Wilson',
    email: 'j.wilson@enterprise.com',
    phone: '+1 555-0999',
    companyId: 'company-6',
    jobTitle: 'CEO',
    source: 'COLD_CALL',
    ownerId: 'user-3',
    status: 'ACTIVE',
    lifecycleStage: 'MQL',
    leadStatus: 'ATTEMPTED_TO_CONTACT',
    leadScore: 60,
    rating: 'WARM',
    priority: 'HIGH',
    contactUnworked: false,
    personaType: 'Executive Sponsor',
    buyingRole: 'Economic Buyer',
    isQualified: false,
    expectedRevenue: 100000,
    createdAt: '2024-12-20T10:00:00Z',
    updatedAt: '2024-12-27T10:00:00Z',
    lastActivityAt: '2024-12-26T15:00:00Z',
    tags: ['high-value', 'ceo', 'enterprise'],
    dealIds: [],
    activityIds: [],
    conversationIds: [],
  },

  {
    id: 'contact-7',
    tenantId: 'tenant-1',
    firstName: 'Amanda',
    lastName: 'Foster',
    displayName: 'Amanda Foster',
    email: 'amanda@smallbiz.com',
    phone: '+1 555-0777',
    companyId: null,
    jobTitle: 'Owner',
    source: 'WEBINAR',
    sourceDetails: { webinarName: 'CRM Best Practices 2024' },
    ownerId: 'user-2',
    status: 'ACTIVE',
    lifecycleStage: 'SUBSCRIBER',
    leadStatus: 'NEW',
    leadScore: 25,
    rating: 'COLD',
    priority: 'LOW',
    contactUnworked: true,
    personaType: 'Decision Maker',
    buyingRole: 'Budget Holder',
    isQualified: false,
    expectedRevenue: 2000,
    createdAt: '2024-12-26T14:00:00Z',
    updatedAt: '2024-12-26T14:00:00Z',
    lastActivityAt: null,
    tags: ['webinar', 'small-business'],
    dealIds: [],
    activityIds: [],
    conversationIds: [],
  },

  {
    id: 'contact-8',
    tenantId: 'tenant-1',
    firstName: 'Robert',
    lastName: 'Martinez',
    displayName: 'Robert Martinez',
    email: 'r.martinez@agency.co',
    phone: '+1 555-0888',
    companyId: 'company-7',
    jobTitle: 'Operations Manager',
    source: 'PARTNER',
    sourceDetails: { partner: 'Acme Consulting' },
    ownerId: 'user-1',
    status: 'ACTIVE',
    lifecycleStage: 'SQL',
    leadStatus: 'CONNECTED',
    leadScore: 70,
    rating: 'WARM',
    priority: 'MEDIUM',
    contactUnworked: false,
    personaType: 'Influencer',
    buyingRole: 'Champion',
    isQualified: true,
    qualifiedDate: '2024-12-24T10:00:00Z',
    expectedRevenue: 20000,
    createdAt: '2024-12-15T10:00:00Z',
    updatedAt: '2024-12-27T08:00:00Z',
    lastActivityAt: '2024-12-27T08:00:00Z',
    tags: ['partner-referral', 'qualified'],
    dealIds: [],
    activityIds: [],
    conversationIds: [],
  },
]

// ==================== CONTACT STATS ====================

export const contactStats = {
  total: contacts.length,
  byLifecycleStage: {
    SUBSCRIBER: contacts.filter(c => c.lifecycleStage === 'SUBSCRIBER').length,
    LEAD: contacts.filter(c => c.lifecycleStage === 'LEAD').length,
    MQL: contacts.filter(c => c.lifecycleStage === 'MQL').length,
    SQL: contacts.filter(c => c.lifecycleStage === 'SQL').length,
    OPPORTUNITY: contacts.filter(c => c.lifecycleStage === 'OPPORTUNITY').length,
    CUSTOMER: contacts.filter(c => c.lifecycleStage === 'CUSTOMER').length,
  },
  byRating: {
    HOT: contacts.filter(c => c.rating === 'HOT').length,
    WARM: contacts.filter(c => c.rating === 'WARM').length,
    COLD: contacts.filter(c => c.rating === 'COLD').length,
  },
  byPriority: {
    HIGH: contacts.filter(c => c.priority === 'HIGH').length,
    MEDIUM: contacts.filter(c => c.priority === 'MEDIUM').length,
    LOW: contacts.filter(c => c.priority === 'LOW').length,
  },
  unworked: contacts.filter(c => c.contactUnworked).length,
  qualified: contacts.filter(c => c.isQualified).length,
  inSequence: contacts.filter(c => c.inSequence).length,
  unassigned: contacts.filter(c => !c.ownerId).length,
}

// ==================== API SIMULATION FUNCTIONS ====================

const simulateDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

export const getContacts = async (params = {}) => {
  await simulateDelay()
  let result = [...contacts]

  // Filter by status
  if (params.status) {
    result = result.filter(c => c.status === params.status)
  }

  // Filter by lifecycle stage
  if (params.lifecycleStage) {
    result = result.filter(c => c.lifecycleStage === params.lifecycleStage)
  }

  // Filter by lead status
  if (params.leadStatus) {
    result = result.filter(c => c.leadStatus === params.leadStatus)
  }

  // Filter by rating
  if (params.rating) {
    result = result.filter(c => c.rating === params.rating)
  }

  // Filter by priority
  if (params.priority) {
    result = result.filter(c => c.priority === params.priority)
  }

  // Filter by owner
  if (params.ownerId) {
    result = result.filter(c => c.ownerId === params.ownerId)
  }

  // Filter unassigned
  if (params.unassigned) {
    result = result.filter(c => !c.ownerId)
  }

  // Filter unworked
  if (params.unworked) {
    result = result.filter(c => c.contactUnworked)
  }

  // Search
  if (params.search) {
    const search = params.search.toLowerCase()
    result = result.filter(c =>
      c.firstName?.toLowerCase().includes(search) ||
      c.lastName?.toLowerCase().includes(search) ||
      c.displayName?.toLowerCase().includes(search) ||
      c.email?.toLowerCase().includes(search) ||
      c.phone?.includes(search) ||
      c.jobTitle?.toLowerCase().includes(search)
    )
  }

  // Sorting
  if (params.sortBy) {
    const sortField = params.sortBy
    const sortOrder = params.sortOrder === 'desc' ? -1 : 1
    result.sort((a, b) => {
      if (a[sortField] < b[sortField]) return -1 * sortOrder
      if (a[sortField] > b[sortField]) return 1 * sortOrder
      return 0
    })
  }

  // Pagination
  const page = params.page || 1
  const limit = params.limit || 25
  const startIndex = (page - 1) * limit
  const paginatedResult = result.slice(startIndex, startIndex + limit)

  return {
    success: true,
    data: paginatedResult,
    pagination: {
      page,
      limit,
      total: result.length,
      totalPages: Math.ceil(result.length / limit),
    },
  }
}

export const getContactById = async (id) => {
  await simulateDelay(200)
  const contact = contacts.find(c => c.id === id)
  if (!contact) {
    return { success: false, error: 'Contact not found' }
  }
  return { success: true, data: contact }
}

export const getContactStats = async () => {
  await simulateDelay(200)
  return { success: true, data: contactStats }
}

export const getContactByPhone = async (phone) => {
  await simulateDelay(200)
  const contact = contacts.find(c =>
    c.phone === phone ||
    c.mobilePhone === phone ||
    c.additionalPhones?.includes(phone)
  )
  return { success: true, data: contact || null }
}

export const getContactByEmail = async (email) => {
  await simulateDelay(200)
  const contact = contacts.find(c =>
    c.email === email ||
    c.additionalEmails?.includes(email)
  )
  return { success: true, data: contact || null }
}

export default contacts
