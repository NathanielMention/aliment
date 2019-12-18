const Sequelize = require('sequelize');
const db = require('../config/database');

const alimentUser = db.define('alimentUser', {
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
	},
	calories: {
		type: Sequelize.DECIMAL,
		
	},
	time: {
		type: Sequelize.DATE,
		
	}
}, {
	freezeTableName: true
});

alimentUser.sync({ force: false, alter: false }).then(() => {
  return alimentUser.create({
    username: 'test',
    password: 'test',
    calories: 2000.5,
    time: 11/5/18
  });
});

module.exports = alimentUser;