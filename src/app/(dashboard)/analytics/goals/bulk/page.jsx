'use client';

import { useState } from 'react';
import {
  Target,
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UnifiedLayout, createStat } from '@/components/layout/unified';

export default function AnalyticsGoalsBulkPage() {
  const stats = [
    createStat('Goals Imported', 0, Target, 'primary'),
    createStat('Pending Review', 0, AlertCircle, 'amber'),
    createStat('Approved', 0, CheckCircle, 'green'),
  ];

  return (
    <UnifiedLayout hubId="analytics" pageTitle="Bulk Goals" stats={stats} fixedMenu={null}>
      <div className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Import Goals
              </CardTitle>
              <CardDescription>Upload a CSV file to import goals in bulk</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop your CSV file here, or click to browse
                </p>
                <Button>Select File</Button>
              </div>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">CSV Format:</p>
                <code className="text-xs text-muted-foreground">
                  name, target_value, metric, period, assigned_to
                </code>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export Goals
              </CardTitle>
              <CardDescription>Download all goals as a CSV file</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Export all your goals data including targets, progress, and assignments.
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export All Goals
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Active Goals Only
                </Button>
                <Button variant="outline" className="w-full">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Import Instructions</CardTitle>
            <CardDescription>Follow these steps to successfully import goals</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Download the CSV template using the button above</li>
              <li>Fill in your goals data following the template format</li>
              <li>Upload the completed CSV file</li>
              <li>Review the imported goals for accuracy</li>
              <li>Approve the import to finalize</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </UnifiedLayout>
  );
}
