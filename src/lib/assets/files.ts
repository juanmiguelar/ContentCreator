import { assetSchema } from "../../schemas/post";
import type { z } from "zod";
export const ASSET_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp", "svg"]);
export const ASSET_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  svg: "image/svg+xml",
};
export function missingAssets(
  assets: z.infer<typeof assetSchema>[],
  exists: (source: string) => boolean,
) {
  return assets.filter((a) => !a.source || !exists(a.source)).map((a) => a.id);
}
export function validateImage(bytes: Uint8Array, extension: string) {
  const b = Buffer.from(bytes);
  if (
    !ASSET_EXTENSIONS.has(extension) ||
    b.length === 0 ||
    b.length > 15 * 1024 * 1024
  )
    throw new Error("Use PNG, JPG, WEBP or SVG up to 15 MB");
  const valid =
    extension === "png"
      ? b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      : ["jpg", "jpeg"].includes(extension)
        ? b[0] === 255 && b[1] === 216 && b[2] === 255
        : extension === "webp"
          ? b.toString("ascii", 0, 4) === "RIFF" &&
            b.toString("ascii", 8, 12) === "WEBP"
          : /<svg[\s>]/i.test(b.toString("utf8"));
  if (!valid)
    throw new Error("File content does not match its image extension");
  // SVG is served with a sandbox CSP and displayed only through <img>.
}
