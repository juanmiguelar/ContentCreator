import { cp, mkdir, symlink, readFile, writeFile } from "node:fs/promises";
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
    "content-styles",
    "public",
    "next.config.ts",
    "tsconfig.json",
    "package.json",
  ])
    await cp(path.join(process.cwd(), file), path.join(destination, file), {
      recursive: true,
    });
  // This second pack exists only in the disposable test checkout.
  const fixture = path.join(destination, "content-styles/test-style");
  await mkdir(path.join(fixture, "assets"), { recursive: true });
  await writeFile(
    path.join(fixture, "index.ts"),
    `import neutral from "../default";
export default { ...neutral, id: "test-style", name: "Test style", description: "Isolated validation fixture",
  tokens: { ...neutral.tokens, colors: { ...neutral.tokens.colors, canvas: "#e8e8e4" }, typography: { ...neutral.tokens.typography, bodyFamily: "Georgia, serif", labelFamily: "Georgia, serif" }, spacing: { ...neutral.tokens.spacing, gutter: 80 }, layout: { ...neutral.tokens.layout, columns: "1fr 1fr" } },
  templates: { ...neutral.templates, portrait: { ...neutral.templates.portrait, layout: "split" } },
  assets: { ...neutral.assets, proof: { source: "assets/proof.svg", alt: "Fixture outline", role: "motif" } }
};`,
  );
  await writeFile(
    path.join(fixture, "assets/proof.svg"),
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path d="M1 1h8v8H1z" fill="none" stroke="#484d45"/></svg>',
  );
  const registry = path.join(destination, "content-styles/loader.ts");
  await writeFile(
    registry,
    (await readFile(registry, "utf8"))
      .replace(
        'import defaultStyle from "./default";',
        'import defaultStyle from "./default";\nimport testStyle from "./test-style";',
      )
      .replace(
        "const definitions: unknown[] = [defaultStyle, webParaConsultorios];",
        "const definitions: unknown[] = [defaultStyle, webParaConsultorios, testStyle];",
      ),
  );
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
