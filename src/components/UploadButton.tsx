// === FILE: src/components/UploadButton.tsx ===
// This file defines a button component that allows users to upload files using Uploadthing's dropzone

"use client";

import { UploadDropzone } from "@/utils/uploadthing";
import { useState } from "react";

export default function UploadButton({
  onUploadComplete,
}: {
  onUploadComplete: (urls: string[]) => void;
}) {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  return (
    <div className="my-4">
      <UploadDropzone
        endpoint="productImage"
        onClientUploadComplete={(res) => {
          const urls = res.map((r) => r.url);
          setUploadedUrls(urls);
          onUploadComplete(urls);
        }}
        onUploadError={(err) => {
          alert(`Upload failed: ${err.message}`);
        }}
        appearance={{
          container:
            "border border-dashed border-gray-400 p-4 rounded-md w-full max-w-md mx-auto",
          uploadIcon: "w-10 h-10 text-gray-500 mx-auto",
          label: "text-center text-sm text-gray-600 mt-2",
          button:
            "mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 cursor-pointer",
        }}
        content={{
          label: "Click here or drag and drop to upload your files!",
          button: ({ files }) =>
            files.length === 0
              ? "Waiting for file uploads"
              : `Upload ${files.length} file${files.length > 1 ? "s" : ""}`,
        }}
      />

      {uploadedUrls.length > 0 && (
        <ul className="mt-4 text-sm text-gray-700 space-y-1">
          {uploadedUrls.map((url, i) => (
            <li key={i}>
              ✅ Uploaded:{" "}
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="underline text-blue-600"
              >
                {url}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
