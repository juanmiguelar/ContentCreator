import { getContentStyle } from "./loader";
import type { ContentStyle } from "./schema";

export function containsEmoji(value: string): boolean {
  // Text-default symbols such as ↔ and © are only emoji with VS16.
  return /\p{Emoji_Presentation}|\p{Extended_Pictographic}\uFE0F|[0-9#*]\uFE0F?\u20E3/u.test(value);
}

function normalizedColor(value: string): string {
  if (/^#[\da-f]{6}$/i.test(value)) return value.toLowerCase();
  const rgb = value.match(
    /^rgba?\(\s*(\d+)[, ]+\s*(\d+)[, ]+\s*(\d+)(?:[, /]+([\d.]+))?\s*\)$/,
  );
  if (rgb) {
    if (rgb[4] && +rgb[4] === 0) return "transparent";
    return (
      "#" +
      rgb
        .slice(1, 4)
        .map((n) => (+n).toString(16).padStart(2, "0"))
        .join("")
    );
  }
  return value;
}
function family(value: string) {
  return value.toLowerCase().replace(/["'\s]/g, "");
}
/** Checks authored DOM/CSS. Raster/SVG image internals remain reference-review material. */
export function inspectContentStyle(
  root: HTMLElement,
  style: ContentStyle,
): string[] {
  const issues = new Set<string>(),
    fonts = new Set<string>();
  const palette = new Set(
    Object.values(style.tokens.colors).map(normalizedColor),
  );
  const allowedFonts = new Set(
    [
      style.tokens.typography.bodyFamily,
      style.tokens.typography.labelFamily,
    ].map(family),
  );
  const add = (message: string) => issues.add(message);
  const colors = (css: CSSStyleDeclaration, hasText: boolean, svg: boolean) => {
    const values = [css.backgroundColor];
    if (hasText) values.push(css.color);
    for (const side of ["Top", "Right", "Bottom", "Left"]) {
      if (
        parseFloat(css.getPropertyValue(`border-${side.toLowerCase()}-width`)) >
          0 &&
        css.getPropertyValue(`border-${side.toLowerCase()}-style`) !== "none"
      )
        values.push(css.getPropertyValue(`border-${side.toLowerCase()}-color`));
    }
    if (svg) values.push(css.fill, css.stroke);
    for (const value of values) {
      const normalized = normalizedColor(value);
      if (
        normalized &&
        !["none", "transparent"].includes(normalized) &&
        !palette.has(normalized)
      )
        add(`Color ${value} is outside the selected style palette.`);
    }
  };
  function check(css: CSSStyleDeclaration, hasText: boolean, svg: boolean) {
    if (!style.rules.gradients && /gradient\(/i.test(css.backgroundImage))
      add("Gradients are not allowed.");
    if (
      !style.rules.dropShadows &&
      (css.boxShadow !== "none" ||
        css.textShadow !== "none" ||
        /drop-shadow\(/i.test(css.filter))
    )
      add("Drop shadows are not allowed.");
    if (
      !style.rules.roundedCards &&
      !svg &&
      [
        css.borderTopLeftRadius,
        css.borderTopRightRadius,
        css.borderBottomLeftRadius,
        css.borderBottomRightRadius,
      ].some((v) => parseFloat(v) > 0)
    )
      add("Rounded cards are not allowed.");
    if (hasText) {
      const font = family(css.fontFamily);
      fonts.add(font);
      if (!allowedFonts.has(font))
        add(`Font family ${css.fontFamily} is not a style token.`);
      if (
        !style.rules.allowedTextAlignments.includes(
          css.textAlign as ContentStyle["rules"]["allowedTextAlignments"][number],
        )
      )
        add(`Text alignment ${css.textAlign} is not allowed.`);
    }
    colors(css, hasText, svg);
  }
  for (const element of [
    root,
    ...Array.from(root.querySelectorAll<HTMLElement | SVGElement>("*")),
  ]) {
    const css = getComputedStyle(element);
    if (css.display === "none") continue;
    const hasText = [...element.childNodes].some(
      (n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim(),
    );
    const graphic =
      element instanceof SVGElement &&
      [
        "path",
        "rect",
        "circle",
        "polygon",
        "polyline",
        "line",
        "ellipse",
        "text",
      ].includes(element.tagName);
    check(css, hasText, graphic);
    if (
      hasText &&
      !style.rules.emojis &&
      containsEmoji(
        [...element.childNodes]
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .map((n) => n.textContent)
          .join(""),
      )
    )
      add("Emojis are not allowed.");
    for (const pseudo of ["::before", "::after"]) {
      const pseudoCss = getComputedStyle(element, pseudo);
      if (
        !["none", "normal"].includes(pseudoCss.content) &&
        pseudoCss.display !== "none"
      )
        check(pseudoCss, pseudoCss.content !== '""', false);
    }
    if (
      element instanceof HTMLImageElement &&
      !style.rules.allowedImageTreatments.includes(
        css.objectFit as "contain" | "cover",
      )
    )
      add(`Image treatment ${css.objectFit} is not allowed.`);
    const placement = element.getAttribute("data-logo-placement");
    if (
      placement &&
      !style.rules.logoPlacement.includes(
        placement as ContentStyle["rules"]["logoPlacement"][number],
      )
    )
      add(`Logo placement ${placement} is not allowed.`);
    const motif = element.getAttribute("data-content-motif");
    if (motif && !style.rules.allowedMotifs.includes(motif))
      add(`Motif ${motif} is not allowed.`);
  }
  if (fonts.size > style.rules.maxFontFamilies)
    add(`More than ${style.rules.maxFontFamilies} font families are used.`);
  // Only one named accent exists in this schema; all other colors must be palette tokens.
  return [...issues];
}
export function validateStyledCanvas(canvas: HTMLElement) {
  const surface = canvas.querySelector<HTMLElement>("[data-content-style]");
  if (!surface) throw new Error("Canvas has no explicit Content Style.");
  const style = getContentStyle(surface.dataset.contentStyle!);
  const issues = inspectContentStyle(surface, style);
  if (issues.length)
    throw new Error(`Content Style ${style.id}: ${issues.join(" ")}`);
  return style;
}
