'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useCrmStore } from '@/stores';

export function useActivities(params) {
  return useQuery({
    queryKey: ['activities', params],
    queryFn: () => api.get('/crm/activities', { params }),
  });
}

export function useActivity(id) {
  return useQuery({
    queryKey: ['activities', id],
    queryFn: () => api.get(`/crm/activities/${id}`),
    enabled: !!id,
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  const { setActivities } = useCrmStore();

  return useMutation({
    mutationFn: (input) => api.post('/crm/activities', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => api.patch(`/crm/activities/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => api.delete(`/crm/activities/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}

export function useContactActivities(contactId) {
  return useQuery({
    queryKey: ['contacts', contactId, 'activities'],
    queryFn: () => api.get(`/crm/contacts/${contactId}/activities`),
    enabled: !!contactId,
  });
}
