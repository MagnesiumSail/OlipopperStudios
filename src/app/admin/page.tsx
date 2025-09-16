// === FILE: src/app/admin/page.tsx ===
// Admin dashboard with inline "Pause purchasing" control (client-only)

"use client";

import { useEffect, useState } from "react";
import ProductTable from "./components/ProductTable";
import AddProductForm from "./components/AddProductForm";

export default function AdminDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load current flag on mount
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        console.log("NEXT_PUBLIC_BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL);
        const res = await fetch("/api/public/site-flags", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`site-flags ${res.status}`);
        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json"))
          throw new Error(`Expected JSON, got ${ct}`);
        const data = await res.json();
        if (alive) setPaused(!!data.purchasingPaused);
      } catch {
        if (alive) setPaused(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Toggle via admin API
  const togglePause = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/site-flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchasingPaused: !paused }),
      });
      if (!res.ok) {
        // optional: surface error to user
        return;
      }
      setPaused(!paused);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 mt-20">Admin Panel</h1>

      {/* Inline pause/resume card */}
      <div className="border rounded-xl shadow p-5 mb-6">
        <h2 className="text-lg font-semibold mb-2">Purchasing</h2>
        <p className="text-sm text-gray-600 mb-4">
          Status:{" "}
          <span className="font-medium">{paused ? "Paused" : "Active"}</span>
        </p>
        <button
          onClick={togglePause}
          disabled={loading}
          className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
        >
          {paused
            ? loading
              ? "Resuming…"
              : "Resume purchasing"
            : loading
              ? "Pausing…"
              : "Pause purchasing"}
        </button>
      </div>

      <AddProductForm onProductAdded={() => setRefreshKey((k) => k + 1)} />
      <ProductTable key={refreshKey} />
    </div>
  );
}
