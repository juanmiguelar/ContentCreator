import { discoverAssets } from "@/lib/content/store";
import { Assets } from "@/components/library/Assets";
export const dynamic = "force-dynamic";
export default async function AssetsPage() {
  return <Assets assets={await discoverAssets()} />;
}
