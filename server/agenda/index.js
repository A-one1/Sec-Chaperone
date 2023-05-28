const Agenda = require("agenda");

const agenda = new Agenda({ db: { address: process.env.MONGO_AGENDA_URI } });

// list the different jobs availale throughout your app
let jobTypes = ["correspondActiveEvent"];

const startup = async function () {
  console.log("Agenda is starting...");
  // IIFE to give access to async/await
  await agenda.start();

  console.log("Agenda has started");

  await agenda.every("30 seconds", "correspond about active events");
};
// loop through the job_list folder and pass in the agenda instance to
// each job so that it has access to its API.
jobTypes.forEach((type) => {
  // the type name should match the file name in the jobs_list folder
  require("./jobs_list/" + type)(agenda);
});

if (jobTypes.length) {
  // if there are jobs in the jobsTypes array set up
  agenda.on("ready", async () => {
    await startup();
  });
}

let graceful = () => {
  agenda.stop(() => process.exit(0));
};

process.on("SIGTERM", graceful);
process.on("SIGINT", graceful);

module.exports = agenda;
