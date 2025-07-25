import { AppMode, AlgorithmType } from '@/lib/graph-types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Link, Trash2, Play, Pause, StepForward, Square } from 'lucide-react';

interface SidebarProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  nodeCount: number;
  edgeCount: number;
  selectedAlgorithm: AlgorithmType | null;
  setSelectedAlgorithm: (algorithm: AlgorithmType) => void;
  selectedStartNode: string | null;
  setSelectedStartNode: (nodeId: string | null) => void;
  availableNodes: Array<{ id: string; label: string }>;
  onStartVisualization: () => void;
  onPauseVisualization: () => void;
  onStepForward: () => void;
  onResetVisualization: () => void;
  onClearGraph: () => void;
  algorithmState: {
    isRunning: boolean;
    isPaused: boolean;
    currentStep: number;
    totalSteps: number;
  };
  animationSpeed: number;
  setAnimationSpeed: (speed: number) => void;
  canStartVisualization: boolean;
}

export function Sidebar({
  mode,
  setMode,
  nodeCount,
  edgeCount,
  selectedAlgorithm,
  setSelectedAlgorithm,
  selectedStartNode,
  setSelectedStartNode,
  availableNodes,
  onStartVisualization,
  onPauseVisualization,
  onStepForward,
  onResetVisualization,
  onClearGraph,
  algorithmState,
  animationSpeed,
  setAnimationSpeed,
  canStartVisualization,
}: SidebarProps) {
  const getModeText = () => {
    switch (mode) {
      case 'addNode': return 'Add Nodes Mode';
      case 'addEdge': return 'Connect Nodes Mode';
      case 'algorithm': return 'Algorithm Mode';
      default: return 'Unknown Mode';
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'addNode': return <Plus className="w-4 h-4" />;
      case 'addEdge': return <Link className="w-4 h-4" />;
      case 'algorithm': return <Play className="w-4 h-4" />;
      default: return <Plus className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-80 bg-white shadow-lg border-r border-slate-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">GraphVerse</h1>
        <p className="text-sm text-slate-600">Interactive Graph Traversal Visualizer</p>
      </div>

      {/* Mode Indicator */}
      <div className="p-4 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2 p-3 bg-primary text-white rounded-lg">
          {getModeIcon()}
          <span className="font-medium">{getModeText()}</span>
        </div>
      </div>

      {/* Tools Section */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900">Graph Building</h3>
          
          {/* Add Node Button */}
          <Button
            className="w-full flex items-center gap-3"
            variant={mode === 'addNode' ? 'default' : 'outline'}
            onClick={() => setMode('addNode')}
            disabled={algorithmState.isRunning}
          >
            <Plus className="w-4 h-4" />
            Add Nodes
          </Button>

          {/* Add Edge Button */}
          <Button
            className="w-full flex items-center gap-3"
            variant={mode === 'addEdge' ? 'default' : 'outline'}
            onClick={() => setMode('addEdge')}
            disabled={algorithmState.isRunning}
          >
            <Link className="w-4 h-4" />
            Connect Nodes
          </Button>

          {/* Clear Graph Button */}
          <Button
            className="w-full flex items-center gap-3"
            variant="destructive"
            onClick={onClearGraph}
            disabled={algorithmState.isRunning}
          >
            <Trash2 className="w-4 h-4" />
            Clear Graph
          </Button>
        </div>

        {/* Graph Statistics */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <h4 className="font-medium text-slate-900">Graph Stats</h4>
            <div className="text-sm text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Nodes:</span>
                <span className="font-medium">{nodeCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Edges:</span>
                <span className="font-medium">{edgeCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Algorithm Section */}
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900">Algorithm Visualization</h3>
          
          {/* Algorithm Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Select Algorithm</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={selectedAlgorithm === 'bfs' ? 'default' : 'outline'}
                size="sm" 
                onClick={() => setSelectedAlgorithm('bfs')}
                disabled={algorithmState.isRunning}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                BFS
              </Button>
              <Button
                variant={selectedAlgorithm === 'dfs' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedAlgorithm('dfs')}
                disabled={algorithmState.isRunning}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                DFS
              </Button>
            </div>
          </div>

          {/* Start Node Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Start Node</label>
            <Select
              value={selectedStartNode || ''}
              onValueChange={(value) => setSelectedStartNode(value || null)}
              disabled={algorithmState.isRunning}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select start node..." />
              </SelectTrigger>
              <SelectContent>
                {availableNodes.map(node => (
                  <SelectItem key={node.id} value={node.id}>
                    Node {node.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Start Visualization Button */}
          <Button
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
            onClick={onStartVisualization}
            disabled={!canStartVisualization || algorithmState.isRunning}
          >
            <Play className="w-4 h-4" />
            Start Visualization
          </Button>
        </div>

        {/* Visualization Controls */}
        <div className={`space-y-3 ${!algorithmState.isRunning && algorithmState.totalSteps === 0 ? 'opacity-50' : ''}`}>
          <h3 className="font-semibold text-slate-900">Playback Controls</h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onPauseVisualization}
              disabled={!algorithmState.isRunning && algorithmState.totalSteps === 0}
              className="flex-1"
            >
              {algorithmState.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onStepForward}
              disabled={algorithmState.isRunning && !algorithmState.isPaused}
              className="flex-1"
            >
              <StepForward className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onResetVisualization}
              disabled={algorithmState.totalSteps === 0}
              className="flex-1"
            >
              <Square className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Speed Control */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Animation Speed</label>
            <Slider
              value={[animationSpeed]}
              onValueChange={([value]) => setAnimationSpeed(value)}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
