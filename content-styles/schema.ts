import { z } from "zod";

export const styleIdSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(100);
const color = z.string().regex(/^#[a-fA-F0-9]{6}$/);
const size = z.number().finite().nonnegative().max(2160);
export const spacingSchema = z.strictObject({
  unit: size.positive(),
  small: size,
  medium: size,
  large: size,
  gutter: size,
  squareGutter: size,
  storyGutter: size,
  lead: size,
  storyLead: size,
  safe: size,
});
export const typeSizesSchema = z.strictObject({
  label: size.positive(),
  small: size.positive(),
  body: size.positive(),
  storyBody: size.positive(),
  title: size.positive(),
  squareTitle: size.positive(),
  storyTitle: size.positive(),
});
export const tokensSchema = z.strictObject({
  colors: z.strictObject({
    canvas: color,
    surface: color,
    ink: color,
    muted: color,
    accent: color,
    line: color,
    inverseCanvas: color,
    inverseInk: color,
  }).catchall(color),
  typography: z.strictObject({
    bodyFamily: z.string().min(1),
    labelFamily: z.string().min(1),
    sizes: typeSizesSchema,
    titleWeight: z.number().int().min(100).max(900),
    bodyWeight: z.number().int().min(100).max(900),
    titleLineHeight: z.number().min(0.8).max(2),
    bodyLineHeight: z.number().min(1).max(2.5),
    titleTracking: z.number().min(-10).max(10),
    labelTracking: z.number().min(0).max(10),
  }),
  spacing: spacingSchema,
  sizing: z.strictObject({
    contentWidth: size.positive(),
    bodyWidth: size.positive(),
    graphicWidth: size.positive(),
    graphicHeight: size.positive(),
    icon: size.positive(),
  }),
  borders: z.strictObject({ width: size, style: z.enum(["solid", "dashed"]) }),
  radii: z.strictObject({ card: size }),
  effects: z.strictObject({
    shadowX: size, shadowY: size, shadowBlur: size, shadowSpread: size,
    shadowColor: color, shadowOpacity: z.number().min(0).max(1),
  }).optional(),
  strokes: z.strictObject({ width: size.positive() }),
  layout: z.strictObject({
    columns: z.string().regex(/^\d+(?:\.\d+)?fr \d+(?:\.\d+)?fr$/),
    imageTreatment: z.enum(["contain", "cover"]),
  }),
});
export const rulesSchema = z.strictObject({
  gradients: z.boolean(),
  dropShadows: z.boolean(),
  emojis: z.boolean(),
  roundedCards: z.boolean(),
  maxFontFamilies: z.number().int().min(1).max(2),
  maxAccentColors: z.number().int().min(0).max(1),
  logoPlacement: z.array(
    z.enum(["header-start", "header-end", "footer-start", "footer-end"]),
  ),
  allowedTextAlignments: z
    .array(z.enum(["left", "right", "center", "start", "end", "justify"]))
    .min(1),
  allowedImageTreatments: z.array(z.enum(["contain", "cover"])).min(1),
  allowedMotifs: z.array(z.string().min(1)),
});
export const templateSchema = z.strictObject({
  layout: z.enum(["editorial", "split", "stack"]),
  paddingX: spacingSchema.keyof(),
  paddingTop: spacingSchema.keyof(),
  paddingBottom: spacingSchema.keyof(),
  gap: spacingSchema.keyof(),
  leadSpace: spacingSchema.keyof(),
  titleSize: typeSizesSchema.keyof(),
  bodySize: typeSizesSchema.keyof(),
  textAlign: z.enum(["left", "right", "center", "start", "end", "justify"]),
});
export const assetPathSchema = z
  .string()
  .regex(
    /^(?:assets\/|\/assets\/)(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9][a-zA-Z0-9_-]*\.(?:svg|png|jpe?g|webp)$/,
  );
export const contentStyleSchema = z
  .strictObject({
    id: styleIdSchema,
    name: z.string().min(1),
    description: z.string().default(""),
    tokens: tokensSchema,
    rules: rulesSchema,
    templates: z.strictObject({
      portrait: templateSchema,
      square: templateSchema,
      story: templateSchema,
    }),
    assets: z
      .record(
        styleIdSchema,
        z.strictObject({
          source: assetPathSchema,
          alt: z.string().min(1),
          role: z.enum(["logo", "motif", "image"]),
        }),
      )
      .default({}),
  })
  .superRefine((style, context) => {
    const fail = (message: string) =>
      context.addIssue({ code: "custom", message });
    if (
      new Set([
        style.tokens.typography.bodyFamily,
        style.tokens.typography.labelFamily,
      ]).size > style.rules.maxFontFamilies
    )
      fail("Typography exceeds maxFontFamilies");
    if (!style.rules.roundedCards && style.tokens.radii.card !== 0)
      fail("Card radius contradicts roundedCards=false");
    if (
      !style.rules.allowedImageTreatments.includes(
        style.tokens.layout.imageTreatment,
      )
    )
      fail("Image treatment is forbidden by the rules");
    if (
      !style.rules.maxAccentColors &&
      ![style.tokens.colors.ink, style.tokens.colors.muted].includes(
        style.tokens.colors.accent,
      )
    )
      fail("Accent color is forbidden by maxAccentColors=0");
    for (const [format, template] of Object.entries(style.templates)) {
      if (!style.rules.allowedTextAlignments.includes(template.textAlign))
        fail(`${format} text alignment is forbidden by the rules`);
    }
  });
export type ContentStyle = z.infer<typeof contentStyleSchema>;
export type ContentStyleTokens = z.infer<typeof tokensSchema>;
export type ContentStyleRules = z.infer<typeof rulesSchema>;
export type ContentTemplate = z.infer<typeof templateSchema>;
