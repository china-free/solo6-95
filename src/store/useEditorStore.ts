import { create } from 'zustand';
import { getStructure, getStructuresByCategory, allStructures } from '../engine/structures';
import type { Structure, StructureCategory, PlacedStructure } from '../types/structure';
import { useGameStore } from './useGameStore';
import { useLevelStore } from './useLevelStore';

type EditorMode = 'draw' | 'erase' | 'place';

interface EditorState {
  mode: EditorMode;
  selectedStructureId: string | null;
  selectedStructure: Structure | null;
  brushSize: number;
  showStructurePreview: boolean;
  previewPosition: { x: number; y: number } | null;
  placedStructures: PlacedStructure[];
  activeCategory: StructureCategory | 'all';

  setMode: (mode: EditorMode) => void;
  selectStructure: (id: string | null) => void;
  setBrushSize: (size: number) => void;
  setActiveCategory: (category: StructureCategory | 'all') => void;
  setPreviewPosition: (pos: { x: number; y: number } | null) => void;
  getAvailableStructures: () => Structure[];
  getFilteredStructures: () => Structure[];
  placeAt: (x: number, y: number) => void;
  clearPlaced: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  mode: 'draw',
  selectedStructureId: null,
  selectedStructure: null,
  brushSize: 1,
  showStructurePreview: true,
  previewPosition: null,
  placedStructures: [],
  activeCategory: 'all',

  setMode: (mode) => {
    set({ mode, selectedStructureId: null, selectedStructure: null });
    if (mode === 'draw') {
      useGameStore.getState().addLog('info', '✏️ 画笔模式');
    } else if (mode === 'erase') {
      useGameStore.getState().addLog('info', '🗑 擦除模式');
    } else if (mode === 'place') {
      useGameStore.getState().addLog('info', '📍 放置模式');
    }
  },

  selectStructure: (id) => {
    if (id === null) {
      set({ selectedStructureId: null, selectedStructure: null, mode: 'draw' });
      return;
    }
    const structure = getStructure(id);
    if (structure) {
      set({
        selectedStructureId: id,
        selectedStructure: structure,
        mode: 'place',
      });
      useGameStore.getState().addLog('info', `已选择: ${structure.nameCn}`);
    }
  },

  setBrushSize: (size) => {
    const clamped = Math.max(1, Math.min(10, size));
    set({ brushSize: clamped });
  },

  setActiveCategory: (category) => {
    set({ activeCategory: category });
  },

  setPreviewPosition: (pos) => {
    set({ previewPosition: pos });
  },

  getAvailableStructures: () => {
    const { currentLevel } = useLevelStore.getState();
    if (!currentLevel) return allStructures;
    return currentLevel.availableStructures
      .map((id) => getStructure(id))
      .filter((s): s is Structure => s !== undefined);
  },

  getFilteredStructures: () => {
    const available = get().getAvailableStructures();
    const { activeCategory } = get();
    if (activeCategory === 'all') return available;
    return available.filter((s) => s.category === activeCategory);
  },

  placeAt: (x, y) => {
    const { selectedStructure, mode } = get();
    const { setCell, toggleCell, ca } = useGameStore.getState();

    if (!ca) return;

    if (mode === 'draw') {
      const { brushSize } = get();
      for (let dy = -brushSize + 1; dy < brushSize; dy++) {
        for (let dx = -brushSize + 1; dx < brushSize; dx++) {
          if (dx * dx + dy * dy < brushSize * brushSize) {
            setCell(x + dx, y + dy, 1);
          }
        }
      }
    } else if (mode === 'erase') {
      const { brushSize } = get();
      for (let dy = -brushSize + 1; dy < brushSize; dy++) {
        for (let dx = -brushSize + 1; dx < brushSize; dx++) {
          if (dx * dx + dy * dy < brushSize * brushSize) {
            setCell(x + dx, y + dy, 0);
          }
        }
      }
    } else if (mode === 'place' && selectedStructure) {
      const offsetX = Math.floor(selectedStructure.width / 2);
      const offsetY = Math.floor(selectedStructure.height / 2);
      ca.placePattern(selectedStructure.pattern, x - offsetX, y - offsetY);

      const placed: PlacedStructure = {
        structureId: selectedStructure.id,
        x: x - offsetX,
        y: y - offsetY,
        instanceId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      set((state) => ({
        placedStructures: [...state.placedStructures, placed],
      }));
    }
  },

  clearPlaced: () => {
    set({ placedStructures: [] });
  },
}));
