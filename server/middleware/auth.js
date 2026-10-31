// ─────────────────────────────────────────────────────────
// middleware/auth.js — JWT verification middleware
// ─────────────────────────────────────────────────────────
const jwt = require("jsonwebtoken");

// Verify that the request has a valid JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization; // "Bearer <token>"

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, iat, exp }
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token." });
  }
};

// Allow only admin users
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Admin access required." });
  }
  next();
};

module.exports = { verifyToken, isAdmin };
