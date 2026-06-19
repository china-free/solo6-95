export type StructureCategory = 'glider' | 'gun' | 'gate' | 'utility';

export interface Structure {
  id: string;
  name: string;
  nameCn: string;
  description: string;
  category: StructureCategory;
  pattern: number[][];
  width: number;
  height: number;
  period?: number;
  color?: string;
}

export interface PlacedStructure {
  structureId: string;
  x: number;
  y: number;
  instanceId: string;
}
