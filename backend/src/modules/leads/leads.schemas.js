import { z } from "zod";

export const createLeadSchema = z.object({
  full_name: z.string().trim().min(2, "El nombre es obligatorio").optional().or(z.literal("")),
  email: z.email("Email inválido").optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  company_name: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal(""))
}).refine(
  (data) => Boolean((data.email && data.email.trim()) || (data.phone && data.phone.trim())),
  {
    message: "Debes enviar al menos email o teléfono",
    path: ["email"]
  }
);