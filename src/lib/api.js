import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

class ApiClient {
  constructor() {
    this.isRefreshing = false;
    this.refreshPromise = null;
    this.skipAuthRedirect = false;
    this.onUnauthorized = null; // Callback for auth context to handle logout

    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          // For /auth/me, just reject - don't try to refresh (used for initial check)
          if (originalRequest.url?.includes('/auth/me')) {
            return Promise.reject(error);
          }

          // Check if we have a refresh token
          const refreshToken = this.getRefreshToken();
          if (!refreshToken) {
            // No refresh token - force logout immediately
            this.forceLogout('No refresh token');
            return Promise.reject(error);
          }

          // If already refreshing, wait for the refresh to complete
          if (this.isRefreshing) {
            try {
              await this.refreshPromise;
              // Retry with new token
              originalRequest.headers.Authorization = `Bearer ${this.getAccessToken()}`;
              return this.client(originalRequest);
            } catch {
              return Promise.reject(error);
            }
          }

          // Start refresh
          this.isRefreshing = true;
          originalRequest._retry = true;

          this.refreshPromise = axios
            .post(`${API_BASE_URL}/auth/refresh`, { refreshToken })
            .then((response) => {
              if (response.data?.success && response.data?.data) {
                const { accessToken, refreshToken: newRefreshToken } = response.data.data;
                this.setTokens(accessToken, newRefreshToken);
                return accessToken;
              }
              throw new Error('Invalid refresh response');
            })
            .catch((refreshError) => {
              // Refresh failed - check if it's email verification issue
              const errorMessage = refreshError.response?.data?.message || '';
              this.forceLogout(errorMessage);
              throw refreshError;
            })
            .finally(() => {
              this.isRefreshing = false;
              this.refreshPromise = null;
            });

          try {
            const newToken = await this.refreshPromise;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        // Handle 403 Forbidden (usually means email not verified or account issues)
        if (error.response?.status === 403) {
          const errorMessage = error.response?.data?.message || 'Access forbidden';
          if (
            errorMessage.toLowerCase().includes('verify') ||
            errorMessage.toLowerCase().includes('email')
          ) {
            this.forceLogout(errorMessage);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Set callback for unauthorized handling
  setUnauthorizedCallback(callback) {
    this.onUnauthorized = callback;
  }

  // Force logout - clear tokens and notify auth context
  forceLogout(reason = '') {
    console.log('Force logout triggered:', reason);

    // Clear all auth data
    this.clearTokens();
    localStorage.removeItem('user');

    // Call the callback if set (auth context will handle redirect)
    if (this.onUnauthorized) {
      this.onUnauthorized(reason);
    }
    // Note: Don't do window.location.replace here - let auth context handle soft navigation
  }

  getAccessToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  getRefreshToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  }

  clearTokens() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  setTokens(accessToken, refreshToken) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  async get(url, config) {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post(url, data, config) {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put(url, data, config) {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async patch(url, data, config) {
    const response = await this.client.patch(url, data, config);
    return response.data;
  }

  async delete(url, config) {
    const response = await this.client.delete(url, config);
    return response.data;
  }
}

export const api = new ApiClient();
