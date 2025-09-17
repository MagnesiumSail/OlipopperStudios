// src/components/Header.tsx
import Nav from "./Nav";
import { getPurchasingPaused } from "@/lib/siteSettings";

export default async function Header() {
    console.log("NEXT_PUBLIC_BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL);

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/public/site-flags`, {
    cache: "no-store",
  });
  const { purchasingPaused } = await res.json();
  return (
    <header className="border-b border-gray-200">
      {purchasingPaused && (
        <div className="bg-yellow-100 text-yellow-900 text-center py-2 text-sm">
          Purchasing is temporarily paused while we do maintenance. Thanks for your patience.
        </div>
      )}
      <Nav />
    </header>
  );
}
