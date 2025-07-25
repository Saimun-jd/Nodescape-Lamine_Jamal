import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, X } from 'lucide-react';
import { AlgorithmType } from '@/lib/graph-types';

interface TraversalOrderDisplayProps {
  traversalOrder: string[];
  algorithm: AlgorithmType | null;
  isVisible: boolean;
  onDismiss?: () => void;
}

export function TraversalOrderDisplay({ 
  traversalOrder, 
  algorithm, 
  isVisible,
  onDismiss
}: TraversalOrderDisplayProps) {
  if (!isVisible || traversalOrder.length === 0) {
    return null;
  }

  const getAlgorithmName = () => {
    return algorithm === 'bfs' ? 'BFS' : 'DFS';
  };

  const getAlgorithmColor = () => {
    return algorithm === 'bfs' ? 'bg-green-100 border-green-300' : 'bg-orange-100 border-orange-300';
  };

  const getNodeColor = () => {
    return algorithm === 'bfs' ? 'bg-green-600' : 'bg-orange-600';
  };

  return (
    <Card className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-20 min-w-96 max-w-4xl ${getAlgorithmColor()} border-2 shadow-lg`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getNodeColor()}`}></div>
            {getAlgorithmName()} Traversal Complete
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-sm text-slate-600 font-medium">
            Traversal Order ({traversalOrder.length} nodes visited):
          </p>
          
          {/* Traversal Path */}
          <div className="flex flex-wrap items-center gap-2 p-4 bg-white rounded-lg border border-slate-200">
            {traversalOrder.map((nodeId, index) => (
              <div key={`${nodeId}-${index}`} className="flex items-center gap-2">
                {/* Node */}
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center 
                  text-white font-semibold text-sm shadow-md
                  ${getNodeColor()}
                  ${index === 0 ? 'ring-2 ring-yellow-400 ring-offset-2' : ''}
                `}>
                  {nodeId}
                </div>
                
                {/* Arrow (not for the last node) */}
                {index < traversalOrder.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                )}
              </div>
            ))}
          </div>
          
          {/* Summary Stats */}
          <div className="flex justify-between items-center text-sm text-slate-600 bg-white rounded-lg p-3 border border-slate-200">
            <span>Algorithm: <span className="font-medium">{getAlgorithmName()}</span></span>
            <span>Start Node: <span className="font-medium text-yellow-600">Node {traversalOrder[0]}</span></span>
            <span>Total Nodes: <span className="font-medium">{traversalOrder.length}</span></span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}