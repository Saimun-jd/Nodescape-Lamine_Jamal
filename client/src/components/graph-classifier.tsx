import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Brain, TreePine, Network, GitBranch, Loader2, ChevronUp, ChevronDown } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface GraphData {
  nodes: Array<{ id: string; x: number; y: number; label: string }>;
  edges: Array<{ id: string; from: string; to: string }>;
  nextNodeId: number;
}

interface ClassificationResult {
  type: 'Tree' | 'Cyclic' | 'DAG';
  confidence: number;
  probabilities: {
    Tree: number;
    Cyclic: number;
    DAG: number;
  };
  features: {
    nodeCount: number;
    edgeCount: number;
    density: number;
    cycleCount: number;
    components: number;
    [key: string]: number;
  };
  reasoning: string;
}

interface GraphClassifierProps {
  graphData: GraphData;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Tree':
      return <TreePine className="h-4 w-4" />;
    case 'Cyclic':
      return <Network className="h-4 w-4" />;
    case 'DAG':
      return <GitBranch className="h-4 w-4" />;
    default:
      return <Brain className="h-4 w-4" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Tree':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'Cyclic':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    case 'DAG':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

const getTypeDescription = (type: string) => {
  switch (type) {
    case 'Tree':
      return 'A connected acyclic graph with n-1 edges for n nodes. No cycles present.';
    case 'Cyclic':
      return 'Contains one or more cycles. Nodes can be revisited through different paths.';
    case 'DAG':
      return 'Directed Acyclic Graph with multiple paths but no cycles. Hierarchical structure.';
    default:
      return 'Unknown graph type';
  }
};

export function GraphClassifier({ graphData }: GraphClassifierProps) {
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const classifyGraph = async () => {
    if (graphData.nodes.length === 0) {
      setError("Please create some nodes before classifying the graph");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/classify-graph', {
        method: 'POST',
        body: JSON.stringify({ graphData }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Classification failed: ${response.statusText}`);
      }

      const classification = await response.json();
      setResult(classification);
      setIsExpanded(true); // Auto-expand when result is available
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Classification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-80 shadow-lg border-2">
      <CardHeader className="pb-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            ML Classifier
          </div>
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </CardTitle>
        {!isExpanded && result && (
          <div className="flex items-center gap-2">
            <Badge className={`${getTypeColor(result.type)} text-xs`}>
              {getTypeIcon(result.type)}
              <span className="ml-1">{result.type}</span>
            </Badge>
            <span className="text-xs text-muted-foreground">
              {(result.confidence * 100).toFixed(0)}% confidence
            </span>
          </div>
        )}
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4 pt-0">
          <Button 
            onClick={classifyGraph} 
            disabled={isLoading || graphData.nodes.length === 0}
            className="w-full"
            size="sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Classify Graph
              </>
            )}
          </Button>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 p-2 bg-red-50 dark:bg-red-950 rounded">
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <Separator />
              
              {/* Main Classification Result */}
              <div className="text-center space-y-2">
                <Badge className={`${getTypeColor(result.type)} text-sm px-3 py-1`}>
                  {getTypeIcon(result.type)}
                  <span className="ml-1">{result.type}</span>
                </Badge>
                <div className="text-sm text-muted-foreground">
                  {(result.confidence * 100).toFixed(1)}% confidence
                </div>
              </div>

              {/* Type Description */}
              <div className="text-xs text-muted-foreground text-center px-2">
                {getTypeDescription(result.type)}
              </div>

              {/* Probabilities */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Classification Probabilities</div>
                {Object.entries(result.probabilities).map(([type, probability]) => (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="flex items-center gap-1">
                        {getTypeIcon(type)}
                        {type}
                      </span>
                      <span>{(probability * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={probability * 100} className="h-2" />
                  </div>
                ))}
              </div>

              {/* Key Features */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Graph Features</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span>Nodes:</span>
                    <span>{result.features.nodeCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Edges:</span>
                    <span>{result.features.edgeCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Density:</span>
                    <span>{result.features.density.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cycles:</span>
                    <span>{result.features.cycleCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Components:</span>
                    <span>{result.features.components}</span>
                  </div>
                </div>
              </div>

              {/* Reasoning */}
              <div className="space-y-1">
                <div className="text-sm font-medium">Reasoning</div>
                <div className="text-xs text-muted-foreground p-2 bg-gray-50 dark:bg-gray-900 rounded">
                  {result.reasoning}
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground text-center">
            Powered by Random Forest ML classifier
          </div>
        </CardContent>
      )}
    </Card>
  );
}