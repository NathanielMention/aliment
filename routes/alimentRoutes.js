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

router.get("/", checkAuthenticated.checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname + "/../public/index.html"));
});

router.get(
  "/signup",
  checkNotAuthenticated.checkNotAuthenticated,
  (req, res) => {
    res.sendFile(path.join(__dirname + "/../public/signup.html"));
  }
);

router.post(
  "/signup",
  [
    //server side signup validation
    check("username")
      .not()
      .isEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters")
      .trim()
      .isAlphanumeric()
      .withMessage("Username must have letters or numbers and no spaces")
      .custom((value, { req }) => {
        return user
          .findOne({ where: { username: req.body.username } })
          .then(user => {
            if (user) {
              return Promise.reject("Username already exists");
            }
          });
      }),

    check("password")
      .not()
      .isEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
      .matches(/\d/)
      .withMessage("Password must have at least 1 number"),

    check("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }

      // Indicates the success of this synchronous custom validator
      return true;
    })
  ],
  checkNotAuthenticated.checkNotAuthenticated,
  (req, res) => {
    const { username, password } = req.body;

    //errors from sign up validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    user
      .create({
        username,
        password
      })
      .then(() => {
        res.json({ success: true });
      })
      .catch(err => console.log(err));
  }
);

router.get(
  "/login",
  checkNotAuthenticated.checkNotAuthenticated,
  (req, res) => {
    res.sendFile(path.join(__dirname + "/../public/login.html"));
  }
);

router.post(
  "/login",
  [
    //server side login validation
    check("username")
      .not()
      .isEmpty()
      .withMessage("Username is required")
      .custom((value, { req }) => {
        return user
          .findOne({ where: { username: req.body.username } })
          .then(user => {
            if (!user) {
              return Promise.reject("Username does not exists");
            }
          });
      }),

    check("password")
      .not()
      .isEmpty()
      .withMessage("Password is required")
      .custom((value, { req }) => {
        return user
          .findOne({ where: { username: req.body.username } })
          .then(async user => {
            if (user && !(await user.validPassword(value))) {
              return Promise.reject("Password is incorrect");
            }
          });
      })
  ],
  checkNotAuthenticated.checkNotAuthenticated,
  passport.authenticate("local", { session: true }),
  (req, res) => {
    //errors from login validation
    const loginErrors = validationResult(req);

    if (!loginErrors.isEmpty()) {
      return res.status(422).json({ loginErrors: loginErrors.array() });
    } else {
      res.json({ success: true });
    }
  }
);

router.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname + "/../public/home.html"));
});

router.delete("/logout", (req, res) => {
  console.log(req.user, "LOGOUT REQ USERRRRRR!!!!!!!!!");
  req.logOut();
  res.json({ success: true });
  console.log("BACKENDTESTSSS");
});

module.exports = router;
