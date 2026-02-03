'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useCrmStore } from '@/stores';

export function useCompanies(params) {
  return useQuery({
    queryKey: ['companies', params],
    queryFn: () => api.get('/crm/companies', { params }),
  });
}

export function useCompany(id) {
  return useQuery({
    queryKey: ['companies', id],
    queryFn: () => api.get(`/crm/companies/${id}`),
    enabled: !!id,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  const { addCompany } = useCrmStore();

  return useMutation({
    mutationFn: (input) => api.post('/crm/companies', input),
    onSuccess: (result) => {
      if (result?.data) {
        addCompany(result.data);
      }
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  const { updateCompany } = useCrmStore();

  return useMutation({
    mutationFn: ({ id, data }) => api.patch(`/crm/companies/${id}`, data),
    onSuccess: (result, { id }) => {
      if (result?.data) {
        updateCompany(id, result.data);
      }
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();
  const { removeCompany } = useCrmStore();

  return useMutation({
    mutationFn: (id) => api.delete(`/crm/companies/${id}`),
    onSuccess: (_, id) => {
      removeCompany(id);
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
}

export function useCompanyContacts(companyId) {
  return useQuery({
    queryKey: ['companies', companyId, 'contacts'],
    queryFn: () => api.get(`/crm/companies/${companyId}/contacts`),
    enabled: !!companyId,
  });
}
