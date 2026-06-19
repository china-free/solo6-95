import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/useGameStore';
import { useEditorStore } from '../store/useEditorStore';
import { useLevelStore } from '../store/useLevelStore';

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawingRef = useRef(false);
  const lastCellRef = useRef<{ x: number; y: number } | null>(null);

  const { ca, cellSize, showGrid, stats } = useGameStore();
  const { selectedStructure, previewPosition, setPreviewPosition, placeAt, mode } = useEditorStore();
  const { currentLevel } = useLevelStore();

  const getGridOffset = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !ca) return { offsetX: 0, offsetY: 0 };
    const totalWidth = ca.width * cellSize;
    const totalHeight = ca.height * cellSize;
    return {
      offsetX: Math.max(0, (canvas.width - totalWidth) / 2),
      offsetY: Math.max(0, (canvas.height - totalHeight) / 2),
    };
  }, [ca, cellSize]);

  const screenToGrid = useCallback(
    (screenX: number, screenY: number) => {
      const canvas = canvasRef.current;
      if (!canvas || !ca) return null;
      const rect = canvas.getBoundingClientRect();
      const { offsetX, offsetY } = getGridOffset();
      const x = Math.floor((screenX - rect.left - offsetX) / cellSize);
      const y = Math.floor((screenY - rect.top - offsetY) / cellSize);
      if (x < 0 || x >= ca.width || y < 0 || y >= ca.height) return null;
      return { x, y };
    },
    [ca, cellSize, getGridOffset],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const gridPos = screenToGrid(e.clientX, e.clientY);
      setPreviewPosition(gridPos);

      if (isDrawingRef.current && gridPos) {
        const last = lastCellRef.current;
        if (!last || last.x !== gridPos.x || last.y !== gridPos.y) {
          placeAt(gridPos.x, gridPos.y);
          lastCellRef.current = gridPos;
        }
      }
    },
    [screenToGrid, setPreviewPosition, placeAt],
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      const gridPos = screenToGrid(e.clientX, e.clientY);
      if (!gridPos) return;
      isDrawingRef.current = true;
      placeAt(gridPos.x, gridPos.y);
      lastCellRef.current = gridPos;
    },
    [screenToGrid, placeAt],
  );

  const handleMouseUp = useCallback(() => {
    isDrawingRef.current = false;
    lastCellRef.current = null;
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPreviewPosition(null);
    handleMouseUp();
  }, [setPreviewPosition, handleMouseUp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp, handleMouseLeave]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !ca) return;

    let animationId: number;
    const { offsetX, offsetY } = getGridOffset();
    const totalWidth = ca.width * cellSize;
    const totalHeight = ca.height * cellSize;

    const render = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#000a00';
      ctx.fillRect(offsetX, offsetY, totalWidth, totalHeight);

      ctx.strokeStyle = '#003b00';
      ctx.lineWidth = 0.5;

      if (showGrid) {
        for (let x = 0; x <= ca.width; x++) {
          ctx.beginPath();
          ctx.moveTo(offsetX + x * cellSize, offsetY);
          ctx.lineTo(offsetX + x * cellSize, offsetY + totalHeight);
          ctx.stroke();
        }
        for (let y = 0; y <= ca.height; y++) {
          ctx.beginPath();
          ctx.moveTo(offsetX, offsetY + y * cellSize);
          ctx.lineTo(offsetX + totalWidth, offsetY + y * cellSize);
          ctx.stroke();
        }
      }

      const internalGrid = ca.getInternalGrid();
      const stride = ca.width + 2;
      const livingCells: { x: number; y: number }[] = [];

      for (let y = 0; y < ca.height; y++) {
        for (let x = 0; x < ca.width; x++) {
          const idx = (y + 1) * stride + (x + 1);
          if (internalGrid[idx] === 1) {
            livingCells.push({ x, y });
          }
        }
      }

      for (const cell of livingCells) {
        const px = offsetX + cell.x * cellSize;
        const py = offsetY + cell.y * cellSize;

        const gradient = ctx.createRadialGradient(
          px + cellSize / 2,
          py + cellSize / 2,
          0,
          px + cellSize / 2,
          py + cellSize / 2,
          cellSize * 1.5,
        );
        gradient.addColorStop(0, 'rgba(0, 255, 65, 0.8)');
        gradient.addColorStop(0.5, 'rgba(0, 255, 65, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 255, 65, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(px - cellSize, py - cellSize, cellSize * 3, cellSize * 3);

        ctx.fillStyle = '#00ff41';
        ctx.fillRect(px + 0.5, py + 0.5, cellSize - 1, cellSize - 1);

        ctx.fillStyle = '#88ff88';
        ctx.fillRect(px + 1, py + 1, cellSize / 3, cellSize / 3);
      }

      if (currentLevel) {
        for (const input of currentLevel.inputs) {
          const px = offsetX + input.x * cellSize;
          const py = offsetY + input.y * cellSize;
          const r = (input.radius ?? 3) * cellSize;
          ctx.strokeStyle = '#00bfff';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.arc(px + cellSize / 2, py + cellSize / 2, r, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = '#00bfff';
          ctx.font = `${Math.max(10, cellSize)}px 'JetBrains Mono', monospace`;
          ctx.textAlign = 'center';
          ctx.fillText(input.label, px + cellSize / 2, py - r - 5);
        }

        for (const output of currentLevel.outputs) {
          const px = offsetX + output.x * cellSize;
          const py = offsetY + output.y * cellSize;
          const r = (output.radius ?? 3) * cellSize;
          ctx.strokeStyle = '#ffb000';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.arc(px + cellSize / 2, py + cellSize / 2, r, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = '#ffb000';
          ctx.font = `${Math.max(10, cellSize)}px 'JetBrains Mono', monospace`;
          ctx.textAlign = 'center';
          ctx.fillText(output.label, px + cellSize / 2, py - r - 5);
        }
      }

      if (previewPosition && selectedStructure) {
        const px = offsetX + (previewPosition.x - Math.floor(selectedStructure.width / 2)) * cellSize;
        const py = offsetY + (previewPosition.y - Math.floor(selectedStructure.height / 2)) * cellSize;

        ctx.fillStyle = 'rgba(0, 255, 65, 0.3)';
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 1;
        ctx.strokeRect(px, py, selectedStructure.width * cellSize, selectedStructure.height * cellSize);

        for (let y = 0; y < selectedStructure.height; y++) {
          for (let x = 0; x < selectedStructure.width; x++) {
            if (selectedStructure.pattern[y][x] === 1) {
              ctx.fillStyle = 'rgba(0, 255, 65, 0.5)';
              ctx.fillRect(
                px + x * cellSize + 1,
                py + y * cellSize + 1,
                cellSize - 2,
                cellSize - 2,
              );
            }
          }
        }
      }

      if (previewPosition && !selectedStructure) {
        const px = offsetX + previewPosition.x * cellSize;
        const py = offsetY + previewPosition.y * cellSize;
        const brushSize = useEditorStore.getState().brushSize;
        ctx.strokeStyle = mode === 'erase' ? '#ff4141' : '#00ff41';
        ctx.lineWidth = 1;
        ctx.strokeRect(px, py, cellSize * brushSize, cellSize * brushSize);
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [ca, cellSize, showGrid, stats, previewPosition, selectedStructure, getGridOffset, currentLevel, mode]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black overflow-hidden rounded-lg border border-matrix-green/30"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="absolute top-2 left-2 text-xs text-matrix-green/70 font-mono pointer-events-none">
        <div>GEN: {stats.generation}</div>
        <div>POP: {stats.population}</div>
      </div>
      <div className="absolute top-2 right-2 text-xs text-matrix-green/70 font-mono pointer-events-none">
        <div>
          {ca?.width}x{ca?.height}
        </div>
        <div>CELL: {cellSize}px</div>
      </div>
      <div className="absolute inset-0 crt-scanlines pointer-events-none rounded-lg" />
    </div>
  );
}
