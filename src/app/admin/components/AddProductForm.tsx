// === FILE: src/app/admin/components/AddProductForm.tsx ===
// This file contains the form for adding a new product in the admin panel.

"use client";

import { useState, useEffect } from "react";
import UploadButton from "@/components/UploadButton";
import MediaLibraryPicker from "@/components/MediaLibraryPicker";
import { UploadDropzone } from "@/utils/uploadthing";

export default function AddProductForm({
  onProductAdded,
}: {
  onProductAdded: () => void;
}) {
  const [patternPdfUrl, setPatternPdfUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");
  const [sizes, setSizes] = useState<string>("");
  const [sizeGuideId, setSizeGuideId] = useState<number | "">("");
  const [sizeGuides, setSizeGuides] = useState<{ id: number; name: string }[]>(
    []
  );
  const [isPattern, setIsPattern] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const ALLOWED_TAGS = [
    "dress",
    "top",
    "bottom",
    "set",
    "outerwear",
    "accessories",
    "pattern",
  ];

  useEffect(() => {
    fetch("/api/admin/size-guides")
      .then((res) => res.json())
      .then(setSizeGuides)
      .catch(() => setSizeGuides([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const sizesArray = sizes
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: parseInt(price),
          description,
          tags,
          sizeGuideId: isPattern ? undefined : sizeGuideId || undefined,
          images: images.map((url, index) => ({ url, order: index })),
          isPattern,
          isActive,
          sizes: isPattern ? [] : sizesArray,
          patternPdfUrl: isPattern ? patternPdfUrl : null,
        }),
      });

      if (!res.ok) throw new Error("Failed to add product");

      setSuccess(true);
      onProductAdded();
      setName("");
      setPrice("");
      setDescription("");
      setTags([]);
      setSizeGuideId("");
      setImages([]);
      setIsPattern(false);
      setIsActive(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setImages((prev) => [...prev, imageInput.trim()]);
      setImageInput("");
    }
  };

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((img) => img !== url));
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 border rounded p-4">
      <h2 className="text-lg font-bold mb-2">Add New Product</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">Product added!</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Product Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Price in cents"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded col-span-full"
        />
        <label className="block font-medium mb-1 col-span-full">
          Tags (hold Ctrl/Cmd to select multiple)
        </label>
        <select
          multiple
          value={tags}
          onChange={(e) => {
            // Changed: Handle multi-select array
            const selected = Array.from(e.target.selectedOptions).map(
              (opt) => opt.value
            );
            setTags(selected);
          }}
          className="border p-2 rounded col-span-full"
          required
        >
          {ALLOWED_TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </option>
          ))}
        </select>

        <div className="mb-2">
          <label className="block mb-1 font-medium">
            Sizes (comma or space separated)
          </label>
          {!isPattern && (
            <input
              className="border p-2 rounded"
              placeholder="Sizes e.g. XS, S, M, L"
              value={sizes}
              onChange={(e) => setSizes(e.target.value)}
            />
          )}
        </div>

        <div className="col-span-full">
          <label className="block font-medium mb-1">Images</label>

          <UploadButton
            onUploadComplete={(urls) => {
              setImages((prev) => [...prev, ...urls]);
            }}
          />
          {images.length > 0 && (
            <ul className="list-disc pl-5 mt-2">
              {images.map((url, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center text-sm mb-1"
                >
                  <span className="truncate max-w-xs">{url}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setImages((prev) => prev.filter((img) => img !== url))
                    }
                    className="text-red-500 ml-2 text-xs"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-4">
          <p className="font-medium mb-1">Or select from existing images:</p>
          <MediaLibraryPicker
            onSelect={(url) => {
              setImages((prev) => [...prev, url]);
            }}
          />
        </div>

        {!isPattern && (
          <select
            value={sizeGuideId}
            onChange={(e) =>
              setSizeGuideId(e.target.value ? parseInt(e.target.value) : "")
            }
            className="border p-2 rounded col-span-full"
          >
            <option value="">No Size Guide</option>
            {sizeGuides.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        )}

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPattern}
            onChange={(e) => setIsPattern(e.target.checked)}
          />{" "}
          Is Pattern
        </label>
        {isPattern && (
          <div className="col-span-full">
            <label className="block font-medium mb-1">Pattern PDF</label>
            <UploadDropzone
              endpoint="productImage"
              onClientUploadComplete={(res) => {
                const url = res[0]?.url;
                if (url) setPatternPdfUrl(url);
              }}
              onUploadError={(err) => alert(`Upload failed: ${err.message}`)}
              appearance={{
                container:
                  "border border-dashed border-gray-400 p-4 rounded-md w-full max-w-md mx-auto",
                uploadIcon: "w-10 h-10 text-gray-500 mx-auto",
                label: "text-center text-sm text-gray-600 mt-2",
                button:
                  "mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 cursor-pointer",
              }}
            />
            {patternPdfUrl && (
              <div className="mt-2 text-sm text-green-700">
                ✅ Uploaded:{" "}
                <a href={patternPdfUrl} target="_blank" className="underline">
                  {patternPdfUrl}
                </a>
              </div>
            )}
          </div>
        )}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />{" "}
          Is Active
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
}
