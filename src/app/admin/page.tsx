'use client';

import ProductTable from './components/ProductTable';
import AddProductForm from './components/AddProductForm';
import { useState } from 'react';

export default function AdminDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <AddProductForm onProductAdded={() => setRefreshKey(k => k + 1)} />
      <ProductTable key={refreshKey} />
    </div>
  );
}
