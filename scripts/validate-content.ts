import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { listContentStyles } from "../content-styles/loader";
import { safePath } from "../src/lib/filesystem/paths";
import { discoverPosts } from "../src/lib/content/store";
async function main() {
  const { posts, errors } = await discoverPosts();
  for (const style of listContentStyles()) {
    for (const file of [
      "STYLE.md",
      "index.ts",
      "tokens.ts",
      "rules.ts",
      "templates/portrait.ts",
      "templates/square.ts",
      "templates/story.ts",
    ]) {
      try {
        await access(
          await safePath(
            path.join(process.cwd(), "content-styles"),
            `${style.id}/${file}`,
          ),
        );
      } catch {
        errors.push(
          `Content Style ${style.id}: required file ${file} is missing or unsafe.`,
        );
      }
    }
    for (const asset of Object.values(style.assets)) {
      try {
        await access(
          asset.source.startsWith("/assets/")
            ? await safePath(
                path.join(process.cwd(), "public/assets"),
                asset.source.slice(8),
              )
            : await safePath(
                path.join(process.cwd(), "content-styles"),
                `${style.id}/${asset.source}`,
              ),
        );
      } catch {
        errors.push(
          `Content Style ${style.id}: asset ${asset.source} is missing or unsafe.`,
        );
      }
    }
  }
  for (const post of posts) {
    const css = await readFile(
      await safePath(
        path.join(process.cwd(), "content"),
        `${post.key}/post.module.css`,
      ),
      "utf8",
    );
    if (
      /#[0-9a-f]{3,8}\b|(?:rgb|hsl)a?\(|(?<![\w-])\d+(?:\.\d+)?px\b/i.test(
        css,
      ) ||
      [...css.matchAll(/font-family\s*:\s*([^;{}]+)/gi)].some(
        (match) => !match[1].trim().startsWith("var("),
      )
    )
      errors.push(
        `${post.key}: use Content Style tokens for CSS colors, font families and pixel lengths.`,
      );
    errors.push(...post.warnings.map((w) => `${post.key}: ${w}`));
    const required = post.metadata.requiredAssets.filter(
      (a) => !a.optional && post.missingAssets.includes(a.id),
    );
    if (
      ["ready", "published"].includes(post.metadata.status) &&
      required.length
    )
      errors.push(
        `${post.key}: required assets missing: ${required.map((a) => a.id).join(", ")}`,
      );
  }
  if (errors.length) {
    for (const error of errors) console.error(error);
    process.exitCode = 1;
  } else
    console.log(
      `Validated ${posts.length} post(s): metadata, folders, dates and required assets.`,
    );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
