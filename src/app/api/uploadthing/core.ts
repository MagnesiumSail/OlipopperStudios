import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth"; // Adjust if you use a different session system

const f = createUploadthing();

export const ourFileRouter = {
  productImage: f({
    image: { maxFileSize: "8MB", maxFileCount: 4 },
  })
    .middleware(async () => {
      const session = await getServerSession();
      if (!session?.user) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log("Uploaded image:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
