import { Play, Pause, SkipForward, RotateCcw, Shuffle, Grid3X3, ZoomIn, ZoomOut } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { useEditorStore } from '../store/useEditorStore';
import { useLevelStore } from '../store/useLevelStore';

export function ControlPanel() {
  const { isRunning, speed, cellSize, showGrid, togglePlay, step, reset, randomize, setSpeed, setCellSize, toggleGrid } = useGameStore();
  const { mode, brushSize, setMode, setBrushSize } = useEditorStore();
  const { runTest, proceedToNextLevel, canProceedToNextLevel, progress } = useLevelStore();

  return (
    <div className="bg-black/90 border border-matrix-green/30 rounded-lg p-3 backdrop-blur-sm">
      <div className="text-matrix-green text-xs font-bold mb-3 tracking-wider">
        ╔═══ CONTROL PANEL ═══╗
      </div>

      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={togglePlay}
            className={`flex items-center gap-1 px-3 py-2 text-xs font-mono rounded border transition-all ${
              isRunning
                ? 'bg-matrix-green/20 border-matrix-green text-matrix-green animate-pulse-glow'
                : 'border-matrix-green/50 text-matrix-green/70 hover:border-matrix-green hover:text-matrix-green hover:bg-matrix-green/10'
            }`}
          >
            {isRunning ? <Pause size={14} /> : <Play size={14} />}
            {isRunning ? 'PAUSE' : 'PLAY'}
          </button>
          <button
            onClick={step}
            className="flex items-center gap-1 px-3 py-2 text-xs font-mono rounded border border-matrix-green/50 text-matrix-green/70 hover:border-matrix-green hover:text-matrix-green hover:bg-matrix-green/10 transition-all"
          >
            <SkipForward size={14} />
            STEP
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-1 px-3 py-2 text-xs font-mono rounded border border-matrix-red/50 text-matrix-red/70 hover:border-matrix-red hover:text-matrix-red hover:bg-matrix-red/10 transition-all"
          >
            <RotateCcw size={14} />
            RESET
          </button>
          <button
            onClick={() => randomize(0.3)}
            className="flex items-center gap-1 px-3 py-2 text-xs font-mono rounded border border-matrix-blue/50 text-matrix-blue/70 hover:border-matrix-blue hover:text-matrix-blue hover:bg-matrix-blue/10 transition-all"
          >
            <Shuffle size={14} />
            RANDOM
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-matrix-green/70 text-xs font-mono">SPEED: {speed}/s</span>
          </div>
          <input
            type="range"
            min={1}
            max={60}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full h-1 bg-matrix-green/20 rounded-lg appearance-none cursor-pointer accent-matrix-green"
          />
        </div>

        <div className="flex gap-2 items-center">
          <span className="text-matrix-green/70 text-xs font-mono whitespace-nowrap">ZOOM:</span>
          <button
            onClick={() => setCellSize(cellSize - 2)}
            className="p-1 border border-matrix-green/50 text-matrix-green/70 hover:border-matrix-green hover:text-matrix-green transition-all rounded"
          >
            <ZoomOut size={14} />
          </button>
          <span className="text-matrix-green text-xs font-mono w-8 text-center">{cellSize}</span>
          <button
            onClick={() => setCellSize(cellSize + 2)}
            className="p-1 border border-matrix-green/50 text-matrix-green/70 hover:border-matrix-green hover:text-matrix-green transition-all rounded"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={toggleGrid}
            className={`ml-auto p-1 border transition-all rounded ${
              showGrid
                ? 'border-matrix-green text-matrix-green bg-matrix-green/10'
                : 'border-matrix-green/30 text-matrix-green/50 hover:border-matrix-green/50 hover:text-matrix-green/70'
            }`}
          >
            <Grid3X3 size={14} />
          </button>
        </div>

        <div className="border-t border-matrix-green/20 pt-3">
          <div className="text-matrix-green/70 text-xs font-mono mb-2">EDIT MODE:</div>
          <div className="flex gap-2">
            <button
              onClick={() => setMode('draw')}
              className={`flex-1 px-2 py-1.5 text-xs font-mono rounded border transition-all ${
                mode === 'draw'
                  ? 'bg-matrix-green/20 border-matrix-green text-matrix-green'
                  : 'border-matrix-green/30 text-matrix-green/50 hover:border-matrix-green/50 hover:text-matrix-green/70'
              }`}
            >
              ✏ DRAW
            </button>
            <button
              onClick={() => setMode('erase')}
              className={`flex-1 px-2 py-1.5 text-xs font-mono rounded border transition-all ${
                mode === 'erase'
                  ? 'bg-matrix-red/20 border-matrix-red text-matrix-red'
                  : 'border-matrix-green/30 text-matrix-green/50 hover:border-matrix-red/50 hover:text-matrix-red/70'
              }`}
            >
              🗑 ERASE
            </button>
          </div>
          {mode !== 'place' && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-matrix-green/70 text-xs font-mono">BRUSH:</span>
              <input
                type="range"
                min={1}
                max={5}
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="flex-1 h-1 bg-matrix-green/20 rounded-lg appearance-none cursor-pointer accent-matrix-green"
              />
              <span className="text-matrix-green text-xs font-mono w-4">{brushSize}</span>
            </div>
          )}
        </div>

        <div className="border-t border-matrix-green/20 pt-3">
          <button
            onClick={runTest}
            disabled={progress.isTesting}
            className={`w-full py-2.5 text-xs font-mono font-bold rounded border transition-all ${
              progress.isTesting
                ? 'bg-matrix-amber/20 border-matrix-amber text-matrix-amber cursor-not-allowed'
                : 'bg-matrix-green/10 border-matrix-green text-matrix-green hover:bg-matrix-green/20 hover:animate-pulse-glow'
            }`}
          >
            {progress.isTesting ? '⏳ TESTING...' : '▶ RUN TEST'}
          </button>
          {(() => {
            const state = useLevelStore.getState();
            const canNext = state.manager?.canProceedToNextLevel() ?? false;
            return canNext ? (
              <button
                onClick={proceedToNextLevel}
                className="w-full mt-2 py-2 text-xs font-mono font-bold rounded border border-matrix-amber bg-matrix-amber/10 text-matrix-amber hover:bg-matrix-amber/20 transition-all animate-pulse"
              >
                ➤ NEXT LEVEL
              </button>
            ) : null;
          })()}
        </div>
      </div>
    </div>
  );
}
