import { useState } from "react";

export default function Home() {
  const [webhook, setWebhook] = useState("");
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(1);
  const [delay, setDelay] = useState(1000);
  const [everyone, setEveryone] = useState(false);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const baseSuffix = " this senden by Webhook bomber https://webhook-bomber.vercel.app/";

  const handleSend = async () => {
    if (!webhook.trim() || !message.trim() || count < 1) {
      setStatus("❌ Lütfen tüm alanları doğru doldurun!");
      return;
    }

    setIsSending(true);
    setStatus("⏳ Gönderim başlatıldı...");
    setProgress(0);

    let sent = 0;
    for (let i = 0; i < count; i++) {
      const fullMessage = `${everyone ? "@everyone " : ""}${message.trim()}${baseSuffix}`;
      try {
        const res = await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: fullMessage }),
        });

        if (!res.ok) {
          setStatus(`❌ Hata oluştu: ${res.statusText}`);
          break;
        }
        sent++;
        setProgress(sent);
      } catch (e) {
        setStatus(`❌ Hata oluştu: ${e.message}`);
        break;
      }
      await new Promise((r) => setTimeout(r, delay));
    }

    setIsSending(false);
    setStatus(`✅ Gönderildi: ${sent} / ${count}`);
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        padding: 20,
        fontFamily: "Arial, sans-serif",
        color: "#eee",
        backgroundColor: "#121212",
        borderRadius: 12,
        boxShadow: "0 4px 15px rgba(0,0,0,0.6)",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#ff9900" }}>🚀 Webhook Bomber</h1>

      <label>Webhook URL</label>
      <input
        value={webhook}
        onChange={(e) => setWebhook(e.target.value)}
        placeholder="Webhook URL"
        disabled={isSending}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 12,
          borderRadius: 8,
          backgroundColor: "#222",
          color: "#eee",
          border: "none",
        }}
      />

      <label>Mesajınız</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Mesaj yazın"
        rows={4}
        disabled={isSending}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 12,
          borderRadius: 8,
          backgroundColor: "#222",
          color: "#eee",
          border: "none",
          resize: "vertical",
        }}
      />

      <label>Mesaj Sayısı</label>
      <input
        type="number"
        value={count}
        min={1}
        onChange={(e) => setCount(parseInt(e.target.value) || 1)}
        disabled={isSending}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 12,
          borderRadius: 8,
          backgroundColor: "#222",
          color: "#eee",
          border: "none",
        }}
      />

      <label>Bekleme Süresi (ms)</label>
      <input
        type="number"
        value={delay}
        min={100}
        onChange={(e) => setDelay(parseInt(e.target.value) || 1000)}
        disabled={isSending}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 12,
          borderRadius: 8,
          backgroundColor: "#222",
          color: "#eee",
          border: "none",
        }}
      />

      <label style={{ display: "block", marginBottom: 12 }}>
        <input
          type="checkbox"
          checked={everyone}
          onChange={(e) => setEveryone(e.target.checked)}
          disabled={isSending}
          style={{ marginRight: 8 }}
        />
        @everyone etiketle
      </label>

      <button
        onClick={handleSend}
        disabled={isSending}
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 8,
          border: "none",
          backgroundColor: "#ff9900",
          color: "#000",
          fontWeight: "bold",
          cursor: isSending ? "not-allowed" : "pointer",
        }}
      >
        {isSending ? `Gönderiliyor... ${progress}/${count}` : "Başlat"}
      </button>

      {status && (
        <p
          style={{
            marginTop: 20,
            textAlign: "center",
            fontWeight: "bold",
            color: status.startsWith("❌") ? "#ff4c4c" : "#4caf50",
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
}