'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Edit,
  Trash2,
  MoreHorizontal,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ContactDetailPanel } from '@/components/crm/contact-detail-panel';
import { useContact, useDeleteContact } from '@/hooks/use-contacts';
import { useToast } from '@/hooks/use-toast';
import { UnifiedLayout } from '@/components/layout/unified';

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const contactId = params.contactId;

  // Fetch contact data
  const { data: contactData, isLoading, error, refetch } = useContact(contactId);
  const deleteContact = useDeleteContact();

  const contact = contactData?.data || contactData;

  const handleEdit = () => {
    // Navigate to edit mode or open edit dialog
    router.push(`/crm/contacts?edit=${contactId}`);
  };

  const handleDelete = async () => {
    if (!contact) return;
    if (!confirm(`Delete ${contact.firstName} ${contact.lastName}?`)) return;

    try {
      await deleteContact.mutateAsync(contactId);
      toast({
        title: 'Contact Deleted',
        description: `${contact.firstName} ${contact.lastName} has been deleted.`,
      });
      router.push('/crm/contacts');
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete contact',
        variant: 'destructive',
      });
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Loading state
  if (isLoading) {
    return (
      <UnifiedLayout hubId="crm" pageTitle="Contact Details" fixedMenu={null}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-sm text-muted-foreground">Loading contact...</p>
          </div>
        </div>
      </UnifiedLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <UnifiedLayout hubId="crm" pageTitle="Contact Details" fixedMenu={null}>
        <div className="flex flex-col items-center justify-center h-full p-8">
          <div className="h-16 w-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Contact not found</h3>
          <p className="text-sm text-muted-foreground mb-6">
            The contact you're looking for doesn't exist or has been deleted.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
            </Button>
            <Button onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" /> Try Again
            </Button>
          </div>
        </div>
      </UnifiedLayout>
    );
  }

  // Contact not found
  if (!contact) {
    return (
      <UnifiedLayout hubId="crm" pageTitle="Contact Details" fixedMenu={null}>
        <div className="flex flex-col items-center justify-center h-full p-8">
          <div className="h-16 w-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-amber-500" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Contact not found</h3>
          <p className="text-sm text-muted-foreground mb-6">
            The contact you're looking for doesn't exist.
          </p>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
          </Button>
        </div>
      </UnifiedLayout>
    );
  }

  const displayName =
    contact.displayName ||
    `${contact.firstName || ''} ${contact.lastName || ''}`.trim() ||
    'Unknown Contact';

  return (
    <UnifiedLayout hubId="crm" pageTitle={displayName} fixedMenu={null}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full flex flex-col"
      >
        {/* Header */}
        <div className="shrink-0 p-4 border-b flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleBack} aria-label="Go back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="font-semibold text-lg">{displayName}</h1>
              {contact.email && <p className="text-sm text-muted-foreground">{contact.email}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="More options">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" /> Edit Contact
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete Contact
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Contact Detail Panel */}
        <div className="flex-1 overflow-auto">
          <ContactDetailPanel
            contact={contact}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onClose={handleBack}
          />
        </div>
      </motion.div>
    </UnifiedLayout>
  );
}
