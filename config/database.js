const Sequelize = require('sequelize');

module.exports = new Sequelize('alimentdb', 'nathanielmention', '9x9yu18xu0p', {
  host: 'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
