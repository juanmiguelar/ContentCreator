import { discoverPosts } from "@/lib/content/store";
import { Library } from "@/components/library/Library";
export const dynamic = "force-dynamic";
export default async function Home() {
  const data = await discoverPosts();
  return <Library {...data} />;
}
