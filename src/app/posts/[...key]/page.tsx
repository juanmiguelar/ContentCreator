import { notFound } from "next/navigation";
import { readPost, discoverAssets } from "@/lib/content/store";
import { PostEditor } from "@/components/editor/PostEditor";
import { POST_KEY } from "@/lib/filesystem/paths";
export const dynamic = "force-dynamic";
export default async function PostPage({
  params,
}: {
  params: Promise<{ key: string[] }>;
}) {
  const key = (await params).key.join("/");
  if (!POST_KEY.test(key)) notFound();
  const initial = await readPost(key).catch((error) => {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") notFound();
    throw error;
  });
  const assets = await discoverAssets();
  return <PostEditor initial={initial} assets={assets} />;
}
