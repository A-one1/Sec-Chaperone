require("dotenv").config();

const http = require("http");
var proxy = require("express-http-proxy");
const express = require("express");
const mongoose = require("./database");
const session = require("express-session");
const mongoDbStore = require("connect-mongo");
const passport = require("./passport");
const agenda = require("./agenda");
const cors = require("cors");
const bodyParser = require("body-parser");

//import routes
var authRoutes = require("./routes/auth");
var contactRoutes = require("./routes/contact");
var eventRoutes = require("./routes/event");

//environment variables
const PORT = process.env.PORT || 443;
const HOST = process.env.HOST || "0.0.0.0";

//app
const app = express();

//session
app.use(
  session({
    secret: "abcdef",
    resave: false,
    saveUninitialized: false,
    store: mongoDbStore.create({ mongoUrl: process.env.MONGO_SESSIONS_URI }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("session"));

//middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.use("/", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


//route middleware
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/event", eventRoutes);

//Forward to web app
app.use("/", proxy("http://127.0.0.1:3000"));

http.createServer(app).listen(PORT, HOST, () => {
  console.log(`Server listening on ${PORT}`);
});
