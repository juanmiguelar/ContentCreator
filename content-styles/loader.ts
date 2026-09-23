import { contentStyleSchema, type ContentStyle } from "./schema";
import defaultStyle from "./default";
import webParaConsultorios from "./web-para-consultorios";

export class ContentStyleError extends Error {}
// One explicit registration point. Never load a client-supplied module path.
const definitions: unknown[] = [defaultStyle, webParaConsultorios];
export function createContentStyleRegistry(packs: unknown[]) {
  const registry = new Map<string, ContentStyle>();
  for (const pack of packs) {
    const parsed = contentStyleSchema.safeParse(pack);
    if (!parsed.success)
      throw new ContentStyleError(
        `Invalid Content Style: ${parsed.error.message}`,
      );
    if (registry.has(parsed.data.id))
      throw new ContentStyleError(`Duplicate Content Style: ${parsed.data.id}`);
    registry.set(parsed.data.id, deepFreeze(parsed.data));
  }
  return {
    get(id: string) {
      const style = registry.get(id);
      if (!style)
        throw new ContentStyleError(
          `Unknown Content Style "${id}". Register the pack in content-styles/loader.ts.`,
        );
      return style;
    },
    list() {
      return [...registry.values()];
    },
  };
}
function deepFreeze<T extends object>(value: T): T {
  Object.values(value).forEach((child) => {
    if (child && typeof child === "object") deepFreeze(child);
  });
  return Object.freeze(value);
}
const registry = createContentStyleRegistry(definitions);
export const getContentStyle = registry.get;
export const listContentStyles = registry.list;
export function contentStyleAssetUrl(styleId: string, assetId: string) {
  const asset = getContentStyle(styleId).assets[assetId];
  if (!asset)
    throw new ContentStyleError(
      `Unknown asset "${assetId}" in Content Style "${styleId}"`,
    );
  return `/api/style-asset?style=${encodeURIComponent(styleId)}&asset=${encodeURIComponent(assetId)}`;
}
