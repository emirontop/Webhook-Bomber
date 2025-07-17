import { useState } from "react";

export default function Home() {
  const [webhook, setWebhook] = useState("");
  const [count, setCount] = useState(1);
  const [everyone, setEveryone] = useState(false);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);

  const handleSubmit = async () => {
    if (!webhook.trim()) return setStatus("❌ Lütfen webhook URL gir.");
    if (count < 1) return setStatus("❌ Mesaj adedi en az 1 olmalı.");

    setStatus("⏳ Gönderiliyor...");
    setProgress(0);

    const res = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ webhook, count, everyone })
    });
    const data = await res.json();

    if (data.success) {
      setStatus(`✅ Tamamlandı: ${data.sent}/${data.requested} mesaj.`);
    } else {
      setStatus(`❌ Hata: ${data.error}`);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20, fontFamily: "Arial" }}>
      <h1>Webhook Bomber</h1>
      <input
        type="text"
        placeholder="Webhook URL"
        value={webhook}
        onChange={e => setWebhook(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />
      <input
        type="number"
        min={1}
        placeholder="Mesaj adedi"
        value={count}
        onChange={e => setCount(parseInt(e.target.value, 10))}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />
      <label style={{ display: "block", marginBottom: 10 }}>
        <input
          type="checkbox"
          checked={everyone}
          onChange={e => setEveryone(e.target.checked)}
        />{" "}
        @everyone etiketle
      </label>
      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: 10,
          background: "#ff9900",
          color: "#000",
          fontWeight: "bold",
          border: "none",
          cursor: "pointer"
        }}
      >
        Başlat
      </button>
      {status && <p style={{ marginTop: 20 }}>{status}</p>}
    </div>
  );
}