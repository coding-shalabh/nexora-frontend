'use client';

import { Trophy } from 'lucide-react';

export default function SalesLeaderboardPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sales Leaderboard</h1>
          <p className="text-muted-foreground">Track top performers and team rankings</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
        <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No leaderboard data</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Leaderboard will populate as sales activities are tracked
        </p>
      </div>
    </div>
  );
}
