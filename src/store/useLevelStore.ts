import { create } from 'zustand';
import { LevelManager } from '../engine/LevelManager';
import { useGameStore } from './useGameStore';
import type { Level, TestResult, LevelProgress } from '../types/level';

interface LevelState {
  manager: LevelManager | null;
  currentLevel: Level | null;
  progress: LevelProgress;
  testResults: TestResult[];
  showTestResults: boolean;
  canProceedToNextLevel: boolean;

  init: () => void;
  selectLevel: (levelId: number) => boolean;
  runTest: () => Promise<void>;
  proceedToNextLevel: () => boolean;
  resetProgress: () => void;
  toggleTestResults: () => void;
  isLevelUnlocked: (levelId: number) => boolean;
  isLevelCompleted: (levelId: number) => boolean;
  getAllLevels: () => Level[];
  updateCanProceed: () => void;
}

export const useLevelStore = create<LevelState>((set, get) => ({
  manager: null,
  currentLevel: null,
  progress: {
    currentLevelId: 1,
    completedLevels: [],
    testResults: [],
    isTesting: false,
  },
  testResults: [],
  showTestResults: false,
  canProceedToNextLevel: false,

  updateCanProceed: () => {
    const { manager, currentLevel, progress } = get();
    const canProceed =
      manager?.canProceedToNextLevel() ??
      (currentLevel &&
        progress.completedLevels.includes(currentLevel.id) &&
        currentLevel.id < 8) ??
      false;
    set({ canProceedToNextLevel: canProceed });
  },

  init: () => {
    const manager = new LevelManager();
    const currentLevel = manager.getCurrentLevel() || null;
    set({
      manager,
      currentLevel,
      progress: manager.getProgress(),
    });

    if (currentLevel) {
      const { width, height } = currentLevel.gridSize;
      useGameStore.getState().init(width, height);
      useGameStore.getState().addLog('system', `关卡 ${currentLevel.id}: ${currentLevel.name}`);
      useGameStore.getState().addLog('info', `目标: ${currentLevel.objective}`);
    }
    get().updateCanProceed();
  },

  selectLevel: (levelId) => {
    const { manager } = get();
    if (!manager) return false;

    const success = manager.selectLevel(levelId);
    if (success) {
      const currentLevel = manager.getCurrentLevel() || null;
      const progress = manager.getProgress();
      set({ currentLevel, progress, testResults: [] });

      if (currentLevel) {
        const { width, height } = currentLevel.gridSize;
        useGameStore.getState().resize(width, height);
        useGameStore.getState().addLog('system', `切换到关卡 ${currentLevel.id}: ${currentLevel.name}`);
        useGameStore.getState().addLog('info', `目标: ${currentLevel.objective}`);
      }
    }
    get().updateCanProceed();
    return success;
  },

  runTest: async () => {
    const { manager, currentLevel } = get();
    const { ca, pause, addLog } = useGameStore.getState();

    if (!manager || !currentLevel || !ca) return;

    pause();
    addLog('system', `开始测试关卡 ${currentLevel.id}...`);
    set((state) => ({ progress: { ...state.progress, isTesting: true } }));

    try {
      const results = await manager.runLevelTest(ca, currentLevel);
      const progress = manager.getProgress();
      const allPassed = results.every((r) => r.passed);

      set({ testResults: results, progress, showTestResults: true });

      if (allPassed) {
        addLog('success', `✅ 关卡 ${currentLevel.id} 完成！所有测试通过`);
        if (manager.canProceedToNextLevel()) {
          addLog('info', '👉 可以进入下一关');
        }
      } else {
        const failed = results.filter((r) => !r.passed).length;
        addLog('error', `❌ 测试失败: ${failed}/${results.length} 项不通过`);
      }
    } catch (error) {
      addLog('error', `测试错误: ${error}`);
    } finally {
      set((state) => ({ progress: { ...state.progress, isTesting: false } }));
    }
    get().updateCanProceed();
  },

  proceedToNextLevel: () => {
    const { manager } = get();
    if (!manager) return false;

    const success = manager.proceedToNextLevel();
    if (success) {
      const currentLevel = manager.getCurrentLevel() || null;
      const progress = manager.getProgress();
      set({ currentLevel, progress, testResults: [], showTestResults: false });

      if (currentLevel) {
        const { width, height } = currentLevel.gridSize;
        useGameStore.getState().resize(width, height);
        useGameStore.getState().addLog('system', `进入关卡 ${currentLevel.id}: ${currentLevel.name}`);
        useGameStore.getState().addLog('info', `目标: ${currentLevel.objective}`);
      }
    }
    get().updateCanProceed();
    return success;
  },

  resetProgress: () => {
    const { manager } = get();
    if (manager) {
      manager.resetProgress();
      const currentLevel = manager.getCurrentLevel() || null;
      const progress = manager.getProgress();
      set({ currentLevel, progress, testResults: [], showTestResults: false });

      if (currentLevel) {
        const { width, height } = currentLevel.gridSize;
        useGameStore.getState().resize(width, height);
        useGameStore.getState().addLog('system', '进度已重置');
      }
    }
    get().updateCanProceed();
  },

  toggleTestResults: () => {
    set((state) => ({ showTestResults: !state.showTestResults }));
  },

  isLevelUnlocked: (levelId) => {
    const { manager } = get();
    return manager?.isLevelUnlocked(levelId) ?? false;
  },

  isLevelCompleted: (levelId) => {
    const { manager } = get();
    return manager?.isLevelCompleted(levelId) ?? false;
  },

  getAllLevels: () => {
    const { manager } = get();
    return manager?.getAllLevels() ?? [];
  },
}));
