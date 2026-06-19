import { CellularAutomaton } from './CellularAutomaton';
import type { Level, TruthTableEntry, TestResult, DetectionPoint } from '../types/level';

export class LogicDetector {
  private ca: CellularAutomaton;
  private level: Level;
  private savedState: Uint8Array | null = null;
  private savedGeneration: number = 0;

  constructor(ca: CellularAutomaton, level: Level) {
    this.ca = ca;
    this.level = level;
  }

  saveState(): void {
    this.savedState = new Uint8Array(this.ca.getInternalGrid());
    this.savedGeneration = this.ca.stats.generation;
  }

  restoreState(): void {
    if (this.savedState) {
      this.ca.getInternalGrid().set(this.savedState);
      this.ca.setGeneration(this.savedGeneration);
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

  detectAllOutputs(): Record<string, 0 | 1> {
    const outputs = this.level.outputs;
    const windowSize = this.level.detectionWindow;
    const threshold = this.level.detectionThreshold;

    const counts = new Float64Array(outputs.length);
    const radii = outputs.map((o) => o.radius ?? 3);

    for (let i = 0; i < windowSize; i++) {
      for (let o = 0; o < outputs.length; o++) {
        counts[o] += this.ca.countAliveInRegion(outputs[o].x, outputs[o].y, radii[o]);
      }
      this.ca.step();
    }

    const result: Record<string, 0 | 1> = {};
    for (let o = 0; o < outputs.length; o++) {
      const average = counts[o] / windowSize;
      result[outputs[o].id] = average > threshold ? 1 : 0;
    }
    return result;
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

    const actualOutputs = this.detectAllOutputs();

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
