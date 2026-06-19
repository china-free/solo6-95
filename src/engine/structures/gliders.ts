import type { Structure } from '../../types/structure';

const _ = 0;
const X = 1;

export const gliders: Structure[] = [
  {
    id: 'glider',
    name: 'Glider',
    nameCn: '滑翔机',
    description: '最基础的移动结构，周期4，沿对角线移动',
    category: 'glider',
    pattern: [
      [_, X, _],
      [_, _, X],
      [X, X, X],
    ],
    width: 3,
    height: 3,
    period: 4,
    color: '#00ff41',
  },
  {
    id: 'lwss',
    name: 'LWSS',
    nameCn: '轻型太空船',
    description: '周期4，沿水平方向移动，速度c/2',
    category: 'glider',
    pattern: [
      [_, X, _, _, X],
      [X, _, _, _, _],
      [X, _, _, _, X],
      [X, X, X, X, _],
    ],
    width: 5,
    height: 4,
    period: 4,
    color: '#00ff88',
  },
  {
    id: 'mwss',
    name: 'MWSS',
    nameCn: '中型太空船',
    description: '周期4，比LWSS更大更稳',
    category: 'glider',
    pattern: [
      [_, _, X, _, _, _],
      [_, X, _, _, _, X],
      [X, _, _, _, _, _],
      [X, _, _, _, _, X],
      [X, X, X, X, X, _],
    ],
    width: 6,
    height: 5,
    period: 4,
    color: '#00ffcc',
  },
  {
    id: 'hwss',
    name: 'HWSS',
    nameCn: '重型太空船',
    description: '周期4，最大的基础太空船',
    category: 'glider',
    pattern: [
      [_, _, X, X, _, _, _],
      [_, X, _, _, _, _, X],
      [X, _, _, _, _, _, _],
      [X, _, _, _, _, _, X],
      [X, X, X, X, X, X, _],
    ],
    width: 7,
    height: 5,
    period: 4,
    color: '#00ccff',
  },
];
