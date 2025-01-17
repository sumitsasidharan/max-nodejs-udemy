const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  MONGO_URL: process.env.MONGODB_URL,
  PORT: process.env.PORT,
  SESSION_SECRET: process.env.SESSION_SECRET,
};
