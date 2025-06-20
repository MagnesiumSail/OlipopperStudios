// src/app/custom-order/page.tsx
'use client';

import { useState } from 'react';

export default function CustomOrderPage() {
  const [formData, setFormData] = useState({
    garmentType: '',
    fabric: '',
    fabricLink: '',
    color: '',
    colorLink: '',
    designDetails: '',
    designLink: '',
    occasion: '',
    size: '',
    waist: '',
    bust: '',
    hips: '',
    height: '',
    name: '',
    email: '',
    phone: '',
    contactMethod: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    consent: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = target.checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      alert('You must agree to the data use terms.');
      return;
    }
    // Later: POST to /api/custom-order
    console.log('Submitting form:', formData);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Custom Order Request</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="garmentType" placeholder="Garment Type" className="border p-2 w-full" onChange={handleChange} required />
        <input name="fabric" placeholder="Fabric" className="border p-2 w-full" onChange={handleChange} required />
        <input name="fabricLink" placeholder="Link to Fabric (optional)" className="border p-2 w-full" onChange={handleChange} />
        <input name="color" placeholder="Color" className="border p-2 w-full" onChange={handleChange} required />
        <input name="colorLink" placeholder="Link to Color/Fabric (optional)" className="border p-2 w-full" onChange={handleChange} />
        <textarea name="designDetails" placeholder="Design Details" className="border p-2 w-full" onChange={handleChange} required />
        <input name="designLink" placeholder="Design Inspiration Link (optional)" className="border p-2 w-full" onChange={handleChange} />
        <input name="occasion" placeholder="Occasion (optional)" className="border p-2 w-full" onChange={handleChange} />

        <h2 className="font-semibold pt-4">Measurements</h2>
        <input name="size" placeholder="Size (e.g. M)" className="border p-2 w-full" onChange={handleChange} required />
        <input name="waist" placeholder="Waist (in)" className="border p-2 w-full" onChange={handleChange} required />
        <input name="bust" placeholder="Bust (in)" className="border p-2 w-full" onChange={handleChange} required />
        <input name="hips" placeholder="Hips (in)" className="border p-2 w-full" onChange={handleChange} required />
        <input name="height" placeholder="Height (in)" className="border p-2 w-full" onChange={handleChange} required />

        <h2 className="font-semibold pt-4">Customer Info</h2>
        <input name="name" placeholder="Full Name" className="border p-2 w-full" onChange={handleChange} required />
        <input name="email" placeholder="Email" type="email" className="border p-2 w-full" onChange={handleChange} required />
        <input name="phone" placeholder="Phone Number" className="border p-2 w-full" onChange={handleChange} required />
        <input name="contactMethod" placeholder="Preferred Contact Method" className="border p-2 w-full" onChange={handleChange} />

        <h2 className="font-semibold pt-4">Shipping Info</h2>
        <input name="address" placeholder="Street Address" className="border p-2 w-full" onChange={handleChange} required />
        <input name="city" placeholder="City" className="border p-2 w-full" onChange={handleChange} required />
        <input name="state" placeholder="State/Province" className="border p-2 w-full" onChange={handleChange} required />
        <input name="zip" placeholder="ZIP/Postal Code" className="border p-2 w-full" onChange={handleChange} required />
        <input name="country" placeholder="Country" className="border p-2 w-full" onChange={handleChange} required />

        <label className="flex items-center gap-2 pt-4">
          <input type="checkbox" name="consent" onChange={handleChange} />
          I agree to allow this data to be used for fulfilling my custom clothing request.
        </label>

        <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          Submit Custom Order
        </button>
      </form>
    </div>
  );
}
