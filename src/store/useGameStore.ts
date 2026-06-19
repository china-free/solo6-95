import { create } from 'zustand';
import { CellularAutomaton } from '../engine/CellularAutomaton';
import type { CellularAutomatonStats } from '../types/cell';

interface TerminalLogEntry {
  id: string;
  timestamp: number;
  type: 'info' | 'success' | 'error' | 'warning' | 'system';
  message: string;
}

interface GameState {
  ca: CellularAutomaton | null;
  isRunning: boolean;
  speed: number;
  stats: CellularAutomatonStats;
  cellSize: number;
  showGrid: boolean;
  terminalLogs: TerminalLogEntry[];
  maxLogs: number;

  init: (width: number, height: number) => void;
  resize: (width: number, height: number) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  step: () => void;
  reset: () => void;
  clear: () => void;
  randomize: (density?: number) => void;
  setSpeed: (speed: number) => void;
  setCellSize: (size: number) => void;
  toggleGrid: () => void;
  setCell: (x: number, y: number, state: 0 | 1) => void;
  toggleCell: (x: number, y: number) => void;
  placePattern: (pattern: number[][], x: number, y: number) => void;
  addLog: (type: TerminalLogEntry['type'], message: string) => void;
  clearLogs: () => void;
}

let animationFrameId: number | null = null;
let lastStepTime = 0;

export const useGameStore = create<GameState>((set, get) => ({
  ca: null,
  isRunning: false,
  speed: 10,
  stats: { generation: 0, population: 0, width: 0, height: 0 },
  cellSize: 10,
  showGrid: true,
  terminalLogs: [],
  maxLogs: 200,

  init: (width, height) => {
    const ca = new CellularAutomaton(width, height);
    set({ ca, stats: ca.stats });
    get().addLog('system', `元胞自动机初始化完成: ${width}x${height}`);
  },

  resize: (width, height) => {
    const ca = new CellularAutomaton(width, height);
    set({ ca, stats: ca.stats });
    get().addLog('system', `网格调整为: ${width}x${height}`);
  },

  play: () => {
    const { ca, isRunning, speed } = get();
    if (!ca || isRunning) return;

    set({ isRunning: true });
    get().addLog('info', '▶ 开始演化');

    const animate = (time: number) => {
      const state = get();
      if (!state.ca || !state.isRunning) {
        animationFrameId = null;
        return;
      }

      const stepInterval = 1000 / state.speed;
      if (time - lastStepTime >= stepInterval) {
        state.ca.step();
        set({ stats: state.ca.stats });
        lastStepTime = time;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
  },

  pause: () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    set({ isRunning: false });
    get().addLog('info', '⏸ 暂停演化');
  },

  togglePlay: () => {
    const { isRunning, play, pause } = get();
    if (isRunning) pause();
    else play();
  },

  step: () => {
    const { ca } = get();
    if (!ca) return;
    ca.step();
    set({ stats: ca.stats });
  },

  reset: () => {
    const { ca, pause, clear } = get();
    pause();
    if (ca) {
      ca.clear();
      set({ stats: ca.stats });
    }
    get().addLog('info', '↺ 已重置');
  },

  clear: () => {
    const { ca } = get();
    if (ca) {
      ca.clear();
      set({ stats: ca.stats });
    }
  },

  randomize: (density = 0.3) => {
    const { ca } = get();
    if (ca) {
      ca.randomize(density);
      set({ stats: ca.stats });
      get().addLog('info', `🎲 随机生成 (密度: ${density})`);
    }
  },

  setSpeed: (speed) => {
    const clamped = Math.max(1, Math.min(60, speed));
    set({ speed: clamped });
    get().addLog('info', `⚡ 速度调整: ${clamped} 步/秒`);
  },

  setCellSize: (size) => {
    const clamped = Math.max(4, Math.min(24, size));
    set({ cellSize: clamped });
  },

  toggleGrid: () => {
    const { showGrid } = get();
    set({ showGrid: !showGrid });
  },

  setCell: (x, y, state) => {
    const { ca } = get();
    if (ca) {
      ca.setCell(x, y, state);
      set({ stats: ca.stats });
    }
  },

  toggleCell: (x, y) => {
    const { ca } = get();
    if (ca) {
      ca.toggleCell(x, y);
      set({ stats: ca.stats });
    }
  },

  placePattern: (pattern, x, y) => {
    const { ca } = get();
    if (ca) {
      ca.placePattern(pattern, x, y);
      set({ stats: ca.stats });
      get().addLog('info', `📍 放置结构 (${x}, ${y})`);
    }
  },

  addLog: (type, message) => {
    const { terminalLogs, maxLogs } = get();
    const entry: TerminalLogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      type,
      message,
    };
    const newLogs = [...terminalLogs, entry].slice(-maxLogs);
    set({ terminalLogs: newLogs });
  },

  clearLogs: () => {
    set({ terminalLogs: [] });
  },
}));
