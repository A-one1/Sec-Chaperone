const Contact = require("../../database/models/contact");
const Event = require("../../database/models/event");
const messagebird = require("messagebird")("tgSpMc7ooH3ZtXex6WAJeDA6l");

module.exports = (agenda) => {
  agenda.define("correspond about active events", (job, done) => {
    Event.find({
      nextCheckIn: { $lte: new Date(new Date() - 15 * 60000) },
      stopChecking: false,
      isDeleted: false,
    }).populate("contacts").exec((err, events) => {
      events.forEach(async (event) => {
        console.log("Dispatching event" + JSON.stringify(event));

        console.log(event.contacts)
        var contactsNumbers = event.contacts.map((contact) => {return ("1"+contact.phone.replaceAll("-", ""))})
        

        var params = {
          originator: "12029339986",
          recipients: contactsNumbers,
          body: "Hey this is Secret Chaperone letting you know that blank is in trouble.",
        };

        messagebird.messages.create(params, function (err, response) {
          if (err) {
            return console.log(err);
          }
          console.log(response);
        });
      });
    });
    done();
  });
};
