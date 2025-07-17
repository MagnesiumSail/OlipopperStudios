// === FILE: src/components/SizeGuideModal.tsx ===
// This component renders a modal for displaying size guides

'use client';

import { useEffect, useRef } from "react";

export default function SizeGuideModal({
  open,
  onClose,
  title = "Size Guide",
  tableData,
  subtitle,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  tableData: string[][]; // expects [["Size","S","M"], ["Bust", ...], ...]
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on ESC key
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Close when clicking outside modal
  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === modalRef.current) onClose();
  }

  if (!open) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-gray-800 hover:text-black font-bold focus:outline-none"
          aria-label="Close"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-xl text-gray-800 font-bold mb-2 text-center">{title}</h2>
        {subtitle && (
          <p className="text-gray-800 mb-4 text-center">{subtitle}</p>
        )}

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-base bg-white rounded">
            <tbody>
              {tableData && tableData.length > 0 ? (
                tableData.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={`border px-3 py-2 text-gray-800 ${
                          i === 0 ? "font-semibold text-gray-800 bg-gray-50" : ""
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-gray-800 italic px-4 py-3">
                    No size guide data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
