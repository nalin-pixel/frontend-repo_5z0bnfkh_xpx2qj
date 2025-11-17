import { useEffect, useState } from "react";
const baseUrl = import.meta.env.VITE_BACKEND_URL || "";

export default function Shipments() {
  const [warehouses, setWarehouses] = useState([]);
  const [items, setItems] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [form, setForm] = useState({ shipment_no: "", origin_warehouse_id: "", destination_warehouse_id: "", items: [] });
  const [line, setLine] = useState({ item_id: "", quantity: 1 });

  const load = async () => {
    const [w, i, s] = await Promise.all([
      fetch(`${baseUrl}/warehouses`).then(r=>r.json()),
      fetch(`${baseUrl}/items`).then(r=>r.json()),
      fetch(`${baseUrl}/shipments`).then(r=>r.json())
    ]);
    setWarehouses(w); setItems(i); setShipments(s);
  };

  useEffect(() => { load(); }, []);

  const addLine = () => {
    if (!line.item_id || !line.quantity) return;
    setForm({ ...form, items: [...form.items, { ...line }] });
    setLine({ item_id: "", quantity: 1 });
  };

  const create = async (e) => {
    e.preventDefault();
    if (!form.shipment_no || !form.origin_warehouse_id || form.items.length === 0) return;
    const payload = { ...form, items: form.items.map(l => ({ item_id: l.item_id, quantity: Number(l.quantity) })) };
    await fetch(`${baseUrl}/shipments`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setForm({ shipment_no: "", origin_warehouse_id: "", destination_warehouse_id: "", items: [] });
    await load();
  };

  const updateStatus = async (id, status) => {
    await fetch(`${baseUrl}/shipments/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    await load();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={create} className="space-y-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input className="input" placeholder="Shipment No" value={form.shipment_no} onChange={e=>setForm({...form, shipment_no:e.target.value})} />
          <select className="input" value={form.origin_warehouse_id} onChange={e=>setForm({...form, origin_warehouse_id:e.target.value})}>
            <option value="">Origin Warehouse</option>
            {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
          <select className="input" value={form.destination_warehouse_id} onChange={e=>setForm({...form, destination_warehouse_id:e.target.value})}>
            <option value="">Destination Warehouse (optional)</option>
            {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <select className="input md:col-span-3" value={line.item_id} onChange={e=>setLine({...line, item_id:e.target.value})}>
            <option value="">Select Item</option>
            {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
          <input className="input md:col-span-2" type="number" min="0" step="0.01" value={line.quantity} onChange={e=>setLine({...line, quantity:e.target.value})} />
          <button type="button" className="btn" onClick={addLine}>Add Line</button>
        </div>

        {form.items.length > 0 && (
          <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-700">
            {form.items.map((l, idx) => (
              <div key={idx} className="flex justify-between text-slate-300 text-sm py-1">
                <div>{items.find(i=>i.id===l.item_id)?.name || l.item_id}</div>
                <div>Qty: {l.quantity}</div>
              </div>
            ))}
          </div>
        )}

        <button className="btn">Create Shipment</button>
      </form>

      <div className="grid gap-3 md:grid-cols-2">
        {shipments.map(s => (
          <div key={s.id} className="p-4 bg-slate-800/40 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-200 font-semibold">{s.shipment_no}</div>
                <div className="text-slate-400 text-sm">Status: {s.status}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn" onClick={()=>updateStatus(s.id, "picked")}>Picked</button>
                <button className="btn" onClick={()=>updateStatus(s.id, "in_transit")}>In Transit</button>
                <button className="btn" onClick={()=>updateStatus(s.id, "delivered")}>Delivered</button>
              </div>
            </div>
            <div className="text-slate-400 text-sm mt-2">
              {s.items?.map((l, idx) => (
                <div key={idx} className="flex justify-between">
                  <div>{items.find(i=>i.id===l.item_id)?.name || l.item_id}</div>
                  <div>Qty: {l.quantity}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
