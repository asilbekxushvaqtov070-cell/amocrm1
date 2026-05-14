import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import dotenv from "dotenv";
import cron from "node-cron";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// AmoCRM ma`lumotlarni ishlan chiqish
async function getFullStats() {
  const subdomain = (process.env.VITE_AMOCRM_SUBDOMAIN || "").trim();
  const accessToken = (process.env.VITE_AMOCRM_ACCESS_TOKEN || "").trim();

  if (!subdomain || !accessToken) return { operators: [], cumulativeDealers: [], totalLeadsToday: 0 };

  const domain = subdomain.includes(".") ? subdomain : `${subdomain}.amocrm.ru`;
  const api = axios.create({
    baseURL: `https://${domain}/api/v4`,
    headers: { Authorization: `Bearer ${accessToken}` },
    timeout: 30000,
  });

  const startOfDay = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);

  let usersMap = new Map();
  let operatorStats: Record<string, any> = {};
  let cumulativeDealerStats: Record<string, number> = {};
  let totalLeadsToday = 0;

  try {
    try {
      const uRes = await api.get("/users");
      (uRes.data?._embedded?.users || []).forEach((u: any) => usersMap.set(u.id, u.name));
    } catch (e) {}

    try {
      const res = await api.get("/leads", {
        params: { filter: { created_at: { from: startOfDay } }, limit: 250 }
      });
      const leadsToday = res.data?._embedded?.leads || [];
      totalLeadsToday = leadsToday.length;
      leadsToday.forEach((lead: any) => {
        const userName = usersMap.get(lead.responsible_user_id) || `ID: ${lead.responsible_user_id}`;
        if (!operatorStats[userName]) {
          operatorStats[userName] = { talked: new Set(), tasks: 0, sentToDealer: 0, totalAssigned: 0 };
        }
        operatorStats[userName].totalAssigned++;
      });
    } catch (e) {}

    try {
      const [p1, p2] = await Promise.all([
        api.get("/leads", { params: { limit: 250, order_by: { updated_at: 'desc' } } }),
        api.get("/leads", { params: { limit: 250, order_by: { updated_at: 'desc' }, page: 2 } })
      ]);
      const allRecentLeads = [...(p1.data?._embedded?.leads || []), ...(p2.data?._embedded?.leads || [])];
      allRecentLeads.forEach((lead: any) => {
        const dealerField = lead.custom_fields_values?.find((cf: any) =>
          /дилер|диллер|dealer|filial|филиал|магазин|magazin/i.test(cf.field_name || "")
        );
        const dName = dealerField?.values?.[0]?.value;
        if (dName) {
          cumulativeDealerStats[dName] = (cumulativeDealerStats[dName] || 0) + 1;
          if (lead.updated_at >= startOfDay) {
            const opName = usersMap.get(lead.responsible_user_id);
            if (opName && operatorStats[opName]) operatorStats[opName].sentToDealer++;
          }
        }
      });
    } catch (e) {}
  } catch (err: any) {
    console.error("Main Stats Error:", err.message);
  }

  return {
    operators: Object.entries(operatorStats).map(([name, data]: [string, any]) => ({
      name, talkedCount: data.talked.size, tasksCount: data.tasks, sentToDealerCount: data.sentToDealer, totalAssignedCount: data.totalAssigned
    })),
    cumulativeDealers: Object.entries(cumulativeDealerStats).map(([name, count]) => ({ name, count })),
    totalLeadsToday
  };
}

async function sendTelegramReport() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    const stats = await getFullStats();
    let msg = `📊 *KUNLIK HISOBOT*\n━━━━━━━━━━━━━━\n📈 Bugun: ${stats.totalLeadsToday}\n\n`;
    stats.operators.forEach((op: any) => {
      msg += `👤 *${op.name}*:\n 📞 Bog'l: ${op.talkedCount} | 📝 Vazifa: ${op.tasksCount} | 🚚 Diller: ${op.sentToDealerCount}\n\n`;
    });
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, { chat_id: chatId, text: msg, parse_mode: 'Markdown' });
  } catch (e) {}
}

cron.schedule('10 17 * * *', sendTelegramReport, { timezone: "Asia/Tashkent" });

app.get("/api/amocrm/stats", async (req, res) => {
  try {
    const stats = await getFullStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: "API Xatosi", details: err.message });
  }
});

app.get("/api/test-telegram", async (req, res) => {
  await sendTelegramReport();
  res.json({ success: true });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    // Dev rejimda Vite ni dinamik import qilamiz
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    // Production rejimda static fayllarni xizmat qilish
    const distPath = path.join(process.cwd(), "dist");
    console.log("Serving static files from:", distPath);
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      if (!req.path.startsWith("/api/")) {
        res.sendFile(path.join(distPath, "index.html"));
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server: http://0.0.0.0:${PORT} [${isProd ? 'PROD' : 'DEV'}]`);
  });
}

startServer().catch(err => {
  console.error("Server start error:", err);
  process.exit(1);
});
