'use client';

import { useState } from 'react';

export default function CustomOrderForm() {
  const [form, setForm] = useState({
    garmentType: '',
    fabric: '',
    color: '',
    designDetails: '',
    occasion: '',
    size: '',
    waist: '',
    bust: '',
    hips: '',
    height: '',
    name: '',
    email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/custom-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert('Custom order submitted!');
      setForm({
        garmentType: '', fabric: '', color: '', designDetails: '',
        occasion: '', size: '', waist: '', bust: '', hips: '',
        height: '', name: '', email: ''
      });
    } else {
      alert('Error submitting form.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Custom Order</h1>

      <select name="garmentType" value={form.garmentType} onChange={handleChange} className="w-full border p-2 rounded">
        <option value="">Garment Type</option>
        <option>Dress</option>
        <option>Top</option>
        <option>Pants</option>
        <option>Skirt</option>
        <option>Jacket</option>
        <option>Romper</option>
        <option>Jumpsuit</option>
        <option>Matching set</option>
        <option>Other</option>
      </select>

      <input name="fabric" placeholder="Fabric" value={form.fabric} onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="color" placeholder="Color" value={form.color} onChange={handleChange} className="w-full border p-2 rounded" />
      <textarea name="designDetails" placeholder="Design Details" value={form.designDetails} onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="occasion" placeholder="Occasion" value={form.occasion} onChange={handleChange} className="w-full border p-2 rounded" />

      <select name="size" value={form.size} onChange={handleChange} className="w-full border p-2 rounded">
        <option value="">Size</option>
        <option>XXS</option>
        <option>XS</option>
        <option>S</option>
        <option>M</option>
        <option>L</option>
        <option>XL</option>
        <option>XXL</option>
        <option>Other</option>
      </select>

      <input name="waist" placeholder="Waist" value={form.waist} onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="bust" placeholder="Bust" value={form.bust} onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="hips" placeholder="Hips" value={form.hips} onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="height" placeholder="Height" value={form.height} onChange={handleChange} className="w-full border p-2 rounded" />

      <input name="name" placeholder="Your Name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="email" placeholder="Your Email" value={form.email} onChange={handleChange} className="w-full border p-2 rounded" />

      <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
        Submit
      </button>
    </form>
  );
}