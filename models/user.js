const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/database");
//bcrypt
const bcrypt = require("bcrypt");

const users = db.define("users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});
//hash and store password in database
users.beforeCreate(async users => {
  const salt = await bcrypt.genSalt(10);
  users.password = await bcrypt.hash(users.password, salt);
});
//compare hashed password with password
users.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};
users.associate = models => {
  users.hasMany(models.dates),
    {
      onDelete: "cascade"
    };
  return users;
};

module.exports = users;
