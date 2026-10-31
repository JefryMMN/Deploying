// ─────────────────────────────────────────────────────────
// middleware/errorHandler.js — Central error-handling middleware
// ─────────────────────────────────────────────────────────

// 404 — Route not found
const notFound = (req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found." });
};

// Central error handler (keeps the server from crashing)
const errorHandler = (err, req, res, next) => {
  console.error("ERROR >>>", err.stack || err.message);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res
      .status(400)
      .json({ success: false, message: messages.join(", ") });
  }

  // Mongoose duplicate-key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(", ");
    return res
      .status(400)
      .json({ success: false, message: `Duplicate value for: ${field}` });
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID format." });
  }

  res
    .status(err.statusCode || 500)
    .json({ success: false, message: err.message || "Internal server error." });
};

module.exports = { notFound, errorHandler };
