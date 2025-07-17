// === FILE: src/components/Nav.tsx ===
// This file contains the navigation bar component with sticky, glassy design and responsive behavior

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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const retractTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const current = window.scrollY;
          if (current <= 10) {
            setShowNav(true);
          } else if (current > lastScroll.current) {
            setShowNav(false);
          } else {
            setShowNav(true);
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
      {/* --- Top Row: Brand (center), Cart/Auth (right), Hamburger (left on mobile) --- */}
      <div className="flex items-center justify-between w-full px-4 py-2 md:py-3">
        {/* Left: Hamburger on mobile, empty div on desktop */}
        <div className="flex-1 flex items-center">
          {/* Hamburger: visible on mobile only */}
          <button
            className="md:hidden text-3xl text-black focus:outline-none"
            onClick={() => setShowMobileMenu((prev) => !prev)}
            aria-label={showMobileMenu ? "Close menu" : "Open menu"}
          >
            {showMobileMenu ? "✕" : "☰"}
          </button>
          {/* Empty block on desktop to keep layout symmetrical */}
          <div className="hidden md:block" />
        </div>

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
      {/* Shown as normal on desktop, hidden on mobile unless open */}
      <div className="w-full border-t border-black/10 bg-transparent">
        {/* Desktop nav: visible md+, hidden on mobile */}
        <div className="hidden md:flex flex-wrap justify-center items-center gap-6 md:gap-8 px-4 py-2 text-base md:text-lg font-sans font-light text-black whitespace-nowrap">
          <Link
            href="/products"
            className="hover:underline hover:opacity-80 transition"
          >
            All
          </Link>
          <Link
            href="/products/search/dress"
            className="hover:underline hover:opacity-80 transition"
          >
            Dresses
          </Link>
          <Link
            href="/products/search/top"
            className="hover:underline hover:opacity-80 transition"
          >
            Tops
          </Link>
          <Link
            href="/products/search/bottom"
            className="hover:underline hover:opacity-80 transition"
          >
            Bottoms
          </Link>
          <Link
            href="/products/search/set"
            className="hover:underline hover:opacity-80 transition"
          >
            Sets
          </Link>
          <Link
            href="/products/search/outerwear"
            className="hover:underline hover:opacity-80 transition"
          >
            Outerwear
          </Link>
          <Link
            href="/products/search/accessories"
            className="hover:underline hover:opacity-80 transition"
          >
            Accessories
          </Link>
          <Link
            href="/products/search/pattern"
            className="hover:underline hover:opacity-80 transition"
          >
            Patterns DIY
          </Link>
          <Link
            href="/custom-order"
            className="hover:underline hover:opacity-80 transition"
          >
            Custom Order
          </Link>
          {session?.user?.role === "admin" && (
            <div className="flex gap-4 ml-4 text-red-600 font-semibold">
              <Link href="/admin" className="hover:underline">
                Admin
              </Link>
              <Link href="/admin/orders" className="hover:underline">
                Orders
              </Link>
              <Link
                href="/admin/size-guide"
                className="hover:underline"
                >
                Sizing Guides
              </Link>
            </div>
          )}
        </div>
        {/* Mobile nav: visible only on mobile when menu is open */}
        {showMobileMenu && (
          <div className="md:hidden bg-white/90 backdrop-blur-xl px-6 py-4 flex flex-col gap-4 shadow-md border-b border-black/10 animate-fadeIn text-gray-800">
            <Link
              href="/products"
              className="py-2 border-b border-gray-100"
              onClick={() => setShowMobileMenu(false)}
            >
              All
            </Link>
            <Link
              href="/products/search/dress"
              className="py-2 border-b border-gray-100"
              onClick={() => setShowMobileMenu(false)}
            >
              Dresses
            </Link>
            <Link
              href="/products/search/top"
              className="py-2 border-b border-gray-100"
              onClick={() => setShowMobileMenu(false)}
            >
              Tops
            </Link>
            <Link
              href="/products/search/bottom"
              className="py-2 border-b border-gray-100"
              onClick={() => setShowMobileMenu(false)}
            >
              Bottoms
            </Link>
            <Link
              href="/products/search/set"
              className="py-2 border-b border-gray-100"
              onClick={() => setShowMobileMenu(false)}
            >
              Sets
            </Link>
            <Link
              href="/products/search/outerwear"
              className="py-2 border-b border-gray-100"
              onClick={() => setShowMobileMenu(false)}
            >
              Outerwear
            </Link>
            <Link
              href="/products/search/accessories"
              className="py-2 border-b border-gray-100"
              onClick={() => setShowMobileMenu(false)}
            >
              Accessories
            </Link>
            <Link
              href="/products/search/pattern"
              className="py-2 border-b border-gray-100"
              onClick={() => setShowMobileMenu(false)}
            >
              Patterns DIY
            </Link>
            <Link
              href="/custom-order"
              className="py-2 border-b border-gray-100"
              onClick={() => setShowMobileMenu(false)}
            >
              Custom Order
            </Link>
            {session?.user?.role === "admin" && (
              <div className="flex flex-col gap-2 text-red-600 font-semibold mt-2">
                <Link
                  href="/admin"
                  className="hover:underline"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Admin
                </Link>
                <Link
                  href="/admin/orders"
                  className="hover:underline"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Orders
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
