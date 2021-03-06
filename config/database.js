const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const config = require("./config");

const db = new Sequelize(
  config.production.database,
  config.production.username,
  config.production.password,
  {
    host: config.production.host,
    dialect: "postgres",
    logging: false,
    operatorsAliases: false,
    pool: {
      connectionString: process.env.DATABASE_URL,
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const users = db.define("users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

//hash and store password in database
users.beforeCreate(async (users) => {
  const salt = await bcrypt.genSalt(10);
  users.password = await bcrypt.hash(users.password, salt);
});

//compare hashed password with password
users.prototype.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const calendar = db.define("calendar", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING(9999),
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: "users",
      key: "userId",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    allowNull: false,
  },
  nutritionId: {
    type: DataTypes.INTEGER,
    references: {
      model: "nutrition",
      key: "nutritionId",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    allowNull: false,
  },
});

const nutrition = db.define("nutrition", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  calories: {
    type: DataTypes.INTEGER,
  },
  food: {
    type: DataTypes.STRING(9999),
  },
});

const user_sessions = db.define("user_sessions", {
  sid: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  expires: {
    type: DataTypes.DATE,
  },
  data: {
    type: DataTypes.TEXT,
  },
});

calendar.belongsTo(users, { foreignKey: "userId" });
calendar.belongsTo(nutrition, { foreignKey: "nutritionId" });

users.belongsToMany(nutrition, { through: calendar, foreignKey: "userId" });

nutrition.belongsToMany(users, {
  through: calendar,
  foreignKey: "nutritionId",
});

module.exports = {
  db,
  users,
  calendar,
  nutrition,
  user_sessions,
};
