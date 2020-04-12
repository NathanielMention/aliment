"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("nutrition", {
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
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("nutrition");
  }
};
