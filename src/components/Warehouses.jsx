import { useEffect, useState } from "react";
const baseUrl = import.meta.env.VITE_BACKEND_URL || "";

export default function Warehouses() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ code: "", name: "", city: "" });

  const load = async () => {
    const r = await fetch(`${baseUrl}/warehouses`);
    setItems(await r.json());
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.code || !form.name) return;
    await fetch(`${baseUrl}/warehouses`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ code: "", name: "", city: "" });
    await load();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-800/40 p-4 rounded-xl border border-slate-700">
        <input className="input" placeholder="Code" value={form.code} onChange={e=>setForm({...form, code:e.target.value})} />
        <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input className="input" placeholder="City" value={form.city} onChange={e=>setForm({...form, city:e.target.value})} />
        <button className="btn">Add Warehouse</button>
      </form>

      <div className="grid gap-3 md:grid-cols-2">
        {items.map(w => (
          <div key={w.id} className="p-4 bg-slate-800/40 rounded-xl border border-slate-700">
            <div className="text-slate-200 font-semibold">{w.name} <span className="text-xs text-slate-400">({w.code})</span></div>
            <div className="text-slate-400 text-sm">{w.city || w.address || ""}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
