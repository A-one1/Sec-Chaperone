const mongoose = require("mongoose");

const Schema = mongoose.Schema;
mongoose.promise = Promise;

let contactSchema = new Schema(
  {
    userId: [{ type: Schema.Types.ObjectId, ref: "Contact" }],
    firstName: String,
    lastName: String,
    phoneNumber: String,
  },
  {
    timestamps: true,
    collection: "contacts",
  }
);

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
