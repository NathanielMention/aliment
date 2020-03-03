const Sequelize = require("sequelize");
const UserModel = require("../models/user");
/*const DateModel = require("../models/date"); */
console.log("hello");
const db = new Sequelize("alimentdb", "nathanielmention", "9x9yu18xu0p", {
  host: "localhost",
  dialect: "postgres",

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
console.log("hello");
module.exports = db;
