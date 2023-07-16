const Event = require("../../database/models/event");
const User = require("../../database/models/user");

var UserName = "";
let messageCount = {};

module.exports = (agenda) => {
  agenda.define(
    "correspond about active events",
    { lockLifetime: 6000 },
    async (job, done) => {
      console.log("This is your current ongoing event");

      const events = await Event.find({
        nextCheckIn: { $lt: new Date(Date.now() - 2 * 60 * 1000) },
        stopChecking: false,
        isDeleted: false,
        firstMessageSent: false,
        secondMessageSent: false,
      }).populate("contacts");

      try {
        for (const event of events) {
          if (!event.firstMessageSent) {
            let count = 0;
            console.log(
              "Contact first name",
              event.contacts.firstName,
              event.contacts.lastName
            );

            var contactsNumbers = event.contacts.map((contact) => {
              return "+1" + contact.phone.replace(/-/g, "");
            });

            const result = await User.findOne({ _id: event.user }).exec();
            if (result) {
              UserName = result.name;
              console.log("Username", UserName);
            }

            const accountSid = process.env.ACCOUNT_SID;
            const authToken = process.env.AUTH_TOKEN;
            const client = require("twilio")(accountSid, authToken);

            const firstMessageBody =
              "Hello there" +
              "\n" +
              "This is Secret Chaperone contacting you on behalf of " +
              UserName +
              " .You are listed as an emergency contact by " +
              UserName +
              " .They have scheduled a " +
              event.title +
              " at location " +
              event.location +
              " scheduled for " +
              event.eventDateTime.toLocaleString() +
              "\n" +
              "This is the notes " +
              event.notes +
              "\n" +
              UserName +
              " has missed their check-in time. " +
              "We kindly request that you reach out to make sure everything is okay.";

            const secondMessageBody =
              "Hello there" +
              "\n" +
              "This is the last message you are receiving from Secret Chaperone on behalf of " +
              UserName +
              ". " +
              UserName +
              " has still not checked in for " +
              event.title +
              " at location " +
              event.location +
              " scheduled for " +
              event.eventDateTime.toLocaleString() +
              "\n" +
              "This is the notes " +
              event.notes +
              "\n" +
              "We kindly request that you reach out to make sure everything is okay.";

            const sendSecondMessage = () => {
              console.log("INSIDE SECOND MESSAGE FUNCTION");
              // Check if the event still exists before sending the second message
              Event.findById(event._id, (err, foundEvent) => {
                if (
                  foundEvent &&
                  !foundEvent.secondMessageSent &&
                  foundEvent.nextCheckIn < new Date()
                ) {
                  contactsNumbers.forEach((number) => {
                    let messageBody = secondMessageBody;
                    // console.log(messageBody);
                    count++;
                    messageCount[event._id] = count;

                    client.messages
                      .create({
                        body: messageBody,
                        from: "+18335674562",
                        to: number,
                      })
                      .then((message) => {
                        console.log(message.sid);
                        // console.log("SECOND MESSAGE SENT SUCCESSFULLY");
                        console.log(messageBody);
                        console.log("SECOND MESSAGE SENT SUCCESSFULLY ", number);
                        foundEvent.secondMessageSent = true;
                        console.log(
                          "event.secondMessageSent:",
                          foundEvent.secondMessageSent
                        );
                        messageCount[event._id] = 2;
                        event.save();
                      });
                   
                  });
                } else {
                  setTimeout(sendSecondMessage, 10 * 60 * 1000);

                  console.log(
                    "EVENT NOT FOUND or SECOND MESSAGE ALREADY SENT, skipping second message"
                  );
                }

                // done(); // Call done() to mark the job as completed
              });
            };

            contactsNumbers.forEach((number) => {
              let messageBody = firstMessageBody;
              // console.log(messageBody);
              count++;
              messageCount[event._id] = count;

              client.messages
                .create({
                  body: messageBody,
                  from: "+18335674562",
                  to: number,
                })
                .then((message) => {
                  console.log(message.sid);
                  console.log("FIRST MESSAGE SENT SUCCESSFULLY ", number);
                  console.log(messageBody);
                  event.firstMessageSent = true;
                  console.log("event.firstMessageSent:", event.firstMessageSent);
                  event.save();
    
                  setTimeout(sendSecondMessage, 10 * 60 * 1000); // Wait for 10 minutes before sending the second message
                });
        
              // setTimeout(sendSecondMessage, 10 * 60 * 1000);
            });
          } else if (event.firstMessageSent && event.secondMessageSent) {
            console.log("NO MORE SMS WILL BE SENT FOR ", event.title);
          }
        }
      } catch (error) {
        console.error(
          "Error in the correspond about active events job:",
          error
        );
      }
      done();
    }
  );

  const graceful = () => {
    console.log("Agenda stopped gracefully");
    process.exit(0);
  };

  process.on("SIGTERM", graceful);
  process.on("SIGINT", graceful);
};
