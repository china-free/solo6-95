import { CellularAutomaton } from './CellularAutomaton';
import type { Level, TruthTableEntry, TestResult, DetectionPoint } from '../types/level';

export class LogicDetector {
  private ca: CellularAutomaton;
  private level: Level;
  private savedState: Uint8Array | null = null;

  constructor(ca: CellularAutomaton, level: Level) {
    this.ca = ca;
    this.level = level;
  }

  saveState(): void {
    this.savedState = new Uint8Array(this.ca.getInternalGrid());
  }

  restoreState(): void {
    if (this.savedState) {
      this.ca.getInternalGrid().set(this.savedState);
    }
  }

  setInput(input: DetectionPoint, value: 0 | 1): void {
    const radius = input.radius ?? 2;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        this.ca.setCell(input.x + dx, input.y + dy, 0);
      }
    }
    if (value === 1) {
      const glider = [
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 1],
      ];
      this.ca.placePattern(glider, input.x - 1, input.y - 1);
    }
  }

  detectOutput(output: DetectionPoint): 0 | 1 {
    const radius = output.radius ?? 3;
    let total = 0;
    const windowSize = this.level.detectionWindow;

    for (let i = 0; i < windowSize; i++) {
      total += this.ca.countAliveInRegion(output.x, output.y, radius);
      this.ca.step();
    }

    const average = total / windowSize;
    const threshold = this.level.detectionThreshold;
    return average > threshold ? 1 : 0;
  }

  async testTruthTableEntry(entry: TruthTableEntry): Promise<TestResult> {
    this.saveState();

    for (const input of this.level.inputs) {
      const value = entry.inputs[input.id] ?? 0;
      this.setInput(input, value);
    }

    const stabilizationSteps = 60;
    for (let i = 0; i < stabilizationSteps; i++) {
      this.ca.step();
    }

    const actualOutputs: Record<string, 0 | 1> = {};
    for (const output of this.level.outputs) {
      actualOutputs[output.id] = this.detectOutput(output);
    }

    let passed = true;
    for (const output of this.level.outputs) {
      if (actualOutputs[output.id] !== entry.expectedOutputs[output.id]) {
        passed = false;
        break;
      }
    }

    const result: TestResult = {
      passed,
      entry,
      actualOutputs,
      generation: this.ca.stats.generation,
    };

    this.restoreState();
    return result;
  }

  async runFullTest(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    for (const entry of this.level.truthTable) {
      const result = await this.testTruthTableEntry(entry);
      results.push(result);
    }
    return results;
  }

  allPassed(results: TestResult[]): boolean {
    return results.every((r) => r.passed);
  }
}
