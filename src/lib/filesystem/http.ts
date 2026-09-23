import { ContentStyleError } from "../../../content-styles/loader";
import { ZodError } from "zod";
import { ConflictError, InputError } from "../content/store";
export function assertLocal(request: Request, mutation = false) {
  const url = new URL(request.url);
  const authority = request.headers.get("host");
  const host = authority?.split(":")[0];
  if (
    !["localhost", "127.0.0.1"].includes(url.hostname) ||
    !host ||
    !["localhost", "127.0.0.1"].includes(host)
  )
    throw new InputError("This API is local-only");
  if (mutation) {
    const origin = request.headers.get("origin");
    if (
      !origin ||
      origin !== `${url.protocol}//${authority}` ||
      request.headers.get("sec-fetch-site") === "cross-site"
    )
      throw new InputError("A same-origin request is required");
  }
}
export function apiError(error: unknown) {
  if (error instanceof ZodError)
    return Response.json(
      {
        error: error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join("; "),
      },
      { status: 400 },
    );
  if (error instanceof ConflictError)
    return Response.json({ error: error.message }, { status: 409 });
  if ((error as NodeJS.ErrnoException).code === "ENOENT")
    return Response.json({ error: "File not found" }, { status: 404 });
  if (
    error instanceof InputError ||
    error instanceof ContentStyleError ||
    error instanceof SyntaxError ||
    (error instanceof Error &&
      /Invalid|Unsafe|Symlink|escapes|File content|Use PNG/.test(error.message))
  )
    return Response.json({ error: (error as Error).message }, { status: 400 });
  console.error(error);
  return Response.json(
    {
      error:
        "Could not complete the filesystem operation. Check the local server output.",
    },
    { status: 500 },
  );
}
