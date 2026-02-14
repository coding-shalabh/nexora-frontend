'use client';

import { Activity, Upload, Download, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UnifiedLayout } from '@/components/layout/unified';

export default function ActivitiesBulkPage() {
  return (
    <UnifiedLayout hubId="crm" pageTitle="Bulk Activities" fixedMenu={null}>
      <div className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Import Activities
              </CardTitle>
              <CardDescription>Upload a CSV file to import activities in bulk</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop your CSV file here, or click to browse
                </p>
                <Button>Select File</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export Activities
              </CardTitle>
              <CardDescription>Download all activities as a CSV file</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Export all your activities data including calls, meetings, emails, and notes.
              </p>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export All Activities
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </UnifiedLayout>
  );
}
