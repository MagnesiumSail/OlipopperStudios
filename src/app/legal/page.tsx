// === FILE: src/app/legal/page.tsx ===

export default function LegalPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-6 text-center">Legal Notice & Policies</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Copyright</h2>
        <p>
          &copy; {new Date().getFullYear()} Olipopper Studios. All rights reserved.  
          All site content, designs, and patterns are the property of Olipopper Studios and may not be reproduced without permission.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Terms of Service</h2>
        <p>
          By using this website, you agree not to resell, redistribute, or commercially reproduce any patterns or products
          purchased here. All items are for personal, non-commercial use unless otherwise stated.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Privacy Policy</h2>
        <p>
          We respect your privacy. Your personal information is used solely for order processing and site communication, and is never sold to third parties. For questions about your data, contact us at <a href="mailto:contact@olipopperstudios.com" className="text-blue-600 underline">contact@olipopperstudios.com</a>.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Contact</h2>
        <p>
          For legal inquiries or support, please email <a href="mailto:contact@olipopperstudios.com" className="text-blue-600 underline">contact@olipopperstudios.com</a>.
        </p>
      </section>
    </div>
  );
}
