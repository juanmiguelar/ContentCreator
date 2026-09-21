import { test, expect, type Download, type Page } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";
const key = "2026/09/week-03/example-post";
async function downloadBytes(download: Download) {
  return readFile((await download.path())!);
}
async function imageSize(page: Page, bytes: Buffer, type: string) {
  return page.evaluate(
    async ({ base64, type }) => {
      const image = new Image();
      image.src = `data:image/${type};base64,${base64}`;
      await image.decode();
      return [image.naturalWidth, image.naturalHeight];
    },
    { base64: bytes.toString("base64"), type },
  );
}
test("local content workflow: filters, edits, conflicts, uploads, all export formats and calendar", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Content library", exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/library-desktop.png",
    fullPage: true,
  });
  await page.getByLabel("Search content").fill("nothing-matches");
  await expect(page.getByText("No posts match these filters.")).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).last().click();
  await page.getByRole("link", { name: /A little structure/ }).click();
  await expect(
    page.getByRole("heading", { name: "Portrait", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Square", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Story", exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/post-desktop.png",
    fullPage: true,
  });
  const caption = page.getByRole("textbox", { name: "Caption", exact: true });
  await caption.fill("Edited locally. #Test #Git");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(
    page.getByText("Saved to post.json and caption.md. Ready for Git review."),
  ).toBeVisible();
  expect(
    await readFile(
      path.join(process.env.STUDIO_E2E_DIR!, "content", key, "caption.md"),
      "utf8",
    ),
  ).toBe("Edited locally. #Test #Git");
  await page.getByRole("button", { name: "Copy caption", exact: true }).click();
  await expect(page.getByText("Caption copied.")).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "Edited locally. #Test #Git",
  );
  await page
    .getByRole("combobox", { name: "Status", exact: true })
    .selectOption("published");
  await page
    .getByLabel("instagram publication URL")
    .fill("https://www.instagram.com/p/example/");
  await page.getByRole("button", { name: "Save details", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "All changes saved" }),
  ).toBeVisible();
  const origin = { Origin: "http://127.0.0.1:3100" };
  const post = await (await request.get(`/api/posts/${key}`)).json();
  expect(post.metadata.published.instagram.url).toBe(
    "https://www.instagram.com/p/example/",
  );
  const stale = await request.patch(`/api/posts/${key}`, {
    headers: origin,
    data: { caption: "must not overwrite", revision: "0".repeat(64) },
  });
  expect(stale.status()).toBe(409);
  const denied = await request.patch(`/api/posts/${key}`, {
    headers: { Origin: "https://evil.test" },
    data: { caption: "bad", revision: post.revision },
  });
  expect(denied.status()).toBe(400);
  const escaped = await request.get(
    "/api/asset?key=2026%2F09%2Fweek-03%2Fexample-post&source=assets%2F..%2Fpost.json",
  );
  expect(escaped.status()).toBe(400);
  const svg = Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="640" height="480" fill="#eeeeee"/><text x="40" y="90" font-size="32">Uploaded workspace</text></svg>',
  );
  await page.getByLabel("Upload dashboard-screenshot").setInputFiles({
    name: "workspace.svg",
    mimeType: "image/svg+xml",
    buffer: svg,
  });
  await expect(
    page.getByText("Asset saved in this post’s assets folder."),
  ).toBeVisible();
  const current = await (await request.get(`/api/posts/${key}`)).json();
  expect(current.missingAssets).toEqual([]);
  const uploaded = await readFile(
    path.join(
      process.env.STUDIO_E2E_DIR!,
      "content",
      key,
      current.metadata.requiredAssets[0].source,
    ),
  );
  expect(uploaded.equals(svg)).toBe(true);
  await page.reload();
  await expect(caption).toHaveValue("Edited locally. #Test #Git");
  for (const [format, height] of [
    ["Portrait", 1350],
    ["Square", 1080],
    ["Story", 1920],
  ] as const) {
    const panel = page.getByRole("region", { name: `${format} format` });
    for (const type of ["jpg", "png"] as const) {
      await panel
        .getByRole("button", { name: type.toUpperCase(), exact: true })
        .click();
      const single = page.waitForEvent("download");
      await panel
        .getByRole("button", { name: "Download slide", exact: true })
        .click();
      const d = await single;
      expect(d.suggestedFilename()).toBe(
        `example-post-${format.toLowerCase()}-01.${type}`,
      );
      const bytes = await downloadBytes(d);
      expect(await imageSize(page, bytes, type)).toEqual([1080, height]);
      if (type === "png")
        await writeFile(
          `test-results/export-${format.toLowerCase()}.png`,
          bytes,
        );
      const all = page.waitForEvent("download");
      await panel
        .getByRole("button", { name: "Download all", exact: true })
        .click();
      const zip = await JSZip.loadAsync(await downloadBytes(await all));
      expect(Object.keys(zip.files)).toEqual([
        `example-post-${format.toLowerCase()}-01.${type}`,
        `example-post-${format.toLowerCase()}-02.${type}`,
      ]);
      const second = await zip
        .file(Object.keys(zip.files)[1])!
        .async("nodebuffer");
      expect(await imageSize(page, second, type)).toEqual([1080, height]);
    }
    await panel.getByRole("button", { name: "Slide 2: The workflow" }).click();
    await expect(panel.getByAltText("Your workspace, here.")).toBeVisible();
  }
  await page.screenshot({
    path: "test-results/post-uploaded.png",
    fullPage: true,
  });
  await page
    .getByRole("link", { name: "Editorial calendar", exact: true })
    .click();
  await page.getByLabel("Calendar year").selectOption("2026");
  await page.getByLabel("Calendar month").selectOption("9");
  await expect(
    page
      .locator("section")
      .filter({ hasText: "WEEK 03" })
      .getByRole("link", { name: /A little structure/ }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Asset library", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "format-outline.svg" }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`/posts/${key}`);
  await expect(
    page.getByRole("heading", { name: "Story", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/post-mobile.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
test("new idea creates source files and a three-slide carousel exports deterministic order", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.getByRole("button", { name: "New idea" }).click();
  await page.getByLabel("Post title", { exact: true }).fill("Export proof");
  await page.getByLabel("Editorial date").fill("2026-09-24");
  await page.getByRole("button", { name: "Create idea" }).click();
  await expect(page).toHaveURL(/posts\/2026\/09\/week-04\/export-proof/);
  await expect(
    page.getByRole("heading", { name: "Portrait", exact: true }),
  ).toBeVisible();
  const newKey = "2026/09/week-04/export-proof";
  const post = await (await request.get(`/api/posts/${newKey}`)).json();
  for (const file of ["Post.tsx", "post.module.css", "post.json", "caption.md"])
    await readFile(
      path.join(process.env.STUDIO_E2E_DIR!, "content", newKey, file),
    );
  post.metadata.slides = [
    { id: "third", order: 30, label: "Third" },
    { id: "first", order: 10, label: "First" },
    { id: "second", order: 20, label: "Second" },
  ];
  const changed = await request.patch(`/api/posts/${newKey}`, {
    headers: { Origin: "http://127.0.0.1:3100" },
    data: { metadata: post.metadata, revision: post.revision },
  });
  expect(changed.ok()).toBe(true);
  await page.reload();
  const panel = page.getByRole("region", { name: "Portrait format" });
  await expect(
    panel.getByRole("button", { name: "Slide 1: First" }),
  ).toHaveAttribute("aria-pressed", "true");
  const all = page.waitForEvent("download");
  await panel
    .getByRole("button", { name: "Download all", exact: true })
    .click();
  const zip = await JSZip.loadAsync(await downloadBytes(await all));
  expect(Object.keys(zip.files)).toEqual([
    "export-proof-portrait-01.jpg",
    "export-proof-portrait-02.jpg",
    "export-proof-portrait-03.jpg",
  ]);
  expect(errors).toEqual([]);
});
