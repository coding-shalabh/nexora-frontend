'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(true); // Hidden by default
  const [isHovered, setIsHovered] = useState(false);

  // Persist sidebar state
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  const toggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
  };

  const expand = () => {
    setIsCollapsed(false);
    localStorage.setItem('sidebar-collapsed', 'false');
  };

  const collapse = () => {
    setIsCollapsed(true);
    localStorage.setItem('sidebar-collapsed', 'true');
  };

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isHovered,
        setIsHovered,
        toggle,
        expand,
        collapse,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
