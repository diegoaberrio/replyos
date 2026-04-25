export function errorMiddleware(error, req, res, next) {
  console.error("[ERROR]", error);

  const status = error.statusCode || 500;
  const code = error.code || "INTERNAL_SERVER_ERROR";
  const message = error.message || "Unexpected server error";

  return res.status(status).json({
    success: false,
    error: {
      code,
      message,
      details: error.details || null
    }
  });
}