'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useCrmStore } from '@/stores';

export function useContacts(params) {
  return useQuery({
    queryKey: ['contacts', params],
    queryFn: () => api.get('/crm/contacts', { params }),
  });
}

export function useContact(id) {
  return useQuery({
    queryKey: ['contacts', id],
    queryFn: () => api.get(`/crm/contacts/${id}`),
    enabled: !!id,
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();
  const { addContact } = useCrmStore();

  return useMutation({
    mutationFn: (input) => api.post('/crm/contacts', input),
    onSuccess: (result) => {
      addContact(result.data);
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  const { updateContact } = useCrmStore();

  return useMutation({
    mutationFn: ({ id, data }) => api.patch(`/crm/contacts/${id}`, data),
    onSuccess: (result, { id }) => {
      updateContact(id, result.data);
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  const { removeContact } = useCrmStore();

  return useMutation({
    mutationFn: (id) => api.delete(`/crm/contacts/${id}`),
    onSuccess: (_, id) => {
      removeContact(id);
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useContactTimeline(contactId) {
  return useQuery({
    queryKey: ['contacts', contactId, 'timeline'],
    queryFn: () => api.get(`/crm/contacts/${contactId}/timeline`),
    enabled: !!contactId,
  });
}

export function useContactEngagement(contactId) {
  return useQuery({
    queryKey: ['contacts', contactId, 'engagement'],
    queryFn: () => api.get(`/crm/contacts/${contactId}/engagement`),
    enabled: !!contactId,
  });
}

export function useContactScore(contactId) {
  return useQuery({
    queryKey: ['contacts', contactId, 'score'],
    queryFn: () => api.get(`/crm/contacts/${contactId}/score`),
    enabled: !!contactId,
  });
}

export function useContactActivities(contactId, params = {}) {
  return useQuery({
    queryKey: ['activities', 'contact', contactId, params],
    queryFn: () => api.get('/crm/activities', { params: { contactId, ...params } }),
    enabled: !!contactId,
  });
}

export function useCustomFields(entityType = 'CONTACT') {
  return useQuery({
    queryKey: ['custom-fields', entityType],
    queryFn: () => api.get('/crm/custom-fields', { params: { entityType } }),
    staleTime: 10 * 60 * 1000, // 10 minutes - custom fields don't change often
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.post('/crm/activities', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      if (variables.contactId) {
        queryClient.invalidateQueries({ queryKey: ['contacts', variables.contactId, 'timeline'] });
        queryClient.invalidateQueries({
          queryKey: ['contacts', variables.contactId, 'engagement'],
        });
      }
    },
  });
}

// ============ BULK OPERATIONS ============

export function useBulkDeleteContacts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactIds) => api.delete('/crm/contacts/bulk', { data: { contactIds } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useBulkAddTags() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contactIds, tags, action = 'add' }) =>
      api.post('/crm/contacts/bulk/tags', { contactIds, tags, action }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useBulkUpdateOwner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contactIds, ownerId }) =>
      api.patch('/crm/contacts/bulk/owner', { contactIds, ownerId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useBulkUpdateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contactIds, status, lifecycleStage, leadStatus }) =>
      api.patch('/crm/contacts/bulk/status', {
        contactIds,
        ...(status && { status }),
        ...(lifecycleStage && { lifecycleStage }),
        ...(leadStatus && { leadStatus }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

// ============ DUPLICATE DETECTION & MERGE ============

export function useDuplicateContacts(params = {}) {
  return useQuery({
    queryKey: ['contacts', 'duplicates', params],
    queryFn: () => api.get('/crm/contacts/duplicates', { params }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMergeContacts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ primaryId, duplicateId, fieldSelections }) =>
      api.post('/crm/contacts/merge', { primaryId, duplicateId, fieldSelections }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}
