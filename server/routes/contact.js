const { ObjectId } = require("bson");
const express = require("express");
const { ensureAuthenticated } = require("../auth");
const Contact = require("../database/models/contact");

var router = express.Router();

router.get("/", ensureAuthenticated, (req, res) => {
  Contact.find({ user: ObjectId(req.user.id), isDeleted: false })
    .sort({ lastName: "asc", firstName: "asc" })
    .exec((err, contacts) => {
      res.send(contacts);
    });
});

router.get("/:id", ensureAuthenticated, (req, res) => {
  Contact.findOne({
    user: ObjectId(req.user.id),
    _id: ObjectId(req.params.id),
    isDeleted: false,
  }).exec((err, contact) => {
    if (contact != undefined) {
      res.send(contact);
    } else {
      res.status(404).send({ error: "Not Found" });
    }
  });
});

router.post("/new", ensureAuthenticated, (req, res) => {
  if (req.body.firstName == "" || req.body.firstName == null) {
    res.status(400).send({ error: "firstName is empty or missing!" });
  } else if (req.body.lastName == "" || req.body.lastName == null) {
    res.status(400).send({ error: "lastName is empty or missing!" });
  } else if (req.body.phone == "" || req.body.phone == null) {
    res.status(400).send({ error: "phone is empty or missing!" });
  } else if (req.body.email == "" || req.body.email == null) {
    res.status(400).send({ error: "email is empty or missing!" });
  } else {
    const contact = new Contact({
      user: ObjectId(req.user.id),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
    });

    contact.save().then((contact) => {
      res.status = 201;
      res.send(contact);
    });
  }
});

router.put("/:id", ensureAuthenticated, (req, res) => {
  Contact.findOne({
    user: ObjectId(req.user.id),
    _id: ObjectId(req.params.id),
    isDeleted: false,
  }).exec((err, contact) => {
    if (req.body.firstName == "" || req.body.firstName == null) {
      res.status(400).send({ error: "firstName is empty or missing!" });
    } else if (req.body.lastName == "" || req.body.lastName == null) {
      res.status(400).send({ error: "lastName is empty or missing!" });
    } else if (req.body.phone == "" || req.body.phone == null) {
      res.status(400).send({ error: "phone is empty or missing!" });
    } else if (req.body.email == "" || req.body.email == null) {
      res.status(400).send({ error: "email is empty or missing!" });
    } else {
      if (contact != undefined) {
        contact.firstName = req.body.firstName;
        contact.lastName = req.body.lastName;
        contact.phone = req.body.phone;
        contact.email = req.body.email;

        contact.save().then((contact) => {
          res.status = 202;
          res.send(contact);
        });
      } else {
        res.status(404).send({ error: "Not Found" });
      }
    }
  });
});

router.delete("/:id", ensureAuthenticated, (req, res) => {
  Contact.findOne({
    user: ObjectId(req.user.id),
    _id: ObjectId(req.params.id),
    isDeleted: false,
  }).exec((err, contact) => {
    if (contact != undefined) {
      contact.isDeleted = true;

      contact.save().then((contact) => {
        res.status = 200;
        res.send({ status: "OK" });
      });
    } else {
      res.status(404).send({ error: "Not Found" });
    }
  });
});

module.exports = router;
