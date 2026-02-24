'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { io } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { inboxKeys } from './use-inbox';

// Strip /api/v1 from API URL to get base WebSocket URL
const SOCKET_URL =
  process.env.NEXT_PUBLIC_WS_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') ||
  'http://localhost:4000';

/**
 * WebSocket hook for real-time messaging
 * Connects to the Socket.io server and handles real-time events
 */
export function useSocket() {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [token, setToken] = useState(null);
  const queryClient = useQueryClient();

  // Get auth token from localStorage
  const getToken = useCallback(() => {
    if (typeof window === 'undefined') return null;
    // Token is stored directly as 'accessToken' by the auth context
    return localStorage.getItem('accessToken');
  }, []);

  // Check for token on mount and periodically (for login detection)
  useEffect(() => {
    const checkToken = () => {
      const currentToken = getToken();
      if (currentToken !== token) {
        setToken(currentToken);
      }
    };

    // Check immediately
    checkToken();

    // Check periodically for login/logout
    const interval = setInterval(checkToken, 1000);

    // Also check on storage events (cross-tab)
    const handleStorage = (e) => {
      if (e.key === 'accessToken') {
        checkToken();
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorage);
    };
  }, [getToken, token]);

  // Initialize socket connection when token is available
  useEffect(() => {
    if (!token) {
      // Disconnect existing socket if token is removed
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Create socket connection
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      setIsConnected(true);
      setConnectionError(null);
    });

    socket.on('disconnect', (reason) => {
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error.message);
      setConnectionError(error.message);
      setIsConnected(false);
    });

    // Handle new message event
    socket.on('message:new', (data) => {
      // Invalidate messages query for the conversation
      queryClient.invalidateQueries({
        queryKey: inboxKeys.messages(data.conversationId),
      });

      // Optionally update the cache directly for instant UI update
      queryClient.setQueryData(inboxKeys.messages(data.conversationId), (oldData) => {
        if (!oldData) return oldData;
        // Add new message to the list if not already present
        const messages = Array.isArray(oldData) ? oldData : oldData.messages || oldData;
        const exists = messages.some((m) => m.id === data.message.id);
        if (exists) return oldData;

        if (Array.isArray(oldData)) {
          return [...oldData, data.message];
        }
        return {
          ...oldData,
          messages: [...(oldData.messages || []), data.message],
        };
      });
    });

    // Handle conversation update event
    socket.on('conversation:updated', (data) => {
      // Invalidate conversations list
      queryClient.invalidateQueries({
        queryKey: inboxKeys.all,
      });
    });

    // Handle message status update
    socket.on('message:status', (data) => {
      // Update message status in cache
      queryClient.setQueryData(inboxKeys.messages(data.conversationId), (oldData) => {
        if (!oldData) return oldData;
        const messages = Array.isArray(oldData) ? oldData : oldData.messages || oldData;

        const updatedMessages = messages.map((m) =>
          m.id === data.messageId ? { ...m, status: data.status } : m
        );

        if (Array.isArray(oldData)) {
          return updatedMessages;
        }
        return { ...oldData, messages: updatedMessages };
      });
    });

    // Handle typing indicators
    socket.on('typing:update', (data) => {
      // Can be handled by components if needed
    });

    // Cleanup on unmount or token change
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, queryClient]);

  // Join a conversation room
  const joinConversation = useCallback((conversationId) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('join:conversation', conversationId);
    }
  }, []);

  // Leave a conversation room
  const leaveConversation = useCallback((conversationId) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('leave:conversation', conversationId);
    }
  }, []);

  // Send typing indicator
  const sendTyping = useCallback((conversationId, isTyping) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(isTyping ? 'typing:start' : 'typing:stop', {
        conversationId,
      });
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
    joinConversation,
    leaveConversation,
    sendTyping,
  };
}

/**
 * Hook to join/leave a conversation room automatically
 */
export function useConversationSocket(conversationId) {
  const { joinConversation, leaveConversation, isConnected, sendTyping } = useSocket();

  useEffect(() => {
    if (conversationId && isConnected) {
      joinConversation(conversationId);

      return () => {
        leaveConversation(conversationId);
      };
    }
  }, [conversationId, isConnected, joinConversation, leaveConversation]);

  return { isConnected, sendTyping };
}

export default useSocket;
