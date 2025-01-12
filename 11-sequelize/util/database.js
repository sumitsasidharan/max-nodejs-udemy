const Sequelize = require('sequelize');

// sumit@888 in laptop & mysql@888 in desktop
const sequelize = new Sequelize('max_node', 'root', 'sumit@888', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
