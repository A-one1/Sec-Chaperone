setTimeout(async () => {
  const Agenda = require("agenda");
  const correspondActiveEvent = require("./jobs_list/correspondActiveEvent");

  const agenda = new Agenda({ db: { address: process.env.MONGO_AGENDA_URI } });

  let jobTypes = ["correspondActiveEvent", "demoJob"]; // Add "demoJob" to the job types

  const startup = async function () {
    try {
      console.log("Agenda is starting...");
      await agenda.start();
      console.log("Agenda has started");

      agenda.every("5 second", "correspond about active events"); // Schedule the "correspond about active events" job
      agenda.every("5 second", "demoJob"); // Schedule the "demoJob" every 1 second
      console.log("Jobs have been scheduled");
    } catch (error) {
      console.error("Error starting Agenda:", error);
    }
  };

  jobTypes.forEach((type) => {
    try {
      require("./jobs_list/" + type)(agenda);
    } catch (error) {
      console.error(`Error loading job type '${type}':`, error);
    }
  });

  // Add the demo job implementation
  agenda.define("demoJob", async (job) => {
    try {
      console.log("Hello from demoJob");
    } catch (error) {
      console.error("Error in the demoJob:", error);
    }
  });

  if (jobTypes.length) {
    console.log(1);

    agenda.on("ready", async () => {
      try {
        await startup();
      } catch (error) {
        console.error("Error starting Agenda:", error);
      }
    });
  }
  agenda.on("error", (error) => {
    console.error("Agenda error:", error);
  });

  
let graceful = () => {
  agenda.stop(() => process.exit(0));
};

process.on("SIGTERM", graceful);
process.on("SIGINT", graceful);


  module.exports = agenda;
}, 1000); // Delay of 5000 milliseconds (5 seconds)
