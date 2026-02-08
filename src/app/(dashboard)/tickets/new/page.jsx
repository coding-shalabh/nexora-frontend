'use client';

import { useState } from 'react';
import { Ticket, Send, User, Tag, AlertCircle, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

export default function NewTicketPage() {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('');

  const stats = [
    createStat('New Ticket', 1, Ticket, 'primary'),
    createStat('Priority', 'Medium', AlertCircle, 'amber'),
    createStat('Status', 'Draft', Tag, 'gray'),
  ];

  return (
    <HubLayout
      hubId="service"
      title="Create New Ticket"
      description="Submit a new support ticket"
      stats={stats}
      showFixedMenu={false}
    >
      <div className="p-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Ticket Details
            </CardTitle>
            <CardDescription>Fill in the details to create a new support ticket</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                placeholder="Brief summary of the issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="general">General Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information about your issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label>Attachments</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Paperclip className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop files here, or click to browse
                </p>
                <Button variant="outline" size="sm">
                  Select Files
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline">Save as Draft</Button>
              <Button className="gap-2">
                <Send className="h-4 w-4" />
                Submit Ticket
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </HubLayout>
  );
}
