'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/lib/api';

const AuthContext = createContext(null);

// How often to check auth in the background (5 minutes)
const AUTH_CHECK_INTERVAL = 5 * 60 * 1000;

// Public paths that don't require authentication
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
  '/privacy',
  '/terms',
  '/support',
  '/data-deletion',
  '/signup',
];

export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(null);
  const checkIntervalRef = useRef(null);
  const lastCheckRef = useRef(0);

  // Check if current path is public
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname?.startsWith(path));

  // Check auth status
  const checkAuth = useCallback(async (silent = false) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        if (!silent) setIsLoading(false);
        return false;
      }

      // Try to get user from localStorage first for faster UI (only on initial load)
      if (!silent) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } catch (e) {
            localStorage.removeItem('user');
          }
        }
      }

      // Verify token with backend - this is the source of truth
      const response = await api.get('/auth/me');
      if (response.success && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
        setAuthError(null);
        localStorage.setItem('user', JSON.stringify(response.data));
        lastCheckRef.current = Date.now();
        return true;
      } else {
        // Unexpected response, force logout
        handleInvalidToken('Invalid auth response');
        return false;
      }
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || '';
      const isNetworkError =
        !err.response && (err.code === 'ERR_NETWORK' || err.message?.includes('Network'));

      // 401/403 means token is invalid or email not verified
      if (status === 401 || status === 403) {
        console.log('Auth check failed:', message);
        handleInvalidToken(message);
        return false;
      }

      // Network error handling
      if (isNetworkError || !err.response) {
        console.log('Network error during auth check');

        // If not a silent check, redirect to login (server might be down)
        if (!silent) {
          // Check if we have a stored user for temporary access
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
              setIsAuthenticated(true);
              // Show warning that we're offline
              console.warn('Using cached auth - server may be unavailable');
              return true;
            } catch (e) {
              // Invalid stored user, clear and redirect
              handleInvalidToken('Session expired');
              return false;
            }
          }
          // No stored user, redirect to login
          handleInvalidToken('Unable to verify session');
          return false;
        }
      }

      return false;
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  // Handle invalid token - clear everything (redirect handled by useEffect)
  const handleInvalidToken = useCallback((reason = '') => {
    console.log('Handling invalid token:', reason);

    // Clear auth state
    api.clearTokens();
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(reason);

    // Clear interval
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }
    // Note: Redirect is handled by useEffect watching isAuthenticated
    // This prevents hard page refreshes and uses Next.js soft navigation
  }, []);

  // Register the unauthorized callback with API client
  useEffect(() => {
    api.setUnauthorizedCallback((reason) => {
      setUser(null);
      setIsAuthenticated(false);
      setAuthError(reason);
    });
  }, []);

  // Initial auth check on mount
  useEffect(() => {
    checkAuth(false);
  }, [checkAuth]);

  // Periodic auth check
  useEffect(() => {
    if (!isAuthenticated) return;

    // Set up periodic check
    checkIntervalRef.current = setInterval(() => {
      checkAuth(true);
    }, AUTH_CHECK_INTERVAL);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [isAuthenticated, checkAuth]);

  // Check auth on window focus (user switches back to tab)
  useEffect(() => {
    const handleFocus = () => {
      // Only check if authenticated and it's been more than 30 seconds since last check
      if (isAuthenticated && Date.now() - lastCheckRef.current > 30000) {
        console.log('Window focused, checking auth...');
        checkAuth(true);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleFocus();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, checkAuth]);

  // Redirect to login if not authenticated and on protected path
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPublicPath) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, isPublicPath, router]);

  // Get current access token
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const login = useCallback(
    async (email, password) => {
      setAuthError(null);

      try {
        const response = await api.post('/auth/login', { email, password });

        if (response.success && response.data) {
          api.setTokens(response.data.accessToken, response.data.refreshToken);

          if (response.data.user) {
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }

          setIsAuthenticated(true);
          lastCheckRef.current = Date.now();

          // Fetch full user data including tenant/brandColor after login
          // This ensures theme is applied immediately without needing a page refresh
          setTimeout(() => {
            checkAuth(true);
          }, 100);

          return response;
        }

        throw new Error('Login failed');
      } catch (error) {
        const message = error.response?.data?.message || error.message || 'Login failed';
        setAuthError(message);
        throw error;
      }
    },
    [checkAuth]
  );

  const logout = useCallback(async () => {
    // Clear interval first
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }

    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignore errors during logout
      console.error('Logout error:', error);
    } finally {
      api.clearTokens();
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      setAuthError(null);
      // Use replace to prevent back button issues
      window.location.replace('/login');
    }
  }, []);

  // Force logout function for external use (e.g., from API errors)
  const forceLogout = useCallback(
    (reason = '') => {
      handleInvalidToken(reason);
    },
    [handleInvalidToken]
  );

  // Check if user has a specific permission
  const hasPermission = useCallback(
    (required) => {
      if (!user?.permissions) return false;

      // Admin has all permissions
      if (user.permissions.includes('*')) return true;

      // Direct match
      if (user.permissions.includes(required)) return true;

      // Wildcard match (e.g., 'crm:*' matches 'crm:contacts:read')
      const requiredParts = required.split(':');
      return user.permissions.some((userPerm) => {
        if (userPerm === '*') return true;
        const userParts = userPerm.split(':');
        for (let i = 0; i < userParts.length; i++) {
          if (userParts[i] === '*') return true;
          if (userParts[i] !== requiredParts[i]) return false;
        }
        return userParts.length >= requiredParts.length;
      });
    },
    [user]
  );

  // Check if user is admin (roleLevel >= 9)
  const isAdmin = user?.roleLevel >= 9 || user?.permissions?.includes('*');

  // Apply brand color as CSS custom property and generate full theme palette
  useEffect(() => {
    const brandColor = user?.tenant?.brandColor || '#2563EB'; // Default to blue-600

    // Convert hex to RGB
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 37, g: 99, b: 235 }; // Default blue-600 RGB
    };

    // Convert RGB to HSL
    const rgbToHsl = (r, g, b) => {
      r /= 255;
      g /= 255;
      b /= 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h,
        s,
        l = (max + min) / 2;

      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
            break;
          case g:
            h = ((b - r) / d + 2) / 6;
            break;
          case b:
            h = ((r - g) / d + 4) / 6;
            break;
        }
      }
      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
      };
    };

    // Convert HSL to hex
    const hslToHex = (h, s, l) => {
      s /= 100;
      l /= 100;
      const a = s * Math.min(l, 1 - l);
      const f = (n) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
          .toString(16)
          .padStart(2, '0');
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    };

    const rgb = hexToRgb(brandColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const rgbString = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
    const root = document.documentElement;

    // Set brand color variables
    root.style.setProperty('--brand-color', brandColor);
    root.style.setProperty('--brand-color-rgb', rgbString);

    // Generate full color palette (50-900 shades)
    const shades = {
      50: { s: Math.max(hsl.s - 20, 30), l: 97 },
      100: { s: Math.max(hsl.s - 15, 35), l: 94 },
      200: { s: Math.max(hsl.s - 10, 40), l: 86 },
      300: { s: Math.max(hsl.s - 5, 50), l: 74 },
      400: { s: hsl.s, l: 60 },
      500: { s: hsl.s, l: hsl.l }, // Base color
      600: { s: hsl.s, l: Math.max(hsl.l - 8, 30) },
      700: { s: hsl.s, l: Math.max(hsl.l - 16, 25) },
      800: { s: hsl.s, l: Math.max(hsl.l - 24, 20) },
      900: { s: hsl.s, l: Math.max(hsl.l - 32, 15) },
    };

    // Set shade variables
    Object.entries(shades).forEach(([shade, { s, l }]) => {
      const hex = hslToHex(hsl.h, s, l);
      const shadeRgb = hexToRgb(hex);
      root.style.setProperty(`--brand-${shade}`, hex);
      root.style.setProperty(`--brand-${shade}-rgb`, `${shadeRgb.r}, ${shadeRgb.g}, ${shadeRgb.b}`);
    });

    // Update primary color (HSL format for Tailwind/shadcn)
    root.style.setProperty('--primary', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
    root.style.setProperty('--primary-foreground', `${hsl.h} ${hsl.s}% 98%`);

    // Update ring color for focus states
    root.style.setProperty('--ring', `${hsl.h} ${hsl.s}% ${hsl.l}%`);

    // Sidebar and header colors (using lighter shades)
    root.style.setProperty('--sidebar-bg', `${hsl.h} ${Math.max(hsl.s - 20, 30)}% 96%`);
    root.style.setProperty('--sidebar-active', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
    root.style.setProperty('--sidebar-active-bg', `${hsl.h} ${Math.max(hsl.s - 10, 40)}% 92%`);
    root.style.setProperty('--header-bg', `${hsl.h} ${Math.max(hsl.s - 15, 35)}% 98%`);

    // Accent colors (lighter versions for backgrounds)
    root.style.setProperty('--accent', `${hsl.h} ${Math.max(hsl.s - 30, 20)}% 95%`);
    root.style.setProperty(
      '--accent-foreground',
      `${hsl.h} ${hsl.s}% ${Math.max(hsl.l - 20, 20)}%`
    );

    // Card and muted backgrounds
    root.style.setProperty('--muted', `${hsl.h} ${Math.max(hsl.s - 40, 10)}% 96%`);
    root.style.setProperty('--muted-foreground', `${hsl.h} ${Math.max(hsl.s - 50, 5)}% 45%`);

    // Secondary color (slightly desaturated)
    root.style.setProperty('--secondary', `${hsl.h} ${Math.max(hsl.s - 50, 10)}% 96%`);
    root.style.setProperty(
      '--secondary-foreground',
      `${hsl.h} ${hsl.s}% ${Math.max(hsl.l - 15, 25)}%`
    );

    // Border color
    root.style.setProperty('--border', `${hsl.h} ${Math.max(hsl.s - 60, 5)}% 90%`);

    // Gradient colors
    root.style.setProperty('--gradient-start', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
    root.style.setProperty('--gradient-end', `${hsl.h} ${hsl.s}% ${Math.max(hsl.l - 15, 20)}%`);

    // Chart colors (based on brand hue with variations)
    root.style.setProperty('--chart-1', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
    root.style.setProperty('--chart-2', `${(hsl.h + 30) % 360} ${hsl.s}% ${hsl.l}%`);
    root.style.setProperty('--chart-3', `${(hsl.h + 60) % 360} ${hsl.s}% ${hsl.l}%`);
    root.style.setProperty('--chart-4', `${(hsl.h + 180) % 360} ${hsl.s}% ${hsl.l}%`);
    root.style.setProperty('--chart-5', `${(hsl.h + 270) % 360} ${hsl.s}% ${hsl.l}%`);
  }, [user?.tenant?.brandColor]);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    authError,
    login,
    logout,
    checkAuth,
    forceLogout,
    hasPermission,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
