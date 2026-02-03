import { create } from 'zustand';

export const usePipelineStore = create((set) => ({
  leads: [],
  deals: [],
  pipelines: [],
  selectedPipelineId: null,
  selectedDealId: null,
  selectedLeadId: null,
  isLoading: false,
  viewMode: 'kanban',
  filters: {},

  setLeads: (leads) => set({ leads }),

  setDeals: (deals) => set({ deals }),

  setPipelines: (pipelines) => set({ pipelines }),

  selectPipeline: (id) => set({ selectedPipelineId: id }),

  selectDeal: (id) => set({ selectedDealId: id }),

  selectLead: (id) => set({ selectedLeadId: id }),

  setLoading: (isLoading) => set({ isLoading }),

  setViewMode: (viewMode) => set({ viewMode }),

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  moveDeal: (dealId, newStageId) =>
    set((state) => {
      const pipeline = state.pipelines.find((p) =>
        p.stages.some((s) => s.id === newStageId)
      );
      const stage = pipeline?.stages.find((s) => s.id === newStageId);
      return {
        deals: state.deals.map((d) =>
          d.id === dealId
            ? {
                ...d,
                stageId: newStageId,
                stageName: stage?.name || d.stageName,
                probability: stage?.probability || d.probability,
              }
            : d
        ),
      };
    }),

  addDeal: (deal) => set((state) => ({ deals: [...state.deals, deal] })),

  updateDeal: (id, updates) =>
    set((state) => ({
      deals: state.deals.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    })),

  removeDeal: (id) =>
    set((state) => ({ deals: state.deals.filter((d) => d.id !== id) })),

  addLead: (lead) => set((state) => ({ leads: [...state.leads, lead] })),

  updateLead: (id, updates) =>
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    })),

  removeLead: (id) =>
    set((state) => ({ leads: state.leads.filter((l) => l.id !== id) })),
}));
