import { useRef, useEffect, useCallback } from 'react';
import { GraphNode, GraphEdge, CanvasState } from '@/lib/graph-types';

interface GraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onCanvasClick: (x: number, y: number) => void;
  onNodeClick: (nodeId: string) => void;
  onMouseMove: (x: number, y: number) => void;
  selectedNode: string | null;
  previewEdge: { from: string; to: { x: number; y: number } } | null;
  visitedNodes: Set<string>;
  currentlyVisiting: string | null;
  mode: string;
  nextNodeId: number;
}

export function GraphCanvas({
  nodes,
  edges,
  onCanvasClick,
  onNodeClick,
  onMouseMove,
  selectedNode,
  previewEdge,
  visitedNodes,
  currentlyVisiting,
  mode,
  nextNodeId,
}: GraphCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getNodePosition = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  }, [nodes]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    onCanvasClick(x, y);
  }, [onCanvasClick]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    onMouseMove(x, y);
  }, [onMouseMove]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    // Right-click cancellation is handled in the parent component
  }, []);

  const getNodeClasses = useCallback((nodeId: string) => {
    let classes = "node absolute w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm shadow-lg transition-all duration-200 cursor-pointer";
    
    if (visitedNodes.has(nodeId)) {
      classes += " bg-green-500 text-white";
    } else if (currentlyVisiting === nodeId) {
      classes += " bg-orange-500 text-white animate-pulse";
    } else if (selectedNode === nodeId) {
      classes += " bg-purple-600 text-white ring-4 ring-purple-300";
    } else {
      classes += " bg-blue-600 text-white hover:bg-blue-700";
    }
    
    return classes;
  }, [visitedNodes, currentlyVisiting, selectedNode]);

  const getEdgeClasses = useCallback((edge: GraphEdge) => {
    const fromVisited = visitedNodes.has(edge.from);
    const toVisited = visitedNodes.has(edge.to);
    
    if (fromVisited && toVisited) {
      return "stroke-green-500 stroke-2";
    } else if (fromVisited || toVisited) {
      return "stroke-orange-500 stroke-2";
    }
    
    return "stroke-slate-400 stroke-2";
  }, [visitedNodes]);

  return (
    <div className="flex-1 flex flex-col relative">
      {/* Canvas Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-slate-900">Interactive Canvas</h2>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <i className="fas fa-info-circle"></i>
            <span>
              {mode === 'addNode' && 'Click on the canvas to add nodes'}
              {mode === 'addEdge' && 'Click a node, then click another to connect them'}
              {mode === 'algorithm' && 'Algorithm visualization in progress'}
            </span>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        ref={canvasRef}
        className="flex-1 relative overflow-hidden bg-white cursor-crosshair"
        style={{
          backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onContextMenu={handleContextMenu}
      >
        {/* SVG for edges */}
        <svg 
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        >
          {/* Render edges */}
          {edges.map(edge => {
            const fromPos = getNodePosition(edge.from);
            const toPos = getNodePosition(edge.to);
            return (
              <line
                key={edge.id}
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                className={getEdgeClasses(edge)}
              />
            );
          })}
          
          {/* Preview edge */}
          {previewEdge && (
            <line
              x1={getNodePosition(previewEdge.from).x}
              y1={getNodePosition(previewEdge.from).y}
              x2={previewEdge.to.x}
              y2={previewEdge.to.y}
              className="stroke-purple-400 stroke-2 opacity-50"
            />
          )}
        </svg>

        {/* Nodes Container */}
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          {nodes.map(node => (
            <div
              key={node.id}
              className={getNodeClasses(node.id)}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={(e) => {
                e.stopPropagation();
                onNodeClick(node.id);
              }}
            >
              {node.label}
            </div>
          ))}
        </div>

        {/* Mouse Preview Node */}
        {mode === 'addNode' && (
          <div 
            className="mouse-preview-node absolute w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-lg opacity-50 pointer-events-none"
            style={{ 
              transform: 'translate(-50%, -50%)',
              zIndex: 3,
              display: 'none'
            }}
          >
            {nextNodeId}
          </div>
        )}
      </div>
    </div>
  );
}

// Add mouse tracking for preview node
export function useMousePreview(canvasRef: React.RefObject<HTMLDivElement>, mode: string) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const previewNode = canvas.querySelector('.mouse-preview-node') as HTMLElement;
    if (!previewNode) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (mode === 'addNode') {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        previewNode.style.left = `${x}px`;
        previewNode.style.top = `${y}px`;
        previewNode.style.display = 'block';
      } else {
        previewNode.style.display = 'none';
      }
    };

    const handleMouseLeave = () => {
      previewNode.style.display = 'none';
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [canvasRef, mode]);
}
