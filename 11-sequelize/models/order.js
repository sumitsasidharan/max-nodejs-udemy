const Sequelize = require('sequelize');
const sequelize = require('../util/database');

// inbetween table for user and products
const Order = sequelize.define('order', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = Order;
