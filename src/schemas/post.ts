import { z } from "zod";
import { getContentStyle } from "../../content-styles/loader";
import { styleIdSchema } from "../../content-styles/schema";
export const registeredStyleSchema = styleIdSchema.refine((id) => {
  try {
    getContentStyle(id);
    return true;
  } catch {
    return false;
  }
}, "Unknown Content Style. Register it in content-styles/loader.ts.");
import { calendarFromDate } from "../lib/content/formats";
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(100);
export const platformSchema = z.enum([
  "instagram",
  "facebook",
  "linkedin",
  "other",
]);
export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((v) => {
    try {
      calendarFromDate(v);
      return true;
    } catch {
      return false;
    }
  }, "Invalid date");
export const assetSchema = z.object({
  id: slugSchema,
  type: z.literal("image"),
  status: z.enum(["missing", "provided"]),
  description: z.string().max(1000),
  optional: z.boolean().default(false),
  source: z
    .string()
    .regex(
      /^(?:assets\/[a-zA-Z0-9][a-zA-Z0-9_-]*\.(?:png|jpe?g|webp|svg)|\/assets\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9][a-zA-Z0-9_.-]*\.(?:png|jpe?g|webp|svg))$/,
    )
    .optional(),
});
export const postSchema = z
  .object({
    id: slugSchema,
    style: registeredStyleSchema,
    title: z.string().trim().min(1).max(200),
    platform: z.array(platformSchema).min(1),
    status: z.enum(["idea", "draft", "ready", "published"]),
    calendar: z.object({
      year: z.number().int().min(2000).max(9999),
      month: z.number().int().min(1).max(12),
      week: z.number().int().min(1).max(4),
    }),
    publishDate: dateSchema.nullable().default(null),
    campaign: z.string().max(100).default(""),
    categories: z.array(z.string().min(1).max(100)).default([]),
    formats: z
      .array(z.enum(["portrait", "square", "story"]))
      .length(3)
      .refine((v) => new Set(v).size === 3, "All three formats are mandatory"),
    slides: z
      .array(
        z.object({
          id: slugSchema,
          order: z.number().int().positive(),
          label: z.string().max(100),
        }),
      )
      .min(1)
      .max(30)
      .refine(
        (v) =>
          new Set(v.map((s) => s.id)).size === v.length &&
          new Set(v.map((s) => s.order)).size === v.length,
        "Slide IDs and order must be unique",
      ),
    published: z
      .partialRecord(
        platformSchema,
        z
          .object({
            date: dateSchema,
            url: z
              .url()
              .refine((v) => /^https?:\/\//.test(v), "Use an HTTP(S) URL")
              .optional(),
          })
          .nullable(),
      )
      .default({}),
    requiredAssets: z
      .array(assetSchema)
      .default([])
      .refine(
        (v) => new Set(v.map((a) => a.id)).size === v.length,
        "Asset IDs must be unique",
      ),
    copy: z.record(z.string().max(100), z.string().max(10000)).default({}),
  })
  .passthrough();
export type PostMetadata = z.infer<typeof postSchema>;
export const updateSchema = z.object({
  metadata: postSchema.optional(),
  caption: z.string().max(100000).optional(),
  revision: z.string().length(64),
});
export const createSchema = z.object({
  style: registeredStyleSchema,
  title: z.string().trim().min(1).max(200),
  id: slugSchema,
  date: dateSchema,
});
