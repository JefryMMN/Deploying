// ─────────────────────────────────────────────────────────
// routes/registrations.js — Register for events & view registrations
// ─────────────────────────────────────────────────────────
const express = require("express");
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// ───── POST /api/registrations — Register for an event (authenticated) ─────
router.post("/", verifyToken, async (req, res, next) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res
        .status(400)
        .json({ success: false, message: "eventId is required." });
    }

    // Check event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found." });
    }

    // Check seats available
    if (event.seats <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "No seats available for this event." });
    }

    // Check if already registered
    const existing = await Registration.findOne({
      user: req.user.id,
      event: eventId,
    });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Already registered for this event." });
    }

    // Create registration and decrement seats
    const registration = await Registration.create({
      user: req.user.id,
      event: eventId,
    });

    event.seats -= 1;
    await event.save();

    res.status(201).json({
      success: true,
      message: "Registered successfully.",
      data: registration,
    });
  } catch (err) {
    next(err);
  }
});

// ───── GET /api/registrations/my — Get current user's registrations ─────
router.get("/my", verifyToken, async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate("event", "name category fee date seats")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (err) {
    next(err);
  }
});

// ───── GET /api/registrations — Get all registrations (admin) ─────
router.get("/", verifyToken, async (req, res, next) => {
  try {
    const registrations = await Registration.find()
      .populate("user", "name email")
      .populate("event", "name category date")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (err) {
    next(err);
  }
});

// ───── DELETE /api/registrations/:id — Cancel registration ─────
router.delete("/:id", verifyToken, async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res
        .status(404)
        .json({ success: false, message: "Registration not found." });
    }

    // Only the owner or an admin can cancel
    if (
      registration.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorised." });
    }

    // Restore the seat
    await Event.findByIdAndUpdate(registration.event, { $inc: { seats: 1 } });
    await Registration.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Registration cancelled." });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
