export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method Not Allowed" });

  const { webhook, mesaj, adet, everyone } = req.body;

  if (!webhook || !mesaj || adet < 1) {
    return res.status(400).json({ success: false, error: "Eksik veri" });
  }

  const finalMessage = `${mesaj}\nThis sended by Webhook Bomber → https://webhook-bomber.vercel.app/`;

  const payload = {
    content: everyone ? `@everyone ${finalMessage}` : finalMessage
  };

  let success = 0;
  for (let i = 0; i < adet; i++) {
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const hata = await response.text();
        return res.status(500).json({ success: false, error: "Mesaj gönderilemedi: " + hata });
      }

      success++;
    } catch (err) {
      return res.status(500).json({ success: false, error: "Gönderme başarısız." });
    }
  }

  return res.status(200).json({ success: true, sent: success });
}
