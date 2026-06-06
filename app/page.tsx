export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #0b0820, #120d35, #1b144d)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <p
        style={{
          color: "#00e5ff",
          letterSpacing: "3px",
          fontSize: "14px",
        }}
      >
        RITUAL TESTNET
      </p>

      <h1
        style={{
          color: "#ff69c8",
          fontSize: "48px",
          margin: "10px 0",
        }}
      >
        SIGGY SMASH
      </h1>

      <p
        style={{
          maxWidth: "400px",
          opacity: 0.8,
        }}
      >
        Cute arcade chaos on the Ritual chain.
        Bomb. Smash. Survive.
      </p>

      <button
        style={{
          marginTop: "30px",
          background: "#d946ef",
          color: "white",
          padding: "15px 40px",
          borderRadius: "12px",
          border: "none",
          fontWeight: "bold",
        }}
      >
        CONNECT WALLET
      </button>

      <p
        style={{
          marginTop: "20px",
          fontSize: "12px",
          opacity: 0.6,
        }}
      >
        Built by NG
      </p>
    </main>
  );
}
