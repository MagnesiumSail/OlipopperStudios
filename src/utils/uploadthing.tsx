// === FILE: src/utils/uploadthing.tsx ===
// This file defines a utility for generating an upload dropzone using Uploadthing in a Next.js application.

import { generateUploadDropzone } from "@uploadthing/react";
import { createUploadthing, type FileRouter } from "uploadthing/server";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { getServerSession } from "next-auth"; // Import getServerSession from next-auth
import { prisma } from "@/lib/prisma"; // Import prisma client

const f = createUploadthing();

export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

export const ourFileRouter = {
  patternPdf: f({
    pdf: { maxFileSize: "16MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await getServerSession();
      if (!session?.user) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file }) => {
      // Optionally save PDF to a media library
      await prisma.mediaLibrary.upsert({
        where: { url: file.ufsUrl },
        update: {},
        create: { url: file.ufsUrl },
      });
      return { url: file.ufsUrl };
    }),
  // ...rest
} satisfies FileRouter;