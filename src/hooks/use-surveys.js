'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

// ==========================================
// SURVEY STATS
// ==========================================

export function useSurveyStats() {
  return useQuery({
    queryKey: ['surveys', 'stats'],
    queryFn: async () => {
      const response = await api.get('/surveys/stats');
      return response.data;
    },
  });
}

// ==========================================
// SURVEYS
// ==========================================

export function useSurveys(filters = {}) {
  return useQuery({
    queryKey: ['surveys', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set('page', filters.page);
      if (filters.limit) params.set('limit', filters.limit);
      if (filters.status) params.set('status', filters.status);
      if (filters.type) params.set('type', filters.type);
      if (filters.search) params.set('search', filters.search);

      const response = await api.get(`/surveys?${params}`);
      return {
        surveys: response.data,
        meta: response.meta,
      };
    },
  });
}

export function useSurvey(surveyId) {
  return useQuery({
    queryKey: ['surveys', surveyId],
    queryFn: async () => {
      const response = await api.get(`/surveys/${surveyId}`);
      return response.data;
    },
    enabled: !!surveyId,
  });
}

export function useSurveyAnalytics(surveyId) {
  return useQuery({
    queryKey: ['surveys', surveyId, 'analytics'],
    queryFn: async () => {
      const response = await api.get(`/surveys/${surveyId}/analytics`);
      return response.data;
    },
    enabled: !!surveyId,
  });
}

export function useCreateSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/surveys', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      toast.success('Survey created');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create survey');
    },
  });
}

export function useUpdateSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.patch(`/surveys/${id}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      queryClient.invalidateQueries({ queryKey: ['surveys', variables.id] });
      toast.success('Survey updated');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update survey');
    },
  });
}

export function useDeleteSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/surveys/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      toast.success('Survey deleted');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete survey');
    },
  });
}

export function useDuplicateSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.post(`/surveys/${id}/duplicate`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      toast.success('Survey duplicated');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to duplicate survey');
    },
  });
}

// ==========================================
// QUESTIONS
// ==========================================

export function useAddSurveyQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ surveyId, data }) => {
      const response = await api.post(`/surveys/${surveyId}/questions`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['surveys', variables.surveyId] });
      toast.success('Question added');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add question');
    },
  });
}

export function useUpdateSurveyQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ surveyId, questionId, data }) => {
      const response = await api.patch(`/surveys/${surveyId}/questions/${questionId}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['surveys', variables.surveyId] });
      toast.success('Question updated');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update question');
    },
  });
}

export function useDeleteSurveyQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ surveyId, questionId }) => {
      await api.delete(`/surveys/${surveyId}/questions/${questionId}`);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['surveys', variables.surveyId] });
      toast.success('Question deleted');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete question');
    },
  });
}

// ==========================================
// RESPONSES
// ==========================================

export function useSurveyResponses(surveyId, filters = {}) {
  return useQuery({
    queryKey: ['surveys', surveyId, 'responses', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set('page', filters.page);
      if (filters.limit) params.set('limit', filters.limit);

      const response = await api.get(`/surveys/${surveyId}/responses?${params}`);
      return {
        responses: response.data,
        meta: response.meta,
      };
    },
    enabled: !!surveyId,
  });
}

export function useSubmitSurveyResponse() {
  return useMutation({
    mutationFn: async ({ surveyId, data }) => {
      const response = await api.post(`/surveys/${surveyId}/submit`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Response submitted');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit response');
    },
  });
}
