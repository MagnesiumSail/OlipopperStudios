// === FILE: src/app/cart/page.tsx ===

'use client';

import { useCart } from '@/utils/CartContext';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getTotal } = useCart();

  const { data: session, status } = useSession();
  const router = useRouter();

  async function handleCheckout() {
    if (status === 'unauthenticated') {
      router.push('/user/login');
      return;
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart }),
      });

      const data = await res.json();
      if (!res.ok || !data?.url) {
        throw new Error(data?.message || 'Checkout failed');
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
    }
  }

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center">
        <h1 className="mt-30 text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <Link href="/products" className="text-blue-600 hover:underline">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Shopping Cart</h1>

      <ul className="space-y-6 mb-8">
        {cart.map(item => (
          <li
            key={item.productId + (item.size || "")}
            className="flex flex-col sm:flex-row gap-4 items-center border rounded-2xl p-4 bg-white shadow-md"
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-28 h-28 object-cover rounded-xl border"
              />
            ) : (
              <div className="w-28 h-28 bg-gray-200 flex items-center justify-center text-gray-500 rounded-xl border">
                No Image
              </div>
            )}

            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                {/* Show size if present */}
                {item.size && (
                  <span className="px-3 py-1 text-xs font-medium bg-gray-100 border rounded text-gray-700">
                    Size: {item.size}
                  </span>
                )}
              </div>
              <p className="text-base text-gray-600 mt-1">${(item.price / 100).toFixed(2)} each</p>
              <div className="flex items-center gap-3 mt-3">
                <label className="text-sm font-medium">Qty:</label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={e => updateQuantity(item.productId, parseInt(e.target.value), item.size)}
                  className="w-16 border px-2 py-1 rounded"
                />
                <button
                  onClick={() => removeFromCart(item.productId, item.size)}
                  className="text-red-600 hover:underline text-sm font-medium ml-2"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-8">
        <div className="text-lg font-bold">
          Total: <span className="text-gray-900">${(getTotal() / 100).toFixed(2)}</span>
        </div>

        {/* replaced Link-to-/checkout with direct button to API */}
        <button
          onClick={handleCheckout}
          className="bg-black text-white px-7 py-3 rounded-lg hover:bg-gray-800 transition font-semibold shadow mt-4 sm:mt-0"
        >
          {status !== 'authenticated' ? 'Sign in to Checkout' : 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  );
}
