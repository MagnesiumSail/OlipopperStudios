// === FILE: src/app/api/uploadthing/core.ts ===
// This file handles the Uploadthing file upload configuration and API routes.

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth"; // Adjust if you use a different session system
import { prisma } from "@/lib/prisma"; // Adjust the import path as needed

const f = createUploadthing();

export const ourFileRouter = {
  productImage: f({
    image: { maxFileSize: "8MB", maxFileCount: 4 },
    pdf: { maxFileSize: "16MB", maxFileCount: 1 }
  })
    .middleware(async () => {
      const session = await getServerSession();
      if (!session?.user) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Save to your media library DB
      await prisma.mediaLibrary.upsert({
        where: { url: file.ufsUrl },
        update: {},
        create: {
          url: file.ufsUrl,
        },
      });

      console.log("Uploaded and saved:", file.ufsUrl);
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
