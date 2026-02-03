'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useInboxStore } from '@/stores';

export function useConversations(params) {
  const { setConversations, setLoadingConversations } = useInboxStore();

  return useQuery({
    queryKey: ['conversations', params],
    queryFn: async () => {
      setLoadingConversations(true);
      try {
        const result = await api.get('/inbox/conversations', { params });
        setConversations(result.data);
        return result;
      } finally {
        setLoadingConversations(false);
      }
    },
  });
}

export function useConversation(id) {
  return useQuery({
    queryKey: ['conversations', id],
    queryFn: () => api.get(`/inbox/conversations/${id}`),
    enabled: !!id,
  });
}

export function useMessages(conversationId, params) {
  const { setMessages, setLoadingMessages } = useInboxStore();

  return useQuery({
    queryKey: ['conversations', conversationId, 'messages', params],
    queryFn: async () => {
      setLoadingMessages(true);
      try {
        const result = await api.get(
          `/inbox/conversations/${conversationId}/messages`,
          { params }
        );
        setMessages(result.data);
        return result;
      } finally {
        setLoadingMessages(false);
      }
    },
    enabled: !!conversationId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const { addMessage } = useInboxStore();

  return useMutation({
    mutationFn: ({ conversationId, content, type = 'text' }) =>
      api.post(`/inbox/conversations/${conversationId}/messages`, {
        content,
        type,
      }),
    onSuccess: (result) => {
      addMessage(result.data);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useSendTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, templateId, variables }) =>
      api.post(`/inbox/conversations/${conversationId}/send-template`, {
        templateId,
        variables,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useAssignConversation() {
  const queryClient = useQueryClient();
  const { updateConversation } = useInboxStore();

  return useMutation({
    mutationFn: ({ id, assignedTo }) =>
      api.patch(`/inbox/conversations/${id}/assign`, { assignedTo }),
    onSuccess: (_, { id, assignedTo }) => {
      updateConversation(id, { assignedTo });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useResolveConversation() {
  const queryClient = useQueryClient();
  const { updateConversation } = useInboxStore();

  return useMutation({
    mutationFn: (id) => api.patch(`/inbox/conversations/${id}/resolve`),
    onSuccess: (_, id) => {
      updateConversation(id, { status: 'resolved' });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useReopenConversation() {
  const queryClient = useQueryClient();
  const { updateConversation } = useInboxStore();

  return useMutation({
    mutationFn: (id) => api.patch(`/inbox/conversations/${id}/reopen`),
    onSuccess: (_, id) => {
      updateConversation(id, { status: 'open' });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
