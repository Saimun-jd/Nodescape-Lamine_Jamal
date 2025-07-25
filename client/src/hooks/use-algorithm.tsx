import { useState, useCallback, useRef, useEffect } from 'react';
import { AlgorithmState, AlgorithmType, GraphNode, GraphEdge } from '@/lib/graph-types';
import { bfsTraversal, dfsTraversal } from '@/lib/graph-algorithms';

const initialAlgorithmState: AlgorithmState = {
  isRunning: false,
  isPaused: false,
  currentStep: 0,
  totalSteps: 0,
  steps: [],
  visitedNodes: new Set(),
  currentlyVisiting: null,
  algorithm: null,
  startNode: null,
  traversalOrder: [],
};

export function useAlgorithm() {
  const [algorithmState, setAlgorithmState] = useState<AlgorithmState>(initialAlgorithmState);
  const [animationSpeed, setAnimationSpeed] = useState(5); // 1-10 scale
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetAlgorithm = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setAlgorithmState(initialAlgorithmState);
  }, []);

  const startVisualization = useCallback((
    algorithm: AlgorithmType,
    startNodeId: string,
    nodes: GraphNode[],
    edges: GraphEdge[]
  ) => {
    resetAlgorithm();

    const steps = algorithm === 'bfs' 
      ? bfsTraversal(nodes, edges, startNodeId)
      : dfsTraversal(nodes, edges, startNodeId);

    setAlgorithmState({
      ...initialAlgorithmState,
      isRunning: true,
      algorithm,
      startNode: startNodeId,
      steps,
      totalSteps: steps.length,
    });
  }, [resetAlgorithm]);

  const pauseVisualization = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setAlgorithmState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const stepForward = useCallback(() => {
    setAlgorithmState(prev => {
      if (prev.currentStep >= prev.totalSteps - 1) return prev;
      
      const nextStep = prev.currentStep + 1;
      const step = prev.steps[nextStep];
      const newVisitedNodes = new Set(prev.visitedNodes);
      const newTraversalOrder = [...prev.traversalOrder];
      let currentlyVisiting = prev.currentlyVisiting;

      if (step.action === 'visit') {
        currentlyVisiting = step.nodeId;
      } else if (step.action === 'complete') {
        newVisitedNodes.add(step.nodeId);
        newTraversalOrder.push(step.nodeId);
        currentlyVisiting = null;
      }

      return {
        ...prev,
        currentStep: nextStep,
        visitedNodes: newVisitedNodes,
        currentlyVisiting,
        traversalOrder: newTraversalOrder,
        isRunning: nextStep < prev.totalSteps - 1,
      };
    });
  }, []);

  // Auto-step animation
  useEffect(() => {
    if (algorithmState.isRunning && !algorithmState.isPaused) {
      const delay = 1100 - (animationSpeed * 100); // Convert speed 1-10 to delay 1000-100ms
      
      intervalRef.current = setInterval(() => {
        setAlgorithmState(prev => {
          if (prev.currentStep >= prev.totalSteps - 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return { ...prev, isRunning: false };
          }
          
          const nextStep = prev.currentStep + 1;
          const step = prev.steps[nextStep];
          const newVisitedNodes = new Set(prev.visitedNodes);
          const newTraversalOrder = [...prev.traversalOrder];
          let currentlyVisiting = prev.currentlyVisiting;

          if (step.action === 'visit') {
            currentlyVisiting = step.nodeId;
          } else if (step.action === 'complete') {
            newVisitedNodes.add(step.nodeId);
            newTraversalOrder.push(step.nodeId);
            currentlyVisiting = null;
          }

          return {
            ...prev,
            currentStep: nextStep,
            visitedNodes: newVisitedNodes,
            currentlyVisiting,
            traversalOrder: newTraversalOrder,
            isRunning: nextStep < prev.totalSteps - 1,
          };
        });
      }, delay);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [algorithmState.isRunning, algorithmState.isPaused, animationSpeed]);

  const getCurrentQueueOrStack = useCallback(() => {
    if (algorithmState.currentStep >= 0 && algorithmState.currentStep < algorithmState.steps.length) {
      const step = algorithmState.steps[algorithmState.currentStep];
      return step.queue || step.stack || [];
    }
    return [];
  }, [algorithmState.currentStep, algorithmState.steps]);

  return {
    algorithmState,
    animationSpeed,
    setAnimationSpeed,
    startVisualization,
    pauseVisualization,
    stepForward,
    resetAlgorithm,
    getCurrentQueueOrStack,
  };
}
