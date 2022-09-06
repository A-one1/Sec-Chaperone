const mongoose = require("mongoose");

const Schema = mongoose.Schema;
mongoose.promise = Promise;

let eventSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    contactId: [{ type: Schema.Types.ObjectId, ref: "Contact" }],
    title: String,
    description: String,
    address: String,
    eventDateTime: Date,
    eventStartMessageDispatched: Boolean,
    nextCheckIn: Date,
    checkInMessageDispatched: Boolean,
    stopChecking: Boolean,
  },
  {
    timestamps: true,
    collection: "events",
  }
);

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
