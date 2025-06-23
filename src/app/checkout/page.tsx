'use client';

import { useCart } from '@/utils/CartContext';
import { useState } from 'react';

export default function CheckoutPage() {
  const { cart, getTotal } = useCart();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, email, name }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.message || 'Checkout failed');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <ul className="mb-4">
        {cart.map(item => (
          <li key={item.productId} className="flex justify-between text-sm py-1">
            <span>{item.name} × {item.quantity}</span>
            <span>${((item.price * item.quantity) / 100).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <div className="text-right font-semibold text-lg mb-6">
        Total: ${(getTotal() / 100).toFixed(2)}
      </div>

      <input
        type="email"
        placeholder="Email (required)"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
        required
      />

      <input
        type="text"
        placeholder="Name (optional)"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
      />

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Proceed to Payment'}
      </button>
    </div>
  );
}
