const Event = require("../../database/models/event");

module.exports = (agenda) => {
  agenda.define("correspond about active events", (job, done) => {
    Event.find({ eventDateTime: { $lte: new Date() } }).exec((err, events) => {
      for (var event in events) {
        console.log("Dispatching event" + JSON.stringify(event));
      }
    });
    done();
  });
};
