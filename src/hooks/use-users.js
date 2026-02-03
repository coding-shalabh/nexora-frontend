'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useUsers(params = {}) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => api.get('/settings/users', { params }),
  });
}

export function useUser(id) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => api.get(`/settings/users/${id}`),
    enabled: !!id,
  });
}

export function usePendingInvitations() {
  return useQuery({
    queryKey: ['pendingInvitations'],
    queryFn: () => api.get('/settings/users/invitations'),
  });
}

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: () => api.get('/settings/teams'),
  });
}

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => api.get('/settings/roles'),
  });
}

export function useInviteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.post('/settings/users/invite', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['pendingInvitations'] });
    },
  });
}

export function useResendInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => api.post(`/settings/users/${userId}/resend-invitation`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingInvitations'] });
    },
  });
}

export function useRevokeInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => api.delete(`/settings/users/${userId}/invitation`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['pendingInvitations'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }) => api.patch(`/settings/users/${userId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => api.delete(`/settings/users/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Team mutations
export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.post('/settings/teams', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}

export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, data }) => api.patch(`/settings/teams/${teamId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teamId) => api.delete(`/settings/teams/${teamId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}

// Team members
export function useTeamMembers(teamId) {
  return useQuery({
    queryKey: ['teamMembers', teamId],
    queryFn: () => api.get(`/settings/teams/${teamId}/members`),
    enabled: !!teamId,
  });
}

export function useAddTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, data }) => api.post(`/settings/teams/${teamId}/members`, data),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers', teamId] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}

export function useRemoveTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, userId }) => api.delete(`/settings/teams/${teamId}/members/${userId}`),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers', teamId] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}
