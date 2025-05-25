// src/components/Nav.tsx
'use client'; // use this if you use interactivity (click, state, etc.)

import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="bg-white text-black shadow-md p-4 flex items-center justify-between">
        <div className="flex-1">
            <h1 className="text-xl font-bold">Olipopper Studios</h1>
        </div>
      <div className="flex-1 flex justify-center gap-6">
        <Link href="/">Home</Link>
        <Link href="/products">Products</Link>
        <Link href="/admin">Admin</Link>
      </div>
    <div className="flex-1 text-right">
    </div>
    </nav>
  );
}
