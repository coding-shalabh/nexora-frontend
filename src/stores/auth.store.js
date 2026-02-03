import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setLoading: (isLoading) => set({ isLoading }),

      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, isAuthenticated: false });
      },

      hasPermission: (permission) => {
        const { user } = get();
        if (!user) return false;
        return user.permissions.includes(permission) || user.permissions.includes('*');
      },

      hasAnyPermission: (permissions) => {
        const { hasPermission } = get();
        return permissions.some(hasPermission);
      },

      hasAllPermissions: (permissions) => {
        const { hasPermission } = get();
        return permissions.every(hasPermission);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
