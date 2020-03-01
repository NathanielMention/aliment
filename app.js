if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const session = require("express-session");
const users = require("./models/user");

//overides post method so we can use app.delete
const methodOverride = require("method-override");

//access passport from config folder
const passport = require("passport");
const initializePassport = require("./config/passport-config");
initializePassport.initialize(passport, async id => {
  try {
    const user = await users.findByPk(id);
    return user ? user : null;
  } catch (error) {
    console.log(error);
  }
});

//routes
const aliment = require("./routes/alimentRoutes");

//database
const db = require("./config/database");

app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

//test DB
db.authenticate()
  .then(() => console.log("Database connected.."))
  .catch(err => console.log("Error:" + err));

//routes
app.use("/", aliment);

db.sync({ force: true }).then(() => {
  console.log("synced database");
});

//listen to port
app.listen(3000);
console.log("You are listening to port 3000");
