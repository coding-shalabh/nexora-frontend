'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

/**
 * Get list of templates with filters
 */
export function useTemplates(options = {}) {
  const { type, category, isActive, search } = options;

  return useQuery({
    queryKey: ['templates', { type, category, isActive, search }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (category) params.append('category', category);
      if (isActive !== undefined) params.append('isActive', isActive);
      if (search) params.append('search', search);

      const response = await api.get(`/templates?${params.toString()}`);
      return response.data;
    },
  });
}

/**
 * Get email templates only
 */
export function useEmailTemplates(options = {}) {
  return useTemplates({ ...options, type: 'email' });
}

/**
 * Get single template
 */
export function useTemplate(id) {
  return useQuery({
    queryKey: ['templates', id],
    queryFn: async () => {
      const response = await api.get(`/templates/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Get template stats
 */
export function useTemplateStats() {
  return useQuery({
    queryKey: ['templates', 'stats'],
    queryFn: async () => {
      const response = await api.get('/templates/stats');
      return response.data;
    },
  });
}

/**
 * Create a template
 */
export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templateData) => {
      const response = await api.post('/templates', templateData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
}

/**
 * Update a template
 */
export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await api.patch(`/templates/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      queryClient.invalidateQueries({ queryKey: ['templates', id] });
    },
  });
}

/**
 * Delete a template
 */
export function useDeleteTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/templates/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
}

/**
 * Duplicate a template
 */
export function useDuplicateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.post(`/templates/${id}/duplicate`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
}

/**
 * Render template with variables (preview)
 */
export function useRenderTemplate() {
  return useMutation({
    mutationFn: async ({ id, variables }) => {
      const response = await api.post(`/templates/${id}/render`, { variables });
      return response.data;
    },
  });
}
