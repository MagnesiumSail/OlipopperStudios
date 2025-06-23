'use client';

import { UploadDropzone } from '@uploadthing/react';
import { useState } from 'react';
import type { OurFileRouter } from '@/app/api/uploadthing/core';

export default function UploadButton({
  onUploadComplete,
}: {
  onUploadComplete: (urls: string[]) => void;
}) {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  return (
    <div className="my-4">
      <UploadDropzone<OurFileRouter>
        endpoint="productImage"
        onClientUploadComplete={(res) => {
          const urls = res.map(r => r.url);
          setUploadedUrls(urls);
          onUploadComplete(urls);
        }}
        onUploadError={(err) => {
          alert(`Upload failed: ${err.message}`);
        }}
        appearance={{
          container: 'border p-4 rounded border-dashed border-gray-400',
          button: 'bg-black text-white px-4 py-2 rounded mt-2',
        }}
      />

      {uploadedUrls.length > 0 && (
        <ul className="mt-4 text-sm text-gray-700 space-y-1">
          {uploadedUrls.map((url, i) => (
            <li key={i}>
              ✅ Uploaded: <a href={url} target="_blank" rel="noreferrer" className="underline text-blue-600">{url}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
