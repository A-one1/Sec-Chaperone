const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const Schema = mongoose.Schema;
mongoose.promise = Promise;

let userSchema = new Schema(
  {
    username: String,
    name: String,
    googleId: String,
    secret: String,
    deactivationDateTime: Date,
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
