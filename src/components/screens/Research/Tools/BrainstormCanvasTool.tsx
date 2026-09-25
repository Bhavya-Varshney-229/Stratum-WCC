import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Move,
  Link as LinkIcon,
  RotateCcw,
  Check,
  Zap,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Shield,
  Lightbulb,
  CheckCircle2,
  X,
  Edit2,
  Undo2,
  Redo2,
} from 'lucide-react';
import { CanvasNode } from '../../../../types/venture';

interface BrainstormCanvasToolProps {
  initialNodes: CanvasNode[];
  onUpdateNodes: (nodes: CanvasNode[]) => void;
  projectContext?: any;
}

export const BrainstormCanvasTool: React.FC<BrainstormCanvasToolProps> = ({
  initialNodes,
  onUpdateNodes,
  projectContext,
}) => {
  const [nodes, setNodes] = useState<CanvasNode[]>(initialNodes || []);

  const [history, setHistory] = useState<CanvasNode[][]>([initialNodes || []]);
  const [historyIdx, setHistoryIdx] = useState(0);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(initialNodes?.[0]?.id || null);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [newNodeTitle, setNewNodeTitle] = useState('');
  const [newNodeCategory, setNewNodeCategory] = useState<CanvasNode['category']>('Product');

  // Dragging and pan/zoom state
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Contextual action menu modal / panel
  const [contextAction, setContextAction] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Sync when project initialNodes change
  useEffect(() => {
    if (initialNodes) {
      setNodes(initialNodes);
      setHistory([initialNodes]);
      setHistoryIdx(0);
      if (!selectedNodeId && initialNodes.length > 0) {
        setSelectedNodeId(initialNodes[0].id);
      }
    }
  }, [initialNodes]);

  const pushHistory = (newNodes: CanvasNode[]) => {
    const updatedHistory = history.slice(0, historyIdx + 1);
    updatedHistory.push(newNodes);
    setHistory(updatedHistory);
    setHistoryIdx(updatedHistory.length - 1);
    setNodes(newNodes);
    onUpdateNodes(newNodes);
  };

  const handleUndo = () => {
    if (historyIdx > 0) {
      const prev = history[historyIdx - 1];
      setHistoryIdx(historyIdx - 1);
      setNodes(prev);
      onUpdateNodes(prev);
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      const next = history[historyIdx + 1];
      setHistoryIdx(historyIdx + 1);
      setNodes(next);
      onUpdateNodes(next);
    }
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  // Dragging Node Logic
  const handleMouseDownNode = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedNodeId(id);
    setDraggedNodeId(id);
    const node = nodes.find((n) => n.id === id);
    if (node) {
      setDragOffset({
        x: e.clientX - node.x * zoomLevel - panOffset.x,
        y: e.clientY - node.y * zoomLevel - panOffset.y,
      });
    }
  };

  // Canvas Pan Logic
  const handleMouseDownCanvas = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNodeId) {
      const newX = (e.clientX - dragOffset.x - panOffset.x) / zoomLevel;
      const newY = (e.clientY - dragOffset.y - panOffset.y) / zoomLevel;

      setNodes((prev) =>
        prev.map((n) => (n.id === draggedNodeId ? { ...n, x: Math.round(newX), y: Math.round(newY) } : n))
      );
    } else if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    if (draggedNodeId) {
      pushHistory(nodes);
      setDraggedNodeId(null);
    }
    setIsPanning(false);
  };

  const handleAddNode = () => {
    if (!newNodeTitle.trim()) return;
    const newNode: CanvasNode = {
      id: `node-${Date.now()}`,
      title: newNodeTitle.trim(),
      description: `Hypothesis branch for ${newNodeCategory}`,
      category: newNodeCategory,
      x: 180 + Math.random() * 120,
      y: 140 + Math.random() * 100,
      connectedTo: selectedNodeId ? [selectedNodeId] : [],
    };
    const updated = [...nodes, newNode];
    pushHistory(updated);
    setSelectedNodeId(newNode.id);
    setNewNodeTitle('');
    setIsAddingNode(false);
  };

  const handleDeleteNode = (id: string) => {
    const updated = nodes
      .filter((n) => n.id !== id)
      .map((n) => ({
        ...n,
        connectedTo: n.connectedTo.filter((connId) => connId !== id),
      }));
    pushHistory(updated);
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  // AI-Powered Actions on selected node
  const handleAiAction = async (actionType: string) => {
    if (!selectedNode || isExpanding) return;
    setIsExpanding(true);
    setContextAction(actionType);

    try {
      const res = await fetch('/api/ai/generate-canvas-node', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentTitle: selectedNode.title,
          parentCategory: selectedNode.category,
          brief: `${actionType}: ${selectedNode.title}`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const subNode: CanvasNode = {
          id: `node-${Date.now()}`,
          title: data.title || `${actionType}: ${selectedNode.title}`,
          description: data.description || 'AI Synthesized thesis branch grounded in project constraints.',
          category: (data.category as CanvasNode['category']) || 'Feature',
          x: Math.round(selectedNode.x + 160 + (Math.random() * 40 - 20)),
          y: Math.round(selectedNode.y + 60 + (Math.random() * 40 - 20)),
          connectedTo: [selectedNode.id],
        };
        const updated = [...nodes, subNode];
        pushHistory(updated);
        setSelectedNodeId(subNode.id);
        setActionFeedback(`Created hypothesis: "${subNode.title}"`);
        setTimeout(() => setActionFeedback(null), 3000);
      }
    } catch {
      const subNode: CanvasNode = {
        id: `node-${Date.now()}`,
        title: `${actionType}: Derivative`,
        description: 'Context-specific hypothesis branch',
        category: 'Feature',
        x: selectedNode.x + 150,
        y: selectedNode.y + 50,
        connectedTo: [selectedNode.id],
      };
      const updated = [...nodes, subNode];
      pushHistory(updated);
      setSelectedNodeId(subNode.id);
    } finally {
      setIsExpanding(false);
      setContextAction(null);
    }
  };

  const handleStartEdit = (node: CanvasNode) => {
    setEditingNodeId(node.id);
    setEditingText(node.title);
  };

  const handleSaveEdit = () => {
    if (!editingNodeId || !editingText.trim()) return;
    const updated = nodes.map((n) => (n.id === editingNodeId ? { ...n, title: editingText.trim() } : n));
    pushHistory(updated);
    setEditingNodeId(null);
  };

  const handleAutoArrange = () => {
    // Layout in a clean radial or tree arrangement
    const root = nodes[0] || { x: 250, y: 180 };
    const updated = nodes.map((node, i) => {
      if (i === 0) return { ...node, x: 240, y: 160 };
      const angle = ((i - 1) / Math.max(1, nodes.length - 1)) * Math.PI * 2;
      const radius = 170;
      return {
        ...node,
        x: Math.round(240 + Math.cos(angle) * radius),
        y: Math.round(160 + Math.sin(angle) * radius),
      };
    });
    pushHistory(updated);
  };

  const handleFitToScreen = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleExportCanvas = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(nodes, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', 'stratum_brainstorm_canvas.json');
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  };

  const categoryColorMap: Record<CanvasNode['category'], { bg: string; border: string; text: string }> = {
    Core: { bg: 'bg-[#FF6124]', border: 'border-[#E04D15]', text: 'text-white' },
    Product: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-300 dark:border-emerald-800', text: 'text-emerald-900 dark:text-emerald-200' },
    Market: { bg: 'bg-blue-50 dark:bg-blue-950/40', border: 'border-blue-300 dark:border-blue-800', text: 'text-blue-900 dark:text-blue-200' },
    Feature: { bg: 'bg-purple-50 dark:bg-purple-950/40', border: 'border-purple-300 dark:border-purple-800', text: 'text-purple-900 dark:text-purple-200' },
    Distribution: { bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-300 dark:border-amber-800', text: 'text-amber-900 dark:text-amber-200' },
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E4DFD3] dark:border-[#2a2a2a] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6124]">
              Interactive Mind Map
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
              Autosaved
            </span>
          </div>
          <h2 className="text-sm font-extrabold text-[#1C1917] dark:text-[#F5F3EC]">
            Visual Brainstorming Canvas
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Undo / Redo */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyIdx <= 0}
            className="p-1.5 rounded-lg border border-[#E4DFD3] dark:border-[#333] hover:bg-stone-100 dark:hover:bg-[#252525] disabled:opacity-30 cursor-pointer text-stone-600 dark:text-stone-300"
            title="Undo"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={historyIdx >= history.length - 1}
            className="p-1.5 rounded-lg border border-[#E4DFD3] dark:border-[#333] hover:bg-stone-100 dark:hover:bg-[#252525] disabled:opacity-30 cursor-pointer text-stone-600 dark:text-stone-300"
            title="Redo"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-stone-200 dark:bg-stone-700 mx-1" />

          {/* Zoom & Fit */}
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.15))}
            className="p-1.5 rounded-lg border border-[#E4DFD3] dark:border-[#333] hover:bg-stone-100 dark:hover:bg-[#252525] cursor-pointer text-stone-600 dark:text-stone-300"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.15))}
            className="p-1.5 rounded-lg border border-[#E4DFD3] dark:border-[#333] hover:bg-stone-100 dark:hover:bg-[#252525] cursor-pointer text-stone-600 dark:text-stone-300"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleFitToScreen}
            className="p-1.5 rounded-lg border border-[#E4DFD3] dark:border-[#333] hover:bg-stone-100 dark:hover:bg-[#252525] cursor-pointer text-stone-600 dark:text-stone-300"
            title="Fit to Screen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleAutoArrange}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-[#E4DFD3] dark:border-[#333] hover:bg-stone-100 dark:hover:bg-[#252525] cursor-pointer text-stone-600 dark:text-stone-300"
            title="Auto-arrange nodes"
          >
            Clean Layout
          </button>

          <button
            type="button"
            onClick={handleExportCanvas}
            className="p-1.5 rounded-lg border border-[#E4DFD3] dark:border-[#333] hover:bg-stone-100 dark:hover:bg-[#252525] cursor-pointer text-stone-600 dark:text-stone-300"
            title="Export Canvas JSON"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsAddingNode(true)}
            className="px-3 py-1.5 text-xs font-bold text-white bg-[#FF6124] hover:bg-[#e5531b] rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Node</span>
          </button>
        </div>
      </div>

      {/* Inline Feedback Banner */}
      {actionFeedback && (
        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Add Node Panel */}
      {isAddingNode && (
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#1a1a1a] border border-[#FF6124] shadow-md flex flex-wrap items-center gap-2 animate-in fade-in duration-150">
          <input
            type="text"
            value={newNodeTitle}
            onChange={(e) => setNewNodeTitle(e.target.value)}
            placeholder="Node Title (e.g. Edge Hardware Gateway)..."
            className="px-3 py-1.5 text-xs bg-[#FAF8F3] dark:bg-[#252525] border border-[#E4DFD3] dark:border-[#333] rounded-lg text-[#1C1917] dark:text-[#F5F3EC] focus:outline-none focus:border-[#FF6124] flex-1 min-w-[200px]"
            autoFocus
          />
          <select
            value={newNodeCategory}
            onChange={(e) => setNewNodeCategory(e.target.value as CanvasNode['category'])}
            className="px-2.5 py-1.5 text-xs bg-[#FAF8F3] dark:bg-[#252525] border border-[#E4DFD3] dark:border-[#333] rounded-lg text-[#1C1917] dark:text-[#F5F3EC]"
          >
            <option value="Product">Product</option>
            <option value="Market">Market</option>
            <option value="Feature">Feature</option>
            <option value="Distribution">Distribution</option>
          </select>
          <button
            type="button"
            onClick={handleAddNode}
            className="px-3 py-1.5 text-xs font-bold text-white bg-[#FF6124] hover:bg-[#e5531b] rounded-lg cursor-pointer"
          >
            Create Node
          </button>
          <button
            type="button"
            onClick={() => setIsAddingNode(false)}
            className="px-2.5 py-1.5 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Canvas Viewport */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDownCanvas}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="relative w-full h-[520px] bg-[#FAF8F3] dark:bg-[#141414] border border-[#E4DFD3] dark:border-[#2a2a2a] rounded-2xl overflow-hidden shadow-inner select-none cursor-grab active:cursor-grabbing"
      >
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#57534E 1px, transparent 1px)',
            backgroundSize: `${20 * zoomLevel}px ${20 * zoomLevel}px`,
            backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
          }}
        />

        {/* Transformed Stage */}
        <div
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: '0 0',
          }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          {/* SVG Connections between Nodes */}
          <svg className="absolute inset-0 w-[2000px] h-[2000px] pointer-events-none overflow-visible">
            {nodes.map((node) =>
              node.connectedTo.map((targetId) => {
                const targetNode = nodes.find((n) => n.id === targetId);
                if (!targetNode) return null;
                return (
                  <line
                    key={`${node.id}-${targetId}`}
                    x1={node.x + 85}
                    y1={node.y + 40}
                    x2={targetNode.x + 85}
                    y2={targetNode.y + 40}
                    stroke="#FF6124"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.55"
                  />
                );
              })
            )}
          </svg>

          {/* Render Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const styleConf = categoryColorMap[node.category] || categoryColorMap.Product;
            const isRoot = node.category === 'Core';

            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleMouseDownNode(e, node.id)}
                style={{ left: `${node.x}px`, top: `${node.y}px` }}
                className={`absolute w-44 p-3 rounded-2xl border transition-shadow cursor-pointer pointer-events-auto ${
                  styleConf.bg
                } ${styleConf.border} ${
                  isSelected
                    ? 'ring-2 ring-[#FF6124] shadow-lg z-30 scale-105'
                    : 'shadow-2xs hover:shadow-md z-10'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span
                    className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-bold ${
                      isRoot ? 'bg-white/20 text-white' : 'bg-black/10 dark:bg-white/10 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {node.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEdit(node);
                      }}
                      className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10"
                      title="Edit label"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    {!isRoot && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNode(node.id);
                        }}
                        className="p-0.5 rounded hover:bg-red-500/20 text-red-600 dark:text-red-400"
                        title="Delete node"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {editingNodeId === node.id ? (
                  <div className="space-y-1" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="w-full text-xs p-1 rounded bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-[#FF6124]"
                      autoFocus
                    />
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        className="px-2 py-0.5 text-[10px] font-bold bg-[#FF6124] text-white rounded"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className={`text-xs font-bold leading-tight ${styleConf.text}`}>
                      {node.title}
                    </h4>
                    <p className={`text-[10px] mt-1 line-clamp-2 leading-relaxed opacity-85 ${styleConf.text}`}>
                      {node.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Node Floating Action Menu (Mandated AI Menu) */}
        {selectedNode && (
          <div className="absolute left-4 bottom-4 z-40 bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur-md p-3 rounded-2xl border border-[#E4DFD3] dark:border-[#333] shadow-lg max-w-sm space-y-2 pointer-events-auto">
            <div className="flex items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-1.5">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6124]" />
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 truncate">
                  AI Context Actions: {selectedNode.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNodeId(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleAiAction('EXPAND')}
                disabled={isExpanding}
                className="px-2.5 py-1.5 rounded-lg border border-[#E4DFD3] dark:border-[#333] hover:border-[#FF6124] hover:bg-[#FF6124]/10 text-stone-700 dark:text-stone-300 font-semibold text-left transition-colors cursor-pointer"
              >
                ✦ Expand with AI
              </button>
              <button
                type="button"
                onClick={() => handleAiAction('ALTERNATIVES')}
                disabled={isExpanding}
                className="px-2.5 py-1.5 rounded-lg border border-[#E4DFD3] dark:border-[#333] hover:border-[#FF6124] hover:bg-[#FF6124]/10 text-stone-700 dark:text-stone-300 font-semibold text-left transition-colors cursor-pointer"
              >
                ✦ Alternatives
              </button>
              <button
                type="button"
                onClick={() => handleAiAction('CHALLENGE')}
                disabled={isExpanding}
                className="px-2.5 py-1.5 rounded-lg border border-[#E4DFD3] dark:border-[#333] hover:border-[#FF6124] hover:bg-[#FF6124]/10 text-stone-700 dark:text-stone-300 font-semibold text-left transition-colors cursor-pointer"
              >
                ✦ Challenge Idea
              </button>
              <button
                type="button"
                onClick={() => handleAiAction('VALIDATION')}
                disabled={isExpanding}
                className="px-2.5 py-1.5 rounded-lg border border-[#E4DFD3] dark:border-[#333] hover:border-[#FF6124] hover:bg-[#FF6124]/10 text-stone-700 dark:text-stone-300 font-semibold text-left transition-colors cursor-pointer"
              >
                ✦ Experiment Plan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
