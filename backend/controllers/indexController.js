// controllers/indexController.js

const { body, validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const CustomNotFoundError = require("../errors/CustomNotFoundError");
const { prisma } = require("./lib/prisma");

const getIndex = async (req, res) => {
  res.render("index", { title: "Mini Messageboard"});
};


module.exports = { getIndex };
