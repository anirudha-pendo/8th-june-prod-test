import { z } from "zod";

export const noteCreateSchema = z.object({
  title: z.string().trim().min(1).max(120),
  content: z.unknown().optional(),
  text: z.string().max(20000).optional().default(""),
});

export const noteUpdateSchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    content: z.unknown().optional(),
    text: z.string().max(20000).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one note field is required.",
  });

export const settingsUpdateSchema = z
  .object({
    name: z.string().trim().min(2).max(80).optional(),
    image: z
      .string()
      .trim()
      .url()
      .or(z.literal(""))
      .optional()
      .transform((value) => (value === "" ? null : value)),
    organizationName: z.string().trim().min(2).max(80).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one settings field is required.",
  });

export type SettingsUpdateInput = z.infer<typeof settingsUpdateSchema>;
