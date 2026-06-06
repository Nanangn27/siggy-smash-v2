"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const SIZE = 9;

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [playing, setPlaying] = useState(false);

  const [player, setPlayer] = useState({ x: 1, y: 1 });

  const [bombs, setBombs] = useState<
    { x: number; y: number }[]
  >([]);

  const [explosions, setExplosions] = useState<
    { x: number; y: number }[]
  >([]);

  const [blocks, setBlocks] = useState<
    { x: number; y: number }[]
  >([]);

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
    }
  }, [timeLeft]);

  const createMap = () => {
    const randomBlocks = [];

    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        if (
          Math.random() > 0.7 &&
          !(x <= 2 && y <= 2)
        ) {
          randomBlocks.push({ x, y });
        }
      }
    }

    setBlocks(randomBlocks);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setPlayer({ x: 1, y: 1 });
    setBombs([]);
    setExplosions([]);
    createMap();
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
                    length: SIZE * SIZE,
                  }).map((_, i) => {
                    const x = i % SIZE;
                    const y =
                      Math.floor(
                        i / SIZE
                      );

                    const isPlayer =
                      player.x === x &&
                      player.y === y;

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

                <div>
                  <button
                    onClick={() =>
                      movePlayer(0, -1)
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
                      movePlayer(0, 1)
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
