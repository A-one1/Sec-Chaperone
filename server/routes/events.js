const { ObjectId } = require("bson");
const express = require("express");
const { ensureAuthenticated } = require("../auth");
const Event = require("../database/models/event");

var router = express.Router();

router.get("/", ensureAuthenticated, (req, res) => {
  Event.find({ userId: ObjectId(req.user.id) }).exec((err, events) => {
    res.send(events);
  });
});

router.post("/new", ensureAuthenticated, (req, res) => {
  if (req.body.firstName == "" || req.body.firstName == null) {
    res.status(400).send({ error: "firstName is empty or missing!" });
  } else if (req.body.lastName == "" || req.body.lastName == null) {
    res.status(400).send({ error: "lastName is empty or missing!" });
  } else if (req.body.phoneNumber != "" || req.body.phoneNumber == null) {
    res.status(400).send({ error: "phoneNumber is empty or missing!" });
  } else {
    const contact = new Contact({
      userId: ObjectId(req.user.id),
      firstName: "steve",
      lastName: "harrington",
      phoneNumber: "+15857836576",
    });

    contact.save().then((contact) => {
      res.status = 201;
      res.send(contact);
    });
  }
});

router.put("/:id", ensureAuthenticated, (req, res) => {
  Contact.findOne({ _id: ObjectId(req.params.id) }).exec((err, contact) => {
    if (req.body.firstName == "" || req.body.firstName == null) {
      res.status(400).send({ error: "firstName is empty or missing!" });
    } else if (req.body.lastName == "" || req.body.lastName == null) {
      res.status(400).send({ error: "lastName is empty or missing!" });
    } else if (req.body.phoneNumber != "" || req.body.phoneNumber == null) {
      res.status(400).send({ error: "phoneNumber is empty or missing!" });
    } else {
      contact.firstName = firstname;
      contact.lastName = lastName;
      contact.phoneNumber = phoneNumber;

      contact.save().then((contact) => {
        res.status = 202;
        res.send(contact);
      });
    }
  });
});

module.exports = router;
