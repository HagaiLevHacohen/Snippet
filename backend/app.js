// app.js
require("dotenv").config();

const { prisma } = require("./lib/prisma");
const express = require("express");
const passport = require("passport");
const configurePassport = require("./config/passport");
const errorHandler = require("./errors/errorHandler");
const cors = require('cors');


// Import Routers
const indexRouter = require("./routes/indexRouter");


// app setup
const app = express();
app.use(cors());



// If deployed behind a proxy (Render, Heroku, Railway)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}


// ----- Passport configuration -----
configurePassport(passport, prisma);


// ----- Express middleware -----
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());


// ------- Routers -------
app.use("/", indexRouter);

// ------- Error handler -------
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})