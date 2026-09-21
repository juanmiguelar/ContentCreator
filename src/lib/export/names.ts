import type { SocialFormat } from "../content/formats";
import { slugSchema } from "../../schemas/post";
export function exportFilename(
  id: string,
  format: SocialFormat,
  index: number,
  type: "jpg" | "png",
) {
  slugSchema.parse(id);
  if (!Number.isInteger(index) || index < 1)
    throw new Error("Invalid slide index");
  return `${id}-${format}-${String(index).padStart(2, "0")}.${type}`;
}
