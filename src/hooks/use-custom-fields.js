'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

/**
 * Hook to fetch custom fields for a specific entity type
 */
export function useCustomFields(entityType) {
  return useQuery({
    queryKey: ['custom-fields', entityType],
    queryFn: async () => {
      const params = entityType ? { entityType: entityType.toUpperCase() } : {};
      const result = await api.get('/crm/custom-fields', { params });
      return result;
    },
  });
}

/**
 * Hook to fetch a single custom field
 */
export function useCustomField(fieldId) {
  return useQuery({
    queryKey: ['custom-fields', fieldId],
    queryFn: () => api.get(`/crm/custom-fields/${fieldId}`),
    enabled: !!fieldId,
  });
}

/**
 * Hook to create a custom field
 */
export function useCreateCustomField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.post('/crm/custom-fields', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields', variables.entityType] });
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] });
    },
  });
}

/**
 * Hook to update a custom field
 */
export function useUpdateCustomField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => api.patch(`/crm/custom-fields/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] });
    },
  });
}

/**
 * Hook to delete a custom field
 */
export function useDeleteCustomField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => api.delete(`/crm/custom-fields/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] });
    },
  });
}

/**
 * Hook to reorder custom fields
 */
export function useReorderCustomFields() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ entityType, fieldIds }) =>
      api.post('/crm/custom-fields/reorder', { entityType, fieldIds }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields', variables.entityType] });
    },
  });
}
