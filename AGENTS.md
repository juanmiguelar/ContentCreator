# Social Content Studio — repository rules

- Read DESIGN.md completely before creating or significantly modifying social content. Undefined sections are not permission to invent a brand; report that brand-specific rules are undefined.
- Never use or request generative image models. Compose with React, HTML, CSS, SVG and local project assets. Request missing photography/screenshots through asset slots.
- Every post must implement Portrait (1080×1350), Square (1080×1080), and Story (1080×1920). Recompose each deliberately; never derive formats by cropping, stretching or scaling a finished layout.
- Reusable primitives handle canvas, slide ordering, export and assets, not brand styling. Keep each post's composition in Post.tsx and styling in post.module.css. Do not replace these with a large JSON presentation system.
- Store posts in content/YYYY/MM/week-XX/post-slug/. Weeks are editorial buckets: 1–7, 8–14, 15–21, 22–end of month. IDs match folder slugs. Metadata and physical folders must agree. Flag inconsistent dates; do not silently move files.
- Keep caption.md separate from post.json. Preserve unknown metadata when editing. Reuse public/assets/ when appropriate; post-only assets belong in that post's assets/ directory.
- Slide IDs and order values must be unique; preserve narrative order across all formats. Use orderedSlides and the centralized SOCIAL_FORMATS and exportFilename utilities.
- After adding, deleting or moving post folders, run npm run registry. New source components require a development recompile or production rebuild; never eval uploaded JavaScript.
- Filesystem APIs accept validated post keys and declared asset slots, never arbitrary client paths. Reject traversal and symlinks. Keep local-only host/origin guards and revision conflict checks.
- Run npm run validate after changes. Run npm run test:e2e for changes affecting export, persistence or browser workflows. Do not use pixel snapshots as correctness tests.
- This is an internal local tool. Do not add authentication, cloud persistence, databases, social publishing APIs or image-generation services.
- Use the create-social-content repository skill for new social publications; consult README.md for the composition contract and local workflow.
