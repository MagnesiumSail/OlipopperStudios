// src/utils/uploadthing.tsx
import { generateUploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// Creates a strongly-typed UploadDropzone for your file router.
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
