'use client'

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { io } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'
import { inboxKeys } from '@/hooks/use-inbox'

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || ''

const SocketContext = createContext(null)

/**
 * Socket Provider - Provides a singleton socket instance to all components
 */
export function SocketProvider({ children }) {
  const socketRef = useRef(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState(null)
  const [token, setToken] = useState(null)
  const queryClient = useQueryClient()
  const joinedRoomsRef = useRef(new Set())

  // Get auth token from localStorage
  const getToken = useCallback(() => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('accessToken')
  }, [])

  // Check for token on mount and periodically (for login detection)
  useEffect(() => {
    const checkToken = () => {
      const currentToken = getToken()
      if (currentToken !== token) {
        setToken(currentToken)
      }
    }

    checkToken()
    const interval = setInterval(checkToken, 1000)

    const handleStorage = (e) => {
      if (e.key === 'accessToken') {
        checkToken()
      }
    }
    window.addEventListener('storage', handleStorage)

    return () => {
      clearInterval(interval)
      window.removeEventListener('storage', handleStorage)
    }
  }, [getToken, token])

  // Initialize socket connection when token is available
  useEffect(() => {
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
        setIsConnected(false)
        joinedRoomsRef.current.clear()
      }
      return
    }

    // Create socket connection
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    })

    socketRef.current = socket

    // Connection events
    socket.on('connect', () => {
      console.log('WebSocket connected:', socket.id)
      setIsConnected(true)
      setConnectionError(null)

      // Rejoin rooms after reconnect
      joinedRoomsRef.current.forEach((roomId) => {
        socket.emit('join:conversation', roomId)
      })
    })

    socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason)
      setIsConnected(false)
    })

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error.message)
      setConnectionError(error.message)
      setIsConnected(false)
    })

    // Handle new message event
    socket.on('message:new', (data) => {
      console.log('New message received via WebSocket:', data)

      // Add message to cache directly - don't invalidate to preserve status updates
      queryClient.setQueryData(
        inboxKeys.messages(data.conversationId),
        (oldData) => {
          if (!oldData || !Array.isArray(oldData)) return oldData
          const exists = oldData.some((m) => m.id === data.message.id)
          if (exists) return oldData
          return [...oldData, data.message]
        }
      )

      // Only invalidate conversations list to update last message preview
      queryClient.invalidateQueries({
        queryKey: ['inbox', 'conversations'],
      })
    })

    // Handle conversation update event
    socket.on('conversation:updated', (data) => {
      console.log('Conversation updated via WebSocket:', data)
      // Only invalidate conversations list, not messages (preserves status updates)
      queryClient.invalidateQueries({
        queryKey: ['inbox', 'conversations'],
      })
    })

    // Handle message status update
    socket.on('message:status', (data) => {
      console.log('Message status update via WebSocket:', data)

      // Status priority: pending < sent < delivered < read (failed is special)
      const statusPriority = {
        pending: 0,
        sent: 1,
        delivered: 2,
        read: 3,
        failed: -1, // Failed can only come from failed state
      }

      // Update message status in cache for the specific conversation
      // Only update if the new status is higher priority (prevents regression)
      queryClient.setQueryData(
        inboxKeys.messages(data.conversationId),
        (oldData) => {
          if (!oldData || !Array.isArray(oldData)) return oldData
          return oldData.map((m) => {
            if (m.id !== data.messageId) return m

            const currentPriority = statusPriority[m.status] ?? -1
            const newPriority = statusPriority[data.status] ?? -1

            // Only update if new status is higher priority
            // Exception: failed status always wins for failed messages
            if (data.status === 'failed' || newPriority > currentPriority) {
              console.log(`Status update ${m.id}: ${m.status} -> ${data.status} (accepted)`)
              return {
                ...m,
                status: data.status,
                // Include failure reason if message failed
                failureReason: data.status === 'failed' ? data.failureReason : m.failureReason,
              }
            }

            console.log(`Status update ${m.id}: ${m.status} -> ${data.status} (rejected - lower priority)`)
            return m
          })
        }
      )
    })

    // Handle typing indicators
    socket.on('typing:update', (data) => {
      console.log('Typing update:', data)
    })

    // Cleanup on unmount or token change
    return () => {
      socket.disconnect()
      socketRef.current = null
      joinedRoomsRef.current.clear()
    }
  }, [token, queryClient])

  // Join a conversation room
  const joinConversation = useCallback((conversationId) => {
    if (!conversationId) return

    if (socketRef.current?.connected) {
      socketRef.current.emit('join:conversation', conversationId)
      joinedRoomsRef.current.add(conversationId)
      console.log('Joined conversation room:', conversationId)
    }
  }, [])

  // Leave a conversation room
  const leaveConversation = useCallback((conversationId) => {
    if (!conversationId) return

    if (socketRef.current?.connected) {
      socketRef.current.emit('leave:conversation', conversationId)
      joinedRoomsRef.current.delete(conversationId)
      console.log('Left conversation room:', conversationId)
    }
  }, [])

  // Send typing indicator
  const sendTyping = useCallback((conversationId, isTyping) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(isTyping ? 'typing:start' : 'typing:stop', {
        conversationId,
      })
    }
  }, [])

  const value = {
    socket: socketRef.current,
    isConnected,
    connectionError,
    joinConversation,
    leaveConversation,
    sendTyping,
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}

/**
 * Hook to access socket context
 */
export function useSocket() {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

/**
 * Hook to automatically join/leave a conversation room
 */
export function useConversationSocket(conversationId) {
  const { joinConversation, leaveConversation, isConnected, sendTyping } = useSocket()

  useEffect(() => {
    if (conversationId && isConnected) {
      joinConversation(conversationId)

      return () => {
        leaveConversation(conversationId)
      }
    }
  }, [conversationId, isConnected, joinConversation, leaveConversation])

  return { isConnected, sendTyping }
}

export default SocketContext
