// src/components/Nav.tsx
'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Nav() {
  const { data: session, status } = useSession();

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

      {/* Auth controls: Hello + Logout */}
      <div className="flex-1 text-right">
        {status === 'authenticated' ? (
          <>
            <span className="mr-4">Hello, {session.user.name || session.user.email}</span>
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
