import type { Level } from '../types/level';

export const levels: Level[] = [
  {
    id: 1,
    name: '初识滑翔机',
    description: '学习最基础的移动结构——滑翔机',
    objective: '放置一个滑翔机，让它从网格左侧飞到右侧',
    hint: '滑翔机会沿对角线方向移动，放置在左上角附近试试',
    availableStructures: ['glider', 'block'],
    inputs: [],
    outputs: [
      { id: 'exit', x: 75, y: 40, label: '出口', type: 'output', radius: 5 },
    ],
    truthTable: [
      {
        inputs: {},
        expectedOutputs: { exit: 1 },
      },
    ],
    gridSize: { width: 80, height: 50 },
    detectionWindow: 30,
    detectionThreshold: 2,
  },
  {
    id: 2,
    name: '滑翔机枪',
    description: '认识高斯帕滑翔机枪——第一个无限发射滑翔机的结构',
    objective: '放置高斯帕滑翔机枪，观察它如何持续产生滑翔机',
    hint: '滑翔机枪每30代发射一个滑翔机，注意它的发射方向',
    availableStructures: ['gosper_gun', 'eater1', 'block'],
    inputs: [],
    outputs: [
      { id: 'stream', x: 70, y: 20, label: '信号流', type: 'output', radius: 8 },
    ],
    truthTable: [
      {
        inputs: {},
        expectedOutputs: { stream: 1 },
      },
    ],
    gridSize: { width: 80, height: 50 },
    detectionWindow: 60,
    detectionThreshold: 5,
  },
  {
    id: 3,
    name: '信号吞噬',
    description: '使用吞噬者来控制信号流',
    objective: '在滑翔机枪的射线路径上放置吞噬者，阻止滑翔机到达输出端',
    hint: '吞噬者1号可以稳定地吞噬滑翔机，把它放在滑翔机的路径上',
    availableStructures: ['gosper_gun', 'eater1', 'block'],
    inputs: [],
    outputs: [
      { id: 'output', x: 70, y: 20, label: '输出', type: 'output', radius: 5 },
    ],
    truthTable: [
      {
        inputs: {},
        expectedOutputs: { output: 0 },
      },
    ],
    gridSize: { width: 80, height: 50 },
    detectionWindow: 60,
    detectionThreshold: 2,
  },
  {
    id: 4,
    name: 'NOT 门',
    description: '构建你的第一个逻辑门——非门',
    objective: '利用滑翔机枪和吞噬者构建一个非门：输入有信号时输出无，输入无时输出有',
    hint: '用输入信号控制吞噬者，当输入信号到来时激活吞噬者来阻挡机枪的输出',
    availableStructures: ['glider', 'gosper_gun', 'eater1', 'block', 'not_gate'],
    inputs: [
      { id: 'a', x: 10, y: 25, label: 'A', type: 'input', radius: 3 },
    ],
    outputs: [
      { id: 'y', x: 70, y: 25, label: 'Y', type: 'output', radius: 5 },
    ],
    truthTable: [
      { inputs: { a: 0 }, expectedOutputs: { y: 1 } },
      { inputs: { a: 1 }, expectedOutputs: { y: 0 } },
    ],
    gridSize: { width: 80, height: 50 },
    detectionWindow: 30,
    detectionThreshold: 3,
  },
  {
    id: 5,
    name: 'AND 门',
    description: '构建与门——只有两输入都为1时输出才为1',
    objective: '利用两个滑翔机流的碰撞实现与门逻辑',
    hint: '两个滑翔机碰撞会互相湮灭。让两路滑翔机在到达输出前交汇，只有当两路都有时才...',
    availableStructures: ['glider', 'gosper_gun', 'eater1', 'block', 'reflector', 'and_gate'],
    inputs: [
      { id: 'a', x: 10, y: 15, label: 'A', type: 'input', radius: 3 },
      { id: 'b', x: 10, y: 35, label: 'B', type: 'input', radius: 3 },
    ],
    outputs: [
      { id: 'y', x: 70, y: 25, label: 'Y', type: 'output', radius: 5 },
    ],
    truthTable: [
      { inputs: { a: 0, b: 0 }, expectedOutputs: { y: 0 } },
      { inputs: { a: 0, b: 1 }, expectedOutputs: { y: 0 } },
      { inputs: { a: 1, b: 0 }, expectedOutputs: { y: 0 } },
      { inputs: { a: 1, b: 1 }, expectedOutputs: { y: 1 } },
    ],
    gridSize: { width: 80, height: 50 },
    detectionWindow: 40,
    detectionThreshold: 3,
  },
  {
    id: 6,
    name: 'OR 门',
    description: '构建或门——任一输入为1时输出就为1',
    objective: '实现或门逻辑：只要有一个输入为1，输出就为1',
    hint: '将两路滑翔机流汇合到同一条输出路径上，任何一路有信号都能到达输出',
    availableStructures: ['glider', 'gosper_gun', 'eater1', 'block', 'reflector', 'or_gate'],
    inputs: [
      { id: 'a', x: 10, y: 15, label: 'A', type: 'input', radius: 3 },
      { id: 'b', x: 10, y: 35, label: 'B', type: 'input', radius: 3 },
    ],
    outputs: [
      { id: 'y', x: 70, y: 25, label: 'Y', type: 'output', radius: 5 },
    ],
    truthTable: [
      { inputs: { a: 0, b: 0 }, expectedOutputs: { y: 0 } },
      { inputs: { a: 0, b: 1 }, expectedOutputs: { y: 1 } },
      { inputs: { a: 1, b: 0 }, expectedOutputs: { y: 1 } },
      { inputs: { a: 1, b: 1 }, expectedOutputs: { y: 1 } },
    ],
    gridSize: { width: 80, height: 50 },
    detectionWindow: 40,
    detectionThreshold: 3,
  },
  {
    id: 7,
    name: '半加器',
    description: '组合逻辑门构建半加器',
    objective: '用 AND 门和 XOR 门构建半加器，实现两个1位二进制数的加法',
    hint: '半加器有两个输出：Sum = A XOR B，Carry = A AND B',
    availableStructures: ['glider', 'gosper_gun', 'eater1', 'block', 'reflector', 'and_gate', 'or_gate', 'not_gate'],
    inputs: [
      { id: 'a', x: 10, y: 20, label: 'A', type: 'input', radius: 3 },
      { id: 'b', x: 10, y: 40, label: 'B', type: 'input', radius: 3 },
    ],
    outputs: [
      { id: 'sum', x: 70, y: 20, label: 'Sum', type: 'output', radius: 5 },
      { id: 'carry', x: 70, y: 40, label: 'Carry', type: 'output', radius: 5 },
    ],
    truthTable: [
      { inputs: { a: 0, b: 0 }, expectedOutputs: { sum: 0, carry: 0 } },
      { inputs: { a: 0, b: 1 }, expectedOutputs: { sum: 1, carry: 0 } },
      { inputs: { a: 1, b: 0 }, expectedOutputs: { sum: 1, carry: 0 } },
      { inputs: { a: 1, b: 1 }, expectedOutputs: { sum: 0, carry: 1 } },
    ],
    gridSize: { width: 90, height: 60 },
    detectionWindow: 50,
    detectionThreshold: 3,
  },
  {
    id: 8,
    name: '全加器',
    description: '终极挑战——构建全加器',
    objective: '组合两个半加器和一个或门，实现带进位输入的全加器',
    hint: '全加器 = 半加器1(A,B) → 半加器2(Sum,Cin) → OR门(两个Carry)',
    availableStructures: ['glider', 'gosper_gun', 'eater1', 'block', 'reflector', 'and_gate', 'or_gate', 'not_gate'],
    inputs: [
      { id: 'a', x: 10, y: 15, label: 'A', type: 'input', radius: 3 },
      { id: 'b', x: 10, y: 30, label: 'B', type: 'input', radius: 3 },
      { id: 'cin', x: 10, y: 45, label: 'Cin', type: 'input', radius: 3 },
    ],
    outputs: [
      { id: 'sum', x: 75, y: 25, label: 'Sum', type: 'output', radius: 5 },
      { id: 'cout', x: 75, y: 45, label: 'Cout', type: 'output', radius: 5 },
    ],
    truthTable: [
      { inputs: { a: 0, b: 0, cin: 0 }, expectedOutputs: { sum: 0, cout: 0 } },
      { inputs: { a: 0, b: 0, cin: 1 }, expectedOutputs: { sum: 1, cout: 0 } },
      { inputs: { a: 0, b: 1, cin: 0 }, expectedOutputs: { sum: 1, cout: 0 } },
      { inputs: { a: 0, b: 1, cin: 1 }, expectedOutputs: { sum: 0, cout: 1 } },
      { inputs: { a: 1, b: 0, cin: 0 }, expectedOutputs: { sum: 1, cout: 0 } },
      { inputs: { a: 1, b: 0, cin: 1 }, expectedOutputs: { sum: 0, cout: 1 } },
      { inputs: { a: 1, b: 1, cin: 0 }, expectedOutputs: { sum: 0, cout: 1 } },
      { inputs: { a: 1, b: 1, cin: 1 }, expectedOutputs: { sum: 1, cout: 1 } },
    ],
    gridSize: { width: 100, height: 70 },
    detectionWindow: 60,
    detectionThreshold: 3,
  },
];

export function getLevel(id: number): Level | undefined {
  return levels.find((l) => l.id === id);
}

export function getTotalLevels(): number {
  return levels.length;
}
