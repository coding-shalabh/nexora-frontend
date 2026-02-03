import { create } from 'zustand';

export const useCrmStore = create((set) => ({
  contacts: [],
  companies: [],
  activities: [],
  selectedContactId: null,
  selectedCompanyId: null,
  isLoading: false,
  pagination: { page: 1, limit: 25, total: 0 },
  filters: {},

  setContacts: (contacts) => set({ contacts }),

  setCompanies: (companies) => set({ companies }),

  setActivities: (activities) => set({ activities }),

  selectContact: (id) => set({ selectedContactId: id }),

  selectCompany: (id) => set({ selectedCompanyId: id }),

  setLoading: (isLoading) => set({ isLoading }),

  setPagination: (pagination) =>
    set((state) => ({ pagination: { ...state.pagination, ...pagination } })),

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  addContact: (contact) =>
    set((state) => ({ contacts: [...state.contacts, contact] })),

  updateContact: (id, updates) =>
    set((state) => ({
      contacts: state.contacts.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),

  removeContact: (id) =>
    set((state) => ({
      contacts: state.contacts.filter((c) => c.id !== id),
    })),

  addCompany: (company) =>
    set((state) => ({ companies: [...state.companies, company] })),

  updateCompany: (id, updates) =>
    set((state) => ({
      companies: state.companies.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),

  removeCompany: (id) =>
    set((state) => ({
      companies: state.companies.filter((c) => c.id !== id),
    })),
}));
