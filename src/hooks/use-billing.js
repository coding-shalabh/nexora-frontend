'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export function useBilling() {
  const [invoices, setInvoices] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch invoices
  const fetchInvoices = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await api.get(`/billing/invoices?${params}`);
      setInvoices(response.data || []);
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch invoices:', err);
      return { data: [], meta: {} };
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single invoice
  const fetchInvoice = useCallback(async (id) => {
    try {
      const response = await api.get(`/billing/invoices/${id}`);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch invoice:', err);
      throw err;
    }
  }, []);

  // Create invoice
  const createInvoice = useCallback(async (data) => {
    try {
      const response = await api.post('/billing/invoices', data);
      await fetchInvoices();
      return response.data;
    } catch (err) {
      console.error('Failed to create invoice:', err);
      throw err;
    }
  }, [fetchInvoices]);

  // Send invoice
  const sendInvoice = useCallback(async (id) => {
    try {
      const response = await api.patch(`/billing/invoices/${id}/send`);
      await fetchInvoices();
      return response.data;
    } catch (err) {
      console.error('Failed to send invoice:', err);
      throw err;
    }
  }, [fetchInvoices]);

  // Delete invoice
  const deleteInvoice = useCallback(async (id) => {
    try {
      await api.delete(`/billing/invoices/${id}`);
      await fetchInvoices();
    } catch (err) {
      console.error('Failed to delete invoice:', err);
      throw err;
    }
  }, [fetchInvoices]);

  // Void invoice
  const voidInvoice = useCallback(async (id) => {
    try {
      const response = await api.patch(`/billing/invoices/${id}/void`);
      await fetchInvoices();
      return response.data;
    } catch (err) {
      console.error('Failed to void invoice:', err);
      throw err;
    }
  }, [fetchInvoices]);

  // Fetch quotes
  const fetchQuotes = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await api.get(`/billing/quotes?${params}`);
      setQuotes(response.data || []);
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch quotes:', err);
      return { data: [], meta: {} };
    } finally {
      setLoading(false);
    }
  }, []);

  // Create quote
  const createQuote = useCallback(async (data) => {
    try {
      const response = await api.post('/billing/quotes', data);
      await fetchQuotes();
      return response.data;
    } catch (err) {
      console.error('Failed to create quote:', err);
      throw err;
    }
  }, [fetchQuotes]);

  // Fetch payments
  const fetchPayments = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await api.get(`/billing/payments?${params}`);
      setPayments(response.data || []);
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch payments:', err);
      return { data: [], meta: {} };
    } finally {
      setLoading(false);
    }
  }, []);

  // Record payment
  const recordPayment = useCallback(async (data) => {
    try {
      const response = await api.post('/billing/payments', data);
      await fetchPayments();
      await fetchInvoices();
      return response.data;
    } catch (err) {
      console.error('Failed to record payment:', err);
      throw err;
    }
  }, [fetchPayments, fetchInvoices]);

  return {
    invoices,
    quotes,
    payments,
    loading,
    error,
    fetchInvoices,
    fetchInvoice,
    createInvoice,
    sendInvoice,
    deleteInvoice,
    voidInvoice,
    fetchQuotes,
    createQuote,
    fetchPayments,
    recordPayment,
  };
}

// Indian State Codes for GST
export const indianStates = [
  { code: '01', name: 'Jammu & Kashmir' },
  { code: '02', name: 'Himachal Pradesh' },
  { code: '03', name: 'Punjab' },
  { code: '04', name: 'Chandigarh' },
  { code: '05', name: 'Uttarakhand' },
  { code: '06', name: 'Haryana' },
  { code: '07', name: 'Delhi' },
  { code: '08', name: 'Rajasthan' },
  { code: '09', name: 'Uttar Pradesh' },
  { code: '10', name: 'Bihar' },
  { code: '11', name: 'Sikkim' },
  { code: '12', name: 'Arunachal Pradesh' },
  { code: '13', name: 'Nagaland' },
  { code: '14', name: 'Manipur' },
  { code: '15', name: 'Mizoram' },
  { code: '16', name: 'Tripura' },
  { code: '17', name: 'Meghalaya' },
  { code: '18', name: 'Assam' },
  { code: '19', name: 'West Bengal' },
  { code: '20', name: 'Jharkhand' },
  { code: '21', name: 'Odisha' },
  { code: '22', name: 'Chhattisgarh' },
  { code: '23', name: 'Madhya Pradesh' },
  { code: '24', name: 'Gujarat' },
  { code: '26', name: 'Dadra & Nagar Haveli and Daman & Diu' },
  { code: '27', name: 'Maharashtra' },
  { code: '29', name: 'Karnataka' },
  { code: '30', name: 'Goa' },
  { code: '31', name: 'Lakshadweep' },
  { code: '32', name: 'Kerala' },
  { code: '33', name: 'Tamil Nadu' },
  { code: '34', name: 'Puducherry' },
  { code: '35', name: 'Andaman & Nicobar Islands' },
  { code: '36', name: 'Telangana' },
  { code: '37', name: 'Andhra Pradesh' },
  { code: '38', name: 'Ladakh' },
];

// GST Rate options
export const gstRates = [
  { rate: 0, label: '0% (Exempt)' },
  { rate: 0.1, label: '0.1%' },
  { rate: 0.25, label: '0.25%' },
  { rate: 3, label: '3%' },
  { rate: 5, label: '5%' },
  { rate: 12, label: '12%' },
  { rate: 18, label: '18%' },
  { rate: 28, label: '28%' },
];

// Format currency for INR
export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

// Format currency (auto-detect)
export function formatCurrency(amount, currency = 'INR') {
  if (currency === 'INR') return formatINR(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
