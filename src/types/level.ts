export interface DetectionPoint {
  id: string;
  x: number;
  y: number;
  label: string;
  type: 'input' | 'output';
  radius?: number;
}

export interface TruthTableEntry {
  inputs: Record<string, 0 | 1>;
  expectedOutputs: Record<string, 0 | 1>;
}

export interface Level {
  id: number;
  name: string;
  description: string;
  objective: string;
  hint: string;
  availableStructures: string[];
  inputs: DetectionPoint[];
  outputs: DetectionPoint[];
  truthTable: TruthTableEntry[];
  gridSize: { width: number; height: number };
  detectionWindow: number;
  detectionThreshold: number;
}

export interface TestResult {
  passed: boolean;
  entry: TruthTableEntry;
  actualOutputs: Record<string, 0 | 1>;
  generation: number;
}

export interface LevelProgress {
  currentLevelId: number;
  completedLevels: number[];
  testResults: TestResult[];
  isTesting: boolean;
}
