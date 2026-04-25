import { z } from "zod";

export const upsertBusinessProfileSchema = z.object({
  business_name: z.string().trim().min(2, "El nombre del negocio es obligatorio"),
  legal_name: z.string().trim().optional().or(z.literal("")),
  business_email: z.email("Email inválido").optional().or(z.literal("")),
  business_phone: z.string().trim().optional().or(z.literal("")),
  website_url: z.url("URL inválida").optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),
  address_line: z.string().trim().optional().or(z.literal("")),
  city: z.string().trim().optional().or(z.literal("")),
  region: z.string().trim().optional().or(z.literal("")),
  country: z.string().trim().optional().or(z.literal("")),
  postal_code: z.string().trim().optional().or(z.literal("")),
  attention_zones: z.string().trim().optional().or(z.literal("")),
  business_hours: z.string().trim().optional().or(z.literal("")),
  primary_contact_name: z.string().trim().optional().or(z.literal("")),
  primary_contact_email: z.email("Email de contacto inválido").optional().or(z.literal("")),
  primary_contact_phone: z.string().trim().optional().or(z.literal(""))
});