"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  SIZE,
  Position,
  createBlast,
  generateBlocks,
  generateWalls,
  chasePlayerMove,
} from "./GameLogic";

export default function GameBoard() {
  const [player, setPlayer] =
    useState<Position>({
      x: 1,
      y: 1,
    });

  const [enemy, setEnemy] =
    useState<Position>({
      x: 8,
      y: 8,
    });

  const [score, setScore] =
    useState(0);

const [lives, setLives] =
  useState(3);

const [highScore, setHighScore] =
  useState(0);

const [coins, setCoins] =
  useState<Position[]>([
    { x: 2, y: 2 },
    { x: 6, y: 2 },
    { x: 4, y: 7 },
  ]);
  
  const [timeLeft, setTimeLeft] =
    useState(60);

  const [gameOver, setGameOver] =
    useState(false);

  const [victory, setVictory] =
    useState(false);

  const [bombs, setBombs] =
    useState<Position[]>([]);

  const [explosions, setExplosions] =
    useState<Position[]>([]);

  const [blocks, setBlocks] =
    useState<Position[]>(
      generateBlocks()
    );

  const [walls] = useState<
    Position[]
  >(generateWalls());

const [lives, setLives] =
  useState(3);

const [highScore, setHighScore] =
  useState(0);

const [coins, setCoins] =
  useState<Position[]>([
    { x: 2, y: 2 },
    { x: 6, y: 2 },
    { x: 4, y: 7 },
  ]);
  useEffect(() => {
    if (gameOver || victory)
      return;

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
  }, [gameOver, victory]);

  useEffect(() => {
    if (gameOver || victory)
      return;

    const ai = setInterval(() => {
      setEnemy((e) =>
        chasePlayerMove(
          e,
          player,
          [...blocks, ...walls]
        )
      );
    }, 700);

    return () =>
      clearInterval(ai);
  }, [
    player,
    blocks,
    walls,
    gameOver,
    victory,
  ]);

  useEffect(() => {
  if (
    enemy.x === player.x &&
    enemy.y === player.y
  ) {
    if (lives > 1) {
      setLives((v) => v - 1);

      setPlayer({
        x: 1,
        y: 1,
      });
    } else {
      setGameOver(true);
    }
  }
}, [
  enemy,
  player,
  lives,
]);

useEffect(() => {
  setHighScore((h) =>
    Math.max(h, score)
  );
}, [score]);

useEffect(() => {
  const hitCoin = coins.find(
    (c) =>
      c.x === player.x &&
      c.y === player.y
  );

  if (!hitCoin) return;

  setCoins((prev) =>
    prev.filter(
      (c) =>
        !(
          c.x === hitCoin.x &&
          c.y === hitCoin.y
        )
    )
  );

  setScore((s) => s + 20);
}, [player, coins]);

useEffect(() => {
  if (score >= 100) {
    setVictory(true);
  }
}, [score]);
  const move = (
    dx: number,
    dy: number
  ) => {
    if (
      gameOver ||
      victory
    )
      return;

    const nx =
      player.x + dx;

    const ny =
      player.y + dy;

    if (
      nx < 0 ||
      nx >= SIZE ||
      ny < 0 ||
      ny >= SIZE
    )
      return;

    const blocked =
      [...blocks, ...walls].some(
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

  useEffect(() => {
    const handleKey = (
      e: KeyboardEvent
    ) => {
      if (
        gameOver ||
        victory
      )
        return;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          move(0, -1);
          break;

        case "ArrowDown":
        case "s":
        case "S":
          move(0, 1);
          break;

        case "ArrowLeft":
        case "a":
        case "A":
          move(-1, 0);
          break;

        case "ArrowRight":
        case "d":
        case "D":
          move(1, 0);
          break;

        case " ":
          placeBomb();
          break;
      }
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

  const placeBomb = () => {
    const bx =
      player.x;

    const by =
      player.y;

    const exists =
      bombs.some(
        (b) =>
          b.x === bx &&
          b.y === by
      );

    if (exists) return;

    setBombs((prev) => [
      ...prev,
      { x: bx, y: by },
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

      const playerHit =
        blast.some(
          (e) =>
            e.x === player.x &&
            e.y === player.y
        );

      if (playerHit) {
        setGameOver(true);
      }

      const enemyHit =
        blast.some(
          (e) =>
            e.x === enemy.x &&
            e.y === enemy.y
        );

      if (enemyHit) {
        setVictory(true);
        setScore(
          (s) => s + 100
        );
      }

      setBlocks((prev) => {
        const destroyed =
          prev.filter(
            (block) =>
              blast.some(
                (e) =>
                  e.x ===
                    block.x &&
                  e.y ===
                    block.y
              )
          ).length;

        if (destroyed) {
          setScore(
            (s) =>
              s +
              destroyed *
                10
          );
        }

        return prev.filter(
          (block) =>
            !blast.some(
              (e) =>
                e.x ===
                  block.x &&
                e.y ===
                  block.y
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
      x: 8,
      y: 8,
    });

    setScore(0);

    setTimeLeft(60);

    setGameOver(false);

    setVictory(false);

    setBombs([]);

    setExplosions([]);

    setBlocks(
      generateBlocks()
    );
  };

  return (
    <div
      style={{
        textAlign:
          "center",
      }}
    >
      <h2
  style={{
    color: "white",
    marginBottom: 8,
  }}
>
  Score: {score}
</h2>

<div
  style={{
    color: "#FFD700",
    fontWeight: "bold",
    marginBottom: 4,
  }}
>
  ❤️ Lives: {lives}
</div>

<div
  style={{
    color: "#00FF99",
    marginBottom: 4,
  }}
>
  ⭐ High Score: {highScore}
</div>

<div
  style={{
    color: "#00E5FF",
  }}
>
  ⏱ Time: {timeLeft}s
</div>

      <div
        style={{
          color:
            "#00E5FF",
        }}
      >
        Time: {timeLeft}s
      </div>

      {gameOver && (
        <h1
          style={{
            color:
              "#FF66CC",
          }}
        >
          GAME OVER
        </h1>
      )}

      {victory && (
        <h1
          style={{
            color:
              "#00ff99",
          }}
        >
          VICTORY
        </h1>
      )}

      {(gameOver ||
        victory) && (
        <button
          onClick={
            restart
          }
        >
          RESTART
        </button>
      )}

      <div
        style={{
          width:
            "min(90vw,520px)",
          aspectRatio:
            "1",
          margin:
            "20px auto",
          background:
            "#160028",
          border:
            "4px solid #FF66CC",
          display:
            "grid",
          gridTemplateColumns:
            "repeat(9,1fr)",
        }}
      >
        {Array.from({
          length:
            SIZE *
            SIZE,
        }).map(
          (_, i) => {
            const x =
              i %
              SIZE;

            const y =
              Math.floor(
                i /
                  SIZE
              );

            const isPlayer =
              player.x ===
                x &&
              player.y ===
                y;

            const isEnemy =
              enemy.x ===
                x &&
              enemy.y ===
                y;

            const isBomb =
              bombs.some(
                (b) =>
                  b.x ===
                    x &&
                  b.y ===
                    y
              );

            const isExplosion =
              explosions.some(
                (e) =>
                  e.x ===
                    x &&
                  e.y ===
                    y
              );

            const isBlock =
              blocks.some(
                (b) =>
                  b.x ===
                    x &&
                  b.y ===
                    y
              );

            const isWall =
              walls.some(
                (w) =>
                  w.x ===
                    x &&
                  w.y ===
                    y
              );
const isCoin =
  coins.some(
    (c) =>
      c.x === x &&
      c.y === y
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
                      : isWall
                      ? "#555"
                      : isBlock
                      ? "#7b4f2f"
                      : "#1d0035",
                }}
              >
                {isPlayer && (
                  <Image
                    src="/siggy-player.png"
                    alt="Siggy"
                    width={
                      28
                    }
                    height={
                      28
                    }
                  />
                )}

                {isEnemy &&
                  !isPlayer &&
                  "👾"}
{isCoin &&
 !isPlayer &&
 !isEnemy &&
 "💎"}
                {isBomb &&
                  !isPlayer &&
                  "💣"}

                {isExplosion &&
                  "💥"}
              </div>
            );
          }
        )}
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
            move(
              -1,
              0
            )
          }
        >
          ⬅
        </button>

        <button
          onClick={
            placeBomb
          }
        >
          💣
        </button>

        <button
          onClick={() =>
            move(
              1,
              0
            )
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