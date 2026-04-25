import { z } from "zod";

export const createCommercialRequestSchema = z.object({
  request_type: z.enum(["contact_request", "call", "meeting", "visit"]),
  preferred_date: z.string().trim().optional().or(z.literal("")),
  preferred_time: z.string().trim().optional().or(z.literal("")),
  preferred_time_range: z.string().trim().optional().or(z.literal("")),
  details: z.string().trim().optional().or(z.literal(""))
});

export const updateCommercialRequestStatusSchema = z.object({
  request_status: z.enum(["pending", "confirmed", "completed", "cancelled", "rejected"])
});