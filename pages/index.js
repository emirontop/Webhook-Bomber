import { useState, useEffect } from "react";

export default function Home() {
  const [webhook, setWebhook] = useState("");
  const [count, setCount] = useState(1);
  const [everyone, setEveryone] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState(0);

  const baseSuffix = " this senden by Webhook bomber https://webhook-bomber.vercel.app/";

  async function startSpam() {
    if (!webhook.trim()) {
      setStatus("❌ Lütfen geçerli webhook URL girin!");
      return;
    }
    if (count < 1) {
      setStatus("❌ Mesaj adedi en az 1 olmalı!");
      return;
    }
    if (!userMessage.trim()) {
      setStatus("❌ Lütfen mesajınızı yazın!");
      return;
    }

    setIsSending(true);
    setStatus("⏳ Gönderiliyor...");
    setProgress(0);

    let sent = 0;

    for (let i = 1; i <= count; i++) {
      const content = (everyone ? "@everyone " : "") + userMessage.trim() + baseSuffix;
      try {
        const res = await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setStatus(`❌ Hata: ${err.message || res.statusText}`);
          setIsSending(false);
          return;
        }
        sent++;
        setProgress(sent);
      } catch (e) {
        setStatus(`❌ Hata: ${e.message}`);
        setIsSending(false);
        return;
      }
      await new Promise((r) => setTimeout(r, 1000));
    }

    setStatus(`✅ Gönderim tamamlandı! Toplam ${sent} mesaj gönderildi.`);
    setIsSending(false);
  }

  // Basit progress bar component
  const ProgressBar = ({ progress, max }) => {
    const percentage = (progress / max) * 100;
    return (
      <div style={{ width: "100%", height: 16, background: "#333", borderRadius: 8, overflow: "hidden", marginTop: 10 }}>
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: "#ff9900",
            transition: "width 0.3s ease-in-out",
            boxShadow: "0 0 10px #ff9900",
          }}
        />
      </div>
    );
  };

  return (
    <div
      style={{
        maxWidth: 520,
        margin: "40px auto",
        padding: 24,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#121212",
        borderRadius: 16,
        color: "#eee",
        boxShadow: "0 8px 30px rgba(255,153,0,0.3)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: 30,
          color: "#ff9900",
          fontWeight: "900",
          letterSpacing: 2,
          userSelect: "none",
          textShadow: "0 0 10px #ff9900",
        }}
      >
        🚀 Webhook Bomber
      </h1>

      <label style={{ fontWeight: "600", fontSize: 14, opacity: 0.7 }}>
        Webhook URL
        <input
          type="text"
          placeholder="Webhook URL girin"
          value={webhook}
          onChange={(e) => setWebhook(e.target.value)}
          disabled={isSending}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            border: "none",
            marginTop: 6,
            marginBottom: 20,
            fontSize: 16,
            backgroundColor: "#222",
            color: "#eee",
            boxShadow: "inset 0 0 8px #444",
            transition: "background-color 0.3s",
          }}
        />
      </label>

      <label style={{ fontWeight: "600", fontSize: 14, opacity: 0.7 }}>
        Mesajınız
        <textarea
          placeholder="Göndermek istediğiniz mesajı yazın"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          disabled={isSending}
          rows={5}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            border: "none",
            marginTop: 6,
            marginBottom: 20,
            fontSize: 16,
            backgroundColor: "#222",
            color: "#eee",
            boxShadow: "inset 0 0 8px #444",
            resize: "vertical",
            transition: "background-color 0.3s",
          }}
        />
      </label>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          fontWeight: "600",
          fontSize: 14,
          marginBottom: 20,
          userSelect: "none",
          opacity: isSending ? 0.6 : 1,
          cursor: isSending ? "not-allowed" : "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={everyone}
          onChange={(e) => setEveryone(e.target.checked)}
          disabled={isSending}
          style={{ marginRight: 12, width: 18, height: 18, cursor: "pointer" }}
        />
        @everyone etiketi kullan
      </label>

      <label style={{ fontWeight: "600", fontSize: 14, opacity: 0.7 }}>
        Mesaj sayısı
        <input
          type="number"
          min={1}
          max={100}
          value={count}
          onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
          disabled={isSending}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            border: "none",
            marginTop: 6,
            marginBottom: 30,
            fontSize: 16,
            backgroundColor: "#222",
            color: "#eee",
            boxShadow: "inset 0 0 8px #444",
            transition: "background-color 0.3s",
          }}
        />
      </label>

      <button
        onClick={startSpam}
        disabled={isSending}
        style={{
          width: "100%",
          padding: 16,
          backgroundColor: "#ff9900",
          color: "#000",
          fontWeight: "900",
          fontSize: 18,
          border: "none",
          borderRadius: 14,
          cursor: isSending ? "not-allowed" : "pointer",
          boxShadow: isSending ? "none" : "0 6px 20px rgba(255,153,0,0.7)",
          transition: "background-color 0.3s",
          userSelect: "none",
        }}
        onMouseEnter={(e) => !isSending && (e.target.style.backgroundColor = "#e08800")}
        onMouseLeave={(e) => !isSending && (e.target.style.backgroundColor = "#ff9900")}
      >
        {isSending ? `Gönderiliyor... (${progress}/${count})` : "Başlat"}
      </button>

      {isSending && <ProgressBar progress={progress} max={count} />}

      {status && (
        <p
          style={{
            marginTop: 20,
            padding: 14,
            borderRadius: 12,
            backgroundColor: status.startsWith("❌") ? "#b30000" : "#006600",
            color: "#fff",
            fontWeight: "700",
            textAlign: "center",
            userSelect: "text",
            boxShadow: "0 0 12px rgba(0,0,0,0.4)",
            lineHeight: 1.4,
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
}

function ProgressBar({ progress, max }) {
  const percentage = (progress / max) * 100;
  return (
    <div
      style={{
        width: "100%",
        height: 18,
        background: "#333",
        borderRadius: 12,
        overflow: "hidden",
        marginTop: 16,
        boxShadow: "inset 0 0 8px #444",
      }}
    >
      <div
        style={{
          width: `${percentage}%`,
          height: "100%",
          background: "#ff9900",
          boxShadow: "0 0 12px #ff9900",
          transition: "width 0.3s ease-in-out",
        }}
      />
    </div>
  );
}