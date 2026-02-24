'use client';

/**
 * TerminologyContext
 *
 * Provides industry-specific terminology overrides across the entire app.
 * Reads from `tenant.settings.terminology` and `tenant.settings.industryId`,
 * merges with DEFAULT_TERMINOLOGY so every component can call:
 *
 *   const { term } = useTerminology();
 *   term('contacts') // → "Patients" for healthcare, "Members" for fitness, etc.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getTerminology, DEFAULT_TERMINOLOGY } from '@/config/industry-terminology';
import { api } from '@/lib/api';

const TerminologyContext = createContext(null);

export function TerminologyProvider({ children }) {
  const [terminology, setTerminology] = useState(DEFAULT_TERMINOLOGY);
  const [industryId, setIndustryId] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Fetch tenant settings and extract terminology overrides
  const loadTerminology = useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (!token) {
        setLoaded(true);
        return;
      }

      const response = await api.get('/tenant/current');
      if (response?.success && response?.data?.settings) {
        const settings = response.data.settings;
        const id = settings.industryId || null;
        const overrides = settings.terminology || {};
        setIndustryId(id);
        // Build the merged terminology object
        const termFn = getTerminology(overrides, id);
        // Resolve all keys into a plain object for efficient access
        const resolved = {};
        for (const key of Object.keys(DEFAULT_TERMINOLOGY)) {
          resolved[key] = termFn(key);
        }
        setTerminology(resolved);
      }
    } catch {
      // Silently fall back to defaults — terminology is non-critical
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadTerminology();
  }, [loadTerminology]);

  // term(key) — returns the label for the given terminology key
  const term = useCallback(
    (key, fallback) => terminology[key] || fallback || DEFAULT_TERMINOLOGY[key] || key,
    [terminology]
  );

  // updateTerminology — called after saving settings to refresh labels
  const updateTerminology = useCallback((newIndustryId, newOverrides = {}) => {
    const termFn = getTerminology(newOverrides, newIndustryId);
    const resolved = {};
    for (const key of Object.keys(DEFAULT_TERMINOLOGY)) {
      resolved[key] = termFn(key);
    }
    setIndustryId(newIndustryId);
    setTerminology(resolved);
  }, []);

  return (
    <TerminologyContext.Provider
      value={{ term, terminology, industryId, loaded, updateTerminology }}
    >
      {children}
    </TerminologyContext.Provider>
  );
}

export function useTerminology() {
  const context = useContext(TerminologyContext);
  // Return safe defaults if used outside provider (e.g. super-admin pages)
  if (!context) {
    return {
      term: (key, fallback) => fallback || DEFAULT_TERMINOLOGY[key] || key,
      terminology: DEFAULT_TERMINOLOGY,
      industryId: null,
      loaded: true,
      updateTerminology: () => {},
    };
  }
  return context;
}

export default TerminologyContext;
