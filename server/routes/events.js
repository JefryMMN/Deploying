// ─────────────────────────────────────────────────────────
// routes/events.js — CRUD endpoints for events
// ─────────────────────────────────────────────────────────
const express = require("express");
const Event = require("../models/Event");
const { verifyToken, isAdmin } = require("../middleware/auth");

const router = express.Router();

// ───── GET /api/events — Get all events (public) ─────
router.get("/", async (req, res, next) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (err) {
    next(err);
  }
});

// ───── GET /api/events/:id — Get single event (public) ─────
router.get("/:id", async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found." });
    }
    res.status(200).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
});

// ───── POST /api/events — Create event (admin only) ─────
router.post("/", verifyToken, isAdmin, async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, message: "Event created.", data: event });
  } catch (err) {
    next(err);
  }
});

// ───── PUT /api/events/:id — Update event (admin only) ─────
router.put("/:id", verifyToken, isAdmin, async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found." });
    }
    res.status(200).json({ success: true, message: "Event updated.", data: event });
  } catch (err) {
    next(err);
  }
});

// ───── DELETE /api/events/:id — Delete event (admin only) ─────
router.delete("/:id", verifyToken, isAdmin, async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found." });
    }
    res.status(200).json({ success: true, message: "Event deleted." });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
