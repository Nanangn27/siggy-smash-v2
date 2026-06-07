export const SIZE = 9;

export type Position = {
  x: number;
  y: number;
};

export const DEFAULT_BLOCKS: Position[] = [
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
  blocks: Position[]
) {
  return blocks.some(
    (b) => b.x === x && b.y === y
  );
}

export function createBlast(
  bx: number,
  by: number
): Position[] {
  return [
    { x: bx, y: by },

    { x: bx + 1, y: by },
    { x: bx + 2, y: by },

    { x: bx - 1, y: by },
    { x: bx - 2, y: by },

    { x: bx, y: by + 1 },
    { x: bx, y: by + 2 },

    { x: bx, y: by - 1 },
    { x: bx, y: by - 2 },
  ].filter(
    (p) =>
      p.x >= 0 &&
      p.x < SIZE &&
      p.y >= 0 &&
      p.y < SIZE
  );
}

export function randomEnemyMove(
  enemy: Position,
  blocks: Position[]
): Position {
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  const [dx, dy] =
    dirs[
      Math.floor(
        Math.random() * dirs.length
      )
    ];

  const nx = Math.max(
    0,
    Math.min(
      SIZE - 1,
      enemy.x + dx
    )
  );

  const ny = Math.max(
    0,
    Math.min(
      SIZE - 1,
      enemy.y + dy
    )
  );

  const blocked = blocks.some(
    (b) =>
      b.x === nx &&
      b.y === ny
  );

  if (blocked) return enemy;

  return {
    x: nx,
    y: ny,
  };
}

export function chasePlayerMove(
  enemy: Position,
  player: Position,
  blocks: Position[]
): Position {
  let dx = 0;
  let dy = 0;

  const diffX =
    player.x - enemy.x;

  const diffY =
    player.y - enemy.y;

  if (
    Math.abs(diffX) >
    Math.abs(diffY)
  ) {
    dx = diffX > 0 ? 1 : -1;
  } else {
    dy = diffY > 0 ? 1 : -1;
  }

  const nx = enemy.x + dx;
  const ny = enemy.y + dy;

  if (
    nx < 0 ||
    nx >= SIZE ||
    ny < 0 ||
    ny >= SIZE
  )
    return enemy;

  const blocked = blocks.some(
    (b) =>
      b.x === nx &&
      b.y === ny
  );

  if (blocked)
    return randomEnemyMove(
      enemy,
      blocks
    );

  return {
    x: nx,
    y: ny,
  };
}

export function generateBlocks() {
  const blocks: Position[] = [];

  for (let y = 0; y < SIZE; y++) {
    for (
      let x = 0;
      x < SIZE;
      x++
    ) {
      const safeZone =
        x <= 2 && y <= 2;

      const permanentWall =
        x % 2 === 0 &&
        y % 2 === 0;

      if (
        !safeZone &&
        !permanentWall &&
        Math.random() > 0.65
      ) {
        blocks.push({
          x,
          y,
        });
      }
    }
  }

  return blocks;
}

export function generateWalls() {
  const walls: Position[] = [];

  for (let y = 0; y < SIZE; y++) {
    for (
      let x = 0;
      x < SIZE;
      x++
    ) {
      if (
        x % 2 === 0 &&
        y % 2 === 0
      ) {
        walls.push({
          x,
          y,
        });
      }
    }
  }

  return walls;
}