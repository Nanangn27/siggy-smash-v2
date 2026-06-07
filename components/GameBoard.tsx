"use client";

import { useState } from "react";
import Image from "next/image";

const SIZE = 9;

export default function GameBoard() {
  const [player, setPlayer] = useState({
    x: 1,
    y: 1,
  });

  const move = (
    dx: number,
    dy: number
  ) => {
    setPlayer((p) => ({
      x: Math.max(
        0,
        Math.min(
          SIZE - 1,
          p.x + dx
        )
      ),
      y: Math.max(
        0,
        Math.min(
          SIZE - 1,
          p.y + dy
        )
      ),
    }));
  };

  return (
    <div
      style={{
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 420,
          height: 420,
          background: "#160028",
          border: "4px solid #FF66CC",
          display: "grid",
          gridTemplateColumns:
            "repeat(9,1fr)",
          marginBottom: 20,
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
            </div>
          );
        })}
      </div>

      <button
        onClick={() =>
          move(0, -1)
        }
      >
        ⬆
      </button>

      <div>
        <button
          onClick={() =>
            move(-1, 0)
          }
        >
          ⬅
        </button>

        <button>
          💣
        </button>

        <button
          onClick={() =>
            move(1, 0)
          }
        >
          ➡
        </button>
      </div>

      <button
        onClick={() =>
          move(0, 1)
        }
      >
        ⬇
      </button>
    </div>
  );
}