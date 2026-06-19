import type { CellState, CellularAutomatonStats, ICellularAutomaton } from '../types/cell';

export class CellularAutomaton implements ICellularAutomaton {
  private _width: number;
  private _height: number;
  private _generation: number;
  private _stride: number;
  private current: Uint8Array;
  private next: Uint8Array;
  private neighborCounts: Uint32Array;

  constructor(width: number, height: number) {
    this._width = width;
    this._height = height;
    this._generation = 0;
    this._stride = width + 2;
    const totalCells = this._stride * (height + 2);
    this.current = new Uint8Array(totalCells);
    this.next = new Uint8Array(totalCells);
    this.neighborCounts = new Uint32Array(totalCells);
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  get stats(): CellularAutomatonStats {
    let population = 0;
    for (let y = 1; y <= this._height; y++) {
      for (let x = 1; x <= this._width; x++) {
        population += this.current[y * this._stride + x];
      }
    }
    return {
      generation: this._generation,
      population,
      width: this._width,
      height: this._height,
    };
  }

  private getIndex(x: number, y: number): number {
    return (y + 1) * this._stride + (x + 1);
  }

  step(): void {
    const { _width: width, _height: height, _stride: stride, current, next, neighborCounts } = this;

    neighborCounts.fill(0);

    for (let y = 1; y <= height; y++) {
      const rowBase = y * stride;
      for (let x = 1; x <= width; x++) {
        const idx = rowBase + x;
        if (current[idx] === 1) {
          neighborCounts[idx - stride - 1]++;
          neighborCounts[idx - stride]++;
          neighborCounts[idx - stride + 1]++;
          neighborCounts[idx - 1]++;
          neighborCounts[idx + 1]++;
          neighborCounts[idx + stride - 1]++;
          neighborCounts[idx + stride]++;
          neighborCounts[idx + stride + 1]++;
        }
      }
    }

    for (let y = 1; y <= height; y++) {
      const rowBase = y * stride;
      for (let x = 1; x <= width; x++) {
        const idx = rowBase + x;
        const count = neighborCounts[idx];
        const alive = current[idx] === 1;
        next[idx] = ((alive && (count === 2 || count === 3)) || (!alive && count === 3)) ? 1 : 0;
      }
    }

    const temp = this.current;
    this.current = this.next;
    this.next = temp;
    this._generation++;
  }

  getCell(x: number, y: number): CellState {
    if (x < 0 || x >= this._width || y < 0 || y >= this._height) return 0;
    return this.current[this.getIndex(x, y)] as CellState;
  }

  setCell(x: number, y: number, state: CellState): void {
    if (x < 0 || x >= this._width || y < 0 || y >= this._height) return;
    this.current[this.getIndex(x, y)] = state;
  }

  toggleCell(x: number, y: number): CellState {
    if (x < 0 || x >= this._width || y < 0 || y >= this._height) return 0;
    const idx = this.getIndex(x, y);
    const newState = (this.current[idx] === 0 ? 1 : 0) as CellState;
    this.current[idx] = newState;
    return newState;
  }

  clear(): void {
    this.current.fill(0);
    this.next.fill(0);
    this._generation = 0;
  }

  randomize(density = 0.3): void {
    this.clear();
    for (let y = 1; y <= this._height; y++) {
      for (let x = 1; x <= this._width; x++) {
        const idx = y * this._stride + x;
        this.current[idx] = Math.random() < density ? 1 : 0;
      }
    }
  }

  placePattern(pattern: number[][], x: number, y: number): void {
    const h = pattern.length;
    const w = pattern[0].length;
    for (let py = 0; py < h; py++) {
      for (let px = 0; px < w; px++) {
        if (pattern[py][px] === 1) {
          this.setCell(x + px, y + py, 1);
        }
      }
    }
  }

  getGrid(): Uint8Array {
    const grid = new Uint8Array(this._width * this._height);
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        grid[y * this._width + x] = this.getCell(x, y);
      }
    }
    return grid;
  }

  getInternalGrid(): Uint8Array {
    return this.current;
  }

  countAliveInRegion(cx: number, cy: number, radius: number): number {
    let count = 0;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        count += this.getCell(cx + dx, cy + dy);
      }
    }
    return count;
  }

  clone(): CellularAutomaton {
    const ca = new CellularAutomaton(this._width, this._height);
    ca.current.set(this.current);
    ca.next.set(this.next);
    ca._generation = this._generation;
    return ca;
  }
}
