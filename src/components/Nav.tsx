// === FILE: src/components/Nav.tsx ===
// Animated, sticky nav that hides on scroll down and appears on scroll up

"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/utils/CartContext";
import { useEffect, useRef, useState } from "react";

export default function Nav() {
  const { data: session, status } = useSession();
  const { cart } = useCart();

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- Sticky, Hide-on-Scroll Logic ---
  const [showNav, setShowNav] = useState(true);
  const lastScroll = useRef(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const current = window.scrollY;
          if (current <= 10) {
            setShowNav(true);
          } else if (current > lastScroll.current) {
            setShowNav(false); // scroll down, hide
          } else {
            setShowNav(true); // scroll up, show
          }
          lastScroll.current = current;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Style: sticky, glassy, minimalist nav ---
  return (
    <nav
  className={`
    fixed top-0 left-0 w-full z-50 transition-transform duration-300
    ${showNav ? "translate-y-0" : "-translate-y-full"}
    bg-white/60 backdrop-blur-xl border-b border-black/10
    shadow-sm px-0 py-0
  `}
  style={{
    background: "rgba(255,255,255,0.70)",
    backdropFilter: "blur(12px)",
  }}
>
  {/* --- Top Row: Brand (center), Cart/Auth (right) --- */}
  <div className="flex items-center justify-between w-full px-4 py-2 md:py-3">
    {/* Left empty to center the brand */}
    <div className="flex-1" />

    {/* Centered Brand */}
    <div className="flex-1 flex justify-center items-center">
      <Link
        href="/"
        className="font-sans font-light text-3xl md:text-4xl tracking-tight hover:opacity-80 transition text-black"
        style={{ letterSpacing: "0.02em" }}
      >
        Olipopper Studios
      </Link>
    </div>

    {/* Cart and Auth */}
    <div className="flex-1 flex justify-end items-center gap-6 text-black">
      <Link
        href="/cart"
        className="relative hover:opacity-80 transition"
        aria-label="Cart"
      >
        <span role="img" aria-label="cart" className="text-xl">
          🛒
        </span>
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Link>
      {status === "authenticated" ? (
        <>
          <span className="mr-2 text-sm truncate max-w-[100px] hidden md:inline">
            Hello, {session.user.name || session.user.email}
          </span>
          <button
            onClick={() => signOut()}
            className="text-blue-600 hover:underline hover:opacity-80 transition"
          >
            Logout
          </button>
        </>
      ) : (
        <Link
          href="/user/login"
          className="text-blue-600 hover:underline hover:opacity-80 transition"
        >
          Login
        </Link>
      )}
    </div>
  </div>

  {/* --- Bottom Row: Product Categories + Admin --- */}
  <div className="w-full border-t border-black/10 bg-transparent">
    <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 px-4 py-2 text-base md:text-lg font-sans font-light text-black whitespace-nowrap">
      <Link href="/products/search/dress" className="hover:underline hover:opacity-80 transition">Dresses</Link>
      <Link href="/products/search/top" className="hover:underline hover:opacity-80 transition">Tops</Link>
      <Link href="/products/search/bottom" className="hover:underline hover:opacity-80 transition">Bottoms</Link>
      <Link href="/products/search/set" className="hover:underline hover:opacity-80 transition">Sets</Link>
      <Link href="/products/search/outerwear" className="hover:underline hover:opacity-80 transition">Outerwear</Link>
      <Link href="/products/search/accessories" className="hover:underline hover:opacity-80 transition">Accessories</Link>
      <Link href="/products/search/pattern" className="hover:underline hover:opacity-80 transition">Patterns DIY</Link>
      <Link href="/products/search/custom-order" className="hover:underline hover:opacity-80 transition">Custom Order</Link>
      {/* Admin/Orders */}
      {session?.user?.role === "admin" && (
        <div className="flex gap-4 ml-4 text-red-600 font-semibold">
          <Link href="/admin" className="hover:underline">Admin</Link>
          <Link href="/admin/orders" className="hover:underline">Orders</Link>
        </div>
      )}
    </div>
  </div>
</nav>
  );
}
