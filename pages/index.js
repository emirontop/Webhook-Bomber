import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [webhook, setWebhook] = useState("");
  const [mesaj, setMesaj] = useState("");
  const [adet, setAdet] = useState(1);
  const [everyone, setEveryone] = useState(false);
  const [status, setStatus] = useState("");

  const gonder = async () => {
    if (!webhook || !mesaj || adet < 1) {
      setStatus("Lütfen tüm alanları doldur.");
      return;
    }

    setStatus("Gönderiliyor...");
    const res = await axios.post("/api/send", {
      webhook,
      mesaj,
      adet,
      everyone
    });

    if (res.data.success) {
      setStatus("Başarıyla gönderildi!");
    } else {
      setStatus("Bir hata oluştu: " + res.data.error);
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>Webhook Bomber</h1>
      <input
        placeholder="Webhook URL"
        value={webhook}
        onChange={(e) => setWebhook(e.target.value)}
        style={{ display: "block", marginBottom: 10, width: "300px" }}
      />
      <textarea
        placeholder="Mesaj"
        value={mesaj}
        onChange={(e) => setMesaj(e.target.value)}
        style={{ display: "block", marginBottom: 10, width: "300px", height: "100px" }}
      />
      <input
        type="number"
        placeholder="Mesaj Adedi"
        value={adet}
        onChange={(e) => setAdet(parseInt(e.target.value))}
        style={{ display: "block", marginBottom: 10, width: "300px" }}
      />
      <label style={{ marginBottom: 10 }}>
        <input
          type="checkbox"
          checked={everyone}
          onChange={(e) => setEveryone(e.target.checked)}
        />{" "}
        Herkesi (@everyone) etiketle
      </label>
      <br />
      <button onClick={gonder} style={{ marginTop: 20, padding: "10px 20px" }}>
        Gönder
      </button>
      <p style={{ marginTop: 20 }}>{status}</p>
    </div>
  );
  }
