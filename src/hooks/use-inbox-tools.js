import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// ========================================
// QUERY KEYS
// ========================================
export const inboxToolsKeys = {
  all: ['inboxTools'],

  // Templates
  templates: (filters) => [...inboxToolsKeys.all, 'templates', filters],
  template: (id) => [...inboxToolsKeys.all, 'template', id],
  templateStats: () => [...inboxToolsKeys.all, 'templateStats'],

  // Tags
  tags: (filters) => [...inboxToolsKeys.all, 'tags', filters],
  tag: (id) => [...inboxToolsKeys.all, 'tag', id],
  tagStats: () => [...inboxToolsKeys.all, 'tagStats'],

  // Broadcasts
  broadcasts: (filters) => [...inboxToolsKeys.all, 'broadcasts', filters],
  broadcast: (id) => [...inboxToolsKeys.all, 'broadcast', id],
  broadcastStats: () => [...inboxToolsKeys.all, 'broadcastStats'],

  // Canned Responses
  cannedResponses: (filters) => [...inboxToolsKeys.all, 'cannedResponses', filters],
  cannedResponse: (id) => [...inboxToolsKeys.all, 'cannedResponse', id],
  cannedResponseCategories: () => [...inboxToolsKeys.all, 'cannedResponseCategories'],

  // Channels
  channels: (filters) => [...inboxToolsKeys.all, 'channels', filters],
  channel: (id) => [...inboxToolsKeys.all, 'channel', id],
  channelStats: () => [...inboxToolsKeys.all, 'channelStats'],

  // Activity / Message Logs
  activity: (filters) => [...inboxToolsKeys.all, 'activity', filters],
  activityStats: () => [...inboxToolsKeys.all, 'activityStats'],
};

// ========================================
// TEMPLATES
// ========================================

/**
 * Fetch templates list
 */
export function useTemplates(filters = {}) {
  return useQuery({
    queryKey: inboxToolsKeys.templates(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set('page', filters.page);
      if (filters.limit) params.set('limit', filters.limit);
      if (filters.channel) params.set('channel', filters.channel);
      if (filters.category) params.set('category', filters.category);
      if (filters.status) params.set('status', filters.status);
      if (filters.search) params.set('search', filters.search);

      const response = await api.get(`/inbox/templates?${params.toString()}`);
      return response.data;
    },
    staleTime: 60000, // 1 minute
  });
}

/**
 * Fetch single template
 */
export function useTemplate(id) {
  return useQuery({
    queryKey: inboxToolsKeys.template(id),
    queryFn: async () => {
      const response = await api.get(`/inbox/templates/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create template mutation
 */
export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/inbox/templates', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.templates({}),
      });
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.templateStats(),
      });
    },
  });
}

/**
 * Update template mutation
 */
export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.patch(`/inbox/templates/${id}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.template(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.templates({}),
      });
    },
  });
}

/**
 * Delete template mutation
 */
export function useDeleteTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/inbox/templates/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.templates({}),
      });
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.templateStats(),
      });
    },
  });
}

/**
 * Duplicate template mutation
 */
export function useDuplicateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.post(`/inbox/templates/${id}/duplicate`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.templates({}),
      });
    },
  });
}

// ========================================
// TAGS
// ========================================

/**
 * Fetch tags list
 */
export function useTags(filters = {}) {
  return useQuery({
    queryKey: inboxToolsKeys.tags(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set('page', filters.page);
      if (filters.limit) params.set('limit', filters.limit);
      if (filters.color) params.set('color', filters.color);
      if (filters.search) params.set('search', filters.search);
      if (filters.sortBy) params.set('sortBy', filters.sortBy);

      const response = await api.get(`/inbox/tags?${params.toString()}`);
      return response.data;
    },
    staleTime: 60000,
  });
}

/**
 * Fetch single tag
 */
export function useTag(id) {
  return useQuery({
    queryKey: inboxToolsKeys.tag(id),
    queryFn: async () => {
      const response = await api.get(`/inbox/tags/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create tag mutation
 */
export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/inbox/tags', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.tags({}),
      });
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.tagStats(),
      });
    },
  });
}

/**
 * Update tag mutation
 */
export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.patch(`/inbox/tags/${id}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.tag(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.tags({}),
      });
    },
  });
}

/**
 * Delete tag mutation
 */
export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/inbox/tags/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.tags({}),
      });
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.tagStats(),
      });
    },
  });
}

/**
 * Bulk delete tags mutation
 */
export function useBulkDeleteTags() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids) => {
      const response = await api.post('/inbox/tags/bulk-delete', { ids });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.tags({}),
      });
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.tagStats(),
      });
    },
  });
}

/**
 * Merge tags mutation
 */
export function useMergeTags() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sourceIds, targetId }) => {
      const response = await api.post('/inbox/tags/merge', { sourceIds, targetId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.tags({}),
      });
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.tagStats(),
      });
    },
  });
}

// ========================================
// BROADCASTS
// ========================================

/**
 * Fetch broadcasts list
 */
export function useBroadcasts(filters = {}) {
  return useQuery({
    queryKey: inboxToolsKeys.broadcasts(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set('page', filters.page);
      if (filters.limit) params.set('limit', filters.limit);
      if (filters.channel) params.set('channel', filters.channel);
      if (filters.status) params.set('status', filters.status);
      if (filters.search) params.set('search', filters.search);

      const response = await api.get(`/inbox/broadcasts?${params.toString()}`);
      return response.data;
    },
    staleTime: 30000, // 30 seconds for active broadcasts
  });
}

/**
 * Fetch single broadcast
 */
export function useBroadcast(id) {
  return useQuery({
    queryKey: inboxToolsKeys.broadcast(id),
    queryFn: async () => {
      const response = await api.get(`/inbox/broadcasts/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create broadcast mutation
 */
export function useCreateBroadcast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/inbox/broadcasts', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.broadcasts({}),
      });
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.broadcastStats(),
      });
    },
  });
}

/**
 * Update broadcast mutation
 */
export function useUpdateBroadcast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.patch(`/inbox/broadcasts/${id}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.broadcast(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.broadcasts({}),
      });
    },
  });
}

/**
 * Delete broadcast mutation
 */
export function useDeleteBroadcast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/inbox/broadcasts/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.broadcasts({}),
      });
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.broadcastStats(),
      });
    },
  });
}

/**
 * Pause broadcast mutation
 */
export function usePauseBroadcast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.post(`/inbox/broadcasts/${id}/pause`);
      return response.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.broadcast(id),
      });
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.broadcasts({}),
      });
    },
  });
}

/**
 * Resume broadcast mutation
 */
export function useResumeBroadcast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.post(`/inbox/broadcasts/${id}/resume`);
      return response.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.broadcast(id),
      });
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.broadcasts({}),
      });
    },
  });
}

/**
 * Cancel broadcast mutation
 */
export function useCancelBroadcast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.post(`/inbox/broadcasts/${id}/cancel`);
      return response.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.broadcast(id),
      });
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.broadcasts({}),
      });
    },
  });
}

// ========================================
// CANNED RESPONSES
// ========================================

/**
 * Fetch canned responses list
 */
export function useCannedResponses(filters = {}) {
  return useQuery({
    queryKey: inboxToolsKeys.cannedResponses(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set('page', filters.page);
      if (filters.limit) params.set('limit', filters.limit);
      if (filters.category) params.set('category', filters.category);
      if (filters.visibility) params.set('visibility', filters.visibility);
      if (filters.search) params.set('search', filters.search);
      if (filters.sortBy) params.set('sortBy', filters.sortBy);

      const response = await api.get(`/inbox/canned-responses?${params.toString()}`);
      return response.data;
    },
    staleTime: 60000,
  });
}

/**
 * Fetch single canned response
 */
export function useCannedResponse(id) {
  return useQuery({
    queryKey: inboxToolsKeys.cannedResponse(id),
    queryFn: async () => {
      const response = await api.get(`/inbox/canned-responses/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Fetch canned response categories
 */
export function useCannedResponseCategories() {
  return useQuery({
    queryKey: inboxToolsKeys.cannedResponseCategories(),
    queryFn: async () => {
      const response = await api.get('/inbox/canned-responses/categories');
      return response.data;
    },
    staleTime: 300000, // 5 minutes
  });
}

/**
 * Create canned response mutation
 */
export function useCreateCannedResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/inbox/canned-responses', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.cannedResponses({}),
      });
    },
  });
}

/**
 * Update canned response mutation
 */
export function useUpdateCannedResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.patch(`/inbox/canned-responses/${id}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.cannedResponse(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.cannedResponses({}),
      });
    },
  });
}

/**
 * Delete canned response mutation
 */
export function useDeleteCannedResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/inbox/canned-responses/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.cannedResponses({}),
      });
    },
  });
}

/**
 * Bulk delete canned responses mutation
 */
export function useBulkDeleteCannedResponses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids) => {
      const response = await api.post('/inbox/canned-responses/bulk-delete', { ids });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.cannedResponses({}),
      });
    },
  });
}

/**
 * Toggle favorite canned response mutation
 */
export function useToggleCannedResponseFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.post(`/inbox/canned-responses/${id}/toggle-favorite`);
      return response.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.cannedResponse(id),
      });
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.cannedResponses({}),
      });
    },
  });
}

/**
 * Create canned response category mutation
 */
export function useCreateCannedResponseCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/inbox/canned-responses/categories', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.cannedResponseCategories(),
      });
    },
  });
}

// ========================================
// CHANNELS
// ========================================

/**
 * Fetch channels list
 */
export function useChannels(filters = {}) {
  return useQuery({
    queryKey: inboxToolsKeys.channels(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.type) params.set('type', filters.type);
      if (filters.status) params.set('status', filters.status);

      const response = await api.get(`/inbox/channels?${params.toString()}`);
      return response.data;
    },
    staleTime: 60000,
  });
}

/**
 * Fetch single channel
 */
export function useChannel(id) {
  return useQuery({
    queryKey: inboxToolsKeys.channel(id),
    queryFn: async () => {
      const response = await api.get(`/inbox/channels/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Fetch channel stats
 */
export function useChannelStats() {
  return useQuery({
    queryKey: inboxToolsKeys.channelStats(),
    queryFn: async () => {
      const response = await api.get('/inbox/channels/stats');
      return response.data;
    },
    staleTime: 60000,
  });
}

/**
 * Create channel mutation
 */
export function useCreateChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/inbox/channels', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.channels({}),
      });
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.channelStats(),
      });
    },
  });
}

/**
 * Update channel mutation
 */
export function useUpdateChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.patch(`/inbox/channels/${id}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.channel(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.channels({}),
      });
    },
  });
}

/**
 * Delete channel mutation
 */
export function useDeleteChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/inbox/channels/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.channels({}),
      });
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.channelStats(),
      });
    },
  });
}

/**
 * Toggle channel status mutation
 */
export function useToggleChannelStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.post(`/inbox/channels/${id}/toggle-status`);
      return response.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.channel(id),
      });
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.channels({}),
      });
    },
  });
}

/**
 * Test channel connection mutation
 */
export function useTestChannelConnection() {
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.post(`/inbox/channels/${id}/test`);
      return response.data;
    },
  });
}

/**
 * Sync channel mutation
 */
export function useSyncChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.post(`/inbox/channels/${id}/sync`);
      return response.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.channel(id),
      });
    },
  });
}

// ========================================
// ACTIVITY / MESSAGE LOGS
// ========================================

/**
 * Fetch activity/message logs
 */
export function useActivityLogs(filters = {}) {
  return useQuery({
    queryKey: inboxToolsKeys.activity(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set('page', filters.page);
      if (filters.limit) params.set('limit', filters.limit);
      if (filters.channel) params.set('channel', filters.channel);
      if (filters.status) params.set('status', filters.status);
      if (filters.direction) params.set('direction', filters.direction);
      if (filters.period) params.set('period', filters.period);
      if (filters.search) params.set('search', filters.search);
      if (filters.startDate) params.set('startDate', filters.startDate);
      if (filters.endDate) params.set('endDate', filters.endDate);

      const response = await api.get(`/inbox/activity?${params.toString()}`);
      return response.data;
    },
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Fetch activity stats
 */
export function useActivityStats(filters = {}) {
  return useQuery({
    queryKey: inboxToolsKeys.activityStats(),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.period) params.set('period', filters.period);

      const response = await api.get(`/inbox/activity/stats?${params.toString()}`);
      return response.data;
    },
    staleTime: 60000,
  });
}

/**
 * Export activity logs mutation
 */
export function useExportActivityLogs() {
  return useMutation({
    mutationFn: async (filters) => {
      const params = new URLSearchParams();
      if (filters.channel) params.set('channel', filters.channel);
      if (filters.status) params.set('status', filters.status);
      if (filters.startDate) params.set('startDate', filters.startDate);
      if (filters.endDate) params.set('endDate', filters.endDate);
      if (filters.format) params.set('format', filters.format);

      const response = await api.get(`/inbox/activity/export?${params.toString()}`, {
        responseType: 'blob',
      });
      return response;
    },
  });
}

/**
 * Retry failed message mutation
 */
export function useRetryMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId) => {
      const response = await api.post(`/inbox/activity/${messageId}/retry`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inboxToolsKeys.activity({}),
      });
    },
  });
}
