'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  Users,
  User,
  Check,
  Loader2,
  Search,
  UserPlus,
  Building2,
  ChevronDown,
  ChevronRight,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useInboxTeams, useAssignToTeam } from '@/hooks/use-inbox-agent';

function getInitials(firstName, lastName) {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
}

// Popover version for inline use
export function AssignButton({
  conversationId,
  currentTeamId,
  currentTeamName,
  variant = 'outline',
  size = 'sm',
  className
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [expandedTeams, setExpandedTeams] = useState(new Set());
  const { toast } = useToast();

  const { data: teamsData, isLoading: teamsLoading } = useInboxTeams();
  const assignToTeam = useAssignToTeam();

  const teams = teamsData?.data || [];

  // Filter teams based on search
  const filteredTeams = useMemo(() => {
    if (!search.trim()) return teams;
    const searchLower = search.toLowerCase();
    return teams.filter(team =>
      team.name.toLowerCase().includes(searchLower) ||
      team.members?.some(m =>
        `${m.user?.firstName} ${m.user?.lastName}`.toLowerCase().includes(searchLower)
      )
    );
  }, [teams, search]);

  const handleAssignTeam = async (teamId) => {
    try {
      await assignToTeam.mutateAsync({ conversationId, teamId });
      toast({
        title: teamId ? 'Assigned to team' : 'Assignment removed',
        description: teamId
          ? `Conversation assigned to ${teams.find(t => t.id === teamId)?.name}`
          : 'Team assignment removed',
      });
      setOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to assign conversation',
      });
    }
  };

  const toggleTeamExpand = (teamId) => {
    setExpandedTeams(prev => {
      const next = new Set(prev);
      if (next.has(teamId)) {
        next.delete(teamId);
      } else {
        next.add(teamId);
      }
      return next;
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn('gap-2', className)}
        >
          {currentTeamId ? (
            <>
              <Users className="h-4 w-4" />
              <span className="max-w-[100px] truncate">{currentTeamName}</span>
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              <span>Assign</span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teams or members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
        </div>

        <ScrollArea className="h-[280px]">
          {teamsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              {search ? 'No teams or members found' : 'No teams available'}
            </div>
          ) : (
            <div className="p-1">
              {/* Unassign option */}
              {currentTeamId && (
                <>
                  <button
                    onClick={() => handleAssignTeam(null)}
                    className="w-full flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-muted text-muted-foreground"
                    disabled={assignToTeam.isPending}
                  >
                    <X className="h-4 w-4" />
                    Remove assignment
                  </button>
                  <div className="my-1 border-t" />
                </>
              )}

              {/* Teams list */}
              {filteredTeams.map((team) => {
                const isExpanded = expandedTeams.has(team.id);
                const isSelected = currentTeamId === team.id;
                const memberCount = team.members?.length || 0;

                return (
                  <div key={team.id} className="mb-1">
                    {/* Team header */}
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleTeamExpand(team.id)}
                        className="p-1 hover:bg-muted rounded"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      <button
                        onClick={() => handleAssignTeam(team.id)}
                        className={cn(
                          'flex-1 flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-muted',
                          isSelected && 'bg-primary/10'
                        )}
                        disabled={assignToTeam.isPending}
                      >
                        <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium">{team.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {memberCount} member{memberCount !== 1 ? 's' : ''} • {team.assignedCount || 0} assigned
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </button>
                    </div>

                    {/* Team members (expanded) */}
                    {isExpanded && team.members?.length > 0 && (
                      <div className="ml-6 pl-2 border-l border-muted">
                        {team.members.map((member) => {
                          const user = member.user;
                          if (!user) return null;
                          return (
                            <div
                              key={member.id}
                              className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground"
                            >
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={user.avatarUrl} />
                                <AvatarFallback className="text-[10px]">
                                  {getInitials(user.firstName, user.lastName)}
                                </AvatarFallback>
                              </Avatar>
                              <span>
                                {user.firstName} {user.lastName}
                              </span>
                              {member.role === 'LEAD' && (
                                <Badge variant="secondary" className="text-[10px] px-1 py-0">
                                  Lead
                                </Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

// Full dialog version for more detailed assignment
export function AssignDialog({
  open,
  onOpenChange,
  conversationId,
  conversationName,
  currentTeamId,
  currentAssigneeId,
}) {
  const [search, setSearch] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState(currentTeamId || null);
  const { toast } = useToast();

  const { data: teamsData, isLoading: teamsLoading } = useInboxTeams();
  const assignToTeam = useAssignToTeam();

  const teams = teamsData?.data || [];

  // Filter teams based on search
  const filteredTeams = useMemo(() => {
    if (!search.trim()) return teams;
    const searchLower = search.toLowerCase();
    return teams.filter(team =>
      team.name.toLowerCase().includes(searchLower) ||
      team.members?.some(m =>
        `${m.user?.firstName} ${m.user?.lastName}`.toLowerCase().includes(searchLower)
      )
    );
  }, [teams, search]);

  const handleAssign = async () => {
    try {
      await assignToTeam.mutateAsync({
        conversationId,
        teamId: selectedTeamId
      });
      toast({
        title: selectedTeamId ? 'Assigned to team' : 'Assignment removed',
        description: selectedTeamId
          ? `Conversation assigned to ${teams.find(t => t.id === selectedTeamId)?.name}`
          : 'Team assignment removed',
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to assign conversation',
      });
    }
  };

  const selectedTeam = teams.find(t => t.id === selectedTeamId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Assign Conversation
          </DialogTitle>
          <DialogDescription>
            {conversationName
              ? `Assign "${conversationName}" to a team.`
              : 'Assign this conversation to a team for handling.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teams..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Teams list */}
          <ScrollArea className="h-[250px] border rounded-lg">
            {teamsLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredTeams.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Users className="h-8 w-8 mb-2" />
                <p className="text-sm">
                  {search ? 'No teams found' : 'No teams available'}
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {filteredTeams.map((team) => {
                  const isSelected = selectedTeamId === team.id;
                  const memberCount = team.members?.length || 0;

                  return (
                    <button
                      key={team.id}
                      onClick={() => setSelectedTeamId(isSelected ? null : team.id)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left',
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-transparent hover:bg-muted'
                      )}
                    >
                      <div className={cn(
                        'h-10 w-10 rounded-lg flex items-center justify-center',
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      )}>
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{team.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>{memberCount} member{memberCount !== 1 ? 's' : ''}</span>
                          <span>•</span>
                          <span>{team.assignedCount || 0} conversations</span>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="h-5 w-5 text-primary shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Selected team preview */}
          {selectedTeam && (
            <div className="p-3 rounded-lg bg-muted/50 space-y-2">
              <div className="text-sm font-medium">Team Members:</div>
              <div className="flex flex-wrap gap-2">
                {selectedTeam.members?.slice(0, 5).map((member) => {
                  const user = member.user;
                  if (!user) return null;
                  return (
                    <div
                      key={member.id}
                      className="flex items-center gap-1.5 px-2 py-1 bg-background rounded-md text-sm"
                    >
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback className="text-[10px]">
                          {getInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{user.firstName}</span>
                      {member.role === 'LEAD' && (
                        <Badge variant="secondary" className="text-[9px] px-1 py-0">
                          Lead
                        </Badge>
                      )}
                    </div>
                  );
                })}
                {selectedTeam.members?.length > 5 && (
                  <div className="px-2 py-1 bg-background rounded-md text-sm text-muted-foreground">
                    +{selectedTeam.members.length - 5} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={assignToTeam.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={assignToTeam.isPending || selectedTeamId === currentTeamId}
          >
            {assignToTeam.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Assigning...
              </>
            ) : selectedTeamId ? (
              <>
                <Users className="h-4 w-4 mr-2" />
                Assign to Team
              </>
            ) : (
              <>
                <X className="h-4 w-4 mr-2" />
                Remove Assignment
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AssignButton;
