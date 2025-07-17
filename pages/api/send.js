export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  const { webhook, count, everyone } = req.body;
  if (!webhook || count < 1) {
    return res.status(400).json({ success: false, error: "Geçersiz parametre" });
  }

  const baseMessage = "this senden by Webhook bomber https://webhook-bomber.vercel.app/";
  let sent = 0;

  for (let i = 1; i <= count; i++) {
    const content = everyone
      ? `@everyone ${baseMessage}`
      : baseMessage;

    try {
      const resp = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        return res
          .status(500)
          .json({ success: false, error: err.message || resp.statusText });
      }

      sent++;
      // 1 saniye bekleyerek rate-limit riskini azalt
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  return res.status(200).json({ success: true, sent, requested: count });
}