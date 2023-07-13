const Event = require("../../database/models/event");
const User = require("../../database/models/user");

var UserName = "";
let messageCount = {};

module.exports = (agenda) => {
  agenda.define("correspond about active events", (job, done) => {
    console.log("This is your current ongoing event");

    Event.find({
      nextCheckIn: { $lt: new Date(Date.now()) },
      stopChecking: false,
      isDeleted: false,
    })
      .populate("contacts")
      .exec((err, events) => {
        if (err) {
          console.log("EVENT ERROR", err);
          return done(err);
        }
        try {
          events.forEach((event) => {
            if (!messageCount[event._id]) {
              let count = 0;
              console.log(
                "Contact first name",
                event.contacts.firstName,
                event.contacts.lastName
              );

              var contactsNumbers = event.contacts.map((contact) => {
                return "+1" + contact.phone.replace(/-/g, "");
              });

              const result = User.findOne({ _id: event.user }).exec(
                (err, result) => {
                  if (result) {
                    UserName = result.name;
                    console.log("Username", UserName);
                  }
                }
              );

              const accountSid = process.env.ACCOUNT_SID;
              const authToken = process.env.AUTH_TOKEN;
              const client = require("twilio")(accountSid, authToken);

              const firstMessageBody =
                "FIRST MESSAGE FIRST MESSAGE Hello there" +
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
                "We kindly request that you reach out to make sure everything is okay.";

              const secondMessageBody =
                "SECOND MESSAGE SECOND MESSAGE Hello there" +
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
                "We kindly request that you reach out to make sure everything is okay.";

              const sendSecondMessage = () => {
               console.log('INSIDE SECOND MESSAGE FUNCTION')
                // Check if the event still exists before sending the second message
                Event.findById(event._id, (err, foundEvent) => {
                  if (err) {
                    console.log("ERROR", err);
                    return done(err);
                  }else{
                    console.log('SECOND EVENT FOUND')

                  }
                  console.log('NEXT CHECKIN TIME IS ',foundEvent?.nextCheckIn)


                  if (foundEvent && foundEvent.nextCheckIn < new Date()) {
                    contactsNumbers.forEach((number) => {
                      let messageBody = secondMessageBody;
                      console.log(messageBody);
                      count++;
                      messageCount[event._id] = count;
                      job.save();

                      // client.messages
                      //   .create({
                      //     body: messageBody,
                      //     from: "+18335674562",
                      //     to: number,
                      //   })
                      //   .then((message) => {
                      //     console.log(message.sid);
                      //     console.log("SECOND MESSAGE SENT SUCCESSFULLY");
                      //   });
                      // console.log(messageBody);
                      console.log("SECOND MESSAGE SENT SUCCESSFULLY");
                      messageCount[event._id] = 2;
                    });
                  }else{
                    console.log("EVENT NOT FOUND, rerunning for second message")
                    setTimeout(sendSecondMessage,5*1000)
                  }

                  done();
                });
              };

              contactsNumbers.forEach((number) => {
                let messageBody = firstMessageBody;
                // console.log(messageBody);
                count++;
                messageCount[event._id] = count;
                job.save();

                // client.messages
                //   .create({
                //     body: messageBody,
                //     from: "+18335674562",
                //     to: number,
                //   })
                //   .then((message) => {
                //     console.log(message.sid);
                //     console.log("FIRST MESSAGE SENT SUCCESSFULLY");
                //     setTimeout(sendSecondMessage, 10 * 60 * 1000); // Wait for 10 minutes before sending the second message
                //   });
                console.log(messageBody);
                console.log("FIRST MESSAGE SENT SUCCESSFULLY");
                setTimeout(sendSecondMessage, 1 * 10 * 1000);
              });
            } else if (messageCount[event._id] === 2) {
              console.log("NO MORE SMS WILL BE SENT FOR ",event.title);
            }
          });
          done();
        } catch (error) {
          console.error(
            "Error in the correspond about active events job:",
            error
          );
          done(error);
        }
      });
  });
  const graceful = () => {
    agenda.stop(() => {
      console.log("Agenda stopped gracefully");
      process.exit(0);
    });
  };

  process.on("SIGTERM", graceful);
  process.on("SIGINT", graceful);
};
