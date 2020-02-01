const express = require("express");
const router = express.Router();
const path = require("path");
const passport = require("passport");

//users
const user = require("../models/alimentModels");

//express-validator
const { body, check, validationResult } = require("express-validator");

//access passport config auth
const checkAuthenticated = require("../config/passport-config");
const checkNotAuthenticated = require("../config/passport-config");

router.get("/calendar", (req, res) => {
  res.sendFile(path.join(__dirname + "/../public/calendar.html"));
});

router.get("/userCalendar", (req, res) => {
  res.sendFile(path.join(__dirname + "/../public/userCalendar.html"));
});

module.exports = router;
