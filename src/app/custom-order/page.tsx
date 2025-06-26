// === FILE: src/app/custom-order/page.tsx
// This file defines a custom order form for users to submit their custom garment requests.
'use client';

import { useState } from 'react';

export default function CustomOrderForm() {
  const [form, setForm] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/custom-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    alert(res.ok ? 'Custom order submitted!' : 'Error submitting form.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 max-w-4xl mx-auto text-sm">
      <h1 className="text-3xl font-bold mb-6">Custom Order Form</h1>

      {/* Garment Type */}
      <label className="block font-medium">Garment Type</label>
      <select name="garmentType" onChange={handleChange} className="w-full border p-2 rounded">
        <option value="">Select...</option>
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
      <input name="otherGarment" placeholder="Other (specify)" onChange={handleChange} className="w-full border p-2 rounded" />

      {/* Fabric & Color */}
      <input name="fabric" placeholder="Fabric" onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="color" placeholder="Color" onChange={handleChange} className="w-full border p-2 rounded" />

      {/* Design Details */}
      <textarea name="designDetails" placeholder="Design Details (include link if any)" onChange={handleChange} className="w-full border p-2 rounded" />

      {/* Occasion */}
      <input name="occasion" placeholder="Occasion" onChange={handleChange} className="w-full border p-2 rounded" />

      {/* Required Measurements */}
      <label className="block font-medium mt-6">Measurements (Required)</label>
      <select name="size" onChange={handleChange} className="w-full border p-2 rounded">
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
      <input name="customSize" placeholder="Other size (if any)" onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="waist" placeholder="Waist" onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="bust" placeholder="Bust" onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="hips" placeholder="Hips" onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="height" placeholder="Height" onChange={handleChange} className="w-full border p-2 rounded" />

      {/* Optional Measurements */}
      <label className="block font-medium mt-6">Optional Measurements</label>
      <select name="braBand" onChange={handleChange} className="w-full border p-2 rounded">
        <option value="">Bra Band Size</option>
        {['28','30','32','34','36','38','40','42','44'].map(size => <option key={size}>{size}</option>)}
      </select>
      <select name="braCup" onChange={handleChange} className="w-full border p-2 rounded">
        <option value="">Bra Cup Size</option>
        {['A','B','C','D','DD','E','F','G'].map(cup => <option key={cup}>{cup}</option>)}
      </select>
      {['underBust', 'shoulderSpan', 'inseam', 'armLength', 'bicep', 'wrist', 'neckCircumference', 'thigh', 'calf', 'shoulderToWaist'].map(measure => (
        <input key={measure} name={measure} placeholder={measure.replace(/([A-Z])/g, ' $1')} onChange={handleChange} className="w-full border p-2 rounded" />
      ))}

      {/* Other Measurements */}
      <textarea name="otherMeasurements" placeholder="Any other measurements" onChange={handleChange} className="w-full border p-2 rounded" />

      {/* Follow-up Preferences */}
      <label className="block font-medium mt-6">Follow-up Preferences</label>
      {['Fabric Swatch Approval','Sketch Approval','Progress updates (messages)','Progress updates (photos)','None (surprise me)'].map(option => (
        <label key={option} className="block">
          <input type="checkbox" name={option} onChange={handleChange} className="mr-2" /> {option}
        </label>
      ))}
      <input name="followUpOther" placeholder="Other (follow-up)" onChange={handleChange} className="w-full border p-2 rounded" />

      {/* Customer Info */}
      <label className="block font-medium mt-6">Customer Info</label>
      <input name="name" placeholder="Name" onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="phone" placeholder="Phone Number" onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="email" placeholder="Email" onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="preferredContact" placeholder="Preferred Contact Method" onChange={handleChange} className="w-full border p-2 rounded" />

      {/* Budget & Timeline */}
      <label className="block font-medium mt-6">Budget & Timeline</label>
      <input name="budget" placeholder="Budget Range" onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="deadline" placeholder="Ideal Deadline or Event Date" onChange={handleChange} className="w-full border p-2 rounded" />
      <select name="rushOrder" onChange={handleChange} className="w-full border p-2 rounded">
        <option value="">Rush Order?</option>
        <option>Yes</option>
        <option>No</option>
      </select>

      {/* Closures */}
      <label className="block font-medium mt-6">Closures</label>
      {['Zipper (exposed)','Zipper (hidden/invisible)','Buttons (functional)','Buttons (decorative)','Hook & eye','Lacing','Snaps','Velcro','Tie closure'].map(option => (
        <label key={option} className="block">
          <input type="checkbox" name={option} onChange={handleChange} className="mr-2" /> {option}
        </label>
      ))}
      <input name="closureOther" placeholder="Other (closure)" onChange={handleChange} className="w-full border p-2 rounded" />

      {/* Pockets */}
      <label className="block font-medium mt-6">Pockets</label>
      {['No pockets','Hidden/secret pockets'].map(option => (
        <label key={option} className="block">
          <input type="checkbox" name={option} onChange={handleChange} className="mr-2" /> {option}
        </label>
      ))}
      <input name="pocketOther" placeholder="Other (pockets)" onChange={handleChange} className="w-full border p-2 rounded" />

      {/* Fit */}
      <label className="block font-medium mt-6">Fit</label>
      {['tailored','tight','relaxed'].map(option => (
        <label key={option} className="block">
          <input type="checkbox" name={option} onChange={handleChange} className="mr-2" /> {option}
        </label>
      ))}
      <input name="fitOther" placeholder="Other (fit)" onChange={handleChange} className="w-full border p-2 rounded" />

      {/* Lining & Additional Info */}
      <label className="block font-medium mt-6">Lining</label>
      <label className="block">
        <input type="checkbox" name="lining" onChange={handleChange} className="mr-2" /> Include Lining
      </label>
      <input name="liningOther" placeholder="Other (lining)" onChange={handleChange} className="w-full border p-2 rounded" />

      <textarea name="additionalInfo" placeholder="Any additional instructions or comments" onChange={handleChange} className="w-full border p-2 rounded" />

      <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
        Submit
      </button>
    </form>
  );
}
