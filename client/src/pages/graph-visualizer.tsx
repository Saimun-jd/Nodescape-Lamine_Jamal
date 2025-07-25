import { useEffect, useCallback, useState } from 'react';
import { useGraph } from '@/hooks/use-graph';
import { useAlgorithm } from '@/hooks/use-algorithm';
import { GraphCanvas } from '@/components/graph-canvas';
import { Sidebar } from '@/components/sidebar';
import { AlgorithmControls } from '@/components/algorithm-controls';
import { HelpModal } from '@/components/help-modal';
import { TraversalOrderDisplay } from '@/components/traversal-order-display';
import { AlgorithmType } from '@/lib/graph-types';
import { useToast } from '@/hooks/use-toast';

export default function GraphVisualizer() {
  const { toast } = useToast();
  const {
    graphState,
    mode,
    selectedNode,
    previewEdge,
    setMode,
    clearGraph,
    handleNodeClick,
    handleCanvasClick,
    handleMouseMove,
    cancelEdgeCreation,
  } = useGraph();

  const {
    algorithmState,
    animationSpeed,
    setAnimationSpeed,
    startVisualization,
    pauseVisualization,
    stepForward,
    resetAlgorithm,
    getCurrentQueueOrStack,
  } = useAlgorithm();

  // Algorithm selection state
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType | null>(null);
  const [selectedStartNode, setSelectedStartNode] = useState<string | null>(null);
  const [showTraversalOrder, setShowTraversalOrder] = useState(true);

  // Handle right-click for cancellation
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      if (mode === 'addEdge' && selectedNode) {
        cancelEdgeCreation();
        toast({
          title: "Edge creation cancelled",
          description: "Right-click detected, edge creation has been cancelled.",
        });
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, [mode, selectedNode, cancelEdgeCreation, toast]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          if (mode === 'addEdge' && selectedNode) {
            cancelEdgeCreation();
          }
          break;
        case ' ':
          if (algorithmState.isRunning || algorithmState.totalSteps > 0) {
            e.preventDefault();
            pauseVisualization();
          }
          break;
        case 'Delete':
          if (!algorithmState.isRunning) {
            clearGraph();
            resetAlgorithm();
            setSelectedStartNode(null);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mode, selectedNode, algorithmState, cancelEdgeCreation, pauseVisualization, clearGraph, resetAlgorithm]);

  // Handle mode changes during algorithm
  useEffect(() => {
    if (algorithmState.isRunning) {
      setMode('algorithm');
    }
  }, [algorithmState.isRunning, setMode]);

  const handleStartVisualization = useCallback(() => {
    if (!selectedAlgorithm || !selectedStartNode) {
      toast({
        title: "Missing selection",
        description: "Please select both an algorithm and a start node.",
        variant: "destructive",
      });
      return;
    }

    if (graphState.nodes.length === 0) {
      toast({
        title: "Empty graph",
        description: "Please add some nodes to the graph first.",
        variant: "destructive",
      });
      return;
    }

    startVisualization(selectedAlgorithm, selectedStartNode, graphState.nodes, graphState.edges);
    setMode('algorithm');
    setShowTraversalOrder(true);
    
    toast({
      title: "Visualization started",
      description: `${selectedAlgorithm.toUpperCase()} traversal starting from node ${selectedStartNode}.`,
    });
  }, [selectedAlgorithm, selectedStartNode, graphState, startVisualization, setMode, toast]);

  const handleClearGraph = useCallback(() => {
    clearGraph();
    resetAlgorithm();
    setSelectedStartNode(null);
    setShowTraversalOrder(false);
    
    toast({
      title: "Graph cleared",
      description: "All nodes and edges have been removed.",
    });
  }, [clearGraph, resetAlgorithm, toast]);

  const availableNodes = graphState.nodes.map(node => ({
    id: node.id,
    label: node.label,
  }));

  const canStartVisualization = 
    selectedAlgorithm !== null && 
    selectedStartNode !== null && 
    graphState.nodes.length > 0 &&
    !algorithmState.isRunning;

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        mode={mode}
        setMode={setMode}
        nodeCount={graphState.nodes.length}
        edgeCount={graphState.edges.length}
        selectedAlgorithm={selectedAlgorithm}
        setSelectedAlgorithm={setSelectedAlgorithm}
        selectedStartNode={selectedStartNode}
        setSelectedStartNode={setSelectedStartNode}
        availableNodes={availableNodes}
        onStartVisualization={handleStartVisualization}
        onPauseVisualization={pauseVisualization}
        onStepForward={stepForward}
        onResetVisualization={resetAlgorithm}
        onClearGraph={handleClearGraph}
        algorithmState={algorithmState}
        animationSpeed={animationSpeed}
        setAnimationSpeed={setAnimationSpeed}
        canStartVisualization={canStartVisualization}
      />

      <GraphCanvas
        nodes={graphState.nodes}
        edges={graphState.edges}
        onCanvasClick={handleCanvasClick}
        onNodeClick={handleNodeClick}
        onMouseMove={handleMouseMove}
        selectedNode={selectedNode}
        previewEdge={previewEdge}
        visitedNodes={algorithmState.visitedNodes}
        currentlyVisiting={algorithmState.currentlyVisiting}
        mode={mode}
        nextNodeId={graphState.nextNodeId}
      />

      <AlgorithmControls
        algorithmState={algorithmState}
        currentQueueOrStack={getCurrentQueueOrStack()}
      />

      <TraversalOrderDisplay
        traversalOrder={algorithmState.traversalOrder}
        algorithm={algorithmState.algorithm}
        isVisible={!algorithmState.isRunning && algorithmState.traversalOrder.length > 0 && showTraversalOrder}
        onDismiss={() => setShowTraversalOrder(false)}
      />

      <HelpModal />
    </div>
  );
}
