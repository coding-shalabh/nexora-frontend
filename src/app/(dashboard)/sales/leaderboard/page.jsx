'use client';

import { UnifiedLayout } from '@/components/layout/unified';
import { ComingSoonPage } from '@/components/common/coming-soon-page';

export default function SalesLeaderboardPage() {
  return (
    <UnifiedLayout hubId="sales" pageTitle="Sales Leaderboard">
      <ComingSoonPage
        title="Sales Leaderboard"
        description="Track top performers and team rankings. See real-time sales competitions and achievements."
        expectedDate="Q2 2026"
        showBackButton={false}
      />
    </UnifiedLayout>
  );
}
