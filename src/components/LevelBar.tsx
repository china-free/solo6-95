import { ChevronLeft, ChevronRight, Lock, CheckCircle, HelpCircle, X } from 'lucide-react';
import { useState } from 'react';
import { useLevelStore } from '../store/useLevelStore';
import { getTotalLevels } from '../engine/levels';

export function LevelBar() {
  const { currentLevel, selectLevel, isLevelUnlocked, isLevelCompleted, progress, getAllLevels, toggleTestResults, showTestResults } = useLevelStore();
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const allLevels = getAllLevels();
  const total = getTotalLevels();

  const handlePrev = () => {
    if (currentLevel && currentLevel.id > 1) {
      selectLevel(currentLevel.id - 1);
    }
  };

  const handleNext = () => {
    if (currentLevel && currentLevel.id < total) {
      selectLevel(currentLevel.id + 1);
    }
  };

  return (
    <>
      <div className="bg-black/90 border border-matrix-green/30 rounded-lg p-3 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentLevel?.id === 1}
              className="p-1 border border-matrix-green/50 text-matrix-green/70 hover:border-matrix-green hover:text-matrix-green transition-all rounded disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setShowLevelSelect(true)}
              className="text-matrix-green text-xs font-mono font-bold px-2 py-1 border border-matrix-green/50 rounded hover:bg-matrix-green/10 transition-all"
            >
              LEVEL {currentLevel?.id}/{total}
            </button>
            <button
              onClick={handleNext}
              disabled={currentLevel?.id === total || !isLevelUnlocked((currentLevel?.id ?? 0) + 1)}
              className="p-1 border border-matrix-green/50 text-matrix-green/70 hover:border-matrix-green hover:text-matrix-green transition-all rounded disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowHint(!showHint)}
              className={`p-1 border transition-all rounded ${
                showHint
                  ? 'border-matrix-amber text-matrix-amber bg-matrix-amber/10'
                  : 'border-matrix-green/50 text-matrix-green/70 hover:border-matrix-amber hover:text-matrix-amber'
              }`}
              title="Hint"
            >
              <HelpCircle size={14} />
            </button>
            <button
              onClick={toggleTestResults}
              className={`p-1 border transition-all rounded ${
                showTestResults
                  ? 'border-matrix-blue text-matrix-blue bg-matrix-blue/10'
                  : 'border-matrix-green/50 text-matrix-green/70 hover:border-matrix-blue hover:text-matrix-blue'
              }`}
              title="Test Results"
            >
              📊
            </button>
          </div>
        </div>

        <div className="text-matrix-green font-mono font-bold text-sm mb-1">
          {currentLevel?.name}
        </div>
        <div className="text-matrix-green/70 font-mono text-xs mb-2">
          {currentLevel?.description}
        </div>
        <div className="text-matrix-green/50 font-mono text-xs">
          <span className="text-matrix-green">目标:</span> {currentLevel?.objective}
        </div>

        {showHint && currentLevel?.hint && (
          <div className="mt-2 p-2 bg-matrix-amber/10 border border-matrix-amber/30 rounded">
            <div className="text-matrix-amber text-xs font-mono">
              💡 {currentLevel.hint}
            </div>
          </div>
        )}

        <div className="mt-3 flex gap-1">
          {allLevels.map((level) => {
            const unlocked = isLevelUnlocked(level.id);
            const completed = isLevelCompleted(level.id);
            const isCurrent = currentLevel?.id === level.id;

            return (
              <div
                key={level.id}
                onClick={() => unlocked && selectLevel(level.id)}
                className={`flex-1 h-2 rounded-sm transition-all ${
                  isCurrent
                    ? 'bg-matrix-green animate-pulse'
                    : completed
                    ? 'bg-matrix-green/60'
                    : unlocked
                    ? 'bg-matrix-green/30 cursor-pointer hover:bg-matrix-green/50'
                    : 'bg-matrix-green/10'
                }`}
                title={unlocked ? level.name : '🔒 Locked'}
              />
            );
          })}
        </div>

        {progress.isTesting && (
          <div className="mt-2 text-matrix-amber text-xs font-mono text-center animate-pulse">
            ⏳ Running tests...
          </div>
        )}
      </div>

      {showLevelSelect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-black border-2 border-matrix-green rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto scrollbar-matrix">
            <div className="flex items-center justify-between mb-4">
              <div className="text-matrix-green font-mono font-bold text-lg">
                SELECT LEVEL
              </div>
              <button
                onClick={() => setShowLevelSelect(false)}
                className="p-1 text-matrix-green/70 hover:text-matrix-green transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2">
              {allLevels.map((level) => {
                const unlocked = isLevelUnlocked(level.id);
                const completed = isLevelCompleted(level.id);

                return (
                  <div
                    key={level.id}
                    onClick={() => {
                      if (unlocked) {
                        selectLevel(level.id);
                        setShowLevelSelect(false);
                      }
                    }}
                    className={`p-3 rounded border transition-all ${
                      !unlocked
                        ? 'border-matrix-green/20 bg-black/50 opacity-50 cursor-not-allowed'
                        : completed
                        ? 'border-matrix-green bg-matrix-green/10 cursor-pointer hover:bg-matrix-green/20'
                        : 'border-matrix-green/50 cursor-pointer hover:border-matrix-green hover:bg-matrix-green/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center border border-matrix-green/50 rounded">
                        {!unlocked ? (
                          <Lock size={14} className="text-matrix-green/50" />
                        ) : completed ? (
                          <CheckCircle size={14} className="text-matrix-green" />
                        ) : (
                          <span className="text-matrix-green font-mono font-bold">{level.id}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-matrix-green font-mono font-bold text-sm">
                          {level.name}
                        </div>
                        <div className="text-matrix-green/50 font-mono text-xs">
                          {level.description}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
