import { cp, mkdir, symlink } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
async function main() {
  const destination = process.env.STUDIO_E2E_DIR;
  if (!destination || path.resolve(destination) === process.cwd())
    throw new Error("An isolated E2E directory is required");
  await mkdir(destination, { recursive: true });
  for (const file of [
    "src",
    "content",
    "public",
    "next.config.ts",
    "tsconfig.json",
    "package.json",
  ])
    await cp(path.join(process.cwd(), file), path.join(destination, file), {
      recursive: true,
    });
  await symlink(
    path.join(process.cwd(), "node_modules"),
    path.join(destination, "node_modules"),
  );
  const server = spawn(
    process.execPath,
    [
      path.join(process.cwd(), "node_modules/next/dist/bin/next"),
      "dev",
      "--webpack",
      "--hostname",
      "127.0.0.1",
      "--port",
      "3100",
    ],
    {
      cwd: destination,
      stdio: "inherit",
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    },
  );
  for (const signal of ["SIGINT", "SIGTERM"] as const)
    process.on(signal, () => server.kill(signal));
  server.on("exit", (code) => process.exit(code ?? 0));
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
