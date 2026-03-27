// app.js
require("dotenv").config();

const { prisma } = require("./lib/prisma");
const express = require("express");
const passport = require("passport");
const configurePassport = require("./config/passport");
const errorHandler = require("./errors/errorHandler");
const cors = require('cors');
const http = require("http");


// Import Routers
const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");
const usersRouter = require("./routes/usersRouter");
const postsRouter = require("./routes/postsRouter");
const commentsRouter = require("./routes/commentsRouter");
const likesRouter = require("./routes/likesRouter");
const followRouter = require("./routes/followRouter");
const uploadRouter = require("./routes/uploadRouter");


// app setup
const app = express();




// If deployed behind a proxy (Render, Heroku, Railway)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}


// ----- Passport configuration -----
configurePassport(passport, prisma);


// ----- Express middleware -----
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());


// ------- Routers -------
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/posts/:id/like", likesRouter);
app.use("/comments", commentsRouter);
app.use("/follow", followRouter);
app.use("/upload", uploadRouter);


// ------- Error handler -------
app.use(errorHandler);



// ---- Starting the server -----
const server = http.createServer(app);

// ---- Start server ----
if (process.env.NODE_ENV !== "test") {
  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = { app, server };