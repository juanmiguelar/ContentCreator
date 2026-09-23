# Social Content Studio — repository rules

- DESIGN.md describes ONLY the Content Creator application UI. Read it for application UI changes; never use it to design publications.
- Every post must explicitly reference a registered Content Style in post.json.style. Before authoring content, read that pack’s STYLE.md, tokens.ts, rules.ts, format templates and relevant examples. Resolve runtime styles only through content-styles/loader.ts; unknown styles are errors, never implicit fallbacks.
- Never use or request generative image models. Compose with React, HTML, CSS, SVG and local project assets. Request missing photography/screenshots through asset slots.
- Every post must implement Portrait (1080×1350), Square (1080×1080), and Story (1080×1920). Recompose each deliberately; never derive formats by cropping, stretching or scaling a finished layout.
- Reusable primitives handle canvas, slide ordering, export and assets. StyleSurface supplies the selected pack’s tokens and format template; previews and exports enforce its machine-readable rules. Keep post-specific semantic composition in Post.tsx and geometry in post.module.css, consuming --content-* variables. Do not duplicate colors/fonts or invent a spacing system in posts.
- Preserve style precedence: explicit supported post content/geometry, selected template, rules, tokens, STYLE.md, then explicit pack defaults. Post configuration never bypasses hard rules. Missing required information is a validation error. Do not replace composition code with a large JSON presentation system.
- Store posts in content/YYYY/MM/week-XX/post-slug/. Weeks are editorial buckets: 1–7, 8–14, 15–21, 22–end of month. IDs match folder slugs. Metadata and physical folders must agree. Flag inconsistent dates; do not silently move files.
- Keep caption.md separate from post.json. Preserve unknown metadata when editing. Reuse public/assets/ when appropriate; post-only assets belong in that post's assets/ directory.
- Slide IDs and order values must be unique; preserve narrative order across all formats. Use orderedSlides and the centralized SOCIAL_FORMATS and exportFilename utilities.
- After adding, deleting or moving post folders, run npm run registry. New source components require a development recompile or production rebuild; never eval uploaded JavaScript.
- Filesystem APIs accept validated post keys and declared asset slots, never arbitrary client paths. Reject traversal and symlinks. Keep local-only host/origin guards and revision conflict checks.
- Run npm run validate after changes. Run npm run test:e2e for changes affecting export, persistence or browser workflows. Do not use pixel snapshots as correctness tests.
- This is an internal local tool. Do not add authentication, cloud persistence, databases, social publishing APIs or image-generation services.
- Use the create-social-content repository skill for new social publications; consult README.md for the composition contract and local workflow.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
