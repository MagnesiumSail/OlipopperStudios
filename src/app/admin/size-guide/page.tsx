// === FILE: src/app/admin/size-guides/page.tsx ===

'use client';

import { useState } from "react";
import AddSizeGuideForm from "../components/AddSizeGuideForm";
import SizeGuideTable from "../components/sizeGuideTable";

export default function AdminSizeGuidesPage() {
  // Used to trigger table refresh when a guide is added
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="p-8 mt-40">
      <h1 className="text-2xl font-bold mb-6">Admin: Size Guides</h1>
      
      {/* Add Size Guide form, triggers refresh on add */}
      <AddSizeGuideForm onGuideAdded={() => setRefreshKey(k => k + 1)} />

      {/* Table of existing guides, re-fetches when refreshKey changes */}
      <SizeGuideTable refreshKey={refreshKey} />
    </div>
  );
}
