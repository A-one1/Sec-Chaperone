const mongoose = require("mongoose");

const Schema = mongoose.Schema;
mongoose.promise = Promise;

let contactSchema = new Schema(
  {
    user: [{ type: Schema.Types.ObjectId, ref: "User" }],
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "contacts",
  }
);

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
