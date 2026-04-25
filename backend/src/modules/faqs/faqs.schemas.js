import { z } from "zod";

export const createFaqSchema = z.object({
  question: z.string().trim().min(3, "La pregunta es obligatoria"),
  answer: z.string().trim().min(3, "La respuesta es obligatoria"),
  sort_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true)
});

export const updateFaqSchema = createFaqSchema;