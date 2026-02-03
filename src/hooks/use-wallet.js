'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Query keys
export const walletKeys = {
  all: ['wallet'],
  wallet: () => [...walletKeys.all, 'balance'],
  transactions: (params) => [...walletKeys.all, 'transactions', params],
  usage: (params) => [...walletKeys.all, 'usage', params],
  spendLimits: () => [...walletKeys.all, 'spend-limits'],
};

/**
 * Fetch wallet balance and settings
 */
export function useWallet() {
  return useQuery({
    queryKey: walletKeys.wallet(),
    queryFn: async () => {
      const response = await api.get('/wallet');
      return response.data;
    },
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Fetch wallet transactions
 */
export function useWalletTransactions(params = {}) {
  return useQuery({
    queryKey: walletKeys.transactions(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set('page', params.page);
      if (params.limit) searchParams.set('limit', params.limit);
      if (params.type) searchParams.set('type', params.type);

      const response = await api.get(`/wallet/transactions?${searchParams.toString()}`);
      return response;
    },
    staleTime: 30000,
  });
}

/**
 * Fetch usage summary
 */
export function useWalletUsage(params = {}) {
  return useQuery({
    queryKey: walletKeys.usage(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.startDate) searchParams.set('startDate', params.startDate);
      if (params.endDate) searchParams.set('endDate', params.endDate);

      const response = await api.get(`/wallet/usage?${searchParams.toString()}`);
      return response.data;
    },
    staleTime: 60000, // 1 minute
  });
}

/**
 * Fetch spend limits
 */
export function useSpendLimits() {
  return useQuery({
    queryKey: walletKeys.spendLimits(),
    queryFn: async () => {
      const response = await api.get('/wallet/spend-limits');
      return response.data;
    },
    staleTime: 60000,
  });
}

/**
 * Top up wallet
 */
export function useTopUpWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amount, paymentMethod }) => {
      const response = await api.post('/wallet/topup', {
        amount,
        paymentMethod,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
    },
  });
}

/**
 * Update wallet settings
 */
export function useUpdateWalletSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.patch('/wallet/settings', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.wallet() });
    },
  });
}

/**
 * Update spend limit
 */
export function useUpdateSpendLimit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ channel, dailyLimit, monthlyLimit }) => {
      const response = await api.put('/wallet/spend-limits', {
        channel,
        dailyLimit,
        monthlyLimit,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.spendLimits() });
    },
  });
}
