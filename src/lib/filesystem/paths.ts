import path from "node:path";
import { lstat, realpath } from "node:fs/promises";
export const POST_KEY =
  /^\d{4}\/(?:0[1-9]|1[0-2])\/week-0[1-4]\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
export function validatePostKey(key: string) {
  if (key.length > 140 || !POST_KEY.test(key))
    throw new Error("Invalid post key");
  return key;
}
export function inside(root: string, relative: string) {
  if (
    !relative ||
    relative.includes("\\") ||
    relative.includes("\0") ||
    path.isAbsolute(relative) ||
    relative.split("/").some((s) => !s || s === "." || s === "..")
  )
    throw new Error("Invalid path");
  const resolved = path.resolve(root, relative);
  if (!resolved.startsWith(path.resolve(root) + path.sep))
    throw new Error("Path escapes repository");
  return resolved;
}
// Reject every symlink, including dangling ones and intermediate directories.
export async function safePath(root: string, relative: string) {
  const target = inside(root, relative);
  const rootInfo = await lstat(root);
  if (rootInfo.isSymbolicLink() || !rootInfo.isDirectory())
    throw new Error("Unsafe repository root");
  const resolvedRoot = await realpath(root);
  let current = root;
  for (const segment of relative.split("/")) {
    current = path.join(current, segment);
    try {
      const info = await lstat(current);
      if (info.isSymbolicLink()) throw new Error("Symlinks are not allowed");
      const resolved = await realpath(current);
      if (!resolved.startsWith(resolvedRoot + path.sep))
        throw new Error("Path escapes repository");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }
  return target;
}
