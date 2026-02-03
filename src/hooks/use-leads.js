'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { usePipelineStore } from '@/stores';

export function useLeads(params) {
  const { setLeads, setLoading } = usePipelineStore();

  return useQuery({
    queryKey: ['leads', params],
    queryFn: async () => {
      setLoading(true);
      try {
        const result = await api.get('/crm/leads', { params });
        if (result?.data) {
          setLeads(result.data);
        }
        return result;
      } finally {
        setLoading(false);
      }
    },
  });
}

export function useLead(id) {
  return useQuery({
    queryKey: ['leads', id],
    queryFn: () => api.get(`/crm/leads/${id}`),
    enabled: !!id,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  const { addLead } = usePipelineStore();

  return useMutation({
    mutationFn: (input) => api.post('/crm/leads', input),
    onSuccess: (result) => {
      if (result?.data) {
        addLead(result.data);
      }
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  const { updateLead } = usePipelineStore();

  return useMutation({
    mutationFn: ({ id, data }) => api.patch(`/crm/leads/${id}`, data),
    onSuccess: (result, { id }) => {
      if (result?.data) {
        updateLead(id, result.data);
      }
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

export function useConvertLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => api.post(`/crm/leads/${id}/convert`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();
  const { removeLead } = usePipelineStore();

  return useMutation({
    mutationFn: (id) => api.delete(`/crm/leads/${id}`),
    onSuccess: (_, id) => {
      removeLead(id);
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

export function useQualifyLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => api.post(`/crm/leads/${id}/qualify`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}
