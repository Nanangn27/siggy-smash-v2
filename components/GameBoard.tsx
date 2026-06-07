"use client";

import { useState } from "react";
import Image from "next/image";

const SIZE = 9;

export default function GameBoard() {
  const [player, setPlayer] = useState({
    x: 1,
    y: 1,
  });

  const [score, setScore] = useState(0);

  const [bombs, setBombs] = useState<
    { x: number; y: number }[]
  >([]);

  const [explosions, setExplosions] = useState<
    { x: number; y: number }[]
  >([]);

  const [blocks, setBlocks] = useState([
    { x: 3, y: 2 },
    { x: 4, y: 2 },
    { x: 5, y: 2 },
    { x: 6, y: 4 },
    { x: 2, y: 6 },
    { x: 7, y: 6 },
    { x: 7, y: 3 },
    { x: 5, y: 7 },
  ]);

  const move = (
    dx: number,
    dy: number
  ) => {
    const nx = player.x + dx;
    const ny = player.y + dy;

    if (
      nx < 0 ||
      nx >= SIZE ||
      ny < 0 ||
      ny >= SIZE
    )
      return;

    const blocked = blocks.some(
      (b) => b.x === nx && b.y === ny
    );

    if (blocked) return;

    setPlayer({
      x: nx,
      y: ny,
    });
  };

  const placeBomb = () => {
    const bx = player.x;
    const by = player.y;

    const alreadyBomb = bombs.some(
      (b) => b.x === bx && b.y === by
    );

    if (alreadyBomb) return;

    setBombs((prev) => [
      ...prev,
      { x: bx, y: by },
    ]);

    setTimeout(() => {
      setBombs((prev) =>
        prev.filter(
          (b) =>
            !(b.x === bx && b.y === by)
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

      setBlocks((prev) => {
        const destroyed =
          prev.filter((block) =>
            blast.some(
              (e) =>
                e.x === block.x &&
                e.y === block.y
            )
          ).length;

        if (destroyed > 0) {
          setScore(
            (s) => s + destroyed * 10
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

  return (
    <div
      style={{
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: "white",
          fontWeight: "bold",
          marginBottom: 12,
          fontSize: "20px",
        }}
      >
        Score: {score}
      </div>

      <div
        style={{
          width: "min(90vw, 520px)",
          aspectRatio: "1 / 1",
          margin: "0 auto 20px",
          background: "#160028",
          border: "4px solid #FF66CC",
          display: "grid",
          gridTemplateColumns:
            "repeat(9,1fr)",
        }}
      >
        {Array.from({
          length: SIZE * SIZE,
        }).map((_, i) => {
          const x = i % SIZE;
          const y =
            Math.floor(i / SIZE);

          const isPlayer =
            player.x === x &&
            player.y === y;

          const isBomb = bombs.some(
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
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
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
          width: 50,
          height: 50,
          marginBottom: 5,
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
            width: 50,
            height: 50,
          }}
        >
          ⬅
        </button>

        <button
          onClick={placeBomb}
          style={{
            width: 60,
            height: 50,
            margin: "0 10px",
          }}
        >
          💣
        </button>

        <button
          onClick={() =>
            move(1, 0)
          }
          style={{
            width: 50,
            height: 50,
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
          width: 50,
          height: 50,
          marginTop: 5,
        }}
      >
        ⬇
      </button>
    </div>
  );
}