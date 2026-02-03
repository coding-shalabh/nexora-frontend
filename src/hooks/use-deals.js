'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { usePipelineStore } from '@/stores';

export function usePipelines(type) {
  const { setPipelines } = usePipelineStore();

  return useQuery({
    queryKey: ['pipelines', type],
    queryFn: async () => {
      const result = await api.get('/pipeline/pipelines', {
        params: { type },
      });
      setPipelines(result.data);
      return result;
    },
  });
}

export function useDeals(params) {
  const { setDeals, setLoading } = usePipelineStore();

  return useQuery({
    queryKey: ['deals', params],
    queryFn: async () => {
      setLoading(true);
      try {
        const result = await api.get('/pipeline/deals', { params });
        setDeals(result.data);
        return result;
      } finally {
        setLoading(false);
      }
    },
  });
}

export function useDeal(id) {
  return useQuery({
    queryKey: ['deals', id],
    queryFn: () => api.get(`/pipeline/deals/${id}`),
    enabled: !!id,
  });
}

export function useCreateDeal() {
  const queryClient = useQueryClient();
  const { addDeal } = usePipelineStore();

  return useMutation({
    mutationFn: (input) => api.post('/pipeline/deals', input),
    onSuccess: (result) => {
      addDeal(result.data);
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });
}

export function useUpdateDeal() {
  const queryClient = useQueryClient();
  const { updateDeal } = usePipelineStore();

  return useMutation({
    mutationFn: ({ id, data }) => api.patch(`/pipeline/deals/${id}`, data),
    onSuccess: (result, { id }) => {
      updateDeal(id, result.data);
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });
}

export function useMoveDeal() {
  const queryClient = useQueryClient();
  const { moveDeal } = usePipelineStore();

  return useMutation({
    mutationFn: ({ id, stageId }) =>
      api.patch(`/pipeline/deals/${id}/move`, { stageId }),
    onSuccess: (_, { id, stageId }) => {
      moveDeal(id, stageId);
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });
}

export function useWinDeal() {
  const queryClient = useQueryClient();
  const { updateDeal } = usePipelineStore();

  return useMutation({
    mutationFn: (id) => api.patch(`/pipeline/deals/${id}/win`),
    onSuccess: (_, id) => {
      updateDeal(id, { status: 'won' });
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });
}

export function useLoseDeal() {
  const queryClient = useQueryClient();
  const { updateDeal } = usePipelineStore();

  return useMutation({
    mutationFn: ({ id, reason }) =>
      api.patch(`/pipeline/deals/${id}/lose`, { reason }),
    onSuccess: (_, { id }) => {
      updateDeal(id, { status: 'lost' });
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });
}

export function useDeleteDeal() {
  const queryClient = useQueryClient();
  const { removeDeal } = usePipelineStore();

  return useMutation({
    mutationFn: (id) => api.delete(`/pipeline/deals/${id}`),
    onSuccess: (_, id) => {
      removeDeal(id);
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });
}
