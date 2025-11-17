import { useState } from "react";
import ItemsManager from "./components/ItemsManager";
import Warehouses from "./components/Warehouses";
import StockView from "./components/StockView";
import Shipments from "./components/Shipments";

function App() {
  const [tab, setTab] = useState("items");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">🚚</div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">LogiTrack</h1>
              <p className="text-sm text-slate-400">Shipping & Inventory Management</p>
            </div>
          </div>
          <nav className="flex gap-2">
            {[
              { key: "items", label: "Items" },
              { key: "warehouses", label: "Warehouses" },
              { key: "stock", label: "Stock" },
              { key: "shipments", label: "Shipments" },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 rounded-lg border text-sm transition ${tab===t.key? "bg-blue-600/20 border-blue-500/40" : "bg-slate-800/40 border-slate-700 hover:bg-slate-800/60"}`}>
                {t.label}
              </button>
            ))}
          </nav>
        </header>

        <main className="space-y-8">
          {tab === "items" && <ItemsManager />}
          {tab === "warehouses" && <Warehouses />}
          {tab === "stock" && <StockView />}
          {tab === "shipments" && <Shipments />}
        </main>
      </div>
    </div>
  );
}

export default App
