import { test } from "node:test";
import assert from "node:assert/strict";
import { contentStyleSchema } from "../content-styles/schema";
import {
  createContentStyleRegistry,
  getContentStyle,
  listContentStyles,
  contentStyleAssetUrl,
} from "../content-styles/loader";
import { styleVariables } from "../content-styles/resolve";
import { postSchema, createSchema } from "../src/schemas/post";
import sample from "../content/2026/09/week-03/example-post/post.json";

const base = () => structuredClone(getContentStyle("default"));
test("registry validates, normalizes, freezes and rejects unknown or duplicate packs", () => {
  assert.deepEqual(
    listContentStyles().map((s) => s.id),
    ["default", "web-para-consultorios"],
  );
  assert.throws(() => getContentStyle("unknown"), /Unknown Content Style/);
  assert.throws(() => getContentStyle("../default"), /Unknown Content Style/);
  assert.throws(
    () => createContentStyleRegistry([base(), base()]),
    /Duplicate Content Style/,
  );
  assert.equal(Object.isFrozen(getContentStyle("default").tokens.colors), true);
  const withoutOptional = base();
  Reflect.deleteProperty(withoutOptional, "assets");
  Reflect.deleteProperty(withoutOptional, "description");
  assert.deepEqual(
    createContentStyleRegistry([withoutOptional]).get("default").assets,
    {},
  );
  assert.equal(
    createContentStyleRegistry([withoutOptional]).get("default").description,
    "",
  );
});
test("missing tokens/templates and rule contradictions are explicit errors", () => {
  const noStory = base();
  Reflect.deleteProperty(noStory.templates, "story");
  const noColor = base();
  Reflect.deleteProperty(noColor.tokens.colors, "ink");
  for (const invalid of [noStory, noColor, { ...base(), id: "../bad" }])
    assert.equal(contentStyleSchema.safeParse(invalid).success, false);
  const radius = base();
  radius.tokens.radii.card = 12;
  const fonts = base();
  fonts.tokens.typography.labelFamily = "Georgia, serif";
  const alignment = base();
  alignment.templates.story.textAlign = "justify";
  const fit = base();
  fit.tokens.layout.imageTreatment = "cover";
  const accent = base();
  accent.rules.maxAccentColors = 0;
  for (const invalid of [radius, fonts, alignment, fit, accent])
    assert.equal(contentStyleSchema.safeParse(invalid).success, false);
});
test("every post and creation request explicitly select a registered style", () => {
  assert.equal(postSchema.parse(sample).style, "web-para-consultorios");
  const missing = { ...sample };
  Reflect.deleteProperty(missing, "style");
  assert.equal(postSchema.safeParse(missing).success, false);
  assert.equal(
    postSchema.safeParse({ ...sample, style: "unregistered" }).success,
    false,
  );
  assert.equal(
    createSchema.safeParse({ id: "test", title: "Test", date: "2026-09-21" })
      .success,
    false,
  );
  assert.equal(
    createSchema.parse({
      id: "test",
      title: "Test",
      date: "2026-09-21",
      style: "default",
    }).style,
    "default",
  );
});
test("templates resolve different layouts from one token system, and style changes affect every format", () => {
  const original = base(),
    altered = base();
  altered.tokens.colors.canvas = "#e5e5e5";
  altered.tokens.spacing.gutter = 80;
  const formats = ["portrait", "square", "story"] as const;
  const layouts = formats.map(
    (format) => styleVariables(original, format) as Record<string, string>,
  );
  assert.notEqual(
    layouts[0]["--content-title-size"],
    layouts[1]["--content-title-size"],
  );
  assert.notEqual(
    layouts[0]["--content-padding-top"],
    layouts[2]["--content-padding-top"],
  );
  assert.equal(layouts[1]["--content-columns"], original.tokens.layout.columns);
  for (const format of formats)
    assert.equal(
      (styleVariables(altered, format) as Record<string, string>)[
        "--content-color-canvas"
      ],
      "#e5e5e5",
    );
});
test("style assets use registered names and cannot express traversal", () => {
  assert.match(
    contentStyleAssetUrl("default", "format-outline"),
    /^\/api\/style-asset\?/,
  );
  assert.throws(
    () => contentStyleAssetUrl("default", "../../secret"),
    /Unknown asset/,
  );
  for (const source of [
    "assets/../secret.svg",
    "/etc/private.png",
    "https://remote/image.png",
    "assets/folder/../../x.svg",
  ]) {
    assert.equal(
      contentStyleSchema.safeParse({
        ...base(),
        assets: { bad: { source, alt: "bad", role: "image" } },
      }).success,
      false,
    );
  }
});

 test("emoji rules distinguish emoji presentation from ordinary text symbols", async () => {
  const { containsEmoji } = await import("../content-styles/validate-dom");
  for (const text of ["REDES ↔ WEB", "→", "© 2026", "™"])
    assert.equal(containsEmoji(text), false);
  for (const text of ["😀", "❤️", "🇨🇷", "1️⃣", "↔️"])
    assert.equal(containsEmoji(text), true);
});
