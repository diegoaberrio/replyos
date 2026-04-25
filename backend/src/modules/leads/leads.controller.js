import { AppError } from "../../common/errors/app-error.js";
import { createLeadSchema } from "./leads.schemas.js";
import {
  createLeadFromConversationService,
  listLeadsService,
  getLeadByIdService
} from "./leads.service.js";

function formatZodError(error) {
  return error.issues.map(issue => ({
    field: issue.path.join("."),
    message: issue.message
  }));
}

export async function createLeadFromConversationController(req, res, next) {
  try {
    const parsed = createLeadSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError(
        "Datos inválidos para lead",
        400,
        "VALIDATION_ERROR",
        formatZodError(parsed.error)
      );
    }

    const lead = await createLeadFromConversationService(req.params.publicIdentifier, parsed.data);

    return res.status(201).json({
      success: true,
      data: lead,
      message: "Lead captured successfully"
    });
  } catch (error) {
    next(error);
  }
}

export async function listLeadsController(req, res, next) {
  try {
    const items = await listLeadsService();

    return res.status(200).json({
      success: true,
      data: {
        items,
        meta: {
          total: items.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getLeadByIdController(req, res, next) {
  try {
    const item = await getLeadByIdService(req.params.id);

    return res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
}