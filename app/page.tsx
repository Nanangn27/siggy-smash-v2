"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [playing, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      setPlaying(false);
    }
  }, [timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setPlaying(true);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <p
          style={{
            color: "#00E5FF",
            letterSpacing: "4px",
            marginBottom: "20px",
          }}
        >
          RITUAL TESTNET
        </p>

        <h1
          style={{
            color: "#FF66CC",
            fontSize: "64px",
            lineHeight: "0.9",
            marginBottom: "24px",
          }}
        >
          SIGGY
          <br />
          SMASH
        </h1>

        <p
          style={{
            color: "#d1d1d1",
            marginBottom: "30px",
            fontSize: "18px",
          }}
        >
          Cute arcade chaos on the Ritual chain.
          <br />
          Bomb. Smash. Survive.
        </p>

        <button
          onClick={() => setConnected(!connected)}
          style={{
            background: "#D946EF",
            border: "none",
            color: "white",
            padding: "16px 40px",
            borderRadius: "16px",
            fontWeight: "bold",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          {connected ? "CONNECTED" : "CONNECT WALLET"}
        </button>

        {connected && (
          <>
            <div
              style={{
                marginTop: "30px",
                color: "white",
                fontSize: "20px",
              }}
            >
              Score: {score}
            </div>

            <div
              style={{
                color: "#00E5FF",
                marginTop: "10px",
              }}
            >
              Time: {timeLeft}s
            </div>

            <button
              onClick={startGame}
              style={{
                marginTop: "20px",
                background: "#00E5FF",
                border: "none",
                color: "#111",
                padding: "12px 30px",
                borderRadius: "12px",
                fontWeight: "bold",
              }}
            >
              START GAME
            </button>

            {playing && (
              <div
                onClick={() => setScore(score + 1)}
                style={{
                  margin: "30px auto",
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: "#FF66CC",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "24px",
                }}
              >
                💣
              </div>
            )}
          </>
        )}

        <div
          style={{
            marginTop: "30px",
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