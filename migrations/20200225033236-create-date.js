"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("calendar", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        allowNull: false
      },
      date: {
        type: Sequelize.DATEONLY,
        unique: "compoundKey"
      },
      userId: {
        type: Sequelize.INTEGER,
        unique: "compoundKey",
        onDelete: "CASCADE",
        references: {
          model: "users",
          key: "id"
        },
        allowNull: false
      },
      calories: {
        type: Sequelize.INTEGER
      },
      food: {
        type: Sequelize.STRING(9999)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("calendar");
  }
};
