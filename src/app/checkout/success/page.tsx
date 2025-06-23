// src/app/checkout/success/page.tsx
'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useCart } from '@/utils/CartContext';

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart once payment is done
    clearCart();
  }, [clearCart]);

  return (
    <div className="p-6 text-center max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🎉 Thank You for Your Order!</h1>
      <p className="text-lg text-gray-700 mb-6">
        Your payment was successful. You'll receive a confirmation email shortly.
      </p>
      <a href="/" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">Continue Shopping</a>

    </div>
  );
}
