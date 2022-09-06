require("dotenv").config();

const http = require("http");
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

//environment variables
const PORT = process.env.PORT || 443;
const HOST = process.env.HOST || "0.0.0.0";

//app
const app = express();

//session
app.use(
  session({
    secret: process.env.APP_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoDbStore.create({ mongoUrl: process.env.MONGO_SESSIONS_URI }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("session"));

//middleware
app.use(cors());
app.use(bodyParser.json());

//route middleware
app.use("/auth", authRoutes);
app.use("/contact", contactRoutes);

http.createServer(app).listen(PORT, HOST, () => {
  console.log(`Server listening on ${PORT}`);
});
