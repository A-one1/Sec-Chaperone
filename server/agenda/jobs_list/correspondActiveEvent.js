const Contact = require("../../database/models/contact");
const Event = require("../../database/models/event");
const AWS = require("aws-sdk");
const { ObjectId } = require("bson");
const User = require("../../database/models/user");

// var aws_region = "us-east-2";
// var originationNumber = "+18334711072";
// var messageType = "TRANSACTIONAL";
var UserName = "";

module.exports = (agenda) => {
  agenda.define("correspond about active events", (job, done) => {
    console.log("this is your current ongoing event");
    Event.find({
      nextCheckIn: { $lt: new Date(Date.now() - 10 * 60 * 1000) },
      stopChecking: false,
      isDeleted: false,
    })
      .populate("contacts")
      .exec((err, events) => {
        if (err) {
          console.log("EVENT ERROR", err);
          return done(err);
        }
        events.forEach((event) => {
          console.log(
            "🚀 ~ file: correspondActiveEvent.js:58 ~ events.forEach ~ event:",
            event
          );

          //console.log("Dispatching event" + JSON.stringify(event));
          console.log("event contact", event.contacts);
          console.log(
            "contact first name",
            event.contacts.firstName,
            event.contacts.lastName
          );

          var contactsNumbers = event.contacts.map((contact) => {
            return "+1" + contact.phone.replace(/-/g, "");
          });
          console.log(
            "🚀 ~ file: correspondActiveEvent.js:43 ~ contactsNumbers ~ contactsNumbers:",
            contactsNumbers
          );

          const result = User.findOne({ _id: event.user }).exec(
            (err, result) => {
              if (result) {
                UserName = result.name;
                console.log("username", UserName);
              }
            }
          );

          const accountSid = process.env.ACCOUNT_SID;
          const authToken = process.env.AUTH_TOKEN;
          const client = require("twilio")(accountSid, authToken);

          setTimeout(() => {
            contactsNumbers.forEach((number) => {
              client.messages
                .create({
                  body:
                    "Hello there" +
                    "\n" +
                    "This is Secret Chaperone contacting you on behalf of " +
                    UserName +
                    ". You have been added as an emergency contact by " +
                    UserName +
                    ". They have scheduled a " +
                    event.title +
                    " at location " +
                    event.location +
                    " scheduled for " +
                    event.eventDateTime.toLocaleString() +
                    "\n" +
                    "This is the notes" +
                    event.notes +
                    "\n" +
                    +"We kindly request that you reach out to make sure everything is okay.",
                  from: "+18335674562",
                  to: number,
                })
                .then((message) => {
                  console.log(message.sid);
                  console.log("MESSAGE SENT SUCCESFULLY");
                });
            });
          }, 5000);
        });
      });
    done();
  });
};
