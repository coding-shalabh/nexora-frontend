'use client';

import { useState } from 'react';
import {
  FolderOpen,
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  FileCode,
  FolderPlus,
  Upload,
  Search,
  Grid,
  List,
  MoreHorizontal,
  Download,
  Share2,
  Trash2,
  Star,
  Eye,
  Edit,
  Move,
  Clock,
  HardDrive,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  useFiles,
  useFolders,
  useRecentFiles,
  useStarredItems,
  useStorageStats,
  useCreateFolder,
  useStarFile,
  useStarFolder,
  useDeleteFile,
  useDeleteFolder,
  formatFileSize,
  getFileType,
} from '@/hooks/use-files';
import { UnifiedLayout, createStat } from '@/components/layout/unified';

// File type icons
const fileTypeIcons = {
  folder: FolderOpen,
  document: FileText,
  image: FileImage,
  video: FileVideo,
  audio: FileAudio,
  spreadsheet: FileSpreadsheet,
  code: FileCode,
  other: File,
};

function FileCard({ file, viewMode, onStar, onDelete }) {
  const isFolder = file.type === 'folder';
  const fileType = isFolder ? 'folder' : getFileType(file.name);
  const FileIcon = fileTypeIcons[fileType] || File;

  const ownerName = file.uploadedBy
    ? `${file.uploadedBy.firstName} ${file.uploadedBy.lastName}`
    : file.createdBy
      ? `${file.createdBy.firstName} ${file.createdBy.lastName}`
      : 'Unknown';

  const formattedDate = file.updatedAt
    ? new Date(file.updatedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '-';

  if (viewMode === 'grid') {
    return (
      <Card className="group hover:shadow-md transition-all cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div
              className={cn(
                'h-12 w-12 rounded-lg flex items-center justify-center',
                isFolder ? 'bg-amber-100' : 'bg-primary/10'
              )}
            >
              <FileIcon className={cn('h-6 w-6', isFolder ? 'text-amber-600' : 'text-primary')} />
            </div>
            <div className="flex items-center gap-1">
              {file.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="h-4 w-4 mr-2" /> Preview
                  </DropdownMenuItem>
                  {!isFolder && (
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" /> Download
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <Share2 className="h-4 w-4 mr-2" /> Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onStar(file)}>
                    <Star className="h-4 w-4 mr-2" />
                    {file.isStarred ? 'Remove Star' : 'Add Star'}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" /> Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Move className="h-4 w-4 mr-2" /> Move
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={() => onDelete(file)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <p className="font-medium text-sm truncate mb-1">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {isFolder ? `${file.itemCount || 0} items` : formatFileSize(file.size || 0)}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
      <div
        className={cn(
          'h-10 w-10 rounded-lg flex items-center justify-center shrink-0',
          isFolder ? 'bg-amber-100' : 'bg-primary/10'
        )}
      >
        <FileIcon className={cn('h-5 w-5', isFolder ? 'text-amber-600' : 'text-primary')} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm truncate">{file.name}</p>
          {file.isStarred && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 shrink-0" />}
        </div>
        <p className="text-xs text-muted-foreground">
          {isFolder ? `${file.itemCount || 0} items` : formatFileSize(file.size || 0)}
        </p>
      </div>
      <div className="text-xs text-muted-foreground hidden md:block w-24">{formattedDate}</div>
      <div className="text-xs text-muted-foreground hidden lg:block w-32">{ownerName}</div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 shrink-0"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Eye className="h-4 w-4 mr-2" /> Preview
          </DropdownMenuItem>
          {!isFolder && (
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" /> Download
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <Share2 className="h-4 w-4 mr-2" /> Share
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600" onClick={() => onDelete(file)}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function FilesPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Fetch data
  const { data: filesData, isLoading: loadingFiles, error: filesError } = useFiles({ limit: 100 });
  const { data: foldersData, isLoading: loadingFolders } = useFolders();
  const { data: recentData, isLoading: loadingRecent } = useRecentFiles(5);
  const { data: starredData } = useStarredItems();
  const { data: storageData, isLoading: loadingStorage } = useStorageStats();

  // Mutations
  const createFolder = useCreateFolder();
  const starFile = useStarFile();
  const starFolder = useStarFolder();
  const deleteFile = useDeleteFile();
  const deleteFolder = useDeleteFolder();

  const files = filesData?.files || [];
  const folders = foldersData?.data || [];
  const recentFiles = recentData?.data || [];
  const starredFiles = starredData?.data?.files || [];
  const starredFolders = starredData?.data?.folders || [];
  const storageStats = storageData?.data || { totalUsed: 0, totalLimit: 10 * 1024 * 1024 * 1024 };

  // Filter by search
  const filteredFolders = folders.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      await createFolder.mutateAsync({ name: newFolderName.trim() });
      toast({
        title: 'Folder created',
        description: `Folder "${newFolderName}" created successfully`,
      });
      setNewFolderName('');
      setShowNewFolderDialog(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create folder', variant: 'destructive' });
    }
  };

  const handleStarItem = async (item) => {
    try {
      if (item.type === 'folder') {
        await starFolder.mutateAsync({ id: item.id, starred: !item.isStarred });
      } else {
        await starFile.mutateAsync({ id: item.id, starred: !item.isStarred });
      }
      toast({
        title: item.isStarred ? 'Removed from starred' : 'Added to starred',
        description: `${item.name} has been ${item.isStarred ? 'unstarred' : 'starred'}`,
      });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update star', variant: 'destructive' });
    }
  };

  const handleDeleteItem = async (item) => {
    try {
      if (item.type === 'folder') {
        await deleteFolder.mutateAsync(item.id);
      } else {
        await deleteFile.mutateAsync(item.id);
      }
      toast({ title: 'Deleted', description: `${item.name} has been deleted` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const isLoading = loadingFiles || loadingFolders;

  // Calculate storage stats
  const storageUsedGB = (storageStats.totalUsed || 0) / (1024 * 1024 * 1024);
  const storageTotalGB =
    (storageStats.totalLimit || 10 * 1024 * 1024 * 1024) / (1024 * 1024 * 1024);
  const storagePercentage = (storageUsedGB / storageTotalGB) * 100;
  const breakdown = storageStats.breakdown || {};

  // Stats for HubLayout
  const stats = [
    createStat(
      'Storage Used',
      `${storageUsedGB.toFixed(1)} GB / ${storageTotalGB.toFixed(0)} GB`,
      HardDrive,
      storagePercentage > 80 ? 'red' : storagePercentage > 60 ? 'amber' : 'blue'
    ),
    createStat('Total Files', files.length, File, 'green'),
    createStat('Folders', folders.length, FolderOpen, 'purple'),
    createStat('Starred Items', starredFiles.length + starredFolders.length, Star, 'amber'),
  ];

  return (
    <UnifiedLayout hubId="home" pageTitle="Files" stats={stats} fixedMenu={null}>
      <div className="h-full overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search & View Toggle */}
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search files and folders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {isLoading ? (
              <Card className="p-12">
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">Loading files...</p>
                </div>
              </Card>
            ) : filesError ? (
              <Card className="p-12">
                <div className="flex flex-col items-center justify-center">
                  <AlertCircle className="h-12 w-12 text-destructive" />
                  <p className="mt-2 text-muted-foreground">Failed to load files</p>
                </div>
              </Card>
            ) : (
              <>
                {/* Folders */}
                {filteredFolders.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Folders</h3>
                    <div
                      className={cn(
                        viewMode === 'grid'
                          ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'
                          : 'space-y-1'
                      )}
                    >
                      {filteredFolders.map((folder) => (
                        <FileCard
                          key={folder.id}
                          file={{ ...folder, type: 'folder' }}
                          viewMode={viewMode}
                          onStar={handleStarItem}
                          onDelete={handleDeleteItem}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Files */}
                {filteredFiles.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Files</h3>
                    {viewMode === 'list' && (
                      <div className="hidden md:flex items-center gap-4 px-3 py-2 text-xs text-muted-foreground border-b">
                        <div className="w-10" />
                        <div className="flex-1">Name</div>
                        <div className="w-24">Modified</div>
                        <div className="w-32 hidden lg:block">Owner</div>
                        <div className="w-8" />
                      </div>
                    )}
                    <div
                      className={cn(
                        viewMode === 'grid'
                          ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'
                          : 'space-y-1'
                      )}
                    >
                      {filteredFiles.map((file) => (
                        <FileCard
                          key={file.id}
                          file={{ ...file, type: 'file' }}
                          viewMode={viewMode}
                          onStar={handleStarItem}
                          onDelete={handleDeleteItem}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {filteredFolders.length === 0 && filteredFiles.length === 0 && (
                  <Card className="p-12">
                    <div className="text-center">
                      <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No files found</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery
                          ? 'Try a different search term'
                          : 'Upload your first file to get started'}
                      </p>
                      <Button>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files
                      </Button>
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Storage */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  Storage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{storageUsedGB.toFixed(1)} GB used</span>
                      <span className="text-muted-foreground">{storageTotalGB.toFixed(0)} GB</span>
                    </div>
                    <Progress value={storagePercentage} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <span>Documents</span>
                      </div>
                      <span className="text-muted-foreground">
                        {formatFileSize(breakdown.documents || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span>Images</span>
                      </div>
                      <span className="text-muted-foreground">
                        {formatFileSize(breakdown.images || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-purple-500" />
                        <span>Videos</span>
                      </div>
                      <span className="text-muted-foreground">
                        {formatFileSize(breakdown.videos || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-gray-500" />
                        <span>Other</span>
                      </div>
                      <span className="text-muted-foreground">
                        {formatFileSize(breakdown.other || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Access */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Quick Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingRecent ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : recentFiles.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent files</p>
                ) : (
                  <div className="space-y-2">
                    {recentFiles.map((file) => {
                      const fileType = getFileType(file.name);
                      const FileIcon = fileTypeIcons[fileType] || File;
                      const timeAgo = new Date(file.updatedAt).toLocaleDateString();
                      return (
                        <div
                          key={file.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                        >
                          <FileIcon className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{timeAgo}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Starred */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Starred
                </CardTitle>
              </CardHeader>
              <CardContent>
                {starredFiles.length === 0 && starredFolders.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No starred items</p>
                ) : (
                  <div className="space-y-2">
                    {starredFolders.map((folder) => (
                      <div
                        key={folder.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                      >
                        <FolderOpen className="h-4 w-4 text-amber-600" />
                        <p className="text-sm truncate flex-1">{folder.name}</p>
                      </div>
                    ))}
                    {starredFiles.map((file) => {
                      const fileType = getFileType(file.name);
                      const FileIcon = fileTypeIcons[fileType] || File;
                      return (
                        <div
                          key={file.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                        >
                          <FileIcon className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm truncate flex-1">{file.name}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* New Folder Dialog */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>Enter a name for your new folder</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="folderName">Folder Name</Label>
              <Input
                id="folderName"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder} disabled={createFolder.isPending}>
              {createFolder.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Folder'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </UnifiedLayout>
  );
}
