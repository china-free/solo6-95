import { CellularAutomaton } from './CellularAutomaton';

interface Snapshot {
  grid: Uint8Array;
  generation: number;
}

export class SimulationRunner {
  private ca: CellularAutomaton;
  private snapshot: Snapshot | null = null;

  constructor(ca: CellularAutomaton) {
    this.ca = ca;
  }

  step(): void {
    this.ca.step();
  }

  stepN(steps: number): void {
    for (let i = 0; i < steps; i++) {
      this.ca.step();
    }
  }

  saveSnapshot(): void {
    this.snapshot = {
      grid: new Uint8Array(this.ca.getInternalGrid()),
      generation: this.ca.stats.generation,
    };
  }

  restoreSnapshot(): void {
    if (!this.snapshot) return;
    this.ca.getInternalGrid().set(this.snapshot.grid);
    this.ca.setGeneration(this.snapshot.generation);
  }

  getGeneration(): number {
    return this.ca.stats.generation;
  }

  getEngine(): CellularAutomaton {
    return this.ca;
  }

  clearSnapshot(): void {
    this.snapshot = null;
  }
}
