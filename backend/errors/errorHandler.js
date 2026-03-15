const { sendError } = require("../utils/response");

function errorHandler(err, req, res, next) {
  console.error(err); // log the error for debugging

  // If the error already has a status, use it; otherwise default to 500
  const status = err.status || 500;

  // Optional: handle known Prisma errors or validation errors here
  let message = err.message || "Internal Server Error";

  // Example: Prisma unique constraint violation
  if (err.code === "P2002") {
    message = "Duplicate entry detected";
  }

  // Example: Prisma not found error
  if (err.code === "P2025") {
    message = "Record not found";
  }

  return sendError(res, message, status);
}

module.exports = errorHandler;