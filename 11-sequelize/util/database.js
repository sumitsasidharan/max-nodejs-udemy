const Sequelize = require('sequelize');

const sequelize = new Sequelize('max_node', 'root', 'mysql@888', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;