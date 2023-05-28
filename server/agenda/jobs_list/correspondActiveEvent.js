const Contact = require("../../database/models/contact");
const Event = require("../../database/models/event");
const AWS = require("aws-sdk");

var aws_region = "us-east-1";
var originationNumber = "+12065550199";
var messageType = "TRANSACTIONAL";

module.exports = (agenda) => {
  agenda.define("correspond about active events", (job, done) => {
    Event.find({
      nextCheckIn: { $lte: new Date(new Date() - 15 * 60000) },
      stopChecking: false,
      isDeleted: false,
    })
      .populate("contacts")
      .exec((err, events) => {
        events.forEach(async (event) => {
          console.log("Dispatching event" + JSON.stringify(event));

          console.log(event.contacts);
          var contactsNumbers = event.contacts.map((contact) => {
            return "+1" + contact.phone.replaceAll("-", "");
          });

          /**************************************** */

          var params = {
            originator: "12029339986",
            recipients: contactsNumbers,
            body: "Hey this is Secret Chaperone letting you know that blank is in trouble.",
          };

          // The AWS Region that you want to use to send the message. For a list of
          // AWS Regions where the Amazon Pinpoint API is available, see
          // https://docs.aws.amazon.com/pinpoint/latest/apireference/.
          var aws_region = "us-east-1";

          // The content of the SMS message.
          var message =
            "Hey this is Secret Chaperone letting you know that blank" +
            " is in trouble. Reply STOP to opt out.";

          // The Amazon Pinpoint project/application ID to use when you send this message.
          // Make sure that the SMS channel is enabled for the project or application
          // that you choose.
          var applicationId = "4bd3a5db837a469182f399661731173f";

          // The registered keyword associated with the originating short code.
          var registeredKeyword = "KEYWORD_847941559988";

          // The sender ID to use when sending the message. Support for sender ID
          // varies by country or region. For more information, see
          // https://docs.aws.amazon.com/pinpoint/latest/userguide/channels-sms-countries.html
          var senderId = "SecChapTest";

          // Specify that you're using a shared credentials file, and optionally specify
          // the profile that you want to use.
          var credentials = new AWS.SharedIniFileCredentials({
            profile: "default",
          });
          AWS.config.credentials = credentials;

          // Specify the region.
          AWS.config.update({ region: aws_region });

          //Create a new Pinpoint object.
          var pinpoint = new AWS.Pinpoint();

          for (const destinationNumber in contactsNumbers) {
            // Specify the parameters to pass to the API.
            var params = {
              ApplicationId: applicationId,
              MessageRequest: {
                Addresses: {
                  [destinationNumber]: {
                    ChannelType: "SMS",
                  },
                },
                MessageConfiguration: {
                  SMSMessage: {
                    Body: message,
                    Keyword: registeredKeyword,
                    MessageType: messageType,
                    OriginationNumber: originationNumber,
                    SenderId: senderId,
                  },
                },
              },
            };

            //Try to send the message.
            pinpoint.sendMessages(params, function (err, data) {
              // If something goes wrong, print an error message.
              if (err) {
                console.log(err.message);
                // Otherwise, show the unique ID for the message.
              } else {
                console.log(
                  "Message sent! " +
                    data["MessageResponse"]["Result"][destinationNumber][
                      "StatusMessage"
                    ]
                );
              }
            });
          }
        });
      });
  });
  done();
};
