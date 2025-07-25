import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

export function HelpModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-4 right-4 w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:bg-blue-600 z-20"
        >
          <HelpCircle className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">How to Use GraphVerse</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Adding Nodes</h4>
            <p className="text-slate-600 text-sm">
              Click the "Add Nodes" button, then click anywhere on the canvas to place numbered nodes. 
              Each node will be automatically numbered sequentially.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Connecting Nodes</h4>
            <p className="text-slate-600 text-sm">
              Click "Connect Nodes", then click on a node to start an edge. Move your mouse and click 
              another node to complete the connection. Right-click anywhere to cancel edge creation.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Running Algorithms</h4>
            <p className="text-slate-600 text-sm">
              Select BFS (Breadth-First Search) or DFS (Depth-First Search), choose a start node, 
              then click "Start Visualization" to see the algorithm traverse your graph step by step.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Algorithm Visualization</h4>
            <p className="text-slate-600 text-sm mb-2">
              During visualization, nodes change colors to indicate their status:
            </p>
            <ul className="text-sm text-slate-600 space-y-1 ml-4">
              <li>• <span className="inline-block w-3 h-3 bg-blue-600 rounded-full mr-2"></span>Unvisited nodes (blue)</li>
              <li>• <span className="inline-block w-3 h-3 bg-orange-500 rounded-full mr-2"></span>Currently visiting (orange, pulsing)</li>
              <li>• <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>Visited nodes (green)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Playback Controls</h4>
            <p className="text-slate-600 text-sm mb-2">
              Use the playback controls to:
            </p>
            <ul className="text-sm text-slate-600 space-y-1 ml-4">
              <li>• Pause/Resume the animation</li>
              <li>• Step through the algorithm manually</li>
              <li>• Reset the visualization</li>
              <li>• Adjust animation speed (1-10 scale)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Keyboard Shortcuts</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Escape</span>
                <span className="font-mono text-slate-900">Cancel current action</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Space</span>
                <span className="font-mono text-slate-900">Pause/Resume (during visualization)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Delete</span>
                <span className="font-mono text-slate-900">Clear graph</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
