import { createHash, randomUUID } from "node:crypto";
import {
  readFile,
  writeFile,
  readdir,
  mkdir,
  rename,
  access,
  rm,
} from "node:fs/promises";
import path from "node:path";
import { postSchema, type PostMetadata } from "../../schemas/post";
import { calendarFromDate } from "./formats";
import { safePath, validatePostKey, POST_KEY } from "../filesystem/paths";
import {
  ASSET_EXTENSIONS,
  missingAssets,
  validateImage,
} from "../assets/files";
import type { AssetRecord, PostRecord } from "../../types/post";
import { generateRegistry } from "./registry-generator";
import { starterCss, starterSource } from "./starter";

export class ConflictError extends Error {}
export class InputError extends Error {}
export const CONTENT_ROOT = path.join(process.cwd(), "content");
export const ASSETS_ROOT = path.join(process.cwd(), "public/assets");
// Survives development module reloads; serialize writes so revisions are checked inside the lock.
const globalStore = globalThis as typeof globalThis & {
  studioQueue?: Promise<unknown>;
};
function mutate<T>(operation: () => Promise<T>): Promise<T> {
  const next = (globalStore.studioQueue ?? Promise.resolve()).then(operation);
  globalStore.studioQueue = next.catch(() => {});
  return next;
}
function revision(metadata: string, caption: string) {
  return createHash("sha256")
    .update(metadata)
    .update("\0")
    .update(caption)
    .digest("hex");
}
async function file(key: string, name: string) {
  return safePath(CONTENT_ROOT, `${validatePostKey(key)}/${name}`);
}
async function atomicWrite(target: string, body: string | Uint8Array) {
  const temporary = `${target}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporary, body, { flag: "wx" });
    await rename(temporary, target);
  } finally {
    await rm(temporary, { force: true });
  }
}
export function consistencyWarnings(key: string, metadata: PostMetadata) {
  const [year, month, week, slug] = key.split("/");
  const expected = { year: +year, month: +month, week: +week.slice(-2) };
  const warnings: string[] = [];
  if (metadata.id !== slug)
    warnings.push("The metadata ID differs from the directory slug.");
  if (
    Object.keys(expected).some(
      (k) =>
        expected[k as keyof typeof expected] !==
        metadata.calendar[k as keyof typeof expected],
    )
  )
    warnings.push(
      "Calendar metadata differs from the physical directory. Files have not been moved.",
    );
  if (
    metadata.publishDate &&
    JSON.stringify(calendarFromDate(metadata.publishDate)) !==
      JSON.stringify(expected)
  )
    warnings.push(
      "Publish date falls outside this editorial folder. Move the directory manually and update its calendar metadata if intended.",
    );
  return warnings;
}
export async function readPost(key: string): Promise<PostRecord> {
  const [raw, caption] = await Promise.all([
    readFile(await file(key, "post.json"), "utf8"),
    readFile(await file(key, "caption.md"), "utf8"),
  ]);
  const metadata = postSchema.parse(JSON.parse(raw));
  const available = new Set<string>();
  for (const asset of metadata.requiredAssets) {
    if (!asset.source) continue;
    try {
      const target = asset.source.startsWith("/assets/")
        ? await safePath(ASSETS_ROOT, asset.source.slice(8))
        : await file(key, asset.source);
      await access(target);
      available.add(asset.source);
    } catch {
      /* missing or unsafe asset */
    }
  }
  const warnings = consistencyWarnings(key, metadata);
  try {
    await access(await file(key, "Post.tsx"));
  } catch {
    warnings.push(
      "Post.tsx is missing. Add a composition and regenerate the registry.",
    );
  }
  return {
    key,
    metadata,
    caption,
    revision: revision(raw, caption),
    warnings,
    missingAssets: missingAssets(metadata.requiredAssets, (src) =>
      available.has(src),
    ),
  };
}
export async function discoverPosts(): Promise<{
  posts: PostRecord[];
  errors: string[];
}> {
  const posts: PostRecord[] = [],
    errors: string[] = [];
  async function walk(relative: string, depth: number) {
    const target = relative
      ? await safePath(CONTENT_ROOT, relative)
      : CONTENT_ROOT;
    for (const entry of await readdir(target, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.isSymbolicLink()) continue;
      const next = relative ? `${relative}/${entry.name}` : entry.name;
      if (depth === 3) {
        if (!POST_KEY.test(next)) {
          errors.push(`Skipped invalid content path: ${next}`);
          continue;
        }
        try {
          posts.push(await readPost(next));
        } catch (error) {
          errors.push(
            `${next}: ${error instanceof Error ? error.message : "Invalid post"}`,
          );
        }
      } else await walk(next, depth + 1);
    }
  }
  await walk("", 0);
  posts.sort((a, b) =>
    (b.metadata.publishDate ?? b.key).localeCompare(
      a.metadata.publishDate ?? a.key,
    ),
  );
  return { posts, errors };
}
export async function savePost(
  key: string,
  update: { metadata?: PostMetadata; caption?: string; revision: string },
) {
  return mutate(async () => {
    const existing = await readPost(key);
    if (existing.revision !== update.revision)
      throw new ConflictError(
        "Files changed since opening this post. Reload before saving.",
      );
    if (update.metadata) {
      const parsed = postSchema.parse(update.metadata);
      if (
        parsed.id !== existing.metadata.id ||
        JSON.stringify(parsed.calendar) !==
          JSON.stringify(existing.metadata.calendar)
      )
        throw new InputError(
          "Move calendar folders and change IDs manually, then regenerate the registry.",
        );
      await atomicWrite(
        await file(key, "post.json"),
        JSON.stringify(parsed, null, 2) + "\n",
      );
    }
    if (update.caption !== undefined)
      await atomicWrite(await file(key, "caption.md"), update.caption);
    return readPost(key);
  });
}
export async function uploadAsset(
  key: string,
  slot: string,
  extension: string,
  bytes: Uint8Array,
  expectedRevision: string,
) {
  validateImage(bytes, extension);
  return mutate(async () => {
    const post = await readPost(key);
    if (post.revision !== expectedRevision)
      throw new ConflictError(
        "Files changed. Save or reload before uploading.",
      );
    const asset = post.metadata.requiredAssets.find((a) => a.id === slot);
    if (!asset) throw new InputError("Unknown asset slot");
    const directory = await file(key, "assets");
    await mkdir(directory, { recursive: true });
    // Content hash avoids stale cached exports when replacing an image.
    const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 12);
    const source = `assets/${slot}-${hash}.${extension}`;
    await atomicWrite(await file(key, source), bytes);
    asset.source = source;
    asset.status = "provided";
    await atomicWrite(
      await file(key, "post.json"),
      JSON.stringify(post.metadata, null, 2) + "\n",
    );
    return readPost(key);
  });
}
export async function discoverAssets(): Promise<AssetRecord[]> {
  const results: AssetRecord[] = [];
  async function walk(relative: string) {
    const target = relative
      ? await safePath(ASSETS_ROOT, relative)
      : ASSETS_ROOT;
    for (const entry of await readdir(target, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) continue;
      const next = relative ? `${relative}/${entry.name}` : entry.name;
      if (entry.isDirectory()) await walk(next);
      else if (ASSET_EXTENSIONS.has(entry.name.split(".").pop()!.toLowerCase()))
        results.push({
          path: `/assets/${next}`,
          name: entry.name,
          category: relative || "miscellaneous",
        });
    }
  }
  await walk("");
  return results.sort((a, b) => a.path.localeCompare(b.path));
}
export async function createPost(input: {
  id: string;
  title: string;
  date: string;
}) {
  return mutate(async () => {
    const calendar = calendarFromDate(input.date);
    const key = `${calendar.year}/${String(calendar.month).padStart(2, "0")}/week-0${calendar.week}/${input.id}`;
    validatePostKey(key);
    const target = await safePath(CONTENT_ROOT, key);
    await mkdir(path.dirname(target), { recursive: true });
    try {
      await mkdir(target);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "EEXIST")
        throw new ConflictError(
          "A post with this slug already exists in this week.",
        );
      throw error;
    }
    const metadata = postSchema.parse({
      id: input.id,
      title: input.title,
      platform: ["instagram"],
      status: "idea",
      calendar,
      publishDate: input.date,
      formats: ["portrait", "square", "story"],
      slides: [{ id: "cover", order: 1, label: "Cover" }],
      copy: {
        headline: input.title,
        body: "Draft composition. Ask Codex to design this post using DESIGN.md.",
      },
    });
    await mkdir(path.join(target, "assets"));
    await Promise.all([
      writeFile(
        path.join(target, "post.json"),
        JSON.stringify(metadata, null, 2) + "\n",
      ),
      writeFile(path.join(target, "caption.md"), ""),
      writeFile(path.join(target, "Post.tsx"), starterSource),
      writeFile(path.join(target, "post.module.css"), starterCss),
    ]);
    await generateRegistry();
    return readPost(key);
  });
}
