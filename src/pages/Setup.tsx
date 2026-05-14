import React, { useState } from 'react';
import axios from 'axios';
import { Settings, Key, Globe, Shield, CheckCircle2, AlertCircle, Copy, Link } from 'lucide-react';

export default function Setup() {
  // .env dagi qiymatlarni avtomatik yuklaymiz
  const [subdomain, setSubdomain] = useState(import.meta.env.VITE_AMOCRM_SUBDOMAIN || 'uzautotrailer');
  const [clientId, setClientId] = useState(import.meta.env.VITE_AMOCRM_CLIENT_ID || 'cb8ecb39-a8d5-463d-982b-e8a7b1c075e7');
  const [clientSecret, setClientSecret] = useState(import.meta.env.VITE_AMOCRM_CLIENT_SECRET || '');
  const [code, setCode] = useState('');
  const [redirectUri, setRedirectUri] = useState(import.meta.env.VITE_AMOCRM_REDIRECT_URI || window.location.origin);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const handleExchange = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await axios.post('/api/amocrm/exchange', {
        subdomain,
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data || { message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">AmoCRM Sozlash</h1>
                <p className="text-slate-600 text-sm">Tokenlarni olish uchun ma'lumotlarni tekshiring</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-slate-700">Subdomen</label>
                <input type="text" value={subdomain} onChange={(e) => setSubdomain(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-slate-700">Client ID (Integration ID)</label>
                  <input type="text" value={clientId} onChange={(e) => setClientId(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-slate-700">Client Secret (Секретный ключ)</label>
                  <input type="password" value={clientSecret} onChange={(e) => setClientSecret(e.target.value)} placeholder="AmoCRM'dan nusxalang" className="w-full px-4 py-3 rounded-xl border border-slate-200" />
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-slate-700">Redirect URI (AmoCRM panelida bir xil bo'lishi shart!)</label>
                <input type="text" value={redirectUri} onChange={(e) => setRedirectUri(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50" />
                <p className="text-[10px] text-blue-600 font-medium">* AmoCRM panelida ham aynan shu manzil turganini tekshiring.</p>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-slate-700">Authorization Code (Yangi olingan kod)</label>
                <textarea value={code} onChange={(e) => setCode(e.target.value)} rows={3} placeholder="def50200e..." className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-sm" />
              </div>
            </div>

            <button onClick={handleExchange} disabled={loading || !code || !clientSecret} className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold py-4 rounded-2xl transition-all">
              {loading ? "Almashtirilmoqda..." : "Access Tokenni Olish"}
            </button>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl space-y-2">
                <div className="flex gap-2 text-red-700 font-bold items-center text-sm">
                  <AlertCircle className="w-4 h-4" /> Xatolik yuz berdi:
                </div>
                <pre className="text-[10px] bg-white p-3 rounded border border-red-100 overflow-auto max-h-40">
                  {JSON.stringify(error, null, 2)}
                </pre>
                <p className="text-[11px] text-red-600 italic">
                  Maslahat: "Секретный ключ" (Secret) noto'g'ri yoki nusxalashda bo'sh joy tushib qolgan bo'lishi mumkin.
                  Shuningdek, Redirect URI AmoCRM panelidagidan farq qilsa ham shu xato chiqadi.
                </p>
              </div>
            )}

            {result && (
              <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Muvaffaqiyatli!
                </div>
                <p className="text-xs text-emerald-700">Endi quyidagi tokenni .env fayliga VITE_AMOCRM_ACCESS_TOKEN o'rniga qo'ying:</p>
                <div className="bg-white p-3 rounded border border-emerald-200 text-[10px] font-mono break-all select-all cursor-pointer" onClick={() => copyToClipboard(result.access_token)}>
                  {result.access_token}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
