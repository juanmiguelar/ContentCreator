import { discoverAssets } from "@/lib/content/store";
import { apiError, assertLocal } from "@/lib/filesystem/http";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    assertLocal(request);
    return Response.json(await discoverAssets());
  } catch (error) {
    return apiError(error);
  }
}
