'use client';

import { CommerceProvider } from '@/components/layout/sidebars';

// Commerce Layout - Uses HubLayout pattern (pages render their own layout)
// CommerceProvider is wrapped here to ensure any component using useCommerceContext works
export default function CommerceLayout({ children }) {
  return <CommerceProvider>{children}</CommerceProvider>;
}
