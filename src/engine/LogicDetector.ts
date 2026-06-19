import { CellularAutomaton } from './CellularAutomaton';
import type { Level, DetectionPoint } from '../types/level';

export class LogicDetector {
  private ca: CellularAutomaton;
  private level: Level;

  constructor(ca: CellularAutomaton, level: Level) {
    this.ca = ca;
    this.level = level;
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

  setAllInputs(inputValues: Record<string, 0 | 1>): void {
    for (const input of this.level.inputs) {
      const value = inputValues[input.id] ?? 0;
      this.setInput(input, value);
    }
  }

  sampleAllOutputs(): Record<string, number> {
    const result: Record<string, number> = {};
    for (const output of this.level.outputs) {
      const radius = output.radius ?? 3;
      result[output.id] = this.ca.countAliveInRegion(output.x, output.y, radius);
    }
    return result;
  }

  sampleOutput(output: DetectionPoint): number {
    const radius = output.radius ?? 3;
    return this.ca.countAliveInRegion(output.x, output.y, radius);
  }

  verifyOutputs(
    actualOutputs: Record<string, 0 | 1>,
    expectedOutputs: Record<string, 0 | 1>,
  ): boolean {
    for (const output of this.level.outputs) {
      if (actualOutputs[output.id] !== expectedOutputs[output.id]) {
        return false;
      }
    }
    return true;
  }

  getOutputIds(): string[] {
    return this.level.outputs.map((o) => o.id);
  }
}
