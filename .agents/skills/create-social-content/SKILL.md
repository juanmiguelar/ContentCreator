---
name: create-social-content
description: Create or revise repository-backed social posts in Social Content Studio, with independent Portrait, Square and Story layouts, captions, carousels and asset slots. Use for social publication content, not general application UI work.
---

# Create social content

Read root AGENTS.md and DESIGN.md completely. DESIGN.md is authoritative; report undefined brand rules without inventing an identity. Inspect the existing library and public/assets/ for reusable patterns and assets.

Read [content-schema.md](references/content-schema.md) before writing files. Determine the editorial date, folder, message, caption and single-slide or carousel narrative from the request. Save metadata and caption separately from React/CSS composition.

Design Portrait first, then independently compose Square and Story, keeping narrative ordering consistent. Follow [design-rules.md](references/design-rules.md) for design constraints and [export-rules.md](references/export-rules.md) for canvas/export requirements.

> Do not satisfy format variations by cropping, stretching, scaling, or merely repositioning an identical finished composition. Treat Portrait, Square and Story as related but independently composed layouts.

> Do not use or request generative image models. If a composition requires photography or a screenshot that does not exist, create a required asset slot and ask the user to supply the asset instead.

SVG diagrams, icons and shapes are permitted if they comply with DESIGN.md. Reuse global assets instead of duplicating them. Declare unavailable assets in metadata and render AssetSlot so the user can upload them. Label optional assets accordingly.

Export a default React component from Post.tsx with PostProps. Use format and slideId explicitly. Keep CSS in post.module.css. Use metadata.copy and EditableText for adjustable text fields. Primitives handle infrastructure, not design templates.

Run npm run registry after creating/moving content. Run npm run validate and relevant browser tests. Open the local post route, inspect every slide in all three panels, verify assets and export filenames/dimensions. Do not mark ready while required assets or layout checks remain unresolved. Report the generated /posts/YYYY/MM/week-XX/slug route, created files, and missing assets/design decisions.
