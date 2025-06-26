// === FILE: src/components/MediaLibraryPicker.tsx ===
// This file defines a media library picker component that allows users to select images from their uploaded media

'use client';

import { useEffect, useState } from 'react';

export default function MediaLibraryPicker({
  onSelect,
}: {
  onSelect: (url: string) => void;
}) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/media-library')
      .then(res => res.json())
      .then(data => {
        setImages(data.map((img: any) => img.url));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-gray-500">Loading media library…</p>;

  if (images.length === 0) return <p className="text-sm text-gray-500">No uploaded images yet.</p>;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
      {images.map((url, i) => (
        <button
          key={i}
          onClick={() => onSelect(url)}
          type="button"
          className="border border-gray-300 rounded hover:border-black"
        >
          <img src={url} alt={`media-${i}`} className="w-full h-24 object-cover rounded" />
        </button>
      ))}
    </div>
  );
}
