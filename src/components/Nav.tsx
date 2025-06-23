'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/utils/CartContext';

export default function Nav() {
  const { data: session, status } = useSession();
  const { cart } = useCart();

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white text-black shadow-md p-4 flex items-center justify-between">
      {/* Logo or site name */}
      <div className="flex-1">
        <h1 className="text-xl font-bold">Olipopper Studios</h1>
      </div>

      {/* Main nav links */}
      <div className="flex-1 flex justify-center gap-6">
        <Link href="/">Home</Link>
        <Link href="/products">Products</Link>
        {session?.user?.role === 'admin' && (
          <Link href="/admin" className="text-red-600 font-semibold">Admin</Link>
        )}
      </div>

      {/* Cart and Auth */}
      <div className="flex-1 flex justify-end items-center gap-6">
        <Link href="/cart" className="relative">
          🛒
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Link>

        {status === 'authenticated' ? (
          <>
            <span className="mr-2">Hello, {session.user.name || session.user.email}</span>
            <button
              onClick={() => signOut()}
              className="text-blue-600 hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/user/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
