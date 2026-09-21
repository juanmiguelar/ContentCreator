# Social Content Studio

An internal, local-first studio for composing social posts in React/CSS/SVG, editing copy, and exporting JPG/PNG. The repository is the source of truth. No database, cloud storage, authentication, image-generation model or publishing API.

## Run

Node.js 22+ is required. Dependencies are locked in package-lock.json.

```bash
npm install
npm run dev
```

Open http://127.0.0.1:3000. The server binds to loopback. Use the development server for content authoring: it recompiles new post components and watches existing source changes. Metadata and captions are always read from disk.

```bash
npm run validate   # registry, ESLint, TypeScript, infrastructure tests
npm run build
npm start          # local production server; rebuild after adding/changing composition code
npm run test:e2e   # real browser workflow tests in an isolated temporary repository
```

Browser tests use Playwright Chromium. Run `npx playwright install chromium` once, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to a local Chromium executable. Tests start their own loopback development server on port 3100 and never write to your real content files. Set `STUDIO_E2E_DIR` to keep the disposable test workspace somewhere specific.

## First visit

The library contains one clearly labeled neutral example at `/posts/2026/09/week-03/example-post`. Open it to review two slides in each of three panels. Change JPG/PNG per panel, download a slide or download all as a ZIP. Edit/copy the caption, save metadata, or fill the optional screenshot slot. Copy fields update the previews immediately and persist in post.json when saved.

The studio UI uses its own restrained interface palette. It is **not** a brand specification for social posts. DESIGN.md is intentionally undefined. Codex must read it before designing content; add your actual rules there before requesting branded work. The library displays a reminder but does not parse the design specification.

## Create content with Codex

Invoke `.agents/skills/create-social-content/SKILL.md`, for example:

> Use create-social-content to create a two-slide carousel about our new dashboard for September 24, 2026. Read DESIGN.md and declare a screenshot slot if needed.

Codex reads AGENTS.md and DESIGN.md, inspects reusable assets, creates the publication files, composes three independent layouts, and validates the result. `New idea` in the studio also creates a real folder with three neutral starter layouts; those are a starting point for code authoring, not a restrictive template system.

## Create a post manually

1. Choose `content/YYYY/MM/week-XX/post-slug/`.
2. Write `post.json` using src/schemas/post.ts and the skill's content-schema.md. Include unique slide IDs and ordering, all three formats, and any asset slots. Use `copy` for lightweight editable text; arbitrary extra root metadata is preserved.
3. Write `caption.md` containing only social copy.
4. Default-export a React component from `Post.tsx` with `PostProps` from `@/types/post`. It receives `format`, `slideId`, `metadata` and `postKey`. The studio wraps the component in SocialCanvas/Slide. Compose all three formats in this component and scope its styles in `post.module.css`.
5. Add local assets under the post's `assets/` folder or reuse `public/assets/`. Use AssetSlot for deferred images; pass metadata/postKey so uploads automatically render.
6. Run `npm run registry` and `npm run validate`. Open `/posts/<folder-key>`.

Canvas compositions mount in the browser, so newly generated imports cannot produce a server/client hydration mismatch during development. Metadata and editor controls still render on the server.

The generated, version-controlled `src/lib/content-registry.ts` is a small static import registry. It runs before dev/build/validate and after UI creation. Only one generated file changes when a post is added. Existing Post.tsx/CSS files hot-reload. If creating a directory externally while dev is already running, run the registry command. Production requires a rebuild for new source components. Uploaded images never execute as code.

Shared primitives: SocialCanvas (explicit dimensions and preview scaling), Slide, Carousel, AssetSlot and EditableText. They do not dictate composition style. The example demonstrates separate hierarchy, grouping and flow for each aspect ratio. Layout is code, not a JSON design tree.

## Content organization

```text
content/YYYY/MM/week-XX/slug/
  post.json        metadata, declared slides, editable copy, asset sources
  caption.md       social caption only
  Post.tsx         React/HTML/SVG composition
  post.module.css  post-specific styling
  assets/          post-only assets
```

Weeks are editorial buckets, not ISO weeks: 01 = days 1–7; 02 = 8–14; 03 = 15–21; 04 = 22–end of month. The calendar displays physical folders. Metadata/folder/publish-date inconsistencies produce warnings; the app never silently moves directories. Move content manually, align its calendar metadata and regenerate the registry. Post ID and calendar folder fields are intentionally not editable through the API.

Library filters include status, year, month, week, campaign, category and platform, with search and grid/list views. Lightweight card summaries avoid rendering every high-resolution composition. Invalid post metadata is reported without hiding valid posts.

## Export

| Format   | Logical size |
| -------- | ------------ |
| Portrait | 1080 × 1350  |
| Square   | 1080 × 1080  |
| Story    | 1080 × 1920  |

The same DOM powers preview and export. An outer wrapper scales the preview; html-to-image captures the full logical canvas with pixelRatio 1, after fonts and images load. JPG is default at quality 0.95 with a white background. PNG supports transparency. Keep assets and fonts local; remote resources, browser-specific filters or external SVG dependencies can prevent faithful export.

Names use `<slug>-<format>-01.jpg` (or `.png`), including single slides. Slides are sorted numerically by their explicit order then numbered contiguously. Each slide has a download; Download all produces a ZIP for multiple slides. JPG/PNG selections are independent per panel. Missing slots are clearly marked; draft exports include visible placeholders until filled.

## Assets

Reusable files live in `public/assets/brand/logos`, `brand/marks`, `icons`, `illustrations`, `photos`, `screenshots`, `textures` and `miscellaneous`. Browse them in Asset library and copy their paths. Place reusable files on disk; select them in a post's declared asset slots without duplication.

Post-only uploads live in `content/.../slug/assets/`. PNG/JPG/JPEG/WEBP/SVG up to 15 MB are supported. Filenames include the slot ID and a content hash to avoid stale image caches; replacing an upload retains earlier files for review. The slot's source/status is updated in post.json. SVG uploads are treated as images and served with a restrictive sandbox policy, never injected as inline HTML. Inline SVG authored in Post.tsx remains code.

## Editing and Git

The editor saves to post.json and caption.md. A revision hash detects changes by another tab or Codex; conflicts are rejected, preserving your unsaved edits so you can reconcile them. Save copy/metadata before uploading. Saved and unsaved states are visible; leaving via browser navigation warns about unsaved edits. Publish manually, then set status to published and record optional dates/URLs per platform.

```bash
git status
git diff
# Review, then stage and commit the files you intend to keep.
```

On this initially empty repository, files are untracked until you stage/commit the initial project. `git status` shows them; `git diff` shows subsequent tracked edits. The application never commits or stages for you. No external persistence exists.

Filesystem APIs restrict paths to repository roots, reject traversal and symlinks, validate metadata through Zod, check local host/origin on mutations, and write files by atomic replacement. Run one local server per checkout; revision checks serialize writes within that process. Do not expose it as a public service. Repository code is trusted; arbitrary Post.tsx is not sandboxed. Multi-file edits are not a database transaction, so use Git for recovery after interruption.

## Checks

Infrastructure tests cover real dates/week buckets, schema validation, all dimensions, deterministic carousel ordering/names, traversal and symlink rejection, and missing assets. Browser tests exercise create/read/edit/upload/export/calendar flows in an isolated copy, inspect image dimensions and ZIP order, and preserve the one-example working tree. Avoid brittle pixel-perfect snapshots.
