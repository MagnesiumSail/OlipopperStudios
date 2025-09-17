// src/app/api/public/site-flags/route.ts
import { NextResponse } from "next/server";
import { getPurchasingPaused } from "@/lib/siteSettings";

export async function GET() {
  const purchasingPaused = await getPurchasingPaused();
  console.log("Reached site-flags route!");
  return NextResponse.json(
    { purchasingPaused },
    { headers: { "Cache-Control": "public, max-age=15" } }
  );
}
