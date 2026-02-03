'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Tasks
export function useTasks(params) {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: () => api.get('/tasks', { params }),
  });
}

export function useTask(id) {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => api.get(`/tasks/${id}`),
    enabled: !!id,
  });
}

export function useMyTasks(params) {
  return useQuery({
    queryKey: ['tasks', 'my-tasks', params],
    queryFn: () => api.get('/tasks/my-tasks', { params }),
  });
}

export function useUpcomingTasks(days = 7) {
  return useQuery({
    queryKey: ['tasks', 'upcoming', days],
    queryFn: () => api.get('/tasks/upcoming', { params: { days } }),
  });
}

export function useTaskStats(params) {
  return useQuery({
    queryKey: ['tasks', 'stats', params],
    queryFn: () => api.get('/tasks/stats', { params }),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.post('/tasks', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => api.patch(`/tasks/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useReorderTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tasks) => api.post('/tasks/reorder', { tasks }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

// Checklists
export function useChecklists(taskId) {
  return useQuery({
    queryKey: ['tasks', taskId, 'checklists'],
    queryFn: () => api.get(`/tasks/${taskId}/checklists`),
    enabled: !!taskId,
  });
}

export function useAddChecklistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, data }) => api.post(`/tasks/${taskId}/checklists`, data),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId, 'checklists'] });
    },
  });
}

export function useUpdateChecklistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, data }) => api.patch(`/tasks/checklists/${itemId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useDeleteChecklistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId) => api.delete(`/tasks/checklists/${itemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

// Comments
export function useTaskComments(taskId) {
  return useQuery({
    queryKey: ['tasks', taskId, 'comments'],
    queryFn: () => api.get(`/tasks/${taskId}/comments`),
    enabled: !!taskId,
  });
}

export function useAddTaskComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, content }) => api.post(`/tasks/${taskId}/comments`, { content }),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId, 'comments'] });
    },
  });
}

export function useUpdateTaskComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }) =>
      api.patch(`/tasks/comments/${commentId}`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useDeleteTaskComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId) => api.delete(`/tasks/comments/${commentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

// Attachments
export function useTaskAttachments(taskId) {
  return useQuery({
    queryKey: ['tasks', taskId, 'attachments'],
    queryFn: () => api.get(`/tasks/${taskId}/attachments`),
    enabled: !!taskId,
  });
}

export function useAddTaskAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, data }) => api.post(`/tasks/${taskId}/attachments`, data),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId, 'attachments'] });
    },
  });
}

export function useDeleteTaskAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attachmentId) => api.delete(`/tasks/attachments/${attachmentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

// Dependencies
export function useAddTaskDependency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, dependsOnTaskId, type }) =>
      api.post(`/tasks/${taskId}/dependencies`, { dependsOnTaskId, type }),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
    },
  });
}

export function useRemoveTaskDependency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, dependsOnTaskId }) =>
      api.delete(`/tasks/${taskId}/dependencies/${dependsOnTaskId}`),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
    },
  });
}
