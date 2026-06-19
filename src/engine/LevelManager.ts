import { levels, getLevel } from './levels';
import { LogicDetector } from './LogicDetector';
import { CellularAutomaton } from './CellularAutomaton';
import type { Level, TestResult, LevelProgress } from '../types/level';

export class LevelManager {
  private progress: LevelProgress;

  constructor() {
    this.progress = {
      currentLevelId: 1,
      completedLevels: [],
      testResults: [],
      isTesting: false,
    };
  }

  getCurrentLevel(): Level | undefined {
    return getLevel(this.progress.currentLevelId);
  }

  getProgress(): LevelProgress {
    return { ...this.progress };
  }

  getAllLevels(): Level[] {
    return levels;
  }

  selectLevel(levelId: number): boolean {
    const level = getLevel(levelId);
    if (!level) return false;
    if (levelId > 1 && !this.progress.completedLevels.includes(levelId - 1)) {
      return false;
    }
    this.progress.currentLevelId = levelId;
    return true;
  }

  isLevelUnlocked(levelId: number): boolean {
    if (levelId === 1) return true;
    return this.progress.completedLevels.includes(levelId - 1);
  }

  isLevelCompleted(levelId: number): boolean {
    return this.progress.completedLevels.includes(levelId);
  }

  async runLevelTest(ca: CellularAutomaton, level: Level): Promise<TestResult[]> {
    this.progress.isTesting = true;
    const detector = new LogicDetector(ca, level);
    const results = await detector.runFullTest();
    this.progress.testResults = results;
    this.progress.isTesting = false;

    if (detector.allPassed(results)) {
      if (!this.progress.completedLevels.includes(level.id)) {
        this.progress.completedLevels.push(level.id);
      }
    }

    return results;
  }

  canProceedToNextLevel(): boolean {
    const currentLevel = this.getCurrentLevel();
    if (!currentLevel) return false;
    if (!this.progress.completedLevels.includes(currentLevel.id)) return false;
    return currentLevel.id < levels.length;
  }

  proceedToNextLevel(): boolean {
    if (!this.canProceedToNextLevel()) return false;
    this.progress.currentLevelId++;
    return true;
  }

  getTestResults(): TestResult[] {
    return [...this.progress.testResults];
  }

  resetProgress(): void {
    this.progress = {
      currentLevelId: 1,
      completedLevels: [],
      testResults: [],
      isTesting: false,
    };
  }
}
