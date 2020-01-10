const Sequelize = require("sequelize");
const db = require("../config/database");

//bcrypt
const bcrypt = require("bcrypt");

const alimentUser = db.define(
  "alimentUser",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    freezeTableName: true
  }
);

//hash and store password in database
alimentUser.beforeCreate(async alimentUser => {
  const salt = await bcrypt.genSalt(10);
  alimentUser.password = await bcrypt.hash(alimentUser.password, salt);
});

//compare hashed password with password
alimentUser.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

alimentUser
  .sync({ force: false, alter: false })
  .then(() =>
    console.log(
      "users table has been successfully created, if one doesn't exist"
    )
  )
  .catch(error => console.log("This error occured", error));

module.exports = alimentUser;
