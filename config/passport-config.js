const LocalStrategy = require("passport-local").Strategy;
const { users } = require("./database");
function initialize(passport, getUserById) {
  const authenticateUser = async (username, password, done) => {
    users.findOne({ where: { username } }).then(async user => {
      if (!user) {
        return done(null, false);
      }
      try {
        //compare password with password stored in database
        if (await user.validPassword(password)) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (e) {
        return done(e);
      }
    });
  };
  passport.use(
    new LocalStrategy(
      { usernameField: "username", passwordField: "password" },
      authenticateUser
    )
  );
  //creates session for user and stores id into cookie
  passport.serializeUser((user, done) => done(null, user.id));
  //get user from session with id
  passport.deserializeUser(async (id, done) => {
    const user = await getUserById(id);
    return done(null, await getUserById(id));
  });
}
//if user is not auth redirect them to login
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
//checks if user is auth redirects to home
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/home");
  }
  next();
}
module.exports = {
  initialize: initialize,
  checkAuthenticated: checkAuthenticated,
  checkNotAuthenticated: checkNotAuthenticated
};
