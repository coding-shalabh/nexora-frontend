import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Query keys
export const inboxKeys = {
  all: ['inbox'],
  conversations: (filters) => [...inboxKeys.all, 'conversations', filters],
  conversation: (id) => [...inboxKeys.all, 'conversation', id],
  messages: (conversationId) => [...inboxKeys.all, 'messages', conversationId],
  stats: () => [...inboxKeys.all, 'stats'],
  channels: () => [...inboxKeys.all, 'channels'],
};

/**
 * Fetch conversations list
 *
 * Supported filters:
 * - page, limit: Pagination
 * - status: Filter by status (OPEN, PENDING, RESOLVED, CLOSED, SNOOZED)
 * - bucket: Shorthand filter (all, unread, starred, snoozed, resolved, closed, archived, pending, open)
 * - channelType: Filter by channel (WHATSAPP, SMS, EMAIL, VOICE)
 * - channelAccountId: Filter by specific channel account
 * - assignedTo: Filter by assigned user ID
 * - unassigned: Show only unassigned conversations
 * - priority: Filter by priority (LOW, MEDIUM, HIGH, URGENT)
 * - starred: Show only starred conversations
 * - dateFrom, dateTo: Filter by date range
 * - search: Search in contact name, phone, email, or message content
 * - purpose: Filter by purpose (GENERAL, SALES, SUPPORT, SERVICE, MARKETING)
 */
export function useConversations(filters = {}) {
  return useQuery({
    queryKey: inboxKeys.conversations(filters),
    placeholderData: (previousData) => previousData, // Keep showing old data during refetch
    queryFn: async () => {
      const params = new URLSearchParams();
      // Pagination
      if (filters.page) params.set('page', filters.page);
      if (filters.limit) params.set('limit', filters.limit);
      // Status filters
      if (filters.status) params.set('status', filters.status);
      if (filters.bucket) params.set('bucket', filters.bucket);
      // Channel filters
      if (filters.channelType) params.set('channelType', filters.channelType);
      if (filters.channelAccountId) params.set('channelAccountId', filters.channelAccountId);
      // Assignment filters
      if (filters.assignedTo) params.set('assignedTo', filters.assignedTo);
      if (filters.unassigned) params.set('unassigned', filters.unassigned);
      // Priority and starred
      if (filters.priority) params.set('priority', filters.priority);
      if (filters.starred) params.set('starred', filters.starred);
      // Date range
      if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.set('dateTo', filters.dateTo);
      // Search
      if (filters.search) params.set('search', filters.search);
      // Purpose filter (GENERAL, SALES, SUPPORT, SERVICE, MARKETING)
      if (filters.purpose) params.set('purpose', filters.purpose);

      const response = await api.get(`/inbox/conversations?${params.toString()}`);
      return response;
    },
    staleTime: 3000, // 3 seconds
    refetchInterval: 10000, // Poll every 10 seconds (WebSocket handles real-time updates)
    refetchOnWindowFocus: true,
  });
}

/**
 * Fetch single conversation
 */
export function useConversation(id) {
  return useQuery({
    queryKey: inboxKeys.conversation(id),
    queryFn: async () => {
      const response = await api.get(`/inbox/conversations/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Status priority for merging (higher = more advanced)
const STATUS_PRIORITY = {
  pending: 0,
  sent: 1,
  delivered: 2,
  read: 3,
  failed: -1,
};

/**
 * Fetch conversation messages
 * Uses smart merging to preserve WebSocket status updates
 */
export function useMessages(conversationId) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: inboxKeys.messages(conversationId),
    placeholderData: (previousData) => previousData, // Keep showing old data during refetch
    queryFn: async () => {
      const response = await api.get(`/inbox/conversations/${conversationId}/messages`);
      const newMessages = response.data;

      // Get current cached messages to preserve status updates
      const cachedMessages = queryClient.getQueryData(inboxKeys.messages(conversationId));

      if (!cachedMessages || !Array.isArray(cachedMessages)) {
        return newMessages;
      }

      // Create a map of cached message statuses
      const cachedStatusMap = {};
      cachedMessages.forEach((msg) => {
        cachedStatusMap[msg.id] = msg.status;
      });

      // Merge: keep higher priority status (WebSocket updates might be ahead of DB)
      return newMessages.map((msg) => {
        const cachedStatus = cachedStatusMap[msg.id];
        if (cachedStatus) {
          const cachedPriority = STATUS_PRIORITY[cachedStatus] ?? -1;
          const newPriority = STATUS_PRIORITY[msg.status] ?? -1;
          // Keep cached status if it's more advanced
          if (cachedPriority > newPriority) {
            return { ...msg, status: cachedStatus };
          }
        }
        return msg;
      });
    },
    enabled: !!conversationId,
    staleTime: 2000, // 2 seconds
    refetchInterval: 5000, // Poll every 5 seconds for faster status updates
    refetchOnWindowFocus: true,
  });
}

/**
 * Fetch inbox stats
 */
export function useInboxStats() {
  return useQuery({
    queryKey: inboxKeys.stats(),
    queryFn: async () => {
      const response = await api.get('/inbox/stats');
      return response.data;
    },
    staleTime: 60000, // 1 minute
  });
}

/**
 * Fetch channels
 */
export function useChannels() {
  return useQuery({
    queryKey: inboxKeys.channels(),
    queryFn: async () => {
      const response = await api.get('/inbox/channels');
      return response.data;
    },
    staleTime: 300000, // 5 minutes
  });
}

/**
 * Send message mutation
 */
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, content, type = 'TEXT' }) => {
      const response = await api.post(`/inbox/conversations/${conversationId}/messages`, {
        content,
        type,
      });
      // API returns { success, data: message } - extract the message
      return response.data;
    },
    onSuccess: (message, variables) => {
      // Add the sent message to cache immediately for instant UI update
      if (message) {
        queryClient.setQueryData(inboxKeys.messages(variables.conversationId), (oldData) => {
          if (!oldData || !Array.isArray(oldData)) return oldData;
          // Check if message already exists
          const exists = oldData.some((m) => m.id === message.id);
          if (exists) return oldData;
          return [...oldData, message];
        });
      }
      // Only invalidate conversations list, NOT messages
      // This prevents overwriting WebSocket status updates with stale server data
      queryClient.invalidateQueries({
        queryKey: ['inbox', 'conversations'],
      });
      queryClient.invalidateQueries({
        queryKey: inboxKeys.stats(),
      });
    },
  });
}

/**
 * Mark conversation as read mutation
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId) => {
      const response = await api.post(`/inbox/conversations/${conversationId}/read`);
      return response.data;
    },
    onSuccess: (data, conversationId) => {
      queryClient.invalidateQueries({
        queryKey: inboxKeys.conversation(conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: inboxKeys.conversations({}),
      });
    },
  });
}

/**
 * Assign conversation mutation
 */
export function useAssignConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, assignedTo }) => {
      const response = await api.patch(`/inbox/conversations/${conversationId}/assign`, {
        assignedTo,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: inboxKeys.conversation(variables.conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: inboxKeys.conversations({}),
      });
    },
  });
}

/**
 * Resolve conversation mutation
 * @param {Object} options - { conversationId: string, force?: boolean }
 */
export function useResolveConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, force = false }) => {
      const response = await api.patch(`/inbox/conversations/${conversationId}/resolve`, { force });
      return response.data;
    },
    onSuccess: (data, { conversationId }) => {
      queryClient.invalidateQueries({
        queryKey: inboxKeys.conversation(conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: inboxKeys.conversations({}),
      });
      queryClient.invalidateQueries({
        queryKey: inboxKeys.stats(),
      });
    },
  });
}

/**
 * Reopen conversation mutation
 */
export function useReopenConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId) => {
      const response = await api.patch(`/inbox/conversations/${conversationId}/reopen`);
      return response.data;
    },
    onSuccess: (data, conversationId) => {
      queryClient.invalidateQueries({
        queryKey: inboxKeys.conversation(conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: inboxKeys.conversations({}),
      });
      queryClient.invalidateQueries({
        queryKey: inboxKeys.stats(),
      });
    },
  });
}

/**
 * Toggle star on conversation
 */
export function useToggleStar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId) => {
      const response = await api.patch(`/inbox/conversations/${conversationId}/star`);
      return response.data;
    },
    onSuccess: (data, conversationId) => {
      queryClient.invalidateQueries({
        queryKey: inboxKeys.conversation(conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: inboxKeys.conversations({}),
      });
    },
  });
}

/**
 * Archive conversation mutation
 */
export function useArchiveConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId) => {
      const response = await api.patch(`/inbox/conversations/${conversationId}/archive`);
      return response.data;
    },
    onSuccess: (data, conversationId) => {
      queryClient.invalidateQueries({
        queryKey: inboxKeys.conversation(conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: inboxKeys.conversations({}),
      });
      queryClient.invalidateQueries({
        queryKey: inboxKeys.stats(),
      });
    },
  });
}

/**
 * Unarchive conversation mutation
 */
export function useUnarchiveConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId) => {
      const response = await api.patch(`/inbox/conversations/${conversationId}/unarchive`);
      return response.data;
    },
    onSuccess: (data, conversationId) => {
      queryClient.invalidateQueries({
        queryKey: inboxKeys.conversation(conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: inboxKeys.conversations({}),
      });
      queryClient.invalidateQueries({
        queryKey: inboxKeys.stats(),
      });
    },
  });
}

/**
 * Update conversation purpose mutation
 * Purpose types: GENERAL, SALES, SUPPORT, SERVICE, MARKETING
 */
export function useUpdatePurpose() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, purpose, subCategory }) => {
      const response = await api.patch(`/inbox/conversations/${conversationId}/purpose`, {
        purpose,
        subCategory,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: inboxKeys.conversation(variables.conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: inboxKeys.conversations({}),
      });
      queryClient.invalidateQueries({
        queryKey: inboxKeys.stats(),
      });
    },
  });
}
