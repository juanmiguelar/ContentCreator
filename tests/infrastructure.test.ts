import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, symlink, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  weekBucket,
  calendarFromDate,
  SOCIAL_FORMATS,
  orderedSlides,
} from "../src/lib/content/formats";
import { postSchema } from "../src/schemas/post";
import { exportFilename } from "../src/lib/export/names";
import { safePath, inside, validatePostKey } from "../src/lib/filesystem/paths";
import { missingAssets, validateImage } from "../src/lib/assets/files";
import { consistencyWarnings } from "../src/lib/content/store";
import { assertLocal } from "../src/lib/filesystem/http";
import sample from "../content/2026/09/week-03/example-post/post.json";

test("editorial weeks cover all month lengths and exact boundaries", () => {
  assert.deepEqual(
    [1, 7, 8, 14, 15, 21, 22, 28, 29, 30, 31].map(weekBucket),
    [1, 1, 2, 2, 3, 3, 4, 4, 4, 4, 4],
  );
  for (const day of [0, 32, -1, 1.5, NaN]) assert.throws(() => weekBucket(day));
  assert.deepEqual(calendarFromDate("2024-02-29"), {
    year: 2024,
    month: 2,
    week: 4,
  });
  assert.throws(() => calendarFromDate("2026-02-29"));
  assert.throws(() => calendarFromDate("2026-04-31"));
});
test("schema enforces complete formats, real dates and unique ordered slides while retaining extensions", () => {
  const valid = postSchema.parse({
    ...sample,
    futureMetadata: { enabled: true },
  });
  assert.deepEqual(valid.futureMetadata, { enabled: true });
  for (const change of [
    { formats: ["portrait"] },
    { formats: ["portrait", "portrait", "story"] },
    { status: "scheduled" },
    { publishDate: "2026-02-31" },
    { id: "../escape" },
    { platform: [] },
    {
      slides: [
        { id: "a", order: 1, label: "A" },
        { id: "a", order: 2, label: "B" },
      ],
    },
    {
      slides: [
        { id: "a", order: 1, label: "A" },
        { id: "b", order: 1, label: "B" },
      ],
    },
    {
      published: {
        instagram: { date: "2026-09-21", url: "javascript:alert(1)" },
      },
    },
    {
      requiredAssets: [
        {
          id: "screen",
          type: "image",
          status: "provided",
          description: "x",
          source: "assets/../../private.png",
        },
      ],
    },
  ])
    assert.equal(postSchema.safeParse({ ...sample, ...change }).success, false);
});
test("format sizes and numbered exports are deterministic", () => {
  assert.deepEqual(
    Object.values(SOCIAL_FORMATS).map((f) => [f.width, f.height]),
    [
      [1080, 1350],
      [1080, 1080],
      [1080, 1920],
    ],
  );
  const slides = [
    { id: "ending", order: 30 },
    { id: "cover", order: 10 },
    { id: "middle", order: 20 },
  ];
  const ordered = orderedSlides(slides);
  assert.deepEqual(
    ordered.map((s) => s.id),
    ["cover", "middle", "ending"],
  );
  assert.deepEqual(
    slides.map((s) => s.order),
    [30, 10, 20],
  );
  assert.deepEqual(
    ordered.map((_, i) => exportFilename("sample", "portrait", i + 1, "jpg")),
    [
      "sample-portrait-01.jpg",
      "sample-portrait-02.jpg",
      "sample-portrait-03.jpg",
    ],
  );
  assert.equal(
    exportFilename("sample", "story", 1, "png"),
    "sample-story-01.png",
  );
  assert.throws(() => exportFilename("../bad", "square", 1, "png"));
  assert.throws(() => exportFilename("sample", "square", 0, "png"));
  assert.throws(() =>
    orderedSlides([
      { id: "a", order: 1 },
      { id: "b", order: 1 },
    ]),
  );
});
test("path guards prevent traversal, arbitrary files and intermediate/dangling symlinks", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "studio-paths-"));
  const outside = await mkdtemp(path.join(tmpdir(), "studio-outside-"));
  try {
    assert.equal(
      validatePostKey("2026/09/week-03/example-post"),
      "2026/09/week-03/example-post",
    );
    for (const key of [
      "../secret",
      "2026/13/week-01/x",
      "2026/09/week-05/x",
      "2026/09/week-03/../x",
      "2026/09/week-03/x/extra",
      "%2e%2e/private",
      "/2026/09/week-03/x",
    ])
      assert.throws(() => validatePostKey(key));
    for (const value of [
      "../secret",
      "/etc/passwd",
      "a/../../x",
      "a\\..\\x",
      "a//b",
      "a/./b",
      "a\0b",
    ])
      assert.throws(() => inside(root, value));
    await mkdir(path.join(root, "valid"));
    assert.equal(
      await safePath(root, "valid/future.png"),
      path.join(root, "valid/future.png"),
    );
    await symlink(outside, path.join(root, "escape"));
    await symlink(path.join(outside, "missing"), path.join(root, "dangling"));
    await assert.rejects(safePath(root, "escape/image.png"), /Symlink/);
    await assert.rejects(safePath(root, "dangling/image.png"), /Symlink/);
  } finally {
    await rm(root, { recursive: true, force: true });
    await rm(outside, { recursive: true, force: true });
  }
});
test("asset availability uses actual existence; optional assets are still surfaced", () => {
  const assets = postSchema.parse({
    ...sample,
    requiredAssets: [
      { id: "missing", type: "image", status: "missing", description: "x" },
      {
        id: "stale",
        type: "image",
        status: "provided",
        description: "x",
        source: "assets/missing.png",
      },
      {
        id: "present",
        type: "image",
        status: "provided",
        description: "x",
        source: "/assets/photos/exists.png",
      },
      {
        id: "optional",
        type: "image",
        status: "missing",
        description: "x",
        optional: true,
      },
    ],
  }).requiredAssets;
  assert.deepEqual(
    missingAssets(assets, (s) => s.endsWith("exists.png")),
    ["missing", "stale", "optional"],
  );
  assert.throws(() => validateImage(Buffer.from("not a png"), "png"));
  assert.throws(() => validateImage(Buffer.from("<svg/>"), "exe"));
});
test("directory/date inconsistencies are warnings, not silent relocation", () => {
  const metadata = postSchema.parse(sample);
  assert.deepEqual(
    consistencyWarnings("2026/09/week-03/example-post", metadata),
    [],
  );
  assert.equal(
    consistencyWarnings("2026/09/week-04/example-post", metadata).length,
    2,
  );
  assert.equal(
    consistencyWarnings("2026/09/week-03/different", metadata).length,
    1,
  );
});
test("filesystem mutation requires loopback host and same origin", () => {
  const make = (url: string, host: string, origin: string) =>
    new Request(url, { headers: { host, origin } });
  assert.doesNotThrow(() =>
    assertLocal(
      make(
        "http://127.0.0.1:3000/api/posts",
        "127.0.0.1:3000",
        "http://127.0.0.1:3000",
      ),
      true,
    ),
  );
  assert.throws(() =>
    assertLocal(
      make("http://evil.test/api/posts", "evil.test", "http://evil.test"),
      true,
    ),
  );
  assert.throws(() =>
    assertLocal(
      make(
        "http://127.0.0.1:3000/api/posts",
        "127.0.0.1:3000",
        "https://evil.test",
      ),
      true,
    ),
  );
});
