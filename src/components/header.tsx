// === FILE: src/components/header.tsx ===
// This file defines the header component that includes the navigation bar for the application.

import Nav from './Nav';

export default function Header() {
  return (
    <header className="border-b border-gray-200">
      <Nav />
    </header>
  );
}
