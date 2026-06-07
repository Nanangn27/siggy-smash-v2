"use client";

import { useState } from "react";

export default function GameBoard() {
  const [stage] = useState(1);

  return (
    <div
      style={{
        width: 420,
        height: 420,
        background: "#160028",
        border: "4px solid #FF66CC",
        display: "grid",
        gridTemplateColumns:
          "repeat(9,1fr)",
      }}
    >
      {Array.from({
        length: 81,
      }).map((_, i) => (
        <div
          key={i}
          style={{
            border:
              "1px solid #26003f",
          }}
        />
      ))}
    </div>
  );
}
