const express = require("express");
const router = express.Router();
const path = require("path");
const passport = require("passport");

//users, calendar
const { users, calendar, nutrition } = require("../config/database");

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
        return users
          .findOne({ where: { username: req.body.username } })
          .then((users) => {
            if (users) {
              return Promise.reject("Username already exists");
            }
            return true;
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
        return Promise.reject("Password confirmation does not match password");
      }
      // Indicates the success of this synchronous custom validator
      return true;
    }),
  ],
  (req, res) => {
    const { username, password } = req.body;
    //errors from sign up validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    users
      .create({
        username,
        password,
      })
      .then(() => {
        res.json({ success: true });
      });
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
        return users
          .findOne({ where: { username: req.body.username } })
          .then((users) => {
            if (!users) {
              return Promise.reject("Username does not exists");
            }
            return true;
          });
      }),
    check("password")
      .not()
      .isEmpty()
      .withMessage("Password is required")
      .custom((value, { req }) => {
        return users
          .findOne({ where: { username: req.body.username } })
          .then(async (users) => {
            if (users && !(await users.validPassword(value))) {
              return Promise.reject("Password is incorrect");
            }
            return true;
          });
      }),
  ],
  passport.authenticate("local"),
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

router.get("/home", checkAuthenticated.checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname + "/../public/home.html"));
});

router.post("/home", async (req, res) => {
  const { date, calories, food } = req.body;
  const userId = req.user.id;
  //search db for data, update existing data
  const data = await calendar.findOne({ where: { userId, date } });
  if (data) {
    await nutrition.update(
      { calories: Math.floor(calories), food },
      { where: { id: data.dataValues.nutritionId } }
    );
    res.json({ success: true });
  } else {
    nutrition
      .create({
        calories: Math.floor(calories),
        food,
      })
      .then((data) => {
        const nutritionId = data.id;
        return calendar.create({
          date,
          userId,
          nutritionId,
        });
      })
      .then(() => res.json({ success: true }))
      .catch((err) => console.log(err));
  }
});

router.get(
  "/intake",
  checkAuthenticated.checkAuthenticated,
  async (req, res) => {
    const userId = req.user.id;
    //query db for data, send data to client for display
    const data = await calendar.findOne({
      where: { userId, date: req.query.date },
    });
    if (!data) {
      res.json({ msg: "no data for this date" });
    } else {
      const nutritionData = await nutrition.findOne({
        where: { id: data.dataValues.nutritionId },
      });
      res.json({
        calories: nutritionData.dataValues.calories,
        food: nutritionData.dataValues.food,
      });
    }
  }
);

router.delete("/logout", (req, res) => {
  req.logOut();
  res.send(status(200));
});

module.exports = router;
