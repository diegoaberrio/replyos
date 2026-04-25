import { z } from "zod";

export const upsertAgentSettingsSchema = z.object({
  commercial_goal: z.enum(["contact_request", "call", "meeting", "visit"]),
  tone_style: z.string().trim().optional().or(z.literal("")),
  general_instructions: z.string().trim().optional().or(z.literal("")),
  welcome_message: z.string().trim().optional().or(z.literal("")),
  fallback_message: z.string().trim().optional().or(z.literal("")),
  is_active: z.boolean().default(true)
});