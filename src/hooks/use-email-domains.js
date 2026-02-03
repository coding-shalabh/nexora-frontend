'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Get all custom domains for tenant
export function useEmailDomains() {
  return useQuery({
    queryKey: ['email-domains'],
    queryFn: async () => {
      const response = await api.get('/email-domains');
      return response.data || [];
    },
  });
}

// Get current sending domain configuration
export function useSendingDomain() {
  return useQuery({
    queryKey: ['email-domains', 'sending'],
    queryFn: async () => {
      const response = await api.get('/email-domains/sending');
      return response.data;
    },
  });
}

// Get domain details with DNS records
export function useEmailDomain(domainId) {
  return useQuery({
    queryKey: ['email-domains', domainId],
    queryFn: async () => {
      if (!domainId) return null;
      const response = await api.get(`/email-domains/${domainId}`);
      return response.data;
    },
    enabled: !!domainId,
  });
}

// Add a new domain
export function useAddEmailDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/email-domains', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-domains'] });
    },
  });
}

// Verify domain status
export function useVerifyEmailDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (domainId) => {
      const response = await api.post(`/email-domains/${domainId}/verify`);
      return response.data;
    },
    onSuccess: (data, domainId) => {
      queryClient.invalidateQueries({ queryKey: ['email-domains'] });
      queryClient.invalidateQueries({ queryKey: ['email-domains', domainId] });
    },
  });
}

// Set default domain
export function useSetDefaultDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (domainId) => {
      const response = await api.post(`/email-domains/${domainId}/set-default`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-domains'] });
      queryClient.invalidateQueries({ queryKey: ['email-domains', 'sending'] });
    },
  });
}

// Update domain settings
export function useUpdateEmailDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ domainId, data }) => {
      const response = await api.patch(`/email-domains/${domainId}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['email-domains'] });
      queryClient.invalidateQueries({ queryKey: ['email-domains', variables.domainId] });
    },
  });
}

// Delete domain
export function useDeleteEmailDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (domainId) => {
      const response = await api.delete(`/email-domains/${domainId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-domains'] });
      queryClient.invalidateQueries({ queryKey: ['email-domains', 'sending'] });
    },
  });
}
