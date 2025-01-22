const express = require('express');
const bodyParser = require('body-parser');

const { PORT, MONGODB_URI } = require('./config');

const feedRoutes = require('./routes/feed');

const app = express();

// bodyParser.urlencoded() is for form data
// to parse incoming json data
app.use(bodyParser.json()); // application/json

// setting CORS and other headers, to avoid CORS errors
app.use((req, res, next) => {
  // res.setHeader('Access-Control-Allow-Origin', 'domain.com');
  res.setHeader('Access-Control-Allow-Origin', '*'); // allow incoming reqests from all domains
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
