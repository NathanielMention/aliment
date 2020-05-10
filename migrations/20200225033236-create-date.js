"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("calendar", {
      date: {
        type: DataTypes.STRING(9999),
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "userId",
        },
        unique: "compoundKey",
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
        unique: "compoundKey",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        allowNull: false,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("calendar");
  },
};
