// === FILE: src/app/api/uploadthing/route.ts ===
// This file handles the Uploadthing file upload API routes.

import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({ router: ourFileRouter });
