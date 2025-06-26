// === FILE: src/utils/uploadthing.tsx ===
// This file defines a utility for generating an upload dropzone using Uploadthing in a Next.js application.

import { generateUploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
