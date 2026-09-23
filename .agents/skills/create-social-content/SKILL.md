---
name: create-social-content
description: Create or revise repository-backed social publications using a registered Content Style Pack, with coherent Portrait, Square and Story adaptations, captions, carousels and asset slots. Use for publication content, not application UI design.
---

# Create social content

Read root AGENTS.md. Every post must explicitly reference a registered pack in post.json.style. Resolve the requested style through content-styles/loader.ts, then read that pack's STYLE.md, tokens.ts, rules.ts, all three format templates and relevant examples completely. Inspect shared and pack assets before creating new ones. If no brand is requested, explicitly choose the registered neutral default pack and report that choice; never silently invent or substitute a brand.

DESIGN.md describes ONLY the Content Creator application UI. Do not use it as publication art direction or feed it into the content pipeline. Existing posts are narrative/structure references, not alternative visual authorities.

Read [content-schema.md](references/content-schema.md) before writing files. Determine the editorial date and folder, content, caption and slide narrative. Preserve unrelated existing content and unknown metadata. Keep post.json and caption.md separate from React/CSS composition.

Use the selected Portrait, Square and Story templates to recompose the same hierarchy, motifs, typography and message for each aspect ratio. Read [design-rules.md](references/design-rules.md) for deterministic styling and [export-rules.md](references/export-rules.md) for canvas/export constraints.

> Do not satisfy format variations by cropping, stretching, scaling, or merely repositioning an identical finished composition. Treat Portrait, Square and Story as related but independently composed layouts.

> Do not use or request generative image models. If a composition requires photography or a screenshot that does not exist, create a required asset slot and ask the user to supply the asset instead.

Keep semantic composition in Post.tsx and geometry in post.module.css. Default-export a PostProps component. The studio supplies SocialCanvas, Slide and StyleSurface; do not nest duplicate wrappers. Consume --content-* variables, or the supplied contentStyle/template props for SVG. Do not duplicate visual literals or import arbitrary individual pack modules. Use EditableText and metadata.copy for adjustable copy. Declare motifs with data-content-motif and use StyleAsset for pack assets/logos with allowed placement.

When the pack lacks a necessary visual decision, use an explicit pack default or report the missing requirement. Do not improvise a font, palette, motif or effect. Unsupported style IDs must fail. Hard rules cannot be bypassed by per-post CSS.

Run npm run registry after creating/moving content. Run npm run validate and relevant browser tests. Inspect all slides in all three panels; resolve style violations before exporting. Check filenames, dimensions and missing assets. Do not mark ready until required assets and layout checks are satisfied. Report the post route, selected style, generated files and any outstanding asset or art-direction requirement.
