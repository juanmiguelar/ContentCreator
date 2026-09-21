import { readFile } from "node:fs/promises";
import { CONTENT_ROOT, ASSETS_ROOT, InputError } from "@/lib/content/store";
import { safePath, validatePostKey } from "@/lib/filesystem/paths";
import { ASSET_EXTENSIONS, ASSET_MIME } from "@/lib/assets/files";
import { apiError, assertLocal } from "@/lib/filesystem/http";
export const runtime = "nodejs";
export async function GET(request: Request) {
  try {
    assertLocal(request);
    const search = new URL(request.url).searchParams;
    const source = search.get("source") ?? "";
    const extension = source.split(".").pop()!.toLowerCase();
    if (!ASSET_EXTENSIONS.has(extension))
      throw new InputError("Invalid asset extension");
    let target: string;
    if (source.startsWith("/assets/"))
      target = await safePath(ASSETS_ROOT, source.slice(8));
    else {
      if (
        !/^assets\/[a-zA-Z0-9][a-zA-Z0-9_-]*\.(png|jpe?g|webp|svg)$/.test(
          source,
        )
      )
        throw new InputError("Invalid asset path");
      target = await safePath(
        CONTENT_ROOT,
        `${validatePostKey(search.get("key") ?? "")}/${source}`,
      );
    }
    return new Response(new Uint8Array(await readFile(target)), {
      headers: {
        "Content-Type": ASSET_MIME[extension],
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy":
          "default-src 'none'; style-src 'unsafe-inline'; sandbox",
        "Content-Disposition": "inline",
      },
    });
  } catch (error) {
    return apiError(error);
  }
}
