// === FILE: src/app/admin/size-guides/SizeGuideTable.tsx ===

"use client";

import { useEffect, useState } from "react";

interface SizeGuide {
  id: number;
  name: string;
  tableData: string[][];
}

export default function SizeGuideTable({
  refreshKey = 0,
}: {
  refreshKey?: number;
}) {
  const [guides, setGuides] = useState<SizeGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/size-guides")
      .then((res) => res.json())
      .then((data) => {
        setGuides(Array.isArray(data) ? data : []);
        setError("");
      })
      .catch((err) => setError("Failed to fetch size guides."))
      .finally(() => setLoading(false));
  }, [refreshKey]); // Refresh when parent changes refreshKey

  if (loading) return <p>Loading size guides…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!guides.length) return <p>No size guides found.</p>;

  return (
    <div>
      <h2 className="text-lg font-bold mb-3">Existing Size Guides</h2>
      <div className="space-y-8">
        {guides.map((guide) => (
          <div key={guide.id} className="border rounded p-4 bg-gray-50">
            <div className="flex items-center gap-4 mb-2">
              <span className="font-bold text-gray-800">{guide.name}</span>
              <span className="text-xs text-gray-400">ID: {guide.id}</span>
            </div>
            {/* Preview the first 4 rows of the table */}
            <div className="overflow-x-auto">
              <table className="min-w-max border border-gray-300 bg-white text-sm">
                <tbody>
                  {Array.isArray(guide.tableData) &&
                  guide.tableData.length > 0 ? (
                    guide.tableData.slice(0, 4).map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td key={j} className="border px-2 py-1">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="text-gray-400 italic border px-2 py-1">
                        No table data
                      </td>
                    </tr>
                  )}
                  {Array.isArray(guide.tableData) &&
                    guide.tableData.length > 4 && (
                      <tr>
                        <td
                          colSpan={guide.tableData[0]?.length || 1}
                          className="text-gray-400 text-xs italic border px-2 py-1"
                        >
                          …and {guide.tableData.length - 4} more rows
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
