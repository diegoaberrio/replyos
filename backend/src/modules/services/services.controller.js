import { AppError } from "../../common/errors/app-error.js";
import { createServiceSchema, updateServiceSchema } from "./services.schemas.js";
import {
  listServicesService,
  getServiceByIdService,
  createServiceService,
  updateServiceService,
  deleteServiceService
} from "./services.service.js";

function formatZodError(error) {
  return error.issues.map(issue => ({
    field: issue.path.join("."),
    message: issue.message
  }));
}

export async function listServicesController(req, res, next) {
  try {
    const items = await listServicesService();

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

export async function getServiceByIdController(req, res, next) {
  try {
    const item = await getServiceByIdService(req.params.id);

    return res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
}

export async function createServiceController(req, res, next) {
  try {
    const parsed = createServiceSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError("Datos inválidos para servicio", 400, "VALIDATION_ERROR", formatZodError(parsed.error));
    }

    const item = await createServiceService(parsed.data);

    return res.status(201).json({
      success: true,
      data: item,
      message: "Service created successfully"
    });
  } catch (error) {
    next(error);
  }
}

export async function updateServiceController(req, res, next) {
  try {
    const parsed = updateServiceSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError("Datos inválidos para servicio", 400, "VALIDATION_ERROR", formatZodError(parsed.error));
    }

    const item = await updateServiceService(req.params.id, parsed.data);

    return res.status(200).json({
      success: true,
      data: item,
      message: "Service updated successfully"
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteServiceController(req, res, next) {
  try {
    await deleteServiceService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully"
    });
  } catch (error) {
    next(error);
  }
}