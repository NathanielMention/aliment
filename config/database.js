const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

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

const calendar = db.define("calendar", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: false,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY
  },
  userId: {
    type: DataTypes.INTEGER,
    onDelete: "CASCADE",
    allowNull: false
  },
  calories: {
    type: DataTypes.INTEGER
  },
  food: {
    type: DataTypes.STRING
  }
});

users.hasMany(calendar);
calendar.belongsTo(users, { foreignKey: "userId" });

module.exports = {
  db,
  users,
  calendar
};
