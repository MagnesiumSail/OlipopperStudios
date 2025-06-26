// === FILE: src/app/cart/page.tsx ===
// This file defines the shopping cart page where users can view and manage their cart items.

'use client';

import { useCart } from '@/utils/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <Link href="/products" className="text-blue-600 hover:underline">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <ul className="space-y-4 mb-6">
        {cart.map(item => (
          <li key={item.productId} className="flex gap-4 items-center border rounded p-4">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
            ) : (
              <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-gray-500 rounded">No Image</div>
            )}
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-sm text-gray-600">${(item.price / 100).toFixed(2)} each</p>
              <div className="flex items-center gap-2 mt-2">
                <label className="text-sm">Qty:</label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={e => updateQuantity(item.productId, parseInt(e.target.value))}
                  className="w-16 border px-2 py-1 rounded"
                />
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="ml-4 text-red-600 hover:underline text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="text-right text-lg font-semibold mb-4">
        Total: ${(getTotal() / 100).toFixed(2)}
      </div>

      <div className="text-right">
        <Link href="/checkout">
        <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
          Proceed to Checkout
        </button>
        </Link>
      </div>
    </div>
  );
}
