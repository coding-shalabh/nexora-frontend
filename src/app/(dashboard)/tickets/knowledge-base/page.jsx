'use client';

import { BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function KnowledgeBasePage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Knowledge Base</h1>
          <p className="text-muted-foreground">Help articles and documentation</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Article
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No articles yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Create help articles for your customers
        </p>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Create Article
        </Button>
      </div>
    </div>
  );
}
