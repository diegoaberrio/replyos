import { getDashboardSummaryService } from "./dashboard.service.js";

export async function getDashboardSummaryController(req, res, next) {
  try {
    const data = await getDashboardSummaryService();

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
}