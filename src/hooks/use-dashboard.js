'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Query keys
export const dashboardKeys = {
  all: ['dashboard'],
  home: () => [...dashboardKeys.all, 'home'],
  stats: () => [...dashboardKeys.all, 'stats'],
  pipeline: (params) => [...dashboardKeys.all, 'pipeline', params],
  inbox: (params) => [...dashboardKeys.all, 'inbox', params],
  team: (params) => [...dashboardKeys.all, 'team', params],
  activities: () => [...dashboardKeys.all, 'activities'],
  conversations: () => [...dashboardKeys.all, 'conversations'],
  activityFeed: (params) => [...dashboardKeys.all, 'activityFeed', params],
};

/**
 * Fetch home dashboard data (KPIs, activity, tasks, stats)
 */
export function useHomeDashboard() {
  return useQuery({
    queryKey: dashboardKeys.home(),
    queryFn: async () => {
      const response = await api.get('/dashboard');
      return response.data;
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
}

/**
 * Fetch activity feed with pagination
 */
export function useActivityFeed({ page = 1, limit = 20 } = {}) {
  return useQuery({
    queryKey: dashboardKeys.activityFeed({ page, limit }),
    queryFn: async () => {
      const response = await api.get('/dashboard/activity', {
        params: { page, limit },
      });
      return response;
    },
    staleTime: 30000,
  });
}

/**
 * Fetch dashboard overview stats
 */
export function useDashboardStats(params = {}) {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.startDate) searchParams.set('startDate', params.startDate);
      if (params.endDate) searchParams.set('endDate', params.endDate);

      const response = await api.get(`/analytics/dashboard?${searchParams.toString()}`);
      return response.data;
    },
    staleTime: 60000, // 1 minute
  });
}

/**
 * Fetch pipeline metrics
 */
export function usePipelineMetrics(params = {}) {
  return useQuery({
    queryKey: dashboardKeys.pipeline(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.pipelineId) searchParams.set('pipelineId', params.pipelineId);
      if (params.startDate) searchParams.set('startDate', params.startDate);
      if (params.endDate) searchParams.set('endDate', params.endDate);

      const response = await api.get(`/analytics/pipeline?${searchParams.toString()}`);
      return response.data;
    },
    staleTime: 60000,
  });
}

/**
 * Fetch inbox metrics
 */
export function useInboxMetrics(params = {}) {
  return useQuery({
    queryKey: dashboardKeys.inbox(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.startDate) searchParams.set('startDate', params.startDate);
      if (params.endDate) searchParams.set('endDate', params.endDate);

      const response = await api.get(`/analytics/inbox?${searchParams.toString()}`);
      return response.data;
    },
    staleTime: 60000,
  });
}

/**
 * Fetch team performance metrics
 */
export function useTeamPerformance(params = {}) {
  return useQuery({
    queryKey: dashboardKeys.team(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.startDate) searchParams.set('startDate', params.startDate);
      if (params.endDate) searchParams.set('endDate', params.endDate);

      const response = await api.get(`/analytics/team?${searchParams.toString()}`);
      return response.data;
    },
    staleTime: 60000,
  });
}

/**
 * Fetch recent activities
 */
export function useRecentActivities(limit = 10) {
  return useQuery({
    queryKey: dashboardKeys.activities(),
    queryFn: async () => {
      const response = await api.get(`/crm/activities?limit=${limit}`);
      return response.data;
    },
    staleTime: 30000,
  });
}

/**
 * Fetch recent conversations
 */
export function useRecentConversations(limit = 5) {
  return useQuery({
    queryKey: dashboardKeys.conversations(),
    queryFn: async () => {
      const response = await api.get(`/inbox/conversations?limit=${limit}`);
      return response.data;
    },
    staleTime: 30000,
  });
}
