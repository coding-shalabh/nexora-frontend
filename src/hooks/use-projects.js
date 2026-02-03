'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Projects
export function useProjects(params) {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => api.get('/projects', { params }),
  });
}

export function useProject(id) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => api.get(`/projects/${id}`),
    enabled: !!id,
  });
}

export function useProjectStats(id) {
  return useQuery({
    queryKey: ['projects', id, 'stats'],
    queryFn: () => api.get(`/projects/${id}/stats`),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.post('/projects', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => api.patch(`/projects/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', id] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => api.delete(`/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

// Project Members
export function useAddProjectMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, userId, role }) =>
      api.post(`/projects/${projectId}/members`, { userId, role }),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] });
    },
  });
}

export function useRemoveProjectMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, userId }) =>
      api.delete(`/projects/${projectId}/members/${userId}`),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] });
    },
  });
}

// Milestones
export function useMilestones(projectId) {
  return useQuery({
    queryKey: ['projects', projectId, 'milestones'],
    queryFn: () => api.get(`/projects/${projectId}/milestones`),
    enabled: !!projectId,
  });
}

export function useCreateMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }) =>
      api.post(`/projects/${projectId}/milestones`, data),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'milestones'] });
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] });
    },
  });
}

export function useUpdateMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ milestoneId, data }) =>
      api.patch(`/projects/milestones/${milestoneId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useDeleteMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (milestoneId) => api.delete(`/projects/milestones/${milestoneId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

// Time Entries
export function useTimeEntries(params) {
  return useQuery({
    queryKey: ['time-entries', params],
    queryFn: () => api.get('/projects/time-entries', { params }),
  });
}

export function useCreateTimeEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.post('/projects/time-entries', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTimeEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ entryId, data }) =>
      api.patch(`/projects/time-entries/${entryId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] });
    },
  });
}

export function useDeleteTimeEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entryId) => api.delete(`/projects/time-entries/${entryId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] });
    },
  });
}
