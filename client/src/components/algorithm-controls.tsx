import { AlgorithmState, AlgorithmType } from '@/lib/graph-types';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface AlgorithmControlsProps {
  algorithmState: AlgorithmState;
  currentQueueOrStack: string[];
}

export function AlgorithmControls({ algorithmState, currentQueueOrStack }: AlgorithmControlsProps) {
  if (!algorithmState.isRunning && algorithmState.totalSteps === 0) {
    return null;
  }

  const progressPercentage = algorithmState.totalSteps > 0 
    ? (algorithmState.currentStep / algorithmState.totalSteps) * 100 
    : 0;

  const getAlgorithmName = () => {
    return algorithmState.algorithm === 'bfs' ? 'BFS' : 'DFS';
  };

  const getDataStructureName = () => {
    return algorithmState.algorithm === 'bfs' ? 'Queue' : 'Stack';
  };

  return (
    <Card className="fixed bottom-4 left-80 right-4 z-10 border-t border-slate-200 bg-white/95 backdrop-blur">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${algorithmState.isRunning ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
            <span className="font-medium text-slate-900">
              {getAlgorithmName()} Traversal {algorithmState.isRunning ? 'in Progress' : 'Complete'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>
              Step {algorithmState.currentStep + 1} of {algorithmState.totalSteps}
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <Progress value={progressPercentage} className="w-full mb-3" />
        
        {/* Current Step Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="text-slate-600">
            <span>Currently visiting: </span>
            <span className="font-medium text-slate-900">
              {algorithmState.currentlyVisiting ? `Node ${algorithmState.currentlyVisiting}` : 'None'}
            </span>
          </div>
          <div className="text-slate-600">
            <span>{getDataStructureName()}: </span>
            <span className="font-mono text-slate-900">
              [{currentQueueOrStack.join(', ')}]
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
