import type { ContentStyleRules } from "../schema";
export const rules = {
  gradients: false,
  dropShadows: true,
  emojis: false,
  roundedCards: true,
  maxFontFamilies: 2,
  maxAccentColors: 1,
  logoPlacement: ["header-start", "footer-start"],
  allowedTextAlignments: ["left", "start", "center"],
  allowedImageTreatments: ["contain"],
  allowedMotifs: ["outline", "geometry", "paper-fold", "form", "checklist"],
} satisfies ContentStyleRules;
