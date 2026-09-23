# Content Style Packs

DESIGN.md = design system of the Content Creator application.

content-styles/* = design systems of the content produced by the application.

A pack is a registered, validated visual system shared by publications. It keeps
publication identity independent from editor chrome. `default` provides a minimal neutral style. `web-para-consultorios` extracts
the existing Origami Care identity from the local website repository. Existing posts now explicitly select
it; their words, slide IDs, dates, assets and unrelated metadata are preserved.
Their prior hard-coded publication colors/fonts now consume the neutral pack.

## Files and registration

```text
content-styles/
  schema.ts          Zod contracts and inferred TypeScript types
  loader.ts          explicit registry, validation, immutable normalization
  resolve.ts         tokens/template → scoped CSS custom properties
  validate-dom.ts    preview/export checks on the authored DOM
  default/
    index.ts         assembles the pack (satisfies ContentStyle)
    STYLE.md         art direction for authors
    tokens.ts        exact visual values
    rules.ts         machine-readable hard constraints
    templates/
      portrait.ts
      square.ts
      story.ts
    assets/          optional pack-only files
    examples/        optional canonical references, never runtime dependencies
```

To create a style, copy the _structure_ of default, choose a unique lowercase
hyphenated ID and author its values/rules/templates. Export a complete pack from
index.ts and add one import/entry to `definitions` in loader.ts. Run validation.
No other application file or UI theme needs to change. Folder name and ID agree.
Required files are STYLE.md, index.ts, tokens.ts, rules.ts and the three templates.
Missing required tokens/templates, duplicate IDs, contradictory rules and unknown
styles fail explicitly. There is no runtime fallback or default-style inference.
The New idea form visibly preselects default and sends that explicit reference.

The rest of the app and posts use `getContentStyle`, `listContentStyles`,
StyleSurface or the `contentStyle` / `template` PostProps. They never directly
import a particular pack. Runtime does not parse DESIGN.md or STYLE.md; authors
read STYLE.md and examples for art direction, then encode exact choices in TS.

## Publication and rendering contract

Every post.json contains `"style": "default"` (or another registered ID).
The existing `formats`, `slides`, calendar and caption contracts are unchanged.
The Content Style selector updates all previews immediately. Save persists the
selection with the normal revision conflict protection. It is not an app theme.

Post content → selected pack → tokens and rules → format template → the existing
SocialCanvas/Slide/Post.tsx DOM → preview and export. No parallel renderer exists.
StyleSurface sets scoped `--content-*` variables, resets essential publication
elements and passes the selected template/pack to Post.tsx. Template properties
select padding, type sizes, leading space, columns and flow from named tokens;
they describe related format adaptations, not scaled canvases.

Posts retain their semantic React/SVG and CSS geometry. Use:

- `--content-color-ink`, `--content-color-canvas`, `--content-color-accent`, etc.
- `--content-font-body`, `--content-title-size`, `--content-body-size`.
- `--content-padding-x`, `--content-padding-top`, `--content-gap`, `--content-lead-space`.
- `--content-columns` / `--content-flow` for template-directed content grouping.
- `--content-space-medium`, named sizing tokens and `--content-space-unit`.

For bespoke geometric diagrams, authored coordinates and percentage ratios are
explicit post geometry, not new palette/type/spacing systems. Express lengths
through named variables or multiples of the pack's spacing unit. Do not copy raw
colors, font families, shadows or arbitrary style overrides into post CSS.
Post.tsx may use `contentStyle.tokens` or `template` for programmatic SVG/layout;
shared style primitives do not force a single HTML structure.

Resolution order is explicit supported post content/geometry → selected template
→ hard rules → tokens → STYLE.md guidance → explicit pack defaults. Hard rules
constrain every level: post CSS cannot opt out of them. This release deliberately
does not allow free-form JSON visual overrides. Add a narrowly typed field with
validation if a future request requires one; do not build a JSON design tree.

## Rules and validation

Zod validates structural consistency: all formats, token completeness, family
limits, radius restrictions, accent allowance, template alignments and image fit.
DOM validation examines the rendered elements and generated pseudo-elements for
palette violations, undeclared font stacks, maximum font families, gradients,
box/text/drop shadows, rounded HTML surfaces, emoji text, text alignment and image
fit. Logo positions (`data-logo-placement`) and declared motifs
(`data-content-motif`) must be in their allowlists. This token schema has at most
one named accent; maxAccentColors=0 requires it to reuse ink/muted.

Every preview shows violations. Every export rechecks the current DOM and blocks
on violations before downloading. Mutating CSS after preview validation does not
bypass the export check. All slides, including offscreen slides, are checked.
JPG still uses 0.95 quality; its flattening background is the selected canvas token.
PNG, dimensions, ordering, single downloads and ZIP behavior are unchanged.

This is deterministic validation of trusted authored DOM/CSS, not a sandbox or a
complete aesthetic proof. It cannot infer semantic logo roles, undeclared motifs,
photography quality or colors embedded inside bitmap/SVG image files. Declare
roles/motifs correctly and review source assets against STYLE.md and examples.
`npm run validate` also checks source CSS for literal palettes/fonts/pixel values;
it checks required pack files and referenced asset paths. Browser checks are the
authoritative runtime validation for computed styles and export rendering.

## Assets and examples

A pack asset map names assets with `{ source, alt, role }`. `assets/file.svg` means
inside that pack; `/assets/...` reuses the global library without duplication.
`StyleAsset` and `contentStyleAssetUrl(styleId, assetId)` resolve named registered
assets. The read-only `/api/style-asset` endpoint accepts IDs, not arbitrary paths;
it uses the existing traversal/symlink protection and restrictive SVG headers.
Logo assets require an allowed explicit placement. Post uploads remain in the
post's assets folder and continue to use AssetSlot.

The default pack references the existing global format-outline SVG. Its assets/
folder is intentionally empty. examples/ is also empty; add canonical SVG/PNG/JPG
exports or notes when useful. Missing examples never prevent runtime rendering.

## Verification

`npm run validate` checks packs, posts, lint, types and infrastructure tests.
`npm run test:e2e` checks persistence, exports, unknown-style rejection, switching
packs across all three canvases, rule violations and isolated application styles.
A second neutral test pack is created only inside the disposable E2E repository;
it is not registered in the real application.

## WebParaConsultorios

See [the style guide](web-para-consultorios/STYLE.md) and
[source audit](web-para-consultorios/examples/SOURCE-AUDIT.md). Named additional
colors in tokens.colors resolve to the same --content-color-* variables and
participate in palette validation. Optional tokens.effects define the card
shadow exposed as --content-shadow-card. Registered local font declarations
live in fonts.css; their WPC aliases do not change application typography.
