const mongoose = require("mongoose");

const Schema = mongoose.Schema;
mongoose.promise = Promise;

let eventSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    contacts: [{ type: Schema.Types.ObjectId, ref: "Contact" }],
    title: String,
    location: String,
    notes: String,
    eventDateTime: Date,
    eventStartMessageDispatched: Boolean,
    nextCheckIn: Date,
    checkInMessageDispatched: Boolean,
    stopChecking: Boolean,
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "events",
  }
);

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
