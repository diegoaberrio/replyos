import { z } from "zod";

export const createConversationSchema = z.object({
  visitor_name: z.string().trim().optional().or(z.literal("")),
  visitor_email: z.email("Email inválido").optional().or(z.literal("")),
  visitor_phone: z.string().trim().optional().or(z.literal(""))
});

export const sendMessageSchema = z.object({
  message_text: z.string().trim().min(1, "El mensaje es obligatorio").max(2000, "El mensaje es demasiado largo")
});