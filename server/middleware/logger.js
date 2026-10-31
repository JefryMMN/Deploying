// ─────────────────────────────────────────────────────────
// middleware/logger.js — Logs every incoming request
// ─────────────────────────────────────────────────────────
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}]  ${req.method}  ${req.originalUrl}`);
  next();
};

module.exports = logger;
