# Publication design authority

DESIGN.md = application UI only. content-styles/<post.style>/ = publication identity.

Read the selected registered pack's STYLE.md, tokens, rules, format templates and relevant examples before authoring. STYLE.md describes art direction; exact TS tokens and machine rules are authoritative and consumed by the renderer. Never infer publication identity from studio chrome or an unrelated post.

Use explicit post content/geometry first, then the selected format template, hard rules, tokens, STYLE.md guidance and explicit pack defaults. Rules constrain all levels. Missing required fields are validation errors, not permission to invent values. This release has no free-form JSON visual overrides.

Preserve identity, hierarchy, typography, image treatment and narrative across formats while recomposing grouping, density and flow. Consume --content-title-size, --content-padding-x, --content-gap, --content-columns and other template-resolved variables. Bespoke diagram coordinates are post geometry; derive lengths from named sizing/spacing tokens or multiples of --content-space-unit. Do not hard-code colors/fonts/pixel systems into post CSS.

SVG is permitted. Declare custom motifs with data-content-motif using the style allowlist. Use StyleAsset for named pack images/logos; logo placement must be allowed. Use AssetSlot for missing user images. Neither raster generation models nor image-generation APIs are permitted.

Preview/export checks enforce palette, font stacks/count, gradients, shadows, emoji text, radii, alignment, image fitting, declared motifs and logo placement. Export is blocked for violations. Bitmap/SVG image interiors and semantic art direction still need source/visual review. Examples are optional reference material, never runtime dependencies.
