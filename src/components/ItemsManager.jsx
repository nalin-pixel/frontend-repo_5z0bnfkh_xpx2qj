import { useEffect, useState } from "react";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "";

export default function ItemsManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ sku: "", name: "", description: "", unit: "pcs" });
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${baseUrl}/items${q ? `?q=${encodeURIComponent(q)}` : ""}`);
      const data = await r.json();
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.sku || !form.name) return;
    setLoading(true);
    try {
      await fetch(`${baseUrl}/items`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      setForm({ sku: "", name: "", description: "", unit: "pcs" });
      await load();
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-slate-800/40 p-4 rounded-xl border border-slate-700">
        <input className="input" placeholder="SKU" value={form.sku} onChange={e=>setForm({...form, sku:e.target.value})} />
        <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input className="input md:col-span-2" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
        <input className="input" placeholder="Unit" value={form.unit} onChange={e=>setForm({...form, unit:e.target.value})} />
        <button disabled={loading} className="btn md:col-span-5">Add Item</button>
      </form>

      <div className="flex gap-3 items-center">
        <input className="input" placeholder="Search" value={q} onChange={e=>setQ(e.target.value)} />
        <button onClick={load} className="btn">Search</button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {items.map(i => (
          <div key={i.id} className="p-4 bg-slate-800/40 rounded-xl border border-slate-700">
            <div className="text-slate-200 font-semibold">{i.name} <span className="text-xs text-slate-400">({i.sku})</span></div>
            <div className="text-slate-400 text-sm">{i.description || "No description"}</div>
            <div className="text-slate-400 text-xs mt-1">Unit: {i.unit || "pcs"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
