// === FILE: src/app/custom-order/page.tsx
// This file defines a custom order form for users to submit their custom garment requests.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UploadButton from "@/components/UploadButton";

export default function CustomOrderForm() {
  const [form, setForm] = useState<any>({});
  const router = useRouter();
  const [designImages, setDesignImages] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/custom-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, designImages }),
    });
    if (res.ok) {
      alert("Your custom order has been submitted successfully!");
      setForm({});
      setDesignImages([]);
      router.push("/"); // Redirect to home or another page
    } else {
      const errorData = await res.json();
      alert(`Error submitting form: ${errorData.message || "Unknown error"}`);
    }
  };

  return (
    <div className="mt-30 m-5">
      <h1 className="text-3xl font-sans font-light mb-6 text-center text-gray-400">
        Custom Order Form
      </h1>
      <form
        onSubmit={handleSubmit}
        className="mx-auto pb-20 px-4 grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-800"
      >
        {/* --- Begin: Garment & Design Section (Card 1) --- */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-4">
          <h2 className="font-sans text-xl font-light mb-2">Garment Details</h2>
          {/* Garment Type */}
          <label className="block font-medium">Garment Type</label>
          <select
            name="garmentType"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
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
          <input
            name="otherGarment"
            placeholder="Other (specify)"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          {/* Fabric & Color */}
          <div className="flex gap-4">
            <input
              name="fabric"
              placeholder="Fabric"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <input
              name="color"
              placeholder="Color"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Design Details */}
          <textarea
            name="designDetails"
            placeholder="Design Details (include link if any)"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {/* Occasion */}
          <input
            name="occasion"
            placeholder="Occasion (optional)"
            onChange={handleChange}
            className="w-full border p-2 rounded mt-4"
          />
          {/* Inspiration Images */}
          <label className="block font-medium mt-4">
            Upload Inspiration Images{" "}
            <span className="font-normal text-gray-500 text-xs">
              (up to 4, optional)
            </span>
          </label>
          <UploadButton
            onUploadComplete={(urls) => setDesignImages(urls.slice(0, 4))}
          />
          {/* Show thumbnails of uploaded images */}
          {designImages.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {designImages.map((url, i) => (
                <div
                  key={url}
                  className="relative w-24 h-24 border rounded overflow-hidden bg-gray-100"
                >
                  <img
                    src={url}
                    alt={`Design Inspiration ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-white/80 hover:bg-red-500 hover:text-white text-xs px-1 py-0.5 rounded-bl"
                    onClick={() =>
                      setDesignImages((prev) =>
                        prev.filter((_, idx) => idx !== i)
                      )
                    }
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-4">
          <h2 className="font-sans text-xl font-light mb-2">Measurements</h2>

          {/* Required Measurements */}
          <label className="block font-medium">Required Measurements</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              name="size"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
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
            <input
              name="customSize"
              placeholder="Other size (if any)"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <input
              name="waist"
              placeholder="Waist"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <input
              name="bust"
              placeholder="Bust"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <input
              name="hips"
              placeholder="Hips"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <input
              name="height"
              placeholder="Height"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Optional Measurements */}
          <label className="block font-medium mt-6">
            Optional Measurements
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              name="braBand"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="">Bra Band Size</option>
              {["28", "30", "32", "34", "36", "38", "40", "42", "44"].map(
                (size) => (
                  <option key={size}>{size}</option>
                )
              )}
            </select>
            <select
              name="braCup"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="">Bra Cup Size</option>
              {["A", "B", "C", "D", "DD", "E", "F", "G"].map((cup) => (
                <option key={cup}>{cup}</option>
              ))}
            </select>
            {/* Additional optional fields */}
            <input
              name="underBust"
              placeholder="Under Bust"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <input
              name="shoulderSpan"
              placeholder="Shoulder Span"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <input
              name="inseam"
              placeholder="Inseam"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <input
              name="armLength"
              placeholder="Arm Length"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <input
              name="bicep"
              placeholder="Bicep"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <input
              name="wrist"
              placeholder="Wrist"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <input
              name="neckCircumference"
              placeholder="Neck Circumference"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <input
              name="thigh"
              placeholder="Thigh"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <input
              name="calf"
              placeholder="Calf"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <input
              name="shoulderToWaist"
              placeholder="Shoulder to Waist"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <textarea
            name="otherMeasurements"
            placeholder="Any other measurements"
            onChange={handleChange}
            className="w-full border p-2 rounded mt-2"
          />
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-4">
          <h2 className="font-sans text-xl font-light mb-2">
            Features and Construction
          </h2>
          <h2 className="font-sans text-xl font-light mt-6 mb-2">Pockets</h2>
          <div className="space-y-2">
            {["No pockets", "Hidden/secret pockets"].map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  name={option}
                  onChange={handleChange}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
            <input
              name="pocketOther"
              placeholder="Other (pockets)"
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <h2 className="font-sans text-xl font-light mt-6 mb-2">Closures</h2>
          <div className="space-y-2">
            {[
              "Zipper (exposed)",
              "Zipper (hidden/invisible)",
              "Buttons (functional)",
              "Buttons (decorative)",
              "Hook & eye",
              "Lacing",
              "Snaps",
              "Velcro",
              "Tie closure",
            ].map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  name={option}
                  onChange={handleChange}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
            <input
              name="closureOther"
              placeholder="Other (closure)"
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <h2 className="font-sans text-xl font-light mt-6 mb-2">Lining</h2>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="lining"
              onChange={handleChange}
              className="mr-2"
            />
            Include Lining
          </label>
          <input
            name="liningOther"
            placeholder="Other (lining)"
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />

          <h2 className="font-sans text-xl font-light mt-6 mb-2">Fit</h2>
          <div className="space-y-2">
            {["tailored", "tight", "relaxed"].map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  name={option}
                  onChange={handleChange}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
            <input
              name="fitOther"
              placeholder="Other (fit)"
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <textarea
            name="additionalInfo"
            placeholder="Any additional instructions or comments"
            onChange={handleChange}
            className="w-full border p-2 rounded mt-6"
          />
          

        </div>
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-4">
          <h2 className="font-sans text-xl font-light mb-2">
            Budget & Timeline
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="budget"
              placeholder="Budget Range"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <input
              name="deadline"
              placeholder="Ideal Deadline or Event Date"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <div>
            <select
              name="rushOrder"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="">Rush Order?</option>
              <option>Yes</option>
              <option>No</option>
            </select>
            </div>
            <div className="space-y-2">
            {[
              "Fabric Swatch Approval",
              "Sketch Approval",
              "Progress updates (messages)",
              "Progress updates (photos)",
              "None (surprise me)",
            ].map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  name={option}
                  onChange={handleChange}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
            <input
              name="followUpOther"
              placeholder="Other (follow-up)"
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>
          </div>
              
          <h2 className="font-sans text-xl font-light mt-6 mb-2 text-center">
            Customer Info
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="Name"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <input
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <input
              name="preferredContact"
              placeholder="Preferred Contact Method"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>
          {/* --- Submit Button --- */}
          <div className="pt-2 text-center">
            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 text-lg font-medium transition-all"
            >
              Submit
            </button>
          </div>
        </div>
        {/* --- End: Budget, Timeline & Final Details (Card 4) --- */}
      </form>
    </div>
  );
}
