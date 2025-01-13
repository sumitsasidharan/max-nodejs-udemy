const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  mongo_url: process.env.MONGODB_URL,
  port: process.env.PORT,
};
