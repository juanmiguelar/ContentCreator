import { uploadAsset, InputError } from "@/lib/content/store";
import { apiError, assertLocal } from "@/lib/filesystem/http";
import { slugSchema } from "@/schemas/post";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    assertLocal(request, true);
    if (Number(request.headers.get("content-length")) > 16 * 1024 * 1024)
      return Response.json({ error: "File exceeds 15 MB" }, { status: 413 });
    const form = await request.formData(),
      file = form.get("file");
    if (!(file instanceof File) || file.size > 15 * 1024 * 1024)
      throw new InputError("Choose an image up to 15 MB");
    const extension = file.name.split(".").pop()!.toLowerCase();
    return Response.json(
      await uploadAsset(
        String(form.get("key")),
        slugSchema.parse(form.get("slot")),
        extension,
        new Uint8Array(await file.arrayBuffer()),
        String(form.get("revision")),
      ),
    );
  } catch (error) {
    return apiError(error);
  }
}
