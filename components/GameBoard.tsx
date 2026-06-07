"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SIZE = 9;

const DEFAULT_BLOCKS = [
  { x: 3, y: 2 },
  { x: 4, y: 2 },
  { x: 5, y: 2 },
  { x: 6, y: 4 },
  { x: 2, y: 6 },
  { x: 7, y: 6 },
  { x: 7, y: 3 },
  { x: 5, y: 7 },
];

export default function GameBoard() {
  const [player, setPlayer] = useState({
    x: 1,
    y: 1,
  });

  const [enemy, setEnemy] = useState({
    x: 7,
    y: 7,
  });

  const [score, setScore] = useState(0);

  const [timeLeft, setTimeLeft] = useState(60);

  const [gameOver, setGameOver] =
    useState(false);

  const [bombs, setBombs] = useState<
    { x: number; y: number }[]
  >([]);

  const [explosions, setExplosions] =
    useState<
      { x: number; y: number }[]
    >([]);

  const [blocks, setBlocks] =
    useState(DEFAULT_BLOCKS);

  useEffect(() => {
    if (gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameOver(true);
          return 0;
        }

        return t - 1;
      });
    }, 1000);

    return () =>
      clearInterval(timer);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const ai = setInterval(() => {
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

      setEnemy((e) => {
        const nx = Math.max(
          0,
          Math.min(
            SIZE - 1,
            e.x + dx
          )
        );

        const ny = Math.max(
          0,
          Math.min(
            SIZE - 1,
            e.y + dy
          )
        );

        const blocked =
          blocks.some(
            (b) =>
              b.x === nx &&
              b.y === ny
          );

        if (blocked) return e;

        return {
          x: nx,
          y: ny,
        };
      });
    }, 800);

    return () =>
      clearInterval(ai);
  }, [blocks, gameOver]);

  const move = (
    dx: number,
    dy: number
  ) => {
    if (gameOver) return;

    const nx = player.x + dx;
    const ny = player.y + dy;

    if (
      nx < 0 ||
      nx >= SIZE ||
      ny < 0 ||
      ny >= SIZE
    )
      return;

    const blocked =
      blocks.some(
        (b) =>
          b.x === nx &&
          b.y === ny
      );

    if (blocked) return;

    setPlayer({
      x: nx,
      y: ny,
    });
  };

  const placeBomb = () => {
    if (gameOver) return;

    const bx = player.x;
    const by = player.y;

    const exists =
      bombs.some(
        (b) =>
          b.x === bx &&
          b.y === by
      );

    if (exists) return;

    setBombs((prev) => [
      ...prev,
      {
        x: bx,
        y: by,
      },
    ]);

    setTimeout(() => {
      setBombs((prev) =>
        prev.filter(
          (b) =>
            !(
              b.x === bx &&
              b.y === by
            )
        )
      );

      const blast = [
        { x: bx, y: by },
        { x: bx + 1, y: by },
        { x: bx - 1, y: by },
        { x: bx, y: by + 1 },
        { x: bx, y: by - 1 },
      ];

      setExplosions(blast);

      const enemyHit =
        blast.some(
          (e) =>
            e.x === enemy.x &&
            e.y === enemy.y
        );

      if (enemyHit) {
        setScore(
          (s) => s + 50
        );

        setEnemy({
          x: 7,
          y: 7,
        });
      }

      const playerHit =
        blast.some(
          (e) =>
            e.x === player.x &&
            e.y === player.y
        );

      if (
        playerHit &&
        !(player.x === bx &&
          player.y === by)
      ) {
        setGameOver(true);
      }

      setBlocks((prev) => {
        const destroyed =
          prev.filter(
            (block) =>
              blast.some(
                (e) =>
                  e.x === block.x &&
                  e.y === block.y
              )
          ).length;

        if (destroyed) {
          setScore(
            (s) =>
              s +
              destroyed * 10
          );
        }

        return prev.filter(
          (block) =>
            !blast.some(
              (e) =>
                e.x === block.x &&
                e.y === block.y
            )
        );
      });

      setTimeout(() => {
        setExplosions([]);
      }, 500);
    }, 1500);
  };

  const restart = () => {
    setPlayer({
      x: 1,
      y: 1,
    });

    setEnemy({
      x: 7,
      y: 7,
    });

    setScore(0);
    setTimeLeft(60);

    setBombs([]);
    setExplosions([]);

    setBlocks([
      ...DEFAULT_BLOCKS,
    ]);

    setGameOver(false);
  };

  return (
    <div
      style={{
        textAlign: "center",
      }}
    >
      <h2
        style={{
          color: "white",
        }}
      >
        Score: {score}
      </h2>

      <div
        style={{
          color: "#00E5FF",
          marginBottom: 10,
        }}
      >
        Time: {timeLeft}s
      </div>

      {score >= 200 && (
        <div
          style={{
            color: "#00ff88",
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          YOU WIN 🎉
        </div>
      )}

      {gameOver && (
        <div>
          <h2
            style={{
              color: "#FF66CC",
            }}
          >
            GAME OVER
          </h2>

          <button
            onClick={restart}
          >
            RESTART
          </button>
        </div>
      )}

      <div
        style={{
          width:
            "min(90vw,520px)",
          aspectRatio: "1",
          margin:
            "20px auto",
          background:
            "#160028",
          border:
            "4px solid #FF66CC",
          display: "grid",
          gridTemplateColumns:
            "repeat(9,1fr)",
        }}
      >
        {Array.from({
          length:
            SIZE * SIZE,
        }).map((_, i) => {
          const x = i % SIZE;
          const y =
            Math.floor(
              i / SIZE
            );

          const isPlayer =
            player.x === x &&
            player.y === y;

          const isEnemy =
            enemy.x === x &&
            enemy.y === y;

          const isBomb =
            bombs.some(
              (b) =>
                b.x === x &&
                b.y === y
            );

          const isExplosion =
            explosions.some(
              (e) =>
                e.x === x &&
                e.y === y
            );

          const isBlock =
            blocks.some(
              (b) =>
                b.x === x &&
                b.y === y
            );

          return (
            <div
              key={i}
              style={{
                border:
                  "1px solid #26003f",
                display:
                  "flex",
                justifyContent:
                  "center",
                alignItems:
                  "center",
                background:
                  isExplosion
                    ? "#ff9933"
                    : isBlock
                    ? "#7b4f2f"
                    : "#1d0035",
              }}
            >
              {isPlayer && (
                <Image
                  src="/siggy-player.png"
                  alt="Siggy"
                  width={28}
                  height={28}
                />
              )}

              {isEnemy &&
                !isPlayer &&
                "👾"}

              {isBomb &&
                !isPlayer &&
                "💣"}

              {isExplosion &&
                "💥"}
            </div>
          );
        })}
      </div>

      <button
        onClick={() =>
          move(0, -1)
        }
        style={{
          width: 60,
          height: 60,
        }}
      >
        ⬆
      </button>

      <div>
        <button
          onClick={() =>
            move(-1, 0)
          }
          style={{
            width: 60,
            height: 60,
          }}
        >
          ⬅
        </button>

        <button
          onClick={placeBomb}
          style={{
            width: 70,
            height: 60,
            margin:
              "0 10px",
          }}
        >
          💣
        </button>

        <button
          onClick={() =>
            move(1, 0)
          }
          style={{
            width: 60,
            height: 60,
          }}
        >
          ➡
        </button>
      </div>

      <button
        onClick={() =>
          move(0, 1)
        }
        style={{
          width: 60,
          height: 60,
          marginTop: 5,
        }}
      >
        ⬇
      </button>
    </div>
  );
}