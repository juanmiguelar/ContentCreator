import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import path from "node:path";
const key = "2026/09/week-03/example-post";
const origin = { Origin: "http://127.0.0.1:3100" };

test("selected style updates all formats and saves without changing the application design", async ({
  page,
  request,
}) => {
  await page.goto(`/posts/${key}`);
  await expect(page.locator("[data-content-style]")).toHaveCount(6);
  const appAppearance = () =>
    page.locator(".sidebar").evaluate((el) => {
      const s = getComputedStyle(el);
      return [s.backgroundColor, s.color, s.fontFamily, s.width];
    });
  const before = await appAppearance();
  const selector = page.getByRole("combobox", {
    name: "Content Style",
    exact: true,
  });
  await expect(selector).toHaveValue("web-para-consultorios");
  await selector.selectOption("test-style");
  await expect(page.locator('[data-content-style="test-style"]')).toHaveCount(
    6,
  );
  for (const format of ["Portrait", "Square", "Story"]) {
    const panel = page.getByRole("region", { name: `${format} format` });
    await expect(panel.locator("[data-content-style]").first()).toHaveCSS(
      "background-color",
      "rgb(232, 232, 228)",
    );
    await expect(panel.locator("h1").first()).toHaveCSS(
      "font-family",
      "Georgia, serif",
    );
  }
  await expect(
    page
      .getByRole("region", { name: "Portrait format" })
      .locator("[data-content-template]")
      .first(),
  ).toHaveAttribute("data-content-template", "split");
  expect(await appAppearance()).toEqual(before);
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "All changes saved" }),
  ).toBeVisible();
  const stored = JSON.parse(
    await readFile(
      path.join(process.env.STUDIO_E2E_DIR!, "content", key, "post.json"),
      "utf8",
    ),
  );
  expect(stored.style).toBe("test-style");
  await page.reload();
  await expect(selector).toHaveValue("test-style");
  const post = await (await request.get(`/api/posts/${key}`)).json();
  const invalid = await request.patch(`/api/posts/${key}`, {
    headers: origin,
    data: {
      metadata: { ...post.metadata, style: "not-registered" },
      revision: post.revision,
    },
  });
  expect(invalid.status()).toBe(400);
  expect((await invalid.json()).error).toContain("Unknown Content Style");
  const missing = { ...post.metadata };
  delete missing.style;
  expect(
    (
      await request.patch(`/api/posts/${key}`, {
        headers: origin,
        data: { metadata: missing, revision: post.revision },
      })
    ).status(),
  ).toBe(400);
  expect(
    (await (await request.get(`/api/posts/${key}`)).json()).metadata.style,
  ).toBe("test-style");
  const asset = await request.get(
    "/api/style-asset?style=test-style&asset=proof",
  );
  expect(asset.status()).toBe(200);
  expect(asset.headers()["content-type"]).toBe("image/svg+xml");
  expect(
    (
      await request.get("/api/style-asset?style=..%2Fdefault&asset=proof")
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.get(
        "/api/style-asset?style=test-style&asset=..%2Ftokens.ts",
      )
    ).status(),
  ).toBe(400);
  await selector.selectOption("web-para-consultorios");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "All changes saved" }),
  ).toBeVisible();
});

test("preview and export reject CSS that violates the selected style", async ({
  page,
}) => {
  await page.goto(`/posts/${key}`);
  await page
    .getByRole("combobox", { name: "Content Style", exact: true })
    .selectOption("default");
  const panel = page.getByRole("region", { name: "Portrait format" });
  await expect(panel.locator("[data-content-style]")).toHaveCount(2);
  await expect(panel.locator("[data-style-violations]")).toHaveCount(0);
  await panel
    .locator("[data-content-style]")
    .first()
    .evaluate((el) => {
      el.style.backgroundImage = "linear-gradient(red, blue)";
      el.style.boxShadow = "0px 0px 8px black";
      el.style.borderRadius = "24px";
      const title = el.querySelector("h1")!;
      title.style.color = "rgb(255, 0, 255)";
      title.style.fontFamily = "monospace";
      title.append(" 😀");
    });
  await expect(panel.locator("[data-style-violations]")).toContainText(
    "Gradients are not allowed",
  );
  await expect(panel.locator("[data-style-violations]")).toContainText(
    "outside the selected style palette",
  );
  await expect(panel.locator("[data-style-violations]")).toContainText(
    "Font family",
  );
  await expect(panel.locator("[data-style-violations]")).toContainText(
    "Drop shadows",
  );
  await expect(panel.locator("[data-style-violations]")).toContainText(
    "Rounded cards",
  );
  await expect(panel.locator("[data-style-violations]")).toContainText(
    "Emojis",
  );
  const downloads: string[] = [];
  page.on("download", (d) => downloads.push(d.suggestedFilename()));
  await panel
    .getByRole("button", { name: "Download all", exact: true })
    .click();
  await expect(
    panel.getByRole("alert").filter({ hasText: "Content Style default:" }),
  ).toBeVisible();
  expect(downloads).toEqual([]);
});

test("all migrated posts use the registered pack across every slide and format", async ({
  page,
  request,
}) => {
  const { posts } = await (await request.get("/api/posts")).json();
  for (const post of posts) {
    await page.goto(`/posts/${post.key}`);
    expect(post.metadata.style).toBe("web-para-consultorios");
    await expect(page.locator("[data-content-style]")).toHaveCount(
      post.metadata.slides.length * 3,
    );
    await expect(
      page.locator('[data-style-asset="origami-heart"]'),
    ).toHaveCount(post.metadata.slides.length * 3);
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    await expect(page.locator("[data-style-violations]")).toHaveCount(0);
    if (post.metadata.id === "muestra-como-trabaja-tu-consultoria") {
      await expect(
        page.getByRole("textbox", { name: "Headline", exact: true }),
      ).toHaveValue(post.metadata.copy.headline);
      await page.screenshot({
        path: "test-results/migrated-post.png",
        fullPage: true,
      });
    }
  }
});

test("WebParaConsultorios loads local fonts and exports its registered visual system", async ({
  page,
  request,
}) => {
  await page.goto(`/posts/${key}`);
  await page
    .getByRole("combobox", { name: "Content Style", exact: true })
    .selectOption("web-para-consultorios");
  await expect(
    page.locator('[data-content-style="web-para-consultorios"]'),
  ).toHaveCount(6);
  const fonts = await page.evaluate(async () => {
    await document.fonts.load('650 88px "WPC Inter"');
    await document.fonts.load('400 18px "WPC JetBrains Mono"');
    await document.fonts.ready;
    return [...document.fonts]
      .filter((f) => f.family.includes("WPC") && f.status === "loaded")
      .map((f) => f.family);
  });
  expect(fonts.some((f) => f.includes("Inter"))).toBe(true);
  expect(fonts.some((f) => f.includes("JetBrains"))).toBe(true);
  await expect(page.locator("[data-style-violations]")).toHaveCount(0);
  const panel = page.getByRole("region", { name: "Portrait format" });
  await expect(panel.locator("h1").first()).toHaveCSS(
    "color",
    "rgb(8, 47, 73)",
  );
  const download = page.waitForEvent("download");
  await panel
    .getByRole("button", { name: "Download slide", exact: true })
    .click();
  expect((await download).suggestedFilename()).toContain(".jpg");
  const logo = await request.get(
    "/api/style-asset?style=web-para-consultorios&asset=origami-heart",
  );
  expect(logo.ok()).toBe(true);
  expect((await logo.text()).match(/<path /g)).toHaveLength(6);
  await page.screenshot({
    path: "test-results/web-para-consultorios.png",
    fullPage: true,
  });
});

test("reference publication uses the blue folded panel with readable layouts in all formats", async ({
  page,
}) => {
  await page.goto("/posts/2026/09/week-04/muestra-como-trabaja-tu-consultoria");
  await expect(
    page.getByRole("combobox", { name: "Content Style", exact: true }),
  ).toHaveValue("web-para-consultorios");
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((i) => i.decode().catch(() => {})),
    );
  });
  const layouts = await page
    .locator("[data-content-style] article")
    .evaluateAll((articles) =>
      articles.map((article) => {
        const title = article.querySelector("h1")!.getBoundingClientRect();
        const body = article.querySelector("main p")!.getBoundingClientRect();
        const note = article.querySelector("aside")!.getBoundingClientRect();
        const panel = article.querySelector("section")!.getBoundingClientRect();
        return {
          color: getComputedStyle(article.querySelector("section")!)
            .backgroundColor,
          radius: parseFloat(
            getComputedStyle(article.querySelector("section")!).borderRadius,
          ),
          fits:
            title.bottom <= note.top + 1 &&
            body.bottom <= note.top + 1 &&
            title.right <= panel.right + 1 &&
            note.bottom <= panel.bottom + 1,
        };
      }),
    );
  expect(layouts).toHaveLength(12);
  for (const layout of layouts) {
    expect(layout.color).toBe("rgb(240, 249, 255)");
    expect(layout.radius).toBeGreaterThan(0);
    expect(layout.fits).toBe(true);
  }
  await expect(page.locator("[data-style-violations]")).toHaveCount(0);
  for (const format of ["Portrait", "Square", "Story"]) {
    const panel = page.getByRole("region", { name: `${format} format` });
    await panel
      .locator("[data-canvas-id]")
      .first()
      .screenshot({
        path: `test-results/reference-${format.toLowerCase()}.png`,
      });
    await panel.getByRole("button", { name: "PNG", exact: true }).click();
    const download = page.waitForEvent("download");
    await panel
      .getByRole("button", { name: "Download slide", exact: true })
      .click();
    expect((await download).suggestedFilename()).toContain(
      `-${format.toLowerCase()}-01.png`,
    );
  }
});
