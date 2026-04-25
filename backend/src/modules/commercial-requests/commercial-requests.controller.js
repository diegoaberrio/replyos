import { AppError } from "../../common/errors/app-error.js";
import { createCommercialRequestSchema } from "./commercial-requests.schemas.js";
import {
  createCommercialRequestFromConversationService,
  listCommercialRequestsService,
  getCommercialRequestByIdService
} from "./commercial-requests.service.js";

function formatZodError(error) {
  return error.issues.map(issue => ({
    field: issue.path.join("."),
    message: issue.message
  }));
}

export async function createCommercialRequestFromConversationController(req, res, next) {
  try {
    const parsed = createCommercialRequestSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError(
        "Datos inválidos para solicitud comercial",
        400,
        "VALIDATION_ERROR",
        formatZodError(parsed.error)
      );
    }

    const item = await createCommercialRequestFromConversationService(req.params.publicIdentifier, parsed.data);

    return res.status(201).json({
      success: true,
      data: item,
      message: "Commercial request created successfully"
    });
  } catch (error) {
    next(error);
  }
}

export async function listCommercialRequestsController(req, res, next) {
  try {
    const items = await listCommercialRequestsService();

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

export async function getCommercialRequestByIdController(req, res, next) {
  try {
    const item = await getCommercialRequestByIdService(req.params.id);

    return res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
}