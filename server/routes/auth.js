const express = require("express");
const { ObjectId } = require("bson");
const passport = require("passport");
const { ensureAuthenticated } = require("../auth");
const User = require("../database/models/user");

var router = express.Router();

router.get("/user", ensureAuthenticated, function (req, res, next) {
  // Successful authentication, redirect secrets.
  res.status = 200;
  User.findOne({ _id: ObjectId(req.user.id) }).exec((err, result) => {
    res.send(result);
  });
});

router.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:8000" }),
  function (req, res) {
    // Successful authentication, redirect secrets.
    res.redirect("http://localhost:8000");
  }
);

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
