const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const Schema = mongoose.Schema;
mongoose.promise = Promise;

let userSchema = new Schema(
  {
    googleId: String,
    username: String,
    email: String,
    name: String,
    secret: String,
    deactivationDateTime: Date,
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = mongoose.model("User", userSchema);
module.exports = User;
