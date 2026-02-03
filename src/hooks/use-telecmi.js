'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============ Query Keys ============
export const telecmiKeys = {
  all: ['telecmi'],
  config: () => [...telecmiKeys.all, 'config'],
  agents: (params) => [...telecmiKeys.all, 'agents', params],
  calls: (params) => [...telecmiKeys.all, 'calls', params],
};

// ============ TeleCMI Agent Store (persisted) ============
export const useTelecmiStore = create(
  persist(
    (set, get) => ({
      // Agent session state
      agentToken: null,
      agentInfo: null,
      agentPassword: null, // Store password for WebRTC login
      isLoggedIn: false,

      // Set agent session after login
      setAgentSession: (token, agent, password = null) =>
        set({
          agentToken: token,
          agentInfo: agent,
          agentPassword: password,
          isLoggedIn: true,
        }),

      // Clear agent session on logout
      clearAgentSession: () =>
        set({
          agentToken: null,
          agentInfo: null,
          agentPassword: null,
          isLoggedIn: false,
        }),

      // Get agent ID for API calls
      getAgentId: () => {
        const { agentInfo } = get();
        return agentInfo?.id || agentInfo?.agent_id || null;
      },
    }),
    {
      name: 'telecmi-agent-storage',
      partialize: (state) => ({
        agentToken: state.agentToken,
        agentInfo: state.agentInfo,
        agentPassword: state.agentPassword,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);

// ============ Config ============

/**
 * Get TeleCMI config (app ID, SDK URL)
 */
export function useTelecmiConfig() {
  return useQuery({
    queryKey: telecmiKeys.config(),
    queryFn: async () => {
      const response = await api.get('/telecmi/config');
      return response.data;
    },
    staleTime: Infinity, // Config doesn't change often
  });
}

// ============ Agents ============

/**
 * Get all TeleCMI agents
 */
export function useTelecmiAgents(page = 1, limit = 10) {
  return useQuery({
    queryKey: telecmiKeys.agents({ page, limit }),
    queryFn: async () => {
      const response = await api.get('/telecmi/agents', {
        params: { page, limit },
      });
      return response.data;
    },
  });
}

/**
 * Create a new TeleCMI agent
 */
export function useCreateTelecmiAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ extension, name, phoneNumber, password }) => {
      const response = await api.post('/telecmi/agents', {
        extension,
        name,
        phoneNumber,
        password,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: telecmiKeys.agents({}) });
    },
  });
}

/**
 * Update a TeleCMI agent
 */
export function useUpdateTelecmiAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ extension, name, phoneNumber, password }) => {
      const response = await api.patch(`/telecmi/agents/${extension}`, {
        name,
        phoneNumber,
        password,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: telecmiKeys.agents({}) });
    },
  });
}

/**
 * Delete a TeleCMI agent
 */
export function useDeleteTelecmiAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (extension) => {
      const response = await api.delete(`/telecmi/agents/${extension}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: telecmiKeys.agents({}) });
    },
  });
}

// ============ Auth ============

/**
 * Login TeleCMI agent
 */
export function useLoginTelecmiAgent() {
  const { setAgentSession } = useTelecmiStore();

  return useMutation({
    mutationFn: async ({ extension, password }) => {
      const response = await api.post('/telecmi/auth/login', {
        extension,
        password,
      });
      // Return password along with response for WebRTC login
      return { ...response.data, password };
    },
    onSuccess: (data) => {
      if (data.token && data.agent) {
        // Pass password for WebRTC SDK login
        setAgentSession(data.token, data.agent, data.password);
      }
    },
  });
}

/**
 * Logout TeleCMI agent
 */
export function useLogoutTelecmiAgent() {
  const { clearAgentSession } = useTelecmiStore();

  return useMutation({
    mutationFn: async () => {
      // No server-side logout needed for TeleCMI
      return { success: true };
    },
    onSuccess: () => {
      clearAgentSession();
    },
  });
}

// ============ Calls ============

/**
 * Initiate a TeleCMI call
 */
export function useInitiateTelecmiCall() {
  const { agentInfo } = useTelecmiStore();

  return useMutation({
    mutationFn: async ({ toNumber, callerId, webrtc = true, followMe = true }) => {
      const userId = agentInfo?.id || agentInfo?.agent_id;
      if (!userId) {
        throw new Error('Agent not logged in');
      }

      const response = await api.post('/telecmi/calls', {
        userId,
        toNumber,
        callerId,
        webrtc,
        followMe,
      });
      return response.data;
    },
  });
}

/**
 * Get TeleCMI call logs
 */
export function useTelecmiCallLogs({ from, to, page = 1, limit = 50, direction } = {}) {
  const { agentToken } = useTelecmiStore();

  return useQuery({
    queryKey: telecmiKeys.calls({ from, to, page, limit, direction }),
    queryFn: async () => {
      if (!agentToken) {
        return { data: [], total: 0 };
      }

      const params = new URLSearchParams();
      params.set('token', agentToken);
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      if (page) params.set('page', page);
      if (limit) params.set('limit', limit);
      if (direction) params.set('direction', direction);

      const response = await api.get(`/telecmi/calls?${params.toString()}`);
      return response;
    },
    enabled: !!agentToken,
  });
}

// ============ Recordings ============

/**
 * Get call recording URL
 */
export function useTelecmiRecording(callId) {
  return useQuery({
    queryKey: [...telecmiKeys.all, 'recording', callId],
    queryFn: async () => {
      const response = await api.get(`/telecmi/recordings/${callId}`);
      return response.data;
    },
    enabled: !!callId,
  });
}

/**
 * Set recording setting for agent
 */
export function useSetTelecmiRecordingSetting() {
  return useMutation({
    mutationFn: async ({ token, enabled }) => {
      const response = await api.post('/telecmi/recordings/settings', { token, enabled });
      return response.data;
    },
  });
}

// ============ Transcription ============

/**
 * Request transcription for a call
 */
export function useRequestTranscription() {
  return useMutation({
    mutationFn: async ({ callId, language = 'en-IN' }) => {
      const response = await api.post('/telecmi/transcription/request', { callId, language });
      return response.data;
    },
  });
}

/**
 * Get transcription for a call
 */
export function useTelecmiTranscription(callId) {
  return useQuery({
    queryKey: [...telecmiKeys.all, 'transcription', callId],
    queryFn: async () => {
      const response = await api.get(`/telecmi/transcription/${callId}`);
      return response.data;
    },
    enabled: !!callId,
  });
}

// ============ SMS ============

/**
 * Send SMS via TeleCMI
 */
export function useSendTelecmiSMS() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ to, message, from }) => {
      const response = await api.post('/telecmi/sms/send', { to, message, from });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...telecmiKeys.all, 'sms'] });
    },
  });
}

/**
 * Get SMS logs
 */
export function useTelecmiSMSLogs({ from, to, page = 1, limit = 50 } = {}) {
  return useQuery({
    queryKey: [...telecmiKeys.all, 'sms', 'logs', { from, to, page, limit }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      params.set('page', page);
      params.set('limit', limit);

      const response = await api.get(`/telecmi/sms/logs?${params.toString()}`);
      return response.data;
    },
  });
}

/**
 * Get SMS status
 */
export function useTelecmiSMSStatus(messageId) {
  return useQuery({
    queryKey: [...telecmiKeys.all, 'sms', 'status', messageId],
    queryFn: async () => {
      const response = await api.get(`/telecmi/sms/status/${messageId}`);
      return response.data;
    },
    enabled: !!messageId,
  });
}

// ============ IVR ============

/**
 * Get IVR list
 */
export function useTelecmiIVRList(page = 1, limit = 10) {
  return useQuery({
    queryKey: [...telecmiKeys.all, 'ivr', { page, limit }],
    queryFn: async () => {
      const response = await api.get('/telecmi/ivr', { params: { page, limit } });
      return response.data;
    },
  });
}

/**
 * Create IVR
 */
export function useCreateTelecmiIVR() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, flow, welcomeMessage, menuOptions }) => {
      const response = await api.post('/telecmi/ivr', { name, flow, welcomeMessage, menuOptions });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...telecmiKeys.all, 'ivr'] });
    },
  });
}

/**
 * Update IVR
 */
export function useUpdateTelecmiIVR() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ivrId, name, flow, welcomeMessage, menuOptions }) => {
      const response = await api.patch(`/telecmi/ivr/${ivrId}`, {
        name,
        flow,
        welcomeMessage,
        menuOptions,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...telecmiKeys.all, 'ivr'] });
    },
  });
}

/**
 * Delete IVR
 */
export function useDeleteTelecmiIVR() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ivrId) => {
      const response = await api.delete(`/telecmi/ivr/${ivrId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...telecmiKeys.all, 'ivr'] });
    },
  });
}

// ============ Queues ============

/**
 * Get queue list
 */
export function useTelecmiQueueList(page = 1, limit = 10) {
  return useQuery({
    queryKey: [...telecmiKeys.all, 'queues', { page, limit }],
    queryFn: async () => {
      const response = await api.get('/telecmi/queues', { params: { page, limit } });
      return response.data;
    },
  });
}

/**
 * Create queue
 */
export function useCreateTelecmiQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, agents, strategy, timeout }) => {
      const response = await api.post('/telecmi/queues', { name, agents, strategy, timeout });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...telecmiKeys.all, 'queues'] });
    },
  });
}

/**
 * Update queue
 */
export function useUpdateTelecmiQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ queueId, name, agents, strategy, timeout }) => {
      const response = await api.patch(`/telecmi/queues/${queueId}`, {
        name,
        agents,
        strategy,
        timeout,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...telecmiKeys.all, 'queues'] });
    },
  });
}

/**
 * Delete queue
 */
export function useDeleteTelecmiQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (queueId) => {
      const response = await api.delete(`/telecmi/queues/${queueId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...telecmiKeys.all, 'queues'] });
    },
  });
}

/**
 * Add agent to queue
 */
export function useAddAgentToQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ queueId, extension }) => {
      const response = await api.post(`/telecmi/queues/${queueId}/agents`, { extension });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...telecmiKeys.all, 'queues'] });
    },
  });
}

/**
 * Remove agent from queue
 */
export function useRemoveAgentFromQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ queueId, extension }) => {
      const response = await api.delete(`/telecmi/queues/${queueId}/agents/${extension}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...telecmiKeys.all, 'queues'] });
    },
  });
}

// ============ Live Monitoring ============

/**
 * Get active calls for monitoring
 */
export function useTelecmiActiveCalls() {
  return useQuery({
    queryKey: [...telecmiKeys.all, 'monitoring', 'active'],
    queryFn: async () => {
      const response = await api.get('/telecmi/monitoring/active');
      return response.data;
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });
}

/**
 * Listen to a call (silent monitoring)
 */
export function useListenToCall() {
  return useMutation({
    mutationFn: async ({ callId, supervisorExtension }) => {
      const response = await api.post('/telecmi/monitoring/listen', {
        callId,
        supervisorExtension,
      });
      return response.data;
    },
  });
}

/**
 * Whisper to agent
 */
export function useWhisperToAgent() {
  return useMutation({
    mutationFn: async ({ callId, supervisorExtension }) => {
      const response = await api.post('/telecmi/monitoring/whisper', {
        callId,
        supervisorExtension,
      });
      return response.data;
    },
  });
}

/**
 * Barge into call
 */
export function useBargeIntoCall() {
  return useMutation({
    mutationFn: async ({ callId, supervisorExtension }) => {
      const response = await api.post('/telecmi/monitoring/barge', { callId, supervisorExtension });
      return response.data;
    },
  });
}

// ============ Call Control ============

/**
 * Hangup a call
 */
export function useHangupCall() {
  return useMutation({
    mutationFn: async (callId) => {
      const response = await api.post(`/telecmi/calls/${callId}/hangup`);
      return response.data;
    },
  });
}

/**
 * Transfer a call
 */
export function useTransferCall() {
  return useMutation({
    mutationFn: async ({ callId, transferTo }) => {
      const response = await api.post(`/telecmi/calls/${callId}/transfer`, { transferTo });
      return response.data;
    },
  });
}

/**
 * Hold a call
 */
export function useHoldCall() {
  return useMutation({
    mutationFn: async (callId) => {
      const response = await api.post(`/telecmi/calls/${callId}/hold`);
      return response.data;
    },
  });
}

/**
 * Unhold a call
 */
export function useUnholdCall() {
  return useMutation({
    mutationFn: async (callId) => {
      const response = await api.post(`/telecmi/calls/${callId}/unhold`);
      return response.data;
    },
  });
}

// ============ App Settings ============

/**
 * Get TeleCMI balance
 */
export function useTelecmiBalance() {
  return useQuery({
    queryKey: [...telecmiKeys.all, 'balance'],
    queryFn: async () => {
      const response = await api.get('/telecmi/balance');
      return response.data;
    },
    staleTime: 60000, // Cache for 1 minute
  });
}

/**
 * Get DID numbers
 */
export function useTelecmiDIDNumbers(page = 1, limit = 10) {
  return useQuery({
    queryKey: [...telecmiKeys.all, 'did', { page, limit }],
    queryFn: async () => {
      const response = await api.get('/telecmi/did', { params: { page, limit } });
      return response.data;
    },
  });
}
