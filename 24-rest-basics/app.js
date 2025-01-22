const express = require('express');
const app = express();

const { PORT, MONGODB_URI } = require('./config');

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
