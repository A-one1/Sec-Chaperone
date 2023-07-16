const { ObjectId } = require("bson");
const express = require("express");
const { ensureAuthenticated } = require("../auth");
const { mapReduce } = require("../database/models/event");
const Event = require("../database/models/event");
const Contact = require("../database/models/contact");
const { DateTime } = require("luxon");

var router = express.Router();

router.get("/", ensureAuthenticated, (req, res) => {
  Event.find({
    user: ObjectId(req.user.id),
    stopChecking: false,
    isDeleted: false,
  })
    .sort({ eventDateTime: "asc" })
    .populate("contacts")
    .exec((err, events) => {
      res.send(events);
    });
});
router.get("/allevents", ensureAuthenticated, (req, res) => {
  Event.find({
    user: ObjectId(req.user.id),
    isDeleted: false,
  })
    .sort({ eventDateTime: "asc" })
    .populate("contacts")
    .exec((err, events) => {
      res.send(events);
    });
});

router.get("/:id", ensureAuthenticated, (req, res) => {
  Event.findOne({
    _id: ObjectId(req.params.id),
    user: ObjectId(req.user.id),
    // stopChecking: false,
    // isDeleted: false,
  })
    .populate("contacts")
    .exec((err, event) => {
      if (event != undefined) {
        res.send(event);
      } else {
        res.status(404).send({ error: "Not Found" });
      }
    });
});

router.post("/new", ensureAuthenticated, (req, res) => {
  if (req.body.title == "" || req.body.title == null) {
    res.status(400).send({ error: "title is empty or missing!" });
  } else if (req.body.location == "" || req.body.location == null) {
    res.status(400).send({ error: "location is empty or missing!" });
  } else if (req.body.notes == null) {
    res.status(400).send({ error: "notes is missing!" });
  } else if (
    req.body.eventDateTime == null ||
    isNaN(Date.parse(req.body.eventDateTime))
    // ||DateTime.fromISO(req.body.eventDateTime) < DateTime.now()
  ) {
    res.status(400).send({
      error: "eventDateTime is missing or could not be parsed or too early!",
    });
  } else if (
    !req.body.contacts.reduce(async (contactsExist, id) => {
      let res = await Contact.find({
        _id: ObjectId(id),
        user: ObjectId(req.user.id),
        isDeleted: false,
      });

      return contactsExist && res.length == true;
    }, true)
  ) {
    res.status(400).send({
      error: "contacts is missing or one or more contacts could not be found!",
    });
  } else {
    const event = new Event({
      user: ObjectId(req.user.id),
      contacts: req.body.contacts.map((x) => ObjectId(x)),
      title: req.body.title,
      location: req.body.location,
      notes: req.body.notes === undefined ? "" : req.body.notes,
      eventDateTime: req.body.eventDateTime,
      eventStartMessageDispatched: false,
      nextCheckIn: req.body.eventDateTime,
      checkInMessageDispatched: false,
      stopChecking: false,
      isDeleted: false,
      
    });

    event.save().then((event) => {
      res.status = 201;
      res.send(event);
    });
  }
});

router.post("/:id/checkin", ensureAuthenticated, (req, res) => {
  Event.findOne({
    _id: ObjectId(req.params.id),
    user: ObjectId(req.user.id),
    stopChecking: false,
    isDeleted: false,
  }).exec((err, event) => {
    if (req.body.stopChecking == null) {
      res.status(400).send({ error: "stopChecking is missing!" });
    } else if (req.body.notes == null) {
      res.status(400).send({ error: "notes is missing!" });
    } else {
      if (event != undefined) {

        const checkInInterval= req.body.checkInInterval || 10;
        // if (DateTime.fromJSDate(event.nextCheckIn) <= DateTime.now()) {
        if (DateTime.fromJSDate(event.eventDateTime) <= DateTime.now()) {
          event.stopChecking = req.body.stopChecking;
          event.notes = req.body.notes === undefined ? "" : req.body.notes;
          event.nextCheckIn = DateTime.now().plus({ minutes: checkInInterval }).toISO();
          event.firstMessageSent=false;
          event.secondMessageSent=false;

          event.save().then((event) => {
            res.status = 200;
            res.send({ status: "Event checked in!" });
          });
        } else {
          console.log("eventttt", event);
          res.status(400).send({ error: "It's too early for check-in" });
        }
      } else {
        res.status(404).send({ error: "Not Found" });
      }
    }
  });
});

router.put("/:id", ensureAuthenticated, (req, res) => {
  Event.findOne({
    _id: ObjectId(req.params.id),
    user: ObjectId(req.user.id),
    // stopChecking: false,
    isDeleted: false,
  }).exec((err, event) => {
    if (req.body.title == "" || req.body.title == null) {
      res.status(400).send({ error: "title is empty or missing!" });
    } else if (req.body.location == "" || req.body.location == null) {
      res.status(400).send({ error: "location is empty or missing!" });
    } else if (req.body.notes == null) {
      res.status(400).send({ error: "notes is missing!" });
    } else if (
      req.body.eventDateTime == null ||
      isNaN(Date.parse(req.body.eventDateTime))
      // ||DateTime.fromISO(req.body.eventDateTime) < DateTime.now()
    ) {
      res.status(400).send({
        error:
          "eventDateTime is missing or could not be parsed or is too early!",
      });
    } else if (
      !req.body.contacts.reduce(async (contactsExist, id) => {
        let res = await Contact.find({
          _id: ObjectId(id),
          user: ObjectId(req.user.id),
          isDeleted: false,
        });

        return contactsExist && res.length == true;
      }, true)
    ) {
      res.status(400).send({
        error:
          "contacts is missing or one or more contacts could not be found!",
      });
    } else {
      if (event != undefined) {
        event.contacts = req.body.contacts.map((x) => ObjectId(x));
        event.title = req.body.title;
        event.location = req.body.location;
        event.notes = req.body.notes === undefined ? "" : req.body.notes;
        event.eventDateTime = req.body.eventDateTime;

        if (new Date(req.body.eventDateTime) > new Date()) {
          event.stopChecking = false;
          event.nextCheckIn = req.body.eventDateTime;
          firstMessageSent=false;
          secondMessageSent=false;
        }

        event.save().then((event) => {
          res.status = 202;
          res.send(event);
        });
      } else {
        res.status(404).send({ error: "Not Found" });
      }
    }
  });
});

router.delete("/:id", ensureAuthenticated, (req, res) => {
  Event.findOne({
    user: ObjectId(req.user.id),
    _id: ObjectId(req.params.id),
    isDeleted: false,
  }).exec((err, event) => {
    if (event != undefined) {
      event.isDeleted = true;

      event.save().then((event) => {
        res.status(200).send({ status: "OK" });
      });
    } else {
      res.status(404).send({ error: "Not Found" });
    }
  });
});

module.exports = router;
