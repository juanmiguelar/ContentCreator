import { createPost, discoverPosts } from "@/lib/content/store";
import { createSchema } from "@/schemas/post";
import { apiError, assertLocal } from "@/lib/filesystem/http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    assertLocal(request);
    return Response.json(await discoverPosts());
  } catch (error) {
    return apiError(error);
  }
}
export async function POST(request: Request) {
  try {
    assertLocal(request, true);
    return Response.json(
      await createPost(createSchema.parse(await request.json())),
      { status: 201 },
    );
  } catch (error) {
    return apiError(error);
  }
}
