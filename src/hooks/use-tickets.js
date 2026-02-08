'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useTickets(params) {
  return useQuery({
    queryKey: ['tickets', params],
    queryFn: async () => {
      const result = await api.get('/tickets', { params });
      return result;
    },
  });
}

export function useTicket(id) {
  return useQuery({
    queryKey: ['tickets', id],
    queryFn: () => api.get(`/tickets/${id}`),
    enabled: !!id,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input) => api.post('/tickets', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => api.patch(`/tickets/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useAssignTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, assignedTo }) => api.patch(`/tickets/${id}/assign`, { assignedTo }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useResolveTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => api.patch(`/tickets/${id}/resolve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useAddTicketComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, content, isInternal }) =>
      api.post(`/tickets/${id}/comments`, { content, isInternal }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['tickets', id] });
    },
  });
}

export function usePipelines(type) {
  return useQuery({
    queryKey: ['pipelines', type],
    queryFn: async () => {
      const result = await api.get('/pipeline/pipelines', { params: { type } });
      return result;
    },
  });
}

export function useStages(pipelineId) {
  return useQuery({
    queryKey: ['stages', pipelineId],
    queryFn: async () => {
      const result = await api.get('/pipeline/stages', { params: { pipelineId } });
      return result;
    },
    enabled: !!pipelineId,
  });
}
