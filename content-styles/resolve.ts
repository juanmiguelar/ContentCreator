import type { CSSProperties } from "react";
import type { SocialFormat } from "../src/lib/content/formats";
import type { ContentStyle } from "./schema";

export function styleVariables(
  style: ContentStyle,
  format: SocialFormat,
): CSSProperties {
  const t = style.tokens,
    f = style.templates[format];
  const vars: Record<string, string | number> = {};
  for (const [key, color] of Object.entries(t.colors))
    vars[`--content-color-${key}`] = color;
  for (const [key, value] of Object.entries(t.spacing))
    vars[`--content-space-${key}`] = `${value}px`;
  for (const [key, value] of Object.entries(t.sizing))
    vars[`--content-size-${key}`] = `${value}px`;
  const shadow = t.effects;
  Object.assign(vars, {
    "--content-shadow-card": shadow ? `${shadow.shadowX}px ${shadow.shadowY}px ${shadow.shadowBlur}px ${shadow.shadowSpread}px rgba(${parseInt(shadow.shadowColor.slice(1, 3), 16)}, ${parseInt(shadow.shadowColor.slice(3, 5), 16)}, ${parseInt(shadow.shadowColor.slice(5, 7), 16)}, ${shadow.shadowOpacity})` : "none",
    "--content-font-body": t.typography.bodyFamily,
    "--content-font-label": t.typography.labelFamily,
    "--content-title-size": `${t.typography.sizes[f.titleSize]}px`,
    "--content-body-size": `${t.typography.sizes[f.bodySize]}px`,
    "--content-small-size": `${t.typography.sizes.small}px`,
    "--content-label-size": `${t.typography.sizes.label}px`,
    "--content-title-weight": t.typography.titleWeight,
    "--content-body-weight": t.typography.bodyWeight,
    "--content-title-leading": t.typography.titleLineHeight,
    "--content-body-leading": t.typography.bodyLineHeight,
    "--content-title-tracking": `${t.typography.titleTracking}px`,
    "--content-label-tracking": `${t.typography.labelTracking}px`,
    "--content-padding-x": `${t.spacing[f.paddingX]}px`,
    "--content-padding-top": `${t.spacing[f.paddingTop]}px`,
    "--content-padding-bottom": `${t.spacing[f.paddingBottom]}px`,
    "--content-gap": `${t.spacing[f.gap]}px`,
    "--content-lead-space": `${t.spacing[f.leadSpace]}px`,
    "--content-border-width": `${t.borders.width}px`,
    "--content-border-style": t.borders.style,
    "--content-radius-card": `${t.radii.card}px`,
    "--content-stroke": t.strokes.width,
    "--content-text-align": f.textAlign,
    "--content-image-fit": t.layout.imageTreatment,
    "--content-columns": f.layout === "split" ? t.layout.columns : "1fr",
    "--content-flow": f.layout === "split" ? "row" : "column",
  });
  return vars as CSSProperties;
}
