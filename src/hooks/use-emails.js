'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

/**
 * Get list of emails with pagination and filters
 */
export function useEmails(options = {}) {
  const { page = 1, limit = 25, status, direction, contactId, dealId, search } = options;

  return useQuery({
    queryKey: ['emails', { page, limit, status, direction, contactId, dealId, search }],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (status) params.append('status', status);
      if (direction) params.append('direction', direction);
      if (contactId) params.append('contactId', contactId);
      if (dealId) params.append('dealId', dealId);
      if (search) params.append('search', search);

      const response = await api.get(`/email/list?${params.toString()}`);
      return response.data;
    },
  });
}

/**
 * Get single email with tracking details
 */
export function useEmail(id) {
  return useQuery({
    queryKey: ['emails', id],
    queryFn: async () => {
      const response = await api.get(`/email/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Get email analytics
 */
export function useEmailAnalytics(options = {}) {
  const { startDate, endDate } = options;

  return useQuery({
    queryKey: ['email-analytics', { startDate, endDate }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await api.get(`/email/analytics?${params.toString()}`);
      return response.data;
    },
  });
}

/**
 * Send an email
 */
export function useSendEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (emailData) => {
      const response = await api.post('/email/send', emailData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      queryClient.invalidateQueries({ queryKey: ['email-analytics'] });
    },
  });
}

/**
 * Delete an email
 */
export function useDeleteEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/email/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      queryClient.invalidateQueries({ queryKey: ['email-analytics'] });
    },
  });
}

/**
 * Get contact's email history
 */
export function useContactEmails(contactId, options = {}) {
  const { page = 1, limit = 20 } = options;

  return useQuery({
    queryKey: ['emails', 'contact', contactId, { page, limit }],
    queryFn: async () => {
      const response = await api.get(
        `/email/list?contactId=${contactId}&page=${page}&limit=${limit}`
      );
      return response.data;
    },
    enabled: !!contactId,
  });
}

/**
 * Get deal's email history
 */
export function useDealEmails(dealId, options = {}) {
  const { page = 1, limit = 20 } = options;

  return useQuery({
    queryKey: ['emails', 'deal', dealId, { page, limit }],
    queryFn: async () => {
      const response = await api.get(`/email/list?dealId=${dealId}&page=${page}&limit=${limit}`);
      return response.data;
    },
    enabled: !!dealId,
  });
}
