'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Get all calendar events
export function useCalendarEvents(params) {
  return useQuery({
    queryKey: ['calendar', 'events', params],
    queryFn: () => api.get('/calendar', { params }),
  });
}

// Get single event
export function useCalendarEvent(id) {
  return useQuery({
    queryKey: ['calendar', 'events', id],
    queryFn: () => api.get(`/calendar/${id}`),
    enabled: !!id,
  });
}

// Get upcoming events
export function useUpcomingEvents(days = 7) {
  return useQuery({
    queryKey: ['calendar', 'upcoming', days],
    queryFn: () => api.get('/calendar/upcoming', { params: { days } }),
  });
}

// Get event statistics
export function useCalendarStats(params) {
  return useQuery({
    queryKey: ['calendar', 'stats', params],
    queryFn: () => api.get('/calendar/stats', { params }),
  });
}

// Create event
export function useCreateCalendarEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.post('/calendar', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });
}

// Update event
export function useUpdateCalendarEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => api.patch(`/calendar/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
      queryClient.invalidateQueries({ queryKey: ['calendar', 'events', id] });
    },
  });
}

// Delete event
export function useDeleteCalendarEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => api.delete(`/calendar/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });
}
