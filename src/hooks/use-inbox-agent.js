import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

// ============================================================================
// Query Keys
// ============================================================================

export const inboxAgentKeys = {
  all: ['inbox-agent'],
  // Canned Responses
  cannedResponses: () => [...inboxAgentKeys.all, 'canned-responses'],
  cannedResponsesCategories: () => [...inboxAgentKeys.all, 'canned-responses', 'categories'],
  cannedResponsesList: (filters) => [...inboxAgentKeys.cannedResponses(), 'list', filters],
  cannedResponse: (id) => [...inboxAgentKeys.cannedResponses(), id],
  // Notes
  notes: (threadId) => [...inboxAgentKeys.all, 'notes', threadId],
  // Teams
  teams: () => [...inboxAgentKeys.all, 'teams'],
  // Auto-Assignment Rules
  autoAssignmentRules: () => [...inboxAgentKeys.all, 'auto-assignment-rules'],
  // SLA Policies
  slaPolicies: () => [...inboxAgentKeys.all, 'sla-policies'],
  // Analytics
  analytics: (period) => [...inboxAgentKeys.all, 'analytics', period],
  // Agent Status
  agentStatus: () => [...inboxAgentKeys.all, 'agents', 'status'],
  onlineAgents: () => [...inboxAgentKeys.all, 'agents', 'online'],
}

// ============================================================================
// CANNED RESPONSES (Quick Replies)
// ============================================================================

/**
 * Get canned response categories
 */
export function useCannedResponseCategories() {
  return useQuery({
    queryKey: inboxAgentKeys.cannedResponsesCategories(),
    queryFn: async () => {
      const response = await api.get('/inbox/canned-responses/categories')
      return response // Return full response { success, data } for component
    },
    staleTime: 300000, // 5 minutes
  })
}

/**
 * Create canned response category
 */
export function useCreateCannedResponseCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/inbox/canned-responses/categories', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboxAgentKeys.cannedResponsesCategories() })
    },
  })
}

/**
 * Update canned response category
 */
export function useUpdateCannedResponseCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await api.patch(`/inbox/canned-responses/categories/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboxAgentKeys.cannedResponsesCategories() })
    },
  })
}

/**
 * Delete canned response category
 */
export function useDeleteCannedResponseCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/inbox/canned-responses/categories/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboxAgentKeys.cannedResponsesCategories() })
    },
  })
}

/**
 * Get canned responses
 */
export function useCannedResponses(filters = {}) {
  return useQuery({
    queryKey: inboxAgentKeys.cannedResponsesList(filters),
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.categoryId) params.set('categoryId', filters.categoryId)
      if (filters.visibility) params.set('visibility', filters.visibility)
      if (filters.search) params.set('search', filters.search)
      if (filters.favorite) params.set('favorite', 'true')

      const response = await api.get(`/inbox/canned-responses?${params.toString()}`)
      return response // Return full response { success, data } for component
    },
    staleTime: 60000, // 1 minute
  })
}

/**
 * Create canned response
 */
export function useCreateCannedResponse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/inbox/canned-responses', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboxAgentKeys.cannedResponses() })
    },
  })
}

/**
 * Update canned response
 */
export function useUpdateCannedResponse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await api.patch(`/inbox/canned-responses/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboxAgentKeys.cannedResponses() })
    },
  })
}

/**
 * Delete canned response
 */
export function useDeleteCannedResponse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/inbox/canned-responses/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboxAgentKeys.cannedResponses() })
    },
  })
}

/**
 * Track canned response usage
 */
export function useTrackCannedResponseUsage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.post(`/inbox/canned-responses/${id}/use`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboxAgentKeys.cannedResponses() })
    },
  })
}

// ============================================================================
// INTERNAL NOTES
// ============================================================================

/**
 * Get notes for a conversation
 */
export function useConversationNotes(threadId) {
  return useQuery({
    queryKey: inboxAgentKeys.notes(threadId),
    queryFn: async () => {
      const response = await api.get(`/inbox/conversations/${threadId}/notes`)
      return response.data
    },
    enabled: !!threadId,
    staleTime: 30000, // 30 seconds
  })
}

/**
 * Create note
 */
export function useCreateNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ threadId, content, mentions }) => {
      const response = await api.post(`/inbox/conversations/${threadId}/notes`, {
        content,
        mentions,
      })
      return response.data
    },
    onSuccess: (data, { threadId }) => {
      queryClient.invalidateQueries({ queryKey: inboxAgentKeys.notes(threadId) })
    },
  })
}

/**
 * Update note
 */
export function useUpdateNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ threadId, noteId, ...data }) => {
      const response = await api.patch(`/inbox/conversations/${threadId}/notes/${noteId}`, data)
      return response.data
    },
    onSuccess: (data, { threadId }) => {
      queryClient.invalidateQueries({ queryKey: inboxAgentKeys.notes(threadId) })
    },
  })
}

/**
 * Delete note
 */
export function useDeleteNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ threadId, noteId }) => {
      await api.delete(`/inbox/conversations/${threadId}/notes/${noteId}`)
    },
    onSuccess: (data, { threadId }) => {
      queryClient.invalidateQueries({ queryKey: inboxAgentKeys.notes(threadId) })
    },
  })
}

// ============================================================================
// SNOOZE
// ============================================================================

/**
 * Snooze conversation
 */
export function useSnoozeConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ conversationId, duration, customUntil, reason }) => {
      const response = await api.post(`/inbox/conversations/${conversationId}/snooze`, {
        duration,
        customUntil,
        reason,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox', 'conversations'] })
    },
  })
}

/**
 * Unsnooze conversation
 */
export function useUnsnoozeConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (conversationId) => {
      const response = await api.post(`/inbox/conversations/${conversationId}/unsnooze`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox', 'conversations'] })
    },
  })
}

// ============================================================================
// TEAM ASSIGNMENT
// ============================================================================

/**
 * Get teams for inbox
 */
export function useInboxTeams() {
  return useQuery({
    queryKey: inboxAgentKeys.teams(),
    queryFn: async () => {
      const response = await api.get('/inbox/teams')
      return response.data
    },
    staleTime: 300000, // 5 minutes
  })
}

/**
 * Assign conversation to team
 */
export function useAssignToTeam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ conversationId, teamId }) => {
      const response = await api.patch(`/inbox/conversations/${conversationId}/assign-team`, {
        teamId,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox', 'conversations'] })
    },
  })
}

// ============================================================================
// AUTO-ASSIGNMENT RULES
// ============================================================================

/**
 * Get auto-assignment rules
 */
export function useAutoAssignmentRules() {
  return useQuery({
    queryKey: inboxAgentKeys.autoAssignmentRules(),
    queryFn: async () => {
      const response = await api.get('/inbox/auto-assignment-rules')
      return response.data
    },
    staleTime: 300000, // 5 minutes
  })
}

/**
 * Create auto-assignment rule
 */
export function useCreateAutoAssignmentRule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/inbox/auto-assignment-rules', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboxAgentKeys.autoAssignmentRules() })
    },
  })
}

/**
 * Update auto-assignment rule
 */
export function useUpdateAutoAssignmentRule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await api.patch(`/inbox/auto-assignment-rules/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboxAgentKeys.autoAssignmentRules() })
    },
  })
}

/**
 * Delete auto-assignment rule
 */
export function useDeleteAutoAssignmentRule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/inbox/auto-assignment-rules/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboxAgentKeys.autoAssignmentRules() })
    },
  })
}

// ============================================================================
// SLA POLICIES
// ============================================================================

/**
 * Get SLA policies
 */
export function useSLAPolicies() {
  return useQuery({
    queryKey: inboxAgentKeys.slaPolicies(),
    queryFn: async () => {
      const response = await api.get('/inbox/sla-policies')
      return response.data
    },
    staleTime: 300000, // 5 minutes
  })
}

/**
 * Create SLA policy
 */
export function useCreateSLAPolicy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/inbox/sla-policies', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboxAgentKeys.slaPolicies() })
    },
  })
}

/**
 * Update SLA policy
 */
export function useUpdateSLAPolicy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await api.patch(`/inbox/sla-policies/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboxAgentKeys.slaPolicies() })
    },
  })
}

/**
 * Delete SLA policy
 */
export function useDeleteSLAPolicy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/inbox/sla-policies/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboxAgentKeys.slaPolicies() })
    },
  })
}

// ============================================================================
// AI SUGGESTIONS
// ============================================================================

/**
 * Get AI-suggested replies
 */
export function useAISuggestions() {
  return useMutation({
    mutationFn: async ({ conversationId, context, tone }) => {
      const response = await api.post(`/inbox/conversations/${conversationId}/ai-suggest`, {
        context,
        tone,
      })
      return response.data
    },
  })
}

/**
 * Get conversation summary
 */
export function useConversationSummary() {
  return useMutation({
    mutationFn: async (conversationId) => {
      const response = await api.post(`/inbox/conversations/${conversationId}/summarize`)
      return response.data
    },
  })
}

// ============================================================================
// ANALYTICS
// ============================================================================

/**
 * Get inbox analytics
 */
export function useInboxAnalytics(period = '7d') {
  return useQuery({
    queryKey: inboxAgentKeys.analytics(period),
    queryFn: async () => {
      const response = await api.get(`/inbox/analytics?period=${period}`)
      return response.data
    },
    staleTime: 60000, // 1 minute
  })
}

// ============================================================================
// AGENT STATUS (Online/Offline)
// ============================================================================

/**
 * Get all agents with their online status
 */
export function useAgentsWithStatus() {
  return useQuery({
    queryKey: inboxAgentKeys.agentStatus(),
    queryFn: async () => {
      const response = await api.get('/inbox/agents/status')
      return response.data
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  })
}

/**
 * Get only online agents
 */
export function useOnlineAgents() {
  return useQuery({
    queryKey: inboxAgentKeys.onlineAgents(),
    queryFn: async () => {
      const response = await api.get('/inbox/agents/online')
      return response.data
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  })
}

/**
 * Go online
 */
export function useGoOnline() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/inbox/agents/go-online')
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboxAgentKeys.agentStatus() })
      queryClient.invalidateQueries({ queryKey: inboxAgentKeys.onlineAgents() })
    },
  })
}

/**
 * Go offline
 */
export function useGoOffline() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/inbox/agents/go-offline')
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboxAgentKeys.agentStatus() })
      queryClient.invalidateQueries({ queryKey: inboxAgentKeys.onlineAgents() })
    },
  })
}

/**
 * Update agent status
 */
export function useUpdateAgentStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (isOnline) => {
      const response = await api.post('/inbox/agents/status', { isOnline })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboxAgentKeys.agentStatus() })
      queryClient.invalidateQueries({ queryKey: inboxAgentKeys.onlineAgents() })
    },
  })
}

/**
 * Send heartbeat
 */
export function useSendHeartbeat() {
  return useMutation({
    mutationFn: async () => {
      await api.post('/inbox/agents/heartbeat')
    },
  })
}

/**
 * Trigger auto-assignment for a conversation
 */
export function useAutoAssign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ conversationId, channel, content }) => {
      const response = await api.post(`/inbox/conversations/${conversationId}/auto-assign`, {
        channel,
        content,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox', 'conversations'] })
    },
  })
}
