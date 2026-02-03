'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => api.get('/crm/tags'),
  })
}

export function useTag(id) {
  return useQuery({
    queryKey: ['tags', id],
    queryFn: () => api.get(`/crm/tags/${id}`),
    enabled: !!id,
  })
}

export function useCreateTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => api.post('/crm/tags', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}

export function useUpdateTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => api.patch(`/crm/tags/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}

export function useDeleteTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => api.delete(`/crm/tags/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}
