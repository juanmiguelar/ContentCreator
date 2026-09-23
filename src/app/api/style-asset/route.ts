import path from "node:path";
import { readFile } from "node:fs/promises";
import {
  getContentStyle,
  ContentStyleError,
} from "../../../../content-styles/loader";
import { safePath } from "@/lib/filesystem/paths";
import { ASSET_MIME } from "@/lib/assets/files";
import { assertLocal, apiError } from "@/lib/filesystem/http";
export const runtime = "nodejs";
export async function GET(request: Request) {
  try {
    assertLocal(request);
    const query = new URL(request.url).searchParams;
    const style = getContentStyle(query.get("style") ?? ""),
      asset = style.assets[query.get("asset") ?? ""];
    if (!asset) throw new ContentStyleError("Unknown Content Style asset");
    const target = asset.source.startsWith("/assets/")
      ? await safePath(
          path.join(process.cwd(), "public/assets"),
          asset.source.slice(8),
        )
      : await safePath(
          path.join(process.cwd(), "content-styles"),
          `${style.id}/${asset.source}`,
        );
    return new Response(new Uint8Array(await readFile(target)), {
      headers: {
        "Content-Type": ASSET_MIME[asset.source.split(".").pop()!],
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy":
          "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      },
    });
  } catch (error) {
    return apiError(error);
  }
}
