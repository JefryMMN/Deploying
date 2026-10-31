// ─────────────────────────────────────────────────────────
// server.js — Main entry point for TechFest 2026 Backend
// ─────────────────────────────────────────────────────────
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Middleware imports
const logger = require("./middleware/logger");
const { notFound, errorHandler } = require("./middleware/errorHandler");

// Route imports
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const registrationRoutes = require("./routes/registrations");

const app = express();
const PORT = process.env.PORT || 5000;

// ────────── Global Middleware ──────────
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(logger); // Log every request

// ────────── View Engine (EJS) ──────────
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ────────── Root Route ──────────
app.get("/", (req, res) => {
  const dbState = mongoose.connection.readyState;
  let dbStatus = "Disconnected";
  if (dbState === 1) dbStatus = "Connected";
  else if (dbState === 2) dbStatus = "Connecting";
  else if (dbState === 3) dbStatus = "Disconnecting";
  
  const dbHost = mongoose.connection.host || "N/A";
  
  res.render("index", { 
    title: "TechFest 2026 API",
    dbStatus: `${dbStatus} (${dbHost})`
  });
});

// ────────── Health Check ──────────
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ────────── API Routes ──────────
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

// ────────── Error-Handling Middleware ──────────
app.use(notFound); // 404 for unknown routes
app.use(errorHandler); // Central error handler

// ────────── Database Connection & Server Start ──────────
async function startServer() {
  let mongoUri = process.env.MONGO_URI;

  // If local MongoDB is not reachable, use in-memory server
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log("✅  Connected to MongoDB (local)");
  } catch (localErr) {
    console.log("⚠️  Local MongoDB not available, starting in-memory server...");
    const { MongoMemoryServer } = require("mongodb-memory-server");
    const mongod = await MongoMemoryServer.create();
    mongoUri = mongod.getUri();
    await mongoose.connect(mongoUri);
    console.log("✅  Connected to MongoDB (in-memory)");
  }

  app.listen(PORT, () => {
    console.log(`🚀  Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("❌  Failed to start server:", err.message);
  process.exit(1);
});
