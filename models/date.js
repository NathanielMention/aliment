const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/database");
console.log(db);
const dates = db.define("dates", {
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
    references: {
      model: "dates",
      key: "id"
    },
    allowNull: false
  },
  calories: {
    type: DataTypes.INTEGER
  },
  food: {
    type: DataTypes.STRING
  }
});

dates.associate = models => {
  dates.belongsTo(models.users, { foreignKey: "userId" });
  return dates;
};

module.exports = dates;
