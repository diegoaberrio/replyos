import { AppError } from "../../common/errors/app-error.js";
import { createFaqSchema, updateFaqSchema } from "./faqs.schemas.js";
import {
  listFaqsService,
  getFaqByIdService,
  createFaqService,
  updateFaqService,
  deleteFaqService
} from "./faqs.service.js";

function formatZodError(error) {
  return error.issues.map(issue => ({
    field: issue.path.join("."),
    message: issue.message
  }));
}

export async function listFaqsController(req, res, next) {
  try {
    const items = await listFaqsService();

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

export async function getFaqByIdController(req, res, next) {
  try {
    const item = await getFaqByIdService(req.params.id);

    return res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
}

export async function createFaqController(req, res, next) {
  try {
    const parsed = createFaqSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError("Datos inválidos para FAQ", 400, "VALIDATION_ERROR", formatZodError(parsed.error));
    }

    const item = await createFaqService(parsed.data);

    return res.status(201).json({
      success: true,
      data: item,
      message: "FAQ created successfully"
    });
  } catch (error) {
    next(error);
  }
}

export async function updateFaqController(req, res, next) {
  try {
    const parsed = updateFaqSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError("Datos inválidos para FAQ", 400, "VALIDATION_ERROR", formatZodError(parsed.error));
    }

    const item = await updateFaqService(req.params.id, parsed.data);

    return res.status(200).json({
      success: true,
      data: item,
      message: "FAQ updated successfully"
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteFaqController(req, res, next) {
  try {
    await deleteFaqService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "FAQ deleted successfully"
    });
  } catch (error) {
    next(error);
  }
}