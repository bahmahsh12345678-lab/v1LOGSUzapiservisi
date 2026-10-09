/**
 * Logsuzlar Service - Vercel API + Telegram Bot
 * SABİT KEY: logsuzlaricu2027pro
 * Webhook otomatik yenileme - 7/24 çalışır
 */

const SABIT_KEY = "logsuzlaricu2027pro";
const BOT_KEYS = global.__BOT_KEYS__ || (global.__BOT_KEYS__ = new Map());

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
// SABİT KEY KONTROLÜ
// ============================================
function keyValid(key) {
  return key === SABIT_KEY;
}

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

async function tgSendDocument(token, chatId, txtContent, filename, caption, keyboard) {
  try {
    const boundary = "----FormBoundary" + Math.random().toString(36).substring(2);
    const encoder = new TextEncoder();
    const parts = [];
    
    parts.push(encoder.encode(`--${boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n${chatId}\r\n`));
    
    if (caption) {
      parts.push(encoder.encode(`--${boundary}\r\nContent-Disposition: form-data; name="caption"\r\n\r\n${caption}\r\n`));
      parts.push(encoder.encode(`--${boundary}\r\nContent-Disposition: form-data; name="parse_mode"\r\n\r\nMarkdown\r\n`));
    }
    
    if (keyboard) {
      parts.push(encoder.encode(`--${boundary}\r\nContent-Disposition: form-data; name="reply_markup"\r\n\r\n${JSON.stringify(keyboard)}\r\n`));
    }
    
    parts.push(encoder.encode(`--${boundary}\r\nContent-Disposition: form-data; name="document"; filename="${filename}"\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n`));
    parts.push(encoder.encode(txtContent));
    parts.push(encoder.encode(`\r\n--${boundary}--\r\n`));
    
    let totalLen = 0;
    for (const p of parts) totalLen += p.length;
    const buf = new Uint8Array(totalLen);
    let offset = 0;
    for (const p of parts) { buf.set(p, offset); offset += p.length; }
    
    const r = await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
      method: "POST",
      headers: { "Content-Type": `multipart/form-data; boundary=${boundary}` },
      body: buf,
    });
    return await r.json();
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ============================================
// MENÜ
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
  rows.push([{ text: "⚡ Bilgi", callback_data: "info" }]);
  return { inline_keyboard: rows };
}

function karsilamaMesaji() {
  return (
    `⚡ *LOGSUZLAR SORGU BOTU*\n\n` +
    `✅ *Sistem Aktif*\n\n` +
    `📊 *Özellikler:*\n` +
    `• 🚀 CPU/RAM kullanmaz\n` +
    `• 🌐 7/24 sınırsız çalışır\n` +
    `• ⚡ Süper hızlı sorgu\n` +
    `• 📄 Sonuç TXT dosyası\n` +
    `• 🔒 Güvenli & gizli\n\n` +
    `📋 Aşağıdan bir sorgu seç:\n👇`
  );
}

// ============================================
// SORGU
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
// SONUÇ GÖNDER (TXT)
// ============================================
async function sonucGonder(botToken, chatId, apiKey, sonuc, keyboard) {
  const config = API_MAP[apiKey];
  const zaman = new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" });
  
  let txt = "═══════════════════════════════════════════════\n";
  txt += `  ${config.name}\n`;
  txt += "═══════════════════════════════════════════════\n";
  txt += `📅 Tarih  : ${zaman}\n`;
  txt += `📌 API    : ${apiKey}\n`;
  txt += `🎯 Servis : Logsuzlar Service\n`;
  txt += "═══════════════════════════════════════════════\n\n";
  
  if (sonuc === null || sonuc === undefined) {
    txt += "❌ Sonuç yok\n";
  } else if (sonuc.error) {
    txt += `❌ HATA: ${sonuc.error}\n`;
  } else {
    txt += "📄 TAM VERİ:\n\n" + JSON.stringify(sonuc, null, 2);
  }
  
  txt += "\n\n═══════════════════════════════════════════════\n";
  txt += "✅ Logsuzlar Service\n📢 @logsuzlarvip\n🆘 @fbxnext\n";
  txt += "═══════════════════════════════════════════════\n";
  
  let ozet = `✅ *${config.name}*\n\n`;
  let kayitSayisi = 0, alanSayisi = 0;
  if (sonuc && typeof sonuc === "object") {
    alanSayisi = Object.keys(sonuc).filter(k => !["auth","auth_alt","developer","version","sürüm","surum","author","yapimci"].includes(k)).length;
    const veri = sonuc.data || sonuc.veri || sonuc.sonuc || sonuc.result;
    if (Array.isArray(veri)) kayitSayisi = veri.length;
  }
  ozet += `📊 Alan: \`${alanSayisi}\`\n`;
  if (kayitSayisi > 0) ozet += `📋 Kayıt: \`${kayitSayisi}\`\n`;
  ozet += `\n📁 *Tam sonuç TXT dosyasında* 👇`;
  
  const fileName = `${apiKey}_${Date.now()}.txt`;
  const r = await tgSendDocument(botToken, chatId, txt, fileName, ozet, keyboard);
  
  if (!r.ok) {
    let fb = txt.slice(0, 3800);
    await tgSend(botToken, chatId, fb, keyboard);
  }
  return r.ok;
}

// ============================================
// WEBHOOK OTOMATİK YENİLE
// ============================================
async function webhookYenile(botToken, origin) {
  try {
    const url = `${origin}/api/sorgu?bot=${encodeURIComponent(botToken)}`;
    const r = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
    const d = await r.json();
    
    if (d.ok && d.result.url === url && !d.result.last_error_message) {
      return true;
    }
    
    // Webhook yok veya hatalı → yeniden kur
    await tgApi(botToken, "setWebhook", {
      url,
      allowed_updates: ["message", "callback_query"],
      drop_pending_updates: true,
    });
    return true;
  } catch { return false; }
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

  // ==========================================
  // POST = WEBHOOK
  // ==========================================
  if (req.method === "POST") {
    try {
      let body = req.body;
      if (typeof body === "string") body = JSON.parse(body);
      const update = body;
      const botToken = req.query.bot;
      
      if (!botToken) return res.status(200).json({ ok: true });

      // Bot token geçerli mi?
      if (!BOT_KEYS.has(botToken)) {
        // Yeni bot → kaydet
        const info = await tgGetMe(botToken);
        if (info) {
          BOT_KEYS.set(botToken, { name: info.username });
        }
      }

      if (update.message) {
        const chatId = update.message.chat.id;
        const text = (update.message.text || "").trim();

        if (text === "/start" || text.startsWith("/start ")) {
          await tgSend(botToken, chatId, karsilamaMesaji(), botMenu());
          return res.status(200).json({ ok: true });
        }

        if (text === "/help") {
          await tgSend(botToken, chatId, `🆘 *YARDIM*\n\n▪️ Sorgu için butona bas\n▪️ Bilgi gir\n▪️ TXT dosyası gelir\n\n📞 @fbxnext`, botMenu());
          return res.status(200).json({ ok: true });
        }

        const pendingKey = global.__PENDING__ || (global.__PENDING__ = new Map());
        const waitingApi = pendingKey.get(`${botToken}_${chatId}`);
        
        if (waitingApi && API_MAP[waitingApi]) {
          const config = API_MAP[waitingApi];
          const parts = text.split(/\s+/);
          const query = {};
          config.params.forEach((p, i) => { if (parts[i]) query[p] = parts[i]; });

          pendingKey.delete(`${botToken}_${chatId}`);
          await tgSend(botToken, chatId, `⏳ *Sorgulanıyor...*`);
          const sonuc = await sorguYap(waitingApi, query);
          await sonucGonder(botToken, chatId, waitingApi, sonuc, botMenu());
          return res.status(200).json({ ok: true });
        }

        await tgSend(botToken, chatId, `❌ *Bilinmeyen komut!*\n\nMenü: /start`, botMenu());
        return res.status(200).json({ ok: true });
      }

      if (update.callback_query) {
        const cb = update.callback_query;
        const chatId = cb.message.chat.id;
        const data = cb.data;

        await tgApi(botToken, "answerCallbackQuery", { callback_query_id: cb.id });

        if (data === "info") {
          await tgSend(botToken, chatId,
            `⚡ *SİSTEM BİLGİSİ*\n\n🖥️ *CPU:* Kullanmaz\n💾 *RAM:* Kullanmaz\n🌐 *Çalışma:* 7/24\n📊 *Limit:* Sınırsız\n⚡ *Hız:* Süper hızlı\n📄 *Sonuç:* TXT\n🔒 *Güvenlik:* Uçtan uca\n\n🚀 Webhook tabanlı sistem.`,
            botMenu()
          );
          return res.status(200).json({ ok: true });
        }

        if (data && data.startsWith("q:")) {
          const apiKey = data.slice(2);
          const config = API_MAP[apiKey];
          if (!config) return res.status(200).json({ ok: true });

          const pendingKey = global.__PENDING__ || (global.__PENDING__ = new Map());
          pendingKey.set(`${botToken}_${chatId}`, apiKey);

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
      return res.status(200).json({ ok: true });
    }
  }

  // ==========================================
  // GET = API
  // ==========================================
  const apiKey = req.query.api;
  const userKey = req.query.key;
  const botToken = req.query.bot;

  // WEBHOOK OTOMATİK YENİLE (her GET istekte çalışır, cache ile korunur)
  if (botToken) {
    await webhookYenile(botToken, origin);
  }

  if (apiKey === "keyolustur") {
    return res.status(200).json({ success: true, key: SABIT_KEY });
  }

  if (apiKey === "keykontrol") {
    return res.status(200).json({ success: true, gecerli: true });
  }

  if (apiKey === "botolustur") {
    const botToken2 = req.query.bot_token;
    
    if (!botToken2) return res.status(400).json({ success: false, error: "Bot token gerekli" });

    const info = await tgGetMe(botToken2);
    if (!info) return res.status(400).json({ success: false, error: "Geçersiz bot token" });

    const webhookUrl = `${origin}/api/sorgu?bot=${encodeURIComponent(botToken2)}`;
    const wh = await tgApi(botToken2, "setWebhook", { 
      url: webhookUrl, 
      allowed_updates: ["message", "callback_query"],
      drop_pending_updates: true,
    });
    
    if (!wh.ok) return res.status(400).json({ success: false, error: "Webhook kurulamadı: " + (wh.description||"") });

    BOT_KEYS.set(botToken2, { name: info.username, olusturma: new Date().toISOString() });

    return res.status(200).json({
      success: true,
      bot_username: info.username,
      bot_name: info.first_name,
      message: `Bot hazır! @${info.username} → /start`,
    });
  }

  if (apiKey === "botdurdur") {
    const bt = req.query.bot_token;
    if (!bt) return res.status(400).json({ success: false, error: "Token gerekli" });
    const r = await tgApi(bt, "deleteWebhook", {});
    return res.status(200).json({ success: r.ok, message: r.ok ? "Bot durduruldu" : "Hata" });
  }

  if (apiKey === "botbaslat") {
    const bt = req.query.bot_token;
    if (!bt) return res.status(400).json({ success: false, error: "Token gerekli" });
    const info = await tgGetMe(bt);
    if (!info) return res.status(400).json({ success: false, error: "Geçersiz bot token" });
    const webhookUrl = `${origin}/api/sorgu?bot=${encodeURIComponent(bt)}`;
    const wh = await tgApi(bt, "setWebhook", { 
      url: webhookUrl, 
      allowed_updates: ["message", "callback_query"] 
    });
    return res.status(200).json({ success: wh.ok, bot_username: info.username });
  }

  if (apiKey === "botsil") {
    const bt = req.query.bot_token;
    if (!bt) return res.status(400).json({ success: false, error: "Token gerekli" });
    try { await tgApi(bt, "deleteWebhook", {}); } catch {}
    BOT_KEYS.delete(bt);
    return res.status(200).json({ success: true, message: "Bot silindi" });
  }

  if (apiKey === "botlarim") {
    const list = [];
    for (const [t, b] of BOT_KEYS.entries()) {
      list.push({
        token_kisa: t.slice(0, 15) + "...",
        token_tam: t,
        username: b.name,
        aktif: true,
      });
    }
    return res.status(200).json({ success: true, toplam: list.length, botlar: list });
  }

  if (apiKey === "list") {
    const base = origin + "/api/sorgu";
    const apis = Object.entries(API_MAP).map(([k, cfg]) => {
      let demoUrl = `${base}?api=${k}`;
      for (const [pk, pv] of Object.entries(cfg.demo)) demoUrl += `&${pk}=${encodeURIComponent(pv)}`;
      demoUrl += `&key=${SABIT_KEY}`;
      return { key: k, name: cfg.name, icon: cfg.icon, demoUrl };
    });
    return res.status(200).json({ success: true, apis });
  }

  if (!apiKey || !API_MAP[apiKey]) {
    return res.status(400).json({ success: false, error: "Geçersiz API", kullanilabilir: Object.keys(API_MAP) });
  }

  if (userKey !== SABIT_KEY) {
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
