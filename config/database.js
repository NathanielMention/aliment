const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const config = require("./config");

const db = new Sequelize(
  config.production.database,
  config.production.username,
  config.production.password,
  {
    host: "localhost",
    dialect: "postgres",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

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
  date: {
    type: DataTypes.DATEONLY,
    primaryKey: true,
    unique: "compoundKey"
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: "users",
      key: "userId"
    },
    unique: "compoundKey",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    allowNull: false
  },
  nutritionId: {
    type: DataTypes.INTEGER,
    references: {
      model: "nutrition",
      key: "nutritionId"
    },
    unique: "compoundKey",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    allowNull: false
  }
});

const nutrition = db.define("nutrition", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  calories: {
    type: DataTypes.INTEGER
  },
  food: {
    type: DataTypes.STRING(9999)
  }
});

calendar.belongsTo(users, { foreignKey: "userId" });
calendar.belongsTo(nutrition, { foreignKey: "nutritionId" });

users.belongsToMany(nutrition, { through: calendar, foreignKey: "userId" });

nutrition.belongsToMany(users, {
  through: calendar,
  foreignKey: "nutritionId"
});
//users.hasMany(calendar);
//calendar.belongsTo(users, { foreignKey: "userId" });

module.exports = {
  db,
  users,
  calendar,
  nutrition
};
