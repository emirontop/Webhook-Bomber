import { useState } from "react";

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

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "40px auto",
        padding: 20,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#1e1e1e",
        borderRadius: 12,
        color: "#eee",
        boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 30, color: "#ff9900" }}>
        🚀 Webhook Bomber
      </h1>

      <label>Webhook URL</label>
      <input
        type="text"
        placeholder="Webhook URL girin"
        value={webhook}
        onChange={(e) => setWebhook(e.target.value)}
        disabled={isSending}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          border: "none",
          marginBottom: 15,
          fontSize: 16,
          backgroundColor: "#333",
          color: "#eee",
        }}
      />

      <label>Mesajınız</label>
      <textarea
        placeholder="Göndermek istediğiniz mesajı yazın"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        disabled={isSending}
        rows={4}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          border: "none",
          marginBottom: 15,
          fontSize: 16,
          backgroundColor: "#333",
          color: "#eee",
          resize: "vertical",
        }}
      />

      <label>Mesaj sayısı</label>
      <input
        type="number"
        min={1}
        max={100}
        value={count}
        onChange={(e) => setCount(parseInt(e.target.value) || 1)}
        disabled={isSending}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          border: "none",
          marginBottom: 15,
          fontSize: 16,
          backgroundColor: "#333",
          color: "#eee",
        }}
      />

      <label style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
        <input
          type="checkbox"
          checked={everyone}
          onChange={(e) => setEveryone(e.target.checked)}
          disabled={isSending}
          style={{ marginRight: 10 }}
        />
        @everyone etiketi kullan
      </label>

      <button
        onClick={startSpam}
        disabled={isSending}
        style={{
          width: "100%",
          padding: 14,
          backgroundColor: "#ff9900",
          color: "#000",
          fontWeight: "bold",
          fontSize: 18,
          border: "none",
          borderRadius: 8,
          cursor: isSending ? "not-allowed" : "pointer",
          boxShadow: isSending ? "none" : "0 4px 15px rgba(255,153,0,0.6)",
          transition: "background-color 0.3s",
        }}
        onMouseEnter={e => !isSending && (e.target.style.backgroundColor = "#e08800")}
        onMouseLeave={e => !isSending && (e.target.style.backgroundColor = "#ff9900")}
      >
        {isSending ? `Gönderiliyor... (${progress}/${count})` : "Başlat"}
      </button>

      {status && (
        <p
          style={{
            marginTop: 20,
            padding: 12,
            borderRadius: 8,
            backgroundColor: status.startsWith("❌") ? "#b30000" : "#006600",
            color: "#fff",
            fontWeight: "bold",
            textAlign: "center",
            userSelect: "text",
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
}