export type CellState = 0 | 1;

export interface CellularAutomatonStats {
  generation: number;
  population: number;
  width: number;
  height: number;
}

export interface ICellularAutomaton {
  readonly width: number;
  readonly height: number;
  readonly stats: CellularAutomatonStats;

  step(): void;
  getCell(x: number, y: number): CellState;
  setCell(x: number, y: number, state: CellState): void;
  toggleCell(x: number, y: number): CellState;
  clear(): void;
  randomize(density?: number): void;
  placePattern(pattern: number[][], x: number, y: number): void;
  getGrid(): Uint8Array;
  getInternalGrid(): Uint8Array;
  clone(): ICellularAutomaton;
}
