'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch,
  Users,
  Building2,
  User,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Move,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { HubLayout, createStat } from '@/components/layout/hub-layout';

const orgStructure = {
  id: 'ceo',
  name: 'CEO',
  person: 'John Smith',
  email: 'john.smith@company.com',
  avatar: 'JS',
  children: [
    {
      id: 'cto',
      name: 'CTO',
      person: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      avatar: 'SJ',
      department: 'Technology',
      children: [
        {
          id: 'eng-lead-1',
          name: 'Engineering Lead',
          person: 'Michael Chen',
          avatar: 'MC',
          team: 'Backend Team (12)',
        },
        {
          id: 'eng-lead-2',
          name: 'Engineering Lead',
          person: 'Priya Sharma',
          avatar: 'PS',
          team: 'Frontend Team (8)',
        },
        {
          id: 'devops-lead',
          name: 'DevOps Lead',
          person: 'Rahul Gupta',
          avatar: 'RG',
          team: 'DevOps Team (5)',
        },
      ],
    },
    {
      id: 'cfo',
      name: 'CFO',
      person: 'Emily Brown',
      email: 'emily.brown@company.com',
      avatar: 'EB',
      department: 'Finance',
      children: [
        {
          id: 'finance-mgr',
          name: 'Finance Manager',
          person: 'David Wilson',
          avatar: 'DW',
          team: 'Accounts Team (6)',
        },
        {
          id: 'audit-head',
          name: 'Audit Head',
          person: 'Lisa Anderson',
          avatar: 'LA',
          team: 'Audit Team (4)',
        },
      ],
    },
    {
      id: 'coo',
      name: 'COO',
      person: 'James Miller',
      email: 'james.miller@company.com',
      avatar: 'JM',
      department: 'Operations',
      children: [
        {
          id: 'hr-director',
          name: 'HR Director',
          person: 'Nina Patel',
          avatar: 'NP',
          team: 'HR Team (8)',
        },
        {
          id: 'admin-head',
          name: 'Admin Head',
          person: 'Tom Harris',
          avatar: 'TH',
          team: 'Admin Team (10)',
        },
      ],
    },
    {
      id: 'cmo',
      name: 'CMO',
      person: 'Alice Cooper',
      email: 'alice.cooper@company.com',
      avatar: 'AC',
      department: 'Marketing',
      children: [
        {
          id: 'marketing-lead',
          name: 'Marketing Lead',
          person: 'Bob Williams',
          avatar: 'BW',
          team: 'Marketing Team (15)',
        },
        {
          id: 'sales-director',
          name: 'Sales Director',
          person: 'Carol Davis',
          avatar: 'CD',
          team: 'Sales Team (20)',
        },
      ],
    },
  ],
};

// Department colors
const departmentColors = {
  Technology: 'from-blue-500 to-indigo-500',
  Finance: 'from-green-500 to-emerald-500',
  Operations: 'from-amber-500 to-orange-500',
  Marketing: 'from-purple-500 to-pink-500',
};

// Org Node Component with animations
function OrgNode({ node, level = 0, index = 0, onSelect, selectedId, expanded, onToggle }) {
  const isSelected = selectedId === node.id;
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expanded[node.id] !== false;
  const departmentColor = node.department
    ? departmentColors[node.department]
    : 'from-primary to-primary';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: level * 0.1 + index * 0.05, duration: 0.3 }}
      className="flex flex-col items-center"
    >
      {/* Node Card */}
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect(node)}
        className={cn(
          'relative cursor-pointer transition-shadow',
          isSelected && 'ring-2 ring-primary ring-offset-2'
        )}
      >
        <Card className={cn('min-w-[180px] overflow-hidden', level === 0 && 'min-w-[220px]')}>
          {/* Color bar at top */}
          <div className={cn('h-1.5 bg-gradient-to-r', departmentColor)} />

          <div className="p-3">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm',
                  level === 0
                    ? 'bg-gradient-to-br from-primary to-primary/80 text-white'
                    : 'bg-primary/10'
                )}
              >
                <span
                  className={cn(
                    'text-sm font-semibold',
                    level === 0 ? 'text-white' : 'text-primary'
                  )}
                >
                  {node.avatar}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate">{node.person}</p>
                <p className="text-xs text-muted-foreground truncate">{node.name}</p>
                {node.department && (
                  <Badge variant="secondary" className="mt-1 text-[10px] px-1.5 py-0">
                    {node.department}
                  </Badge>
                )}
                {node.team && (
                  <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {node.team}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Expand/Collapse button */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors z-10"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 text-gray-500" />
            ) : (
              <ChevronRight className="h-3 w-3 text-gray-500" />
            )}
          </button>
        )}
      </motion.div>

      {/* Children */}
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            {/* Vertical connector */}
            <div className="w-0.5 h-8 bg-gray-300" />

            {/* Horizontal connector and children */}
            <div className="relative flex items-start gap-6">
              {/* Horizontal line */}
              {node.children.length > 1 && (
                <div
                  className="absolute top-0 h-0.5 bg-gray-300"
                  style={{
                    left: '50%',
                    right: '50%',
                    transform: `translateX(-50%)`,
                    width: `calc(100% - 180px)`,
                  }}
                />
              )}

              {node.children.map((child, idx) => (
                <div key={child.id} className="flex flex-col items-center">
                  {/* Vertical connector to child */}
                  <div className="w-0.5 h-4 bg-gray-300" />
                  <OrgNode
                    node={child}
                    level={level + 1}
                    index={idx}
                    onSelect={onSelect}
                    selectedId={selectedId}
                    expanded={expanded}
                    onToggle={onToggle}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function OrgChartPage() {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState(null);
  const [expanded, setExpanded] = useState({});
  const containerRef = useRef(null);

  // Zoom handlers
  const zoomIn = () => setScale((s) => Math.min(s + 0.2, 2));
  const zoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5));
  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale((s) => Math.min(Math.max(s + delta, 0.5), 2));
    }
  }, []);

  // Pan handlers
  const handleMouseDown = (e) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Toggle node expansion
  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id],
    }));
  };

  // Stats
  const layoutStats = [
    createStat('Departments', '8', Building2, 'blue'),
    createStat('Teams', '24', Users, 'green'),
    createStat('Managers', '32', User, 'purple'),
    createStat('Lines', '156', GitBranch, 'amber'),
  ];

  // Top bar actions
  const topBarActions = (
    <>
      <Button variant="outline" size="sm" className="h-7 gap-1.5">
        <GitBranch className="h-3.5 w-3.5" />
        <span className="text-xs">Edit Structure</span>
      </Button>
    </>
  );

  return (
    <HubLayout
      hubId="hr"
      showTopBar={false}
      showSidebar={false}
      title="Organization Chart"
      description="View company structure and reporting lines"
      stats={layoutStats}
      actions={topBarActions}
      showFixedMenu={false}
    >
      <div className="h-full flex flex-col">
        {/* Canvas Controls */}
        <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={zoomOut} className="h-7 w-7 p-0">
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs font-medium w-12 text-center">{Math.round(scale * 100)}%</span>
            <Button variant="outline" size="sm" onClick={zoomIn} className="h-7 w-7 p-0">
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="sm" onClick={resetView} className="h-7 px-2 gap-1">
              <Maximize2 className="h-3.5 w-3.5" />
              <span className="text-xs">Reset</span>
            </Button>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Move className="h-3.5 w-3.5" />
            <span>Drag to pan • Ctrl+Scroll to zoom</span>
          </div>
        </div>

        {/* Interactive Canvas */}
        <div
          ref={containerRef}
          className={cn(
            'flex-1 overflow-hidden bg-gray-50 cursor-grab',
            isDragging && 'cursor-grabbing'
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <div
            className="h-full w-full flex items-start justify-center pt-12 pb-24"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: 'center top',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            }}
          >
            <OrgNode
              node={orgStructure}
              onSelect={setSelectedNode}
              selectedId={selectedNode?.id}
              expanded={expanded}
              onToggle={toggleExpand}
            />
          </div>
        </div>

        {/* Selected Node Details Panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-4 left-4 right-4"
            >
              <Card className="shadow-lg border-2">
                <div className="p-4 flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-lg font-semibold text-primary">
                      {selectedNode.avatar}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg">{selectedNode.person}</h3>
                    <p className="text-sm text-muted-foreground">{selectedNode.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      {selectedNode.department && (
                        <Badge variant="secondary" className="text-xs">
                          {selectedNode.department}
                        </Badge>
                      )}
                      {selectedNode.team && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {selectedNode.team}
                        </span>
                      )}
                    </div>
                  </div>
                  {selectedNode.email && (
                    <Button variant="outline" size="sm" className="gap-2">
                      <Mail className="h-4 w-4" />
                      Contact
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedNode(null)}
                    className="h-8 w-8 p-0"
                  >
                    ×
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </HubLayout>
  );
}
