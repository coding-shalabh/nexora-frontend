import { create } from 'zustand';

export const useInboxStore = create((set) => ({
  conversations: [],
  selectedConversationId: null,
  messages: [],
  isLoadingConversations: false,
  isLoadingMessages: false,
  filter: {},

  setConversations: (conversations) => set({ conversations }),

  selectConversation: (id) => set({ selectedConversationId: id, messages: [] }),

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  updateConversation: (id, updates) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === id ? { ...conv, ...updates } : conv
      ),
    })),

  setFilter: (filter) =>
    set((state) => ({ filter: { ...state.filter, ...filter } })),

  setLoadingConversations: (isLoadingConversations) => set({ isLoadingConversations }),

  setLoadingMessages: (isLoadingMessages) => set({ isLoadingMessages }),
}));
