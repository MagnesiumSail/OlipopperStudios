// === FILE: src/app/admin/size-guides/AddSizeGuideForm.tsx ===

'use client';

import { useState } from "react";

// Props: onGuideAdded callback to refresh parent list
export default function AddSizeGuideForm({ onGuideAdded }: { onGuideAdded: () => void }) {
  const [name, setName] = useState("");
  const [csvText, setCsvText] = useState(""); // For quick Excel-like copy/paste
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Utility: Parse CSV/TSV string into array of arrays
  function parseCsv(text: string): string[][] {
    return text
      .trim()
      .split("\n")
      .map(row => row.split(/,|\t/).map(cell => cell.trim()));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const tableData = parseCsv(csvText);
    if (!name || tableData.length < 1 || tableData[0].length < 2) {
      setError("Please enter a name and a valid table (at least 2 columns).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/size-guides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, tableData }),
      });

      if (!res.ok) throw new Error("Failed to add size guide.");
      setSuccess(true);
      setName("");
      setCsvText("");
      onGuideAdded();
    } catch (err: any) {
      setError(err.message || "Unknown error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 border rounded p-4 bg-white text-black">
      <h2 className="text-lg font-bold mb-2">Add New Size Guide</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">Added!</p>}

      <div className="mb-2">
        <label className="block mb-1 font-medium">Guide Name</label>
        <input
          className="border rounded w-full p-2"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <div className="mb-2">
        <label className="block mb-1 font-medium">
          Table Data (CSV/TSV: Size,Bust,Waist... — copy-paste from Excel works)
        </label>
        <textarea
          className="border rounded w-full p-2 font-mono text-sm"
          rows={5}
          value={csvText}
          onChange={e => setCsvText(e.target.value)}
          placeholder={"Size,Bust,Waist\nS,32,24\nM,34,26"}
          required
        />
      </div>

      <button
        className="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
        type="submit"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Size Guide"}
      </button>
    </form>
  );
}
