import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Eye, Play, Pause, CheckCircle } from "lucide-react";
import { AlgorithmState } from "@/lib/graph-types";

interface StatusBarProps {
  algorithmState: AlgorithmState;
  nodeCount: number;
  edgeCount: number;
  mode: string;
}

export function StatusBar({ algorithmState, nodeCount, edgeCount, mode }: StatusBarProps) {
  const getModeIcon = () => {
    switch (mode) {
      case 'addNode':
        return <CheckCircle className="h-3 w-3" />;
      case 'addEdge':
        return <Eye className="h-3 w-3" />;
      case 'algorithm':
        return algorithmState.isRunning ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />;
      default:
        return <CheckCircle className="h-3 w-3" />;
    }
  };

  const getModeColor = () => {
    switch (mode) {
      case 'addNode':
        return 'bg-blue-100 text-blue-800';
      case 'addEdge':
        return 'bg-purple-100 text-purple-800';
      case 'algorithm':
        return algorithmState.isRunning ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getModeText = () => {
    switch (mode) {
      case 'addNode':
        return 'Add Node Mode';
      case 'addEdge':
        return 'Add Edge Mode';
      case 'algorithm':
        return algorithmState.isRunning ? 'Algorithm Running' : 'Algorithm Paused';
      default:
        return 'Ready';
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 z-40">
      <div className="flex items-center justify-between text-sm">
        {/* Left side - Mode and stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge className={`${getModeColor()} text-xs`}>
              {getModeIcon()}
              <span className="ml-1">{getModeText()}</span>
            </Badge>
          </div>
          
          <Separator orientation="vertical" className="h-4" />
          
          <div className="flex items-center gap-4 text-slate-600">
            <span>Nodes: <span className="font-medium">{nodeCount}</span></span>
            <span>Edges: <span className="font-medium">{edgeCount}</span></span>
          </div>
        </div>

        {/* Right side - Algorithm info */}
        <div className="flex items-center gap-4">
          {algorithmState.algorithm && (
            <>
              <div className="flex items-center gap-2 text-slate-600">
                <span>Algorithm: <span className="font-medium uppercase">{algorithmState.algorithm}</span></span>
                {algorithmState.startNode && (
                  <span>Start: <span className="font-medium">Node {algorithmState.startNode}</span></span>
                )}
              </div>
              
              <Separator orientation="vertical" className="h-4" />
            </>
          )}
          
          {/* Visited nodes */}
          {algorithmState.visitedNodes.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-slate-600">Visited:</span>
              <div className="flex items-center gap-1">
                {Array.from(algorithmState.visitedNodes).slice(-5).map((nodeId, index) => (
                  <Badge key={nodeId} variant="outline" className="text-xs">
                    {nodeId}
                  </Badge>
                ))}
                {algorithmState.visitedNodes.size > 5 && (
                  <span className="text-xs text-slate-500">
                    +{algorithmState.visitedNodes.size - 5} more
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Currently visiting */}
          {algorithmState.currentlyVisiting && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <span className="text-slate-600">Visiting:</span>
                <Badge className="bg-orange-100 text-orange-800 text-xs animate-pulse">
                  Node {algorithmState.currentlyVisiting}
                </Badge>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 