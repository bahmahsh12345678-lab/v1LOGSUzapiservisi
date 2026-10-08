/**
 * Logsuzlar Service - Vercel API + Telegram Bot (Webhook)
 * Tüm API'ler butonlu, admin panel yok
 */

const API_MAP = {
  tc: { name: "TC Sorgu", icon: "🆔", url: "https://punisherservis.alwaysdata.net/apiservices/tc.php", params: ["tc"], demo: { tc: "11111111110" } },
  tcpro: { name: "TC Pro", icon: "⭐", url: "https://punisherservis.alwaysdata.net/apiservices/tcpro.php", params: ["tc"], demo: { tc: "11111111110" } },
  adsoyad: { name: "Ad Soyad", icon: "👤", url: "https://punisherservis.alwaysdata.net/apiservices/adsoyad.php", params: ["ad", "soyad"], demo: { ad: "roket", soyad: "atar" } },
  adsoyadpro: { name: "Ad Soyad Pro", icon: "⭐", url: "https://punisherservis.alwaysdata.net/apiservices/adsoyadpro.php", params: ["ad", "soyad"], demo: { ad: "roket", soyad: "atar" } },
  aile: { name: "Aile", icon: "👪", url: "https://punisherservis.alwaysdata.net/apiservices/aile.php", params: ["tc"], demo: { tc: "11111111110" } },
  ailepro: { name: "Aile Pro", icon: "⭐", url: "https://punisherservis.alwaysdata.net/apiservices/ailepro.php", params: ["tc"], demo: { tc: "11111111110" } },
  cocuk: { name: "Çocuk", icon: "👶", url: "https://punisherservis.alwaysdata.net/apiservices/cocuk.php", params: ["tc"], demo: { tc: "11111111110" } },
  es: { name: "Eş", icon: "💑", url: "https://punisherservis.alwaysdata.net/apiservices/es.php", params: ["tc"], demo: { tc: "11111111110" } },
  kardes: { name: "Kardeş", icon: "👬", url: "https://punisherservis.alwaysdata.net/apiservices/kardes.php", params: ["tc"], demo: { tc: "11111111110" } },
  dogumtililce: { name: "Doğum Tarih İl İlçe", icon: "📅", url: "https://punisherservis.alwaysdata.net/apiservices/dogumtililce.php", params: ["dogumt", "il", "ilce"], demo: { dogumt: "17.03.1998", il: "istanbul", ilce: "buyukcekmece" } },
  soyaddogumt: { name: "Soyad Doğum", icon: "📅", url: "https://punisherservis.alwaysdata.net/apiservices/soyaddogumt.php", params: ["soyad", "dogumt"], demo: { soyad: "deniz", dogumt: "17.03.1998" } },
  adres: { name: "Adres", icon: "🏠", url: "https://punisherservis.alwaysdata.net/apiservices/adres.php", params: ["tc"], demo: { tc: "11111111110" } },
  sulale: { name: "Sülale", icon: "🌳", url: "https://punisherservis.alwaysdata.net/apiservices/sulale.php", params: ["tc"], demo: { tc: "11111111110" } },
  sulalepro: { name: "Sülale Pro", icon: "⭐", url: "https://punisherservis.alwaysdata.net/apiservices/sulalepro.php", params: ["tc"], demo: { tc: "11111111110" } },
  isyeri: { name: "İş Yeri", icon: "🏢", url: "https://punisherservis.alwaysdata.net/apiservices/isyeri.php", params: ["tc"], demo: { tc: "11144576054" } },
  tapu: { name: "Tapu", icon: "📝", url: "https://punisherservis.alwaysdata.net/apiservices/tapu.php", params: ["tc"], demo: { tc: "27727166918" } },
  iban: { name: "IBAN", icon: "💳", url: "https://punisherservis.alwaysdata.net/apiservices/iban.php", params: ["iban"], demo: { iban: "TR280006256953335759003718" } },
  gncloperator: { name: "Operatör", icon: "📡", url: "https://punisherservis.alwaysdata.net/apiservices/gncloperator.php", params: ["numara"], demo: { numara: "5315312472" } },
  tcgsm: { name: "TC → GSM", icon: "📞", url: "https://punisherservis.alwaysdata.net/apiservices/tcgsm.php", params: ["tc"], demo: { tc: "11111111110" } },
  gsmtc: { name: "GSM → TC", icon: "📱", url: "https://punisherservis.alwaysdata.net/apiservices/gsmtc.php", params: ["gsm"], demo: { gsm: "5415722525" } },
};

// ============================================
// BELLEK
// ============================================
const KEYS = global.__KEYS__ || (global.__KEYS__ = new Map());
const BOTS = global.__BOTS__ || (global.__BOTS__ = new Map());

// ============================================
// REKLAM TEMİZLE
// ============================================
function reklamTemizle(text) {
  if (typeof text !== "string") text = JSON.stringify(text);
  const satir = [
    /^\s*"developer"\s*:\s*"[^"]*"\s*,?\s*$/gim,
    /^\s*"version"\s*:\s*"[^"]*"\s*,?\s*$/gim,
    /^\s*"sürüm"\s*:\s*"[^"]*"\s*,?\s*$/gim,
    /^\s*"surum"\s*:\s*"[^"]*"\s*,?\s*$/gim,
    /^\s*"author"\s*:\s*"[^"]*"\s*,?\s*$/gim,
    /^\s*"yapimci"\s*:\s*"[^"]*"\s*,?\s*$/gim,
  ];
  for (const p of satir) text = text.replace(p, "");
  const metin = [
    /@SiberciAlemde/gi, /@sibercialemde/gi, /SiberciAlemde/gi, /sibercialemde/gi,
    /@jessy_php/gi, /jessy_php/gi, /jessy/gi,
    /auth=developer/gi, /auth=fire/gi, /developer/gi,
  ];
  for (const p of metin) text = text.replace(p, "");
  text = text.replace(/,\s*,/g, ",").replace(/,\s*([}\]])/g, "$1");
  text = text.replace(/[ \t]+/g, " ").replace(/\n{2,}/g, "\n");
  return text.trim();
}

// ============================================
// KEY
// ============================================
function keyGenerate() {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const r = (n) => Array.from({length:n}, () => c[Math.floor(Math.random()*c.length)]).join("");
  return `ZAMPO-${r(4)}-${r(4)}-${r(4)}`;
}
function keyCreate() {
  const k = keyGenerate();
  KEYS.set(k, { kullanim: 0 });
  return k;
}
function keyValid(k) { return k && KEYS.has(k); }

// ============================================
// TELEGRAM HELPERS
// ============================================
async function tgApi(token, method, data) {
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await r.json();
  } catch { return { ok: false }; }
}

async function tgSend(token, chatId, text, keyboard) {
  const body = { chat_id: chatId, text, parse_mode: "Markdown", disable_web_page_preview: true };
  if (keyboard) body.reply_markup = keyboard;
  return tgApi(token, "sendMessage", body);
}

async function tgGetMe(token) {
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const d = await r.json();
    return d.ok ? d.result : null;
  } catch { return null; }
}

// ============================================
// MENÜ — 20 API + 3 ALT BUTON
// ============================================
function botMenu() {
  const entries = Object.entries(API_MAP);
  const rows = [];
  
  for (let i = 0; i < entries.length; i += 2) {
    const row = [];
    for (let j = 0; j < 2 && i+j < entries.length; j++) {
      const [k, cfg] = entries[i+j];
      row.push({ text: `${cfg.icon} ${cfg.name}`, callback_data: `q:${k}` });
    }
    rows.push(row);
  }
  
  rows.push([
    { text: "🆘 Destek", url: "https://t.me/fbxnext" },
    { text: "📢 Kanal", url: "https://t.me/logsuzlarvip" },
  ]);
  rows.push([
    { text: "⚡ Bilgi", callback_data: "info" },
  ]);
  
  return { inline_keyboard: rows };
}

// ============================================
// KARŞILAMA
// ============================================
function karsilamaMesaji() {
  return (
    `⚡ *LOGSUZLAR SORGU BOTU*\n\n` +
    `✅ *Sistem Aktif*\n\n` +
    `📊 *Özellikler:*\n` +
    `• 🚀 CPU/RAM kullanmaz\n` +
    `• 🌐 7/24 sınırsız çalışır\n` +
    `• ⚡ Süper hızlı sorgu\n` +
    `• 🔒 Güvenli & gizli\n\n` +
    `📋 Aşağıdan bir sorgu seç:\n` +
    `👇`
  );
}

// ============================================
// SORGU YAP
// ============================================
async function sorguYap(apiKey, query) {
  const config = API_MAP[apiKey];
  if (!config) return null;
  
  const parts = {};
  for (const p of config.params) {
    if (query[p] !== undefined && query[p] !== "") parts[p] = query[p];
  }
  
  const url = config.url + "?" + new URLSearchParams(parts).toString();
  
  try {
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
      },
    });
    const text = await r.text();
    const temiz = reklamTemizle(text);
    let parsed = null;
    try { parsed = JSON.parse(temiz); } catch { parsed = null; }
    return parsed !== null ? parsed : { raw: temiz };
  } catch (e) {
    return { error: e.message };
  }
}

// ============================================
// SONUÇ FORMATLA
// ============================================
function sonucFormatla(apiKey, sonuc) {
  const config = API_MAP[apiKey];
  let text = `✅ *${config.name}*\n\n`;
  
  if (!sonuc) return "❌ Sonuç yok";
  if (sonuc.error) return `❌ Hata: \`${sonuc.error}\``;
  
  const veri = sonuc.data || sonuc.veri || sonuc;
  
  if (Array.isArray(veri)) {
    text += `📊 *${veri.length} kayıt*\n\n`;
    for (let i = 0; i < Math.min(veri.length, 10); i++) {
      text += `*#${i+1}*\n`;
      for (const [k, v] of Object.entries(veri[i])) {
        if (v && String(v).trim() && !["auth","auth_alt"].includes(k) && typeof v !== "object") {
          text += `▪️ ${k}: \`${v}\`\n`;
        }
      }
      text += "\n";
    }
    if (veri.length > 10) text += `_...ve ${veri.length-10} kayıt daha_`;
  } else if (typeof veri === "object") {
    for (const [k, v] of Object.entries(veri)) {
      if (v && String(v).trim() && !["auth","auth_alt"].includes(k) && typeof v !== "object") {
        text += `▪️ *${k}*: \`${v}\`\n`;
      }
    }
  }
  
  if (text.length < 30) text += "`" + JSON.stringify(sonuc).slice(0, 3000) + "`";
  if (text.length > 4000) text = text.slice(0, 3950) + "\n\n_...kısaltıldı_";
  return text;
}

// ============================================
// ANA HANDLER
// ============================================
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
  const origin = proto + "://" + host;

  // ===== WEBHOOK =====
  if (req.method === "POST") {
    try {
      let body = req.body;
      if (typeof body === "string") body = JSON.parse(body);
      const update = body;
      const botToken = req.query.bot;
      
      if (!botToken || !BOTS.has(botToken)) return res.status(200).json({ ok: true });
      
      const botData = BOTS.get(botToken);

      // ===== MESAJ =====
      if (update.message) {
        const chatId = update.message.chat.id;
        const text = (update.message.text || "").trim();

        if (text === "/start" || text.startsWith("/start ")) {
          await tgSend(botToken, chatId, karsilamaMesaji(), botMenu());
          return res.status(200).json({ ok: true });
        }

        if (text === "/help") {
          await tgSend(botToken, chatId,
            `🆘 *YARDIM*\n\n▪️ Sorgu için butona bas\n▪️ Bilgi gir\n▪️ Sonuç gelir\n\n📞 Destek: @fbxnext`,
            botMenu()
          );
          return res.status(200).json({ ok: true });
        }

        const waitingKey = botData.waitingFor;
        if (waitingKey && API_MAP[waitingKey]) {
          const config = API_MAP[waitingKey];
          const parts = text.split(/\s+/);
          const query = {};
          config.params.forEach((p, i) => { if (parts[i]) query[p] = parts[i]; });

          botData.waitingFor = null;
          BOTS.set(botToken, botData);

          await tgSend(botToken, chatId, `⏳ *Sorgulanıyor...*`);
          const sonuc = await sorguYap(waitingKey, query);
          const mesaj = sonucFormatla(waitingKey, sonuc);
          await tgSend(botToken, chatId, mesaj, botMenu());
          return res.status(200).json({ ok: true });
        }

        await tgSend(botToken, chatId, `❌ *Bilinmeyen komut!*\n\nMenü: /start`, botMenu());
        return res.status(200).json({ ok: true });
      }

      // ===== CALLBACK =====
      if (update.callback_query) {
        const cb = update.callback_query;
        const chatId = cb.message.chat.id;
        const data = cb.data;

        await tgApi(botToken, "answerCallbackQuery", { callback_query_id: cb.id });

        if (data === "info") {
          await tgSend(botToken, chatId,
            `⚡ *SİSTEM BİLGİSİ*\n\n` +
            `🖥️ *CPU:* Kullanmaz (serverless)\n` +
            `💾 *RAM:* Kullanmaz (serverless)\n` +
            `🌐 *Çalışma:* 7/24 aktif\n` +
            `📊 *Limit:* Sınırsız sorgu\n` +
            `⚡ *Hız:* Süper hızlı\n` +
            `🔒 *Güvenlik:* Uçtan uca\n\n` +
            `🚀 Webhook tabanlı sistem —\n` +
            `Sadece sorgu gelince çalışır,\n` +
            `Boşta kaynak tüketmez.`,
            botMenu()
          );
          return res.status(200).json({ ok: true });
        }

        if (data && data.startsWith("q:")) {
          const apiKey = data.slice(2);
          const config = API_MAP[apiKey];
          if (!config) return res.status(200).json({ ok: true });

          botData.waitingFor = apiKey;
          botData.chat_id = chatId;
          BOTS.set(botToken, botData);

          const paramList = config.params.map(p => `• \`${p}\``).join("\n");
          const ornek = Object.values(config.demo).join(" ");

          await tgSend(botToken, chatId,
            `${config.icon} *${config.name}*\n\n📝 *Gönderilecek:*\n${paramList}\n\n📌 *Örnek:*\n\`${ornek}\``
          );
        }

        return res.status(200).json({ ok: true });
      }

      return res.status(200).json({ ok: true });

    } catch (e) {
      console.error("Webhook error:", e);
      return res.status(200).json({ ok: true });
    }
  }

  // ===== GET API =====
  const apiKey = req.query.api;
  const userKey = req.query.key;

  if (apiKey === "keyolustur") {
    return res.status(200).json({ success: true, key: keyCreate() });
  }

  if (apiKey === "keykontrol") {
    return res.status(200).json({ success: true, gecerli: keyValid(userKey) });
  }

  if (apiKey === "botolustur") {
    const botToken = req.query.bot_token;
    const k = req.query.key;

    if (!botToken) return res.status(400).json({ success: false, error: "Bot token gerekli" });
    if (!keyValid(k)) return res.status(401).json({ success: false, error: "Geçersiz API key" });

    const info = await tgGetMe(botToken);
    if (!info) return res.status(400).json({ success: false, error: "Geçersiz bot token" });

    const webhookUrl = `${origin}/api/sorgu?bot=${botToken}`;
    const wh = await tgApi(botToken, "setWebhook", { url: webhookUrl });
    if (!wh.ok) return res.status(400).json({ success: false, error: "Webhook kurulamadı: " + (wh.description||"") });

    BOTS.set(botToken, { key: k, name: info.username, chat_id: null, waitingFor: null });

    return res.status(200).json({
      success: true,
      bot_username: info.username,
      bot_name: info.first_name,
      message: `Bot hazır! @${info.username} → /start`,
    });
  }

  if (apiKey === "list") {
    const base = origin + "/api/sorgu";
    const apis = Object.entries(API_MAP).map(([k, cfg]) => {
      let demoUrl = `${base}?api=${k}`;
      for (const [pk, pv] of Object.entries(cfg.demo)) demoUrl += `&${pk}=${encodeURIComponent(pv)}`;
      if (userKey) demoUrl += `&key=${encodeURIComponent(userKey)}`;
      return { key: k, name: cfg.name, icon: cfg.icon, demoUrl };
    });
    return res.status(200).json({ success: true, apis });
  }

  if (!apiKey || !API_MAP[apiKey]) {
    return res.status(400).json({ success: false, error: "Geçersiz API", kullanilabilir: Object.keys(API_MAP) });
  }

  if (!keyValid(userKey)) {
    return res.status(401).json({ success: false, error: "Geçersiz API key" });
  }

  const config = API_MAP[apiKey];
  const required = config.params[0];
  if (required && !req.query[required]) {
    return res.status(400).json({ success: false, error: `Eksik parametre: ${required}` });
  }

  const sonuc = await sorguYap(apiKey, req.query);
  return res.status(200).json({ success: true, api: apiKey, data: sonuc });
}
