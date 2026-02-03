'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const dialerKeys = {
  all: ['dialer'],
  logs: (filters) => [...dialerKeys.all, 'logs', filters],
  active: () => [...dialerKeys.all, 'active'],
  stats: (period) => [...dialerKeys.all, 'stats', period],
  powerDialer: () => [...dialerKeys.all, 'power-dialer'],
};

/**
 * Initiate an outbound call
 */
export function useInitiateCall() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ channelAccountId, toNumber, contactId, leadId, dealId, metadata }) => {
      const response = await api.post('/dialer/call', {
        channelAccountId,
        toNumber,
        contactId,
        leadId,
        dealId,
        metadata,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dialerKeys.active() });
      queryClient.invalidateQueries({ queryKey: dialerKeys.logs({}) });
    },
  });
}

/**
 * End an active call
 */
export function useEndCall() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (callId) => {
      const response = await api.post(`/dialer/call/${callId}/end`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dialerKeys.active() });
    },
  });
}

/**
 * Hold a call
 */
export function useHoldCall() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (callId) => {
      const response = await api.post(`/dialer/call/${callId}/hold`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dialerKeys.active() });
    },
  });
}

/**
 * Resume a call from hold
 */
export function useResumeCall() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (callId) => {
      const response = await api.post(`/dialer/call/${callId}/resume`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dialerKeys.active() });
    },
  });
}

/**
 * Transfer a call
 */
export function useTransferCall() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ callId, transferTo }) => {
      const response = await api.post(`/dialer/call/${callId}/transfer`, { transferTo });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dialerKeys.active() });
    },
  });
}

/**
 * Set call disposition
 */
export function useSetCallDisposition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ callId, disposition, notes }) => {
      const response = await api.post(`/dialer/call/${callId}/disposition`, {
        disposition,
        notes,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dialerKeys.logs({}) });
    },
  });
}

/**
 * Add note to a call
 */
export function useAddCallNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ callId, note }) => {
      const response = await api.post(`/dialer/call/${callId}/notes`, { note });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dialerKeys.logs({}) });
    },
  });
}

/**
 * Get call logs
 */
export function useCallLogs(filters = {}) {
  return useQuery({
    queryKey: dialerKeys.logs(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.contactId) params.set('contactId', filters.contactId);
      if (filters.direction) params.set('direction', filters.direction);
      if (filters.status) params.set('status', filters.status);
      if (filters.startDate) params.set('startDate', filters.startDate);
      if (filters.endDate) params.set('endDate', filters.endDate);
      if (filters.page) params.set('page', filters.page);
      if (filters.limit) params.set('limit', filters.limit);
      if (filters.allUsers) params.set('allUsers', 'true');

      const response = await api.get(`/dialer/logs?${params.toString()}`);
      return response;
    },
  });
}

/**
 * Get active calls
 */
export function useActiveCalls() {
  return useQuery({
    queryKey: dialerKeys.active(),
    queryFn: async () => {
      const response = await api.get('/dialer/active');
      return response;
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });
}

/**
 * Get call stats
 */
export function useCallStats(period = 'today') {
  return useQuery({
    queryKey: dialerKeys.stats(period),
    queryFn: async () => {
      const response = await api.get(`/dialer/stats?period=${period}`);
      return response;
    },
  });
}

/**
 * Get call recording
 */
export function useCallRecording(callId) {
  return useQuery({
    queryKey: [...dialerKeys.all, 'recording', callId],
    queryFn: async () => {
      const response = await api.get(`/dialer/call/${callId}/recording`);
      return response;
    },
    enabled: !!callId,
  });
}

/**
 * Start power dialer
 */
export function useStartPowerDialer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ channelAccountId, contacts, settings }) => {
      const response = await api.post('/dialer/power-dialer/start', {
        channelAccountId,
        contacts,
        settings,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dialerKeys.powerDialer() });
    },
  });
}

/**
 * Get power dialer status
 */
export function usePowerDialerStatus() {
  return useQuery({
    queryKey: dialerKeys.powerDialer(),
    queryFn: async () => {
      const response = await api.get('/dialer/power-dialer/status');
      return response;
    },
    refetchInterval: 2000, // Refresh every 2 seconds when active
  });
}

/**
 * Pause power dialer
 */
export function usePausePowerDialer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/dialer/power-dialer/pause');
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dialerKeys.powerDialer() });
    },
  });
}

/**
 * Resume power dialer
 */
export function useResumePowerDialer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/dialer/power-dialer/resume');
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dialerKeys.powerDialer() });
    },
  });
}

/**
 * Stop power dialer
 */
export function useStopPowerDialer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/dialer/power-dialer/stop');
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dialerKeys.powerDialer() });
    },
  });
}

// =====================
// WebRTC Call Logging
// =====================

/**
 * Create a WebRTC call record
 * Call this when initiating a call via PIOPIY SDK
 */
export function useCreateWebRTCCall() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ toNumber, contactId, direction = 'OUTBOUND' }) => {
      const response = await api.post('/dialer/webrtc-call', {
        toNumber,
        contactId,
        direction,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dialerKeys.logs({}) });
    },
  });
}

/**
 * Update a WebRTC call record
 * Call this when call status changes or ends
 */
export function useUpdateWebRTCCall() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ callId, status, duration, endedAt }) => {
      const response = await api.patch(`/dialer/webrtc-call/${callId}`, {
        status,
        duration,
        endedAt,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dialerKeys.logs({}) });
    },
  });
}
