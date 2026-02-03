'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// ==================== MAILBOX HOOKS ====================

/**
 * Fetch all mailboxes
 */
export function useEmailMailboxes(options = {}) {
  const { domainId, status, page = 1, limit = 50 } = options;
  return useQuery({
    queryKey: ['email-mailboxes', domainId, status, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (domainId) params.append('domainId', domainId);
      if (status) params.append('status', status);
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      const response = await api.get(`/email-mailboxes?${params}`);
      return response.data || { mailboxes: [], total: 0 };
    },
  });
}

/**
 * Fetch single mailbox
 */
export function useEmailMailbox(mailboxId) {
  return useQuery({
    queryKey: ['email-mailbox', mailboxId],
    queryFn: async () => {
      const response = await api.get(`/email-mailboxes/${mailboxId}`);
      return response.data;
    },
    enabled: !!mailboxId,
  });
}

/**
 * Create a new mailbox
 */
export function useCreateMailbox() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/email-mailboxes', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-mailboxes'] });
    },
  });
}

/**
 * Update mailbox
 */
export function useUpdateMailbox() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await api.patch(`/email-mailboxes/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-mailboxes'] });
      queryClient.invalidateQueries({ queryKey: ['email-mailbox'] });
    },
  });
}

/**
 * Delete mailbox
 */
export function useDeleteMailbox() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/email-mailboxes/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-mailboxes'] });
    },
  });
}

/**
 * Update auto-responder
 */
export function useUpdateAutoResponder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ mailboxId, ...data }) => {
      const response = await api.put(`/email-mailboxes/${mailboxId}/auto-responder`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-mailboxes'] });
      queryClient.invalidateQueries({ queryKey: ['email-mailbox'] });
    },
  });
}

/**
 * Update forwarding
 */
export function useUpdateForwarding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ mailboxId, ...data }) => {
      const response = await api.put(`/email-mailboxes/${mailboxId}/forwarding`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-mailboxes'] });
      queryClient.invalidateQueries({ queryKey: ['email-mailbox'] });
    },
  });
}

/**
 * Set catch-all
 */
export function useSetCatchAll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ mailboxId, enabled }) => {
      const response = await api.post(`/email-mailboxes/${mailboxId}/catch-all`, { enabled });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-mailboxes'] });
    },
  });
}

/**
 * Generate credentials
 */
export function useGenerateCredentials() {
  return useMutation({
    mutationFn: async (mailboxId) => {
      const response = await api.post(`/email-mailboxes/${mailboxId}/credentials`);
      return response.data;
    },
  });
}

// ==================== ALIAS HOOKS ====================

/**
 * Fetch all aliases
 */
export function useEmailAliases(options = {}) {
  const { mailboxId, domainId, page = 1, limit = 50 } = options;
  return useQuery({
    queryKey: ['email-aliases', mailboxId, domainId, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (mailboxId) params.append('mailboxId', mailboxId);
      if (domainId) params.append('domainId', domainId);
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      const response = await api.get(`/email-aliases/aliases?${params}`);
      return response.data || { aliases: [], total: 0 };
    },
  });
}

/**
 * Create alias
 */
export function useCreateAlias() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/email-aliases/aliases', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-aliases'] });
    },
  });
}

/**
 * Update alias
 */
export function useUpdateAlias() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await api.patch(`/email-aliases/aliases/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-aliases'] });
    },
  });
}

/**
 * Delete alias
 */
export function useDeleteAlias() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/email-aliases/aliases/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-aliases'] });
    },
  });
}

// ==================== FORWARDER HOOKS ====================

/**
 * Fetch all forwarders
 */
export function useEmailForwarders(options = {}) {
  const { domainId, page = 1, limit = 50 } = options;
  return useQuery({
    queryKey: ['email-forwarders', domainId, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (domainId) params.append('domainId', domainId);
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      const response = await api.get(`/email-aliases/forwarders?${params}`);
      return response.data || { forwarders: [], total: 0 };
    },
  });
}

/**
 * Create forwarder
 */
export function useCreateForwarder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/email-aliases/forwarders', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-forwarders'] });
    },
  });
}

/**
 * Update forwarder
 */
export function useUpdateForwarder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await api.patch(`/email-aliases/forwarders/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-forwarders'] });
    },
  });
}

/**
 * Delete forwarder
 */
export function useDeleteForwarder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/email-aliases/forwarders/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-forwarders'] });
    },
  });
}
