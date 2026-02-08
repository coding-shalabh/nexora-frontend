// Core CRM hooks - primary exports (excluding duplicates)
export {
  useContacts,
  useContact,
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
  useContactTimeline,
  useContactEngagement,
  useContactScore,
  // useContactActivities - exported from use-activities.js
  // useCustomFields - exported from use-custom-fields.js
  // useCreateActivity - exported from use-activities.js
  useBulkDeleteContacts,
  useBulkAddTags,
  useBulkUpdateOwner,
  useBulkUpdateStatus,
  useDuplicateContacts,
  useMergeContacts,
} from './use-contacts.js';

export * from './use-companies.js';

// Activities - full export
export * from './use-activities.js';

// Skip use-conversations.js - use-inbox.js has better implementations
// export * from './use-conversations.js';

export * from './use-deals.js';
export * from './use-leads.js';

// Inbox hooks - exclude useChannels (use the one from use-inbox-tools.js)
export {
  inboxKeys,
  useConversations,
  useConversation,
  useMessages,
  useInboxStats,
  // useChannels - exported from use-inbox-tools.js (has filters)
  useSendMessage,
  useMarkAsRead,
  useAssignConversation,
  useResolveConversation,
  useReopenConversation,
  useToggleStar,
  useArchiveConversation,
  useUnarchiveConversation,
  useUpdatePurpose,
} from './use-inbox.js';

// Inbox tools - full export (includes useChannels with filters)
export * from './use-inbox-tools.js';

export * from './use-dashboard.js';
export * from './use-wallet.js';
export * from './use-projects.js';
export * from './use-tasks.js';
export * from './use-toast.js';

// Tickets - exclude usePipelines (exported from use-deals.js)
export {
  useTickets,
  useTicket,
  useCreateTicket,
  useUpdateTicket,
  useAssignTicket,
  useResolveTicket,
  useAddTicketComment,
  // usePipelines - exported from use-deals.js
  useStages,
} from './use-tickets.js';

export * from './use-dialer.js';

// Custom fields - full export
export * from './use-custom-fields.js';

export * from './use-segments.js';
export * from './use-billing.js';
export * from './use-calendar.js';
