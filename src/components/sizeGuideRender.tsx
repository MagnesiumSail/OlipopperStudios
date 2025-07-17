// === FILE: src/components/sizeGuideRender.tsx ===
// This component renders a button to open a size guide modal

'use client';

import { useState } from "react";
import SizeGuideModal from "./SizeGuideModal";

export default function ProductSizeGuideButton({
  sizeGuideName,
  tableData,
}: {
  sizeGuideName: string;
  tableData: string[][];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="bg-gray-100 border border-gray-800 rounded px-4 py-2 text-black hover:bg-gray-200 transition w-fit font-medium"
        type="button"
        onClick={() => setOpen(true)}
      >
        Size Guide ▦
      </button>
      <SizeGuideModal
        open={open}
        onClose={() => setOpen(false)}
        title={sizeGuideName}
        tableData={tableData}
      />
    </>
  );
}
