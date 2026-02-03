'use client';

import { HubLayout } from '@/components/layout/hub-layout';

export default function ManageLayout({ children }) {
  return <HubLayout hubId="manage">{children}</HubLayout>;
}
