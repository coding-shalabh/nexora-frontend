'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Plus, Loader2, Mail, Building2 } from 'lucide-react';
import { toast } from 'sonner';

export function ContactPicker({ value, onChange, label = 'Contact', index }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);

  // New contact form
  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/contacts?limit=100', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setContacts(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSelect = (contactId) => {
    const contact = contacts.find((c) => c.id === contactId);
    if (contact) {
      onChange({
        email: contact.email,
        name: `${contact.firstName} ${contact.lastName}`.trim(),
        role: contact.title || 'Client',
        contactId: contact.id,
      });
    }
  };

  const handleCreateContact = async () => {
    if (!newContact.firstName || !newContact.email) {
      toast.error('First name and email are required');
      return;
    }

    try {
      setCreating(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: newContact.firstName,
          lastName: newContact.lastName,
          email: newContact.email,
          phone: newContact.phone,
          company: newContact.company ? { name: newContact.company } : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Contact created successfully');
        setShowCreateDialog(false);
        setNewContact({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
        });

        // Add to contacts list and select
        const created = data.data;
        setContacts([created, ...contacts]);
        onChange({
          email: created.email,
          name: `${created.firstName} ${created.lastName}`.trim(),
          role: created.title || 'Client',
          contactId: created.id,
        });
      } else {
        toast.error(data.error || 'Failed to create contact');
      }
    } catch (error) {
      toast.error('Failed to create contact');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex items-center p-2 border rounded-lg">
          <Loader2 className="h-4 w-4 animate-spin text-gray-400 mr-2" />
          <span className="text-sm text-gray-500">Loading contacts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <Select onValueChange={handleContactSelect} value={value?.contactId || value?.email}>
        <SelectTrigger>
          <SelectValue placeholder="Select a contact" />
        </SelectTrigger>
        <SelectContent>
          {contacts.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No contacts found. Create one below.
            </div>
          ) : (
            contacts.map((contact) => (
              <SelectItem key={contact.id} value={contact.id}>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-blue-600" />
                  <div>
                    <p className="font-medium">
                      {contact.firstName} {contact.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{contact.email}</p>
                  </div>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm" className="w-full">
            <Plus className="h-3 w-3 mr-1" />
            Create New Contact
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Contact</DialogTitle>
            <DialogDescription>
              Add a new contact to your CRM and use them as a signer
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={newContact.firstName}
                  onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={newContact.lastName}
                  onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="pl-10"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                placeholder="+1234567890"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="company">Company (Optional)</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="company"
                  placeholder="Acme Corp"
                  className="pl-10"
                  value={newContact.company}
                  onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateContact} disabled={creating}>
              {creating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Contact'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {value?.name && (
        <div className="text-xs text-gray-500 mt-1">
          <span className="font-medium">Selected:</span> {value.name} ({value.email})
        </div>
      )}
    </div>
  );
}
