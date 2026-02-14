'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Search,
  Mail,
  Phone,
  User,
  ChevronRight,
  Merge,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
  Building2,
  UserX,
} from 'lucide-react';
import { UnifiedLayout, createStat, createAction } from '@/components/layout/unified';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useDuplicateContacts, useMergeContacts, useContact } from '@/hooks/use-contacts';
import { cn } from '@/lib/utils';

// Fields that can be merged
const MERGE_FIELDS = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'mobilePhone', label: 'Mobile Phone' },
  { key: 'jobTitle', label: 'Job Title' },
  { key: 'department', label: 'Department' },
  { key: 'lifecycleStage', label: 'Lifecycle Stage' },
  { key: 'leadStatus', label: 'Lead Status' },
  { key: 'source', label: 'Source' },
  { key: 'linkedinUrl', label: 'LinkedIn' },
  { key: 'billingAddress', label: 'Billing Address' },
  { key: 'billingCity', label: 'Billing City' },
];

export default function DuplicatesPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [matchBy, setMatchBy] = useState('email');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [primaryContact, setPrimaryContact] = useState(null);
  const [duplicateContact, setDuplicateContact] = useState(null);
  const [fieldSelections, setFieldSelections] = useState({});

  const { data, isLoading, error, refetch } = useDuplicateContacts({ matchBy });
  const mergeContacts = useMergeContacts();

  // Fetch full contact details for merge
  const { data: primaryData } = useContact(primaryContact?.id);
  const { data: duplicateData } = useContact(duplicateContact?.id);

  const duplicateGroups = data?.data?.groups || [];
  const totalDuplicates = data?.data?.totalDuplicates || 0;

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
  };

  const handleStartMerge = (primary, duplicate) => {
    setPrimaryContact(primary);
    setDuplicateContact(duplicate);
    // Initialize field selections - default to primary
    const initialSelections = {};
    MERGE_FIELDS.forEach((f) => {
      initialSelections[f.key] = 'primary';
    });
    setFieldSelections(initialSelections);
    setShowMergeModal(true);
  };

  const handleMerge = async () => {
    try {
      await mergeContacts.mutateAsync({
        primaryId: primaryContact.id,
        duplicateId: duplicateContact.id,
        fieldSelections,
      });

      toast({
        title: 'Contacts Merged',
        description: 'The duplicate contact has been merged successfully',
      });

      setShowMergeModal(false);
      setSelectedGroup(null);
      setPrimaryContact(null);
      setDuplicateContact(null);
      refetch();
    } catch (err) {
      toast({
        title: 'Merge Failed',
        description: err.message || 'Failed to merge contacts',
        variant: 'destructive',
      });
    }
  };

  const getMatchTypeIcon = (type) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'name':
        return <User className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getMatchTypeColor = (type) => {
    switch (type) {
      case 'email':
        return 'bg-blue-100 text-blue-700';
      case 'phone':
        return 'bg-green-100 text-green-700';
      case 'name':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Layout configuration
  const layoutStats = [
    createStat('Total Duplicates', totalDuplicates, UserX, 'orange'),
    createStat('Groups', duplicateGroups.length, Users, 'blue'),
  ];

  const layoutActions = [
    createAction('Back', ArrowLeft, () => router.push('/crm/contacts')),
    createAction('Refresh', RefreshCw, () => refetch()),
  ];

  if (isLoading) {
    return (
      <UnifiedLayout
        hubId="crm"
        pageTitle="Duplicate Contacts"
        stats={layoutStats}
        actions={layoutActions}
        fixedMenu={null}
      >
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </UnifiedLayout>
    );
  }

  return (
    <UnifiedLayout
      hubId="crm"
      pageTitle="Duplicate Contacts"
      stats={layoutStats}
      actions={layoutActions}
      fixedMenu={null}
    >
      <div className="h-full overflow-auto p-6 space-y-6">
        {/* Filter */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Find duplicates by:</span>
            </div>
            <Select value={matchBy} onValueChange={setMatchBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email Address</SelectItem>
                <SelectItem value="phone">Phone Number</SelectItem>
                <SelectItem value="name">Full Name</SelectItem>
                <SelectItem value="all">All Methods</SelectItem>
              </SelectContent>
            </Select>
            <div className="ml-auto text-sm text-muted-foreground">
              Found <span className="font-medium text-foreground">{totalDuplicates}</span> potential
              duplicates in{' '}
              <span className="font-medium text-foreground">{duplicateGroups.length}</span> groups
            </div>
          </div>
        </Card>

        {/* Results */}
        {duplicateGroups.length === 0 ? (
          <Card className="p-12 text-center">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <h3 className="text-lg font-medium mb-2">No Duplicates Found</h3>
            <p className="text-muted-foreground">
              Great! We didn't find any duplicate contacts matching by {matchBy}.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Duplicate Groups List */}
            <Card className="p-4">
              <h3 className="font-medium mb-4">Duplicate Groups</h3>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {duplicateGroups.map((group, index) => (
                  <button
                    key={group.primary.id}
                    onClick={() => handleSelectGroup(group)}
                    className={cn(
                      'w-full p-4 rounded-lg border text-left transition-colors hover:bg-muted/50',
                      selectedGroup?.primary.id === group.primary.id &&
                        'border-primary bg-primary/5'
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {group.primary.firstName?.[0] || ''}
                            {group.primary.lastName?.[0] || ''}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">
                            {group.primary.firstName} {group.primary.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {group.primary.email || group.primary.phone || 'No contact info'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{group.duplicates.length + 1} contacts</Badge>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      {group.duplicates.map((dup) => (
                        <Badge
                          key={dup.contact.id}
                          className={cn('text-xs', getMatchTypeColor(dup.matchType))}
                        >
                          {getMatchTypeIcon(dup.matchType)}
                          <span className="ml-1">{dup.matchType}</span>
                          <span className="ml-1 opacity-75">
                            ({Math.round(dup.confidence * 100)}%)
                          </span>
                        </Badge>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Selected Group Detail */}
            <Card className="p-4">
              {selectedGroup ? (
                <>
                  <h3 className="font-medium mb-4">Review & Merge</h3>
                  <div className="space-y-4">
                    {/* Primary Contact */}
                    <div className="p-4 rounded-lg border bg-green-50 border-green-200">
                      <div className="flex items-center gap-2 text-green-700 text-sm font-medium mb-3">
                        <CheckCircle2 className="h-4 w-4" />
                        Primary Contact (Keep)
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-lg font-medium text-green-700">
                            {selectedGroup.primary.firstName?.[0] || ''}
                            {selectedGroup.primary.lastName?.[0] || ''}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">
                            {selectedGroup.primary.firstName} {selectedGroup.primary.lastName}
                          </div>
                          {selectedGroup.primary.email && (
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {selectedGroup.primary.email}
                            </div>
                          )}
                          {selectedGroup.primary.phone && (
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" /> {selectedGroup.primary.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Duplicate Contacts */}
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-muted-foreground">
                        Duplicates to Merge
                      </div>
                      {selectedGroup.duplicates.map((dup) => (
                        <div
                          key={dup.contact.id}
                          className="p-4 rounded-lg border bg-orange-50 border-orange-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                                <span className="text-lg font-medium text-orange-700">
                                  {dup.contact.firstName?.[0] || ''}
                                  {dup.contact.lastName?.[0] || ''}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">
                                  {dup.contact.firstName} {dup.contact.lastName}
                                </div>
                                {dup.contact.email && (
                                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Mail className="h-3 w-3" /> {dup.contact.email}
                                  </div>
                                )}
                                {dup.contact.phone && (
                                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Phone className="h-3 w-3" /> {dup.contact.phone}
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleStartMerge(selectedGroup.primary, dup.contact)}
                            >
                              <Merge className="h-4 w-4 mr-2" />
                              Merge
                            </Button>
                          </div>
                          <div className="mt-2">
                            <Badge className={getMatchTypeColor(dup.matchType)}>
                              Matched by {dup.matchType} ({Math.round(dup.confidence * 100)}%
                              confidence)
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="font-medium mb-2">Select a Duplicate Group</h3>
                  <p className="text-sm text-muted-foreground">
                    Click on a group from the list to review and merge duplicates
                  </p>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Merge Modal */}
        <Dialog open={showMergeModal} onOpenChange={setShowMergeModal}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Merge Contacts</DialogTitle>
              <DialogDescription>
                Choose which values to keep for each field. The duplicate contact will be deleted
                after merge.
              </DialogDescription>
            </DialogHeader>

            {primaryContact && duplicateContact && (
              <div className="space-y-4">
                {/* Contact Headers */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="font-medium">Field</div>
                  <div className="text-center">
                    <Badge
                      variant="outline"
                      className="bg-green-50 border-green-200 text-green-700"
                    >
                      Primary (Keep)
                    </Badge>
                    <div className="text-sm mt-1">
                      {primaryContact.firstName} {primaryContact.lastName}
                    </div>
                  </div>
                  <div className="text-center">
                    <Badge
                      variant="outline"
                      className="bg-orange-50 border-orange-200 text-orange-700"
                    >
                      Duplicate (Delete)
                    </Badge>
                    <div className="text-sm mt-1">
                      {duplicateContact.firstName} {duplicateContact.lastName}
                    </div>
                  </div>
                </div>

                {/* Field Selection */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30%]">Field</TableHead>
                      <TableHead className="w-[35%]">Primary Value</TableHead>
                      <TableHead className="w-[35%]">Duplicate Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MERGE_FIELDS.map((field) => {
                      const primaryValue =
                        primaryData?.data?.[field.key] || primaryContact[field.key] || '';
                      const duplicateValue =
                        duplicateData?.data?.[field.key] || duplicateContact[field.key] || '';
                      const hasDifference = primaryValue !== duplicateValue;

                      if (!primaryValue && !duplicateValue) return null;

                      return (
                        <TableRow key={field.key} className={hasDifference ? 'bg-yellow-50' : ''}>
                          <TableCell className="font-medium">
                            {field.label}
                            {hasDifference && (
                              <Badge variant="outline" className="ml-2 text-xs bg-yellow-100">
                                Different
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={field.key}
                                checked={fieldSelections[field.key] === 'primary'}
                                onChange={() =>
                                  setFieldSelections({ ...fieldSelections, [field.key]: 'primary' })
                                }
                                className="h-4 w-4"
                              />
                              <span
                                className={cn(
                                  'text-sm',
                                  !primaryValue && 'text-muted-foreground italic'
                                )}
                              >
                                {primaryValue || '(empty)'}
                              </span>
                            </label>
                          </TableCell>
                          <TableCell>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={field.key}
                                checked={fieldSelections[field.key] === 'duplicate'}
                                onChange={() =>
                                  setFieldSelections({
                                    ...fieldSelections,
                                    [field.key]: 'duplicate',
                                  })
                                }
                                className="h-4 w-4"
                              />
                              <span
                                className={cn(
                                  'text-sm',
                                  !duplicateValue && 'text-muted-foreground italic'
                                )}
                              >
                                {duplicateValue || '(empty)'}
                              </span>
                            </label>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* What will happen */}
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    After Merge
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                    <li>
                      All activities from the duplicate will be transferred to the primary contact
                    </li>
                    <li>All deals will be reassigned to the primary contact</li>
                    <li>All tags will be combined</li>
                    <li>Conversation history will be preserved</li>
                    <li>The duplicate contact record will be permanently deleted</li>
                  </ul>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowMergeModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleMerge} disabled={mergeContacts.isPending}>
                {mergeContacts.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                <Merge className="h-4 w-4 mr-2" />
                Merge Contacts
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </UnifiedLayout>
  );
}
