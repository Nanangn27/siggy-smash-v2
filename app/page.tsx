"use client";

import GameBoard from "../components/GameBoard";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#090018",
      }}
    >
      <GameBoard />
    </main>
  );
}
