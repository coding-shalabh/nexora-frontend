'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

// Get all connected email accounts
export function useEmailAccounts() {
  return useQuery({
    queryKey: ['email-accounts'],
    queryFn: async () => {
      const response = await api.get('/email-accounts')
      return response.data
    },
  })
}

// Get single email account
export function useEmailAccount(id) {
  return useQuery({
    queryKey: ['email-accounts', id],
    queryFn: async () => {
      const response = await api.get(`/email-accounts/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

// Get available email providers
export function useEmailProviders() {
  return useQuery({
    queryKey: ['email-providers'],
    queryFn: async () => {
      const response = await api.get('/email-accounts/providers/list')
      return response.data
    },
  })
}

// Detect email provider by email address
export function useDetectEmailProvider() {
  return useMutation({
    mutationFn: async (email) => {
      const response = await api.post('/email-accounts/detect', { email })
      return response.data
    },
  })
}

// Test IMAP connection
export function useTestEmailConnection() {
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/email-accounts/test-connection', data)
      return response.data
    },
  })
}

// Connect email via IMAP/SMTP
export function useConnectEmailIMAP() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/email-accounts/connect/imap', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-accounts'] })
    },
  })
}

// Get Google OAuth URL
export function useGoogleOAuthUrl() {
  return useMutation({
    mutationFn: async () => {
      const response = await api.get('/email-accounts/oauth/google/url')
      return response.data
    },
  })
}

// Handle Google OAuth callback
export function useGoogleOAuthCallback() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ code, state }) => {
      const response = await api.post('/email-accounts/oauth/google/callback', { code, state })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-accounts'] })
    },
  })
}

// Get Microsoft OAuth URL
export function useMicrosoftOAuthUrl() {
  return useMutation({
    mutationFn: async () => {
      const response = await api.get('/email-accounts/oauth/microsoft/url')
      return response.data
    },
  })
}

// Handle Microsoft OAuth callback
export function useMicrosoftOAuthCallback() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ code, state }) => {
      const response = await api.post('/email-accounts/oauth/microsoft/callback', { code, state })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-accounts'] })
    },
  })
}

// Update email account
export function useUpdateEmailAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const response = await api.patch(`/email-accounts/${id}`, updates)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-accounts'] })
    },
  })
}

// Disconnect email account
export function useDisconnectEmailAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/email-accounts/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-accounts'] })
    },
  })
}

// ==================== EMAIL ACCESS / SHARING ====================

// Get all email accounts user has access to (including shared)
export function useAccessibleEmailAccounts() {
  return useQuery({
    queryKey: ['email-accounts', 'accessible'],
    queryFn: async () => {
      const response = await api.get('/email-accounts/accessible')
      return response.data
    },
  })
}

// Get access list for an email account
export function useEmailAccountAccess(emailAccountId) {
  return useQuery({
    queryKey: ['email-accounts', emailAccountId, 'access'],
    queryFn: async () => {
      const response = await api.get(`/email-accounts/${emailAccountId}/access`)
      return response.data
    },
    enabled: !!emailAccountId,
  })
}

// Grant user access to email account
export function useGrantUserAccess() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ emailAccountId, userId, permission, expiresAt }) => {
      const response = await api.post(`/email-accounts/${emailAccountId}/access/user`, {
        userId,
        permission,
        expiresAt,
      })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['email-accounts', variables.emailAccountId, 'access'] })
    },
  })
}

// Grant team access to email account
export function useGrantTeamAccess() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ emailAccountId, teamId, permission, expiresAt }) => {
      const response = await api.post(`/email-accounts/${emailAccountId}/access/team`, {
        teamId,
        permission,
        expiresAt,
      })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['email-accounts', variables.emailAccountId, 'access'] })
    },
  })
}

// Update access permission
export function useUpdateEmailAccess() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ accessId, permission }) => {
      const response = await api.patch(`/email-accounts/access/${accessId}`, { permission })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-accounts'] })
    },
  })
}

// Revoke access
export function useRevokeEmailAccess() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (accessId) => {
      const response = await api.delete(`/email-accounts/access/${accessId}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-accounts'] })
    },
  })
}

// Check access to email account
export function useCheckEmailAccess(emailAccountId, requiredPermission = 'READ_ONLY') {
  return useQuery({
    queryKey: ['email-accounts', emailAccountId, 'check-access', requiredPermission],
    queryFn: async () => {
      const response = await api.get(`/email-accounts/${emailAccountId}/check-access?permission=${requiredPermission}`)
      return response.data
    },
    enabled: !!emailAccountId,
  })
}
