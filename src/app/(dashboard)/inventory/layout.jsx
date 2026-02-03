'use client';

import { HubLayout } from '@/components/layout/hub-layout';

export default function InventoryLayout({ children }) {
  return <HubLayout hubId="inventory">{children}</HubLayout>;
}
