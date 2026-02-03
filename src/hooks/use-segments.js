'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useSegments(params) {
  return useQuery({
    queryKey: ['segments', params],
    queryFn: () => api.get('/crm/segments', { params }),
  });
}

export function useSegment(id) {
  return useQuery({
    queryKey: ['segments', id],
    queryFn: () => api.get(`/crm/segments/${id}`),
    enabled: !!id,
  });
}

export function useCreateSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.post('/crm/segments', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['segments'] });
    },
  });
}

export function useUpdateSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => api.patch(`/crm/segments/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['segments'] });
    },
  });
}

export function useDeleteSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => api.delete(`/crm/segments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['segments'] });
    },
  });
}

export function useRefreshSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => api.post(`/crm/segments/${id}/refresh`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['segments'] });
    },
  });
}
