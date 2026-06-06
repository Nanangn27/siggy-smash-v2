export default function Home() {
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
            marginBottom: "40px",
            fontSize: "18px",
          }}
        >
          Cute arcade chaos on the Ritual chain.
          <br />
          Bomb. Smash. Survive.
        </p>

        <button
          style={{
            background: "#D946EF",
            border: "none",
            color: "white",
            padding: "16px 40px",
            borderRadius: "16px",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          CONNECT WALLET
        </button>

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
