/**
 * Notifications Hook
 * Handles fetching, real-time updates, and sound notifications
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useCallback } from 'react';
import { api } from '@/lib/api';
import { useSocket } from './use-socket';

// Web Audio API context for generating sounds
let audioContext = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

// Sound generation configurations
const SOUND_CONFIGS = {
  default: { frequency: 800, duration: 0.15, type: 'sine', decay: 0.1 },
  chime: { frequency: 1200, duration: 0.3, type: 'sine', decay: 0.2 },
  ding: { frequency: 1000, duration: 0.2, type: 'triangle', decay: 0.15 },
  pop: { frequency: 600, duration: 0.1, type: 'sine', decay: 0.05 },
  bell: { frequency: 880, duration: 0.4, type: 'sine', decay: 0.3 },
};

/**
 * Generate and play a notification sound using Web Audio API
 */
function playGeneratedSound(soundType = 'default', volume = 0.7) {
  try {
    const ctx = getAudioContext();
    const config = SOUND_CONFIGS[soundType] || SOUND_CONFIGS.default;

    // Create oscillator
    const oscillator = ctx.createOscillator();
    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.frequency, ctx.currentTime);

    // Create gain node for volume and decay
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + config.duration);

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Play sound
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + config.duration + config.decay);

    // For chime/bell, add a second harmonic
    if (soundType === 'chime' || soundType === 'bell') {
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(config.frequency * 1.5, ctx.currentTime);
      const gain2 = ctx.createGain();
      gain2.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + config.duration * 0.8);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.02);
      osc2.stop(ctx.currentTime + config.duration);
    }
  } catch (error) {
    console.debug('Web Audio API error:', error);
  }
}

// Optional: Notification sound files (stored in public/sounds/) - fallback to generated
const NOTIFICATION_SOUNDS = {
  default: '/sounds/notification-default.mp3',
  chime: '/sounds/notification-chime.mp3',
  ding: '/sounds/notification-ding.mp3',
  pop: '/sounds/notification-pop.mp3',
  bell: '/sounds/notification-bell.mp3',
};

/**
 * Play notification sound - tries file first, falls back to Web Audio API
 */
function playNotificationSound(soundType = 'default', volume = 0.7) {
  // First try to play audio file
  try {
    const soundUrl = NOTIFICATION_SOUNDS[soundType] || NOTIFICATION_SOUNDS.default;
    const audio = new Audio(soundUrl);
    audio.volume = Math.min(1, Math.max(0, volume));

    // If audio file fails, fall back to generated sound
    audio.onerror = () => {
      playGeneratedSound(soundType, volume);
    };

    audio.play().catch(() => {
      // Browser might block autoplay or file not found, use generated sound
      playGeneratedSound(soundType, volume);
    });
  } catch (error) {
    // Fall back to generated sound
    playGeneratedSound(soundType, volume);
  }
}

/**
 * Get user notification settings from localStorage
 */
function getNotificationSettings() {
  try {
    const settings = localStorage.getItem('notificationSettings');
    if (settings) {
      return JSON.parse(settings);
    }
  } catch (e) {
    // Ignore
  }
  return {
    soundEnabled: true,
    soundType: 'default',
    volume: 0.7,
  };
}

/**
 * Hook to fetch notifications
 */
export function useNotifications({ limit = 50, unreadOnly = false } = {}) {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const lastNotificationRef = useRef(null);

  const query = useQuery({
    queryKey: ['notifications', { limit, unreadOnly }],
    queryFn: async () => {
      const response = await api.get('/notifications', {
        params: { limit, unreadOnly: unreadOnly ? 'true' : undefined },
      });
      return response;
    },
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });

  // Handle real-time notification events
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      // Play sound if enabled
      const settings = getNotificationSettings();
      if (settings.soundEnabled) {
        playNotificationSound(settings.soundType, settings.volume);
      }

      // Update cache
      queryClient.setQueryData(['notifications', { limit, unreadOnly }], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: [notification, ...(old.data || [])].slice(0, limit),
          meta: {
            ...old.meta,
            unreadCount: (old.meta?.unreadCount || 0) + 1,
            total: (old.meta?.total || 0) + 1,
          },
        };
      });

      // Also update unread count query
      queryClient.setQueryData(['notifications', 'unreadCount'], (old) => ({
        ...old,
        data: { count: (old?.data?.count || 0) + 1 },
      }));
    };

    socket.on('notification:new', handleNewNotification);

    return () => {
      socket.off('notification:new', handleNewNotification);
    };
  }, [socket, queryClient, limit, unreadOnly]);

  return {
    notifications: query.data?.data || [],
    unreadCount: query.data?.meta?.unreadCount || 0,
    total: query.data?.meta?.total || 0,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Hook to get unread notification count
 */
export function useUnreadNotificationCount() {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  const query = useQuery({
    queryKey: ['notifications', 'unreadCount'],
    queryFn: async () => {
      const response = await api.get('/notifications/unread-count');
      return response;
    },
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000,
  });

  // Handle real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = () => {
      queryClient.setQueryData(['notifications', 'unreadCount'], (old) => ({
        ...old,
        data: { count: (old?.data?.count || 0) + 1 },
      }));
    };

    socket.on('notification:new', handleNewNotification);

    return () => {
      socket.off('notification:new', handleNewNotification);
    };
  }, [socket, queryClient]);

  return {
    count: query.data?.data?.count || 0,
    isLoading: query.isLoading,
    error: query.error,
  };
}

/**
 * Hook to mark notification as read
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId) => {
      const response = await api.patch(`/notifications/${notificationId}/read`);
      return response;
    },
    onSuccess: (_, notificationId) => {
      // Update notification in cache
      queryClient.setQueriesData({ queryKey: ['notifications'] }, (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((n) =>
            n.id === notificationId ? { ...n, read: true, readAt: new Date().toISOString() } : n
          ),
          meta: {
            ...old.meta,
            unreadCount: Math.max(0, (old.meta?.unreadCount || 0) - 1),
          },
        };
      });

      // Update unread count
      queryClient.setQueryData(['notifications', 'unreadCount'], (old) => ({
        ...old,
        data: { count: Math.max(0, (old?.data?.count || 0) - 1) },
      }));
    },
  });
}

/**
 * Hook to mark all notifications as read
 */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.patch('/notifications/read-all');
      return response;
    },
    onSuccess: () => {
      // Mark all notifications as read in cache
      queryClient.setQueriesData({ queryKey: ['notifications'] }, (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((n) => ({ ...n, read: true, readAt: new Date().toISOString() })),
          meta: {
            ...old.meta,
            unreadCount: 0,
          },
        };
      });

      // Reset unread count
      queryClient.setQueryData(['notifications', 'unreadCount'], (old) => ({
        ...old,
        data: { count: 0 },
      }));
    },
  });
}

/**
 * Hook to delete a notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId) => {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response;
    },
    onSuccess: (_, notificationId) => {
      queryClient.setQueriesData({ queryKey: ['notifications'] }, (old) => {
        if (!old?.data) return old;
        const deletedNotification = old.data.find((n) => n.id === notificationId);
        return {
          ...old,
          data: old.data.filter((n) => n.id !== notificationId),
          meta: {
            ...old.meta,
            total: Math.max(0, (old.meta?.total || 0) - 1),
            unreadCount:
              deletedNotification && !deletedNotification.read
                ? Math.max(0, (old.meta?.unreadCount || 0) - 1)
                : old.meta?.unreadCount,
          },
        };
      });
    },
  });
}

/**
 * Hook to clear all notifications
 */
export function useClearAllNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete('/notifications');
      return response;
    },
    onSuccess: () => {
      queryClient.setQueriesData({ queryKey: ['notifications'] }, (old) => ({
        ...old,
        data: [],
        meta: { total: 0, unreadCount: 0 },
      }));
      queryClient.setQueryData(['notifications', 'unreadCount'], (old) => ({
        ...old,
        data: { count: 0 },
      }));
    },
  });
}

/**
 * Test notification sound
 */
export function testNotificationSound(soundType = 'default', volume = 0.7) {
  playNotificationSound(soundType, volume);
}
