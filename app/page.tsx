"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const SIZE = 9;

type Pos = {
  x: number;
  y: number;
};

type Enemy = {
  id: number;
  x: number;
  y: number;
};

export default function Home() {
  const [connected, setConnected] = useState(false);

  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const [timeLeft, setTimeLeft] = useState(60);
  const [playing, setPlaying] = useState(false);

  const [player, setPlayer] = useState<Pos>({
    x: 1,
    y: 1,
  });

  const [bombs, setBombs] = useState<Pos[]>([]);
  const [explosions, setExplosions] = useState<Pos[]>([]);
  const [blocks, setBlocks] = useState<Pos[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);

  useEffect(() => {
    const saved =
      localStorage.getItem("siggy-best");

    if (saved) {
      setBestScore(Number(saved));
    }
  }, []);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);

      localStorage.setItem(
        "siggy-best",
        String(score)
      );
    }
  }, [score, bestScore]);

  useEffect(() => {
    if (!playing) return;

    const timer = setInterval(() => {
      setTimeLeft((v) => v - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [playing]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setPlaying(false);
      alert("⏰ TIME UP");
    }
  }, [timeLeft]);

  useEffect(() => {
    if (!playing) return;

    const moveEnemy = setInterval(() => {
      setEnemies((prev) =>
        prev.map((enemy) => {
          const dirs = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ];

          const move =
            dirs[
              Math.floor(
                Math.random() * dirs.length
              )
            ];

          const nx =
            enemy.x + Number(move[0]);

          const ny =
            enemy.y + Number(move[1]);

          if (
            nx < 0 ||
            nx >= SIZE ||
            ny < 0 ||
            ny >= SIZE
          ) {
            return enemy;
          }

          const blocked = blocks.some(
            (b) =>
              b.x === nx &&
              b.y === ny
          );

          if (blocked) return enemy;

          return {
            ...enemy,
            x: nx,
            y: ny,
          };
        })
      );
    }, 1000);

    return () => clearInterval(moveEnemy);
  }, [playing, blocks]);

  useEffect(() => {
    const dead = enemies.some(
      (enemy) =>
        enemy.x === player.x &&
        enemy.y === player.y
    );

    if (dead && playing) {
      setPlaying(false);
      alert("👾 ENEMY GOT YOU");
    }
  }, [enemies, player, playing]);

  useEffect(() => {
    if (
      playing &&
      enemies.length === 0 &&
      blocks.length === 0
    ) {
      setPlaying(false);
      alert("🏆 YOU WIN");
    }
  }, [playing, enemies, blocks]);

  const createMap = () => {
    const randomBlocks: Pos[] = [];

    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        if (
          Math.random() > 0.7 &&
          !(x <= 2 && y <= 2)
        ) {
          randomBlocks.push({
            x,
            y,
          });
        }
      }
    }

    setBlocks(randomBlocks);
  };

  const startGame = () => {
    setScore(0);

    setTimeLeft(60);

    setPlayer({
      x: 1,
      y: 1,
    });

    setBombs([]);
    setExplosions([]);

    createMap();

    setEnemies([
      {
        id: 1,
        x: 7,
        y: 7,
      },
      {
        id: 2,
        x: 7,
        y: 1,
      },
    ]);

    setPlaying(true);
  };

  const movePlayer = (
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
      (b) =>
        b.x === nx &&
        b.y === ny
    );

    if (blocked) return;

    const bombBlocked = bombs.some(
      (b) =>
        b.x === nx &&
        b.y === ny
    );

    if (bombBlocked) return;

    setPlayer({
      x: nx,
      y: ny,
    });
  };

  const placeBomb = () => {
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

      const blast = [
        {
          x: bx,
          y: by,
        },
        {
          x: bx + 1,
          y: by,
        },
        {
          x: bx - 1,
          y: by,
        },
        {
          x: bx,
          y: by + 1,
        },
        {
          x: bx,
          y: by - 1,
        },
      ];

      setExplosions(blast);

      setEnemies((prev) =>
        prev.filter(
          (enemy) =>
            !blast.some(
              (e) =>
                e.x === enemy.x &&
                e.y === enemy.y
            )
        )
      );

      const hitPlayer =
        blast.some(
          (e) =>
            e.x === player.x &&
            e.y === player.y
        );

      if (hitPlayer) {
        setPlaying(false);
        alert("💀 SIGGY GOT SMASHED");
      }

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

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#00E5FF",
            letterSpacing: "4px",
          }}
        >
          RITUAL TESTNET
        </p>

        <h1
          style={{
            color: "#FF66CC",
            fontSize: "64px",
            lineHeight: "0.9",
          }}
        >
          SIGGY
          <br />
          SMASH
        </h1>

        <button
          onClick={() =>
            setConnected(!connected)
          }
          style={{
            background: "#D946EF",
            color: "white",
            border: "none",
            padding: "16px 40px",
            borderRadius: 16,
            fontWeight: "bold",
          }}
        >
          {connected
            ? "CONNECTED"
            : "CONNECT WALLET"}
        </button>

        {connected && (
          <>
            <div
              style={{
                color: "white",
                marginTop: 20,
              }}
            >
              Score: {score}
            </div>

            <div
              style={{
                color: "#FFD700",
              }}
            >
              Best: {bestScore}
            </div>

            <div
              style={{
                color: "#00E5FF",
              }}
            >
              Time: {timeLeft}s
            </div>

            <button
              onClick={startGame}
              style={{
                marginTop: 15,
                background: "#00E5FF",
                border: "none",
                padding: "12px 30px",
                borderRadius: 12,
                fontWeight: "bold",
              }}
            >
              START GAME
            </button>

            {playing && (
              <>
                <div
                  style={{
                    width: 360,
                    height: 360,
                    margin: "20px auto",
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(9,1fr)",
                    background:
                      "#160028",
                    border:
                      "3px solid #FF66CC",
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
                      player.x ===
                        x &&
                      player.y ===
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

                    const isEnemy =
                      enemies.some(
                        (
                          enemy
                        ) =>
                          enemy.x ===
                            x &&
                          enemy.y ===
                            y
                      );

                    return (
                      <div
                        key={i}
                        style={{
                          border:
                            "1px solid #26003f",
                          display:
                            "flex",
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
                            width={40}
                            height={40}
                          />
                        )}

                        {isBomb &&
                          !isPlayer &&
                          "💣"}

                        {isExplosion &&
                          "💥"}

                        {isEnemy &&
                          !isExplosion &&
                          "👾"}
                      </div>
                    );
                  })}
                </div>

                <div>
                  <button
                    onClick={() =>
                      movePlayer(
                        0,
                        -1
                      )
                    }
                  >
                    ⬆
                  </button>

                  <div>
                    <button
                      onClick={() =>
                        movePlayer(
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
                        movePlayer(
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
                      movePlayer(
                        0,
                        1
                      )
                    }
                  >
                    ⬇
                  </button>
                </div>
              </>
            )}
          </>
        )}

        <div
          style={{
            marginTop: 30,
            color: "#aaa",
          }}
        >
          Built by{" "}
          <a
            href="https://x.com/Nanangn27"
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#FF66CC",
            }}
          >
            NG
          </a>
        </div>
      </div>
    </main>
  );
}