import { useEffect, useState } from "react";
const baseUrl = import.meta.env.VITE_BACKEND_URL || "";

export default function StockView() {
  const [stock, setStock] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ warehouse_id: "", item_id: "" });

  const load = async () => {
    const [sw, si, ss] = await Promise.all([
      fetch(`${baseUrl}/warehouses`).then(r=>r.json()),
      fetch(`${baseUrl}/items`).then(r=>r.json()),
      fetch(`${baseUrl}/inventory/stock`).then(r=>r.json())
    ]);
    setWarehouses(sw); setItems(si); setStock(ss);
  };

  useEffect(() => { load(); }, []);

  const filterLoad = async () => {
    const qs = new URLSearchParams();
    if (filters.warehouse_id) qs.set("warehouse_id", filters.warehouse_id);
    if (filters.item_id) qs.set("item_id", filters.item_id);
    const r = await fetch(`${baseUrl}/inventory/stock${qs.toString() ? `?${qs.toString()}` : ""}`);
    setStock(await r.json());
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-slate-800/40 p-4 rounded-xl border border-slate-700">
        <select className="input" value={filters.warehouse_id} onChange={e=>setFilters({...filters, warehouse_id:e.target.value})}>
          <option value="">All Warehouses</option>
          {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
        <select className="input" value={filters.item_id} onChange={e=>setFilters({...filters, item_id:e.target.value})}>
          <option value="">All Items</option>
          {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
        <button onClick={filterLoad} className="btn md:col-span-3">Filter</button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {stock.map(s => (
          <div key={s.id} className="p-4 bg-slate-800/40 rounded-xl border border-slate-700">
            <div className="text-slate-200 font-semibold">Qty: {s.quantity}</div>
            <div className="text-slate-400 text-sm">Warehouse: {warehouses.find(w=>w.id===s.warehouse_id)?.name || s.warehouse_id}</div>
            <div className="text-slate-400 text-sm">Item: {items.find(i=>i.id===s.item_id)?.name || s.item_id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
