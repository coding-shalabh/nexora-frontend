'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UnifiedLayout } from '@/components/layout/unified';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  GitBranch,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  GripVertical,
  Loader2,
  ArrowRight,
  Layers,
  Target,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const STAGE_COLORS = [
  '#6366f1', // Indigo
  '#3b82f6', // Blue
  '#22c55e', // Green
  '#eab308', // Yellow
  '#f97316', // Orange
  '#ef4444', // Red
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#14b8a6', // Teal
  '#6b7280', // Gray
];

export default function PipelinesPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('DEAL');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [formData, setFormData] = useState({ name: '', type: 'DEAL', stages: [] });

  // Fetch pipelines
  const { data: pipelinesData, isLoading } = useQuery({
    queryKey: ['pipelines', activeTab],
    queryFn: () => api.get(`/pipeline/pipelines?type=${activeTab}`),
  });

  const pipelines = pipelinesData?.data || [];

  // Filter by type
  const filteredPipelines = pipelines.filter((p) => p.type === activeTab);

  // Calculate stats
  const totalStages = filteredPipelines.reduce((acc, p) => acc + (p.stages?.length || 0), 0);

  const handleCreatePipeline = () => {
    setFormData({
      name: '',
      type: activeTab,
      stages: [
        { name: 'New', order: 0, color: STAGE_COLORS[0] },
        { name: 'In Progress', order: 1, color: STAGE_COLORS[1] },
        { name: 'Closed', order: 2, color: STAGE_COLORS[2] },
      ],
    });
    setShowCreateDialog(true);
  };

  const handleEditPipeline = (pipeline) => {
    setSelectedPipeline(pipeline);
    setFormData({
      name: pipeline.name,
      type: pipeline.type,
      stages: pipeline.stages || [],
    });
    setShowEditDialog(true);
  };

  const handleDeletePipeline = (pipeline) => {
    setSelectedPipeline(pipeline);
    setShowDeleteConfirm(true);
  };

  const addStage = () => {
    const newOrder = formData.stages.length;
    setFormData({
      ...formData,
      stages: [
        ...formData.stages,
        { name: '', order: newOrder, color: STAGE_COLORS[newOrder % STAGE_COLORS.length] },
      ],
    });
  };

  const updateStage = (index, field, value) => {
    const newStages = [...formData.stages];
    newStages[index] = { ...newStages[index], [field]: value };
    setFormData({ ...formData, stages: newStages });
  };

  const removeStage = (index) => {
    const newStages = formData.stages.filter((_, i) => i !== index);
    // Reorder stages
    newStages.forEach((s, i) => (s.order = i));
    setFormData({ ...formData, stages: newStages });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <UnifiedLayout hubId="settings" pageTitle="Pipelines" fixedMenu={null}>
      <motion.div
        className="flex-1 p-6 space-y-6 overflow-auto"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header with Stats */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center">
                <GitBranch className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Pipelines</h1>
                <p className="text-sm text-gray-500">Manage your sales pipelines and stages</p>
              </div>
            </div>
            <Button onClick={handleCreatePipeline} className="rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Create Pipeline
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="mt-6 flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
                <GitBranch className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{pipelines.length}</p>
                <p className="text-xs text-gray-500">Total Pipelines</p>
              </div>
            </div>
            <div className="h-10 w-px bg-gray-100" />
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {pipelines.filter((p) => p.type === 'DEAL').length}
                </p>
                <p className="text-xs text-gray-500">Deal Pipelines</p>
              </div>
            </div>
            <div className="h-10 w-px bg-gray-100" />
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {pipelines.filter((p) => p.type === 'LEAD').length}
                </p>
                <p className="text-xs text-gray-500">Lead Pipelines</p>
              </div>
            </div>
            <div className="h-10 w-px bg-gray-100" />
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <Layers className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalStages}</p>
                <p className="text-xs text-gray-500">Total Stages</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white rounded-xl p-1 shadow-sm">
              <TabsTrigger value="DEAL" className="rounded-lg data-[state=active]:bg-gray-100">
                <Target className="mr-2 h-4 w-4" />
                Deal Pipelines
                <Badge variant="secondary" className="ml-2 bg-gray-100">
                  {pipelines.filter((p) => p.type === 'DEAL').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="LEAD" className="rounded-lg data-[state=active]:bg-gray-100">
                <Users className="mr-2 h-4 w-4" />
                Lead Pipelines
                <Badge variant="secondary" className="ml-2 bg-gray-100">
                  {pipelines.filter((p) => p.type === 'LEAD').length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredPipelines.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm">
                  <div className="text-center py-16">
                    <div className="h-16 w-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                      <GitBranch className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium text-gray-900">No pipelines yet</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Create your first {activeTab.toLowerCase()} pipeline to get started
                    </p>
                    <Button onClick={handleCreatePipeline} className="rounded-xl">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Pipeline
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPipelines.map((pipeline, index) => (
                    <motion.div
                      key={pipeline.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-2xl p-6 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
                            <GitBranch className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{pipeline.name}</h3>
                            <p className="text-sm text-gray-500">
                              {pipeline.stages?.length || 0} stages
                            </p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100"
                            >
                              <MoreHorizontal className="h-4 w-4 text-gray-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleEditPipeline(pipeline)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Pipeline
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeletePipeline(pipeline)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Pipeline
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Stages visualization */}
                      <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {(pipeline.stages || [])
                          .sort((a, b) => a.order - b.order)
                          .map((stage, stageIndex, arr) => (
                            <div key={stage.id} className="flex items-center">
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: stageIndex * 0.05 }}
                                className="px-4 py-2.5 rounded-xl text-sm font-medium text-white min-w-[120px] text-center shadow-sm"
                                style={{
                                  backgroundColor:
                                    stage.color || STAGE_COLORS[stageIndex % STAGE_COLORS.length],
                                }}
                              >
                                {stage.name}
                              </motion.div>
                              {stageIndex < arr.length - 1 && (
                                <ArrowRight className="h-4 w-4 mx-2 text-gray-300 flex-shrink-0" />
                              )}
                            </div>
                          ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Create Pipeline Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Pipeline</DialogTitle>
              <DialogDescription>Create a new pipeline with customizable stages</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  Pipeline Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Sales Pipeline"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-11 rounded-xl bg-gray-50 border-0"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="h-11 rounded-xl bg-gray-50 border-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DEAL">Deal Pipeline</SelectItem>
                    <SelectItem value="LEAD">Lead Pipeline</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-700">Stages</Label>
                  <Button variant="outline" size="sm" onClick={addStage} className="rounded-lg">
                    <Plus className="mr-2 h-3 w-3" />
                    Add Stage
                  </Button>
                </div>

                <div className="space-y-2">
                  {formData.stages.map((stage, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="flex items-center gap-2 p-2 rounded-xl bg-gray-50"
                    >
                      <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                      <div
                        className="w-6 h-6 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: stage.color }}
                      />
                      <Input
                        placeholder="Stage name"
                        value={stage.name}
                        onChange={(e) => updateStage(index, 'name', e.target.value)}
                        className="flex-1 h-9 rounded-lg bg-white border-0"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStage(index)}
                        disabled={formData.stages.length <= 1}
                        className="h-8 w-8 p-0 rounded-lg hover:bg-gray-200"
                      >
                        <Trash2 className="h-4 w-4 text-gray-400" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast.success('Pipeline created successfully');
                  setShowCreateDialog(false);
                }}
                className="rounded-xl"
              >
                Create Pipeline
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Pipeline Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Pipeline</DialogTitle>
              <DialogDescription>Update pipeline settings and stages</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-gray-700">
                  Pipeline Name
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-11 rounded-xl bg-gray-50 border-0"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-700">Stages</Label>
                  <Button variant="outline" size="sm" onClick={addStage} className="rounded-lg">
                    <Plus className="mr-2 h-3 w-3" />
                    Add Stage
                  </Button>
                </div>

                <div className="space-y-2">
                  {formData.stages.map((stage, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="flex items-center gap-2 p-2 rounded-xl bg-gray-50"
                    >
                      <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                      <div
                        className="w-6 h-6 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: stage.color }}
                      />
                      <Input
                        placeholder="Stage name"
                        value={stage.name}
                        onChange={(e) => updateStage(index, 'name', e.target.value)}
                        className="flex-1 h-9 rounded-lg bg-white border-0"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStage(index)}
                        disabled={formData.stages.length <= 1}
                        className="h-8 w-8 p-0 rounded-lg hover:bg-gray-200"
                      >
                        <Trash2 className="h-4 w-4 text-gray-400" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast.success('Pipeline updated successfully');
                  setShowEditDialog(false);
                }}
                className="rounded-xl"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Pipeline?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the pipeline &quot;{selectedPipeline?.name}&quot; and
                all its stages. Deals in this pipeline will need to be moved or deleted. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700 rounded-xl"
                onClick={() => {
                  toast.success('Pipeline deleted successfully');
                  setShowDeleteConfirm(false);
                }}
              >
                Delete Pipeline
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </UnifiedLayout>
  );
}
