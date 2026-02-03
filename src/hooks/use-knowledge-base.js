'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

// ==========================================
// KB STATS
// ==========================================

export function useKBStats() {
  return useQuery({
    queryKey: ['kb', 'stats'],
    queryFn: async () => {
      const response = await api.get('/kb/stats');
      return response.data;
    },
  });
}

// ==========================================
// CATEGORIES
// ==========================================

export function useKBCategories(filters = {}) {
  return useQuery({
    queryKey: ['kb', 'categories', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.parentId) params.set('parentId', filters.parentId);
      if (filters.isPublished !== undefined) params.set('isPublished', filters.isPublished);

      const response = await api.get(`/kb/categories?${params}`);
      return response.data;
    },
  });
}

export function useKBCategory(categoryId) {
  return useQuery({
    queryKey: ['kb', 'categories', categoryId],
    queryFn: async () => {
      const response = await api.get(`/kb/categories/${categoryId}`);
      return response.data;
    },
    enabled: !!categoryId,
  });
}

export function useCreateKBCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/kb/categories', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kb', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['kb', 'stats'] });
      toast.success('Category created');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create category');
    },
  });
}

export function useUpdateKBCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.patch(`/kb/categories/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kb', 'categories'] });
      toast.success('Category updated');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update category');
    },
  });
}

export function useDeleteKBCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/kb/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kb', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['kb', 'stats'] });
      toast.success('Category deleted');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    },
  });
}

// ==========================================
// ARTICLES
// ==========================================

export function useKBArticles(filters = {}) {
  return useQuery({
    queryKey: ['kb', 'articles', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set('page', filters.page);
      if (filters.limit) params.set('limit', filters.limit);
      if (filters.categoryId) params.set('categoryId', filters.categoryId);
      if (filters.status) params.set('status', filters.status);
      if (filters.isPublished !== undefined) params.set('isPublished', filters.isPublished);
      if (filters.isFeatured !== undefined) params.set('isFeatured', filters.isFeatured);
      if (filters.search) params.set('search', filters.search);
      if (filters.orderBy) params.set('orderBy', filters.orderBy);

      const response = await api.get(`/kb/articles?${params}`);
      return {
        articles: response.data,
        meta: response.meta,
      };
    },
  });
}

export function useKBArticle(articleId) {
  return useQuery({
    queryKey: ['kb', 'articles', articleId],
    queryFn: async () => {
      const response = await api.get(`/kb/articles/${articleId}`);
      return response.data;
    },
    enabled: !!articleId,
  });
}

export function useKBArticleBySlug(slug) {
  return useQuery({
    queryKey: ['kb', 'articles', 'slug', slug],
    queryFn: async () => {
      const response = await api.get(`/kb/articles/slug/${slug}`);
      return response.data;
    },
    enabled: !!slug,
  });
}

export function useCreateKBArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/kb/articles', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kb', 'articles'] });
      queryClient.invalidateQueries({ queryKey: ['kb', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['kb', 'stats'] });
      toast.success('Article created');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create article');
    },
  });
}

export function useUpdateKBArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.patch(`/kb/articles/${id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['kb', 'articles'] });
      queryClient.invalidateQueries({ queryKey: ['kb', 'categories'] });
      toast.success('Article updated');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update article');
    },
  });
}

export function useDeleteKBArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/kb/articles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kb', 'articles'] });
      queryClient.invalidateQueries({ queryKey: ['kb', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['kb', 'stats'] });
      toast.success('Article deleted');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete article');
    },
  });
}

export function useVoteKBArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, helpful }) => {
      const response = await api.post(`/kb/articles/${id}/vote`, { helpful });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['kb', 'articles', variables.id] });
      toast.success('Thanks for your feedback!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit vote');
    },
  });
}
