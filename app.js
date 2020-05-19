require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const session = require("express-session");
const { users } = require("./config/database");

//overides post method so we can use app.delete
const methodOverride = require("method-override");

//access passport from config folder
const passport = require("passport");
const initializePassport = require("./config/passport-config");
initializePassport.initialize(passport, async (id) => {
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
const { db } = require("./config/database");

app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const PostgreSqlStore = require("connect-pg-simple")(session);
app.use(
  session({
    store: new PostgreSqlStore({
      conString: process.env.DATABASE_URL,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

//routes
app.use("/", aliment);

//test DB
db.authenticate()
  .then(() => console.log("Database connected.."))
  .catch((err) => console.log("Error:" + err));
db.sync().then(() => {
  console.log("synced database");
});

const port = process.env.PORT || 3000;
//listen to port
app.listen(port, () => console.log("listening on port " + port));
