import type { ContentStyleRules } from "../schema";
export const rules = {
  gradients: false,
  dropShadows: false,
  emojis: false,
  roundedCards: false,
  maxFontFamilies: 1,
  maxAccentColors: 1,
  logoPlacement: ["header-start", "footer-start"],
  allowedTextAlignments: ["left", "start", "center"],
  allowedImageTreatments: ["contain"],
  allowedMotifs: ["outline", "geometry", "paper-fold", "form", "checklist"],
} satisfies ContentStyleRules;
