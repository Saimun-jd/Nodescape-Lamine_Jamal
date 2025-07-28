import { useRef, useEffect, useCallback } from 'react';
import { GraphNode, GraphEdge, CanvasState } from '@/lib/graph-types';

interface GraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onCanvasClick: (x: number, y: number) => void;
  onNodeClick: (nodeId: string) => void;
  onEdgeClick: (edgeId: string) => void;
  onMouseMove: (x: number, y: number) => void;
  onNodeMouseEnter: (nodeId: string) => void;
  onNodeMouseLeave: () => void;
  onEdgeMouseEnter: (edgeId: string) => void;
  onEdgeMouseLeave: () => void;
  selectedNode: string | null;
  previewEdge: { from: string; to: { x: number; y: number } } | null;
  hoveredNode: string | null;
  hoveredEdge: string | null;
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
  onEdgeClick,
  onMouseMove,
  onNodeMouseEnter,
  onNodeMouseLeave,
  onEdgeMouseEnter,
  onEdgeMouseLeave,
  selectedNode,
  previewEdge,
  hoveredNode,
  hoveredEdge,
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
    
    if (mode === 'delete') {
      classes += " hover:bg-red-600 hover:scale-110";
    }
    
    if (visitedNodes.has(nodeId)) {
      classes += " bg-green-500 text-white";
    } else if (currentlyVisiting === nodeId) {
      classes += " bg-orange-500 text-white animate-pulse";
    } else if (selectedNode === nodeId) {
      classes += " bg-purple-600 text-white ring-4 ring-purple-300";
    } else if (hoveredNode === nodeId) {
      classes += mode === 'delete' ? " bg-red-500 text-white" : " bg-blue-700 text-white";
    } else {
      classes += " bg-blue-600 text-white hover:bg-blue-700";
    }
    
    return classes;
  }, [visitedNodes, currentlyVisiting, selectedNode, hoveredNode, mode]);

  const getEdgeClasses = useCallback((edge: GraphEdge) => {
    const fromVisited = visitedNodes.has(edge.from);
    const toVisited = visitedNodes.has(edge.to);
    
    let classes = "stroke-2 fill-none transition-all duration-200";
    
    if (mode === 'delete') {
      classes += " cursor-pointer hover:stroke-red-500 hover:stroke-3";
    }
    
    if (hoveredEdge === edge.id) {
      classes += mode === 'delete' ? " stroke-red-500 stroke-3" : " stroke-blue-500 stroke-3";
    } else if (fromVisited && toVisited) {
      classes += " stroke-green-500";
    } else if (fromVisited || toVisited) {
      classes += " stroke-orange-500";
    } else {
      classes += " stroke-slate-400";
    }
    
    return classes;
  }, [visitedNodes, hoveredEdge, mode]);

  // Calculate arrow position and angle
  const calculateArrowPath = useCallback((fromPos: { x: number; y: number }, toPos: { x: number; y: number }) => {
    const nodeRadius = 24; // Half of node width (48px / 2)
    const arrowLength = 12;
    const arrowWidth = 8;
    
    // Calculate direction vector
    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance === 0) return null;
    
    // Normalize direction vector
    const unitX = dx / distance;
    const unitY = dy / distance;
    
    // Calculate start point (edge of source node)
    const startX = fromPos.x + unitX * nodeRadius;
    const startY = fromPos.y + unitY * nodeRadius;
    
    // Calculate end point (edge of target node)
    const endX = toPos.x - unitX * nodeRadius;
    const endY = toPos.y - unitY * nodeRadius;
    
    // Calculate arrow head points
    const arrowAngle = Math.atan2(dy, dx);
    const arrowAngle1 = arrowAngle - Math.PI / 6; // 30 degrees
    const arrowAngle2 = arrowAngle + Math.PI / 6; // 30 degrees
    
    const arrowX1 = endX - arrowLength * Math.cos(arrowAngle1);
    const arrowY1 = endY - arrowLength * Math.sin(arrowAngle1);
    const arrowX2 = endX - arrowLength * Math.cos(arrowAngle2);
    const arrowY2 = endY - arrowLength * Math.sin(arrowAngle2);
    
    return {
      linePath: `M ${startX} ${startY} L ${endX} ${endY}`,
      arrowPath: `M ${endX} ${endY} L ${arrowX1} ${arrowY1} M ${endX} ${endY} L ${arrowX2} ${arrowY2}`
    };
  }, []);

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
              {mode === 'delete' && 'Click nodes or edges to delete them'}
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
          style={{ zIndex: 100 }}
        >
          {/* Define arrow marker */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="currentColor"
              />
            </marker>
          </defs>

          {/* Render edges with arrows */}
          {edges.map(edge => {
            const fromPos = getNodePosition(edge.from);
            const toPos = getNodePosition(edge.to);
            const arrowData = calculateArrowPath(fromPos, toPos);
            
            if (!arrowData) return null;
            
            return (
              <g 
                key={edge.id}
                className={mode === 'delete' ? "pointer-events-auto cursor-pointer" : ""}
                onClick={() => mode === 'delete' && onEdgeClick(edge.id)}
                onMouseEnter={() => onEdgeMouseEnter(edge.id)}
                onMouseLeave={onEdgeMouseLeave}
              >
                {/* Main edge line */}
                <path
                  d={arrowData.linePath}
                  className={`${getEdgeClasses(edge)}`}
                  markerEnd="url(#arrowhead)"
                />
                {/* Arrow head */}
                <path
                  d={arrowData.arrowPath}
                  className={`${getEdgeClasses(edge)}`}
                />
              </g>
            );
          })}
          
          {/* Preview edge */}
          {previewEdge && (
            <g>
              <path
                d={`M ${getNodePosition(previewEdge.from).x} ${getNodePosition(previewEdge.from).y} L ${previewEdge.to.x} ${previewEdge.to.y}`}
                className="stroke-purple-400 stroke-2 opacity-50 fill-none"
                markerEnd="url(#arrowhead)"
              />
            </g>
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
              onMouseEnter={() => onNodeMouseEnter(node.id)}
              onMouseLeave={onNodeMouseLeave}
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
