export const SIZE = 9;

export const DEFAULT_BLOCKS = [
  { x: 3, y: 2 },
  { x: 4, y: 2 },
  { x: 5, y: 2 },
  { x: 6, y: 4 },
  { x: 2, y: 6 },
  { x: 7, y: 6 },
  { x: 7, y: 3 },
  { x: 5, y: 7 },
];

export function isBlocked(
  x: number,
  y: number,
  blocks: { x: number; y: number }[]
) {
  return blocks.some(
    (b) => b.x === x && b.y === y
  );
}

export function randomEnemyMove(
  enemy: { x: number; y: number },
  blocks: { x: number; y: number }[]
) {
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  const [dx, dy] =
    dirs[Math.floor(Math.random() * dirs.length)];

  const nx = Math.max(
    0,
    Math.min(SIZE - 1, enemy.x + dx)
  );

  const ny = Math.max(
    0,
    Math.min(SIZE - 1, enemy.y + dy)
  );

  const blocked = blocks.some(
    (b) => b.x === nx && b.y === ny
  );

  if (blocked) return enemy;

  return {
    x: nx,
    y: ny,
  };
}

export function createBlast(
  bx: number,
  by: number
) {
  return [
    { x: bx, y: by },
    { x: bx + 1, y: by },
    { x: bx - 1, y: by },
    { x: bx, y: by + 1 },
    { x: bx, y: by - 1 },
  ];
}
