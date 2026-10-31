// ─────────────────────────────────────────────────────────
// models/Event.js — Event schema (name, category, fee, seats, date)
// ─────────────────────────────────────────────────────────
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    fee: {
      type: Number,
      required: [true, "Fee is required"],
      min: [0, "Fee cannot be negative"],
    },
    seats: {
      type: Number,
      required: [true, "Number of seats is required"],
      min: [0, "Seats cannot be negative"],
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
