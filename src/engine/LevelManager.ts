import { levels, getLevel } from './levels';
import { LogicDetector } from './LogicDetector';
import { SimulationRunner } from './SimulationRunner';
import { CellularAutomaton } from './CellularAutomaton';
import type { Level, TestResult, LevelProgress, TruthTableEntry } from '../types/level';

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

    const runner = new SimulationRunner(ca);
    const detector = new LogicDetector(ca, level);
    const outputIds = detector.getOutputIds();

    runner.saveSnapshot();

    const results: TestResult[] = [];
    for (const entry of level.truthTable) {
      const result = await this.testSingleEntry(entry, level, runner, detector, outputIds);
      results.push(result);
    }

    runner.restoreSnapshot();
    runner.clearSnapshot();

    this.progress.testResults = results;
    this.progress.isTesting = false;

    if (this.allPassed(results)) {
      if (!this.progress.completedLevels.includes(level.id)) {
        this.progress.completedLevels.push(level.id);
      }
    }

    return results;
  }

  private async testSingleEntry(
    entry: TruthTableEntry,
    level: Level,
    runner: SimulationRunner,
    detector: LogicDetector,
    outputIds: string[],
  ): Promise<TestResult> {
    runner.saveSnapshot();

    detector.setAllInputs(entry.inputs);

    const stabilizationSteps = 60;
    runner.stepN(stabilizationSteps);

    const actualOutputs = this.sampleOutputsSynchronously(
      level,
      runner,
      detector,
      outputIds,
    );

    const passed = detector.verifyOutputs(actualOutputs, entry.expectedOutputs);

    const result: TestResult = {
      passed,
      entry,
      actualOutputs,
      generation: runner.getGeneration(),
    };

    runner.restoreSnapshot();
    return result;
  }

  private sampleOutputsSynchronously(
    level: Level,
    runner: SimulationRunner,
    detector: LogicDetector,
    outputIds: string[],
  ): Record<string, 0 | 1> {
    const { detectionWindow: windowSize, detectionThreshold: threshold } = level;

    const counts = new Float64Array(outputIds.length);
    const indexMap: Record<string, number> = {};
    outputIds.forEach((id, i) => (indexMap[id] = i));

    for (let i = 0; i < windowSize; i++) {
      const samples = detector.sampleAllOutputs();
      for (const id of outputIds) {
        counts[indexMap[id]] += samples[id];
      }
      runner.step();
    }

    const result: Record<string, 0 | 1> = {};
    for (let i = 0; i < outputIds.length; i++) {
      const average = counts[i] / windowSize;
      result[outputIds[i]] = average > threshold ? 1 : 0;
    }
    return result;
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

  private allPassed(results: TestResult[]): boolean {
    return results.every((r) => r.passed);
  }
}
