// === FILE: src/app/contact/page.tsx ===

'use client';

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // Placeholder form handler for demo—replace with actual send logic later!
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(false);
    setError("");
    // Optionally, you could POST to /api/contact here
    if (!name || !email || !message) {
      setError("Please fill out all fields.");
      return;
    }
    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
      <p className="mb-6 text-gray-600 text-center">
        Questions, feedback, or custom requests? We’d love to hear from you!
      </p>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl p-6 flex flex-col gap-4">
        {error && <p className="text-red-600 font-semibold">{error}</p>}
        {sent && <p className="text-green-600 font-semibold">Message sent! Thank you.</p>}
        <div>
          <label className="block mb-1 font-medium">Your Name</label>
          <input
            className="border rounded w-full p-2"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Jane Doe"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Your Email</label>
          <input
            className="border rounded w-full p-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            placeholder="jane@example.com"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Message</label>
          <textarea
            className="border rounded w-full p-2"
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={5}
            placeholder="How can we help you?"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 mt-2"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
