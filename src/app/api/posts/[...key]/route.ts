import { readPost, savePost } from "@/lib/content/store";
import { updateSchema } from "@/schemas/post";
import { apiError, assertLocal } from "@/lib/filesystem/http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ key: string[] }> };
export async function GET(request: Request, context: Context) {
  try {
    assertLocal(request);
    return Response.json(await readPost((await context.params).key.join("/")), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return apiError(error);
  }
}
export async function PATCH(request: Request, context: Context) {
  try {
    assertLocal(request, true);
    const text = await request.text();
    if (text.length > 250000)
      return Response.json({ error: "Request too large" }, { status: 413 });
    return Response.json(
      await savePost(
        (await context.params).key.join("/"),
        updateSchema.parse(JSON.parse(text)),
      ),
    );
  } catch (error) {
    return apiError(error);
  }
}
