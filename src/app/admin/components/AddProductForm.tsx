// src/app/admin/components/AddProductForm.tsx
'use client';

import { useState } from 'react';

export default function AddProductForm({ onProductAdded }: { onProductAdded: () => void }) {
  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPattern, setIsPattern] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price: parseInt(price), // assume cents
          description,
          imageUrl,
          isPattern,
          isActive,
        }),
      });

      if (!res.ok) throw new Error('Failed to add product');

      setSuccess(true);
      onProductAdded(); // Refresh product table
      // Clear form
      setName('');
      setPrice('');
      setDescription('');
      setImageUrl('');
      setIsPattern(false);
      setIsActive(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 border rounded p-4">
      <h2 className="text-lg font-bold mb-2">Add New Product</h2>

      {/* Show messages */}
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">Product added!</p>}

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Product Name"
          required
          value={name}
          onChange={e => setName(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Price in cents"
          required
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="border p-2 rounded col-span-full"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPattern}
            onChange={e => setIsPattern(e.target.checked)}
          />
          Is Pattern
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={e => setIsActive(e.target.checked)}
          />
          Is Active
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Product'}
      </button>
    </form>
  );
}
