# Content contract

Each publication lives at content/YYYY/MM/week-XX/slug/ with post.json, caption.md, Post.tsx, post.module.css and assets/. Resolve dates with calendarFromDate: days 1–7 → 01, 8–14 → 02, 15–21 → 03, 22–end → 04. Match metadata.calendar and id to the folder. Date discrepancies are warnings, never automatic moves.

The maintained schema is src/schemas/post.ts. Minimal example:

```json
{
  "id": "post-slug",
  "title": "Post title",
  "platform": ["instagram"],
  "status": "draft",
  "calendar": { "year": 2026, "month": 9, "week": 3 },
  "publishDate": "2026-09-21",
  "campaign": "education",
  "categories": ["education"],
  "formats": ["portrait", "square", "story"],
  "slides": [{ "id": "cover", "order": 1, "label": "Cover" }],
  "published": { "instagram": null },
  "requiredAssets": [],
  "copy": { "headline": "Your headline" }
}
```

Platforms: instagram, facebook, linkedin, other. Status progression: idea → draft → ready → published. Publishing is manual. Optional publication records use `{ "date": "2026-09-21", "url": "https://…" }`; URL may be omitted. publishDate may be null. Additional root metadata is retained. Keep layouts out of JSON.

Slides have unique IDs and positive unique order values. Sort with orderedSlides; values need not be contiguous. Every slide must be implemented in every format. The sorted narrative maps to contiguous export numbers 01, 02, 03.

Post.tsx default-exports a component accepting PostProps: format, slideId, metadata, postKey. The studio supplies SocialCanvas and Slide; do not nest another canvas inside the post. Use the example as an API reference, not a design template.

Asset slots use `{ "id": "dashboard-screenshot", "type": "image", "status": "missing", "description": "Screenshot needed", "optional": false }`. Provided assets add source: `assets/filename.png` or `/assets/screenshots/filename.png`. Render AssetSlot with id, label, description, aspectRatio, metadata, postKey. Upload filenames include a content hash to prevent stale caching. Existence checks, not just stored status, determine missing assets. Old uploads remain for Git review; clean them manually if desired.
