const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  MONGODB_URI: process.env.MONGODB_URL,
  PORT: process.env.PORT,
  SESSION_SECRET: process.env.SESSION_SECRET,
};
