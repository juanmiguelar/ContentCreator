import { discoverPosts } from "../src/lib/content/store";
async function main() {
  const { posts, errors } = await discoverPosts();
  for (const post of posts) {
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
