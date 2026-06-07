"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  SIZE,
  DEFAULT_BLOCKS,
  isBlocked,
  randomEnemyMove,
  createBlast,
} from "./GameLogic";

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

  const [timeLeft, setTimeLeft] =
    useState(60);

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
      setEnemy((e) =>
        randomEnemyMove(e, blocks)
      );
    }, 700);

    return () =>
      clearInterval(ai);
  }, [gameOver, blocks]);

  useEffect(() => {
    const handleKey = (
      e: KeyboardEvent
    ) => {
      if (gameOver) return;

      if (
        e.key === "ArrowUp" ||
        e.key === "w"
      )
        move(0, -1);

      if (
        e.key === "ArrowDown" ||
        e.key === "s"
      )
        move(0, 1);

      if (
        e.key === "ArrowLeft" ||
        e.key === "a"
      )
        move(-1, 0);

      if (
        e.key === "ArrowRight" ||
        e.key === "d"
      )
        move(1, 0);

      if (e.key === " ")
        placeBomb();
    };

    window.addEventListener(
      "keydown",
      handleKey
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKey
      );
  });

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

    if (
      isBlocked(nx, ny, blocks)
    )
      return;

    setPlayer({
      x: nx,
      y: ny,
    });
  };

  const placeBomb = () => {
    if (gameOver) return;

    const bx = player.x;
    const by = player.y;

    const exists = bombs.some(
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

      const blast =
        createBlast(
          bx,
          by
        );

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

      if (playerHit) {
        setGameOver(true);
      }

      setBlocks((prev) => {
        const destroyed =
          prev.filter((b) =>
            blast.some(
              (e) =>
                e.x === b.x &&
                e.y === b.y
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
          (b) =>
            !blast.some(
              (e) =>
                e.x === b.x &&
                e.y === b.y
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
    setGameOver(false);

    setBombs([]);
    setExplosions([]);

    setBlocks(
      DEFAULT_BLOCKS
    );
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
            `repeat(${SIZE},1fr)`,
        }}
      >
        {Array.from({
          length:
            SIZE * SIZE,
        }).map((_, i) => {
          const x =
            i % SIZE;

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