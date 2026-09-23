# Export rules

Use SOCIAL_FORMATS from src/lib/content/formats.ts: Portrait 1080×1350, Square 1080×1080, Story 1080×1920. Canvas coordinates are full size; preview scaling sits on an outer ancestor, not on the export target. Preview and export use identical DOM. Other slides stay mounted offscreen at full logical resolution.

JPG defaults to quality 0.95 with the selected Content Style's canvas token as background. PNG preserves transparency unless the composition draws a background. Await font readiness and image decoding. Keep fonts/images local. Avoid animation, external SVG dependencies and unsupported rendering effects.

Use exportFilename: `<slug>-<format>-<01-based-zero-padded-position>.jpg` or `.png`. A single slide is still 01. Carousel order comes from orderedSlides, never filesystem order or lexical IDs. Download each independently; Download all creates an ordered ZIP for multiple slides or a single image for one slide.

Verify all formats, dimensions and ordering in a real browser after layout/export changes. Disclose missing assets before delivery. Draft exports may include visible asset placeholders.

The same StyleSurface and format-template variables power preview and export. Exports revalidate current computed DOM styles, including offscreen slides, and fail on style violations. Never remove validation to make an export succeed; fix the composition or a contradictory pack rule instead.
