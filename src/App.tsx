import { useEffect, useCallback } from 'react';
import { MatrixRain } from './components/MatrixRain';
import { GameCanvas } from './components/GameCanvas';
import { ControlPanel } from './components/ControlPanel';
import { StructureLibrary } from './components/StructureLibrary';
import { LevelBar } from './components/LevelBar';
import { TerminalLog } from './components/TerminalLog';
import { TestResults } from './components/TestResults';
import { useLevelStore } from './store/useLevelStore';
import { useGameStore } from './store/useGameStore';
import { useEditorStore } from './store/useEditorStore';

function App() {
  const { init } = useLevelStore();
  const { togglePlay, reset, step, setSpeed, setCellSize, cellSize, speed } = useGameStore();
  const { setMode } = useEditorStore();

  useEffect(() => {
    init();
  }, [init]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'r':
          e.preventDefault();
          reset();
          break;
        case 's':
          if (!e.ctrlKey) {
            e.preventDefault();
            step();
          }
          break;
        case 'd':
          e.preventDefault();
          setMode('draw');
          break;
        case 'e':
          e.preventDefault();
          setMode('erase');
          break;
        case '1':
          e.preventDefault();
          setSpeed(Math.max(1, speed - 5));
          break;
        case '2':
          e.preventDefault();
          setSpeed(Math.min(60, speed + 5));
          break;
        case '-':
        case '_':
          e.preventDefault();
          setCellSize(Math.max(4, cellSize - 2));
          break;
        case '=':
        case '+':
          e.preventDefault();
          setCellSize(Math.min(24, cellSize + 2));
          break;
      }
    },
    [togglePlay, reset, step, setMode, setSpeed, speed, setCellSize, cellSize],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen bg-black text-matrix-green font-mono relative overflow-hidden">
      <MatrixRain />

      <div className="relative z-10 h-screen flex flex-col p-3 gap-3">
        <div className="flex-shrink-0">
          <LevelBar />
        </div>

        <div className="flex-1 flex gap-3 min-h-0">
          <div className="w-64 flex-shrink-0 flex flex-col gap-3 overflow-hidden">
            <div className="flex-1 min-h-0">
              <StructureLibrary />
            </div>
            <div className="flex-shrink-0 h-64">
              <ControlPanel />
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <GameCanvas />
          </div>

          <div className="w-72 flex-shrink-0 min-h-0">
            <TerminalLog />
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center justify-between text-[10px] text-matrix-green/40 font-mono px-2">
          <div>
            <span className="text-matrix-green/60">CELLULAR AUTOMATON</span> LOGIC CIRCUIT SANDBOX v1.0.0
          </div>
          <div className="flex gap-4">
            <span>
              <span className="text-matrix-green/60">TIP:</span> 选择结构后点击网格放置
            </span>
            <span>
              <span className="text-matrix-green/60">KEY:</span> SPACE=Play/Pause, R=Reset
            </span>
          </div>
        </div>
      </div>

      <TestResults />

      <div className="fixed inset-0 pointer-events-none animate-flicker z-50 opacity-30" />
    </div>
  );
}

export default App;
