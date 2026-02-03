'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// ==================== SHARED INBOX QUERIES ====================

/**
 * Get all shared inboxes for the tenant
 */
export function useSharedInboxes() {
  return useQuery({
    queryKey: ['shared-inboxes'],
    queryFn: async () => {
      const response = await api.get('/shared-inboxes');
      return response.data;
    },
  });
}

/**
 * Get a single shared inbox by ID
 */
export function useSharedInbox(id) {
  return useQuery({
    queryKey: ['shared-inboxes', id],
    queryFn: async () => {
      const response = await api.get(`/shared-inboxes/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Get shared inboxes the current user is a member of
 */
export function useMySharedInboxes() {
  return useQuery({
    queryKey: ['shared-inboxes', 'my-inboxes'],
    queryFn: async () => {
      const response = await api.get('/shared-inboxes/my-inboxes');
      return response.data;
    },
  });
}

/**
 * Get members of a shared inbox
 */
export function useSharedInboxMembers(inboxId) {
  return useQuery({
    queryKey: ['shared-inboxes', inboxId, 'members'],
    queryFn: async () => {
      const response = await api.get(`/shared-inboxes/${inboxId}/members`);
      return response.data;
    },
    enabled: !!inboxId,
  });
}

// ==================== SHARED INBOX MUTATIONS ====================

/**
 * Create a new shared inbox
 */
export function useCreateSharedInbox() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/shared-inboxes', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-inboxes'] });
    },
  });
}

/**
 * Update a shared inbox
 */
export function useUpdateSharedInbox() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.patch(`/shared-inboxes/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['shared-inboxes'] });
      queryClient.invalidateQueries({ queryKey: ['shared-inboxes', id] });
    },
  });
}

/**
 * Delete a shared inbox
 */
export function useDeleteSharedInbox() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/shared-inboxes/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-inboxes'] });
    },
  });
}

// ==================== MEMBER MUTATIONS ====================

/**
 * Add a member to a shared inbox
 */
export function useAddInboxMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ inboxId, data }) => {
      const response = await api.post(`/shared-inboxes/${inboxId}/members`, data);
      return response.data;
    },
    onSuccess: (_, { inboxId }) => {
      queryClient.invalidateQueries({ queryKey: ['shared-inboxes'] });
      queryClient.invalidateQueries({ queryKey: ['shared-inboxes', inboxId] });
      queryClient.invalidateQueries({ queryKey: ['shared-inboxes', inboxId, 'members'] });
    },
  });
}

/**
 * Update a member's permissions in a shared inbox
 */
export function useUpdateInboxMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ inboxId, userId, data }) => {
      const response = await api.patch(`/shared-inboxes/${inboxId}/members/${userId}`, data);
      return response.data;
    },
    onSuccess: (_, { inboxId }) => {
      queryClient.invalidateQueries({ queryKey: ['shared-inboxes', inboxId] });
      queryClient.invalidateQueries({ queryKey: ['shared-inboxes', inboxId, 'members'] });
    },
  });
}

/**
 * Remove a member from a shared inbox
 */
export function useRemoveInboxMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ inboxId, userId }) => {
      const response = await api.delete(`/shared-inboxes/${inboxId}/members/${userId}`);
      return response.data;
    },
    onSuccess: (_, { inboxId }) => {
      queryClient.invalidateQueries({ queryKey: ['shared-inboxes'] });
      queryClient.invalidateQueries({ queryKey: ['shared-inboxes', inboxId] });
      queryClient.invalidateQueries({ queryKey: ['shared-inboxes', inboxId, 'members'] });
    },
  });
}
