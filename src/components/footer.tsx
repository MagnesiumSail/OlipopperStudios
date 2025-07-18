// === FILE: src/components/Footer.tsx ===

import Link from "next/link";

export default function Footer() {
  return (
      <footer className="bg-gray-950 text-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-10 md:gap-0 items-start">
          {/* Site Directory */}
          <div>
            <h3 className="font-bold text-lg mb-3 tracking-wide text-white">
              Site Directory
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:underline">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/custom-order" className="hover:underline">
                  Custom Order
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/legal" className="hover:underline">
                  Legal
                </Link>
              </li>
              <li>
                <Link href="/user/account" className="hover:underline">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-bold text-lg mb-3 tracking-wide text-white">
              About Olipopper Studios
            </h3>
            <p className="text-gray-400 text-sm max-w-xs">
              Unique handmade clothing, patterns, and custom projects from
              Olipopper Studios. Built for creative people, by creative people.
            </p>
          </div>

          {/* Copyright */}
          <div className="mt-10 md:mt-0 text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Olipopper Studios. All rights
            reserved.
          </div>
        </div>
      </footer>
  );
}
