import { gliders } from './gliders';
import { guns } from './guns';
import { utilities } from './utilities';
import { gates } from './gates';
import type { Structure } from '../../types/structure';

export const allStructures: Structure[] = [
  ...gliders,
  ...guns,
  ...utilities,
  ...gates,
];

export const structureMap: Record<string, Structure> = allStructures.reduce(
  (acc, s) => {
    acc[s.id] = s;
    return acc;
  },
  {} as Record<string, Structure>,
);

export function getStructure(id: string): Structure | undefined {
  return structureMap[id];
}

export function getStructuresByCategory(
  category: Structure['category'],
): Structure[] {
  return allStructures.filter((s) => s.category === category);
}

export const categoryNames: Record<Structure['category'], string> = {
  glider: '🚀 滑翔机',
  gun: '⚡ 发射器',
  utility: '🔧 工具',
  gate: '🔌 逻辑门',
};
