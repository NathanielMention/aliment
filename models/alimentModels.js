const sequelize = require('sequelize');
const db = require('../config/database');

const alimentUser = db.define('alimentUser', {
	id: {
		type: Sequilize.STRING
	},	
	username: {
		type: Sequilize.STRING
	},
	password: {
		type: Sequilize.STRING
	},
	calories: {
		type: Sequilize.STRING
	},
	time: {
		type: Sequilize.STRING
	}
})

module.exports = alimentUser;