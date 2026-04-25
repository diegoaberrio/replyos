import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string().trim().min(2, "El nombre del servicio es obligatorio"),
  short_description: z.string().trim().optional().or(z.literal("")),
  detailed_description: z.string().trim().optional().or(z.literal("")),
  is_active: z.boolean().default(true)
});

export const updateServiceSchema = createServiceSchema;