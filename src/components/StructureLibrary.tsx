import { useMemo, useRef, useEffect } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { useLevelStore } from '../store/useLevelStore';
import { categoryNames } from '../engine/structures';
import type { Structure, StructureCategory } from '../types/structure';

function StructurePreview({ structure }: { structure: Structure }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = 4;
    canvas.width = structure.width * cellSize;
    canvas.height = structure.height * cellSize;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < structure.height; y++) {
      for (let x = 0; x < structure.width; x++) {
        if (structure.pattern[y][x] === 1) {
          ctx.fillStyle = structure.color || '#00ff41';
          ctx.fillRect(x * cellSize, y * cellSize, cellSize - 0.5, cellSize - 0.5);
        }
      }
    }
  }, [structure]);

  return (
    <canvas
      ref={canvasRef}
      className="border border-matrix-green/30 rounded bg-black"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

export function StructureLibrary() {
  const { activeCategory, setActiveCategory, getFilteredStructures, selectedStructureId, selectStructure } = useEditorStore();
  const { currentLevel } = useLevelStore();

  const categories = useMemo(() => {
    const available = getFilteredStructures();
    const cats = new Set<StructureCategory | 'all'>();
    cats.add('all');
    available.forEach((s) => cats.add(s.category));
    return Array.from(cats);
  }, [getFilteredStructures]);

  const structures = getFilteredStructures();

  return (
    <div className="bg-black/90 border border-matrix-green/30 rounded-lg p-3 backdrop-blur-sm h-full flex flex-col">
      <div className="text-matrix-green text-xs font-bold mb-3 tracking-wider">
        ╔═══ STRUCTURE LIB ═══╗
      </div>

      <div className="text-matrix-green/50 text-[10px] font-mono mb-2">
        AVAILABLE: {currentLevel?.availableStructures.length ?? 0}
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat as StructureCategory | 'all')}
            className={`px-2 py-1 text-[10px] font-mono rounded border transition-all ${
              activeCategory === cat
                ? 'bg-matrix-green/20 border-matrix-green text-matrix-green'
                : 'border-matrix-green/30 text-matrix-green/50 hover:border-matrix-green/50 hover:text-matrix-green/70'
            }`}
          >
            {cat === 'all' ? '📦 ALL' : categoryNames[cat as StructureCategory]}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-matrix space-y-2 pr-1">
        {structures.length === 0 ? (
          <div className="text-matrix-green/30 text-xs font-mono text-center py-4">
            No structures available
          </div>
        ) : (
          structures.map((structure) => (
            <div
              key={structure.id}
              onClick={() => selectStructure(structure.id)}
              className={`p-2 rounded border cursor-pointer transition-all ${
                selectedStructureId === structure.id
                  ? 'border-matrix-green bg-matrix-green/10 animate-pulse-glow'
                  : 'border-matrix-green/20 hover:border-matrix-green/50 hover:bg-matrix-green/5'
              }`}
            >
              <div className="flex items-start gap-2">
                <StructurePreview structure={structure} />
                <div className="flex-1 min-w-0">
                  <div className="text-matrix-green text-xs font-mono font-bold truncate">
                    {structure.nameCn}
                  </div>
                  <div className="text-matrix-green/50 text-[10px] font-mono truncate">
                    {structure.name}
                  </div>
                  <div className="text-matrix-green/40 text-[10px] font-mono mt-1">
                    {structure.width}x{structure.height}
                    {structure.period && ` • P${structure.period}`}
                  </div>
                </div>
              </div>
              <div className="text-matrix-green/60 text-[10px] font-mono mt-2 line-clamp-2">
                {structure.description}
              </div>
            </div>
          ))
        )}
      </div>

      {selectedStructureId && (
        <div className="mt-3 pt-3 border-t border-matrix-green/20">
          <button
            onClick={() => selectStructure(null)}
            className="w-full py-1.5 text-[10px] font-mono rounded border border-matrix-red/50 text-matrix-red/70 hover:border-matrix-red hover:text-matrix-red hover:bg-matrix-red/10 transition-all"
          >
            ✕ DESELECT
          </button>
        </div>
      )}
    </div>
  );
}
